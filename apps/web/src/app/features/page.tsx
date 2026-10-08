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
              Track and manage orders and their status across every milestone, from lead and inquiry through booking, event, production, and final delivery.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Confirmed Order",
                desc: "Create and manage confirmed orders with customer details, event information, package details, pricing, payments, and the complete post-event workflow through final delivery.",
              },
              {
                title: "Studio Marketplace Orders",
                desc: "Manage leads and bookings from Studio Marketplace packages, including customer details, selected packages, advance payment, booking confirmation, event planning, and the post-event workflow.",
              },
              {
                title: "Order Status Tracking",
                desc: "View pending, active, and completed orders in one place and check the current status of each order throughout the booking and production workflow.",
              },
              {
                title: "Client Passkey Tracking",
                desc: "Give clients a password-protected private link to check their event progress and access their gallery, photos, and delivery links without creating an account.",
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
                title: "Client Lifetime Value - LTV",
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

      {/* Module 3: Studio Operations - ERP */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-brand-purple-background px-3 py-1 text-xs font-bold tracking-widest text-brand-purple-primary uppercase">
              Module 03: Operations &amp; ERP
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Studio Operations - ERP
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Manage your studio team, assign shoots and production tasks, check crew availability, and keep track of crew expenses and payments.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Team Directory & Roles",
                desc: "Add photographers, videographers, drone pilots, and editors with their roles, skills, and contact details so your studio team is organized in one place.",
              },
              {
                title: "Shoot & Task Assignment",
                desc: "Assign team members to confirmed shoots and production tasks, and keep track of the work assigned to each crew member across active projects.",
              },
              {
                title: "Crew Availability",
                desc: "Check crew availability before assigning shoots and tasks, and view the current availability of team members when planning upcoming studio work.",
              },
              {
                title: "Expenses & Crew Payments",
                desc: "Record shoot day-rates, travel expenses, and crew payments to keep track of production costs and understand the expenses related to each studio project.",
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

      {/* Module 6: Business Reports & Analytics */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-amber-50/30 p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-2">
            <span className="inline-block w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold tracking-widest text-amber-800 uppercase">
              Module 06: Business Growth
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Business Reports &amp; Analytics
            </h2>
            <p className="max-w-3xl text-sm text-text-secondary sm:text-base">
              Clear monthly and yearly revenue charts, pending client balance tracking, and profit insights by photoshoot package to help your studio grow and earn more.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Monthly & Yearly Revenue Reports",
                desc: "See your total studio earnings by month and year. Track growth over time and compare peak wedding season vs off-season revenue.",
              },
              {
                title: "Pending Balances & Cash Flow",
                desc: "Instant list of all pending client dues, advance deposits received, and balance payments to collect before album delivery.",
              },
              {
                title: "Most Profitable Shoot Packages",
                desc: "Know exactly which photoshoot packages earn you the most profit—Weddings, Engagements, Receptions, Baby Shoots, or Corporate Events.",
              },
              {
                title: "On-Time Delivery & Speed",
                desc: "Review your average turnaround time from shoot day to final album hand-off to maintain high client satisfaction and earn 5-star reviews.",
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
      <footer className="border-t border-border-divider bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
            <p>© {new Date().getFullYear()} Focoman. All rights reserved.</p>
            <p>Built for professional photography studios.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
