"use server";

import { generateOrderIdentifiers, generateTimestampDigits, prefixLetters } from "@/lib/invitationPasscode";
import {
  CreateOrderSchema,
  AssignResourceSchema,
  UpdateTaskStatusSchema,
  UpdatePaymentSchema,
} from "@focoman/validation";
import { canCompleteOrder, generateWorkflowTasks, toCustomerTrackingView, getStudioCalendarDate } from "@focoman/domain";
import { DEMO_ORDERS, DEMO_TASKS } from "@/lib/demoData";
import {
  getOrdersByStudio,
  getDeletedOrdersByStudio,
  getOrderById,
  getOrderByIdIncludeDeleted,
  getOrderByPasskey,
  getOrdersByCustomerUid,
  getStudioBySlug,
  saveOrder,
  updateOrder,
  softDeleteOrder,
  restoreOrder,
  getTasksByOrder,
  getTasksByMember,
  saveTasks,
  saveTask,
  updateTask,
  softDeleteTask,
  restoreTask,
  getTaskById,
  getTaskByIdIncludeDeleted,
  getMembersByStudio,
  getMembershipsByStudio,
  getMembershipByUidAndStudio,
  saveCustomer,
} from "@focoman/db";
import { CustomerTrackingView, Order, Task, StudioMember, OrderStatus, TaskStatus, PaymentStatus, OrderCollaborator } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember, requireStudioOwner, getAdminAuthInstance } from "@/lib/serverAuth";

/**
 * Server Actions for Order Lifecycle, Tasks & Post-Event Production Pipeline (OMS)
 * Full CRUD, soft-delete, and restoration for both Orders and Tasks.
 * Enforces authenticated identity, authorized studio, and resource ownership.
 */

async function findActiveMemberRecord(studioId: string, email?: string): Promise<StudioMember | null> {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const members = await getMembersByStudio(studioId);
  return members.find((member) =>
    member.status === "ACTIVE" && member.email.trim().toLowerCase() === normalizedEmail
  ) || null;
}

async function requireAssignedOrderAccess(
  membership: Awaited<ReturnType<typeof requireStudioMember>>,
  email: string | undefined,
  studioId: string,
  order: Order
): Promise<StudioMember | null> {
  if (membership.role === "STUDIO_OWNER") {
    return null;
  }
  const member = await findActiveMemberRecord(studioId, email);
  if (!member) throw new Error("No active crew profile is linked to this account.");

  const tasks = await getTasksByMember(studioId, member.id);
  const isAssigned = order.assignedResources?.some((resource) => resource.memberId === member.id)
    || tasks.some((task) => task.orderId === order.id);
  if (!isAssigned) throw new Error("Access denied: This order is not assigned to your crew profile.");
  return member;
}

export async function createOrderAction(rawInput: unknown): Promise<{
  success: boolean;
  order?: Order;
  tasks?: Task[];
  error?: string;
}> {
  try {
    const validated = CreateOrderSchema.parse(rawInput);

    const decoded = await requireVerifiedUser(validated.idToken);
    await requireStudioOwner(decoded.uid, validated.studioId);

    const now = new Date();
    const { orderId, passkey, customerId } = generateOrderIdentifiers(validated.studioId, now);
    const nowIso = now.toISOString();

    const remainingAmount = Math.max(0, validated.finalConfirmedPrice - validated.advanceAmount);
    const initialPaymentStatus: PaymentStatus =
      validated.advanceAmount >= validated.finalConfirmedPrice && validated.finalConfirmedPrice > 0
        ? "PAID"
        : validated.advanceAmount > 0
        ? "PARTIAL"
        : "PENDING";

    const customerPhone = validated.customerPhone?.trim() || undefined;
    const customerEmail = validated.customerEmail?.trim() || undefined;
    const passkeyPin = validated.passkeyPin?.trim() || undefined;

    const studioPrefix = prefixLetters(validated.studioId);
    const finalPasskey = passkeyPin
      ? `FOC-${studioPrefix}-${passkeyPin}`
      : passkey;

    const todayStr = getStudioCalendarDate(now);
    const initialOrderStatus: OrderStatus =
      validated.eventDate < todayStr ? "POST_EVENT_IN_PROGRESS" : "AWAITING_EVENT";

    const newOrder: Order = {
      id: orderId,
      studioId: validated.studioId.toLowerCase(),
      orderNumber: orderId,
      customer: {
        id: customerId,
        name: validated.customerName,
        ...(customerPhone ? { phone: customerPhone } : {}),
        ...(customerEmail ? { email: customerEmail } : {}),
      },
      eventType: validated.eventType,
      eventDate: validated.eventDate,
      ...(validated.eventLocation ? { eventLocation: validated.eventLocation } : {}),
      services: validated.services,
      packages: validated.packages || [],
      pricing: {
        estimatedPrice: validated.estimatedPrice,
        finalConfirmedPrice: validated.finalConfirmedPrice,
        advanceAmount: validated.advanceAmount,
        remainingAmount,
      },
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      assignedResources: [],
      trackingPasskey: finalPasskey,
      ...(validated.notifyWhatsApp !== undefined ? { notifyWhatsApp: validated.notifyWhatsApp } : {}),
      ...(validated.notifySms !== undefined ? { notifySms: validated.notifySms } : {}),
      ...(validated.notifyEmail !== undefined ? { notifyEmail: validated.notifyEmail } : {}),
      isDeleted: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const workflowTasks = generateWorkflowTasks(orderId, validated.studioId, validated.services).map((t, idx) => {
      const { dateStamp, timeStamp } = generateTimestampDigits(now);
      const seqSuffix = String(idx + 1).padStart(2, "0");
      return {
        ...t,
        id: `TSK-${studioPrefix}-${dateStamp}-${timeStamp}-${seqSuffix}`,
        createdAt: nowIso,
        updatedAt: nowIso,
        isDeleted: false,
      };
    });

    await Promise.all([
      saveOrder(newOrder),
      saveTasks(workflowTasks),
      saveCustomer({
        id: customerId,
        studioId: validated.studioId.toLowerCase(),
        name: validated.customerName,
        ...(customerPhone ? { phone: customerPhone } : {}),
        ...(customerEmail ? { email: customerEmail } : {}),
        isDeleted: false,
        createdAt: nowIso,
        updatedAt: nowIso,
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
  await requireStudioOwner(decoded.uid, studioSlug);
  const orders = await getOrdersByStudio(studioSlug);
  const todayStr = getStudioCalendarDate();

  const updatedOrders: Order[] = [];
  for (const order of orders) {
    if (order.orderStatus === "AWAITING_EVENT" && order.eventDate < todayStr) {
      const transitioned: Order = {
        ...order,
        orderStatus: "POST_EVENT_IN_PROGRESS",
        updatedAt: new Date().toISOString(),
      };
      void updateOrder(order.id, { orderStatus: "POST_EVENT_IN_PROGRESS" });
      updatedOrders.push(transitioned);
    } else {
      updatedOrders.push(order);
    }
  }

  return updatedOrders;
}

export async function getDeletedStudioOrdersAction(
  studioSlug: string,
  idToken: string
): Promise<Order[]> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioOwner(decoded.uid, studioSlug);
  return await getDeletedOrdersByStudio(studioSlug);
}

export async function getOrderAction(
  orderId: string,
  studioSlug: string,
  idToken: string
): Promise<{ order: Order | null; tasks: Task[] }> {
  try {
    const decoded = await requireVerifiedUser(idToken);
    await requireStudioOwner(decoded.uid, studioSlug);

    const order = await getOrderById(orderId);
    if (!order) return { order: null, tasks: [] };
    if (order.studioId.toLowerCase() !== studioSlug.toLowerCase()) {
      return { order: null, tasks: [] };
    }
    const todayStr = getStudioCalendarDate();
    let currentOrder = order;
    if (order.orderStatus === "AWAITING_EVENT" && order.eventDate < todayStr) {
      currentOrder = {
        ...order,
        orderStatus: "POST_EVENT_IN_PROGRESS",
        updatedAt: new Date().toISOString(),
      };
      void updateOrder(order.id, { orderStatus: "POST_EVENT_IN_PROGRESS" });
    }
    const tasks = await getTasksByOrder(order.id);
    return { order: currentOrder, tasks };
  } catch (err) {
    console.error("[getOrderAction] Error:", err);
    return { order: null, tasks: [] };
  }
}

export async function getOrderTasksAction(
  orderId: string,
  studioSlug: string,
  idToken: string
): Promise<Task[]> {
  try {
    const decoded = await requireVerifiedUser(idToken);
    const membership = await requireStudioMember(decoded.uid, studioSlug);
    const order = await getOrderById(orderId);
    if (!order || order.studioId.toLowerCase() !== studioSlug.toLowerCase()) {
      return [];
    }
    const member = await requireAssignedOrderAccess(membership, decoded.email, studioSlug, order);
    const tasks = await getTasksByOrder(order.id);
    return member ? tasks.filter((task) => task.assignedMemberId === member.id) : tasks;
  } catch (err) {
    console.error("[getOrderTasksAction] Error:", err);
    return [];
  }
}

export async function updateOrderAction(input: {
  orderId: string;
  studioId: string;
  updates: Partial<Pick<Order, "eventType" | "eventDate" | "eventLocation" | "services" | "packages">>;
  idToken: string;
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioOwner(decoded.uid, input.studioId);

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
    await requireStudioOwner(decoded.uid, input.studioId);

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
    await requireStudioOwner(decoded.uid, input.studioId);

    const order = await getOrderByIdIncludeDeleted(input.orderId);
    if (!order || order.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Order not found in the authorized studio." };
    }

    await restoreOrder(input.orderId);
    return { success: true };
  } catch (err: unknown) {
    console.error("[restoreOrderAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to restore order" };
  }
}

export async function getOrderByPasskeyAction(passkey: string): Promise<{
  success: boolean;
  view?: CustomerTrackingView;
  error?: string;
}> {
  try {
    if (!passkey || passkey.trim().length === 0) {
      return { success: false, error: "Tracking passkey is required." };
    }

    const cleanPasskey = passkey.trim().toUpperCase();
    const order = await getOrderByPasskey(cleanPasskey);

    if (!order) {
      return {
        success: false,
        error: `No order was found for access code "${passkey}".`,
      };
    }

    const tasks = await getTasksByOrder(order.id);
    const cleanStudioId = order.studioId.toLowerCase();
    const studio = await getStudioBySlug(cleanStudioId);
    const staffEmails: string[] = [];
    const staffUids: string[] = [];

    let studioOwnerId = studio?.ownerId;
    let studioOwnerEmail = studio?.ownerEmail ? studio.ownerEmail.toLowerCase() : undefined;

    if (studioOwnerEmail) staffEmails.push(studioOwnerEmail);
    if (studioOwnerId) staffUids.push(studioOwnerId);

    // Fetch all active studio memberships to capture owner and all crew/staff members
    try {
      const memberships = await getMembershipsByStudio(cleanStudioId);
      const adminAuth = getAdminAuthInstance();
      for (const m of memberships) {
        if (m.uid) {
          staffUids.push(m.uid);
          if (m.role === 'STUDIO_OWNER' && !studioOwnerId) {
            studioOwnerId = m.uid;
          }
          try {
            const userRecord = await adminAuth.getUser(m.uid);
            if (userRecord.email) {
              const emailLower = userRecord.email.toLowerCase();
              staffEmails.push(emailLower);
              if (m.role === 'STUDIO_OWNER' && !studioOwnerEmail) {
                studioOwnerEmail = emailLower;
              }
            }
          } catch {
            // User not found in auth (e.g. deleted account)
          }
        }
      }

      const studioMembers = await getMembersByStudio(cleanStudioId);
      studioMembers.forEach((m) => {
        if (m.email) staffEmails.push(m.email.toLowerCase());
      });
    } catch (err) {
      console.warn("[getOrderByPasskeyAction] Error fetching members:", err);
    }

    const view = toCustomerTrackingView(order, studio?.name || "Studio", tasks, {
      studioId: order.studioId,
      studioOwnerId,
      studioOwnerEmail,
      staffEmails: Array.from(new Set(staffEmails)),
      staffUids: Array.from(new Set(staffUids)),
    });
    return { success: true, view };
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
    await requireStudioOwner(decoded.uid, input.studioId);

    const order = await getOrderById(input.orderId);
    if (!order || order.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Order not found in authorized studio." };
    }

    const existingTasks = await getTasksByOrder(input.orderId);
    const { dateStamp, timeStamp } = generateTimestampDigits();
    const taskId = `TSK-${prefixLetters(input.studioId)}-${dateStamp}-${timeStamp}`;
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

    const decoded = await requireVerifiedUser(validated.idToken);
    const studioId = validated.studioId;
    const membership = await requireStudioMember(decoded.uid, studioId);

    const existingTask = await getTaskById(validated.taskId);
    if (!existingTask || existingTask.studioId !== studioId.toLowerCase() || existingTask.orderId !== validated.orderId) {
      return { success: false, error: "Task not found in authorized studio." };
    }

    const linkedOrder = await getOrderById(validated.orderId);
    if (!linkedOrder || linkedOrder.studioId !== studioId.toLowerCase()) {
      return { success: false, error: "Order not found in authorized studio." };
    }
    if (membership.role !== "STUDIO_OWNER") {
      const member = await findActiveMemberRecord(studioId, decoded.email);
      if (!member || existingTask.assignedMemberId !== member.id) {
        return { success: false, error: "Access denied: This task is not assigned to your crew profile." };
      }
    }

    const updatedTask = await updateTask(validated.taskId, {
      status: validated.status as TaskStatus,
      reworkNotes: validated.reworkNotes,
    });

    if (!updatedTask) {
      return { success: false, error: "Task not found" };
    }

    const order = linkedOrder;
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
    await requireStudioOwner(decoded.uid, input.studioId);

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
    await requireStudioOwner(decoded.uid, input.studioId);

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
    await requireStudioOwner(decoded.uid, input.studioId);

    const task = await getTaskByIdIncludeDeleted(input.taskId);
    if (!task || task.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Task not found in the authorized studio." };
    }

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
    await requireStudioOwner(decoded.uid, (validated as any).studioId);

    const existingOrder = await getOrderById(validated.orderId);
    if (!existingOrder) {
      return { success: false, error: "Order not found" };
    }
    if (existingOrder.studioId !== (validated as any).studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Order belongs to another studio." };
    }

    const currentPricing = existingOrder.pricing;
    let calculatedStatus: PaymentStatus = validated.paymentStatus as PaymentStatus;
    let newAdvance = validated.advanceAmount !== undefined ? validated.advanceAmount : currentPricing.advanceAmount;
    
    if (calculatedStatus === "PAID") {
      newAdvance = currentPricing.finalConfirmedPrice;
    } else if (!calculatedStatus) {
      if (newAdvance >= currentPricing.finalConfirmedPrice && currentPricing.finalConfirmedPrice > 0) {
        calculatedStatus = "PAID";
      } else if (newAdvance > 0) {
        calculatedStatus = "PARTIAL";
      } else {
        calculatedStatus = "PENDING";
      }
    }

    const newRemaining = Math.max(0, currentPricing.finalConfirmedPrice - newAdvance);

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
    await requireStudioOwner(decoded.uid, (validated as any).studioId);

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
    const membership = await requireStudioMember(decoded.uid, targetStudioId);

    if (existingOrder.studioId !== targetStudioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Order belongs to another studio." };
    }

    if (membership.role !== "STUDIO_OWNER") {
      const member = await findActiveMemberRecord(targetStudioId, decoded.email);
      const isAssigned = member && existingOrder.assignedResources?.some((resource) => resource.memberId === member.id);
      if (!isAssigned || member?.id !== memberId) {
        return { success: false, error: "Access denied: You can only confirm your own assigned availability." };
      }
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
    await requireStudioOwner(decoded.uid, input.studioId);

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
        cancellationReason: input.cancellationReason?.trim() || "Cancelled by studio owner",
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

export async function syncOrderToAccountAction(input: {
  passkey: string;
  idToken: string;
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    const order = await getOrderByPasskey(input.passkey);
    if (!order) {
      return { success: false, error: "Order not found for this access code." };
    }

    // 0. Studio owners and members cannot claim an order as the primary customer
    const studioMembership = await getMembershipByUidAndStudio(decoded.uid, order.studioId);
    if (studioMembership && studioMembership.status === "ACTIVE") {
      return {
        success: false,
        error: "Studio owners and crew members cannot claim an order as the primary customer.",
      };
    }

    // 1. If order already has a customer.email registered, the syncing user MUST have that same email
    if (
      order.customer.email &&
      decoded.email &&
      order.customer.email.trim().toLowerCase() !== decoded.email.trim().toLowerCase()
    ) {
      return {
        success: false,
        error: `This order is registered to ${order.customer.email}. Please sign in with ${order.customer.email} to link this order.`,
      };
    }

    // 2. If order already has a customer.uid bound, prevent another account from taking it over
    if (order.customer.uid && order.customer.uid !== decoded.uid) {
      return {
        success: false,
        error: "This order is already claimed by the primary customer account.",
      };
    }

    const updatedCustomer = {
      ...order.customer,
      uid: decoded.uid,
      email: decoded.email || order.customer.email,
    };

    const updatedOrder = await updateOrder(order.id, {
      customer: updatedCustomer,
    });

    return { success: true, order: updatedOrder || undefined };
  } catch (err: unknown) {
    console.error("[syncOrderToAccountAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to sync order." };
  }
}

export async function getMySyncedOrdersAction(idToken: string): Promise<Order[]> {
  try {
    const decoded = await requireVerifiedUser(idToken);
    return await getOrdersByCustomerUid(decoded.uid, decoded.email);
  } catch (err: unknown) {
    console.error("[getMySyncedOrdersAction] Error:", err);
    return [];
  }
}

export async function updateOrderCollaboratorsAction(input: {
  orderId: string;
  collaborators: OrderCollaborator[];
  idToken: string;
}): Promise<{ success: boolean; collaborators?: OrderCollaborator[]; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    const order = await getOrderById(input.orderId);
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    const userEmail = decoded.email?.toLowerCase();
    const customerEmail = order.customer.email?.toLowerCase();
    const isPrimaryCustomer = Boolean(
      (userEmail && customerEmail && userEmail === customerEmail) ||
      (order.customer.uid && order.customer.uid === decoded.uid)
    );

    let isStudioStaff = false;
    try {
      const membership = await requireStudioMember(decoded.uid, order.studioId);
      if (membership) isStudioStaff = true;
    } catch {
      // not studio staff
    }

    if (!isPrimaryCustomer && !isStudioStaff) {
      return {
        success: false,
        error: "Unauthorized: Only the primary customer or studio staff can manage family/friend permissions.",
      };
    }

    const updated = await updateOrder(order.id, {
      collaborators: input.collaborators,
    });

    return { success: true, collaborators: updated?.collaborators || input.collaborators };
  } catch (err: unknown) {
    console.error("[updateOrderCollaboratorsAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update collaborators." };
  }
}

export async function checkIsStudioStaffAction(input: {
  studioId: string;
  idToken: string;
}): Promise<{ isStaff: boolean; role?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    const membership = await getMembershipByUidAndStudio(decoded.uid, input.studioId);
    if (membership && membership.status === "ACTIVE") {
      return { isStaff: true, role: membership.role };
    }
    return { isStaff: false };
  } catch {
    return { isStaff: false };
  }
}

