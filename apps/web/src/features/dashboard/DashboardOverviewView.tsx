"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OrderStatus, Order } from "@focoman/types";
import { isDemoStudio, getDemoOrders, subscribeToDemoStore } from "@/lib/demoStore";

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

interface DashboardOverviewViewProps {
  studioSlug: string;
  initialOrders: Order[];
}

export function DashboardOverviewView({
  studioSlug,
  initialOrders,
}: DashboardOverviewViewProps) {
  const isDemo = isDemoStudio(studioSlug);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    if (isDemo) {
      setOrders(getDemoOrders());
      const unsub = subscribeToDemoStore(() => {
        setOrders(getDemoOrders());
      });
      return () => unsub();
    }
  }, [isDemo]);

  const completed = orders.filter((o) => o.orderStatus === "COMPLETED").length;
  const awaitingEvent = orders.filter((o) => o.orderStatus === "AWAITING_EVENT").length;
  const postEventInProgress = orders.filter(
    (o) => o.orderStatus === "POST_EVENT_IN_PROGRESS"
  ).length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.pricing.finalConfirmedPrice || 0),
    0
  );
  const pendingRevenue = orders.reduce(
    (sum, o) => sum + (o.pricing.remainingAmount || 0),
    0
  );

  const statCards = [
    {
      label: "Total Confirmed Orders",
      value: orders.length,
      sub: "All time registered",
      color: "border-slate-200 bg-white",
      textColor: "text-slate-900",
    },
    {
      label: "Awaiting Event",
      value: awaitingEvent,
      sub: "Upcoming shoot dates",
      color: "border-sky-200 bg-sky-50/60",
      textColor: "text-sky-700",
    },
    {
      label: "Post-Event In Progress",
      value: postEventInProgress,
      sub: "Active production pipeline",
      color: "border-amber-200 bg-amber-50/60",
      textColor: "text-amber-700",
    },
    {
      label: "Completed Orders",
      value: completed,
      sub: "Delivered & paid",
      color: "border-emerald-200 bg-emerald-50/60",
      textColor: "text-emerald-700",
    },
    {
      label: "Total Confirmed Value",
      value: `₹${(totalRevenue / 1000).toFixed(0)}K`,
      sub: "Confirmed orders sum",
      color: "border-purple-200 bg-purple-50/60",
      textColor: "text-purple-700",
    },
    {
      label: "Pending Collections",
      value: `₹${(pendingRevenue / 1000).toFixed(0)}K`,
      sub: "Remaining balance",
      color: "border-orange-200 bg-orange-50/60",
      textColor: "text-amber-800",
    },
  ];

  return (
    <div className="px-6 py-8 lg:px-10 bg-slate-50 min-h-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Studio Dashboard — {isDemo ? "Lumina Creative Studio" : studioSlug}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Order Management System (OMS) Operational & Resource Status
          </p>
        </div>
        {isDemo && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live Browser Memory Active
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-2xl border p-5 shadow-xs transition hover:shadow-sm ${card.color}`}>
            <p className="text-xs font-semibold text-slate-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-extrabold ${card.textColor}`}>{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Confirmed Orders</h2>
              <p className="text-xs text-slate-500">Active photography orders & production stage</p>
            </div>
            <Link
              href={`/${studioSlug}/dashboard/oms`}
              className="text-xs font-semibold text-brand-blue-primary hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 6).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 px-4 py-3 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{order.customer.name}</p>
                    <span className="font-mono text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                      {order.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.eventType} · {order.eventDate}
                    {order.eventLocation ? ` · ${order.eventLocation}` : ""}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">
                      ₹{order.pricing.finalConfirmedPrice.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {order.pricing.remainingAmount > 0
                        ? `₹${order.pricing.remainingAmount.toLocaleString()} due`
                        : "Paid in full"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold border shadow-2xs ${STATUS_COLORS[order.orderStatus]}`}
                  >
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

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Operational Actions</h2>
            <div className="space-y-2.5">
              <Link
                href={`/${studioSlug}/dashboard/oms`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>Register Confirmed Order</span>
                </div>
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                href={`/${studioSlug}/dashboard/crm`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>Client Directory & Records</span>
                </div>
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                href={`/${studioSlug}/dashboard/erp`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span>👔</span>
                  <span>Studio Crew & Availability</span>
                </div>
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                href={`/${studioSlug}/dashboard/whatsapp`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <span>WhatsApp Notifications</span>
                </div>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </div>

          {isDemo && (
            <div className="rounded-2xl border border-brand-blue-soft bg-gradient-to-br from-brand-blue-background/40 to-white p-5 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-blue-primary">
                Demo Workspace Tips
              </span>
              <h3 className="mt-1 text-xs font-bold text-text-primary">
                Try the Live OMS Workflow
              </h3>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                Go to <strong>Order Management (OMS)</strong> to click into orders, mark photo editing tasks completed, and watch how the order status and revenue tracking update in real-time!
              </p>
              <div className="mt-3">
                <Link
                  href={`/${studioSlug}/dashboard/oms`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue-primary hover:underline"
                >
                  Open Order Management →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
