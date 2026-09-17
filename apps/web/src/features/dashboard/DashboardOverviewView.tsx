"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OrderStatus, Order } from "@focoman/types";
import { isDemoStudio, getDemoOrders, subscribeToDemoStore } from "@/lib/demoStore";
import { useLanguage } from "@/context/LanguageContext";

const STATUS_COLORS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "badge-brand-blue",
  POST_EVENT_IN_PROGRESS: "badge-brand-orange",
  COMPLETED: "badge-status-success",
};

interface DashboardOverviewViewProps {
  studioSlug: string;
  initialOrders: Order[];
}

export function DashboardOverviewView({
  studioSlug,
  initialOrders,
}: DashboardOverviewViewProps) {
  const { t } = useLanguage();
  const isDemo = isDemoStudio(studioSlug);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const statusLabels: Record<OrderStatus, string> = {
    AWAITING_EVENT: t("stage.AWAITING_EVENT", "Awaiting Event"),
    POST_EVENT_IN_PROGRESS: t("stage.POST_EVENT_IN_PROGRESS", "Post-Event In Progress"),
    COMPLETED: t("stage.COMPLETED", "Completed"),
  };

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
      label: t("stats.total_orders", "Total Confirmed Orders"),
      value: orders.length,
      sub: "All time registered",
      cardClass: "border-border-default bg-white",
      textColor: "text-text-primary",
      badgeClass: "badge-status-neutral",
    },
    {
      label: t("stats.awaiting_event", "Awaiting Event"),
      value: awaitingEvent,
      sub: "Upcoming shoot dates",
      cardClass: "card-brand-blue",
      textColor: "text-brand-blue-primary",
      badgeClass: "badge-brand-blue",
    },
    {
      label: t("stats.in_progress", "Post-Event In Progress"),
      value: postEventInProgress,
      sub: "Active production pipeline",
      cardClass: "card-brand-orange",
      textColor: "text-brand-orange-primary",
      badgeClass: "badge-brand-orange",
    },
    {
      label: t("stats.completed", "Completed Orders"),
      value: completed,
      sub: "Delivered & paid",
      cardClass: "border-emerald-200 bg-emerald-50/40",
      textColor: "text-emerald-700",
      badgeClass: "badge-status-success",
    },
    {
      label: t("stats.total_value", "Total Confirmed Value"),
      value: `₹${(totalRevenue / 1000).toFixed(0)}K`,
      sub: "Confirmed orders sum",
      cardClass: "card-brand-purple",
      textColor: "text-brand-purple-primary",
      badgeClass: "badge-brand-purple",
    },
    {
      label: t("stats.pending_collections", "Pending Collections"),
      value: `₹${(pendingRevenue / 1000).toFixed(0)}K`,
      sub: "Remaining balance",
      cardClass: "card-brand-orange",
      textColor: "text-brand-orange-primary",
      badgeClass: "badge-brand-orange",
    },
  ];

  return (
    <div className="px-6 py-8 lg:px-10 bg-surface-app min-h-full">
      <header className="header-brand-blue mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="badge-brand-blue">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                Executive Dashboard
              </span>
              <span className="badge-status-neutral">
                Studio: <strong className="font-semibold text-text-primary">{isDemo ? "Lumina Creative Studio" : studioSlug}</strong>
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
              Studio Operational Overview
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Order pipeline, client metrics, crew operations, and financial summary.
            </p>
          </div>
          {isDemo && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="badge-status-success">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Demo Session Active
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-2xl border p-5 shadow-xs transition hover:shadow-sm ${card.cardClass}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-text-secondary">{card.label}</p>
            </div>
            <p className={`mt-2 text-3xl font-extrabold ${card.textColor}`}>{card.value}</p>
            <p className="mt-1 text-xs text-text-tertiary">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border-default bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-text-primary">Recent Confirmed Orders</h2>
              <p className="text-xs text-text-secondary">Active photography orders & production stages</p>
            </div>
            <Link
              href={`/${studioSlug}/dashboard/oms`}
              className="btn-brand-outline py-1.5 px-3 text-xs"
            >
              View All Orders →
            </Link>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 6).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-border-default bg-surface-app/60 hover:bg-white hover:border-brand-blue-light px-4 py-3 transition shadow-2xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-text-primary">{order.customer.name}</p>
                    <span className="font-mono text-[10px] text-brand-blue-primary bg-white border border-border-default rounded px-1.5 py-0.5 font-bold">
                      {order.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {order.eventType} · {order.eventDate}
                    {order.eventLocation ? ` · ${order.eventLocation}` : ""}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-text-primary">
                      ₹{order.pricing.finalConfirmedPrice.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-text-tertiary">
                      {order.pricing.remainingAmount > 0
                        ? `₹${order.pricing.remainingAmount.toLocaleString()} due`
                        : "Paid in full"}
                    </p>
                  </div>
                  <span className={STATUS_COLORS[order.orderStatus] || "badge-status-neutral"}>
                    {statusLabels[order.orderStatus] || order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="py-12 text-center text-xs text-text-tertiary">
                No orders registered yet. Use Register Order to add your first confirmed business.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-text-primary mb-4">Quick Operational Modules</h2>
            <div className="space-y-2.5">
              <Link
                href={`/${studioSlug}/dashboard/oms`}
                className="flex items-center justify-between rounded-xl border border-border-default bg-surface-app/70 px-3.5 py-2.5 text-xs font-semibold text-text-primary transition hover:border-brand-blue-primary hover:bg-white shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-blue-primary group-hover:scale-125 transition" />
                  <span>{t("dash.orders", "Order Management (OMS)")}</span>
                </div>
                <span className="text-brand-blue-primary font-bold">→</span>
              </Link>
              <Link
                href={`/${studioSlug}/dashboard/crm`}
                className="flex items-center justify-between rounded-xl border border-border-default bg-surface-app/70 px-3.5 py-2.5 text-xs font-semibold text-text-primary transition hover:border-brand-orange-primary hover:bg-white shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-orange-primary group-hover:scale-125 transition" />
                  <span>{t("dash.crm", "Customer Relations (CRM)")}</span>
                </div>
                <span className="text-brand-orange-primary font-bold">→</span>
              </Link>
              <Link
                href={`/${studioSlug}/dashboard/erp`}
                className="flex items-center justify-between rounded-xl border border-border-default bg-surface-app/70 px-3.5 py-2.5 text-xs font-semibold text-text-primary transition hover:border-brand-purple-primary hover:bg-white shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-purple-primary group-hover:scale-125 transition" />
                  <span>{t("dash.erp", "Crew Operations (ERP)")}</span>
                </div>
                <span className="text-brand-purple-primary font-bold">→</span>
              </Link>
              <Link
                href={`/${studioSlug}/dashboard/whatsapp`}
                className="flex items-center justify-between rounded-xl border border-border-default bg-surface-app/70 px-3.5 py-2.5 text-xs font-semibold text-text-primary transition hover:border-brand-blue-primary hover:bg-white shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-brand-blue-primary group-hover:scale-125 transition" />
                  <span>{t("dash.whatsapp", "WhatsApp Notifications")}</span>
                </div>
                <span className="text-brand-blue-primary font-bold">→</span>
              </Link>
            </div>
          </div>

          {isDemo && (
            <div className="rounded-2xl border border-brand-blue-soft bg-gradient-to-br from-brand-blue-background/40 to-white p-5 shadow-xs">
              <span className="badge-brand-blue mb-2">
                Demo Workspace
              </span>
              <h3 className="mt-1 text-xs font-bold text-text-primary">
                Integrated Operational Flow
              </h3>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                Experience consistent design language across <strong>OMS (Blue)</strong>, <strong>CRM (Orange)</strong>, <strong>ERP (Purple)</strong>, and <strong>WhatsApp</strong> notifications with shared live state.
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
