"use client";

import Link from "next/link";
import { FREE_CORE_CAPABILITY } from "@focoman/config";

interface PricingTwoPanelsProps {
  hasMultiStudios?: boolean;
}

export function PricingTwoPanels({ hasMultiStudios = false }: PricingTwoPanelsProps) {
  return (
    <div className="space-y-12">
      {/* Multi-Studio Workspace Notice (Only shown if user has multiple studio profiles) */}
      {hasMultiStudios && (
        <div className="rounded-2xl border border-brand-blue-primary/30 bg-brand-blue-background/30 p-4 text-center max-w-2xl mx-auto shadow-xs">
          <h4 className="text-xs font-extrabold text-brand-blue-primary uppercase tracking-wider">
            Studio-Scoped Workspace Pricing
          </h4>
          <p className="mt-1 text-xs text-text-secondary">
            Capabilities belong to each individual studio workspace. Configure different capabilities per studio profile.
          </p>
        </div>
      )}

      {/* 2 Similarly Designed Side-by-Side Panels */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* PANEL 1: FREE */}
        <div className="relative overflow-hidden rounded-3xl border border-border-default bg-white p-6 sm:p-8 shadow-sm hover:border-brand-blue-primary/40 transition-all duration-200 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header / Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 shadow-xs">
                FREE
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                Basic Order management
              </h2>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                Essential Order Management System for photography and videography studios.
              </p>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-border-divider bg-surface-app p-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-text-tertiary block">Free Tier Price</span>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">₹0</span>
                  <span className="text-xs text-text-secondary font-medium">/forever</span>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                Included Features:
              </span>
              <div className="space-y-2.5 text-xs text-text-secondary">
                {FREE_CORE_CAPABILITY.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-extrabold text-emerald-700 mt-0.5">
                      ✓
                    </span>
                    <span className="text-text-primary font-medium leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-border-divider">
            <Link
              href="/sign-in"
              className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* PANEL 2: PROFESSIONAL */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-orange-primary/30 bg-gradient-to-br from-white via-orange-50/20 to-white p-6 sm:p-8 shadow-sm hover:border-brand-orange-primary/60 transition-all duration-200 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header / Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-block rounded-full bg-brand-orange-primary px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                PROFESSIONAL
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                Build your own plan using our flexible model
              </h2>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                Selectively add CRM, Crew Management, Studio Marketplace, OMS Advanced (Drive In-App Preview &amp; Photo Selection), or WhatsApp Operations to your workspace.
              </p>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-brand-orange-primary/20 bg-brand-orange-background/30 p-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-text-tertiary block">Modular Pricing Starting From</span>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">₹199</span>
                  <span className="text-xs text-text-secondary font-medium">/month</span>
                </div>
              </div>
            </div>

            {/* Feature Overview (Display Only) */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                Available Add-On Capabilities:
              </span>
              <div className="space-y-2.5 text-xs text-text-secondary">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-extrabold text-brand-orange-primary mt-0.5">
                    ✓
                  </span>
                  <div>
                    <span className="text-text-primary font-bold">Customer Management</span>
                    <span className="text-text-tertiary ml-1.5">(Basic ₹199/mo · Advanced ₹299/mo)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-extrabold text-brand-orange-primary mt-0.5">
                    ✓
                  </span>
                  <div>
                    <span className="text-text-primary font-bold">Crew Management &amp; Conflict Detection</span>
                    <span className="text-text-tertiary ml-1.5">(Basic ₹199/mo · Advanced ₹299/mo)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-extrabold text-brand-orange-primary mt-0.5">
                    ✓
                  </span>
                  <div>
                    <span className="text-text-primary font-bold">Studio Discovery Marketplace</span>
                    <span className="text-text-tertiary ml-1.5">(₹499/mo)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-extrabold text-brand-orange-primary mt-0.5">
                    ✓
                  </span>
                  <div>
                    <span className="text-text-primary font-bold">OMS Advanced: Drive Preview &amp; Photo Selection</span>
                    <span className="text-text-tertiary ml-1.5">(₹299/mo)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-extrabold text-brand-orange-primary mt-0.5">
                    ✓
                  </span>
                  <div>
                    <span className="text-text-primary font-bold">WhatsApp Lifecycle Alerts &amp; Owner Bot</span>
                    <span className="text-text-tertiary ml-1.5">(Notifications ₹199/mo · Operations ₹499/mo)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button to Checkout Page */}
          <div className="mt-8 pt-6 border-t border-border-divider">
            <Link
              href="/pricing/checkout"
              className="w-full rounded-xl bg-brand-orange-primary px-6 py-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              <span>Check Details &amp; Build Plan</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
