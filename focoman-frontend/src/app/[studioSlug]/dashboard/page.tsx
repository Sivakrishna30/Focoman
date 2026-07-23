import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getStudioBySlug,
  getDashboardStats,
  getOrdersByStudio,
} from "@/services/mockDb";

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

export default async function DashboardPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = await params;
  const studio = getStudioBySlug(studioSlug);
  if (!studio) notFound();

  const stats = getDashboardStats(studio.studioId);
  const recentOrders = getOrdersByStudio(studio.studioId).slice(0, 5);

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      sub: "All time",
      color: "border-brand-blue-light bg-brand-blue-background/40",
      textColor: "text-brand-blue-primary",
    },
    {
      label: "Completed",
      value: stats.completed,
      sub: "Delivered",
      color: "border-green-200 bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "In Progress",
      value: stats.pending,
      sub: "Active orders",
      color: "border-amber-200 bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      label: "Over SLA",
      value: stats.overSla,
      sub: stats.overSla > 0 ? "Needs attention" : "All on track",
      color: stats.overSla > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50",
      textColor: stats.overSla > 0 ? "text-red-600" : "text-green-600",
    },
    {
      label: "Revenue Collected",
      value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`,
      sub: "Payments received",
      color: "border-brand-purple-light bg-brand-purple-background/40",
      textColor: "text-brand-purple-primary",
    },
    {
      label: "Pending Collections",
      value: `₹${(stats.pendingRevenue / 1000).toFixed(0)}K`,
      sub: "Balance due",
      color: "border-orange-200 bg-orange-50",
      textColor: "text-brand-orange-primary",
    },
  ];

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-text-primary">
          Good morning, {studio.ownerName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Here&apos;s an overview of <span className="font-semibold">{studio.brandName}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border p-5 ${card.color}`}
          >
            <p className="text-xs font-semibold text-text-secondary">{card.label}</p>
            <p className={`mt-2 text-3xl font-extrabold ${card.textColor}`}>{card.value}</p>
            <p className="mt-1 text-xs text-text-tertiary">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Content: Recent Orders + Top Customers */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">

        {/* Recent Orders (2/3 width) */}
        <div className="lg:col-span-2 rounded-2xl border border-border-default bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-text-primary">Recent Orders</h2>
              <p className="text-xs text-text-tertiary">Latest activity across all bookings</p>
            </div>
            <Link
              href={`/${studioSlug}/dashboard/oms`}
              className="text-xs font-semibold text-brand-blue-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between rounded-xl border border-border-divider bg-surface-app px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-text-primary">{order.customerName}</p>
                    {order.status === "OVER_SLA" && (
                      <span className="shrink-0 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">URGENT</span>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary">
                    {order.eventType} · {order.eventDate} · {order.displayId}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-text-primary">₹{order.paidAmount.toLocaleString()}</p>
                    <p className="text-[10px] text-text-tertiary">of ₹{order.amount.toLocaleString()}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold whitespace-nowrap ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers (1/3 width) */}
        <div className="rounded-2xl border border-border-default bg-white p-6">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-text-primary">Top Customers</h2>
            <p className="text-xs text-text-tertiary">By total revenue generated</p>
          </div>
          <div className="space-y-3">
            {stats.topCustomers.map((cus, idx) => (
              <div key={cus.customerId} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue-background to-brand-purple-background text-xs font-bold text-brand-blue-primary">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-text-primary">{cus.name}</p>
                  <p className="text-[10px] text-text-tertiary">{cus.totalOrders} order{cus.totalOrders > 1 ? "s" : ""}</p>
                </div>
                <p className="shrink-0 text-xs font-bold text-brand-orange-primary">
                  ₹{(cus.totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 border-t border-border-divider pt-5 space-y-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Quick Actions</p>
            <Link
              href={`/${studioSlug}/dashboard/oms`}
              className="flex items-center gap-2 rounded-lg border border-border-default bg-surface-app px-3 py-2 text-xs font-semibold text-text-primary transition hover:border-brand-blue-light hover:text-brand-blue-primary"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Order
            </Link>
            <Link
              href={`/${studioSlug}/dashboard/crm`}
              className="flex items-center gap-2 rounded-lg border border-border-default bg-surface-app px-3 py-2 text-xs font-semibold text-text-primary transition hover:border-brand-orange-light hover:text-brand-orange-primary"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add Customer
            </Link>
            <Link
              href={`/${studioSlug}/dashboard/whatsapp`}
              className="flex items-center gap-2 rounded-lg border border-border-default bg-surface-app px-3 py-2 text-xs font-semibold text-text-primary transition hover:border-green-300 hover:text-green-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              WhatsApp Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
