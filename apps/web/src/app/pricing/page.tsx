import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const PLANS = [
  {
    name: "Studio Starter",
    price: "499",
    tagline: "For solo photographers just getting started.",
    badge: "STARTER",
    badgeColor: "bg-brand-blue-background text-brand-blue-primary",
    borderHover: "hover:border-brand-blue-light",
    accentColor: "bg-brand-blue-primary",
    ctaColor: "bg-brand-blue-primary hover:bg-sky-600",
    ctaText: "Start with Starter",
    modules: ["Order Management System - OMS"],
    features: [
      "Confirmed order lifecycle management",
      "Shoot date schedule tracking",
      "Dynamic post-event workflow pipelines",
      "Payment advance & balance tracking",
      "Guest order tracking code (zero client login)",
      "Drive & cloud delivery link sharing",
      "Up to 2 crew members",
      "Single studio workspace",
      "Standard email support",
    ],
    notIncluded: [
      "Customer Relationship Context - CRM",
      "Studio Resource Coordination - ERP",
      "WhatsApp automated operational alerts",
      "Multi-studio workspace switching",
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
      "Customer Relationship Context - CRM",
      "Studio Resource Coordination - ERP",
    ],
    features: [
      "Everything in Studio Starter",
      "Customer directory & confirmed order history",
      "Crew member profiles & certified skill tagging",
      "Personal Google authentication & role assignment",
      "Production task assignment & workload tracking",
      "Planned resource availability confirmation",
      "Up to 10 crew members",
      "Priority email support",
    ],
    notIncluded: [
      "WhatsApp automated operational alerts",
      "Multi-studio workspace switching",
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
      "Customer Relationship Context - CRM",
      "Studio Resource Coordination - ERP",
      "WhatsApp Operational Notifications",
    ],
    features: [
      "Everything in Studio Professional",
      "WhatsApp booking confirmation alerts",
      "WhatsApp shoot day reminders (24 hrs prior)",
      "WhatsApp delivery ready notifications",
      "Multi-studio workspace switching",
      "Unlimited crew members",
      "Dedicated onboarding assistance",
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
            Simple, Transparent Pricing
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Choose the Right Plan for Your Studio
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
            Every plan includes our core Order Management System. Upgrade as your team grows and your operations expand.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-3xl border border-border-default bg-white p-8 shadow-sm transition hover:shadow-md ${plan.borderHover}`}
            >
              <div>
                {/* Badge & Plan Name */}
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-extrabold text-text-primary">{plan.name}</h2>
                <p className="mt-1 text-xs text-text-secondary">{plan.tagline}</p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-text-secondary">₹</span>
                  <span className="text-4xl font-extrabold text-text-primary">{plan.price}</span>
                  <span className="text-xs text-text-tertiary">/month</span>
                </div>

                {/* Modules Included */}
                <div className="mt-6 border-t border-border-divider pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Included Modules</p>
                  <div className="mt-2 space-y-1">
                    {plan.modules.map((m) => (
                      <div key={m} className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-100 text-status-success font-bold text-[10px]">
                          ✓
                        </span>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-6 border-t border-border-divider pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Features</p>
                  <ul className="mt-3 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs text-text-secondary">
                        <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-brand-blue-primary text-[9px] font-bold">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs text-text-tertiary opacity-60">
                        <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold">
                          ✕
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8 pt-6 border-t border-border-divider">
                <Link
                  href="/onboarding/register-studio"
                  className={`block w-full rounded-xl py-3 text-center text-xs font-bold text-white shadow-xs transition ${plan.ctaColor}`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            </div>
          ))}
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
