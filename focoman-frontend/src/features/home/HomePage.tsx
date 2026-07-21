"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FocomanLogo, FocomanShieldWatermark } from "@/components/FocomanLogo";
import { Navbar } from "@/components/Navbar";
import { MOCK_ORDERS, MOCK_STUDIOS, OrderMock } from "@/services/mockDb";

export function HomePage() {
  const router = useRouter();

  // Portal selection
  const [activePortal, setActivePortal] = useState<"admin" | "employee" | "customer">("admin");
  const [adminAuthType, setAdminAuthType] = useState<"login" | "signup">("login");

  // Form states
  const [adminLoginForm, setAdminLoginForm] = useState({ email: "", password: "" });
  const [adminSignupForm, setAdminSignupForm] = useState({
    studioName: "",
    brandName: "",
    ownerName: "",
    email: "",
    mobile: "",
    city: "",
    password: "",
  });
  const [employeeForm, setEmployeeForm] = useState({ studioId: "", username: "", password: "" });
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [foundOrder, setFoundOrder] = useState<OrderMock | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [formFeedback, setFormFeedback] = useState<string | null>(null);

  const handleCustomerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchExecuted(true);
    const query = customerSearchQuery.trim().toLowerCase();
    if (!query) {
      setFoundOrder(null);
      return;
    }

    const match = MOCK_ORDERS.find(
      (o) =>
        o.orderId.toLowerCase() === query ||
        o.displayId.toLowerCase().includes(query) ||
        o.customerMobile.includes(query)
    );
    setFoundOrder(match || null);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminAuthType === "login") {
      const match = MOCK_STUDIOS.find(
        (s) => s.email.toLowerCase() === adminLoginForm.email.trim().toLowerCase()
      );
      if (match) {
        router.push(`/${match.slug}/dashboard`);
        return;
      } else {
        setFormFeedback(`No studio found for ${adminLoginForm.email}. (Try rajesh@luminary.com)`);
      }
    } else {
      setFormFeedback(
        `Registration submitted for "${adminSignupForm.studioName}". Studio Admin account created for ${adminSignupForm.ownerName}.`
      );
    }
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(
      `Employee credentials submitted for username "${employeeForm.username}". Authenticating against Studio ERP system.`
    );
  };

  return (
    <div className="min-h-screen bg-surface-app text-text-primary selection:bg-brand-blue-soft">
      <Navbar />

      {/* Hero Section with Transparent F-Shield Background Effect */}
      <section className="relative overflow-hidden border-b border-border-divider bg-gradient-to-b from-white via-brand-blue-background/20 to-surface-app px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Subtle transparent F-Shield logo watermark */}
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
            Empowering photography studio owners to streamline orders, manage teams, track pre and post event workflows, and delight clients effortlessly.
          </p>
        </div>
      </section>

      {/* Section 1: The Challenge We Solve (Enclosed Panel) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-brand-blue-background/30 p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">The Challenge We Solve</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Eliminate Scattered WhatsApp Chats, Spreadsheets & Paper Notebooks
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              Photography studio owners lose countless hours every week manually tracking shoot dates, chasing editors for updates, updating Excel files, and sending manual payment reminders. Focoman centralizes your entire studio operation into one intelligent system.
            </p>
          </div>

          {/* 5 Core Capabilities Grid (Clean SVG Icons) */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-background text-brand-blue-primary font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">Manage Orders</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Track every booking from lead inquiry to shoot confirmation, deposit, & album delivery.
              </p>
            </div>

            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange-background text-brand-orange-primary font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">Assign Team</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Assign Photographers, Videographers, Editors, & Designers with task accountability.
              </p>
            </div>

            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple-background text-brand-purple-primary font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">Track Tasks</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Real-time visibility over RAW backup, photo culling, video edit, album approval, & printing.
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
                Send automated booking receipts, shoot reminders, and ready-for-preview alerts to clients.
              </p>
            </div>

            <div className="rounded-2xl border border-border-default bg-white p-5 shadow-xs transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-brand-blue-primary font-bold">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-3 text-base font-bold text-text-primary">Google Calendar</h3>
              <p className="mt-1.5 text-xs text-text-secondary">
                Auto-sync shoot bookings to Google Calendar to prevent scheduling conflicts and double bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Core Modules Section (Enclosed Panel with Blue -> Orange -> Purple Standard Format) */}
      <section id="modules" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-brand-blue-background/20 p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">Core System Modules</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Everything Your Studio Needs
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-text-secondary">
              Three tailored modules built specifically for photography studio management.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Panel 1: Order Management System - OMS (BLUE) */}
            <div className="flex flex-col justify-between rounded-2xl border border-border-default bg-white p-6 shadow-xs transition hover:border-brand-blue-light hover:shadow-md">
              <div>
                <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold text-brand-blue-primary">
                  CORE WORKFLOW
                </span>
                <h3 className="mt-3 text-xl font-bold text-text-primary">Order Management System - OMS</h3>
                <p className="mt-3 text-sm text-text-secondary">
                  Centralized order engine. Track every photoshoot from lead inquiry through editing, client approval, and final delivery.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                    Lead-to-order booking pipeline
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                    Shooting calendar & event schedules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                    Stage-by-stage pre & post event edit tracker
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                    Advance deposit & payment tracking
                  </li>
                </ul>
              </div>
              <div className="mt-6 border-t border-border-divider pt-4 text-xs font-semibold text-brand-blue-primary">
                Detailed breakdown on Features page →
              </div>
            </div>

            {/* Panel 2: Customer Relationship Management - CRM (ORANGE) */}
            <div className="flex flex-col justify-between rounded-2xl border border-border-default bg-white p-6 shadow-xs transition hover:border-brand-orange-light hover:shadow-md">
              <div>
                <span className="inline-block rounded-full bg-brand-orange-background px-3 py-1 text-xs font-bold text-brand-orange-primary">
                  CLIENT INTELLIGENCE
                </span>
                <h3 className="mt-3 text-xl font-bold text-text-primary">Customer Relationship Management - CRM</h3>
                <p className="mt-3 text-sm text-text-secondary">
                  Store complete client details, event history, WhatsApp interaction logs, and automated notification reminders.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                    Complete customer contact repository
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                    Automated WhatsApp shoot reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                    Customer lifetime business value
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                    Lead sources (Website, Instagram, Walk-ins)
                  </li>
                </ul>
              </div>
              <div className="mt-6 border-t border-border-divider pt-4 text-xs font-semibold text-brand-orange-primary">
                Detailed breakdown on Features page →
              </div>
            </div>

            {/* Panel 3: Studio Enterprise Resource Planning - ERP (PURPLE) */}
            <div className="flex flex-col justify-between rounded-2xl border border-border-default bg-white p-6 shadow-xs transition hover:border-brand-purple-light hover:shadow-md">
              <div>
                <span className="inline-block rounded-full bg-brand-purple-background px-3 py-1 text-xs font-bold text-brand-purple-primary">
                  TEAM & OPERATIONS
                </span>
                <h3 className="mt-3 text-xl font-bold text-text-primary">Studio Enterprise Resource Planning - ERP</h3>
                <p className="mt-3 text-sm text-text-secondary">
                  Lightweight team management for Photographers, Editors, & Designers without corporate HRMS/payroll clutter.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                    Staff roles & studio login credentials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                    Task allocation & workload balancing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                    Studio owner performance dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                    Operational activity logging
                  </li>
                </ul>
              </div>
              <div className="mt-6 border-t border-border-divider pt-4 text-xs font-semibold text-brand-purple-primary">
                Detailed breakdown on Features page →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Partnered Services / Value Added Offerings (Enclosed Panel with Blue -> Orange -> Purple Standard Format) */}
      <section id="partner-services" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-brand-orange-background/20 p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">Value Added Offerings</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Partnered Services for Your Studio
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-text-secondary">
              Everything you need to build a strong digital presence and migrate smoothly to Focoman.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Panel 1: Free Website Integration (BLUE) */}
            <div className="flex flex-col justify-between rounded-2xl border border-border-default bg-white p-6 shadow-xs transition hover:border-brand-blue-light hover:shadow-md">
              <div>
                <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold text-brand-blue-primary">
                  FREE INCLUDED
                </span>
                <h3 className="mt-3 text-xl font-bold text-text-primary">Website Integration</h3>
                <p className="mt-3 text-sm text-text-secondary">
                  Already have a studio website? We provide free embedded enquiry forms and tracking widgets to connect your site directly to Focoman.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                    Instant lead capture from your website
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                    Embeddable Order Status lookup widget
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                    No coding knowledge required
                  </li>
                </ul>
              </div>
              <div className="mt-6 border-t border-border-divider pt-4 text-xs font-semibold text-brand-blue-primary">
                Included with every Focoman plan →
              </div>
            </div>

            {/* Panel 2: Website / Brand Creation (ORANGE) */}
            <div className="flex flex-col justify-between rounded-2xl border border-border-default bg-white p-6 shadow-xs transition hover:border-brand-orange-light hover:shadow-md">
              <div>
                <span className="inline-block rounded-full bg-brand-orange-background px-3 py-1 text-xs font-bold text-brand-orange-primary">
                  BRAND & DIGITAL
                </span>
                <h3 className="mt-3 text-xl font-bold text-text-primary">Website & Brand Creation</h3>
                <p className="mt-3 text-sm text-text-secondary">
                  Need a modern photography portfolio website or logo refresh? Our expert designers create high-converting websites tailored for studios.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                    Custom studio website with booking forms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                    Mobile-responsive photography gallery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                    Logo design & brand color identity
                  </li>
                </ul>
              </div>
              <div className="mt-6 border-t border-border-divider pt-4 text-xs font-semibold text-brand-orange-primary">
                Available upon request →
              </div>
            </div>

            {/* Panel 3: Data Migration (PURPLE) */}
            <div className="flex flex-col justify-between rounded-2xl border border-border-default bg-white p-6 shadow-xs transition hover:border-brand-purple-light hover:shadow-md">
              <div>
                <span className="inline-block rounded-full bg-brand-purple-background px-3 py-1 text-xs font-bold text-brand-purple-primary">
                  SEAMLESS ONBOARDING
                </span>
                <h3 className="mt-3 text-xl font-bold text-text-primary">Data Migration</h3>
                <p className="mt-3 text-sm text-text-secondary">
                  Zero downtime when moving to Focoman. We help import all your existing customer lists, past order histories, and ongoing shoot schedules.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                    Excel / CSV spreadsheet import
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                    Historical customer directory setup
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                    One-on-one studio onboarding support
                  </li>
                </ul>
              </div>
              <div className="mt-6 border-t border-border-divider pt-4 text-xs font-semibold text-brand-purple-primary">
                Assisted setup available →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Access Portals & Authentication Section (Enclosed Panel) */}
      <section id="access-portals" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-brand-purple-background/20 p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-purple-primary">System Entry</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Access Focoman Portals
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-text-secondary">
              Select your user role to sign up, log in, or track customer order status.
            </p>
          </div>

          {/* Portal Type Buttons */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-2 rounded-xl bg-gray-100 p-1.5">
              <button
                onClick={() => {
                  setActivePortal("admin");
                  setFormFeedback(null);
                }}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  activePortal === "admin"
                    ? "bg-brand-blue-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Studio Owner / Admin
              </button>
              <button
                onClick={() => {
                  setActivePortal("employee");
                  setFormFeedback(null);
                }}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  activePortal === "employee"
                    ? "bg-brand-purple-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Studio Crew Member
              </button>
              <button
                onClick={() => {
                  setActivePortal("customer");
                  setFormFeedback(null);
                }}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  activePortal === "customer"
                    ? "bg-brand-orange-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Customer Order Status
              </button>
            </div>
          </div>

          {/* Portal Form Card */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border-default bg-white p-6 shadow-md sm:p-8">
            {formFeedback && (
              <div className="mb-6 rounded-lg border border-brand-blue-light/40 bg-brand-blue-background p-4 text-xs font-medium text-brand-blue-primary">
                {formFeedback}
              </div>
            )}

            {/* 1. Studio Admin Portal */}
            {activePortal === "admin" && (
              <div>
                <div className="mb-6 flex items-center justify-between border-b border-border-divider pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Studio Owner & Admin Portal</h3>
                    <p className="text-xs text-text-tertiary">Full system access to OMS, CRM, and Studio ERP</p>
                  </div>
                  <div className="inline-flex rounded-lg bg-surface-app p-1 text-xs font-semibold">
                    <button
                      onClick={() => {
                        setAdminAuthType("login");
                        setFormFeedback(null);
                      }}
                      className={`rounded-md px-3 py-1.5 ${
                        adminAuthType === "login" ? "bg-white text-brand-blue-primary shadow-xs" : "text-text-tertiary"
                      }`}
                    >
                      Existing Studio
                    </button>
                    <button
                      onClick={() => {
                        setAdminAuthType("signup");
                        setFormFeedback(null);
                      }}
                      className={`rounded-md px-3 py-1.5 ${
                        adminAuthType === "signup" ? "bg-white text-brand-blue-primary shadow-xs" : "text-text-tertiary"
                      }`}
                    >
                      New Studio Sign Up
                    </button>
                  </div>
                </div>

                {adminAuthType === "login" ? (
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary">Studio Owner Email / Username</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rajesh@luminary.com"
                        value={adminLoginForm.email}
                        onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={adminLoginForm.password}
                        onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-brand-blue-primary py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                    >
                      Login to Studio Dashboard
                    </button>
                    <p className="text-center text-xs text-text-tertiary">
                      Test login: <code className="bg-gray-100 px-1 py-0.5 rounded text-text-secondary">rajesh@luminary.com</code>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Studio Registered Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Memory Makers Studio"
                          value={adminSignupForm.studioName}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, studioName: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Brand Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. MemoryMakers"
                          value={adminSignupForm.brandName}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, brandName: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Studio Owner Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={adminSignupForm.ownerName}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, ownerName: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">City / Location</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hyderabad"
                          value={adminSignupForm.city}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, city: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Contact Email</label>
                        <input
                          type="email"
                          required
                          placeholder="owner@studio.com"
                          value={adminSignupForm.email}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, email: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">WhatsApp Mobile Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={adminSignupForm.mobile}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, mobile: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary">Create Password</label>
                      <input
                        type="password"
                        required
                        placeholder="At least 8 characters"
                        value={adminSignupForm.password}
                        onChange={(e) => setAdminSignupForm({ ...adminSignupForm, password: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-brand-blue-primary py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                    >
                      Register New Studio & Start Trial
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 2. Crew Member Portal */}
            {activePortal === "employee" && (
              <div>
                <div className="mb-6 border-b border-border-divider pb-4">
                  <h3 className="text-lg font-bold text-text-primary">Studio Crew Member Portal</h3>
                  <p className="text-xs text-text-tertiary">
                    Photographers, Videographers, Editors & Album Designers login using the crew handle assigned by your studio owner.
                  </p>
                </div>

                <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary">
                      Crew Handle
                      <span className="ml-2 font-normal text-text-tertiary">(format: username@studioname)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. vikram_lens@luminary"
                      value={employeeForm.username}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 font-mono text-sm outline-none focus:border-brand-purple-primary focus:ring-1 focus:ring-brand-purple-primary"
                    />
                    <p className="mt-1 text-xs text-text-tertiary">
                      Your crew handle is provided by your studio owner when added to the system.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={employeeForm.password}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-purple-primary focus:ring-1 focus:ring-brand-purple-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-brand-purple-primary py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Crew Member Login
                  </button>
                  <p className="text-center text-xs text-text-tertiary">
                    Test crew handle: <code className="bg-gray-100 px-1 py-0.5 rounded text-text-secondary">vikram_lens@luminary</code>
                  </p>
                </form>
              </div>
            )}

            {/* 3. Customer Order Tracker Portal (No Login Required) */}
            {activePortal === "customer" && (
              <div>
                <div className="mb-6 border-b border-border-divider pb-4">
                  <div className="inline-flex rounded-full bg-brand-orange-background px-3 py-0.5 text-xs font-bold text-brand-orange-primary">
                    NO LOGIN REQUIRED
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-text-primary">Customer Order Tracker</h3>
                  <p className="text-xs text-text-tertiary">
                    Enter your Order ID or registered mobile number to check live editing, album, and delivery status.
                  </p>
                </div>

                <form onSubmit={handleCustomerSearch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary">Order ID or Mobile Number</label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="e.g. ord-8821 or FOC-2026-8821 or +91 99887 76655"
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-orange-primary"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-lg bg-brand-orange-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    Test Order IDs: <code className="bg-gray-100 px-1 py-0.5 rounded text-text-secondary">ord-8821</code> or <code className="bg-gray-100 px-1 py-0.5 rounded text-text-secondary">ord-9042</code>
                  </p>
                </form>

                {/* Order Result Card */}
                {searchExecuted && (
                  <div className="mt-6 border-t border-border-divider pt-6">
                    {foundOrder ? (
                      <div className="rounded-xl border border-brand-orange-soft bg-brand-orange-background/40 p-5">
                        <div className="flex flex-col justify-between gap-2 border-b border-brand-orange-soft pb-3 sm:flex-row sm:items-center">
                          <div>
                            <span className="font-mono text-xs font-bold text-brand-orange-primary">{foundOrder.displayId}</span>
                            <h4 className="text-base font-bold text-text-primary">{foundOrder.customerName}</h4>
                            <p className="text-xs text-text-secondary">{foundOrder.eventType} • Event Date: {foundOrder.eventDate}</p>
                          </div>
                          <span className="inline-block rounded-full bg-brand-orange-primary px-3 py-1 text-xs font-bold text-white">
                            Status: {foundOrder.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold text-text-primary">Workflow Progress Timeline:</p>
                          <div className="space-y-2">
                            {foundOrder.workflowTimeline.map((step, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-2">
                                  <span className={`h-2.5 w-2.5 rounded-full ${step.completed ? "bg-green-500" : "bg-gray-300"}`} />
                                  <span className={step.completed ? "font-medium text-text-primary" : "text-text-tertiary"}>
                                    {step.stage}
                                  </span>
                                </span>
                                <span className="text-text-tertiary">{step.date}</span>
                              </div>
                            ))}
                          </div>

                          {foundOrder.galleryLink && (
                            <div className="mt-4 rounded-lg bg-white p-3 border border-border-default text-xs">
                              <span className="font-semibold text-text-primary">Drive Photo Gallery: </span>
                              <a
                                href={foundOrder.galleryLink}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-brand-blue-primary underline hover:text-sky-700"
                              >
                                Access Photos Link →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-xs font-medium text-red-700">
                        No order found matching &quot;{customerSearchQuery}&quot;. Please check the Order ID provided by your studio.
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
      <footer className="border-t border-border-default bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <FocomanLogo className="h-10 w-auto" showStudiosSuffix={true} />
              <span className="text-xs text-text-tertiary">| Focus beyond the frames • Business Operating System for Photography Studios</span>
            </div>
            <p className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} ThreadSafe Focoman. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
