import Link from "next/link";
import { OrderStatus, Order } from "@focoman/types";
import { getOrdersByStudio } from "@focoman/db";

const STATUS_COLORS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "bg-sky-100 text-sky-800 border-sky-300",
  POST_EVENT_IN_PROGRESS: "bg-amber-100 text-amber-800 border-amber-300",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "Awaiting Event",
  POST_EVENT_IN_PROGRESS: "Post-Event In Progress",
  COMPLETED: "Completed",
};

export default async function DashboardPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = await params;

  // CHG-010: Load real orders from Firestore — hardcoded empty array removed.
  // Errors propagate to Next.js error boundary — no silent empty state.
  const orders: Order[] = await getOrdersByStudio(studioSlug);

  const completed = orders.filter(o => o.orderStatus === "COMPLETED").length;
  const awaitingEvent = orders.filter(o => o.orderStatus === "AWAITING_EVENT").length;
  const postEventInProgress = orders.filter(o => o.orderStatus === "POST_EVENT_IN_PROGRESS").length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing.finalConfirmedPrice || 0), 0);
  const pendingRevenue = orders.reduce((sum, o) => sum + (o.pricing.remainingAmount || 0), 0);

  const statCards = [
    {
      label: "Total Confirmed Orders",
      value: orders.length,
      sub: "All time registered",
      color: "border-slate-200 bg-slate-50",
      textColor: "text-slate-900",
    },
    {
      label: "Awaiting Event",
      value: awaitingEvent,
      sub: "Upcoming shoot dates",
      color: "border-sky-200 bg-sky-50",
      textColor: "text-sky-700",
    },
    {
      label: "Post-Event In Progress",
      value: postEventInProgress,
      sub: "Active production pipeline",
      color: "border-amber-200 bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      label: "Completed Orders",
      value: completed,
      sub: "Delivered & paid",
      color: "border-emerald-200 bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      label: "Total Confirmed Value",
      value: `₹${(totalRevenue / 1000).toFixed(0)}K`,
      sub: "Confirmed orders sum",
      color: "border-purple-200 bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Pending Collections",
      value: `₹${(pendingRevenue / 1000).toFixed(0)}K`,
      sub: "Remaining balance",
      color: "border-orange-200 bg-orange-50",
      textColor: "text-amber-800",
    },
  ];

  return (
    <div className="px-6 py-8 lg:px-10 bg-slate-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Studio Dashboard — {studioSlug}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Order Management System (OMS) Operational & Resource Status
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-2xl border p-5 ${card.color}`}>
            <p className="text-xs font-semibold text-slate-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-extrabold ${card.textColor}`}>{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Confirmed Orders</h2>
              <p className="text-xs text-slate-500">Active photography orders & production stage</p>
            </div>
            <Link
              href={`/${studioSlug}/dashboard/oms`}
              className="text-xs font-semibold text-slate-900 hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{order.customer.name}</p>
                  <p className="text-xs text-slate-500">
                    {order.eventType} · {order.eventDate} · {order.orderNumber}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">₹{order.pricing.finalConfirmedPrice.toLocaleString()}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${STATUS_COLORS[order.orderStatus]}`}>
                    {STATUS_LABELS[order.orderStatus]}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="py-12 text-center text-xs text-slate-400">
                No orders registered yet. Use Register Order to add your first confirmed business.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Operational Actions</h2>
          <div className="space-y-2">
            <Link
              href={`/${studioSlug}/dashboard/oms`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Register Confirmed Order
            </Link>
            <Link
              href={`/${studioSlug}/dashboard/whatsapp`}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              WhatsApp Notification Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
