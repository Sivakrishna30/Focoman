"use server";

import { randomBytes, randomUUID } from "crypto";
import {
  CreateOrderSchema,
  AssignResourceSchema,
  UpdateTaskStatusSchema,
  UpdatePaymentSchema,
} from "@focoman/validation";
import { canCompleteOrder, generateWorkflowTasks } from "@focoman/domain";
import {
  getOrdersByStudio,
  getOrderById,
  getOrderByPasskey,
  saveOrder,
  updateOrder,
  getTasksByOrder,
  saveTasks,
  updateTask,
  saveCustomer,
} from "@focoman/db";
import { Order, Task, OrderStatus, TaskStatus, PaymentStatus } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";

/**
 * Server Actions for Order Lifecycle & Post-Event Production Pipeline
 * CHG-010: All mutating actions now enforce:
 *   1. requireVerifiedUser — Firebase ID token verification
 *   2. requireStudioMember — active studio membership check
 * IDs use crypto.randomUUID() / crypto.randomBytes() — collision-safe.
 * Errors are thrown, not swallowed.
 */

export async function createOrderAction(rawInput: unknown): Promise<{
  success: boolean;
  order?: Order;
  tasks?: Task[];
  error?: string;
}> {
  try {
    const validated = CreateOrderSchema.parse(rawInput);

    // Authorization: verify identity and studio membership
    const decoded = await requireVerifiedUser((validated as any).idToken);
    await requireStudioMember(decoded.uid, validated.studioId);

    // Cryptographically safe IDs
    const orderId = `ORD-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const passkey = `FOC-${randomBytes(4).toString('hex').toUpperCase()}`;
    const customerId = `CUS-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    const remainingAmount = Math.max(0, validated.finalConfirmedPrice - validated.advanceAmount);
    const initialPaymentStatus: PaymentStatus =
      validated.advanceAmount >= validated.finalConfirmedPrice && validated.finalConfirmedPrice > 0
        ? "PAYMENT_COMPLETED"
        : validated.advanceAmount > 0
        ? "PAYMENT_CONFIRMATION_REQUIRED"
        : "PAYMENT_PENDING";

    const newOrder: Order = {
      id: orderId,
      studioId: validated.studioId.toLowerCase(),
      orderNumber: orderId,
      customer: {
        id: customerId,
        name: validated.customerName,
        phone: validated.customerPhone,
      },
      eventType: validated.eventType,
      eventDate: validated.eventDate,
      eventLocation: validated.eventLocation,
      services: validated.services,
      packages: validated.packages || [],
      pricing: {
        estimatedPrice: validated.estimatedPrice,
        finalConfirmedPrice: validated.finalConfirmedPrice,
        advanceAmount: validated.advanceAmount,
        remainingAmount,
      },
      paymentStatus: initialPaymentStatus,
      orderStatus: "AWAITING_EVENT",
      assignedResources: [],
      trackingPasskey: passkey,
      createdAt: now,
      updatedAt: now,
    };

    // Save Customer Profile
    await saveCustomer({
      id: customerId,
      studioId: validated.studioId.toLowerCase(),
      name: validated.customerName,
      phone: validated.customerPhone,
      email: validated.customerEmail || undefined,
      address: validated.eventLocation,
      createdAt: now,
      updatedAt: now,
    });

    // Generate dynamic post-event workflow tasks based on selected services
    const generatedTaskBlueprints = generateWorkflowTasks(orderId, validated.studioId, validated.services);
    const tasksToSave: Task[] = generatedTaskBlueprints.map((t, idx) => ({
      ...t,
      id: `TSK-${orderId}-${idx + 1}`,
      createdAt: now,
      updatedAt: now,
    }));

    await saveOrder(newOrder);
    await saveTasks(tasksToSave);

    return { success: true, order: newOrder, tasks: tasksToSave };
  } catch (err: any) {
    console.error("[createOrderAction] Error:", err);
    return {
      success: false,
      error: err.errors?.[0]?.message || err.message || "Failed to create order",
    };
  }
}

export async function getStudioOrdersAction(
  studioSlug: string,
  idToken: string
): Promise<Order[]> {
  // Authorization: verified identity required even for read
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  // Errors propagate — no silent [] fallback
  return await getOrdersByStudio(studioSlug);
}

export async function getOrderTasksAction(orderId: string, idToken: string): Promise<Task[]> {
  // Token verification for tasks read — orderId alone is not a public access
  await requireVerifiedUser(idToken);
  // Errors propagate — no silent [] fallback
  return await getTasksByOrder(orderId);
}

/**
 * Public endpoint — customer-facing order tracking by passkey.
 * No authentication required.
 */
export async function getOrderByPasskeyAction(passkey: string): Promise<{
  success: boolean;
  order?: Order;
  tasks?: Task[];
  error?: string;
}> {
  try {
    if (!passkey || passkey.trim().length === 0) {
      return { success: false, error: "Please enter a valid tracking passkey or order ID." };
    }

    const order = await getOrderByPasskey(passkey);
    if (!order) {
      const byId = await getOrderById(passkey.trim().toUpperCase());
      if (byId) {
        const tasks = await getTasksByOrder(byId.id);
        return { success: true, order: byId, tasks };
      }
      return {
        success: false,
        error: `No confirmed order found matching "${passkey}". Please double check your passkey.`,
      };
    }

    const tasks = await getTasksByOrder(order.id);
    return { success: true, order, tasks };
  } catch (err: any) {
    console.error("[getOrderByPasskeyAction] Error:", err);
    return { success: false, error: err.message || "Failed to retrieve order." };
  }
}

export async function updateTaskStatusAction(rawInput: unknown): Promise<{
  success: boolean;
  task?: Task;
  newOrderStatus?: OrderStatus;
  error?: string;
}> {
  try {
    const validated = UpdateTaskStatusSchema.parse(rawInput);

    // Authorization
    const decoded = await requireVerifiedUser((validated as any).idToken);
    await requireStudioMember(decoded.uid, (validated as any).studioId);

    const updatedTask = await updateTask(validated.taskId, {
      status: validated.status as TaskStatus,
      reworkNotes: validated.reworkNotes,
    });

    if (!updatedTask) {
      return { success: false, error: "Task not found" };
    }

    const order = await getOrderById(validated.orderId);
    let newOrderStatus: OrderStatus | undefined = undefined;

    if (order) {
      const allTasks = await getTasksByOrder(validated.orderId);
      const isCompletable = canCompleteOrder(order.paymentStatus, allTasks);

      if (isCompletable && order.orderStatus !== "COMPLETED") {
        await updateOrder(validated.orderId, { orderStatus: "COMPLETED" });
        newOrderStatus = "COMPLETED";
      } else if (!isCompletable && order.orderStatus === "AWAITING_EVENT") {
        const hasStarted = allTasks.some((t) => t.status !== "ASSIGNED");
        if (hasStarted) {
          await updateOrder(validated.orderId, { orderStatus: "POST_EVENT_IN_PROGRESS" });
          newOrderStatus = "POST_EVENT_IN_PROGRESS";
        }
      }
    }

    return { success: true, task: updatedTask, newOrderStatus };
  } catch (err: any) {
    console.error("[updateTaskStatusAction] Error:", err);
    return {
      success: false,
      error: err.errors?.[0]?.message || err.message || "Failed to update task",
    };
  }
}

export async function updatePaymentStatusAction(rawInput: unknown): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  try {
    const validated = UpdatePaymentSchema.parse(rawInput);

    // Authorization
    const decoded = await requireVerifiedUser((validated as any).idToken);
    await requireStudioMember(decoded.uid, (validated as any).studioId);

    const existing = await getOrderById(validated.orderId);
    if (!existing) return { success: false, error: "Order not found" };

    const updates: Partial<Order> = {
      paymentStatus: validated.paymentStatus as PaymentStatus,
    };

    if (validated.advanceAmount !== undefined) {
      const remainingAmount = Math.max(0, existing.pricing.finalConfirmedPrice - validated.advanceAmount);
      updates.pricing = {
        ...existing.pricing,
        advanceAmount: validated.advanceAmount,
        remainingAmount,
      };
    }

    const allTasks = await getTasksByOrder(validated.orderId);
    const isCompletable = canCompleteOrder(validated.paymentStatus, allTasks);
    if (isCompletable) {
      updates.orderStatus = "COMPLETED";
    }

    const updated = await updateOrder(validated.orderId, updates);
    return { success: true, order: updated || undefined };
  } catch (err: any) {
    console.error("[updatePaymentStatusAction] Error:", err);
    return {
      success: false,
      error: err.errors?.[0]?.message || err.message || "Failed to update payment",
    };
  }
}

export async function assignResourceAction(rawInput: unknown): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  try {
    const validated = AssignResourceSchema.parse(rawInput);

    // Authorization
    const decoded = await requireVerifiedUser((validated as any).idToken);
    await requireStudioMember(decoded.uid, (validated as any).studioId);

    const existing = await getOrderById(validated.orderId);
    if (!existing) return { success: false, error: "Order not found" };

    const filtered = existing.assignedResources.filter((r) => r.memberId !== validated.memberId);
    const updatedResources = [
      ...filtered,
      {
        memberId: validated.memberId,
        memberName: validated.memberName,
        skill: validated.skill,
        availabilityConfirmed: null,
      },
    ];

    const updated = await updateOrder(validated.orderId, {
      assignedResources: updatedResources,
    });

    return { success: true, order: updated || undefined };
  } catch (err: any) {
    console.error("[assignResourceAction] Error:", err);
    return {
      success: false,
      error: err.errors?.[0]?.message || err.message || "Failed to assign resource",
    };
  }
}
