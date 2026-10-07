"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@focoman/types";
import { getStudioCalendarDate } from "@focoman/domain";
import { isDemoStudio, getDemoOrders, subscribeToDemoStore } from "@/lib/demoStore";
import { useLanguage } from "@/context/LanguageContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type Period = "last30d" | "last3m" | "last6m" | "ytd" | "lastyear" | "custom";

interface CustomRange {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

interface PanelCollapseState {
  businessReports: boolean;
  orders: boolean;
  upcomingShoots: boolean;
  marketplaceLeads: boolean;
}

interface DashboardHomeViewProps {
  studioSlug: string;
  initialOrders: Order[];
  hasMarketplace: boolean;
  userId?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "Awaiting Event",
  POST_EVENT_IN_PROGRESS: "Post-Event In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  AWAITING_EVENT: "badge-brand-blue",
  POST_EVENT_IN_PROGRESS: "badge-brand-orange",
  COMPLETED: "badge-status-success",
  CANCELLED: "badge-status-error",
};

const PERIOD_LABELS: Record<Period, string> = {
  last30d: "Last 30 Days",
  last3m: "Last 3 Months",
  last6m: "Last 6 Months",
  ytd: "This Year",
  lastyear: "Last Year",
  custom: "Custom Range",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDateRange(period: Period, custom: CustomRange): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  let start = new Date(now);

  switch (period) {
    case "last30d":
      start.setDate(now.getDate() - 30);
      break;
    case "last3m":
      start.setMonth(now.getMonth() - 3);
      break;
    case "last6m":
      start.setMonth(now.getMonth() - 6);
      break;
    case "ytd":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "lastyear":
      start = new Date(now.getFullYear() - 1, 0, 1);
      end.setFullYear(now.getFullYear() - 1, 11, 31);
      break;
    case "custom":
      return {
        start: new Date(custom.from + "T00:00:00"),
        end: new Date(custom.to + "T23:59:59"),
      };
  }
  return { start, end };
}

function formatINR(amount: number): string {
  return "\u20b9" + amount.toLocaleString("en-IN");
}

function formatChangePercent(
  current: number,
  previous: number
): { pct: number; positive: boolean } | null {
  if (previous === 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  return { pct: Math.abs(pct), positive: pct >= 0 };
}

function getOrderDate(order: Order): Date {
  const raw = order.createdAt || order.eventDate;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PanelHeader({
  title,
  collapsed,
  onToggle,
  children,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-left group"
        aria-expanded={!collapsed}
      >
        <svg
          className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <h2 className="text-sm font-bold text-text-primary group-hover:text-brand-blue-primary transition">
          {title}
        </h2>
      </button>
      {children}
    </div>
  );
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  const change = formatChangePercent(current, previous);
  if (!change) return null;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
        change.positive ? "text-emerald-600" : "text-red-500"
      }`}
    >
      {change.positive ? "\u2191" : "\u2193"} {change.pct}%
    </span>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

interface ChartBucket {
  label: string;
  revenue: number;
  orders: number;
}

function RevenueOrdersChart({ data }: { data: ChartBucket[] }) {
  const maxRev = Math.max(...data.map((d) => d.revenue), 1);
  const maxOrd = Math.max(...data.map((d) => d.orders), 1);

  return (
    <div className="mt-4">
      <div className="flex items-end gap-1 sm:gap-2 h-32 border-b border-border-divider pb-2">
        {data.map((item, i) => {
          const revH = Math.max(8, Math.round((item.revenue / maxRev) * 100));
          const ordH = Math.max(4, Math.round((item.orders / maxOrd) * 100));
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group relative"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                <div className="rounded-lg bg-slate-800 text-white text-[10px] px-2 py-1.5 shadow-lg whitespace-nowrap">
                  <div className="font-bold">{item.label}</div>
                  <div className="text-emerald-300">Rev: {formatINR(item.revenue)}</div>
                  <div className="text-blue-300">Orders: {item.orders}</div>
                </div>
                <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1" />
              </div>
              {/* Bars */}
              <div className="w-full flex items-end gap-[1px] justify-center h-full">
                <div
                  className="w-[45%] rounded-t-sm bg-amber-400 hover:bg-amber-500 transition"
                  style={{ height: `${revH}%` }}
                />
                <div
                  className="w-[45%] rounded-t-sm bg-brand-blue-primary/60 hover:bg-brand-blue-primary transition"
                  style={{ height: `${ordH}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex gap-1 sm:gap-2 mt-1">
        {data.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[9px] sm:text-[10px] text-text-tertiary font-medium truncate block">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-400 inline-block" />
          Revenue
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-blue-primary/60 inline-block" />
          Orders
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardHomeView({
  studioSlug,
  initialOrders,
  hasMarketplace,
  userId,
}: DashboardHomeViewProps) {
  const { t } = useLanguage();
  const isDemo = isDemoStudio(studioSlug);

  // ── Orders state ──
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // ── Period filter ──
  const [period, setPeriod] = useState<Period>("last30d");
  const [customRange, setCustomRange] = useState<CustomRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  // ── Status filter for orders table ──
  const [orderStatusFilter, setOrderStatusFilter] = useState<"ALL" | OrderStatus>("ALL");

  // ── Panel collapse state ──
  const COLLAPSE_KEY = `focoman_dash_collapse_${studioSlug}_${userId || "default"}`;
  const [collapsed, setCollapsed] = useState<PanelCollapseState>({
    businessReports: false,
    orders: false,
    upcomingShoots: false,
    marketplaceLeads: false,
  });
  const [collapseLoaded, setCollapseLoaded] = useState(false);

  // ── Load persisted collapse state ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSE_KEY);
      if (stored) {
        setCollapsed(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setCollapseLoaded(true);
  }, [COLLAPSE_KEY]);

  const togglePanel = useCallback(
    (panel: keyof PanelCollapseState) => {
      setCollapsed((prev) => {
        const next = { ...prev, [panel]: !prev[panel] };
        try {
          localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [COLLAPSE_KEY]
  );

  // ── Demo store subscription ──
  useEffect(() => {
    if (isDemo) {
      setOrders(getDemoOrders());
      const unsub = subscribeToDemoStore(() => setOrders(getDemoOrders()));
      return () => unsub();
    }
  }, [isDemo]);

  // ── Period-filtered orders ──
  const { start: periodStart, end: periodEnd } = useMemo(
    () => getDateRange(period, customRange),
    [period, customRange]
  );

  const { start: prevStart, end: prevEnd } = useMemo(() => {
    const duration = periodEnd.getTime() - periodStart.getTime();
    return {
      start: new Date(periodStart.getTime() - duration),
      end: new Date(periodStart.getTime() - 1),
    };
  }, [periodStart, periodEnd]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const d = getOrderDate(o);
        return d >= periodStart && d <= periodEnd;
      }),
    [orders, periodStart, periodEnd]
  );

  const prevFilteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const d = getOrderDate(o);
        return d >= prevStart && d <= prevEnd;
      }),
    [orders, prevStart, prevEnd]
  );

  // ── Revenue & orders metrics (period-scoped, excluding cancelled) ──
  const revenue = useMemo(
    () =>
      filteredOrders
        .filter((o) => o.orderStatus !== "CANCELLED")
        .reduce((s, o) => s + (o.pricing?.finalConfirmedPrice || 0), 0),
    [filteredOrders]
  );
  const prevRevenue = useMemo(
    () =>
      prevFilteredOrders
        .filter((o) => o.orderStatus !== "CANCELLED")
        .reduce((s, o) => s + (o.pricing?.finalConfirmedPrice || 0), 0),
    [prevFilteredOrders]
  );
  const orderCount = filteredOrders.filter((o) => o.orderStatus !== "CANCELLED").length;
  const prevOrderCount = prevFilteredOrders.filter((o) => o.orderStatus !== "CANCELLED").length;

  // ── Order status counts (all-time, not period-filtered) ──
  const activeOrders = useMemo(
    () => orders.filter((o) => o.orderStatus !== "CANCELLED"),
    [orders]
  );
  const totalConfirmed = activeOrders.length;
  const awaitingEvent = useMemo(
    () => orders.filter((o) => o.orderStatus === "AWAITING_EVENT").length,
    [orders]
  );
  const postEvent = useMemo(
    () => orders.filter((o) => o.orderStatus === "POST_EVENT_IN_PROGRESS").length,
    [orders]
  );
  const completedCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "COMPLETED").length,
    [orders]
  );

  // ── Pending collections (all-time, active orders) ──
  const pendingCollections = useMemo(
    () => activeOrders.reduce((s, o) => s + Math.max(0, o.pricing?.remainingAmount || 0), 0),
    [activeOrders]
  );

  // ── Chart data ──
  const chartData = useMemo<ChartBucket[]>(() => {
    const buckets: ChartBucket[] = [];
    const now = new Date();

    if (period === "last30d") {
      for (let i = 5; i >= 0; i--) {
        const bucketEnd = new Date(now);
        bucketEnd.setDate(now.getDate() - i * 5);
        const bucketStart = new Date(bucketEnd);
        bucketStart.setDate(bucketEnd.getDate() - 4);
        const matching = filteredOrders.filter((o) => {
          const d = getOrderDate(o);
          return d >= bucketStart && d <= bucketEnd;
        });
        buckets.push({
          label: `${bucketStart.getDate()}/${bucketStart.getMonth() + 1}`,
          revenue: matching.reduce((s, o) => s + (o.pricing?.finalConfirmedPrice || 0), 0),
          orders: matching.length,
        });
      }
    } else if (period === "last3m" || period === "last6m") {
      const months = period === "last3m" ? 3 : 6;
      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        const label = d.toLocaleString("default", { month: "short" });
        const matching = filteredOrders.filter((o) => {
          const od = getOrderDate(o);
          return od >= d && od <= mEnd;
        });
        buckets.push({
          label,
          revenue: matching.reduce((s, o) => s + (o.pricing?.finalConfirmedPrice || 0), 0),
          orders: matching.length,
        });
      }
    } else if (period === "ytd" || period === "lastyear") {
      const year = period === "ytd" ? now.getFullYear() : now.getFullYear() - 1;
      for (let m = 0; m < 12; m++) {
        const d = new Date(year, m, 1);
        const mEnd = new Date(year, m + 1, 0, 23, 59, 59);
        const label = d.toLocaleString("default", { month: "short" });
        const matching = orders.filter((o) => {
          const od = getOrderDate(o);
          return od >= d && od <= mEnd;
        });
        buckets.push({
          label,
          revenue: matching.reduce((s, o) => s + (o.pricing?.finalConfirmedPrice || 0), 0),
          orders: matching.length,
        });
      }
    } else {
      // custom — monthly buckets
      const start = new Date(customRange.from + "T00:00:00");
      const end = new Date(customRange.to + "T23:59:59");
      const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor <= end) {
        const mEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59);
        const label = cursor.toLocaleString("default", { month: "short", year: "2-digit" });
        const matching = filteredOrders.filter((o) => {
          const od = getOrderDate(o);
          return od >= cursor && od <= mEnd;
        });
        buckets.push({
          label,
          revenue: matching.reduce((s, o) => s + (o.pricing?.finalConfirmedPrice || 0), 0),
          orders: matching.length,
        });
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }
    return buckets;
  }, [filteredOrders, orders, period, customRange]);

  // ── Upcoming shoots ──
  const upcomingShoots = useMemo(() => {
    const todayStr = getStudioCalendarDate();
    return orders
      .filter((o) => {
        if (o.orderStatus === "CANCELLED" || o.orderStatus === "COMPLETED") return false;
        return (o.eventDate || "") >= todayStr;
      })
      .sort((a, b) => (a.eventDate || "").localeCompare(b.eventDate || ""))
      .slice(0, 10);
  }, [orders]);

  // ── Orders table (status-filtered) ──
  const displayedOrders = useMemo(() => {
    if (orderStatusFilter === "ALL") return activeOrders;
    return orders.filter((o) => o.orderStatus === orderStatusFilter);
  }, [orders, activeOrders, orderStatusFilter]);

  const handleStatusClick = useCallback(
    (status: "ALL" | OrderStatus) => {
      setOrderStatusFilter(status);
      if (collapsed.orders) {
        setCollapsed((prev) => {
          const next = { ...prev, orders: false };
          try {
            localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }
      setTimeout(() => {
        document.getElementById("dashboard-orders-panel")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    [collapsed.orders, COLLAPSE_KEY]
  );

  // Prevent flash of wrong collapse state
  if (!collapseLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue-primary" />
      </div>
    );
  }

  const periodLabel =
    period === "custom"
      ? `${customRange.from} \u2013 ${customRange.to}`
      : PERIOD_LABELS[period];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
            {t("nav.dashboard", "Dashboard")}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {isDemo ? "Lumina Creative Studio" : studioSlug} \u00b7 Studio Command Center
          </p>
        </div>
        {isDemo && (
          <span className="badge-status-success self-start sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Demo Session
          </span>
        )}
      </div>

      {/* ══════════════════════════════════════
          PANEL 1: BUSINESS REPORTS
      ══════════════════════════════════════ */}
      <section className="rounded-2xl border border-border-default bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-divider">
          <PanelHeader
            title="Business Overview"
            collapsed={collapsed.businessReports}
            onToggle={() => togglePanel("businessReports")}
          >
            {/* Period Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowPeriodMenu((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-white px-3 py-1.5 text-xs font-semibold text-text-primary shadow-2xs hover:border-brand-blue-primary transition"
              >
                <svg
                  className="h-3.5 w-3.5 text-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="max-w-[110px] truncate">{periodLabel}</span>
                <svg
                  className="h-3 w-3 text-text-tertiary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPeriodMenu && (
                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-border-default bg-white shadow-lg overflow-hidden">
                  {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setPeriod(key);
                        setShowPeriodMenu(false);
                        if (key === "custom") setShowCustomPicker(true);
                        else setShowCustomPicker(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition ${
                        period === key
                          ? "bg-brand-blue-primary text-white"
                          : "text-text-primary hover:bg-surface-app"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </PanelHeader>
        </div>

        {!collapsed.businessReports && (
          <div className="p-5 space-y-6">

            {/* Custom Date Picker */}
            {showCustomPicker && (
              <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border-default bg-surface-app p-4">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">From</label>
                  <input
                    type="date"
                    value={customRange.from}
                    onChange={(e) => setCustomRange((r) => ({ ...r, from: e.target.value }))}
                    className="rounded-lg border border-border-default bg-white px-3 py-1.5 text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">To</label>
                  <input
                    type="date"
                    value={customRange.to}
                    onChange={(e) => setCustomRange((r) => ({ ...r, to: e.target.value }))}
                    className="rounded-lg border border-border-default bg-white px-3 py-1.5 text-xs text-text-primary"
                  />
                </div>
                <button
                  onClick={() => setShowCustomPicker(false)}
                  className="rounded-lg bg-brand-blue-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-blue-primary/90 transition"
                >
                  Apply
                </button>
              </div>
            )}

            {/* A + B: Revenue & Orders KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border-default bg-surface-app/50 p-4">
                <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
                  Revenue
                </p>
                <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-text-primary">
                  {formatINR(revenue)}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <TrendBadge current={revenue} previous={prevRevenue} />
                  <span className="text-[11px] text-text-tertiary">
                    vs previous {periodLabel.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border-default bg-surface-app/50 p-4">
                <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
                  Orders
                </p>
                <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-text-primary">
                  {orderCount}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <TrendBadge current={orderCount} previous={prevOrderCount} />
                  <span className="text-[11px] text-text-tertiary">
                    vs previous {periodLabel.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* C: Combined Graph */}
            {chartData.length > 0 && <RevenueOrdersChart data={chartData} />}

            {/* D: Order Status Summary */}
            <div>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-3">
                Order Status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleStatusClick("ALL")}
                  className={`rounded-xl border p-3.5 text-left transition hover:shadow-sm group ${
                    orderStatusFilter === "ALL"
                      ? "border-brand-blue-primary bg-brand-blue-background shadow-xs"
                      : "border-border-default bg-surface-app/50 hover:border-brand-blue-light hover:bg-white"
                  }`}
                >
                  <p className="text-[11px] font-semibold text-text-secondary">Total Confirmed</p>
                  <p className="mt-1 text-xl font-extrabold text-text-primary">{totalConfirmed}</p>
                  <p className="mt-0.5 text-[10px] text-text-tertiary">All active orders</p>
                </button>

                <button
                  onClick={() => handleStatusClick("AWAITING_EVENT")}
                  className={`rounded-xl border p-3.5 text-left transition hover:shadow-sm group ${
                    orderStatusFilter === "AWAITING_EVENT"
                      ? "border-brand-blue-primary bg-brand-blue-background shadow-xs"
                      : "border-border-default bg-surface-app/50 hover:border-brand-blue-light hover:bg-white"
                  }`}
                >
                  <p className="text-[11px] font-semibold text-text-secondary">Awaiting Event</p>
                  <p className="mt-1 text-xl font-extrabold text-brand-blue-primary">{awaitingEvent}</p>
                  <p className="mt-0.5 text-[10px] text-text-tertiary">Upcoming shoots</p>
                </button>

                <button
                  onClick={() => handleStatusClick("POST_EVENT_IN_PROGRESS")}
                  className={`rounded-xl border p-3.5 text-left transition hover:shadow-sm group ${
                    orderStatusFilter === "POST_EVENT_IN_PROGRESS"
                      ? "border-brand-orange-primary bg-brand-orange-background shadow-xs"
                      : "border-border-default bg-surface-app/50 hover:border-brand-orange-light hover:bg-white"
                  }`}
                >
                  <p className="text-[11px] font-semibold text-text-secondary">Post-Event</p>
                  <p className="mt-1 text-xl font-extrabold text-brand-orange-primary">{postEvent}</p>
                  <p className="mt-0.5 text-[10px] text-text-tertiary">In production</p>
                </button>

                <button
                  onClick={() => handleStatusClick("COMPLETED")}
                  className={`rounded-xl border p-3.5 text-left transition hover:shadow-sm group ${
                    orderStatusFilter === "COMPLETED"
                      ? "border-emerald-500 bg-emerald-50 shadow-xs"
                      : "border-border-default bg-surface-app/50 hover:border-emerald-200 hover:bg-white"
                  }`}
                >
                  <p className="text-[11px] font-semibold text-text-secondary">Completed</p>
                  <p className="mt-1 text-xl font-extrabold text-emerald-700">{completedCount}</p>
                  <p className="mt-0.5 text-[10px] text-text-tertiary">Delivered &amp; closed</p>
                </button>
              </div>
              <p className="mt-2 text-[10px] text-text-tertiary">
                Click a status to filter the Orders table below.
              </p>
            </div>

            {/* E: Pending Collections */}
            <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/40 px-5 py-4">
              <div>
                <p className="text-xs font-semibold text-brand-orange-primary">Pending Collections</p>
                <p className="mt-1 text-2xl font-extrabold text-brand-orange-primary">
                  {formatINR(pendingCollections)}
                </p>
                <p className="mt-0.5 text-[11px] text-brand-orange-primary/70">
                  Outstanding balance from active orders
                </p>
              </div>
              <svg
                className="h-8 w-8 text-brand-orange-primary/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          PANEL 2: ORDERS TABLE
      ══════════════════════════════════════ */}
      <section
        id="dashboard-orders-panel"
        className="rounded-2xl border border-border-default bg-white shadow-xs overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border-divider">
          <PanelHeader
            title="Orders"
            collapsed={collapsed.orders}
            onToggle={() => togglePanel("orders")}
          >
            <div className="flex items-center gap-2">
              {orderStatusFilter !== "ALL" && (
                <span className={`${STATUS_BADGE[orderStatusFilter as OrderStatus]} text-[11px] flex items-center gap-1`}>
                  {STATUS_LABELS[orderStatusFilter as OrderStatus]}
                  <button
                    onClick={() => setOrderStatusFilter("ALL")}
                    className="opacity-60 hover:opacity-100"
                    aria-label="Clear filter"
                  >
                    \u00d7
                  </button>
                </span>
              )}
              <Link
                href={`/${studioSlug}/dashboard/oms`}
                className="text-[11px] font-semibold text-brand-blue-primary hover:underline"
              >
                Open OMS \u2192
              </Link>
            </div>
          </PanelHeader>
        </div>

        {!collapsed.orders && (
          <div>
            {displayedOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-text-tertiary">
                {orderStatusFilter === "ALL"
                  ? "No confirmed orders yet. Use Order Management (OMS) to register your first order."
                  : `No orders with status \u201c${STATUS_LABELS[orderStatusFilter as OrderStatus]}\u201d.`}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border-divider bg-surface-app/70 text-[11px] font-bold text-text-secondary uppercase">
                    <tr>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4 hidden sm:table-cell">Event / Shoot</th>
                      <th className="py-3 px-4 hidden md:table-cell">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right hidden sm:table-cell">Amount</th>
                      <th className="py-3 px-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-divider">
                    {displayedOrders.slice(0, 20).map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-surface-app/50 transition cursor-pointer"
                        onClick={() => {
                          window.location.href = `/${studioSlug}/dashboard/oms?orderId=${order.id}`;
                        }}
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-brand-blue-primary font-bold">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-text-primary truncate max-w-[120px]">
                          {order.customer?.name || "\u2014"}
                        </td>
                        <td className="py-3 px-4 text-text-secondary hidden sm:table-cell truncate max-w-[140px]">
                          {order.eventType}
                          {order.eventLocation ? ` \u00b7 ${order.eventLocation}` : ""}
                        </td>
                        <td className="py-3 px-4 text-text-tertiary hidden md:table-cell">
                          {order.eventDate || "\u2014"}
                        </td>
                        <td className="py-3 px-4">
                          <span className={STATUS_BADGE[order.orderStatus] || "badge-status-neutral"}>
                            {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-text-primary hidden sm:table-cell">
                          {formatINR(order.pricing?.finalConfirmedPrice || 0)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {(order.pricing?.remainingAmount || 0) > 0 ? (
                            <span className="font-bold text-brand-orange-primary">
                              {formatINR(order.pricing.remainingAmount)}
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-medium text-[11px]">Paid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {displayedOrders.length > 20 && (
                  <div className="px-4 py-3 border-t border-border-divider text-center">
                    <Link
                      href={`/${studioSlug}/dashboard/oms`}
                      className="text-xs font-bold text-brand-blue-primary hover:underline"
                    >
                      View all {displayedOrders.length} orders in Order Management \u2192
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          PANEL 3: UPCOMING SHOOTS
      ══════════════════════════════════════ */}
      <section className="rounded-2xl border border-border-default bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border-divider">
          <PanelHeader
            title="Upcoming Shoots"
            collapsed={collapsed.upcomingShoots}
            onToggle={() => togglePanel("upcomingShoots")}
          >
            <span className="text-[11px] text-text-tertiary">
              {upcomingShoots.length} shoot{upcomingShoots.length !== 1 ? "s" : ""} ahead
            </span>
          </PanelHeader>
        </div>

        {!collapsed.upcomingShoots && (
          <div className="p-5">
            {upcomingShoots.length === 0 ? (
              <p className="text-center text-xs text-text-tertiary py-6">
                No upcoming shoots. Future-dated orders will appear here automatically.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingShoots.map((order) => {
                  const shootDate = new Date(order.eventDate + "T00:00:00");
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const daysUntil = Math.round(
                    (shootDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-app/50 hover:bg-white hover:border-brand-blue-light hover:shadow-2xs px-4 py-3 transition cursor-pointer"
                      onClick={() => {
                        window.location.href = `/${studioSlug}/dashboard/oms?orderId=${order.id}`;
                      }}
                    >
                      {/* Date block */}
                      <div className="shrink-0 w-10 text-center">
                        <p className="text-[10px] font-bold text-text-tertiary uppercase">
                          {shootDate.toLocaleString("default", { month: "short" })}
                        </p>
                        <p className="text-lg font-extrabold text-text-primary leading-tight">
                          {shootDate.getDate()}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {order.customer?.name}
                        </p>
                        <p className="text-[11px] text-text-secondary truncate">
                          {order.eventType}
                          {order.eventLocation ? ` \u00b7 ${order.eventLocation}` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        {daysUntil === 0 ? (
                          <span className="badge-brand-orange text-[10px]">Today</span>
                        ) : daysUntil === 1 ? (
                          <span className="badge-brand-orange text-[10px]">Tomorrow</span>
                        ) : (
                          <span className="text-[11px] text-text-tertiary">{daysUntil}d away</span>
                        )}
                        <p className="text-[10px] text-text-tertiary mt-0.5">{order.orderNumber}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          PANEL 4: MARKETPLACE LEADS (conditional)
      ══════════════════════════════════════ */}
      {hasMarketplace && (
        <section className="rounded-2xl border border-border-default bg-white shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-border-divider">
            <PanelHeader
              title="Studio Marketplace Leads"
              collapsed={collapsed.marketplaceLeads}
              onToggle={() => togglePanel("marketplaceLeads")}
            >
              <Link
                href={`/${studioSlug}/dashboard/marketplace`}
                className="text-[11px] font-semibold text-brand-blue-primary hover:underline"
              >
                Manage \u2192
              </Link>
            </PanelHeader>
          </div>

          {!collapsed.marketplaceLeads && (
            <div className="p-5">
              <div className="rounded-xl border border-dashed border-border-default p-6 text-center">
                <svg
                  className="h-8 w-8 text-text-tertiary mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-xs font-semibold text-text-primary">Marketplace Active</p>
                <p className="text-[11px] text-text-secondary mt-1">
                  View and manage incoming booking leads from the Studio Marketplace.
                </p>
                <Link
                  href={`/${studioSlug}/dashboard/marketplace`}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg border border-border-default bg-white px-3 py-1.5 text-xs font-bold text-text-primary shadow-2xs hover:border-brand-blue-primary hover:text-brand-blue-primary transition"
                >
                  Open Marketplace Profile \u2192
                </Link>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
