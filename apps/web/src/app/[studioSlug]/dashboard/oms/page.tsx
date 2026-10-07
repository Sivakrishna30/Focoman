"use client";

import { useMemo, useState, useEffect, useCallback, use } from "react";
import { OrderStatus, TaskStatus, Order, Task, PaymentStatus, ResourceSuggestion } from "@focoman/types";
import {
  getStudioOrdersAction,
  getOrderTasksAction,
  createOrderAction,
  updateTaskStatusAction,
  updatePaymentStatusAction,
  assignResourceAction,
  cancelOrderAction,
  deleteOrderAction,
} from "@/actions/orderActions";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";
import {
  isDemoStudio,
  getDemoOrders,
  getDemoTasksByOrder,
  createDemoOrder,
  updateDemoTaskStatus,
  updateDemoPaymentStatus,
  cancelDemoOrder,
  deleteDemoOrder,
  subscribeToDemoStore,
} from "@/lib/demoStore";

const STATUS_LABELS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "Awaiting Event",
  POST_EVENT_IN_PROGRESS: "Post-Event In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "badge-brand-blue",
  POST_EVENT_IN_PROGRESS: "badge-brand-orange",
  COMPLETED: "badge-status-success",
  CANCELLED: "badge-status-error",
};

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  ASSIGNED: "badge-status-neutral",
  IN_PROGRESS: "badge-brand-blue",
  REVIEW: "badge-brand-purple",
  REWORK: "badge-status-error",
  COMPLETED: "badge-status-success",
};

export default function OmsPage({
  params,
}: {
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = use(params);
  const { studio, idToken: workspaceToken, authLoading, getIdToken } = useStudioWorkspace();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => orders.find((o) => o.id === selectedId) || null,
    [orders, selectedId]
  );
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<"code" | "link" | null>(null);

  const handleCopyText = (text: string, field: "code" | "link") => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const hasWhatsappPlan = Boolean(
    studio?.features?.whatsapp ||
    studio?.planInfo?.selectedCapabilities?.some((c) => c.startsWith("WHATSAPP")) ||
    (studio as any)?.capabilities?.some((c: string) => c.startsWith("WHATSAPP"))
  );

const PRESET_EVENT_TYPES = [
  "Wedding",
  "Reception",
  "Engagement",
  "Housewarming Ceremony",
  "Ear Piercing Ceremony",
  "Baby Shower",
  "Birthday Celebration",
  "Traditional Occasion",
  "Corporate Event",
  "Pre-Wedding / Outdoor Shoot",
  "Other",
] as const;

const PRESET_STUDIO_SERVICES = [
  "Traditional Photography",
  "Candid Photography",
  "Traditional Videography",
  "Cinematic Video / Teaser",
  "Drone Aerial Shoots",
  "Pre-Wedding Photoshoot",
  "Post-Wedding Photoshoot",
  "Premium Photobook Album",
] as const;

const DEFAULT_ORDER_FORM = {
  customerName: "",
  countryCode: "+91",
  customerPhone: "",
  customerEmail: "",
  passkeyPin: "",
  notifyWhatsApp: true,
  notifySms: true,
  notifyEmail: true,
  eventType: "Wedding",
  customEventType: "",
  eventDate: "",
  eventLocation: "",
  services: [
    "Traditional Photography",
    "Candid Photography",
    "Traditional Videography",
    "Premium Photobook Album",
  ] as string[],
  customServiceInput: "",
  finalConfirmedPrice: "" as unknown as number,
  advanceAmount: "" as unknown as number,
};

  // New Order Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newOrderForm, setNewOrderForm] = useState(DEFAULT_ORDER_FORM);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  // In-App Cancellation Dialog State
  const [cancelTargetOrder, setCancelTargetOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // In-App Soft-Delete Dialog State
  const [deleteTargetOrder, setDeleteTargetOrder] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDemo = isDemoStudio(studioSlug);

  const handleOpenCreateModal = () => {
    setNewOrderForm({
      ...DEFAULT_ORDER_FORM,
      passkeyPin: Math.floor(100000 + Math.random() * 900000).toString(),
    });
    setFormError(null);
    setShowServicesDropdown(false);
    setShowCreateModal(true);
  };

  const toggleService = (svc: string) => {
    setNewOrderForm((prev) => {
      const exists = prev.services.includes(svc);
      const next = exists
        ? prev.services.filter((s) => s !== svc)
        : [...prev.services, svc];
      return { ...prev, services: next };
    });
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    const custom = newOrderForm.customServiceInput.trim();
    if (custom && !newOrderForm.services.includes(custom)) {
      setNewOrderForm((prev) => ({
        ...prev,
        services: [...prev.services, custom],
        customServiceInput: "",
      }));
    }
  };

  const loadOrders = useCallback(async (tokenOverride?: string | null) => {
    try {
      if (isDemo) {
        const data = getDemoOrders();
        setOrders(data);
        setLoading(false);
        return;
      }
      const token = tokenOverride ?? (await getIdToken(false)) ?? workspaceToken;
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await getStudioOrdersAction(studioSlug, token);
      setOrders(data);
    } catch (err) {
      console.error("[OmsPage] Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [studioSlug, isDemo, workspaceToken, getIdToken]);

  useEffect(() => {
    if (isDemo) {
      void loadOrders();
      const unsub = subscribeToDemoStore(() => {
        void loadOrders();
      });
      return () => unsub();
    } else if (!authLoading) {
      void loadOrders(workspaceToken);
    }
  }, [studioSlug, isDemo, authLoading, workspaceToken, loadOrders]);

  // Load tasks when an order is selected
  useEffect(() => {
    if (selectedId) {
      if (isDemo) {
        setSelectedTasks(getDemoTasksByOrder(selectedId));
      } else if (workspaceToken) {
        void getOrderTasksAction(selectedId, studioSlug, workspaceToken).then(setSelectedTasks);
      }
    } else {
      setSelectedTasks([]);
    }
  }, [selectedId, isDemo, studioSlug, workspaceToken]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const parsedFinalPrice = Number(newOrderForm.finalConfirmedPrice) || 0;
    const parsedAdvance = Number(newOrderForm.advanceAmount) || 0;

    if (!newOrderForm.customerName.trim()) {
      setFormError("Customer full name is required.");
      setIsSubmitting(false);
      return;
    }

    if (!newOrderForm.eventDate) {
      setFormError("Event date is required.");
      setIsSubmitting(false);
      return;
    }

    if (newOrderForm.services.length === 0) {
      setFormError("Please select at least one service.");
      setIsSubmitting(false);
      return;
    }

    if (parsedAdvance > parsedFinalPrice) {
      setFormError("Advance amount cannot exceed the confirmed total price.");
      setIsSubmitting(false);
      return;
    }

    const resolvedEventType =
      newOrderForm.eventType === "Other"
        ? (newOrderForm.customEventType.trim() || "Special Occasion")
        : newOrderForm.eventType;

    const trimmedPhone = newOrderForm.customerPhone.trim();
    const resolvedPhone = trimmedPhone
      ? (trimmedPhone.startsWith("+") ? trimmedPhone : `${newOrderForm.countryCode.trim() || "+91"} ${trimmedPhone}`)
      : undefined;

    if (isDemo) {
      const res = createDemoOrder({
        customerName: newOrderForm.customerName,
        customerPhone: resolvedPhone,
        customerEmail: newOrderForm.customerEmail || undefined,
        eventType: resolvedEventType,
        eventDate: newOrderForm.eventDate,
        eventLocation: newOrderForm.eventLocation.trim() || undefined,
        services: newOrderForm.services,
        finalConfirmedPrice: parsedFinalPrice,
        advanceAmount: parsedAdvance,
      });

      setIsSubmitting(false);
      if (res.success && res.order) {
        setShowCreateModal(false);
        setNewOrderForm({
          ...DEFAULT_ORDER_FORM,
          passkeyPin: Math.floor(100000 + Math.random() * 900000).toString(),
        });
        setOrders(getDemoOrders());
        setSelectedId(res.order.id);
        if (res.tasks) setSelectedTasks(res.tasks);
      } else {
        setFormError("Failed to create order in demo mode.");
      }
      return;
    }

    // Refresh token before mutation
    const token = await getIdToken(true);
    if (!token) {
      setFormError("Authentication error. Please sign in again.");
      setIsSubmitting(false);
      return;
    }

    const res = await createOrderAction({
      idToken: token,
      studioId: studioSlug,
      customerName: newOrderForm.customerName,
      customerPhone: resolvedPhone,
      customerEmail: newOrderForm.customerEmail || undefined,
      passkeyPin: newOrderForm.passkeyPin,
      notifyWhatsApp: Boolean(newOrderForm.notifyWhatsApp && resolvedPhone),
      notifySms: Boolean(newOrderForm.notifySms && resolvedPhone),
      notifyEmail: Boolean(newOrderForm.notifyEmail && newOrderForm.customerEmail.trim()),
      eventType: resolvedEventType,
      eventDate: newOrderForm.eventDate,
      eventLocation: newOrderForm.eventLocation.trim() || undefined,
      services: newOrderForm.services,
      estimatedPrice: parsedFinalPrice,
      finalConfirmedPrice: parsedFinalPrice,
      advanceAmount: parsedAdvance,
    });

    setIsSubmitting(false);

    if (res.success && res.order) {
      setShowCreateModal(false);
      setNewOrderForm({
        ...DEFAULT_ORDER_FORM,
        passkeyPin: Math.floor(100000 + Math.random() * 900000).toString(),
      });
      await loadOrders();
      setSelectedId(res.order.id);
      if (res.tasks) setSelectedTasks(res.tasks);
    } else {
      setFormError(res.error || "Failed to create order");
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    if (isDemo && selected) {
      const res = updateDemoTaskStatus(taskId, newStatus);
      if (res.success && res.task) {
        setSelectedTasks((prev) => prev.map((t) => (t.id === taskId ? res.task! : t)));
        const refreshedOrders = getDemoOrders();
        setOrders(refreshedOrders);
      }
      return;
    }

    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!selected || !token) return;
    const res = await updateTaskStatusAction({
      idToken: token,
      studioId: studioSlug,
      taskId,
      orderId: selected.id,
      status: newStatus,
    });
    if (res.success && res.task) {
      setSelectedTasks((prev) => prev.map((t) => (t.id === taskId ? res.task! : t)));
      await loadOrders();
    }
  };

  const handleUpdatePayment = async (newPaymentStatus: PaymentStatus) => {
    if (!selected || isUpdatingPayment) return;
    setIsUpdatingPayment(true);

    if (isDemo) {
      const res = updateDemoPaymentStatus(selected.id, newPaymentStatus);
      setIsUpdatingPayment(false);
      if (res.success && res.order) {
        setOrders(getDemoOrders());
      }
      return;
    }

    const previousOrders = [...orders];
    // Optimistic UI update so owner sees immediate feedback
    if (newPaymentStatus === "PAID") {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selected.id
            ? {
                ...o,
                paymentStatus: "PAID",
                pricing: {
                  ...o.pricing,
                  advanceAmount: o.pricing.finalConfirmedPrice,
                  remainingAmount: 0,
                },
              }
            : o
        )
      );
    }

    try {
      const token = (await getIdToken(true)) ?? (await getIdToken(false)) ?? workspaceToken;
      if (!token) {
        setIsUpdatingPayment(false);
        setOrders(previousOrders);
        return;
      }
      const res = await updatePaymentStatusAction({
        idToken: token,
        studioId: studioSlug,
        orderId: selected.id,
        paymentStatus: newPaymentStatus,
      });
      setIsUpdatingPayment(false);
      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
        await loadOrders();
      } else {
        setOrders(previousOrders);
        alert(res.error || "Failed to update payment status");
      }
    } catch (err: unknown) {
      setIsUpdatingPayment(false);
      setOrders(previousOrders);
      alert(err instanceof Error ? err.message : "Failed to update payment status");
    }
  };

  const handleConfirmSuggestion = async (sug: ResourceSuggestion) => {
    if (!selected) return;
    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) return;

    const res = await assignResourceAction({
      orderId: selected.id,
      memberId: sug.memberId,
      memberName: sug.memberName,
      skill: sug.skill,
      studioId: studioSlug,
      idToken: token,
    });

    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
    } else {
      alert(res.error || "Failed to assign resource");
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelTargetOrder) return;
    setIsCancelling(true);

    if (isDemo) {
      const res = cancelDemoOrder(cancelTargetOrder.id, cancelReason.trim() || "Cancelled by studio owner");
      setIsCancelling(false);
      if (res.success && res.order) {
        setOrders(getDemoOrders());
        setCancelTargetOrder(null);
        setCancelReason("");
      }
      return;
    }

    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) {
      setIsCancelling(false);
      return;
    }

    const res = await cancelOrderAction({
      orderId: cancelTargetOrder.id,
      studioId: studioSlug,
      cancellationReason: cancelReason.trim() || "Cancelled by studio owner",
      idToken: token,
    });

    setIsCancelling(false);
    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
      setCancelTargetOrder(null);
      setCancelReason("");
    } else {
      alert(res.error || "Failed to cancel order");
    }
  };

  const handleConfirmDeleteOrder = async () => {
    if (!deleteTargetOrder) return;
    setIsDeleting(true);

    if (isDemo) {
      const res = deleteDemoOrder(deleteTargetOrder.id);
      setIsDeleting(false);
      if (res.success) {
        setOrders(getDemoOrders());
        if (selectedId === deleteTargetOrder.id) {
          setSelectedId(null);
        }
        setDeleteTargetOrder(null);
      }
      return;
    }

    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) {
      setIsDeleting(false);
      return;
    }

    const res = await deleteOrderAction({
      orderId: deleteTargetOrder.id,
      studioId: studioSlug,
      idToken: token,
    });

    setIsDeleting(false);
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== deleteTargetOrder.id));
      if (selectedId === deleteTargetOrder.id) {
        setSelectedId(null);
      }
      setDeleteTargetOrder(null);
    } else {
      alert(res.error || "Failed to delete order");
    }
  };

  const filtered = useMemo(
    () =>
      orders.filter(
        (order) =>
          (statusFilter === "ALL" || order.orderStatus === statusFilter) &&
          (!query ||
            `${order.customer.name} ${order.orderNumber} ${order.eventType}`
              .toLowerCase()
              .includes(query.toLowerCase()))
      ),
    [orders, statusFilter, query]
  );

  return (
    <div className="flex h-full bg-surface-app">
      <div
        className={`flex h-full flex-col ${
          selected ? "hidden lg:flex lg:w-1/2 border-r border-border-default" : "w-full"
        }`}
      >
        <header className="header-brand-blue">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge-brand-blue">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                  OMS · Order Management
                </span>
                <span className="badge-status-neutral">
                  Studio: <strong className="font-semibold text-text-primary">{studioSlug}</strong>
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                Order Management System
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Production lifecycle workflows, delivery milestones, and client accounts · {orders.length} Confirmed Orders
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="btn-brand-blue"
            >
              + Register Confirmed Order
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <input
              suppressHydrationWarning
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer, order number, event..."
              className="w-full rounded-xl border border-border-default bg-surface-app px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:bg-white focus:outline-none focus:border-brand-blue-primary focus:ring-2 focus:ring-brand-blue-soft"
            />
            <select
              suppressHydrationWarning
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | OrderStatus)
              }
              className="rounded-xl border border-border-default bg-surface-app px-3.5 py-2 text-xs font-semibold text-text-primary focus:bg-white focus:outline-none focus:border-brand-blue-primary focus:ring-2 focus:ring-brand-blue-soft"
            >
              <option value="ALL">All Lifecycle States</option>
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((key) => (
                <option key={key} value={key}>
                  {STATUS_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {loading && orders.length === 0 ? (
            <div className="py-16 text-center text-xs text-text-tertiary">Loading orders from server...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-default bg-white p-12 text-center">
              <p className="text-sm font-bold text-text-secondary">No active confirmed orders found</p>
              <p className="text-xs text-text-tertiary mt-1">
                Register a new confirmed order to start automated production workflow tracking.
              </p>
            </div>
          ) : (
            filtered.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  selectedId === order.id
                    ? "card-brand-blue"
                    : "border-border-default bg-white hover:border-brand-blue-light hover:shadow-xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-text-primary">
                        {order.customer.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-brand-blue-primary">
                        {order.orderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {order.eventType} · Event Date: {order.eventDate}
                    </p>
                    <p className="mt-2 text-xs text-text-tertiary">
                      Services: {order.services.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={STATUS_COLORS[order.orderStatus]}>
                      {STATUS_LABELS[order.orderStatus]}
                    </span>
                    <p className="mt-2 text-sm font-extrabold text-text-primary">
                      ₹{order.pricing.finalConfirmedPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Selected Order Detail Drawer */}
      {selected && (
        <aside className="h-full w-full lg:w-1/2 overflow-y-auto bg-white p-6 border-l border-border-default space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-border-default">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="lg:hidden rounded-lg p-1.5 text-text-tertiary hover:bg-surface-app hover:text-text-primary mr-1 shrink-0"
                aria-label="Back to order list"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0">
                <span className="font-mono text-xs font-bold text-brand-blue-primary block">{selected.orderNumber}</span>
                <h2 className="text-lg font-extrabold text-text-primary truncate">{selected.customer.name}</h2>
              </div>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-full p-2 text-text-tertiary hover:bg-surface-app hover:text-text-primary transition shrink-0"
              aria-label="Close details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 1. Order Lifecycle State */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Order Lifecycle State
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                <span
                  key={s}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition ${
                    selected.orderStatus === s
                      ? STATUS_COLORS[s]
                      : "bg-surface-app text-text-tertiary border-border-default"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Post-Event Production Workflow Tasks */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Post-Event Production Tasks ({selectedTasks.length})
              </h3>
            </div>

            {/* Booked Services Note */}
            {selected.services && selected.services.length > 0 && (
              <div className="mt-2.5 rounded-xl border border-border-default bg-surface-app p-2.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block">
                  Booked Services ({selected.services.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.services.map((svc) => (
                    <span
                      key={svc}
                      className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-semibold text-text-primary border border-border-default shadow-2xs"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 space-y-2">
              {selectedTasks.length === 0 ? (
                <p className="text-xs text-text-tertiary">No tasks generated for this order.</p>
              ) : (
                selectedTasks.map((task, idx) => (
                  <div
                    key={task.id ? `${task.id}-${idx}` : `task-${idx}`}
                    className="flex items-center justify-between rounded-xl border border-border-default bg-white p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-text-primary">{task.title}</p>
                      <p className="text-[10px] text-text-tertiary">
                        Category: {task.serviceCategory} · Sequence #{task.sequenceOrder}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className={`rounded-lg px-2 py-1 text-[10px] font-bold outline-none border border-transparent ${
                          TASK_STATUS_COLORS[task.status]
                        }`}
                      >
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="REVIEW">REVIEW</option>
                        <option value="REWORK">REWORK</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. Payment & Pricing Summary */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Payment & Pricing Summary
              </h3>
              <div className="flex gap-1.5">
                {selected.paymentStatus === "PAID" ? (
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-status-success">
                    Payment Completed
                  </span>
                ) : (
                  <button
                    disabled={isUpdatingPayment}
                    onClick={() => handleUpdatePayment("PAID")}
                    className="btn-brand-blue py-1 px-2.5 text-[11px] disabled:opacity-50"
                  >
                    {isUpdatingPayment ? "Updating..." : "Mark Paid"}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-2 space-y-2 rounded-2xl bg-surface-app p-4 border border-border-default text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Confirmed Price:</span>
                <span className="font-bold text-text-primary">₹{selected.pricing.finalConfirmedPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Advance Received:</span>
                <span className="font-bold text-brand-blue-primary">₹{selected.pricing.advanceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Remaining Balance:</span>
                <span className="font-bold text-brand-orange-primary">₹{selected.pricing.remainingAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border-default">
                <span className="text-text-secondary">Payment Status:</span>
                <span className={`font-bold ${selected.paymentStatus === "PAID" ? "text-status-success" : "text-text-primary"}`}>
                  {selected.paymentStatus === "PAID" ? "Payment Completed" : selected.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Pre-flight Operational Check Report */}
          {selected.preflightReport && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Pre-flight Operational Check
                </h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selected.preflightReport.hasConflicts
                      ? "bg-red-100 text-status-error"
                      : "bg-green-100 text-status-success"
                  }`}
                >
                  {selected.preflightReport.hasConflicts ? "Review Needed" : "Passed Clear"}
                </span>
              </div>

              {selected.preflightReport.eventDateConflicts.length > 0 && (
                <div className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <p className="font-bold">Overlapping Event Conflict:</p>
                  <p className="text-[11px] mt-0.5">
                    {selected.preflightReport.eventDateConflicts.join(", ")}
                  </p>
                </div>
              )}

              {selected.preflightReport.warnings.length > 0 && (
                <div className="space-y-1">
                  {selected.preflightReport.warnings.map((w, idx) => (
                    <p key={idx} className="text-[11px] text-amber-900 flex items-center gap-1.5">
                      <span>•</span> {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Automated Resource Suggestions (Owner Reviews & Confirms) */}
          {selected.resourceSuggestions && selected.resourceSuggestions.length > 0 && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Suggested Resources
                  </h4>
                  <p className="text-[10px] text-blue-700">System suggests · Owner reviews & confirms</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {selected.resourceSuggestions.length} Available
                </span>
              </div>

              <div className="space-y-2">
                {selected.resourceSuggestions.map((sug) => {
                  const isAssigned = (selected.assignedResources || []).some(
                    (r) => r.memberId === sug.memberId
                  );

                  return (
                    <div
                      key={sug.memberId}
                      className="flex items-center justify-between rounded-xl border border-blue-200 bg-white p-2.5 text-xs"
                    >
                      <div>
                        <span className="font-bold text-text-primary">{sug.memberName}</span>
                        <span className="ml-2 rounded bg-surface-app px-1.5 py-0.5 text-[10px] font-medium text-text-secondary border border-border-default">
                          {sug.skill}
                        </span>
                        <p className="text-[10px] text-text-tertiary mt-0.5">{sug.matchReason}</p>
                      </div>

                      {isAssigned ? (
                        <span className="text-[10px] font-bold text-status-success bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                          Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirmSuggestion(sug)}
                          className="rounded-lg bg-brand-blue-primary px-2.5 py-1 text-[11px] font-bold text-white hover:bg-sky-600 transition"
                        >
                          Confirm Assignment
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Customer Order Access & Tracking Link (Sharing Option Info) */}
          <div className="rounded-2xl border border-brand-blue-soft bg-brand-blue-background/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue-primary">
                Customer Order Access & Tracking Link
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                selected.customer?.email
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-brand-blue-primary"
              }`}>
                {selected.customer?.email ? "Email Auth Active" : "6-Digit PIN Protected"}
              </span>
            </div>

            {selected.customer?.email ? (
              /* EMAIL AUTH MODE */
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-border-default">
                  <div>
                    <span className="text-[10px] font-semibold text-text-tertiary block">Registered Customer Email</span>
                    <span className="font-mono text-xs font-extrabold text-text-primary tracking-wide">
                      {selected.customer.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(selected.customer.email!, "code")}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition shrink-0"
                  >
                    {copiedField === "code" ? "Copied Email!" : "Copy Email"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-border-default">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold text-text-tertiary block">Direct Tracking Link</span>
                    <span className="font-mono text-xs font-semibold text-brand-blue-primary truncate block">
                      {typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const link = typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`;
                        handleCopyText(link, "link");
                      }}
                      className="rounded-lg bg-brand-blue-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600 transition"
                    >
                      {copiedField === "link" ? "Copied Link!" : "Copy Link"}
                    </button>
                    <a
                      href={`/track/${selected.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-brand-blue-primary bg-white px-2.5 py-1.5 text-xs font-bold text-brand-blue-primary hover:bg-blue-50 transition"
                      title="Open tracking page in new tab"
                    >
                      Open Link
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Customer email on file (<strong className="text-text-primary">{selected.customer.email}</strong>). Customer authenticates directly with this email. No PIN required.
                </p>
              </div>
            ) : (
              /* 6-DIGIT PIN GUEST PASSKEY MODE */
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-border-default">
                  <div>
                    <span className="text-[10px] font-semibold text-text-tertiary block">6-Digit Guest Access PIN</span>
                    <span className="font-mono text-sm font-extrabold text-brand-blue-primary tracking-widest">
                      {selected.trackingPasskey.match(/\d{6}/)?.[0] || selected.orderNumber.match(/\d{6}/)?.[0] || "492015"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const pin = selected.trackingPasskey.match(/\d{6}/)?.[0] || selected.orderNumber.match(/\d{6}/)?.[0] || "492015";
                      handleCopyText(pin, "code");
                    }}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition shrink-0"
                  >
                    {copiedField === "code" ? "Copied PIN!" : "Copy 6-Digit PIN"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-border-default">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold text-text-tertiary block">Direct Tracking Link</span>
                    <span className="font-mono text-xs font-semibold text-brand-blue-primary truncate block">
                      {typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const link = typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`;
                        handleCopyText(link, "link");
                      }}
                      className="rounded-lg bg-brand-blue-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600 transition"
                    >
                      {copiedField === "link" ? "Copied Link!" : "Copy Link"}
                    </button>
                    <a
                      href={`/track/${selected.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-brand-blue-primary bg-white px-2.5 py-1.5 text-xs font-bold text-brand-blue-primary hover:bg-blue-50 transition"
                      title="Open tracking page in new tab"
                    >
                      Open Link
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-text-secondary leading-relaxed">
                  No customer email provided. Share this 6-digit PIN and tracking link with your customer for guest access.
                </p>
              </div>
            )}
          </div>

          {/* Cancellation & Soft-Deletion Operations */}
          <div className="border-t border-border-divider pt-4 flex items-center justify-between gap-2">
            {selected.orderStatus !== "CANCELLED" && (
              <button
                onClick={() => {
                  setCancelTargetOrder(selected);
                  setCancelReason("");
                }}
                className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
              >
                Cancel Order
              </button>
            )}
            <button
              onClick={() => setDeleteTargetOrder(selected)}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-status-error hover:bg-red-100 transition ml-auto"
            >
              Delete Order (14-day Recovery)
            </button>
          </div>
        </aside>
      )}

      {/* New Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150 my-auto">
            {/* Modal Header (Pinned at Top) */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border-default shrink-0">
              <div>
                <div className="badge-brand-blue mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                  New Confirmed Order
                </div>
                <h3 className="text-lg font-bold text-text-primary">Register Confirmed Order</h3>
                <p className="text-xs text-text-secondary">Begins automated 3-state production workflow</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-app transition"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateOrder} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 flex-1">
                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-text-primary">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh & Ananya"
                    value={newOrderForm.customerName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-primary">
                      Phone Number <span className="font-normal text-text-tertiary">(Optional)</span>
                    </label>
                    <div className="mt-1 flex gap-1.5">
                      <input
                        type="text"
                        placeholder="+91"
                        value={newOrderForm.countryCode}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, countryCode: e.target.value })}
                        className="w-20 rounded-xl border border-border-default bg-surface-app px-2 py-2 text-xs font-semibold text-text-primary text-center outline-none focus:border-brand-blue-primary"
                        title="Country Code (e.g. +91, +1, +44)"
                      />
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={newOrderForm.customerPhone}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                        className="flex-1 min-w-0 rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary">
                      Customer Email <span className="font-normal text-text-tertiary">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="client@gmail.com"
                      value={newOrderForm.customerEmail}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, customerEmail: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    />
                  </div>
                </div>

                {/* Dynamic Automated Customer Notifications (displayed only when phone or email is provided) */}
                {(Boolean(newOrderForm.customerPhone.trim()) || Boolean(newOrderForm.customerEmail.trim())) && (
                  <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-3.5 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950">
                        Automated Client Notifications
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Live Dispatch
                      </span>
                    </div>

                    <div className="space-y-2 pt-0.5">
                      {Boolean(newOrderForm.customerPhone.trim()) && (
                        <>
                          <label className="flex items-center gap-2.5 select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newOrderForm.notifyWhatsApp}
                              onChange={(e) =>
                                setNewOrderForm({ ...newOrderForm, notifyWhatsApp: e.target.checked })
                              }
                              className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary"
                            />
                            <span className="text-xs font-medium text-text-primary">
                              Send automated order updates via <strong>WhatsApp</strong>
                            </span>
                          </label>

                          <label className="flex items-center gap-2.5 select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newOrderForm.notifySms}
                              onChange={(e) =>
                                setNewOrderForm({ ...newOrderForm, notifySms: e.target.checked })
                              }
                              className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary"
                            />
                            <span className="text-xs font-medium text-text-primary">
                              Send automated order updates via <strong>SMS</strong>
                            </span>
                          </label>
                        </>
                      )}

                      {Boolean(newOrderForm.customerEmail.trim()) && (
                        <label className="flex items-center gap-2.5 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newOrderForm.notifyEmail}
                            onChange={(e) =>
                              setNewOrderForm({ ...newOrderForm, notifyEmail: e.target.checked })
                            }
                            className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary"
                          />
                          <span className="text-xs font-medium text-text-primary">
                            Send automated order updates via <strong>Email</strong>
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Type Dropdown & Custom Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-primary">Event Type *</label>
                    <select
                      value={newOrderForm.eventType}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, eventType: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border-default bg-white px-3.5 py-2 text-xs font-medium text-text-primary outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    >
                      {PRESET_EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {newOrderForm.eventType === "Other" && (
                      <input
                        type="text"
                        placeholder="Specify event type (Optional)"
                        value={newOrderForm.customEventType}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, customEventType: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-border-default px-3 py-1.5 text-xs outline-none focus:border-brand-blue-primary"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary">Event Date *</label>
                    <input
                      type="date"
                      required
                      value={newOrderForm.eventDate}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, eventDate: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary">
                    Event Location <span className="font-normal text-text-tertiary">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai, Bangalore"
                    value={newOrderForm.eventLocation}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, eventLocation: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                </div>

                {/* Studio Services & Deliverables Dropdown with Multi-Select */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-text-primary">
                      Studio Services &amp; Deliverables *
                    </label>
                    <span className="text-[10px] font-semibold text-text-tertiary">
                      {newOrderForm.services.length} Selected
                    </span>
                  </div>

                  {/* Combobox Input Field Trigger */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select or type custom service & press Enter..."
                      value={newOrderForm.customServiceInput}
                      onChange={(e) => {
                        setNewOrderForm({ ...newOrderForm, customServiceInput: e.target.value });
                        if (!showServicesDropdown) setShowServicesDropdown(true);
                      }}
                      onFocus={() => setShowServicesDropdown(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const custom = newOrderForm.customServiceInput.trim();
                          if (custom && !newOrderForm.services.includes(custom)) {
                            setNewOrderForm({
                              ...newOrderForm,
                              services: [...newOrderForm.services, custom],
                              customServiceInput: "",
                            });
                          }
                        }
                      }}
                      className="w-full rounded-xl border border-border-default px-3.5 py-2 pr-10 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    />
                    <div 
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-tertiary hover:text-brand-blue-primary"
                      onClick={() => setShowServicesDropdown((prev) => !prev)}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${showServicesDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Selected Options Displayed Below the Input Field */}
                  {newOrderForm.services.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {newOrderForm.services.map((svc) => (
                        <span
                          key={svc}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-50 px-2.5 py-1 text-xs font-semibold text-brand-blue-primary border border-brand-blue-soft"
                        >
                          <span>{svc}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleService(svc);
                            }}
                            className="text-xs font-bold text-brand-blue-primary hover:text-red-500 cursor-pointer ml-0.5 leading-none"
                            title={`Remove ${svc}`}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                    {/* Dropdown Options Popup */}
                    {showServicesDropdown && (
                      <div className="absolute top-full z-20 left-0 right-0 mt-1.5 rounded-2xl border border-border-default bg-white shadow-xl p-2.5 space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
                        <div className="flex items-center justify-between px-2 pb-1 border-b border-border-default text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                          <span>Select Services ({newOrderForm.services.length} selected)</span>
                          <button
                            type="button"
                            onClick={() => setShowServicesDropdown(false)}
                            className="text-brand-blue-primary hover:underline lowercase font-semibold"
                          >
                            done
                          </button>
                        </div>

                        <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
                          {PRESET_STUDIO_SERVICES
                            .filter((svc) => svc.toLowerCase().includes(newOrderForm.customServiceInput.toLowerCase()))
                            .map((svc) => {
                            const isSvcSelected = newOrderForm.services.includes(svc);
                            return (
                              <label
                                key={svc}
                                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none ${
                                  isSvcSelected
                                    ? "bg-brand-blue-50/80 text-brand-blue-primary"
                                    : "text-text-primary hover:bg-surface-app"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isSvcSelected}
                                    onChange={() => toggleService(svc)}
                                    className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary shrink-0"
                                  />
                                  <span className="truncate">{svc}</span>
                                </div>
                                {isSvcSelected && (
                                  <span className="text-[10px] font-bold text-brand-blue-primary shrink-0 ml-2">Selected</span>
                                )}
                              </label>
                            );
                          })}

                          {/* Custom Services Added by User */}
                          {newOrderForm.services
                            .filter((s) => !PRESET_STUDIO_SERVICES.includes(s as any))
                            .map((customSvc) => (
                              <label
                                key={customSvc}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-blue-50/80 text-brand-blue-primary cursor-pointer transition select-none"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => toggleService(customSvc)}
                                    className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary shrink-0"
                                  />
                                  <span className="truncate">{customSvc}</span>
                                </div>
                                <span className="text-[10px] font-bold text-brand-blue-primary shrink-0 ml-2">Custom</span>
                              </label>
                            ))}
                            
                          {/* Prompt to press enter if typing custom that doesn't match presets */}
                          {newOrderForm.customServiceInput.trim() && 
                           !PRESET_STUDIO_SERVICES.some(s => s.toLowerCase() === newOrderForm.customServiceInput.trim().toLowerCase()) &&
                           !newOrderForm.services.includes(newOrderForm.customServiceInput.trim()) && (
                            <div className="px-2.5 py-1.5 text-[10px] font-medium text-text-tertiary italic">
                              Press Enter to add "{newOrderForm.customServiceInput.trim()}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Pricing & Advance with Validation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-primary">Confirmed Total Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 75,000"
                      value={newOrderForm.finalConfirmedPrice ?? ""}
                      onChange={(e) =>
                        setNewOrderForm({
                          ...newOrderForm,
                          finalConfirmedPrice: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary">Advance Received (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 25,000"
                      value={newOrderForm.advanceAmount ?? ""}
                      onChange={(e) =>
                        setNewOrderForm({
                          ...newOrderForm,
                          advanceAmount: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                        })
                      }
                      className={`mt-1 w-full rounded-xl border px-3.5 py-2 text-xs outline-none focus:ring-1 ${
                        Number(newOrderForm.advanceAmount) > Number(newOrderForm.finalConfirmedPrice) && Number(newOrderForm.finalConfirmedPrice) > 0
                          ? "border-status-error bg-red-50/50 text-status-error focus:ring-red-400"
                          : "border-border-default focus:border-brand-blue-primary focus:ring-brand-blue-primary"
                      }`}
                    />
                  </div>
                  {Number(newOrderForm.advanceAmount) > Number(newOrderForm.finalConfirmedPrice) && Number(newOrderForm.finalConfirmedPrice) > 0 && (
                    <div className="col-span-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] font-semibold text-status-error">
                      Advance amount cannot exceed the confirmed total price.
                    </div>
                  )}
                </div>

                {/* 6-Digit Guest Access PIN & Tracking Passkey */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">
                      6-Digit Guest Access PIN
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewOrderForm({
                          ...newOrderForm,
                          passkeyPin: Math.floor(100000 + Math.random() * 900000).toString(),
                        })
                      }
                      className="text-[11px] font-bold text-brand-blue-primary hover:underline"
                    >
                      Regenerate PIN
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {newOrderForm.customerEmail.trim() ? (
                      <>
                        Order tracking link will be sent to <strong className="font-semibold text-amber-950">{newOrderForm.customerEmail.trim()}</strong>. Your customer can track with their email or access instantly as a guest using this 6-digit PIN.
                      </>
                    ) : (
                      <>
                        No customer email provided. Share this 6-digit PIN with your customer for guest order tracking.
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={newOrderForm.passkeyPin}
                      onChange={(e) =>
                        setNewOrderForm({ ...newOrderForm, passkeyPin: e.target.value.replace(/\D/g, "").slice(0, 6) })
                      }
                      className="w-32 rounded-xl border border-amber-300 bg-white px-3.5 py-1.5 font-mono text-sm font-extrabold tracking-widest text-text-primary text-center outline-none focus:border-brand-blue-primary"
                    />
                    <span className="text-[11px] text-amber-900/80">
                      Tracking Code: <span className="font-mono font-bold">FOC-{studioSlug.slice(0, 4).toUpperCase()}-{newOrderForm.passkeyPin}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Pinned at Bottom) */}
              <div className="p-4 sm:px-6 border-t border-border-default bg-surface-app/40 shrink-0 flex gap-3 justify-end rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-brand-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (Number(newOrderForm.advanceAmount) > Number(newOrderForm.finalConfirmedPrice) &&
                      Number(newOrderForm.finalConfirmedPrice) > 0)
                  }
                  className="btn-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Confirm & Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Cancellation Dialog */}
      {cancelTargetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div>
                <h3 className="text-base font-bold text-text-primary">Cancel Order</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Order #{cancelTargetOrder.orderNumber} · {cancelTargetOrder.customer.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCancelTargetOrder(null)}
                className="text-text-tertiary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-app transition"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                Cancelling this order will mark it as Cancelled in the production pipeline and stop automated notifications.
              </p>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Cancellation Reason <span className="font-normal text-text-tertiary">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Client postponed indefinitely or requested cancellation"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-border-default p-3 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
              <button
                type="button"
                onClick={() => setCancelTargetOrder(null)}
                className="btn-brand-outline"
                disabled={isCancelling}
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelOrder}
                disabled={isCancelling}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50 transition"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Soft-Delete Dialog */}
      {deleteTargetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div>
                <h3 className="text-base font-bold text-status-error">Delete Order</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Order #{deleteTargetOrder.orderNumber} · {deleteTargetOrder.customer.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTargetOrder(null)}
                className="text-text-tertiary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-app transition"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-4 space-y-2">
              <p className="text-xs text-text-primary font-semibold">
                Are you sure you want to soft-delete this order?
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                This order will be removed from your active dashboard. It can be fully recovered from the studio archives within 14 days before permanent purge.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
              <button
                type="button"
                onClick={() => setDeleteTargetOrder(null)}
                className="btn-brand-outline"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteOrder}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {isDeleting ? "Deleting..." : "Delete Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
