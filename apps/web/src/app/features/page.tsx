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
              Module 03: Operations & People
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Studio Operations - ERP
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Update Status Without Opening the Tool",
                desc: "Crew members and studio owners can acknowledge call times, confirm shoots, or advance production milestones (e.g. RAW Ingest Done, Gallery Dispatched) directly via interactive WhatsApp bot commands without logging into the web dashboard.",
              },
              {
                title: "Purpose-Built Operations Bot",
                desc: "Direct operational assistant in your WhatsApp chat for querying active order status, reviewing pending/upcoming shoots, receiving automated reminders, and executing owner actions.",
              },
              {
                title: "Automated Milestone Notifications",
                desc: "Notify clients instantly when RAW photos are uploaded, selection galleries are live, album layout previews are ready for sign-off, or physical albums are dispatched.",
              },
              {
                title: "Crew Shoot Reminders & Call-Times",
                desc: "Send automated 48-hour and 12-hour call-time reminders to assigned photographers and cinematographers with venue GPS coordinates, call times, and shotlist requirements.",
              },
              {
                title: "Payment & Due Reminders",
                desc: "Timely, professional balance reminders with payment verification receipts sent straight to WhatsApp, ensuring transparent receivables before handover.",
              },
              {
                title: "Zero-Login Client Passkey Tracking",
                desc: "Clients never create passwords or download separate apps. Milestone alerts include their collision-safe private passkey link for real-time progress and proofing.",
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

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Configurable Package Deliverables Setup",
                desc: "Configure service packages once (edited photos count, teaser video length, full film, album sheet specifications). Focoman automatically breaks down the deliverables and seeds production tasks upon order confirmation.",
              },
              {
                title: "Auto-Assign Crew by Availability & Workload",
                desc: "Smart resource matching evaluates shoot dates, venue locations, crew skills (candid photographer, traditional videographer, drone pilot, editor), calendar availability, and active workload to suggest conflict-free crew assignments automatically.",
              },
              {
                title: "Automatic Financial Calculations & Breakdowns",
                desc: "Automated calculation of booking advance deposits, event-day installments, remaining balance dues, crew day rates, and travel expense breakdowns without manual spreadsheet math.",
              },
              {
                title: "Automated Workflow Progression",
                desc: "When shoot dates pass, the engine automatically spins up the post-event production pipeline, notifying crew to initiate RAW ingests, dual backups, and culling tasks.",
              },
              {
                title: "Pre-Flight Conflict Detection",
                desc: "Automatic evaluation of date overlaps, member availability, and skill alignment prior to booking confirmation, preventing double-booking catastrophes.",
              },
              {
                title: "Strict Delivery & Payment Completion Lock",
                desc: "Automatically enforces operational safety gates, ensuring orders cannot be archived as completed until all physical/digital deliverables are delivered and payments are 100% cleared.",
              },
            ].map((f, i) => {
              const colors = [
                { border: "hover:border-amber-300", bg: "bg-amber-500" },
                { border: "hover:border-brand-blue-light", bg: "bg-brand-blue-primary" },
                { border: "hover:border-brand-purple-light", bg: "bg-brand-purple-primary" },
                { border: "hover:border-green-300", bg: "bg-green-500" },
                { border: "hover:border-brand-orange-light", bg: "bg-brand-orange-primary" },
                { border: "hover:border-pink-300", bg: "bg-pink-500" },
              ][i % 6];
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
