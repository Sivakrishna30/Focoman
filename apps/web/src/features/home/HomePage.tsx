"use client";

import Link from "next/link";
import { FocomanShieldWatermark } from "@/components/FocomanLogo";
import { Navbar } from "@/components/Navbar";
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
              <h3 className="mt-4 text-lg font-bold text-text-primary">{t("module.crm.title", "Customer Relationship Management - CRM")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("module.crm.desc", "Centralize client directories with verified phone numbers, track lifetime value across multiple photoshoot bookings, monitor outstanding receivables, and launch new orders directly from existing customer profiles.")}
              </p>
            </div>

            {/* ERP Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-brand-purple-background px-3 py-1 text-[10px] font-bold text-brand-purple-primary uppercase tracking-wider">
                {t("home.support_module_badge", "Support Module")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">{t("module.erp.title", "Studio Operations and Crew Management - ERP")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("module.erp.desc", "Assign shoot tasks, check crew calendar availability, track studio gear, and manage crew payroll and travel claims. Structured accounting and expense summaries keep your studio audit-ready, tracking true net profit and simplifying tax filing.")}
              </p>
            </div>

            {/* Google Workspace & Communication */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition">
              <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-status-success uppercase tracking-wider">
                {t("home.native_integrations_badge", "Native Integrations")}
              </span>
              <h3 className="mt-4 text-lg font-bold text-text-primary">{t("module.integrations.title", "Google Drive, Calendar & WhatsApp")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("module.integrations.desc", "Connect Google Drive for photo selection with in-app previews, Google Calendar for crew schedules, and WhatsApp for automated milestone notifications without switching external tabs.")}
              </p>
            </div>
            
            {/* Studio Marketplace Panel */}
            <div className="rounded-2xl border border-border-default bg-white p-6 hover:shadow-md transition lg:col-span-2">
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

      {/* Section: Professional Studio Add-ons (VAS) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
              {t("vas.badge", "Value Added Services")}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
              {t("vas.title", "Professional Studio Add-ons")}
            </h2>
            <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {t("vas.subtitle", "Optional technical and creative assistance services offered separately from core OMS operations.")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border-divider bg-surface-app p-6 hover:border-brand-blue-light transition hover:shadow-sm">
              <div className="h-1.5 w-8 rounded-full bg-brand-blue-primary mb-3" />
              <h4 className="font-bold text-sm text-text-primary">{t("vas.web_create_title", "Website Creation")}</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                {t("vas.web_create_desc", "Custom portfolio and showcase website for your studio brand.")}
              </p>
            </div>
            
            <div className="rounded-2xl border border-border-divider bg-surface-app p-6 hover:border-brand-orange-light transition hover:shadow-sm">
              <div className="h-1.5 w-8 rounded-full bg-brand-orange-primary mb-3" />
              <h4 className="font-bold text-sm text-text-primary">{t("vas.web_int_title", "Website Integration")}</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                {t("vas.web_int_desc", "API integration bridging your existing external website directly into Focoman.")}
              </p>
            </div>

            <div className="rounded-2xl border border-border-divider bg-surface-app p-6 hover:border-brand-purple-light transition hover:shadow-sm">
              <div className="h-1.5 w-8 rounded-full bg-brand-purple-primary mb-3" />
              <h4 className="font-bold text-sm text-text-primary">{t("vas.brand_title", "Branding & Identity")}</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                {t("vas.brand_desc", "Studio logo design, invoice headers, and branded presentation assets.")}
              </p>
            </div>

            <div className="rounded-2xl border border-border-divider bg-surface-app p-6 hover:border-green-200 transition hover:shadow-sm">
              <div className="h-1.5 w-8 rounded-full bg-green-500 mb-3" />
              <h4 className="font-bold text-sm text-text-primary">{t("vas.data_mig_title", "Data Migration")}</h4>
              <p className="mt-1.5 text-xs text-text-secondary">
                {t("vas.data_mig_desc", "Import past customer contacts and order histories from spreadsheets.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Simple Pricing Highlight */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-border-divider mt-8">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
            {t("pricing.badge", "Clear & Simple Pricing")}
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
            {t("pricing.title", "Choose the Right Plan for Your Studio")}
          </h2>
          <p className="mx-auto mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            {t("pricing.subtitle", "Every plan includes our core Order Management System. Upgrade as your team grows.")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Starter Plan */}
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition flex flex-col justify-between">
            <div>
              <span className="inline-block self-start rounded-full bg-brand-blue-background px-3 py-1 text-[10px] font-bold text-brand-blue-primary uppercase tracking-wider mb-3">
                {t("pricing.plan_starter", "Starter")}
              </span>
              <h3 className="text-xl font-extrabold text-text-primary">₹499<span className="text-xs font-normal text-text-secondary">/mo</span></h3>
              <p className="mt-2 text-xs text-text-secondary">{t("pricing.plan_starter_desc", "For solo photographers just getting started with order management.")}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-divider">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                {t("home.pricing_oms_included", "Order Management System (OMS) Included")}
              </span>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="rounded-3xl border border-border-default hover:border-brand-orange-light bg-white p-6 shadow-sm flex flex-col justify-between relative transition">
            <span className="absolute -top-3 right-6 rounded-full bg-brand-orange-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              {t("pricing.plan_pro", "Professional")}
            </span>
            <div>
              <span className="inline-block self-start rounded-full bg-brand-orange-background px-3 py-1 text-[10px] font-bold text-brand-orange-primary uppercase tracking-wider mb-3 mt-1">
                {t("pricing.plan_pro", "Professional")}
              </span>
              <h3 className="text-xl font-extrabold text-text-primary">₹999<span className="text-xs font-normal text-text-secondary">/mo</span></h3>
              <p className="mt-2 text-xs text-text-secondary">{t("pricing.plan_pro_desc", "For growing studios managing a team with CRM & ERP modules.")}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-divider">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-primary" />
                CRM & ERP Included
              </span>
            </div>
          </div>

          {/* Complete Plan */}
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-purple-light transition flex flex-col justify-between">
            <div>
              <span className="inline-block self-start rounded-full bg-brand-purple-background px-3 py-1 text-[10px] font-bold text-brand-purple-primary uppercase tracking-wider mb-3">
                {t("pricing.plan_complete", "Complete")}
              </span>
              <h3 className="text-xl font-extrabold text-text-primary">₹1999<span className="text-xs font-normal text-text-secondary">/mo</span></h3>
              <p className="mt-2 text-xs text-text-secondary">{t("pricing.plan_complete_desc", "Full-stack operations with WhatsApp notifications and multi-studio support.")}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border-divider">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                {t("module.integrations.title", "Google Drive, Calendar & WhatsApp")}
              </span>
            </div>
          </div>
        </div>

        {/* Common View Details Button for All Models */}
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue-primary px-8 py-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-sky-600"
          >
            <span>{t("pricing.btn_compare", "View Details & Compare Plans")}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider mt-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
            {t("faq.badge", "Got Questions?")}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary">
            {t("faq.title", "Frequently Asked Questions")}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition">
            <h3 className="text-base font-bold text-text-primary">What exactly is Focoman?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Focoman is a comprehensive business operating system designed specifically for photography and videography studios. It combines order management, customer relationship history, and crew operations into one unified, easy-to-use platform.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-orange-light transition">
            <h3 className="text-base font-bold text-text-primary">Do I have to use every feature?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              No. You only pay for what you actually need. You can start with our Starter plan to handle core order tracking. When your business is ready for client relationship history, crew scheduling, team payouts, or WhatsApp alerts, you can upgrade to our Professional or Complete paid plans anytime.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-purple-light transition">
            <h3 className="text-base font-bold text-text-primary">Do my customers need to download an app or log in?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              No. Focoman provides guest order tracking through a secure, passkey-protected link. Your clients can view their shoot status, payment details, and final deliverables instantly from any browser without creating an account.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-green-300 transition">
            <h3 className="text-base font-bold text-text-primary">How does crew management and task assignment work?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              You can invite your photographers, videographers, and editors to your studio workspace. They sign in using their own Google account and only see the specific production tasks and shoots assigned to them, keeping your overall business data and CRM completely private.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-pink-300 transition">
            <h3 className="text-base font-bold text-text-primary">What is the Studio Marketplace?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Studio Marketplace allows clients to discover verified photography and videography studios in their area based on authentic performance metrics, on-time delivery track records, and client reviews. Studio owners can toggle their public visibility on or off at any time and customize what information to show, ensuring internal business operations and customer records remain completely confidential.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-blue-light transition">
            <h3 className="text-base font-bold text-text-primary">Can I manage multiple studios with one account?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Yes! Focoman uses a single personal identity system. You can own multiple studios or be a crew member in other studios, and switch between all your workspaces seamlessly from a single dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-orange-light transition">
            <h3 className="text-base font-bold text-text-primary">How do the WhatsApp notifications work?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Our Complete plan integrates direct WhatsApp alerts. Customers receive automated updates when their project moves to a new stage, such as editing commencement or deliverables ready, and crew members get instant notifications for new task assignments.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-emerald-300 transition">
            <h3 className="text-base font-bold text-text-primary">Can we preview Google Drive photos and Google Calendar without leaving Focoman?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Yes. Google Drive and Google Calendar are natively integrated directly into your Order Management and Crew Operations. You and your clients can view RAW photo previews, album deliverables, and crew shoot schedules right inside Focoman without opening or switching to external browser tabs.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-brand-purple-light transition">
            <h3 className="text-base font-bold text-text-primary">Is my studio data secure in the cloud?</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Absolutely. We use enterprise-grade Google Cloud Infrastructure with end-to-end encryption. Your client lists, financial data, and internal crew communications are strictly isolated and never shared.
            </p>
          </div>
        </div>
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
