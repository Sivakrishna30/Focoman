"use client";

import Link from "next/link";
import { FocomanShieldWatermark } from "@/components/FocomanLogo";
import { Navbar } from "@/components/Navbar";

export function HomePage() {
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
            Bring your studio’s work, people, and orders together in one place and spend less time managing the work, more time creating.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/sign-in"
              className="w-full sm:w-64 text-center rounded-xl bg-brand-blue-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600 flex items-center justify-center"
            >
              Get Started with Focoman
            </Link>
            <Link
              href="/demo-studio/dashboard"
              className="w-full sm:w-64 text-center rounded-xl bg-brand-orange-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              <span>Explore Demo Workspace</span>
              <span className="text-white/80">→</span>
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
              Photography studio owners lose countless hours tracking shoots, chasing deliverables, updating spreadsheets, and managing payments. Focoman brings it all together, so you always know what’s happening, what’s pending, and what needs attention next.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* OMS Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-[10px] font-bold text-brand-blue-primary uppercase tracking-wider">
                Module 01 — Core
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Order Management (OMS)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Manage confirmed bookings across the 3-state lifecycle: Awaiting Event → Post-Event In Progress → Completed. Track payment status and production tasks independently.
              </p>
            </div>

            {/* CRM Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-orange-background px-3 py-1 text-[10px] font-bold text-brand-orange-primary uppercase tracking-wider">
                Module 02 — Support
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Customer Relations (CRM)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Maintain an operational customer directory with contact information and historical confirmed orders. Provides essential customer context for order delivery.
              </p>
            </div>

            {/* ERP Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-purple-background px-3 py-1 text-[10px] font-bold text-brand-purple-primary uppercase tracking-wider">
                Module 03 — Support
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">Studio Operations (ERP)</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Manage studio crew members, certified skill sets (photographer, videographer, editor, album designer), resource availability, and downstream production task assignments.
              </p>
            </div>

            {/* WhatsApp Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-status-success uppercase tracking-wider">
                Module 04 — Communication
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">WhatsApp Integration</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Deliver relevant operational notifications, order status updates, task reminders, and milestone alerts directly through WhatsApp.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-white px-6 py-3 text-sm font-bold text-text-primary shadow-xs transition hover:bg-surface-app hover:shadow-sm"
            >
              Explore More Features →
            </Link>
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

      {/* Section: Simple Pricing Highlight */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-border-divider mt-8">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
            Clear & Simple Pricing
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
            Choose the Right Plan for Your Studio
          </h2>
          <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            Every plan includes our core Order Management System. Upgrade as your team grows.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Starter Plan */}
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition flex flex-col justify-between">
            <div>
              <span className="inline-block self-start rounded-full bg-brand-blue-background px-3 py-1 text-[10px] font-bold text-brand-blue-primary uppercase tracking-wider mb-3">
                Starter
              </span>
              <h3 className="text-xl font-extrabold text-text-primary">₹499<span className="text-xs font-normal text-text-secondary">/mo</span></h3>
              <p className="mt-2 text-xs text-text-secondary">For solo photographers just getting started with order management.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-divider">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                Core Order Management & Tracking
              </span>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="rounded-3xl border-2 border-brand-orange-primary bg-white p-6 shadow-md flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 rounded-full bg-brand-orange-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              Most Popular
            </span>
            <div>
              <span className="inline-block self-start rounded-full bg-brand-orange-background px-3 py-1 text-[10px] font-bold text-brand-orange-primary uppercase tracking-wider mb-3 mt-1">
                Professional
              </span>
              <h3 className="text-xl font-extrabold text-text-primary">₹999<span className="text-xs font-normal text-text-secondary">/mo</span></h3>
              <p className="mt-2 text-xs text-text-secondary">For growing studios managing a team with CRM & ERP modules.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-divider">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                OMS + CRM + Crew ERP (10 Members)
              </span>
            </div>
          </div>

          {/* Complete Plan */}
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-purple-light transition flex flex-col justify-between">
            <div>
              <span className="inline-block self-start rounded-full bg-brand-purple-background px-3 py-1 text-[10px] font-bold text-brand-purple-primary uppercase tracking-wider mb-3">
                Complete
              </span>
              <h3 className="text-xl font-extrabold text-text-primary">₹1999<span className="text-xs font-normal text-text-secondary">/mo</span></h3>
              <p className="mt-2 text-xs text-text-secondary">Full-stack operations with WhatsApp notifications and multi-studio support.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-divider">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                Full Platform + WhatsApp + Multi-Studio
              </span>
            </div>
          </div>
        </div>

        {/* Common View Details Button for All Models */}
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue-primary px-8 py-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-sky-600"
          >
            <span>View Details & Compare Plans</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <p className="mt-2 text-xs text-text-tertiary">
            Explore feature comparison, module inclusion, and support tiers
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider mt-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
            Got Questions?
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition">
            <h3 className="text-base font-bold text-text-primary">What exactly is Focoman?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Focoman is a comprehensive business operating system designed specifically for photography and videography studios. It combines order management (OMS), customer relations (CRM), crew tracking (ERP), and financial tracking into one unified, easy-to-use platform.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition">
            <h3 className="text-base font-bold text-text-primary">Do my customers need to download an app or log in?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              No. Focoman provides guest order tracking through a secure, public link. Your clients can view their shoot status, outstanding balances, and final deliverables instantly from any browser without creating an account.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition">
            <h3 className="text-base font-bold text-text-primary">How does crew management and task assignment work?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              You can invite your photographers, videographers, and editors to your studio workspace. They sign in using their own Google account and only see the specific production tasks and shoots assigned to them, keeping your overall business financials private.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition">
            <h3 className="text-base font-bold text-text-primary">Can I manage multiple studios with one account?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Yes! Focoman uses a single personal identity system. You can own multiple studios or be a crew member in other studios, and switch between all your workspaces seamlessly from a single dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition">
            <h3 className="text-base font-bold text-text-primary">How do the WhatsApp notifications work?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Our Complete plan integrates direct WhatsApp alerts. Customers receive automated updates when their project moves to a new stage (e.g., &quot;Editing Started&quot;, &quot;Deliverables Ready&quot;), and crew members get instant notifications for new task assignments.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition">
            <h3 className="text-base font-bold text-text-primary">Is my studio data secure in the cloud?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Absolutely. We use enterprise-grade Google Cloud Infrastructure with end-to-end encryption. Your client lists, financial data, and internal crew communications are strictly isolated and never shared.
            </p>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
