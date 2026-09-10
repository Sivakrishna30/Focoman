"use client";

import { Order, Customer, StudioMember, Task, OrderStatus, TaskStatus, PaymentStatus } from "@focoman/types";
import {
  DEMO_STUDIO_SLUG,
  DEMO_STUDIO,
  DEMO_ORDERS,
  DEMO_CUSTOMERS,
  DEMO_MEMBERS,
  DEMO_TASKS,
  DemoUserPersona,
  DEMO_USER_PERSONAS,
} from "./demoData";

export { DEMO_USER_PERSONAS, type DemoUserPersona } from "./demoData";

const STORAGE_KEYS = {
  ORDERS: "focoman_demo_orders",
  CUSTOMERS: "focoman_demo_customers",
  MEMBERS: "focoman_demo_members",
  TASKS: "focoman_demo_tasks",
  WHATSAPP: "focoman_demo_whatsapp",
  ACTIVE_USER: "focoman_demo_active_user",
  TOUR_SEEN: "focoman_demo_tour_seen",
};

export function isDemoStudio(slug?: string | null): boolean {
  if (!slug) return false;
  const s = slug.toLowerCase();
  return s === "lumina-studios" || s === "demo" || s === "demo-studio";
}

// Event listeners for intra-page synchronization
type DemoChangeListener = () => void;
const listeners: Set<DemoChangeListener> = new Set();

export function subscribeToDemoStore(callback: DemoChangeListener): () => void {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("focoman_demo_")) {
        callback();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", handleStorage);
    };
  }
  return () => {
    listeners.delete(callback);
  };
}

function notifyDemoChange() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error("[demoStore] listener error:", err);
    }
  });
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    notifyDemoChange();
  } catch (err) {
    console.error("[demoStore] Failed to save to localStorage:", err);
  }
}

// ==========================================
// 1. ORDERS
// ==========================================
export function getDemoOrders(): Order[] {
  return getItem<Order[]>(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
}

export function saveDemoOrders(orders: Order[]): void {
  setItem(STORAGE_KEYS.ORDERS, orders);
}

export function createDemoOrder(input: {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  eventType: string;
  eventDate: string;
  eventLocation?: string;
  services: string[];
  packages?: string[];
  finalConfirmedPrice: number;
  advanceAmount: number;
}): { success: boolean; order?: Order; tasks?: Task[] } {
  const currentOrders = getDemoOrders();
  const currentTasks = getDemoTasks();
  const currentCustomers = getDemoCustomers();

  const nextNum = 100 + currentOrders.length + 1;
  const orderId = `ORD-LUM-${nextNum}`;
  const customerId = `CUS-LUM-${nextNum}`;
  const passkey = `FOC-DEMO-${String(nextNum).padStart(2, "0")}`;
  const now = new Date().toISOString();

  const remainingAmount = Math.max(0, input.finalConfirmedPrice - input.advanceAmount);
  const paymentStatus: PaymentStatus =
    input.advanceAmount >= input.finalConfirmedPrice && input.finalConfirmedPrice > 0
      ? "PAYMENT_COMPLETED"
      : input.advanceAmount > 0
      ? "PAYMENT_CONFIRMATION_REQUIRED"
      : "PAYMENT_PENDING";

  const newOrder: Order = {
    id: orderId,
    studioId: DEMO_STUDIO_SLUG,
    orderNumber: orderId,
    customer: {
      id: customerId,
      name: input.customerName,
      phone: input.customerPhone,
    },
    eventType: input.eventType,
    eventDate: input.eventDate,
    eventLocation: input.eventLocation,
    services: input.services,
    packages: input.packages || ["Custom Event Coverage"],
    pricing: {
      estimatedPrice: input.finalConfirmedPrice,
      finalConfirmedPrice: input.finalConfirmedPrice,
      advanceAmount: input.advanceAmount,
      remainingAmount,
    },
    paymentStatus,
    orderStatus: "AWAITING_EVENT",
    assignedResources: [
      {
        memberId: "demo-user-arjun",
        memberName: "Arjun Sharma",
        skill: "PHOTOGRAPHY",
        availabilityConfirmed: true,
      },
    ],
    trackingPasskey: passkey,
    createdAt: now,
    updatedAt: now,
  };

  // Generate dynamic tasks
  const newTasks: Task[] = [];
  let seq = 1;
  const servicesLower = input.services.map((s) => s.toLowerCase());

  if (servicesLower.some((s) => s.includes("photo"))) {
    newTasks.push({
      id: `TSK-${orderId}-${seq}`,
      orderId,
      studioId: DEMO_STUDIO_SLUG,
      title: "RAW Photos Review & Selection",
      serviceCategory: "PHOTOGRAPHY",
      assignedMemberId: "demo-user-priya",
      assignedMemberName: "Priya Nair",
      status: "ASSIGNED",
      sequenceOrder: seq++,
      createdAt: now,
      updatedAt: now,
    });
    newTasks.push({
      id: `TSK-${orderId}-${seq}`,
      orderId,
      studioId: DEMO_STUDIO_SLUG,
      title: "Photo Retouching & Color Grading",
      serviceCategory: "PHOTOGRAPHY",
      assignedMemberId: "demo-user-rohan",
      assignedMemberName: "Rohan Mehta",
      status: "ASSIGNED",
      sequenceOrder: seq++,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (servicesLower.some((s) => s.includes("video"))) {
    newTasks.push({
      id: `TSK-${orderId}-${seq}`,
      orderId,
      studioId: DEMO_STUDIO_SLUG,
      title: "Cinematic Highlight Video Editing",
      serviceCategory: "VIDEOGRAPHY",
      assignedMemberId: "demo-user-aisha",
      assignedMemberName: "Aisha Khan",
      status: "ASSIGNED",
      sequenceOrder: seq++,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (servicesLower.some((s) => s.includes("album"))) {
    newTasks.push({
      id: `TSK-${orderId}-${seq}`,
      orderId,
      studioId: DEMO_STUDIO_SLUG,
      title: "Album Design & Proofing",
      serviceCategory: "ALBUM",
      assignedMemberId: "demo-user-deepak",
      assignedMemberName: "Deepak Verma",
      status: "ASSIGNED",
      sequenceOrder: seq++,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Create Customer record
  const newCustomer: Customer = {
    id: customerId,
    studioId: DEMO_STUDIO_SLUG,
    name: input.customerName,
    phone: input.customerPhone,
    email: input.customerEmail,
    address: input.eventLocation,
    createdAt: now,
    updatedAt: now,
  };

  saveDemoOrders([newOrder, ...currentOrders]);
  saveDemoTasks([...currentTasks, ...newTasks]);
  saveDemoCustomers([newCustomer, ...currentCustomers]);

  return { success: true, order: newOrder, tasks: newTasks };
}

export function updateDemoTaskStatus(
  taskId: string,
  newStatus: TaskStatus,
  reworkNotes?: string
): { success: boolean; task?: Task; newOrderStatus?: OrderStatus } {
  const currentTasks = getDemoTasks();
  const taskIndex = currentTasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return { success: false };

  const updatedTask: Task = {
    ...currentTasks[taskIndex],
    status: newStatus,
    reworkNotes: reworkNotes !== undefined ? reworkNotes : currentTasks[taskIndex].reworkNotes,
    updatedAt: new Date().toISOString(),
  };

  const updatedTasks = [...currentTasks];
  updatedTasks[taskIndex] = updatedTask;
  saveDemoTasks(updatedTasks);

  // Check if order status should update
  const currentOrders = getDemoOrders();
  const orderId = updatedTask.orderId;
  const orderIndex = currentOrders.findIndex((o) => o.id === orderId);

  let newOrderStatus: OrderStatus | undefined = undefined;

  if (orderIndex !== -1) {
    const order = currentOrders[orderIndex];
    const orderTasks = updatedTasks.filter((t) => t.orderId === orderId);
    const allTasksCompleted = orderTasks.every((t) => t.status === "COMPLETED");
    const paymentCompleted = order.paymentStatus === "PAYMENT_COMPLETED";

    if (allTasksCompleted && paymentCompleted && order.orderStatus !== "COMPLETED") {
      newOrderStatus = "COMPLETED";
    } else if (order.orderStatus === "AWAITING_EVENT") {
      const anyStarted = orderTasks.some((t) => t.status !== "ASSIGNED");
      if (anyStarted) {
        newOrderStatus = "POST_EVENT_IN_PROGRESS";
      }
    }

    if (newOrderStatus && newOrderStatus !== order.orderStatus) {
      const updatedOrders = [...currentOrders];
      updatedOrders[orderIndex] = {
        ...order,
        orderStatus: newOrderStatus,
        updatedAt: new Date().toISOString(),
      };
      saveDemoOrders(updatedOrders);
    }
  }

  return { success: true, task: updatedTask, newOrderStatus };
}

export function updateDemoPaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  advanceAmount?: number
): { success: boolean; order?: Order } {
  const currentOrders = getDemoOrders();
  const orderIndex = currentOrders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) return { success: false };

  const order = currentOrders[orderIndex];
  const newAdvance = advanceAmount !== undefined ? advanceAmount : order.pricing.advanceAmount;
  const remaining = Math.max(0, order.pricing.finalConfirmedPrice - newAdvance);

  const updatedOrder: Order = {
    ...order,
    paymentStatus,
    pricing: {
      ...order.pricing,
      advanceAmount: newAdvance,
      remainingAmount: remaining,
    },
    updatedAt: new Date().toISOString(),
  };

  // Recheck if order can complete
  const currentTasks = getDemoTasks();
  const orderTasks = currentTasks.filter((t) => t.orderId === orderId);
  const allTasksDone = orderTasks.every((t) => t.status === "COMPLETED");

  if (allTasksDone && paymentStatus === "PAYMENT_COMPLETED") {
    updatedOrder.orderStatus = "COMPLETED";
  }

  const updatedOrders = [...currentOrders];
  updatedOrders[orderIndex] = updatedOrder;
  saveDemoOrders(updatedOrders);

  return { success: true, order: updatedOrder };
}

export function assignDemoResource(
  orderId: string,
  memberId: string,
  memberName: string,
  skill: string
): { success: boolean; order?: Order } {
  const currentOrders = getDemoOrders();
  const orderIndex = currentOrders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) return { success: false };

  const order = currentOrders[orderIndex];
  const existingFiltered = order.assignedResources.filter((r) => r.memberId !== memberId);
  const updatedResources = [
    ...existingFiltered,
    {
      memberId,
      memberName,
      skill,
      availabilityConfirmed: true,
    },
  ];

  const updatedOrder: Order = {
    ...order,
    assignedResources: updatedResources,
    updatedAt: new Date().toISOString(),
  };

  const updatedOrders = [...currentOrders];
  updatedOrders[orderIndex] = updatedOrder;
  saveDemoOrders(updatedOrders);

  return { success: true, order: updatedOrder };
}

export function confirmDemoResourceAvailability(
  orderId: string,
  memberId: string,
  available: boolean
): { success: boolean; order?: Order } {
  const currentOrders = getDemoOrders();
  const orderIndex = currentOrders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) return { success: false };

  const order = currentOrders[orderIndex];
  const resourceIndex = order.assignedResources.findIndex((r) => r.memberId === memberId);
  if (resourceIndex === -1) return { success: false };

  const updatedResources = [...order.assignedResources];
  updatedResources[resourceIndex] = {
    ...updatedResources[resourceIndex],
    availabilityConfirmed: available,
  };

  const updatedOrder: Order = {
    ...order,
    assignedResources: updatedResources,
    updatedAt: new Date().toISOString(),
  };

  const updatedOrders = [...currentOrders];
  updatedOrders[orderIndex] = updatedOrder;
  saveDemoOrders(updatedOrders);

  return { success: true, order: updatedOrder };
}

// ==========================================
// 2. TASKS
// ==========================================
export function getDemoTasks(): Task[] {
  return getItem<Task[]>(STORAGE_KEYS.TASKS, DEMO_TASKS);
}

export function saveDemoTasks(tasks: Task[]): void {
  setItem(STORAGE_KEYS.TASKS, tasks);
}

export function getDemoTasksByOrder(orderId: string): Task[] {
  return getDemoTasks().filter((t) => t.orderId === orderId);
}

// ==========================================
// 3. CUSTOMERS
// ==========================================
export function getDemoCustomers(): Customer[] {
  return getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
}

export function saveDemoCustomers(customers: Customer[]): void {
  setItem(STORAGE_KEYS.CUSTOMERS, customers);
}

export function createDemoCustomer(input: {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}): { success: boolean; customer: Customer } {
  const currentCustomers = getDemoCustomers();
  const id = `CUS-LUM-${String(100 + currentCustomers.length + 1).padStart(3, "0")}`;
  const now = new Date().toISOString();

  const newCustomer: Customer = {
    id,
    studioId: DEMO_STUDIO_SLUG,
    name: input.name,
    phone: input.phone,
    email: input.email,
    address: input.address,
    createdAt: now,
    updatedAt: now,
  };

  saveDemoCustomers([newCustomer, ...currentCustomers]);
  return { success: true, customer: newCustomer };
}

// ==========================================
// 4. MEMBERS (CREW / ERP)
// ==========================================
export function getDemoMembers(): StudioMember[] {
  return getItem<StudioMember[]>(STORAGE_KEYS.MEMBERS, DEMO_MEMBERS);
}

export function saveDemoMembers(members: StudioMember[]): void {
  setItem(STORAGE_KEYS.MEMBERS, members);
}

export function createDemoMember(input: {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
}): { success: boolean; member: StudioMember } {
  const currentMembers = getDemoMembers();
  const id = `demo-user-${input.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10)}`;
  const now = new Date().toISOString();

  const newMember: StudioMember = {
    id,
    studioId: DEMO_STUDIO_SLUG,
    name: input.name,
    email: input.email,
    phone: input.phone,
    skills: input.skills,
    createdAt: now,
    updatedAt: now,
  };

  saveDemoMembers([...currentMembers, newMember]);
  return { success: true, member: newMember };
}

// ==========================================
// 5. WHATSAPP CONFIG
// ==========================================
export function getDemoWhatsappConfig(): Record<string, boolean> {
  return getItem<Record<string, boolean>>(
    STORAGE_KEYS.WHATSAPP,
    DEMO_STUDIO.whatsappConfig || {}
  );
}

export function saveDemoWhatsappConfig(config: Record<string, boolean>): void {
  setItem(STORAGE_KEYS.WHATSAPP, config);
}

// ==========================================
// 6. RESET DEMO TO DEFAULT BASELINE (DB)
// ==========================================
export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.ORDERS);
    window.localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    window.localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    window.localStorage.removeItem(STORAGE_KEYS.TASKS);
    window.localStorage.removeItem(STORAGE_KEYS.WHATSAPP);
    notifyDemoChange();
  } catch (err) {
    console.error("[demoStore] Error resetting demo data:", err);
  }
}

// ==========================================
// 7. DEMO ACTIVE USER & TOUR STATE
// ==========================================
export function getDemoActiveUser(): DemoUserPersona | null {
  return getItem<DemoUserPersona | null>(
    STORAGE_KEYS.ACTIVE_USER,
    DEMO_USER_PERSONAS[0] // Default to Arjun Sharma (Owner)
  );
}

export function setDemoActiveUser(user: DemoUserPersona | null): void {
  if (!user) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      notifyDemoChange();
    }
  } else {
    setItem(STORAGE_KEYS.ACTIVE_USER, user);
  }
}

export function getDemoTourSeen(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEYS.TOUR_SEEN) === "true";
}

export function setDemoTourSeen(seen: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.TOUR_SEEN, seen ? "true" : "false");
}
