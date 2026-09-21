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
              Module 01: Core Engine
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Order Management System - OMS
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              The core order management system to track and manage your studio&apos;s confirmed orders and their status across every milestone, from RAW photo selection and editing through to final album delivery and client payments.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Confirmed Order",
                desc: "Create and manage confirmed orders and the complete post-event workflow from RAW backup and photo selection through editing, album design, client review, printing, final delivery, and payment completion.",
              },
              {
                title: "Studio Marketplace Complete Workflow",
                desc: "Manage Studio Marketplace bookings through a pre-event workflow covering leads and inquiries, advance payment, booking confirmation, and event planning, in addition to the post-event workflow through to final delivery and payment completion.",
              },
              {
                title: "Client Passkey Tracking",
                desc: "Give clients a secure, private link to track their event progress and access their gallery, photos, and delivery links without creating an account.",
              },
              {
                title: "Order Lifecycle & Recovery",
                desc: "Manage active, cancelled, and completed orders separately, with a 14-day recovery window for deleted orders.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
                { border: "hover:border-green-300", bg: "bg-green-500" },
              ][i % 4];
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
              Module 02: Support Module
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Customer Relations - CRM
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Maintain structured customer directories, past booking history, and anniversary reminders to drive repeat bookings.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Centralized Customer Directory",
                desc: "Store full client profiles with verified phone numbers, email addresses, and physical locations for rapid lookup.",
              },
              {
                title: "Order, Payment & Receivables History",
                desc: "Instant visibility into all past and active photoshoot orders, cumulative customer spend, historical receipts, advance deposits, and outstanding receivables across years of service.",
              },
              {
                title: "Anniversary & Customer Milestone Reminders",
                desc: "Use previous event dates to remind studios about upcoming anniversaries and important customer milestones, creating opportunities to reconnect and offer relevant photography services.",
              },
              {
                title: "Client Lifetime Value (LTV)",
                desc: "Automatically calculate total cumulative revenue generated per customer across all their historical events to identify your most loyal clients.",
              },
              {
                title: "Booking & Inquiry Records",
                desc: "Review past booking inquiries, lead history, and shoot requests directly attached to customer profile records.",
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
                { border: "hover:border-pink-300", bg: "bg-pink-500" },
                { border: "hover:border-amber-300", bg: "bg-amber-500" }
              ][i % 6];
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
              Module 03: Operations & People
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Studio Operations - ERP
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Assign shoot tasks, check crew calendar availability, track equipment, and manage crew payroll, travel claims, and audit-ready accounting summaries.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Crew Profiles & Roles",
                desc: "Create crew member profiles and assign their roles and skills, such as videographers, editors, drone pilots, and other studio crew.",
              },
              {
                title: "Manual Crew Assignment",
                desc: "Manually assign crew members to confirmed events based on their availability and current workload.",
              },
              {
                title: "Crew Workload Tracker",
                desc: "Give studio owners a clear view of each crew member’s assigned projects, pending work, and current project status.",
              },
              {
                title: "Smart Resource Suggestions",
                desc: "Suggest suitable crew members based on event date, location, required roles and skills, availability, and workload. The studio owner reviews and confirms the suggested assignment.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
                { border: "hover:border-green-300", bg: "bg-green-500" },
              ][i % 4];
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

      {/* Module 4: WhatsApp Operations & Bot */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-green-50/30 p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-bold tracking-widest text-status-success uppercase">
              Module 04: Communication & Bot
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              WhatsApp Operations & Interactive Bot
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Automated WhatsApp alerts and mobile operations: send booking confirmations and gallery links to clients, shoot reminders and call-times to crew, and receive real-time order milestone updates.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Automated WhatsApp Notifications",
                desc: "Send booking confirmations, event reminders, production updates, gallery links, and delivery updates to clients and crew through WhatsApp.",
              },
              {
                title: "WhatsApp Status Updates",
                desc: "Allow studio owners and crew members to update supported event and production statuses directly through WhatsApp without opening the Focoman dashboard.",
              },
              {
                title: "Focoman Operations Bot",
                desc: "Use the Focoman WhatsApp Bot to check active orders, upcoming events, pending tasks, and other supported studio operations directly from WhatsApp.",
              },
              {
                title: "Crew Reminders & Call Times",
                desc: "Send scheduled reminders to assigned crew members with event date, call time, venue location, and required shoot information.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-green-300", bg: "bg-green-500" },
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
              ][i % 4];
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

      {/* Module 5: Marketplace */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-pink-50 px-3 py-1 text-xs font-bold tracking-widest text-pink-600 uppercase">
              Module 05: Studio Marketplace
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

      {/* Module 6: Automations */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-amber-50/30 p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold tracking-widest text-amber-800 uppercase">
              Module 06: Smart Automations
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Automations & Smart Engine
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Eliminate repetitive manual busywork with smart automation that configures package deliverables, suggests crew assignments based on availability and workload, calculates payment breakdowns, and advances production pipelines automatically.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Automatic Payment Calculations",
                desc: "Automatically calculate advance payments, event-day installments, remaining balances, crew day rates, and configured travel expenses.",
              },
              {
                title: "Automated Workflow Progression",
                desc: "Automatically start the required post-event production workflow when an event is completed, and notify the relevant crew about their pending production tasks.",
              },
              {
                title: "Pre-Flight Conflict Detection",
                desc: "Check event dates, crew availability, workload, and required skills before booking confirmation to identify potential scheduling and resource conflicts.",
              },
              {
                title: "Native Studio Integrations",
                desc: "Synchronize crew shoot schedules directly with Google Calendar, and manage Google Drive folders with in-app preview and client comments options.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-amber-300", bg: "bg-amber-500" },
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
                { border: "hover:border-green-300", bg: "bg-green-500" },
              ][i % 4];
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
