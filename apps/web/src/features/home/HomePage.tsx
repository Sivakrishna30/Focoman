"use client";

import Link from "next/link";
import { FocomanShieldWatermark } from "@/components/FocomanLogo";
import { Navbar } from "@/components/Navbar";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { PricingTwoPanels } from "@/components/public/PricingTwoPanels";
import { useLanguage } from "@/context/LanguageContext";

export function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-surface-app text-text-primary selection:bg-brand-blue-soft">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border-divider bg-gradient-to-b from-white via-brand-blue-background/20 to-surface-app px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <FocomanShieldWatermark className="pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 opacity-25" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-brand-orange-soft bg-brand-orange-background px-5 py-2 text-sm font-extrabold uppercase tracking-widest text-brand-orange-primary shadow-xs">
            {t("hero.badge", "Focus beyond the frames")}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {t("hero.title_part1", "A Complete Business Operating System for")}{" "}
            <span className="bg-gradient-to-r from-brand-blue-primary via-brand-orange-primary to-brand-purple-primary bg-clip-text text-transparent">
              {t("hero.title_highlight", "Photography Studios")}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg lg:text-xl">
            {t("hero.description", "Bring your studio’s work, people, and orders together in one place and spend less time managing the work, more time creating.")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/sign-in"
              className="w-full sm:w-64 text-center rounded-xl bg-brand-blue-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600 flex items-center justify-center"
            >
              {t("hero.cta_get_started", "Get Started with Focoman")}
            </Link>
            <Link
              href="/demo-studio/dashboard"
              className="w-full sm:w-64 text-center rounded-xl bg-brand-orange-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              <span>{t("hero.cta_view_demo", "Explore Demo Workspace")}</span>
              <span className="text-white/80">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1: The Challenge We Solve */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-white to-brand-blue-background/30 p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
              {t("modules.title", "The Challenge We Solve")}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              {t("home.challenge_heading", "Eliminate Scattered WhatsApp Chats, Spreadsheets & Paper Notebooks")}
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {t("modules.subtitle", "Photography studio owners lose countless hours tracking shoots, chasing deliverables, updating spreadsheets, and managing payments. Focoman brings it all together, so you always know what’s happening, what’s pending, and what needs attention next.")}
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* OMS Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-[10px] font-bold text-brand-blue-primary uppercase tracking-wider">
                {t("home.core_ops_badge", "Core Operations")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">{t("module.oms.title", "Order Management System - OMS")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("module.oms.desc", "Track and manage confirmed orders and their status across every milestone, from RAW photo selection and editing through to final album delivery and client payments.")}
              </p>
            </div>

            {/* CRM Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-orange-background px-3 py-1 text-[10px] font-bold text-brand-orange-primary uppercase tracking-wider">
                {t("home.support_module_badge", "Support Module")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">{t("module.crm.title", "Customer Relations - CRM")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("module.crm.desc", "Centralize client directories with verified phone numbers, track lifetime value across multiple photoshoot bookings, monitor outstanding receivables, and launch new orders directly from existing customer profiles.")}
              </p>
            </div>

            {/* ERP Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-purple-background px-3 py-1 text-[10px] font-bold text-brand-purple-primary uppercase tracking-wider">
                {t("home.support_module_badge", "Support Module")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">{t("module.erp.title", "Studio Operations - ERP")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("module.erp.desc", "Assign shoot tasks, check crew calendar availability, track studio gear, and manage crew payroll and travel claims. Structured accounting and expense summaries keep your studio audit-ready, tracking true net profit and simplifying tax filing.")}
              </p>
            </div>

            {/* WhatsApp Operations & Bot */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-status-success uppercase tracking-wider">
                {t("home.whatsapp_badge", "WhatsApp & Bot")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">{t("module.integrations.title", "WhatsApp Operations & Bot")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("module.integrations.desc", "Automated WhatsApp alerts and mobile operations: send booking confirmations and gallery links to clients, shoot reminders and call-times to crew, and receive real-time order milestone updates.")}
              </p>
            </div>
            
            {/* Studio Marketplace Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                {t("home.discovery_badge", "Discovery & Search")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                {t("nav.marketplace", "Studio Marketplace")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("home.marketplace_desc", "Discover top photography and videography studios near you with verified operational performance metrics, on-time delivery track records, and authentic reviews and ratings. Studio owners maintain full control over their public visibility and profile details, while internal orders, financials, and CRM records remain strictly private.")}
              </p>
            </div>

            {/* Automations Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                {t("home.automations_badge", "Workflow Automation")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                {t("module.automations.title", "Automations & Smart Engine")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("module.automations.desc", "Eliminate repetitive manual busywork with smart automation that configures package deliverables, suggests crew assignments based on availability and workload, calculates payment breakdowns, and advances production pipelines automatically.")}
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-white px-6 py-3 text-sm font-bold text-text-primary shadow-xs transition hover:bg-surface-app hover:shadow-sm"
            >
              {t("nav.explore_modules", "Explore Detailed Module Breakdown →")}
            </Link>
          </div>
        </div>
      </section>

      {/* Section: Studio Setup & Add-ons (VAS) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
              {t("vas.badge", "Value-added services")}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              {t("vas.title", "Studio Setup & Creative Add-ons")}
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {t("vas.subtitle", "Optional creative design and onboarding assistance to help set up and elevate your studio operations with a minimal one-time charge.")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {/* 1. Branding & Website */}
            <div className="rounded-2xl border border-border-default bg-surface-app p-6 hover:border-brand-blue-primary/40 transition hover:shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="h-1.5 w-8 rounded-full bg-brand-blue-primary" />
                <span className="font-mono text-xs font-bold text-text-tertiary">01</span>
              </div>
              <h4 className="font-bold text-base text-text-primary">Branding &amp; Website</h4>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px]">✓</span>
                  <span>Logo creation</span>
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px]">✓</span>
                  <span>Website / portfolio creation</span>
                </li>
              </ul>
            </div>

            {/* 2. Data Migration */}
            <div className="rounded-2xl border border-border-default bg-surface-app p-6 hover:border-brand-orange-primary/40 transition hover:shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="h-1.5 w-8 rounded-full bg-brand-orange-primary" />
                <span className="font-mono text-xs font-bold text-text-tertiary">02</span>
              </div>
              <h4 className="font-bold text-base text-text-primary">Data Migration</h4>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px]">✓</span>
                  <span>Migrate existing studio data into Focoman</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Flexible Capability Pricing Highlight */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-border-divider mt-8">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
            {t("pricing.badge", "Flexible Studio Capabilities")}
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
            {t("pricing.title", "Build Your Plan Around Your Studio Needs")}
          </h2>
          <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            {t("pricing.subtitle", "Basic Order Management is 100% Free forever. Selectively add CRM, Crew, Marketplace, or WhatsApp capabilities as you grow.")}
          </p>
        </div>

        <PricingTwoPanels />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider mt-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
            {t("faq.badge", "Got Questions?")}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary">
            {t("faq.title", "Frequently Asked Questions")}
          </h2>
        </div>

        <FaqAccordion />
      </section>

      {/* Footer */}
      <footer className="border-t border-border-divider bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-xs text-text-tertiary">
              © 2026 Focoman. Focused Order Management System for Photography Studios.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                {t("nav.features", "Features")}
              </Link>
              <Link href="/pricing" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                {t("nav.pricing", "Pricing")}
              </Link>
              <Link href="/about" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                {t("nav.about", "About Us")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
