"use client";

import { useMemo, useState, useEffect, use } from "react";
import { OrderStatus, TaskStatus, Order, Task, PaymentStatus } from "@focoman/types";
import {
  getStudioOrdersAction,
  getOrderTasksAction,
  createOrderAction,
  updateTaskStatusAction,
  updatePaymentStatusAction,
} from "@/actions/orderActions";
import { getCurrentUserIdToken } from "@/lib/firebaseAuth";

const STATUS_LABELS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "Awaiting Event",
  POST_EVENT_IN_PROGRESS: "Post-Event In Progress",
  COMPLETED: "Completed",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "bg-sky-100 text-sky-800 border-sky-300",
  POST_EVENT_IN_PROGRESS: "bg-amber-100 text-amber-800 border-amber-300",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  ASSIGNED: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  REVIEW: "bg-purple-100 text-purple-700",
  REWORK: "bg-red-100 text-red-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

export default function OmsPage({
  params,
}: {
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = use(params);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

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

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = await getCurrentUserIdToken(false);
      setIdToken(token);
      if (!token) {
        console.error("[OmsPage] No auth token — user must be signed in.");
        setLoading(false);
        return;
      }
      const data = await getStudioOrdersAction(studioSlug, token);
      setOrders(data);
      if (selected) {
        const refreshed = data.find((o) => o.id === selected.id);
        if (refreshed) setSelected(refreshed);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, [studioSlug]);

  // Load tasks when an order is selected
  useEffect(() => {
    if (selected && idToken) {
      void getOrderTasksAction(selected.id, idToken).then(setSelectedTasks);
    } else {
      setSelectedTasks([]);
    }
  }, [selected?.id, idToken]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Refresh token before mutation
    const token = await getCurrentUserIdToken(true);
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
    if (!selected || !idToken) return;
    const res = await updateTaskStatusAction({
      idToken,
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
    if (!selected || !idToken) return;
    const res = await updatePaymentStatusAction({
      idToken,
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
    <div className="flex h-full bg-slate-50">
      <div
        className={`flex h-full flex-col ${
          selected ? "w-1/2 border-r border-slate-200" : "w-full"
        }`}
      >
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Order Management System (OMS)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Studio: <span className="font-bold text-slate-700">{studioSlug}</span> · {orders.length} Confirmed Orders
              </p>
            </div>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setFormError(null);
              }}
              className="rounded-xl bg-brand-orange-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-orange-600"
            >
              + Register Confirmed Order
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer, order number, event..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | OrderStatus)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
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
            <div className="py-16 text-center text-xs text-slate-400">Loading orders from server...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-slate-600">No active confirmed orders found</p>
              <p className="text-xs text-slate-400 mt-1">
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
                    ? "border-brand-orange-primary bg-orange-50/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {order.customer.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-brand-orange-primary">
                        {order.orderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {order.eventType} — Event Date: {order.eventDate}
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      Services: {order.services.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                        STATUS_COLORS[order.orderStatus]
                      }`}
                    >
                      {STATUS_LABELS[order.orderStatus]}
                    </span>
                    <p className="mt-2 text-sm font-extrabold text-slate-900">
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
        <aside className="h-full w-1/2 overflow-y-auto bg-white p-6 border-l border-slate-200 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold text-brand-orange-primary">{selected.orderNumber}</span>
              <h2 className="text-lg font-extrabold text-slate-900">{selected.customer.name}</h2>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Order Access Code Info Card */}
          <div className="rounded-2xl border border-brand-orange-soft bg-brand-orange-background/30 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange-primary">
              Customer Order Access Code
            </span>
            <p className="font-mono text-base font-extrabold text-slate-900">
              {selected.trackingPasskey}
            </p>
            <p className="text-[11px] text-slate-500">
              Share this access code with your customer for guest order tracking on the home page.
            </p>
          </div>

          {/* Order Lifecycle State */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Order Lifecycle State
            </h3>
            <div className="mt-2 flex gap-2">
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                <span
                  key={s}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold border ${
                    selected.orderStatus === s
                      ? STATUS_COLORS[s]
                      : "bg-slate-50 text-slate-400 border-slate-200"
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment & Pricing Summary
              </h3>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleUpdatePayment("PAYMENT_COMPLETED")}
                  className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"
                >
                  Mark Paid
                </button>
              </div>
            </div>
            <div className="mt-2 space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Confirmed Price:</span>
                <span className="font-bold text-slate-900">₹{selected.pricing.finalConfirmedPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Advance Received:</span>
                <span className="font-bold text-emerald-600">₹{selected.pricing.advanceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-bold text-amber-600">₹{selected.pricing.remainingAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold text-slate-900">{selected.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Post-Event Production Workflow Tasks */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Post-Event Production Tasks ({selectedTasks.length})
            </h3>
            <div className="mt-3 space-y-2">
              {selectedTasks.length === 0 ? (
                <p className="text-xs text-slate-400">No tasks generated for this order.</p>
              ) : (
                selectedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{task.title}</p>
                      <p className="text-[10px] text-slate-400">
                        Category: {task.serviceCategory} · Sequence #{task.sequenceOrder}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className={`rounded-lg px-2 py-1 text-[10px] font-bold outline-none ${
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
        </aside>
      )}

      {/* New Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Register Confirmed Order</h3>
                <p className="text-xs text-slate-500">Begins automated 3-state production workflow</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
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
                <label className="block text-xs font-bold text-slate-700">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Priya"
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-orange-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newOrderForm.customerPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-orange-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={newOrderForm.customerEmail}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerEmail: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-orange-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Event Type *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wedding Reception"
                    value={newOrderForm.eventType}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, eventType: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-orange-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Event Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={newOrderForm.eventDate}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, eventDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-orange-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Confirmed Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newOrderForm.finalConfirmedPrice}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, finalConfirmedPrice: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-orange-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Advance Received (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newOrderForm.advanceAmount}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, advanceAmount: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-brand-orange-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-orange-primary px-5 py-2 text-xs font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
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
