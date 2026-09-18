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
  getDeletedOrdersByStudio,
  getOrderById,
  getOrderByPasskey,
  saveOrder,
  updateOrder,
  softDeleteOrder,
  restoreOrder,
  getTasksByOrder,
  saveTasks,
  saveTask,
  updateTask,
  softDeleteTask,
  restoreTask,
  getTaskById,
  saveCustomer,
} from "@focoman/db";
import { Order, Task, OrderStatus, TaskStatus, PaymentStatus } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";

/**
 * Server Actions for Order Lifecycle, Tasks & Post-Event Production Pipeline (OMS)
 * Full CRUD, soft-delete, and restoration for both Orders and Tasks.
 * Enforces authenticated identity, authorized studio, and resource ownership.
 */

export async function createOrderAction(rawInput: unknown): Promise<{
  success: boolean;
  order?: Order;
  tasks?: Task[];
  error?: string;
}> {
  try {
    const validated = CreateOrderSchema.parse(rawInput);

    const decoded = await requireVerifiedUser((validated as any).idToken);
    await requireStudioMember(decoded.uid, validated.studioId);

    const orderId = `ORD-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const passkey = `FOC-${randomBytes(4).toString('hex').toUpperCase()}`;
    const customerId = `CUS-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    const remainingAmount = Math.max(0, validated.finalConfirmedPrice - validated.advanceAmount);
    const initialPaymentStatus: PaymentStatus =
      validated.advanceAmount >= validated.finalConfirmedPrice && validated.finalConfirmedPrice > 0
        ? "PAID"
        : validated.advanceAmount > 0
        ? "PARTIAL"
        : "PENDING";

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
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    const workflowTasks = generateWorkflowTasks(orderId, validated.studioId, validated.services).map(t => ({
      ...t,
      id: `TSK-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    }));

    await Promise.all([
      saveOrder(newOrder),
      saveTasks(workflowTasks),
      saveCustomer({
        id: customerId,
        studioId: validated.studioId.toLowerCase(),
        name: validated.customerName,
        phone: validated.customerPhone,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
      }),
    ]);

    return { success: true, order: newOrder, tasks: workflowTasks };
  } catch (err: unknown) {
    console.error("[createOrderAction] Error:", err);
    return {
      success: false,
      error: (err as any)?.errors?.[0]?.message || (err instanceof Error ? err.message : "Failed to create order"),
    };
  }
}

export async function getStudioOrdersAction(
  studioSlug: string,
  idToken: string
): Promise<Order[]> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  return await getOrdersByStudio(studioSlug);
}

export async function getDeletedStudioOrdersAction(
  studioSlug: string,
  idToken: string
): Promise<Order[]> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  return await getDeletedOrdersByStudio(studioSlug);
}

export async function getOrderAction(
  orderId: string,
  studioSlug: string,
  idToken: string
): Promise<{ order: Order | null; tasks: Task[] }> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);

  const order = await getOrderById(orderId);
  if (!order) return { order: null, tasks: [] };
  if (order.studioId !== studioSlug.toLowerCase()) {
    throw new Error("Access denied: Order does not belong to authorized studio.");
  }
  const tasks = await getTasksByOrder(order.id);
  return { order, tasks };
}

export async function getOrderTasksAction(
  orderId: string,
  studioSlug?: string,
  idToken?: string
): Promise<Task[]> {
  if (idToken && studioSlug) {
    const decoded = await requireVerifiedUser(idToken);
    await requireStudioMember(decoded.uid, studioSlug);
  }
  return await getTasksByOrder(orderId);
}

export async function updateOrderAction(input: {
  orderId: string;
  studioId: string;
  updates: Partial<Pick<Order, "eventType" | "eventDate" | "eventLocation" | "services" | "packages">>;
  idToken: string;
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    const existing = await getOrderById(input.orderId);
    if (!existing) {
      return { success: false, error: "Order not found." };
    }
    if (existing.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Order belongs to another studio." };
    }

    const updated = await updateOrder(input.orderId, input.updates);
    return { success: true, order: updated || undefined };
  } catch (err: unknown) {
    console.error("[updateOrderAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update order" };
  }
}

export async function deleteOrderAction(input: {
  orderId: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    const existing = await getOrderById(input.orderId);
    if (!existing) {
      return { success: false, error: "Order not found." };
    }
    if (existing.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Order belongs to another studio." };
    }

    await softDeleteOrder(input.orderId, decoded.uid);
    return { success: true };
  } catch (err: unknown) {
    console.error("[deleteOrderAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete order" };
  }
}

export async function restoreOrderAction(input: {
  orderId: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    await restoreOrder(input.orderId);
    return { success: true };
  } catch (err: unknown) {
    console.error("[restoreOrderAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to restore order" };
  }
}

export async function getOrderByPasskeyAction(passkey: string): Promise<{
  success: boolean;
  order?: Order;
  tasks?: Task[];
  error?: string;
}> {
  try {
    if (!passkey || passkey.trim().length === 0) {
      return { success: false, error: "Tracking passkey is required." };
    }

    const order = await getOrderByPasskey(passkey.trim().toUpperCase());
    if (!order) {
      const byId = await getOrderById(passkey.trim());
      if (byId && !byId.isDeleted) {
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
  } catch (err: unknown) {
    console.error("[getOrderByPasskeyAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to retrieve order." };
  }
}

// ------------------------------------------------------------------
// TASK CRUD OPERATIONS
// ------------------------------------------------------------------

export async function createTaskAction(input: {
  orderId: string;
  studioId: string;
  title: string;
  serviceCategory: 'PHOTOGRAPHY' | 'VIDEOGRAPHY' | 'ALBUM' | 'GENERAL';
  assignedMemberId?: string;
  assignedMemberName?: string;
  idToken: string;
}): Promise<{ success: boolean; task?: Task; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    const order = await getOrderById(input.orderId);
    if (!order || order.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Order not found in authorized studio." };
    }

    const existingTasks = await getTasksByOrder(input.orderId);
    const taskId = `TSK-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    const task: Task = {
      id: taskId,
      orderId: input.orderId,
      studioId: input.studioId.toLowerCase(),
      title: input.title.trim(),
      serviceCategory: input.serviceCategory,
      assignedMemberId: input.assignedMemberId || 'unassigned',
      assignedMemberName: input.assignedMemberName || 'Unassigned Crew',
      status: 'ASSIGNED',
      sequenceOrder: existingTasks.length + 1,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    await saveTask(task);
    return { success: true, task };
  } catch (err: unknown) {
    console.error("[createTaskAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create task" };
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

    const decoded = await requireVerifiedUser((validated as any).idToken);
    await requireStudioMember(decoded.uid, (validated as any).studioId);

    const existingTask = await getTaskById(validated.taskId);
    if (!existingTask || existingTask.studioId !== (validated as any).studioId.toLowerCase()) {
      return { success: false, error: "Task not found in authorized studio." };
    }

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
  } catch (err: unknown) {
    console.error("[updateTaskStatusAction] Error:", err);
    return {
      success: false,
      error: (err as any)?.errors?.[0]?.message || (err instanceof Error ? err.message : "Failed to update task"),
    };
  }
}

export async function updateTaskAction(input: {
  taskId: string;
  studioId: string;
  updates: Partial<Pick<Task, 'title' | 'serviceCategory' | 'assignedMemberId' | 'assignedMemberName' | 'status' | 'reworkNotes'>>;
  idToken: string;
}): Promise<{ success: boolean; task?: Task; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    const task = await getTaskById(input.taskId);
    if (!task || task.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Task not found in authorized studio." };
    }

    const updated = await updateTask(input.taskId, input.updates);
    return { success: true, task: updated || undefined };
  } catch (err: unknown) {
    console.error("[updateTaskAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update task" };
  }
}

export async function deleteTaskAction(input: {
  taskId: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    const task = await getTaskById(input.taskId);
    if (!task || task.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Task not found in authorized studio." };
    }

    await softDeleteTask(input.taskId, decoded.uid);
    return { success: true };
  } catch (err: unknown) {
    console.error("[deleteTaskAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete task" };
  }
}

export async function restoreTaskAction(input: {
  taskId: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    await restoreTask(input.taskId);
    return { success: true };
  } catch (err: unknown) {
    console.error("[restoreTaskAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to restore task" };
  }
}

export async function updatePaymentStatusAction(rawInput: unknown): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  try {
    const validated = UpdatePaymentSchema.parse(rawInput);

    const decoded = await requireVerifiedUser((validated as any).idToken);
    await requireStudioMember(decoded.uid, (validated as any).studioId);

    const existingOrder = await getOrderById(validated.orderId);
    if (!existingOrder) {
      return { success: false, error: "Order not found" };
    }
    if (existingOrder.studioId !== (validated as any).studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Order belongs to another studio." };
    }

    const currentPricing = existingOrder.pricing;
    const newAdvance = validated.advanceAmount !== undefined ? validated.advanceAmount : currentPricing.advanceAmount;
    const newRemaining = Math.max(0, currentPricing.finalConfirmedPrice - newAdvance);

    let calculatedStatus: PaymentStatus = validated.paymentStatus as PaymentStatus;
    if (!calculatedStatus) {
      if (newAdvance >= currentPricing.finalConfirmedPrice && currentPricing.finalConfirmedPrice > 0) {
        calculatedStatus = "PAID";
      } else if (newAdvance > 0) {
        calculatedStatus = "PARTIAL";
      } else {
        calculatedStatus = "PENDING";
      }
    }

    const updatedOrder = await updateOrder(validated.orderId, {
      paymentStatus: calculatedStatus,
      pricing: {
        ...currentPricing,
        advanceAmount: newAdvance,
        remainingAmount: newRemaining,
      },
    });

    if (updatedOrder) {
      const allTasks = await getTasksByOrder(validated.orderId);
      if (canCompleteOrder(calculatedStatus, allTasks) && updatedOrder.orderStatus !== "COMPLETED") {
        await updateOrder(validated.orderId, { orderStatus: "COMPLETED" });
        updatedOrder.orderStatus = "COMPLETED";
      }
    }

    return { success: true, order: updatedOrder || undefined };
  } catch (err: unknown) {
    console.error("[updatePaymentStatusAction] Error:", err);
    return {
      success: false,
      error: (err as any)?.errors?.[0]?.message || (err instanceof Error ? err.message : "Failed to update payment status"),
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

    const decoded = await requireVerifiedUser((validated as any).idToken);
    await requireStudioMember(decoded.uid, (validated as any).studioId);

    const existingOrder = await getOrderById(validated.orderId);
    if (!existingOrder) {
      return { success: false, error: "Order not found" };
    }
    if (existingOrder.studioId !== (validated as any).studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Order belongs to another studio." };
    }

    const currentAssignments = existingOrder.assignedResources || [];
    const filtered = currentAssignments.filter(
      (r) => !(r.memberId === validated.memberId && r.skill === validated.skill)
    );

    const newAssignments = [
      ...filtered,
      {
        memberId: validated.memberId,
        memberName: validated.memberName,
        skill: validated.skill,
        availabilityConfirmed: null,
      },
    ];

    const updatedOrder = await updateOrder(validated.orderId, {
      assignedResources: newAssignments,
    });

    return { success: true, order: updatedOrder || undefined };
  } catch (err: unknown) {
    console.error("[assignResourceAction] Error:", err);
    return {
      success: false,
      error: (err as any)?.errors?.[0]?.message || (err instanceof Error ? err.message : "Failed to assign resource"),
    };
  }
}

export async function confirmResourceAvailabilityAction(
  inputOrOrderId:
    | {
        orderId: string;
        memberId: string;
        confirmed: boolean;
        idToken: string;
        studioId?: string;
      }
    | string,
  argMemberId?: string,
  argConfirmed?: boolean,
  argIdToken?: string,
  argStudioId?: string
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    let orderId: string;
    let memberId: string;
    let confirmed: boolean;
    let idToken: string;
    let studioId: string | undefined;

    if (typeof inputOrOrderId === "object") {
      orderId = inputOrOrderId.orderId;
      memberId = inputOrOrderId.memberId;
      confirmed = inputOrOrderId.confirmed;
      idToken = inputOrOrderId.idToken;
      studioId = inputOrOrderId.studioId;
    } else {
      orderId = inputOrOrderId;
      memberId = argMemberId || "";
      confirmed = !!argConfirmed;
      idToken = argIdToken || "";
      studioId = argStudioId;
    }

    const decoded = await requireVerifiedUser(idToken);

    const existingOrder = await getOrderById(orderId);
    if (!existingOrder) {
      return { success: false, error: "Order not found" };
    }
    const targetStudioId = studioId || existingOrder.studioId;
    await requireStudioMember(decoded.uid, targetStudioId);

    if (existingOrder.studioId !== targetStudioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Order belongs to another studio." };
    }

    const currentAssignments = existingOrder.assignedResources || [];
    const updatedAssignments = currentAssignments.map((r) => {
      if (r.memberId === memberId) {
        return { ...r, availabilityConfirmed: confirmed };
      }
      return r;
    });

    const updatedOrder = await updateOrder(orderId, {
      assignedResources: updatedAssignments,
    });

    return { success: true, order: updatedOrder || undefined };
  } catch (err: unknown) {
    console.error("[confirmResourceAvailabilityAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update availability" };
  }
}

export async function cancelOrderAction(input: {
  orderId: string;
  studioId: string;
  cancellationReason: string;
  refundNotes?: string;
  idToken: string;
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId, "STUDIO_OWNER");

    const existingOrder = await getOrderById(input.orderId);
    if (!existingOrder) {
      return { success: false, error: "Order not found" };
    }
    if (existingOrder.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Order belongs to another studio." };
    }

    const updated = await updateOrder(input.orderId, {
      orderStatus: "CANCELLED",
      cancellationInfo: {
        cancellationReason: input.cancellationReason,
        cancelledBy: decoded.uid,
        cancelledAt: new Date().toISOString(),
        refundNotes: input.refundNotes,
      },
    });

    return { success: true, order: updated || undefined };
  } catch (err: unknown) {
    console.error("[cancelOrderAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to cancel order" };
  }
}
