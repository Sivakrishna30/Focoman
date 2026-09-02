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
            A comprehensive look at Focoman operations — from confirmed shoot booking through post-event production and client delivery.
          </p>
        </div>
      </section>

      {/* Module 1: OMS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold tracking-widest text-brand-blue-primary uppercase">
              Module 01 — Core OMS
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Order Management System
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              The operational core of Focoman. Every photoshoot booking flows through the 3-state lifecycle: Awaiting Event → Post-Event In Progress → Completed.
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
                title: "Drive & Cloud Delivery Links",
                desc: "Attach completed Google Drive or cloud gallery download links to orders for direct customer handover.",
              },
              {
                title: "Strict Completion Gate",
                desc: "Orders can only be marked Completed when both downstream production tasks are finished AND payments are fully collected.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border-default bg-surface-app p-5 transition hover:border-brand-blue-light hover:shadow-sm">
                <div className="h-1.5 w-8 rounded-full bg-brand-blue-primary mb-4" />
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 2: CRM */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-brand-orange-background px-3 py-1 text-xs font-bold tracking-widest text-brand-orange-primary uppercase">
              Module 02 — Support CRM
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Customer Relationship Context
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Maintain operational customer context, contact details, and historical confirmed orders to power your studio service delivery.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Customer Directory",
                desc: "Centralized contact directory with client name, phone number, email, and address. Search and filter instantly.",
              },
              {
                title: "Confirmed Order History",
                desc: "View all past and active confirmed orders for every client across weddings, birthdays, portraits, and corporate shoots.",
              },
              {
                title: "WhatsApp Operational Alerts",
                desc: "Automated booking confirmation, shoot day reminders, and ready-for-delivery notifications sent to client WhatsApp.",
              },
              {
                title: "Customer Preferences",
                desc: "Keep notes on family preferences, special shot requests, and past album style choices for returning clients.",
              },
              {
                title: "Lifetime Order Value",
                desc: "View total confirmed booking revenue per client across all their orders to recognize repeat customers.",
              },
              {
                title: "Direct Order Creation",
                desc: "Launch new confirmed orders directly from existing customer profiles without re-entering contact details.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border-default bg-surface-app p-5 transition hover:border-brand-orange-light hover:shadow-sm">
                <div className="h-1.5 w-8 rounded-full bg-brand-orange-primary mb-4" />
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: ERP */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-brand-purple-background px-3 py-1 text-xs font-bold tracking-widest text-brand-purple-primary uppercase">
              Module 03 — Support ERP
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Studio Resource & Crew Coordination
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Coordinate your crew, assign tasks by certified skill set, and manage multi-studio memberships without payroll or HR bloat.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Crew Skill Tagging",
                desc: "Register Photographers, Videographers, Photo Editors, and Album Designers with certified operational skill tags.",
              },
              {
                title: "Single Google Personal Identity",
                desc: "Crew members sign in once with Google and access all studios where they hold active memberships.",
              },
              {
                title: "Task Assignment & Workload",
                desc: "Assign specific shoots and post-event tasks directly to qualified crew members based on skill match.",
              },
              {
                title: "Availability Confirmation",
                desc: "Track crew confirmation for planned shoot assignments before event day to prevent staffing shortages.",
              },
              {
                title: "Multi-Studio Workspaces",
                desc: "A single person can own their own studio while serving as a member in other studios, switching workspaces freely.",
              },
              {
                title: "Downstream Task Accountability",
                desc: "Clear status progression: Assigned → In Progress → Review → Rework → Completed with stage notes.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border-default bg-surface-app p-5 transition hover:border-brand-purple-light hover:shadow-sm">
                <div className="h-1.5 w-8 rounded-full bg-brand-purple-primary mb-4" />
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            ))}
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
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-text-tertiary sm:px-6 lg:px-8">
          © {new Date().getFullYear()} ThreadSafe Focoman. All rights reserved. | Focus beyond the frames
        </div>
      </footer>
    </div>
  );
}
