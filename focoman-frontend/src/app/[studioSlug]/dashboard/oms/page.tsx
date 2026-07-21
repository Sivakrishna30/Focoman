"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import { getStudioBySlug, getOrdersByStudio, OrderMock, OrderStatus } from "@/services/mockDb";

const STATUS_COLORS: Record<string, string> = {
  LEAD: "bg-gray-100 text-gray-600",
  BOOKING_CONFIRMED: "bg-brand-blue-background text-brand-blue-primary",
  SHOOT_SCHEDULED: "bg-sky-100 text-sky-700",
  SHOOT_COMPLETED: "bg-amber-50 text-amber-700",
  EDITING: "bg-brand-purple-background text-brand-purple-primary",
  ALBUM_DESIGN: "bg-indigo-50 text-indigo-700",
  DELIVERY_READY: "bg-green-50 text-green-700",
  COMPLETED: "bg-green-100 text-green-800",
  OVER_SLA: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  LEAD: "Lead",
  BOOKING_CONFIRMED: "Booking Confirmed",
  SHOOT_SCHEDULED: "Shoot Scheduled",
  SHOOT_COMPLETED: "Shoot Done",
  EDITING: "Editing",
  ALBUM_DESIGN: "Album Design",
  DELIVERY_READY: "Delivery Ready",
  COMPLETED: "Completed",
  OVER_SLA: "Over SLA",
};

const ALL_STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[];

export default function OmsPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const studio = getStudioBySlug(studioSlug);
  if (!studio) notFound();

  const allOrders = getOrdersByStudio(studio.studioId);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderMock | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allOrders.filter((o) => {
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    const matchSearch =
      !searchQuery ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex h-full">
      {/* Orders List Panel */}
      <div className={`flex flex-col ${selectedOrder ? "w-1/2 border-r border-border-default" : "w-full"} h-full`}>
        {/* Header */}
        <div className="border-b border-border-default bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-text-primary">Order Management System</h1>
              <p className="text-xs text-text-tertiary">{allOrders.length} total orders · {studio.brandName}</p>
            </div>
            <button className="rounded-xl bg-brand-blue-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600">
              + New Order
            </button>
          </div>

          {/* Search + Filter */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search by customer, order ID, event type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-blue-primary"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-blue-primary"
            >
              <option value="ALL">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-text-tertiary">No orders found.</div>
          ) : (
            filtered.map((order) => (
              <div
                key={order.orderId}
                onClick={() => setSelectedOrder(order.orderId === selectedOrder?.orderId ? null : order)}
                className={`cursor-pointer rounded-2xl border p-4 transition hover:shadow-sm ${
                  selectedOrder?.orderId === order.orderId
                    ? "border-brand-blue-primary bg-brand-blue-background/20"
                    : "border-border-default bg-white hover:border-brand-blue-light"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-text-primary truncate">{order.customerName}</p>
                      {order.status === "OVER_SLA" && (
                        <span className="shrink-0 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">URGENT</span>
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary">{order.eventType} · {order.eventDate}</p>
                    <p className="text-[10px] text-text-tertiary font-mono mt-0.5">{order.displayId}</p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    <p className="text-xs font-bold text-text-primary">₹{order.paidAmount.toLocaleString()}<span className="font-normal text-text-tertiary"> / ₹{order.amount.toLocaleString()}</span></p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {order.assignedTeam.map((m) => (
                    <span key={m} className="rounded-full bg-surface-app px-2 py-0.5 text-[10px] text-text-secondary border border-border-default">{m}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <div className="w-1/2 flex flex-col h-full overflow-y-auto bg-white">
          <div className="sticky top-0 z-10 border-b border-border-default bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-text-primary">{selectedOrder.customerName}</h2>
              <p className="text-xs font-mono text-text-tertiary">{selectedOrder.displayId}</p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-app"
            >
              Close
            </button>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Status & Actions */}
            <div className="flex items-center justify-between rounded-xl border border-border-default bg-surface-app p-4">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[selectedOrder.status]}`}>
                {STATUS_LABELS[selectedOrder.status]}
              </span>
              <div className="flex gap-2">
                <button className="rounded-lg border border-border-default bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-brand-blue-light">
                  Edit Order
                </button>
                <button className="rounded-lg bg-brand-blue-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-600">
                  Update Status
                </button>
              </div>
            </div>

            {/* Order Details */}
            <div className="rounded-xl border border-border-default p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Order Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-text-tertiary">Event Type</p><p className="font-semibold text-text-primary">{selectedOrder.eventType}</p></div>
                <div><p className="text-text-tertiary">Event Date</p><p className="font-semibold text-text-primary">{selectedOrder.eventDate}</p></div>
                <div><p className="text-text-tertiary">Mobile</p><p className="font-semibold text-text-primary">{selectedOrder.customerMobile}</p></div>
                <div><p className="text-text-tertiary">Venue</p><p className="font-semibold text-text-primary">{selectedOrder.venue || "—"}</p></div>
                <div><p className="text-text-tertiary">Package Amount</p><p className="font-bold text-brand-orange-primary">₹{selectedOrder.amount.toLocaleString()}</p></div>
                <div><p className="text-text-tertiary">Paid / Pending</p><p className="font-bold text-text-primary">₹{selectedOrder.paidAmount.toLocaleString()} / <span className="text-red-500">₹{(selectedOrder.amount - selectedOrder.paidAmount).toLocaleString()}</span></p></div>
              </div>
            </div>

            {/* Assigned Team */}
            <div className="rounded-xl border border-border-default p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Assigned Crew</h3>
                <button className="text-xs font-semibold text-brand-blue-primary hover:underline">+ Assign</button>
              </div>
              <div className="space-y-1.5">
                {selectedOrder.assignedTeam.map((m) => (
                  <div key={m} className="flex items-center justify-between rounded-lg bg-surface-app px-3 py-2">
                    <p className="text-xs font-medium text-text-primary">{m}</p>
                    <button className="text-[10px] text-red-400 hover:text-red-600">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Timeline */}
            <div className="rounded-xl border border-border-default p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Workflow Timeline</h3>
                <button className="text-xs font-semibold text-brand-blue-primary hover:underline">Mark Stage</button>
              </div>
              <div className="space-y-2">
                {selectedOrder.workflowTimeline.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${step.completed ? "bg-green-500" : "bg-gray-200"}`} />
                      <span className={step.completed ? "font-medium text-text-primary" : "text-text-tertiary"}>{step.stage}</span>
                    </span>
                    <span className="text-text-tertiary ml-4">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Notes / Alert</h3>
                <p className="text-xs text-red-700">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Gallery Link */}
            {selectedOrder.galleryLink && (
              <div className="rounded-xl border border-border-default bg-surface-app p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Gallery Link</h3>
                <a
                  href={selectedOrder.galleryLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-blue-primary underline"
                >
                  {selectedOrder.galleryLink}
                </a>
                <div className="mt-2">
                  <button className="text-xs font-semibold text-brand-blue-primary border border-brand-blue-light rounded-lg px-3 py-1.5 hover:bg-brand-blue-background">
                    Update Gallery Link
                  </button>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-200 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-3">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                  Mark as Completed
                </button>
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
