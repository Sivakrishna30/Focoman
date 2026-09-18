import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      {/* Page Hero */}
      <section className="border-b border-border-divider bg-gradient-to-b from-white to-surface-app px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-brand-blue-light bg-brand-blue-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
            Platform Capabilities
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Built for Every Stage of Your Confirmed Orders
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg">
            A comprehensive look at Focoman operations, from confirmed shoot booking through post-event production and client delivery.
          </p>
        </div>
      </section>

      {/* Module 1: OMS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold tracking-widest text-brand-blue-primary uppercase">
              Module 01: Core OMS
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Order Management System
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              The core order management system to track and manage your studio&apos;s confirmed orders and their status across every milestone, from RAW photo selection and editing through to final album delivery and client payments.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Confirmed Order Intake",
                desc: "Record confirmed photography orders with customer info, event type, date, venue, packages, and confirmed pricing.",
              },
              {
                title: "Planned Resource Assignments",
                desc: "Assign team members to upcoming shoot dates and track their availability confirmation before the event.",
              },
              {
                title: "Event Date Scheduling",
                desc: "Keep a clear view of all upcoming shoot dates to ensure photographers and gear are perfectly prepared.",
              },
              {
                title: "Dynamic Service Workflows",
                desc: "Workflows generated automatically based on order services: Photography tasks, Videography tasks, and Album design stages.",
              },
              {
                title: "Post-Event Production Pipeline",
                desc: "Stage-by-stage accountability: RAW backup → Photo culling → Color grading → Video editing → Album design → Final delivery.",
              },
              {
                title: "Independent Payment Tracking",
                desc: "Track Confirmed Price, Advance Received, and Remaining Balance due independently from the production stage.",
              },
              {
                title: "Guest Order Access Code",
                desc: "Zero-friction order status lookup for clients. Customers check real-time progress using their unique access code without passwords.",
              },
              {
                title: "Google Drive Sync & In-App Preview",
                desc: "Link order folders with embedded preview inside Focoman. View RAW photo thumbnails, proofing galleries, and deliverable files directly without opening external browser tabs.",
              },
              {
                title: "Strict Completion Gate",
                desc: "Orders can only be marked Completed when both downstream production tasks are finished AND payments are fully collected.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
                { border: "hover:border-green-300", bg: "bg-green-500" },
                { border: "hover:border-pink-300", bg: "bg-pink-500" }
              ][i % 5];
              return (
              <div key={f.title} className={`rounded-2xl border border-border-default bg-surface-app p-5 transition ${colors.border} hover:shadow-sm`}>
                <div className={`h-1.5 w-8 rounded-full mb-4 ${colors.bg}`} />
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Module 2: CRM */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-brand-orange-background px-3 py-1 text-xs font-bold tracking-widest text-brand-orange-primary uppercase">
              Module 02: Studio CRM
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Customer Relationship Management
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Maintain structured customer directories, past booking history, client preferences, and anniversary reminders to drive repeat bookings.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Centralized Customer Directory",
                desc: "Store full client profiles with verified phone numbers, email addresses, and physical locations for rapid lookup.",
              },
              {
                title: "Complete Booking & Order History",
                desc: "View the full chronological record of every past photoshoot booking, package selected, and event date with your studio.",
              },
              {
                title: "Client Lifetime Value (LTV)",
                desc: "Automatically calculate total cumulative revenue generated per customer across all their historical events to identify your most loyal clients.",
              },
              {
                title: "Outstanding Receivables Tracking",
                desc: "Monitor pending balances and overdue milestones per client at a glance before confirming repeat bookings.",
              },
              {
                title: "Fast Search & Quick Filtering",
                desc: "Instantly filter your entire customer base by name, phone number, email, or city for effortless communication.",
              },
              {
                title: "One-Click Order Creation",
                desc: "Create new confirmed orders directly from an existing customer profile without retyping their contact details.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
                { border: "hover:border-green-300", bg: "bg-green-500" },
                { border: "hover:border-pink-300", bg: "bg-pink-500" }
              ][i % 5];
              return (
              <div key={f.title} className={`rounded-2xl border border-border-default bg-surface-app p-5 transition ${colors.border} hover:shadow-sm`}>
                <div className={`h-1.5 w-8 rounded-full mb-4 ${colors.bg}`} />
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Module 3: ERP */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-brand-purple-background px-3 py-1 text-xs font-bold tracking-widest text-brand-purple-primary uppercase">
              Module 03: Studio ERP
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Studio Resource, Operations & Accounting
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Assign shoot tasks, check crew calendar availability, track equipment, and manage crew payroll, travel claims, and audit-ready accounting summaries.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Google Calendar & Availability Sync",
                desc: "Visual calendar scheduling assistant with two-way Google Calendar synchronization, showing crew blocked time and availability before assigning shoots to prevent double-booking.",
              },
              {
                title: "Crew Task Assignment & Ownership",
                desc: "Assign photographers, videographers, and editors to specific event dates and post-production deliverables with clear task ownership and status tracking.",
              },
              {
                title: "Asset & Equipment Tracking",
                desc: "Track checkout and return of cameras, lenses, gimbals, mics, and memory cards assigned to shoots or team members so gear never goes missing.",
              },
              {
                title: "Crew Payroll & Compensation",
                desc: "Track per-event day rates, shoot wages, travel allowances, and standard tax withholdings with a clear payout approval workflow.",
              },
              {
                title: "Travel & Incidental Claims",
                desc: "Allow crew to submit travel, fuel, and meal claims for out-of-station shoots with studio owner review and approval.",
              },
              {
                title: "Auditing, Accounts & Tax Readiness",
                desc: "Consolidates studio income, crew payouts, and approved travel expenses into clean financial records. Gives you a transparent audit trail of true profitability and makes annual tax filing fast, accurate, and completely stress-free.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
                { border: "hover:border-green-300", bg: "bg-green-500" },
                { border: "hover:border-pink-300", bg: "bg-pink-500" }
              ][i % 5];
              return (
              <div key={f.title} className={`rounded-2xl border border-border-default bg-surface-app p-5 transition ${colors.border} hover:shadow-sm`}>
                <div className={`h-1.5 w-8 rounded-full mb-4 ${colors.bg}`} />
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Native Integrations */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-green-50/30 p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-bold tracking-widest text-status-success uppercase">
              Embedded Integrations
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Google Workspace & WhatsApp Connectivity
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Integrated directly inside your daily workflows so you and your clients can preview deliverables and manage schedules without leaving Focoman.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Google Drive In-App Preview",
                desc: "Preview photoshoot folders, RAW selection thumbnails, and client deliverables directly inside Focoman without opening separate browser tabs.",
              },
              {
                title: "Google Calendar Live Sync",
                desc: "Automatically push shoot dates, call times, and locations onto crew members' personal Google Calendars with real-time schedule updates.",
              },
              {
                title: "WhatsApp Milestone Notifications",
                desc: "Deliver real-time booking confirmations, milestone transitions, and deliverable-ready download links directly to customer and crew phones.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-green-300", bg: "bg-green-500" },
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
              ][i % 3];
              return (
              <div key={f.title} className={`rounded-2xl border border-border-default bg-white p-5 transition ${colors.border} hover:shadow-sm`}>
                <div className={`h-1.5 w-8 rounded-full mb-4 ${colors.bg}`} />
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Module 4: Marketplace */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-pink-50 px-3 py-1 text-xs font-bold tracking-widest text-pink-600 uppercase">
              Discovery & Search
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Studio Marketplace
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Discover verified photography and videography studios near you with authentic performance metrics, on-time delivery track records, and client reviews, while studio owners retain complete control over visibility and profile settings.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Local Studio Discovery",
                desc: "Clients can easily find verified photography and videography studios near them based on city, services, and creative specializations.",
              },
              {
                title: "Verified Performance Metrics",
                desc: "Evaluate studios using authentic operational data, such as on-time delivery percentages and completed order milestones.",
              },
              {
                title: "Authentic Reviews & Ratings",
                desc: "Real customer reviews and satisfaction ratings give clients confidence in selecting the perfect studio for their event.",
              },
              {
                title: "Studio Visibility Controls",
                desc: "Studio owners can toggle their public marketplace listing on or off at any time and decide exactly what information to display.",
              },
              {
                title: "Strict Operational Privacy",
                desc: "Internal CRM, ERP tasks, shoot assignments, client contact details, and financial books remain 100% private and protected.",
              },
              {
                title: "Independent Guest Portal",
                desc: "The public discovery marketplace remains strictly separated from the private, passkey-protected guest tracking portal used for active client deliveries.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
                { border: "hover:border-green-300", bg: "bg-green-500" },
                { border: "hover:border-pink-300", bg: "bg-pink-500" }
              ][i % 5];
              return (
              <div key={f.title} className={`rounded-2xl border border-border-default bg-surface-app p-5 transition ${colors.border} hover:shadow-sm`}>
                <div className={`h-1.5 w-8 rounded-full mb-4 ${colors.bg}`} />
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border-divider bg-white py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold text-text-primary sm:text-3xl">Ready to streamline your studio?</h2>
          <p className="mt-3 text-text-secondary">Register your studio workspace and experience focused order operations.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/onboarding/register-studio"
              className="rounded-xl bg-brand-blue-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              Register Your Studio
            </Link>
            <Link
              href="/workspaces"
              className="rounded-xl border border-border-default bg-white px-6 py-3 text-sm font-semibold text-text-primary transition hover:border-brand-blue-light hover:shadow-sm"
            >
              Access Workspaces
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} ThreadSafe Focoman. All rights reserved. | Focus beyond the frames
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
              <Link href="/#faq" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
