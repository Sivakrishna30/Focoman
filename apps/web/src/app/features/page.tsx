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
            Platform Features
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Built for Every Part of Your Studio Workflow
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg">
            A deep look at every capability inside Focoman — from the first client enquiry to final album delivery.
          </p>
        </div>
      </section>

      {/* Module 1: OMS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold tracking-widest text-brand-blue-primary uppercase">
              Module 01 — OMS
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Order Management System
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              The backbone of Focoman. Every photoshoot booking flows through the OMS — from the initial lead to the final file handover.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Lead & Enquiry Capture",
                desc: "Log every incoming lead from WhatsApp, website, walk-in, or referral. Assign status: New, Follow-up, Converted, or Lost.",
              },
              {
                title: "Booking & Contract",
                desc: "Convert leads into confirmed orders. Record event type, date, venue, package, and booking advance payment.",
              },
              {
                title: "Shooting Calendar",
                desc: "Visual calendar of all upcoming shoots. Sync with Google Calendar to prevent double-booking and team conflicts.",
              },
              {
                title: "Pre-Event Workflow Tracker",
                desc: "Track pre-shoot tasks: outfit consultation, location scouting, shot list approval, and equipment prep.",
              },
              {
                title: "Post-Event Workflow Tracker",
                desc: "Stage-by-stage pipeline: RAW upload → Culling → Color grading → Video edit → Client preview → Album design → Print & delivery.",
              },
              {
                title: "Payment Tracking",
                desc: "Log advance, balance due, and final payments. Set due date reminders. View pending collections at a glance.",
              },
              {
                title: "Customer Order Portal",
                desc: "Zero-login order status portal for clients. Enter Order ID or mobile number to see real-time workflow progress.",
              },
              {
                title: "Drive / Gallery Links",
                desc: "Attach Google Drive or cloud gallery links to completed orders. Customers can access directly through the portal.",
              },
              {
                title: "Order Analytics",
                desc: "View order counts by month, event type, and photographer. Identify busy seasons and revenue peaks.",
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
              Module 02 — CRM
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Customer Relationship Management
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Build lasting client relationships. Know your customers deeply — their history, preferences, and lifetime value to your studio.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Customer Directory",
                desc: "Centralized contact database with name, mobile, email, city, and event history. Search and filter instantly.",
              },
              {
                title: "Event History Timeline",
                desc: "See all past bookings for every client — wedding, pre-wedding, baby shower, corporate. Full history at a glance.",
              },
              {
                title: "Lead Source Tracking",
                desc: "Tag where each lead came from: Instagram, website, Google, referral, or walk-in. Optimize your marketing spend.",
              },
              {
                title: "WhatsApp Automated Alerts",
                desc: "Auto-send booking confirmation, shoot day reminder (24 hrs before), and delivery ready notifications via WhatsApp.",
              },
              {
                title: "Birthday & Anniversary Reminders",
                desc: "Receive internal alerts on client anniversaries and birthdays. A personal touch that brings clients back.",
              },
              {
                title: "Client Lifetime Value",
                desc: "Track total revenue earned per client across all their bookings. Identify your most loyal and high-value customers.",
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
              Module 03 — ERP
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Studio Enterprise Resource Planning
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Manage your crew, control access, and keep operations running smoothly — without the bloat of traditional HRMS systems.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Crew Member Profiles",
                desc: "Register Photographers, Videographers, Editors, and Album Designers. Assign roles and set system access levels.",
              },
              {
                title: "Crew Handle Login",
                desc: "Each crew member gets a unique handle in username@studioname format. No shared passwords. Clean access control.",
              },
              {
                title: "Task Assignment",
                desc: "Assign specific shoots and post-production tasks to crew. Each member sees only their assigned work.",
              },
              {
                title: "Workload Dashboard",
                desc: "Studio owners see total active tasks per crew member. Prevent burnout and balance assignments effectively.",
              },
              {
                title: "Activity Logs",
                desc: "Every action in the system is logged against the crew handle — who updated what and when.",
              },
              {
                title: "Multi-Studio Support",
                desc: "If your brand operates from multiple cities, each studio branch gets its own tenant space under the same owner account.",
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
          <h2 className="text-2xl font-extrabold text-text-primary sm:text-3xl">Ready to see it in action?</h2>
          <p className="mt-3 text-text-secondary">Choose a plan that fits your studio size and start your free trial.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="rounded-xl bg-brand-blue-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              View Pricing
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-border-default bg-white px-6 py-3 text-sm font-semibold text-text-primary transition hover:border-brand-blue-light hover:shadow-sm"
            >
              Back to Home
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
