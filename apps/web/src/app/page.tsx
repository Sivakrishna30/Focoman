import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FocomanShieldWatermark } from "@/components/FocomanLogo";
import { ModuleAccordion } from "@/components/public/ModuleAccordion";
import { PricingTwoPanels } from "@/components/public/PricingTwoPanels";
import { ValueAddedServices } from "@/components/public/ValueAddedServices";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { StructuredData } from "@/components/public/StructuredData";
import { RetroHeroVisual } from "@/components/home/RetroHeroVisual";
import { getPlatformPublicStats } from "@focoman/db";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://focoman.web.app";

export const metadata: Metadata = {
  title: "Focoman",
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

export default async function HomePage() {
  const stats = await getPlatformPublicStats();

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
          className="relative h-[340vh] border-b border-[#D8D2C4] bg-[#FAF7F2]"
        >
          <div className="sticky top-0 flex h-screen min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] px-4 pt-0 sm:pt-2 lg:pt-2 sm:px-6 lg:px-8">
            <div className="relative z-10 mx-auto max-w-7xl w-full -mt-12 sm:-mt-16 lg:-mt-20">
              <div className="grid gap-8 lg:gap-8 lg:grid-cols-12 lg:items-center">
                {/* Left Column: Hero Copy & Actions */}
                <div className="lg:col-span-5 xl:col-span-5 text-center lg:text-left">
                  {/* Brand themed badge */}
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-brand-orange-background border border-brand-orange-soft">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-orange-primary">
                      [ Focus beyond the frames ]
                    </span>
                  </div>

                <h1 className="retro-serif-heading text-4xl sm:text-5xl md:text-5xl lg:text-[52px] xl:text-[58px] font-black leading-[1.08] tracking-tight text-text-primary">
                  Run your studio,{" "}
                  <span className="text-brand-orange-primary underline decoration-brand-orange-soft decoration-[6px] underline-offset-[10px]">
                    effortlessly.
                  </span>
                </h1>

                <p className="mx-auto lg:mx-0 mt-5 max-w-lg text-base sm:text-lg text-[#57534E] leading-relaxed font-normal">
                  Bring your studio’s work, people, and orders together in one place and spend less time managing the work, more time creating.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3.5">
                  <Link
                    href="/sign-in"
                    className="w-full sm:w-auto text-center rounded-xl bg-[#E85D04] px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-[0_3px_0_#B84600] active:translate-y-[2px] active:shadow-none transition hover:bg-[#D95304] flex items-center justify-center gap-2"
                  >
                    <span>Start 30-Day Free Trial</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="w-full sm:w-auto text-center rounded-xl border border-[#D8D2C4] bg-white px-6 py-3.5 text-sm sm:text-base font-bold text-[#1C1917] shadow-[0_2px_0_#C4BCAB] active:translate-y-[2px] active:shadow-none transition hover:bg-[#FAF7F2] flex items-center justify-center gap-2"
                  >
                    <span>▶ How It Works</span>
                    <span className="text-[#8C857B]">↓</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Symmetrical Unified Studio Visual */}
              <div className="lg:col-span-7 xl:col-span-7 flex items-center justify-center w-full">
                <RetroHeroVisual />
              </div>
            </div>
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
        <section id="studios" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider">
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

              {/* Metric Counts Panels (Above the buttons) */}
              <div className="mt-8 mb-8 grid grid-cols-2 gap-4 sm:gap-6 max-w-md sm:max-w-lg mx-auto">
                <div className="rounded-3xl border border-orange-200/90 bg-white/95 backdrop-blur-xs p-5 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary">
                    Total Studios Listed
                  </span>
                  <span className="mt-2 text-4xl sm:text-5xl font-black text-brand-orange-primary tracking-tight">
                    {stats.marketplaceStudiosCount}
                  </span>
                </div>
                <div className="rounded-3xl border border-orange-200/90 bg-white/95 backdrop-blur-xs p-5 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary">
                    Total Collective Leads
                  </span>
                  <span className="mt-2 text-4xl sm:text-5xl font-black text-amber-600 tracking-tight">
                    {stats.marketplaceLeadsCount}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/studios"
                  className="w-full sm:w-auto rounded-xl bg-brand-orange-primary px-7 py-3.5 text-center text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-orange-600"
                >
                  Explore Studio Marketplace
                </Link>
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto rounded-xl border border-brand-orange-primary/30 bg-white px-7 py-3.5 text-center text-xs sm:text-sm font-bold text-brand-orange-primary shadow-xs transition hover:bg-orange-50"
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
                Join photography studios running their orders, crew workflows, and deliveries with peace of mind. Start your 30-day full trial with zero risk.
              </p>

              {/* Metric Counts Panels (Above the buttons) */}
              <div className="mt-8 mb-8 grid grid-cols-2 gap-4 sm:gap-6 max-w-md sm:max-w-lg mx-auto">
                <div className="rounded-3xl border border-white/25 bg-white/15 backdrop-blur-md p-5 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">
                    Total Studios Active
                  </span>
                  <span className="mt-2 text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {stats.activeStudiosCount}
                  </span>
                </div>
                <div className="rounded-3xl border border-white/25 bg-white/15 backdrop-blur-md p-5 sm:p-6 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">
                    Total Orders Registered
                  </span>
                  <span className="mt-2 text-4xl sm:text-5xl font-black text-emerald-300 tracking-tight">
                    {stats.registeredOrdersCount}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-in"
                  className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-xs sm:text-sm font-bold text-brand-blue-primary shadow-sm transition hover:bg-slate-50"
                >
                  Start 30-Day Free Trial
                </Link>
              </div>

              <p className="mt-4 text-[11px] text-white/80">
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
            <p>Built for professional photography studios.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
