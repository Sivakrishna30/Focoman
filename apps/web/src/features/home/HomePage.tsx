"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FocomanShieldWatermark } from "@/components/FocomanLogo";
import { Navbar } from "@/components/Navbar";
import { Order, Task } from "@focoman/types";
import { getOrderByPasskeyAction } from "@/actions/orderActions";
import { signInWithGoogle } from "@/lib/firebaseAuth";

export function HomePage() {
  const router = useRouter();

  // Unified Access Tab: "studio" (Owner/Crew via Google) vs "customer" (Guest Passkey Tracker)
  const [activeTab, setActiveTab] = useState<"studio" | "customer">("studio");

  // Google Sign-In state
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Customer Passkey Tracker States
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [foundOrderTasks, setFoundOrderTasks] = useState<Task[]>([]);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 1. Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      await signInWithGoogle();
      router.push("/workspaces");
    } catch (err: unknown) {
      console.error("Google sign-in failed:", err);
      setAuthError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  // 2. Customer Guest Passkey Search Handler
  const handleCustomerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerSearchQuery.trim()) return;

    setSearchExecuted(true);
    setFoundOrder(null);
    setFoundOrderTasks([]);
    setIsSearching(true);

    const res = await getOrderByPasskeyAction(customerSearchQuery.trim());
    if (res.success && res.order) {
      setFoundOrder(res.order);
      setFoundOrderTasks(res.tasks || []);
    } else {
      setFoundOrder(null);
    }
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-surface-app text-text-primary selection:bg-brand-blue-soft">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border-divider bg-gradient-to-b from-white via-brand-blue-background/20 to-surface-app px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <FocomanShieldWatermark className="pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 opacity-25" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-brand-orange-soft bg-brand-orange-background px-5 py-2 text-sm font-extrabold uppercase tracking-widest text-brand-orange-primary shadow-xs">
            Focus beyond the frames
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            A Complete Business Operating System for{" "}
            <span className="bg-gradient-to-r from-brand-blue-primary via-brand-purple-primary to-brand-orange-primary bg-clip-text text-transparent">
              Photography Studios
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg lg:text-xl">
            Streamline confirmed orders, coordinate crew assignments, manage post-event production workflows, and deliver with payment completion.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/onboarding/register-studio"
              className="rounded-xl bg-brand-blue-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600"
            >
              Register Your Studio
            </Link>
            <Link
              href="/workspaces"
              className="rounded-xl border border-brand-blue-light bg-white px-6 py-3 text-sm font-bold text-brand-blue-primary shadow-sm transition hover:bg-brand-blue-background"
            >
              Access Studio Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1: The Challenge We Solve */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-brand-blue-background/30 p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
              The Challenge We Solve
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Eliminate Scattered WhatsApp Chats, Spreadsheets & Paper Notebooks
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              Photography studio owners lose countless hours tracking shoot dates, chasing editors for deliverables, updating spreadsheets, and managing payment collections. Focoman centralizes your confirmed orders into one dependable operational workflow.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-background text-brand-blue-primary font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">Confirmed Orders</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Track each confirmed booking from event day through post-event production and delivery.
              </p>
            </div>

            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange-background text-brand-orange-primary font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">Assign Crew</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Assign Photographers, Videographers, Editors & Designers with verified skills.
              </p>
            </div>

            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple-background text-brand-purple-primary font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">Dynamic Workflows</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Service-driven task pipelines for RAW backup, photo editing, video editing, & album delivery.
              </p>
            </div>

            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-status-success font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">WhatsApp Alerts</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Operational event reminders, availability confirmation, and delivery alerts.
              </p>
            </div>

            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">Order Tracking Code</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Zero-friction guest order tracking with a secure access code. No client accounts needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Core Modules (OMS, CRM, ERP) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              Core Architecture
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Focoman Operations Modules
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              OMS-first order management supported by customer context and studio resource coordination.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* OMS Panel */}
            <div className="rounded-2xl border border-border-default bg-surface-app p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-[10px] font-bold text-brand-blue-primary uppercase tracking-wider">
                Module 01 — Core
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Order Management (OMS)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Manage confirmed bookings across the 3-state lifecycle: Awaiting Event → Post-Event In Progress → Completed. Track payment status and production tasks independently.
              </p>
            </div>

            {/* CRM Panel */}
            <div className="rounded-2xl border border-border-default bg-surface-app p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-orange-background px-3 py-1 text-[10px] font-bold text-brand-orange-primary uppercase tracking-wider">
                Module 02 — Support
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Customer Relations (CRM)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Maintain an operational customer directory with contact information and historical confirmed orders. Provides essential customer context for order delivery.
              </p>
            </div>

            {/* ERP Panel */}
            <div className="rounded-2xl border border-border-default bg-surface-app p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-purple-background px-3 py-1 text-[10px] font-bold text-brand-purple-primary uppercase tracking-wider">
                Module 03 — Support
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Studio Operations (ERP)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Manage studio crew members, certified skill sets (photographer, videographer, editor, album designer), resource availability, and downstream production task assignments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Professional Studio Add-ons (VAS) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
              Value Added Services
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Professional Studio Add-ons
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              Optional technical and creative assistance services offered separately from core OMS operations.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border-divider bg-surface-app p-6">
              <h4 className="font-bold text-sm text-text-primary">Website Creation</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                Custom portfolio and showcase website for your studio brand.
              </p>
            </div>

            <div className="rounded-2xl border border-border-divider bg-surface-app p-6">
              <h4 className="font-bold text-sm text-text-primary">Branding & Identity</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                Studio logo design, invoice headers, and branded presentation assets.
              </p>
            </div>

            <div className="rounded-2xl border border-border-divider bg-surface-app p-6">
              <h4 className="font-bold text-sm text-text-primary">Data Migration</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                Import past customer contacts and order histories from spreadsheets.
              </p>
            </div>

            <div className="rounded-2xl border border-border-divider bg-surface-app p-6">
              <h4 className="font-bold text-sm text-text-primary">Custom Domain Setup</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                Connect your studio&apos;s custom domain to your public order tracker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Operational Access (Studio Workspace & Customer Guest Tracking) */}
      <section id="access-section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              Operational Access
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Access Your Workspaces or Track an Order
            </h2>
            <p className="mx-auto mt-2 text-sm text-text-secondary">
              Sign in with your Google account to access your studio, or enter your order passkey to track progress.
            </p>

            {/* Access Switcher */}
            <div className="mt-8 inline-flex rounded-xl bg-surface-app p-1.5 shadow-inner">
              <button
                onClick={() => setActiveTab("studio")}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                  activeTab === "studio"
                    ? "bg-brand-blue-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Studio Team Access
              </button>
              <button
                onClick={() => setActiveTab("customer")}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                  activeTab === "customer"
                    ? "bg-brand-orange-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Customer Order Tracker
              </button>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            {/* ======================================================== */}
            {/* PANEL 1: STUDIO ACCESS (Google Sign-In + Workspaces)     */}
            {/* ======================================================== */}
            {activeTab === "studio" && (
              <div className="rounded-2xl border border-border-default bg-white p-8 shadow-md text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-background text-brand-blue-primary font-bold text-lg mb-4">
                  🔑
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  Studio Owner & Crew Member Sign-In
                </h3>
                <p className="mt-1.5 max-w-md mx-auto text-xs text-text-secondary">
                  Focoman uses Google Sign-in as your universal personal identity. You can own a studio, be a member of other studios, and switch workspaces seamlessly.
                </p>

                {authError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                    {authError}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="inline-flex items-center gap-3 rounded-xl border border-border-default bg-white px-6 py-3 text-sm font-bold text-text-primary shadow-xs transition hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    {isSigningIn ? "Signing in..." : "Continue with Google"}
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-border-divider flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
                  <Link
                    href="/onboarding/register-studio"
                    className="font-semibold text-brand-orange-primary hover:underline"
                  >
                    + Register Your Studio
                  </Link>
                  <span className="text-text-tertiary hidden sm:inline">•</span>
                  <Link
                    href="/onboarding/join-studio"
                    className="font-semibold text-brand-purple-primary hover:underline"
                  >
                    + Join an Existing Studio
                  </Link>
                  <span className="text-text-tertiary hidden sm:inline">•</span>
                  <Link
                    href="/workspaces"
                    className="font-semibold text-brand-blue-primary hover:underline"
                  >
                    View All Workspaces
                  </Link>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* PANEL 2: CUSTOMER GUEST ORDER TRACKER                    */}
            {/* ======================================================== */}
            {activeTab === "customer" && (
              <div className="rounded-2xl border border-border-default bg-white p-8 shadow-md">
                <div className="mb-6 border-b border-border-divider pb-4">
                  <h3 className="text-lg font-bold text-text-primary">Guest Order Tracker</h3>
                  <p className="mt-1 text-xs text-text-secondary">
                    Check your photography order status, payment balance, and post-event production progress using your tracking code. Zero registration required.
                  </p>
                </div>

                <form onSubmit={handleCustomerSearch} className="space-y-4">
                  <div>
                    <label htmlFor="tracking-code-input" className="block text-xs font-semibold text-text-secondary">
                      Order Access Code or Order ID
                    </label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        id="tracking-code-input"
                        type="text"
                        required
                        placeholder="Enter tracking code e.g. FOC-AB12CD"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-border-default px-4 py-2.5 text-sm outline-none focus:border-brand-orange-primary focus:ring-1 focus:ring-brand-orange-primary"
                      />
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="shrink-0 rounded-xl bg-brand-orange-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
                      >
                        {isSearching ? "Searching..." : "Track"}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    Your unique tracking code is provided on your booking confirmation receipt.
                  </p>
                </form>

                {/* Search Results Card */}
                {searchExecuted && (
                  <div className="mt-6 border-t border-border-divider pt-6">
                    {isSearching ? (
                      <div className="py-6 text-center text-xs text-text-tertiary">
                        Searching order records...
                      </div>
                    ) : foundOrder ? (
                      <div className="rounded-2xl border border-brand-orange-soft bg-brand-orange-background/40 p-6 space-y-5">
                        <div className="flex flex-col justify-between gap-2 border-b border-brand-orange-soft pb-4 sm:flex-row sm:items-center">
                          <div>
                            <span className="font-mono text-xs font-bold text-brand-orange-primary">
                              {foundOrder.orderNumber}
                            </span>
                            <h4 className="text-base font-bold text-text-primary">
                              {foundOrder.customer.name}
                            </h4>
                            <p className="text-xs text-text-secondary">
                              {foundOrder.eventType} • Event Date: {foundOrder.eventDate}
                            </p>
                          </div>
                          <span className="inline-block rounded-full bg-brand-orange-primary px-3 py-1 text-xs font-bold text-white">
                            {foundOrder.orderStatus.replace(/_/g, " ")}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 rounded-xl bg-white/70 p-4 border border-brand-orange-soft/40 text-center">
                          <div>
                            <p className="text-[11px] text-text-tertiary">Confirmed Price</p>
                            <p className="mt-1 text-sm font-bold text-text-primary">
                              ₹{foundOrder.pricing.finalConfirmedPrice.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-text-tertiary">Advance Paid</p>
                            <p className="mt-1 text-sm font-bold text-emerald-600">
                              ₹{foundOrder.pricing.advanceAmount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-text-tertiary">Balance Due</p>
                            <p className="mt-1 text-sm font-bold text-amber-600">
                              ₹{foundOrder.pricing.remainingAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {foundOrderTasks.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
                              Production Workflow Timeline
                            </p>
                            <div className="space-y-2">
                              {foundOrderTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-xs border border-border-default/60"
                                >
                                  <span className="flex items-center gap-2.5">
                                    <span
                                      className={`h-2.5 w-2.5 rounded-full ${
                                        task.status === "COMPLETED"
                                          ? "bg-green-500"
                                          : task.status === "IN_PROGRESS"
                                          ? "bg-blue-500"
                                          : "bg-gray-300"
                                      }`}
                                    />
                                    <span
                                      className={
                                        task.status === "COMPLETED"
                                          ? "font-semibold text-text-primary"
                                          : "text-text-secondary"
                                      }
                                    >
                                      {task.title}
                                    </span>
                                  </span>
                                  <span
                                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                      task.status === "COMPLETED"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : task.status === "IN_PROGRESS"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                                  >
                                    {task.status.replace(/_/g, " ")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-xs font-medium text-red-600">
                        No order found matching tracking code &quot;{customerSearchQuery}&quot;. Please verify the code on your booking receipt.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-divider bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-xs text-text-tertiary">
              © 2026 Focoman. Focused Order Management System for Photography Studios.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                Features
              </Link>
              <Link href="/pricing" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                Pricing
              </Link>
              <Link href="/about" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                About Us
              </Link>
              <span className="text-xs text-text-tertiary">|</span>
              <span className="text-xs text-text-tertiary">Team: Siva, Asif, Rohith, Manohar</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
