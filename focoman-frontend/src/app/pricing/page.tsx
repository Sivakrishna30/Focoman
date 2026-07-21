import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const PLANS = [
  {
    name: "Studio Starter",
    price: "499",
    tagline: "For solo photographers just getting started.",
    badge: "BASIC",
    badgeColor: "bg-brand-blue-background text-brand-blue-primary",
    borderHover: "hover:border-brand-blue-light",
    accentColor: "bg-brand-blue-primary",
    ctaColor: "bg-brand-blue-primary hover:bg-sky-600",
    ctaText: "Start with Starter",
    modules: ["Order Management System - OMS"],
    features: [
      "Lead & enquiry capture",
      "Shoot booking & calendar",
      "Pre & post event workflow tracker",
      "Payment advance tracking",
      "Customer order status portal (no login)",
      "Drive / gallery link sharing",
      "Up to 2 crew members",
      "Single studio branch",
      "Email support",
    ],
    notIncluded: [
      "Customer Relationship Management - CRM",
      "Studio Enterprise Resource Planning - ERP",
      "WhatsApp automated notifications",
      "Google Calendar sync",
      "Multi-studio / multi-branch",
    ],
  },
  {
    name: "Studio Professional",
    price: "999",
    tagline: "For growing studios managing a team.",
    badge: "MOST POPULAR",
    badgeColor: "bg-brand-orange-background text-brand-orange-primary",
    borderHover: "hover:border-brand-orange-light",
    accentColor: "bg-brand-orange-primary",
    ctaColor: "bg-brand-orange-primary hover:bg-orange-600",
    ctaText: "Go Professional",
    modules: [
      "Order Management System - OMS",
      "Customer Relationship Management - CRM",
      "Studio Enterprise Resource Planning - ERP",
    ],
    features: [
      "Everything in Studio Starter",
      "Full CRM — client directory & event history",
      "Lead source tracking",
      "Client lifetime value reports",
      "Crew member profiles & role management",
      "Crew handle login (username@studioname)",
      "Task assignment & workload dashboard",
      "Activity logs per crew member",
      "Up to 10 crew members",
      "Google Calendar sync",
      "Priority email support",
    ],
    notIncluded: [
      "WhatsApp automated notifications",
      "Multi-studio / multi-branch",
    ],
  },
  {
    name: "Studio Complete",
    price: "1999",
    tagline: "Full-stack operations for established studios.",
    badge: "COMPLETE",
    badgeColor: "bg-brand-purple-background text-brand-purple-primary",
    borderHover: "hover:border-brand-purple-light",
    accentColor: "bg-brand-purple-primary",
    ctaColor: "bg-brand-purple-primary hover:bg-purple-700",
    ctaText: "Get Complete Access",
    modules: [
      "Order Management System - OMS",
      "Customer Relationship Management - CRM",
      "Studio Enterprise Resource Planning - ERP",
      "WhatsApp Automated Notifications",
    ],
    features: [
      "Everything in Studio Professional",
      "WhatsApp booking confirmation alerts",
      "WhatsApp shoot day reminders (24 hrs prior)",
      "WhatsApp delivery ready notifications",
      "Birthday & anniversary client reminders",
      "Multi-studio / multi-branch support",
      "Unlimited crew members",
      "Advanced analytics & revenue dashboard",
      "Dedicated onboarding & data migration support",
      "Priority phone & WhatsApp support",
    ],
    notIncluded: [],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      {/* Page Hero */}
      <section className="border-b border-border-divider bg-gradient-to-b from-white to-surface-app px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-brand-orange-soft bg-brand-orange-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
            Simple Pricing
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            One Price. Everything Your Studio Needs.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-text-secondary sm:text-lg">
            No hidden fees. No per-user charges. Flat monthly pricing in INR — pick the plan that fits your studio size.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-3xl border border-border-default bg-white p-8 shadow-sm transition ${plan.borderHover} hover:shadow-md`}
            >
              {/* Badge & Name */}
              <div className="flex items-center justify-between">
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold tracking-widest ${plan.badgeColor}`}>
                  {plan.badge}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-text-primary">{plan.name}</h2>
              <p className="mt-1 text-xs text-text-secondary">{plan.tagline}</p>

              {/* Price */}
              <div className="mt-6 flex items-end gap-1">
                <span className="text-sm font-semibold text-text-secondary">₹</span>
                <span className="text-5xl font-extrabold tracking-tight text-text-primary">{plan.price}</span>
                <span className="mb-1 text-sm font-medium text-text-secondary">/ month</span>
              </div>
              <p className="mt-1 text-xs text-text-tertiary">Billed monthly · GST applicable</p>

              {/* Modules Included */}
              <div className="mt-6 rounded-xl bg-surface-app p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Modules Included</p>
                <div className="space-y-1.5">
                  {plan.modules.map((m) => (
                    <div key={m} className="flex items-center gap-2 text-xs font-medium text-text-primary">
                      <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${plan.accentColor}`} />
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 flex-1 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">What&apos;s included</p>
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-xs text-text-secondary">
                    <svg className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${plan.accentColor === "bg-brand-blue-primary" ? "text-brand-blue-primary" : plan.accentColor === "bg-brand-orange-primary" ? "text-brand-orange-primary" : "text-brand-purple-primary"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </div>
                ))}

                {plan.notIncluded.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-border-divider pt-4">
                    {plan.notIncluded.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-xs text-text-tertiary">
                        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href="/"
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold text-white transition ${plan.ctaColor}`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <div className="mt-12 rounded-2xl border border-border-default bg-white p-8 text-center">
          <h3 className="text-lg font-bold text-text-primary">Need a custom plan for your studio chain?</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            If you manage multiple studio branches across cities, or need custom integrations, reach out directly.
            ThreadSafe works with studios to build tailored pricing.
          </p>
          <p className="mt-4 text-sm font-semibold text-brand-blue-primary">
            Contact us at <span className="underline">hello@focoman.in</span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-text-tertiary sm:px-6 lg:px-8">
          © {new Date().getFullYear()} ThreadSafe Focoman. All rights reserved. | Prices in INR, GST applicable.
        </div>
      </footer>
    </div>
  );
}
