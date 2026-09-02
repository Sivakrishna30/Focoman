"use client";
import { useMemo, useState, use } from "react";
import { OrderStatus, TaskStatus, Order } from "@focoman/types";

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

export default function OmsPage({
  params,
}: {
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = use(params);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [query, setQuery] = useState("");

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
                Studio: {studioSlug} — Confirmed Orders & Production Workflow
              </p>
            </div>
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
              <option value="ALL">All Order Lifecycle States</option>
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((key) => (
                <option key={key} value={key}>
                  {STATUS_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelected(order)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-400 hover:shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {order.customer.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {order.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {order.eventType} — Event Date: {order.eventDate}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    Resources: {order.assignedResources.length > 0
                      ? order.assignedResources.map(r => r.memberName).join(", ")
                      : "No resources assigned"}
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
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-slate-600">No active confirmed orders found</p>
              <p className="text-xs text-slate-400 mt-1">
                Register a new confirmed order to begin workflow tracking.
              </p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <aside className="h-full w-1/2 overflow-y-auto bg-white p-6 border-l border-slate-200">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400">{selected.orderNumber}</span>
              <h2 className="text-lg font-extrabold text-slate-900">{selected.customer.name}</h2>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 space-y-6">
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

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment & Pricing Summary
              </h3>
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
          </div>
        </aside>
      )}
    </div>
  );
}
