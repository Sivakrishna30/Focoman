#!/usr/bin/env python3
content = '''
"use client";
import { useEffect, useMemo, useState, use } from "react";
import { omsApi, OmsOrder, OrderStatus, StudioProfile } from "@/services/omsApi";

const STATUS_LABELS: Record<OrderStatus, string> = {
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

const STATUS_COLORS: Record<OrderStatus, string> = {
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

export default function OmsPage({
  params,
}: {
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = use(params);
  const [studio, setStudio] = useState<StudioProfile | null>(null);
  const [orders, setOrders] = useState<OmsOrder[]>([]);
  const [selected, setSelected] = useState<OmsOrder | null>(null);
  const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const profile = await omsApi.getStudio(studioSlug);
        const data = await omsApi.getOrders(profile.studioId);
        setStudio(profile);
        setOrders(data);
      } catch {
        setError("Unable to load OMS data from the backend.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [studioSlug]);

  const filtered = useMemo(
    () =>
      orders.filter(
        (order) =>
          (status === "ALL" || order.status === status) &&
          (!query ||
            `${order.customerName} ${order.displayId} ${order.eventType}`
              .toLowerCase()
              .includes(query.toLowerCase()))
      ),
    [orders, status, query]
  );

  const updateStatus = async (next: OrderStatus) => {
    if (!selected) return;
    const updated = await omsApi.updateStatus(selected.orderId, next);
    setOrders((items) =>
      items.map((item) =>
        item.orderId === updated.orderId ? updated : item
      )
    );
    setSelected(updated);
  };

  if (loading)
    return (
      <div className="p-8 text-sm text-text-secondary">
        Loading OMS data from database...
      </div>
    );
  if (error || !studio)
    return (
      <div className="p-8 text-sm text-red-600">
        {error || "Studio not found."}
      </div>
    );

  return (
    <div className="flex h-full">
      <div
        className={`flex h-full flex-col ${
          selected ? "w-1/2 border-r border-border-default" : "w-full"
        }`}
      >
        <header className="border-b border-border-default bg-white px-6 py-5">
          <h1 className="text-lg font-extrabold">Order Management System</h1>
          <p className="text-xs text-text-tertiary">
            {orders.length} database orders - {studio.brandName}
          </p>
          <div className="mt-4 flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer, order ID, event..."
              className="w-full rounded-lg border px-3 py-2 text-xs"
            />
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "ALL" | OrderStatus)
              }
              className="rounded-lg border px-3 py-2 text-xs"
            >
              <option value="ALL">All statuses</option>
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((key) => (
                <option key={key} value={key}>
                  {STATUS_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {filtered.map((order) => (
            <button
              key={order.orderId}
              onClick={() => setSelected(order)}
              className="w-full rounded-2xl border border-border-default bg-white p-4 text-left hover:border-brand-blue-light"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-bold text-sm">{order.customerName}</p>
                  <p className="text-xs text-text-tertiary">
                    {order.eventType} - {order.eventDate} - {order.displayId}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    Assigned: {order.assignedEmployee || "Unassigned"}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                      STATUS_COLORS[order.status]
                    }`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                  <p className="mt-2 text-xs font-bold">
                    {order.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-text-tertiary">
              No orders found.
            </p>
          )}
        </div>
      </div>

      {selected && (
        <aside className="h-full w-1/2 overflow-y-auto bg-white p-6">
          <div className="flex justify-between">
            <div>
              <h2 className="font-extrabold">{selected.displayId}</h2>
              <p className="text-xs text-text-tertiary">
                {selected.customerName}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-text-tertiary hover:text-text-primary"
            >
              X
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-bold text-text-secondary">
                Event Details
              </p>
              <div className="mt-2 space-y-2 rounded-lg bg-gray-50 p-3">
                <p className="text-xs">
                  <span className="font-bold">Type:</span> {selected.eventType}
                </p>
                <p className="text-xs">
                  <span className="font-bold">Date:</span> {selected.eventDate.toString()}
                </p>
                <p className="text-xs">
                  <span className="font-bold">Amount:</span> {selected.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-text-secondary">
                Assignment
              </p>
              <div className="mt-2 rounded-lg bg-gray-50 p-3">
                <p className="text-xs">
                  {selected.assignedEmployee || "Unassigned"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-text-secondary">Status</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                      selected.status === s
                        ? STATUS_COLORS[s]
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
'''.strip()

with open(r"c:\Users\DELL\Downloads\FocoMan\focoman-frontend\src\app\[studioSlug]\dashboard\oms\page.tsx", 'w', encoding='utf-8') as f:
    f.write(content)
print("OMS page file written successfully")
