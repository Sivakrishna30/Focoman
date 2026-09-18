"use client";

import { useMemo, useState, useEffect, useCallback, use } from "react";
import { OrderStatus, TaskStatus, Order, Task, PaymentStatus } from "@focoman/types";
import {
  getStudioOrdersAction,
  getOrderTasksAction,
  createOrderAction,
  updateTaskStatusAction,
  updatePaymentStatusAction,
} from "@/actions/orderActions";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";
import {
  isDemoStudio,
  getDemoOrders,
  getDemoTasksByOrder,
  createDemoOrder,
  updateDemoTaskStatus,
  updateDemoPaymentStatus,
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
  const { idToken: workspaceToken, authLoading, getIdToken } = useStudioWorkspace();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // New Order Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    eventType: "Wedding Reception",
    eventDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
    eventLocation: "City Hall",
    services: ["Photography", "Videography", "Album"],
    finalConfirmedPrice: 75000,
    advanceAmount: 25000,
  });

  const isDemo = isDemoStudio(studioSlug);

  const loadOrders = useCallback(async (tokenOverride?: string | null) => {
    try {
      setLoading(true);
      if (isDemo) {
        const data = getDemoOrders();
        setOrders(data);
        if (selected) {
          const refreshed = data.find((o) => o.id === selected.id);
          if (refreshed) setSelected(refreshed);
        }
        setLoading(false);
        return;
      }
      const token = tokenOverride ?? workspaceToken ?? (await getIdToken(false));
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await getStudioOrdersAction(studioSlug, token);
      setOrders(data);
      if (selected) {
        const refreshed = data.find((o) => o.id === selected.id);
        if (refreshed) setSelected(refreshed);
      }
    } catch (err) {
      console.error("[OmsPage] Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [studioSlug, isDemo, workspaceToken, getIdToken, selected]);

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
    if (selected) {
      if (isDemo) {
        setSelectedTasks(getDemoTasksByOrder(selected.id));
      } else if (workspaceToken) {
        void getOrderTasksAction(selected.id, workspaceToken).then(setSelectedTasks);
      }
    } else {
      setSelectedTasks([]);
    }
  }, [selected, isDemo, workspaceToken]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    if (isDemo) {
      const res = createDemoOrder({
        customerName: newOrderForm.customerName,
        customerPhone: newOrderForm.customerPhone || undefined,
        customerEmail: newOrderForm.customerEmail || undefined,
        eventType: newOrderForm.eventType,
        eventDate: newOrderForm.eventDate,
        eventLocation: newOrderForm.eventLocation,
        services: newOrderForm.services,
        finalConfirmedPrice: newOrderForm.finalConfirmedPrice,
        advanceAmount: newOrderForm.advanceAmount,
      });

      setIsSubmitting(false);
      if (res.success && res.order) {
        setShowCreateModal(false);
        setOrders(getDemoOrders());
        setSelected(res.order);
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
      customerPhone: newOrderForm.customerPhone || undefined,
      customerEmail: newOrderForm.customerEmail || undefined,
      eventType: newOrderForm.eventType,
      eventDate: newOrderForm.eventDate,
      eventLocation: newOrderForm.eventLocation,
      services: newOrderForm.services,
      estimatedPrice: newOrderForm.finalConfirmedPrice,
      finalConfirmedPrice: newOrderForm.finalConfirmedPrice,
      advanceAmount: newOrderForm.advanceAmount,
    });

    setIsSubmitting(false);

    if (res.success && res.order) {
      setShowCreateModal(false);
      await loadOrders();
      setSelected(res.order);
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
        const refreshedSelected = refreshedOrders.find((o) => o.id === selected.id);
        if (refreshedSelected) setSelected(refreshedSelected);
      }
      return;
    }

    const token = workspaceToken ?? (await getIdToken(false));
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
    if (isDemo && selected) {
      const res = updateDemoPaymentStatus(selected.id, newPaymentStatus);
      if (res.success && res.order) {
        setSelected(res.order);
        setOrders(getDemoOrders());
      }
      return;
    }

    const token = workspaceToken ?? (await getIdToken(false));
    if (!selected || !token) return;
    const res = await updatePaymentStatusAction({
      idToken: token,
      studioId: studioSlug,
      orderId: selected.id,
      paymentStatus: newPaymentStatus,
    });
    if (res.success && res.order) {
      setSelected(res.order);
      await loadOrders();
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
          selected ? "w-1/2 border-r border-border-default" : "w-full"
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
              onClick={() => {
                setShowCreateModal(true);
                setFormError(null);
              }}
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
                onClick={() => setSelected(order)}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  selected?.id === order.id
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
        <aside className="h-full w-1/2 overflow-y-auto bg-white p-6 border-l border-border-default space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-border-default">
            <div>
              <span className="font-mono text-xs font-bold text-brand-blue-primary">{selected.orderNumber}</span>
              <h2 className="text-lg font-extrabold text-text-primary">{selected.customer.name}</h2>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-full p-2 text-text-tertiary hover:bg-surface-app hover:text-text-primary transition"
            >
              ✕
            </button>
          </div>

          {/* Order Access Code Info Card */}
          <div className="rounded-2xl border border-brand-blue-soft bg-brand-blue-background/60 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue-primary">
              Customer Order Access Code
            </span>
            <p className="font-mono text-base font-extrabold text-text-primary">
              {selected.trackingPasskey}
            </p>
            <p className="text-[11px] text-text-secondary">
              Share this access code with your customer for guest order tracking on the home page.
            </p>
          </div>

          {/* Order Lifecycle State */}
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

          {/* Payment & Pricing Summary */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Payment & Pricing Summary
              </h3>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleUpdatePayment("PAID")}
                  className="btn-brand-blue py-1 px-2.5 text-[11px]"
                >
                  Mark Paid
                </button>
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
                <span className="font-bold text-text-primary">{selected.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Post-Event Production Workflow Tasks */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Post-Event Production Tasks ({selectedTasks.length})
            </h3>
            <div className="mt-3 space-y-2">
              {selectedTasks.length === 0 ? (
                <p className="text-xs text-text-tertiary">No tasks generated for this order.</p>
              ) : (
                selectedTasks.map((task) => (
                  <div
                    key={task.id}
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

          {/* Google Drive Integration & In-App Preview */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                  ▲
                </span>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Google Drive Order Folder</h4>
                  <p className="text-[10px] text-text-secondary">RAW photos & final album deliverables</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Connected
              </span>
            </div>

            <div className="rounded-xl border border-border-default bg-white p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-secondary truncate">
                  📁 drive.google.com/drive/folders/{selected.orderNumber.toLowerCase()}...
                </span>
                <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  In-App Preview Active
                </span>
              </div>

              {/* Sample Embedded Preview Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { name: "RAW_0142.CR3", tag: "Selected", color: "bg-brand-blue-50 text-brand-blue-primary border-brand-blue-soft" },
                  { name: "RAW_0188.CR3", tag: "Selected", color: "bg-brand-blue-50 text-brand-blue-primary border-brand-blue-soft" },
                  { name: "Album_v1.pdf", tag: "Proof Ready", color: "bg-purple-50 text-purple-700 border-purple-200" },
                ].map((item) => (
                  <div key={item.name} className="flex flex-col items-center justify-center rounded-lg border border-border-default bg-surface-app p-2 text-center">
                    <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-mono mb-1">
                      🖼️
                    </div>
                    <span className="text-[9px] font-semibold text-text-primary truncate w-full">{item.name}</span>
                    <span className={`mt-1 text-[8px] font-bold px-1.5 py-0.2 rounded border ${item.color}`}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
              
              <p className="text-[10px] text-text-tertiary text-center pt-1">
                Previewing directly inside Focoman · Zero external tabs required
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* New Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-border-default">
              <div>
                <div className="badge-brand-blue mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                  New Confirmed Order
                </div>
                <h3 className="text-lg font-bold text-text-primary">Register Confirmed Order</h3>
                <p className="text-xs text-text-secondary">Begins automated 3-state production workflow</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-tertiary hover:text-text-primary font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Priya"
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newOrderForm.customerPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={newOrderForm.customerEmail}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerEmail: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary">Event Type *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wedding Reception"
                    value={newOrderForm.eventType}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, eventType: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary">Event Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={newOrderForm.eventDate}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, eventDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary">Confirmed Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newOrderForm.finalConfirmedPrice}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, finalConfirmedPrice: Number(e.target.value) })
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
                    value={newOrderForm.advanceAmount}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, advanceAmount: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-brand-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-brand-blue"
                >
                  {isSubmitting ? "Creating..." : "Confirm & Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
