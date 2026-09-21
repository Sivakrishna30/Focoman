import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FocomanShieldWatermark } from "@/components/FocomanLogo";
import { ModuleAccordion } from "@/components/public/ModuleAccordion";
import { PricingTwoPanels } from "@/components/public/PricingTwoPanels";
import { ValueAddedServices } from "@/components/public/ValueAddedServices";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { StructuredData } from "@/components/public/StructuredData";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://focoman.web.app";

export const metadata: Metadata = {
  title: "Focoman — Complete Business Operating System for Photography Studios",
  description:
    "Eliminate scattered WhatsApp chats, spreadsheets, and paper notebooks. Focoman brings orders, shoot schedules, dynamic service workflows, crew planning, offline payments, and client deliveries into one unified system.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Focoman — Complete Business Operating System for Photography Studios",
    description:
      "Eliminate scattered WhatsApp chats, spreadsheets, and paper notebooks. Focus beyond the frames with Focoman.",
    url: baseUrl,
    siteName: "Focoman",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focoman — Business Operating System for Photography Studios",
    description:
      "Bring your studio's work, people, and orders together in one place and spend less time managing the work, more time creating.",
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
              Bring your studio’s work, people, and orders together in one place and spend less time managing the work, more time creating.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/sign-in"
                className="w-full sm:w-64 text-center rounded-xl bg-brand-blue-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600 flex items-center justify-center"
              >
                Start 30-Day Free Trial
              </Link>
              <Link
                href="/#how-it-works"
                className="w-full sm:w-64 text-center rounded-xl border border-border-default bg-white px-8 py-3.5 text-sm font-bold text-text-primary shadow-xs transition hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <span>How Focoman Works</span>
                <span className="text-text-tertiary">↓</span>
              </Link>
            </div>


          </div>
        </section>

        {/* 3. Challenge & Solution Section */}
        <section id="challenge" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border-default bg-white p-8 sm:p-14 shadow-xs">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
                Why Focoman?
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
                Eliminate Scattered WhatsApp Chats, Spreadsheets &amp; Paper Notebooks
              </h2>
              <p className="mx-auto mt-4 text-sm sm:text-base leading-relaxed text-text-secondary">
                Photography studio owners lose countless hours tracking shoots, chasing deliverables, and managing payments across fragmented tools. Focoman unifies your entire operation into a single, modular system.
              </p>
            </div>

            <div className="mt-12">
              <ModuleAccordion />
            </div>
          </div>
        </section>

        {/* 4. How Focoman Works */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider bg-slate-50/50">
          <div className="mx-auto max-w-3xl text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-purple-primary">
              HOW FOCOMAN WORKS
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              A Clear Workflow for Every Stage of Your Studio
            </h2>
            <p className="mx-auto mt-3 text-sm sm:text-base text-text-secondary">
              All your studio operations stay connected through a structured workflow pipeline, keeping every stage organized, clear, and easy to manage.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-4 relative">
              {/* Connecting Line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border-divider hidden sm:block" aria-hidden="true" />

              {/* Stage 1 */}
              <div className="relative rounded-2xl border border-border-default bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start gap-4">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 font-mono text-sm font-bold text-pink-700 border border-pink-100">
                  01
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-text-primary">
                      Studio Discovery &amp; Booking Request
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100 hidden sm:inline-block">
                      Discovery
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Client discovers an independent studio profile, explores its packages and pricing, and submits a booking inquiry.
                  </p>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative rounded-2xl border border-border-default bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start gap-4">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-background font-mono text-sm font-bold text-brand-blue-primary border border-brand-blue-soft">
                  02
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-text-primary">
                      Review &amp; Booking Confirmation
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-blue-primary bg-brand-blue-background px-2 py-0.5 rounded-md border border-brand-blue-soft hidden sm:inline-block">
                      Booking
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Studio reviews the booking request, checks the event date and required availability, and confirms the booking after advance payment verification.
                  </p>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative rounded-2xl border border-border-default bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start gap-4">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-mono text-sm font-bold text-emerald-700 border border-emerald-100">
                  03
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-text-primary">
                      Shoot, Production &amp; Delivery
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 hidden sm:inline-block">
                      Production
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    After the shoot, Focoman guides the order through photo selection, editing, customer review, and final album delivery until the order is completed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Studio Marketplace Showcase Section */}
        <section id="marketplace" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
          <div className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-gradient-to-br from-orange-50 via-amber-50/50 to-orange-100/40 p-8 sm:p-12 lg:p-14 text-center shadow-xs dark:from-orange-950/20 dark:via-amber-950/15 dark:to-orange-900/10 dark:border-orange-900/40">
            {/* Subtle background glow */}
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl pointer-events-none dark:bg-orange-600/10" />
            <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl pointer-events-none dark:bg-amber-600/10" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex items-center rounded-full bg-brand-orange-background px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange-primary border border-brand-orange-soft mb-4">
                STUDIO MARKETPLACE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary">
                Showcase Your Studio. Get Discovered.
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
                Showcase packages, pricing, and live date availability for booking inquiries, while your client records, orders, and studio financials remain completely private.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/studios"
                  className="w-full sm:w-auto rounded-xl bg-brand-orange-primary px-6 py-3 text-center text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-orange-600"
                >
                  Explore Studio Marketplace
                </Link>
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto rounded-xl border border-brand-orange-primary/30 bg-white px-6 py-3 text-center text-xs sm:text-sm font-bold text-brand-orange-primary shadow-xs transition hover:bg-orange-50"
                >
                  Publish Your Studio
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Pricing Section */}
        <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              SIMPLE, TRANSPARENT PRICING
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Choose the Plan That Fits Your Studio
            </h2>
            <p className="mx-auto mt-3 text-sm sm:text-base text-text-secondary">
              Start with the essentials and move to more advanced studio operations as your needs grow.
            </p>
          </div>

          <PricingTwoPanels />
        </section>

        {/* 8. Value-Added Services Section */}
        <ValueAddedServices />

        {/* 9. FAQ Section */}
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

        {/* 10. Final CTA Section */}
        <section id="cta" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
          {/* Main CTA: 30-Day Trial (Blue Palette) */}
          <div className="rounded-3xl border border-brand-blue-primary/30 bg-gradient-to-br from-brand-blue-primary via-sky-600 to-indigo-700 p-8 sm:p-14 text-center text-white shadow-md relative overflow-hidden">
            <FocomanShieldWatermark className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-20 -translate-y-20 opacity-10" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs mb-4">
                Ready to Focus Beyond the Frames?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Transform Your Studio Operations Today
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed">
                Join photography and cinematography studios running their orders, crew workflows, and deliveries with peace of mind. Start your 30-day full trial with zero risk.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-xs sm:text-sm font-bold text-brand-blue-primary shadow-sm transition hover:bg-slate-50"
                >
                  Start 30-Day Free Trial
                </Link>
              </div>
              <p className="mt-3 text-[11px] text-white/80">
                No credit card required
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer className="border-t border-border-divider bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
            <p>© {new Date().getFullYear()} Focoman. All rights reserved.</p>
            <p>Built for professional photography and cinematography studios.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
