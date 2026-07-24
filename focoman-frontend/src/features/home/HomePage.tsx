"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FocomanLogo, FocomanShieldWatermark } from "@/components/FocomanLogo";
import { Navbar } from "@/components/Navbar";
import { authApi } from "@/services/authApi";

export function HomePage() {
  const router = useRouter();

  // Active Main Portal Tab
  const [activePortal, setActivePortal] = useState<"admin" | "employee" | "customer">("admin");

  // Studio Admin States
  const [adminAuthType, setAdminAuthType] = useState<"login" | "signup">("login");
  const [adminLoginForm, setAdminLoginForm] = useState({ email: "", password: "" });
  const [adminSignupForm, setAdminSignupForm] = useState({
    brandName: "",
    ownerName: "",
    email: "",
    mobile: "",
    city: "",
    prefix: "",
    username: "",
    password: "",
    confirmPassword: "",
    instagram: "",
    youtube: "",
  });

  // Post Studio Creation Modal State
  const [createdStudioInfo, setCreatedStudioInfo] = useState<{
    studioId: string;
    brandName: string;
    ownerName: string;
    prefix: string;
  } | null>(null);

  // Studio Member States
  const [memberAuthType, setMemberAuthType] = useState<"login" | "apply">("login");
  const [employeeForm, setEmployeeForm] = useState({ username: "", password: "" });
  const [memberApplyForm, setMemberApplyForm] = useState({
    studioId: "RAJ", // Default prefix/ID
    name: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    skills: ["Candid Photography", "4K Videography"],
    primaryExpertise: "Candid Photography",
  });

  // Customer States
  const [customerAuthMode, setCustomerAuthMode] = useState<"guest" | "login" | "signup">("guest");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [foundOrder, setFoundOrder] = useState<{ displayId: string; customerName: string; eventType: string; eventDate: string; status: string; workflowTimeline: Array<{ stage: string; date: string; completed: boolean }> } | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [customerLoginForm, setCustomerLoginForm] = useState({ identifier: "", password: "" });
  const [customerSignupForm, setCustomerSignupForm] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
  });
  const [loggedInCustomer, setLoggedInCustomer] = useState<{ name: string; username: string } | null>(null);

  const [formFeedback, setFormFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available Skillsets for Crew Members
  const ALL_SKILLS = [
    "Candid Photography",
    "Traditional Photography",
    "4K Videography",
    "Drone Operation",
    "Photo Editing",
    "Video Editing",
    "Album Design",
  ];

  // 1. Studio Submit Handler
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormFeedback(null);

    if (adminAuthType === "login") {
      const res = await authApi.loginStudio(adminLoginForm.email, adminLoginForm.password);
      setIsSubmitting(false);
      if (res.success) {
        // Redirect to /luminary/dashboard as configured in mock database (luminary slug)
        const targetSlug = res.studioPrefix ? res.studioPrefix.toLowerCase() : "luminary";
        router.push(`/${targetSlug}/dashboard`);
      } else {
        setFormFeedback(res.message);
      }
    } else {
      if (adminSignupForm.password !== adminSignupForm.confirmPassword) {
        setIsSubmitting(false);
        setFormFeedback("Passwords do not match. Please verify password fields.");
        return;
      }

      const res = await authApi.registerStudio({
        studioName: adminSignupForm.brandName,
        brandName: adminSignupForm.brandName,
        ownerName: adminSignupForm.ownerName,
        email: adminSignupForm.email,
        mobile: adminSignupForm.mobile,
        city: adminSignupForm.city,
        prefix: adminSignupForm.prefix,
        username: adminSignupForm.username,
        password: adminSignupForm.password,
      });

      setIsSubmitting(false);
      if (res.success) {
        setCreatedStudioInfo({
          studioId: res.studioId || `STU-100201`,
          brandName: adminSignupForm.brandName,
          ownerName: adminSignupForm.ownerName,
          prefix: res.studioPrefix || adminSignupForm.prefix,
        });
      } else {
        setFormFeedback(res.message);
      }
    }
  };

  // 2. Member Submit Handler
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormFeedback(null);

    if (memberAuthType === "login") {
      const res = await authApi.loginMember(employeeForm.username, employeeForm.password);
      setIsSubmitting(false);
      if (res.success) {
        const targetSlug = res.studioPrefix ? res.studioPrefix.toLowerCase() : "luminary";
        router.push(`/${targetSlug}/dashboard/oms`);
      } else {
        setFormFeedback(res.message);
      }
    } else {
      const res = await authApi.applyForMembership({
        studioId: memberApplyForm.studioId,
        name: memberApplyForm.name,
        email: memberApplyForm.email,
        mobile: memberApplyForm.mobile,
        username: memberApplyForm.username,
        password: memberApplyForm.password,
        skills: memberApplyForm.skills,
        primaryExpertise: memberApplyForm.primaryExpertise,
      });

      setIsSubmitting(false);
      setFormFeedback(res.message);
      if (res.success) {
        setMemberAuthType("login");
      }
    }
  };

  // 3. Customer Search / Login Handler
  const handleCustomerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchExecuted(true);
    const query = customerSearchQuery.trim().toLowerCase();
    if (!query) {
      setFoundOrder(null);
      return;
    }

    // TODO: Backend integration needed
    // Endpoint: GET /api/oms/orders/search?query={query}
    // Currently showing placeholder - will implement when backend endpoint is ready
    setFoundOrder(null);
  };

  const handleCustomerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormFeedback(null);

    if (customerAuthMode === "login") {
      const res = await authApi.loginCustomer(customerLoginForm.identifier, customerLoginForm.password);
      setIsSubmitting(false);
      if (res.success) {
        setLoggedInCustomer({ name: res.name || "Valued Client", username: res.username || customerLoginForm.identifier });
      } else {
        setFormFeedback(res.message);
      }
    } else {
      const res = await authApi.registerCustomer({
        name: customerSignupForm.name,
        email: customerSignupForm.email,
        mobile: customerSignupForm.mobile,
        username: customerSignupForm.username,
        password: customerSignupForm.password,
      });
      setIsSubmitting(false);
      setFormFeedback(res.message);
      if (res.success) {
        setCustomerAuthMode("login");
      }
    }
  };

  const toggleSkill = (skill: string) => {
    setMemberApplyForm((prev) => {
      const exists = prev.skills.includes(skill);
      const newSkills = exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill];
      return { ...prev, skills: newSkills };
    });
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
            Empowering photography studio owners to streamline orders, manage teams, track pre and post event workflows, and delight clients effortlessly.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => router.push("/pricing")} className="rounded-xl bg-brand-blue-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600">Start Free Trial</button>
            <button onClick={() => router.push("/studio-marketplace")} className="rounded-xl border border-brand-blue-light bg-white px-6 py-3 text-sm font-bold text-brand-blue-primary shadow-sm transition hover:bg-brand-blue-background">Find Studios Near Me</button>
          </div>
        </div>
      </section>

      {/* Section 1: The Challenge We Solve */}
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

      {/* Section: Core Modules (OMS, CRM, ERP) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">Core Modules</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Focoman Operations Modules
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              Three powerful systems, working in perfect harmony, built to simplify your operations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* OMS Panel */}
            <div className="rounded-2xl border border-border-default bg-surface-app p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-[10px] font-bold text-brand-blue-primary uppercase tracking-wider">
                Module 01
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Order Management (OMS)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Track bookings from lead capture to advance payment, schedule shoots on a shared calendar, update culling & editing stages, and share delivery links directly via a client-facing tracker.
              </p>
            </div>

            {/* CRM Panel */}
            <div className="rounded-2xl border border-border-default bg-surface-app p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-orange-background px-3 py-1 text-[10px] font-bold text-brand-orange-primary uppercase tracking-wider">
                Module 02
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Customer Relations (CRM)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Maintain a deep customer directory. Record event type histories, contact details, total business value, and lead sources. Never miss personal milestones with built-in client birthday & anniversary tracking.
              </p>
            </div>

            {/* ERP Panel */}
            <div className="rounded-2xl border border-border-default bg-surface-app p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-purple-background px-3 py-1 text-[10px] font-bold text-brand-purple-primary uppercase tracking-wider">
                Module 03
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Studio Operations (ERP)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Register crew profiles (photographers, videographers, editors, designers), assign tasks directly, monitor active workloads, track logins via secure crew handles, and review system audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Value Added Services */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">Value Added Services</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Professional Business Add-ons
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              Get premium business assistance from the Focoman support team to establish your online presence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border-divider bg-surface-app p-6 hover:border-brand-blue-light transition">
              <h4 className="font-bold text-sm text-text-primary">Website Creation</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                Get a custom portfolio and booking website tailored to showcase your best frames.
              </p>
            </div>

            <div className="rounded-2xl border border-border-divider bg-surface-app p-6 hover:border-brand-orange-light transition">
              <h4 className="font-bold text-sm text-text-primary">API Integration</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                Connect external leads forms, custom galleries, and Google Workspace calendar tools seamlessly.
              </p>
            </div>

            <div className="rounded-2xl border border-border-divider bg-surface-app p-6 hover:border-brand-purple-light transition">
              <h4 className="font-bold text-sm text-text-primary">Data Migration</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                Import customer lists and previous order Excel spreadsheets securely without downtime.
              </p>
            </div>

            <div className="rounded-2xl border border-border-divider bg-surface-app p-6 hover:border-green-300 transition">
              <h4 className="font-bold text-sm text-text-primary">Custom Branding</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                Designed logos, matching templates, invoice headers, and custom-mapped studio domains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Access Portals (Studio Owner, Crew Member, Customer) */}
      <section id="login-portals" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">Unified System Portals</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Choose Your Access Portal
            </h2>
            <p className="mx-auto mt-2 text-sm text-text-secondary">
              Select your role below to log in or register your studio account.
            </p>

            {/* Portal Switcher Tabs */}
            <div className="mt-8 inline-flex rounded-xl bg-surface-app p-1.5 shadow-inner">
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
                Studio Admin
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
                Customer Portal
              </button>
            </div>
          </div>

          {/* Portal Form Container */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border-default bg-white p-6 shadow-md sm:p-8">
            {formFeedback && (
              <div className="mb-6 rounded-lg border border-brand-blue-light/40 bg-brand-blue-background p-4 text-xs font-medium text-brand-blue-primary">
                {formFeedback}
              </div>
            )}

            {/* ======================================================== */}
            {/* PORTAL 1: STUDIO ADMIN PORTAL                             */}
            {/* ======================================================== */}
            {activePortal === "admin" && (
              <div>
                <div className="mb-6 flex flex-col gap-3 border-b border-border-divider pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Studio Admin Portal</h3>
                    <p className="text-xs text-text-tertiary">Full system access to OMS, CRM, and Studio ERP</p>
                  </div>
                  <div className="inline-flex rounded-lg bg-surface-app p-1 text-xs font-semibold shrink-0">
                    <button
                      onClick={() => {
                        setAdminAuthType("login");
                        setFormFeedback(null);
                      }}
                      className={`rounded-md px-3 py-1.5 transition ${
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
                      className={`rounded-md px-3 py-1.5 transition ${
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
                      <label className="block text-xs font-semibold text-text-secondary">Studio Owner Email / Username / Studio ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. siva@luminary.com or STU-100201"
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
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-brand-blue-primary py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
                    >
                      {isSubmitting ? "Authenticating..." : "Login to Studio Dashboard"}
                    </button>
                    <p className="text-center text-xs text-text-tertiary">
                      Test studio owner login: <code className="bg-gray-100 px-1 py-0.5 rounded text-text-secondary">siva@luminary.com</code> (pass: <code className="bg-gray-100 px-1 py-0.5 rounded text-text-secondary">password123</code>)
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleAdminSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Studio / Brand Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Luminary Frames"
                          value={adminSignupForm.brandName}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, brandName: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Studio Owner Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={adminSignupForm.ownerName}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, ownerName: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">City / Studio Location</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hyderabad"
                          value={adminSignupForm.city}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, city: e.target.value })}
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
                        <label className="block text-xs font-semibold text-text-secondary">
                          Studio Unique Prefix
                          <span className="ml-1 text-[10px] text-brand-blue-primary">(2–6 letters e.g. LUMO, FOC)</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="e.g. LUMO"
                          value={adminSignupForm.prefix}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, prefix: e.target.value.toUpperCase() })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 font-mono text-sm uppercase outline-none focus:border-brand-blue-primary"
                        />
                        <p className="mt-1 text-[11px] text-text-tertiary">Used for order IDs & crew handles.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Owner Username</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. siva_owner"
                          value={adminSignupForm.username}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, username: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 col-span-1">
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary">
                            Instagram <span className="text-text-tertiary font-normal">(optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="@yourstudio"
                            value={adminSignupForm.instagram}
                            onChange={(e) => setAdminSignupForm({ ...adminSignupForm, instagram: e.target.value })}
                            className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary">
                            YouTube <span className="text-text-tertiary font-normal">(optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="channel name"
                            value={adminSignupForm.youtube}
                            onChange={(e) => setAdminSignupForm({ ...adminSignupForm, youtube: e.target.value })}
                            className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Create Password</label>
                        <input
                          type="password"
                          required
                          placeholder="At least 6 characters"
                          value={adminSignupForm.password}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, password: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Confirm Password</label>
                        <input
                          type="password"
                          required
                          placeholder="Re-enter password"
                          value={adminSignupForm.confirmPassword}
                          onChange={(e) => setAdminSignupForm({ ...adminSignupForm, confirmPassword: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-blue-primary"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-brand-blue-primary py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating Studio..." : "Register New Studio & Generate ID"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* PORTAL 2: CREW MEMBER PORTAL                             */}
            {/* ======================================================== */}
            {activePortal === "employee" && (
              <div>
                <div className="mb-6 flex flex-col gap-3 border-b border-border-divider pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Studio Crew Member Portal</h3>
                    <p className="text-xs text-text-tertiary">Photographers, Videographers, Editors & Designers</p>
                  </div>
                  <div className="inline-flex rounded-lg bg-surface-app p-1 text-xs font-semibold shrink-0">
                    <button
                      onClick={() => {
                        setMemberAuthType("login");
                        setFormFeedback(null);
                      }}
                      className={`rounded-md px-3 py-1.5 transition ${
                        memberAuthType === "login" ? "bg-white text-brand-purple-primary shadow-xs" : "text-text-tertiary"
                      }`}
                    >
                      Crew Login
                    </button>
                    <button
                      onClick={() => {
                        setMemberAuthType("apply");
                        setFormFeedback(null);
                      }}
                      className={`rounded-md px-3 py-1.5 transition ${
                        memberAuthType === "apply" ? "bg-white text-brand-purple-primary shadow-xs" : "text-text-tertiary"
                      }`}
                    >
                      Apply to Join Studio
                    </button>
                  </div>
                </div>

                {memberAuthType === "login" ? (
                  <form onSubmit={handleMemberSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary">
                        Crew Handle / Username
                        <span className="ml-2 font-normal text-text-tertiary">(e.g. vikram_lens@luminary or LUMO-MEM-101)</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. vikram_lens@luminary"
                        value={employeeForm.username}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 font-mono text-sm outline-none focus:border-brand-purple-primary focus:ring-1 focus:ring-brand-purple-primary"
                      />
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
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-brand-purple-primary py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isSubmitting ? "Authenticating..." : "Crew Member Login"}
                    </button>
                    <p className="text-center text-xs text-text-tertiary">
                      Test crew login: <code className="bg-gray-100 px-1 py-0.5 rounded text-text-secondary">vikram_lens@luminary</code> (pass: <code className="bg-gray-100 px-1 py-0.5 rounded text-text-secondary">password123</code>)
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleMemberSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary">
                        Target Studio Unique ID or Prefix
                        <span className="ml-1 text-brand-purple-primary">(e.g. LUMO or STU-100201)</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter Studio Prefix or ID (e.g. LUMO)"
                        value={memberApplyForm.studioId}
                        onChange={(e) => setMemberApplyForm({ ...memberApplyForm, studioId: e.target.value.toUpperCase() })}
                        className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 font-mono text-sm outline-none focus:border-brand-purple-primary"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={memberApplyForm.name}
                          onChange={(e) => setMemberApplyForm({ ...memberApplyForm, name: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-purple-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={memberApplyForm.mobile}
                          onChange={(e) => setMemberApplyForm({ ...memberApplyForm, mobile: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-purple-primary"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@gmail.com"
                          value={memberApplyForm.email}
                          onChange={(e) => setMemberApplyForm({ ...memberApplyForm, email: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-purple-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Desired Username</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. rohan_lens"
                          value={memberApplyForm.username}
                          onChange={(e) => setMemberApplyForm({ ...memberApplyForm, username: e.target.value })}
                          className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-purple-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={memberApplyForm.password}
                        onChange={(e) => setMemberApplyForm({ ...memberApplyForm, password: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-purple-primary"
                      />
                    </div>

                    {/* Skillsets Selection */}
                    <div className="rounded-xl border border-border-divider bg-purple-50/40 p-4">
                      <label className="block text-xs font-bold text-text-primary">
                        Select Your Skillsets & Expertise
                      </label>
                      <p className="mt-0.5 text-[11px] text-text-tertiary">
                        No fixed role needed! Choose all skills you possess. Your studio owner will assign you to orders based on event requirements.
                      </p>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {ALL_SKILLS.map((skill) => (
                          <label key={skill} className="flex items-center gap-2 text-xs text-text-primary cursor-pointer">
                            <input
                              type="checkbox"
                              checked={memberApplyForm.skills.includes(skill)}
                              onChange={() => toggleSkill(skill)}
                              className="rounded border-gray-300 text-brand-purple-primary focus:ring-brand-purple-primary"
                            />
                            {skill}
                          </label>
                        ))}
                      </div>

                      <div className="mt-3 border-t border-purple-100 pt-3">
                        <label className="block text-xs font-semibold text-text-secondary">Primary Expertise</label>
                        <select
                          value={memberApplyForm.primaryExpertise}
                          onChange={(e) => setMemberApplyForm({ ...memberApplyForm, primaryExpertise: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-border-default bg-white px-3 py-1.5 text-xs outline-none focus:border-brand-purple-primary"
                        >
                          {ALL_SKILLS.map((skill) => (
                            <option key={skill} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-brand-purple-primary py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting Application..." : "Submit Join Request to Studio Owner"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* PORTAL 3: CUSTOMER ORDER & ACCOUNT PORTAL               */}
            {/* =================================================summary */}
            {activePortal === "customer" && (
              <div>
                <div className="mb-6 flex flex-col gap-3 border-b border-border-divider pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Customer Order Status Portal</h3>
                    <p className="text-xs text-text-tertiary">Track orders as guest or manage multiple bookings with account</p>
                  </div>
                  <div className="inline-flex rounded-lg bg-surface-app p-1 text-xs font-semibold shrink-0">
                    <button
                      onClick={() => {
                        setCustomerAuthMode("guest");
                        setFormFeedback(null);
                      }}
                      className={`rounded-md px-3 py-1.5 transition ${
                        customerAuthMode === "guest" ? "bg-white text-brand-orange-primary shadow-xs" : "text-text-tertiary"
                      }`}
                    >
                      Guest Tracker
                    </button>
                    <button
                      onClick={() => {
                        setCustomerAuthMode("login");
                        setFormFeedback(null);
                      }}
                      className={`rounded-md px-3 py-1.5 transition ${
                        customerAuthMode === "login" || customerAuthMode === "signup" ? "bg-white text-brand-orange-primary shadow-xs" : "text-text-tertiary"
                      }`}
                    >
                      Customer Login
                    </button>
                  </div>
                </div>

                {customerAuthMode === "guest" && (
                  <div>
                    <form onSubmit={handleCustomerSearch} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary">Order ID</label>
                        <div className="mt-1.5 flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g. ord-8821 or FOC-2026-8821"
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
                                      <span className="text-text-tertiary">{step.date}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-xs font-medium text-red-600">
                            No order found matching query "{customerSearchQuery}". Please double check your Order ID or registered mobile number.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {(customerAuthMode === "login" || customerAuthMode === "signup") && (
                  <div>
                    {loggedInCustomer ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4 border border-orange-200">
                          <div>
                            <h4 className="text-sm font-bold text-text-primary">Welcome, {loggedInCustomer.name}!</h4>
                            <p className="text-xs text-text-secondary">Logged in as @{loggedInCustomer.username}</p>
                          </div>
                          <button
                            onClick={() => setLoggedInCustomer(null)}
                            className="text-xs font-semibold text-brand-orange-primary hover:underline"
                          >
                            Sign Out
                          </button>
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Your Bookings & Orders</h5>
                          <div className="rounded-xl border border-border-default p-4 bg-white shadow-xs">
                            <p className="text-xs text-text-secondary italic">
                              {/* TODO: Fetch customer's orders from backend once authenticated */}
                              Your orders will appear here once you log in
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-4 flex justify-center gap-4 text-xs font-semibold border-b border-border-divider pb-3">
                          <button
                            onClick={() => setCustomerAuthMode("login")}
                            className={customerAuthMode === "login" ? "text-brand-orange-primary border-b-2 border-brand-orange-primary pb-1" : "text-text-tertiary"}
                          >
                            Sign In to Account
                          </button>
                          <button
                            onClick={() => setCustomerAuthMode("signup")}
                            className={customerAuthMode === "signup" ? "text-brand-orange-primary border-b-2 border-brand-orange-primary pb-1" : "text-text-tertiary"}
                          >
                            Create Customer Account
                          </button>
                        </div>

                        {customerAuthMode === "login" ? (
                          <form onSubmit={handleCustomerAuth} className="space-y-4">
                            <div>
                              <label className="block text-xs font-semibold text-text-secondary">Email or Username</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. ananya@gmail.com"
                                value={customerLoginForm.identifier}
                                onChange={(e) => setCustomerLoginForm({ ...customerLoginForm, identifier: e.target.value })}
                                className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-orange-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-text-secondary">Password</label>
                              <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={customerLoginForm.password}
                                onChange={(e) => setCustomerLoginForm({ ...customerLoginForm, password: e.target.value })}
                                className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-orange-primary"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full rounded-lg bg-brand-orange-primary py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                            >
                              {isSubmitting ? "Signing In..." : "Customer Login"}
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleCustomerAuth} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-xs font-semibold text-text-secondary">Full Name</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ananya Sharma"
                                  value={customerSignupForm.name}
                                  onChange={(e) => setCustomerSignupForm({ ...customerSignupForm, name: e.target.value })}
                                  className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-orange-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-text-secondary">Mobile Number</label>
                                <input
                                  type="tel"
                                  required
                                  placeholder="+91 99887 76655"
                                  value={customerSignupForm.mobile}
                                  onChange={(e) => setCustomerSignupForm({ ...customerSignupForm, mobile: e.target.value })}
                                  className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-orange-primary"
                                />
                              </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block text-xs font-semibold text-text-secondary">Email Address</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="ananya@gmail.com"
                                  value={customerSignupForm.email}
                                  onChange={(e) => setCustomerSignupForm({ ...customerSignupForm, email: e.target.value })}
                                  className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-orange-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-text-secondary">Username</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="ananya_s"
                                  value={customerSignupForm.username}
                                  onChange={(e) => setCustomerSignupForm({ ...customerSignupForm, username: e.target.value })}
                                  className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-orange-primary"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-text-secondary">Password</label>
                              <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={customerSignupForm.password}
                                onChange={(e) => setCustomerSignupForm({ ...customerSignupForm, password: e.target.value })}
                                className="mt-1.5 w-full rounded-lg border border-border-default px-3.5 py-2 text-sm outline-none focus:border-brand-orange-primary"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full rounded-lg bg-brand-orange-primary py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                            >
                              {isSubmitting ? "Creating Account..." : "Register Customer Account"}
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Post Registration Studio Setup Modal */}
      {createdStudioInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-w-lg w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-brand-blue-light/30 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 font-bold text-2xl mb-4">
              ✓
            </div>

            <h3 className="text-xl font-extrabold text-text-primary">
              Account Created with Basic Info Provided!
            </h3>
            <p className="mt-2 text-xs text-text-secondary">
              Welcome aboard, <span className="font-bold text-text-primary">{createdStudioInfo.ownerName}</span>! Your studio brand <span className="font-bold text-brand-blue-primary">{createdStudioInfo.brandName}</span> has been provisioned.
            </p>

            <div className="mt-5 rounded-2xl bg-brand-blue-background p-4 border border-brand-blue-light/40 text-left space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Studio ID:</span>
                <span className="font-bold text-brand-blue-primary">{createdStudioInfo.studioId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Studio Prefix:</span>
                <span className="font-bold text-text-primary">{createdStudioInfo.prefix}</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-text-secondary">
              Visit your studio setup page to configure your leads page, packages, and team member accounts in the ERP system. Or reach out to us if you need data migration assistance.
            </p>

             <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push(`/${createdStudioInfo.prefix.toLowerCase()}/dashboard/erp`)}
                className="rounded-xl bg-brand-blue-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-600 transition"
              >
                Configure Studio ERP Page
              </button>
              <button
                onClick={() => {
                  alert("Support team notified! We will contact you shortly for migration assistance.");
                }}
                className="rounded-xl border border-border-default bg-white px-4 py-2.5 text-xs font-bold text-text-primary hover:bg-gray-50 transition"
              >
                Reach Out for Migration
              </button>
              <button
                onClick={() => router.push(`/${createdStudioInfo.prefix.toLowerCase()}/dashboard`)}
                className="rounded-xl px-4 py-2.5 text-xs font-medium text-text-tertiary hover:text-text-primary transition"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
