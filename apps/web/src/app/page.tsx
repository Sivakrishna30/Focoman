import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FocomanShieldWatermark } from "@/components/FocomanLogo";
import { ModuleAccordion } from "@/components/public/ModuleAccordion";
import { PricingAccordion } from "@/components/public/PricingAccordion";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { StructuredData } from "@/components/public/StructuredData";

export const metadata: Metadata = {
  title: "Focoman — Complete Business Operating System for Photography Studios",
  description:
    "Eliminate scattered WhatsApp chats, spreadsheets, and paper notebooks. Focoman brings orders, shoot schedules, dynamic service workflows, crew planning, offline payments, and client deliveries into one unified system.",
  alternates: {
    canonical: "https://focoman.web.app",
  },
  openGraph: {
    title: "Focoman — Complete Business Operating System for Photography Studios",
    description:
      "Eliminate scattered WhatsApp chats, spreadsheets, and paper notebooks. Focus beyond the frames with Focoman.",
    url: "https://focoman.web.app",
    siteName: "Focoman",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focoman — Business Operating System for Photography Studios",
    description:
      "Bring your studio's work, people, and orders together in one place — and spend less time managing the work, more time creating.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary selection:bg-brand-blue-soft">
      {/* JSON-LD Structured Data */}
      <StructuredData />

      {/* 1. Header Navigation */}
      <Navbar />

      <main id="main-content">
        {/* 2. Hero Section */}
        <section
          id="home"
          className="relative overflow-hidden border-b border-border-divider bg-gradient-to-b from-white via-brand-blue-background/25 to-surface-app px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <FocomanShieldWatermark className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-20" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full border border-brand-orange-soft bg-brand-orange-background px-5 py-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brand-orange-primary shadow-2xs">
              Focus beyond the frames
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              A Complete Business Operating System for{" "}
              <span className="bg-gradient-to-r from-brand-blue-primary via-brand-orange-primary to-brand-purple-primary bg-clip-text text-transparent">
                Photography Studios
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg lg:text-xl leading-relaxed">
              Bring your studio’s work, people, and orders together in one place — and spend less time managing the work, more time creating.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/sign-in"
                className="w-full sm:w-64 text-center rounded-xl bg-brand-blue-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600 flex items-center justify-center"
              >
                Start 14-Day Free Trial
              </Link>
              <Link
                href="/#how-it-works"
                className="w-full sm:w-64 text-center rounded-xl border border-border-default bg-white px-8 py-3.5 text-sm font-bold text-text-primary shadow-xs transition hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <span>How Focoman Works</span>
                <span className="text-text-tertiary">↓</span>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-semibold text-text-tertiary">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                Unlimited Orders &amp; Events
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                14-Day Full Trial
              </span>
            </div>
          </div>
        </section>

        {/* 3. Challenge Section */}
        <section id="challenge" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border-default bg-white p-8 sm:p-14 shadow-xs text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
              The Challenge We Solve
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              Eliminate Scattered WhatsApp Chats, Spreadsheets &amp; Paper Notebooks
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-text-secondary">
              Photography studio owners lose countless hours tracking shoots, chasing deliverables, updating spreadsheets, and managing payments. Focoman brings it all together, so you always know what’s happening, what’s pending, and what needs attention next.
            </p>
          </div>
        </section>

        {/* 4. Core Modules Section */}
        <section id="modules" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              Modular Operating Architecture
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Six Specialized Modules Built for Professional Studios
            </h2>
            <p className="mx-auto mt-3 text-sm sm:text-base text-text-secondary">
              From mandatory core order orchestration to intelligent resource automation and studio discovery storefronts. Click any module to explore its capabilities.
            </p>
          </div>

          <ModuleAccordion />
        </section>

        {/* 5. How Focoman Works */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider bg-slate-50/50">
          <div className="mx-auto max-w-3xl text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-purple-primary">
              Lifecycle Progression
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              How Focoman Works: Booking to Final Delivery
            </h2>
            <p className="mx-auto mt-3 text-sm sm:text-base text-text-secondary">
              Focoman seamlessly bridges the pre-confirmation booking journey into structured post-event order production.
            </p>
          </div>

          <div className="relative">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="rounded-2xl border border-border-default bg-white p-6 shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 font-mono text-xs font-bold text-pink-700 mb-4">
                    01
                  </span>
                  <h3 className="text-base font-bold text-text-primary">Discovery &amp; Inquiry</h3>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    Client explores your independent studio profile, browses packages and pricing, and submits a booking inquiry. Optional negotiation enables agreeing on a final price.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-divider/50 text-[10px] font-semibold text-text-tertiary uppercase">
                  Marketplace → Request
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-border-default bg-white p-6 shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue-background font-mono text-xs font-bold text-brand-blue-primary mb-4">
                    02
                  </span>
                  <h3 className="text-base font-bold text-text-primary">Advance &amp; Confirmation</h3>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    Studio issues an advance payment request. Client submits payment offline (Cash, UPI, Bank Transfer) with receipt proof. Studio verifies payment, confirming the booking.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-divider/50 text-[10px] font-semibold text-text-tertiary uppercase">
                  Verification → Confirmed Order
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-border-default bg-white p-6 shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange-background font-mono text-xs font-bold text-brand-orange-primary mb-4">
                    03
                  </span>
                  <h3 className="text-base font-bold text-text-primary">Pre-Flight &amp; Event Shoot</h3>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    Pre-flight check evaluates date overlaps and crew availability. Studio assigns qualified photographers and cinematographers. The shoot occurs on schedule with full venue coordination.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-divider/50 text-[10px] font-semibold text-text-tertiary uppercase">
                  Pre-flight → Shoot Day
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl border border-border-default bg-white p-6 shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 font-mono text-xs font-bold text-status-success mb-4">
                    04
                  </span>
                  <h3 className="text-base font-bold text-text-primary">Workflow, Delivery &amp; Close</h3>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    Dynamic workflows track editing, color grading, proofing, and album printing. Client receives deliverables via private passkey link, clears final balance, and order completes.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-divider/50 text-[10px] font-semibold text-text-tertiary uppercase">
                  Production → Final Handover
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Studio Marketplace Section */}
        <section id="marketplace" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
          <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-pink-50/30 p-8 sm:p-14 shadow-xs">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700 uppercase tracking-wider mb-3">
                Studio Discovery
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary">
                A Transparent Storefront for Your Studio
              </h2>
              <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
                Focoman is not a price-slashing competition or discount bidding site. Each studio owns its independent storefront with verified operational track records, transparent service packages, and direct booking inquiries.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/studios"
                  className="rounded-xl bg-zinc-900 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-black"
                >
                  Browse Verified Studios Directory →
                </Link>
                <Link
                  href="/sign-in"
                  className="rounded-xl border border-border-default bg-white px-6 py-3 text-xs sm:text-sm font-bold text-text-primary shadow-xs transition hover:bg-slate-50"
                >
                  Publish Your Studio Storefront
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left pt-8 border-t border-border-divider">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">No Race-to-the-Bottom</h4>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    No comparative price filters or cheapest studio leaderboards. Your artistry and reliability are showcased on your terms.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Verified Metrics</h4>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    On-time delivery percentages and completed order badges are computed automatically from actual operational history.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Strict Internal Privacy</h4>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    Your financial margins, customer CRM list, order details, and internal crew notes remain 100% private and protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Pricing Section */}
        <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              Simple, Transparent Pricing
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Choose the Plan Built for Your Studio’s Stage
            </h2>
            <p className="mx-auto mt-3 text-sm sm:text-base text-text-secondary">
              Every plan includes our complete Order Management System with unlimited orders and events. Upgrade as your team and operations expand.
            </p>
          </div>

          <PricingAccordion />
        </section>

        {/* 8. FAQ Section */}
        <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              Common Questions
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Honest, transparent answers about how Focoman operates.
            </p>
          </div>

          <FaqAccordion />
        </section>

        {/* 9. Final CTA Section */}
        <section id="cta" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
          <div className="rounded-3xl border border-brand-blue-primary/30 bg-gradient-to-br from-brand-blue-primary via-sky-600 to-indigo-700 p-8 sm:p-16 text-center text-white shadow-md relative overflow-hidden">
            <FocomanShieldWatermark className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-20 -translate-y-20 opacity-10" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs mb-4">
                Ready to Focus Beyond the Frames?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Transform Your Studio Operations Today
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed">
                Join photography and cinematography studios running their orders, crew workflows, and deliveries with peace of mind. Start your 14-day full trial with zero risk.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-xs sm:text-sm font-bold text-brand-blue-primary shadow-sm transition hover:bg-slate-50"
                >
                  Start 14-Day Free Trial
                </Link>
                <Link
                  href="/studios"
                  className="w-full sm:w-auto rounded-xl border border-white/40 bg-white/10 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs backdrop-blur-xs transition hover:bg-white/20"
                >
                  Explore Studio Directory
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer className="border-t border-border-divider bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border-divider">
            <div>
              <p className="text-sm font-bold text-text-primary">Focoman</p>
              <p className="text-xs text-text-secondary mt-1">
                A Complete Business Operating System for Photography Studios
              </p>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-text-secondary">
              <Link href="/#home" className="hover:text-text-primary transition">
                Home
              </Link>
              <Link href="/#modules" className="hover:text-text-primary transition">
                Modules
              </Link>
              <Link href="/#how-it-works" className="hover:text-text-primary transition">
                How It Works
              </Link>
              <Link href="/#marketplace" className="hover:text-text-primary transition">
                Marketplace
              </Link>
              <Link href="/#pricing" className="hover:text-text-primary transition">
                Pricing
              </Link>
              <Link href="/#faq" className="hover:text-text-primary transition">
                FAQ
              </Link>
              <Link href="/studios" className="hover:text-brand-blue-primary transition">
                Explore Studios
              </Link>
            </nav>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
            <p>© {new Date().getFullYear()} Focoman. All rights reserved.</p>
            <p>Built for professional photography and cinematography studios.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
