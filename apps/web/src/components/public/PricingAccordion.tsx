"use client";

import { useState } from "react";
import Link from "next/link";

interface PlanItem {
  id: string;
  name: string;
  price: string;
  cadence: string;
  positioning: string;
  valueProp: string;
  badgeColor: string;
  featuresIncluded: { group: string; items: string[] }[];
  limitations?: string[];
  ctaText: string;
  ctaHref: string;
  primaryCta?: boolean;
}

const PLANS: PlanItem[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    cadence: "forever",
    positioning: "Manage Your Orders",
    valueProp: "Essential Order Management System for solo photographers managing their confirmed shoots.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    ctaText: "Get Started Free",
    ctaHref: "/sign-in",
    featuresIncluded: [
      {
        group: "Core Order Management (OMS)",
        items: [
          "Unlimited confirmed orders & shoot events",
          "Create, view, edit, cancel & soft-delete orders",
          "14-day soft delete recovery window",
          "Shoot event details, venue location & date tracking",
          "Dynamic service workflows (Photo, Video, Album)",
          "Production task status tracking (RAW to Print)",
          "Advance payment, balance & payment method tracking",
          "Guest order passkey tracking (zero client login)",
          "Basic operational dashboard",
          "Basic customer contact details attached to orders (Name, Phone, Email)",
        ],
      },
    ],
    limitations: [
      "No standalone customer CRM directory",
      "No crew or team member management",
      "No crew assignment or scheduling",
      "No public marketplace storefront",
      "No WhatsApp alerts or bot",
      "No Google Calendar or Drive sync",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹499",
    cadence: "per month",
    positioning: "Run Your Studio",
    valueProp: "For boutique studios ready for customer history, team profiles, manual crew allocation, and inquiry booking.",
    badgeColor: "bg-brand-blue-background text-brand-blue-primary border-brand-blue-light/50",
    ctaText: "Choose Starter",
    ctaHref: "/sign-in",
    featuresIncluded: [
      {
        group: "Everything in Free, plus:",
        items: ["Unlimited confirmed orders & events", "Complete OMS with 14-day recovery"],
      },
      {
        group: "CRM Basic",
        items: [
          "Centralized customer directory & customer profiles",
          "Customer lifetime confirmed order history",
          "Customer payment & receivables history",
          "Booking inquiry and request log",
        ],
      },
      {
        group: "ERP Basic (Team & Crew)",
        items: [
          "Team member profiles, contact info & certified skills",
          "Role definitions (Photographer, Videographer, Editor)",
          "Manual shoot task assignment to team members",
        ],
      },
      {
        group: "Booking & Inquiries",
        items: [
          "In-app booking requests & lead intake",
          "Optional negotiation with agreed final amount",
          "Advance payment requests & offline payment support (Cash, UPI, Bank Transfer)",
          "Payment proof attachment & owner verification workflow",
          "Formal booking confirmation transition",
        ],
      },
      {
        group: "Marketplace Configuration",
        items: [
          "Configure studio profile, bio, city & specialized tags",
          "Create and manage studio service packages & pricing",
          "Toggle negotiable status per package",
          "Note: Public directory publishing is NOT included in Starter",
        ],
      },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹999",
    cadence: "per month",
    positioning: "Get Discovered & Operate Your Business",
    valueProp: "Full studio management with public marketplace publishing, crew availability planning, and Google integrations.",
    badgeColor: "bg-brand-orange-background text-brand-orange-primary border-brand-orange-soft",
    ctaText: "Choose Professional",
    ctaHref: "/sign-in",
    featuresIncluded: [
      {
        group: "Everything in Starter, plus:",
        items: [
          "All Free and Starter OMS, CRM, ERP, and Booking capabilities",
        ],
      },
      {
        group: "Public Marketplace Publishing",
        items: [
          "Publish live studio storefront at /studio/[slug]",
          "Verified operational metrics badge (on-time delivery % & completed orders)",
          "Receive incoming booking inquiries directly from public visitors",
        ],
      },
      {
        group: "Advanced ERP & Resource Planning",
        items: [
          "Crew calendar availability & visual scheduling",
          "Workload balance tracking across team members",
          "Double-booking conflict detection before assignment",
          "Skill-matching verification for assigned shoot roles",
          "Pre-flight conflict check report on booking confirmation",
        ],
      },
      {
        group: "Native Cloud Integrations",
        items: [
          "Google Calendar two-way synchronization for shoot dates",
          "Google Drive embedded folder and photo preview attachment",
        ],
      },
      {
        group: "Analytics & Automation",
        items: [
          "Advanced operational automation & recommended next actions",
          "Order volume, revenue, workflow pipeline & crew workload reports",
        ],
      },
    ],
  },
  {
    id: "complete",
    name: "Complete",
    price: "₹1,999",
    cadence: "per month",
    positioning: "Automate & Scale",
    valueProp: "The ultimate operating system with Smart Resource Automation, WhatsApp notifications & Operations Bot, and multi-studio support.",
    badgeColor: "bg-brand-purple-background text-brand-purple-primary border-brand-purple-light/50",
    ctaText: "Start 14-Day Complete Trial",
    ctaHref: "/sign-in",
    primaryCta: true,
    featuresIncluded: [
      {
        group: "Everything in Professional, plus:",
        items: [
          "All Free, Starter, and Professional capabilities included",
        ],
      },
      {
        group: "Smart Resource Automation",
        items: [
          "Intelligent crew assignment suggestions based on date, venue location, role requirements, certified skills, availability, and active workload",
          "Strict governance: System Suggests → Owner Reviews → Owner Confirms (no autonomous allocation)",
        ],
      },
      {
        group: "WhatsApp Communication & Operations Bot",
        items: [
          "Automated milestone WhatsApp alerts to clients & crew",
          "Upcoming shoot schedule & call-time reminders",
          "Payment receipts & balance due notifications",
          "WhatsApp Operations Bot for checking orders, upcoming shoots, and quick owner status updates",
        ],
      },
      {
        group: "Scale & Multi-Studio Architecture",
        items: [
          "Multi-studio workspace management under a single identity",
          "Multi-studio consolidated analytics & reporting",
          "Priority operational support",
        ],
      },
    ],
  },
];

export function PricingAccordion() {
  const [expandedId, setExpandedId] = useState<string>("");

  const togglePlan = (id: string) => {
    setExpandedId((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="space-y-6">
      {/* Trial & Axiom Notification Banner */}
      <div className="rounded-2xl border border-brand-blue-light bg-brand-blue-background/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue-primary text-white text-base font-bold">
            ★
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-text-primary">
              14-Day Full-Feature Trial Included
            </h3>
            <p className="text-[11px] sm:text-xs text-text-secondary">
              Experience the full Complete plan for 14 days. If you do not choose a paid plan, your account automatically falls back to Free. All your orders, photos, and studio data are 100% safely preserved.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-center sm:text-right">
          <span className="inline-block rounded-full bg-white border border-brand-blue-light/80 px-3 py-1 text-[11px] font-extrabold text-brand-blue-primary shadow-2xs">
            Unlimited Events &amp; Orders on Every Plan
          </span>
        </div>
      </div>

      {/* 4 Plan Accordion Panels */}
      <div className="grid gap-4 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isExpanded = expandedId === plan.id;
          const panelId = `pricing-panel-${plan.id}`;
          const buttonId = `pricing-button-${plan.id}`;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border transition-all duration-200 bg-white flex flex-col justify-between ${
                isExpanded
                  ? "border-brand-blue-primary shadow-md ring-1 ring-brand-blue-primary/10"
                  : "border-border-default shadow-xs hover:border-slate-300"
              }`}
            >
              {/* Header / Summary Card */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${plan.badgeColor}`}
                    >
                      {plan.name}
                    </span>
                    <span className="text-[11px] font-semibold text-text-tertiary">
                      {plan.cadence}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-text-primary">
                      {plan.price}
                    </span>
                    {plan.price !== "₹0" && (
                      <span className="text-xs text-text-secondary">/mo</span>
                    )}
                  </div>

                  <p className="mt-2 text-xs font-bold text-brand-blue-primary">
                    {plan.positioning}
                  </p>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    {plan.valueProp}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border-divider flex flex-col gap-2.5">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full text-center rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-xs flex items-center justify-center ${
                      plan.primaryCta
                        ? "bg-brand-blue-primary text-white hover:bg-sky-600"
                        : "bg-slate-100 text-text-primary hover:bg-slate-200"
                    }`}
                  >
                    {plan.ctaText}
                  </Link>

                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => togglePlan(plan.id)}
                    className="w-full text-center py-1.5 text-[11px] font-semibold text-text-secondary hover:text-text-primary flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
                  >
                    <span>{isExpanded ? "Hide Feature Breakdown" : "View Included Capabilities"}</span>
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expandable Feature Group List */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`border-t border-border-divider transition-all duration-200 ${
                  isExpanded ? "block p-5 bg-slate-50/70" : "hidden"
                }`}
              >
                <div className="space-y-4">
                  {plan.featuresIncluded.map((fg, gIdx) => (
                    <div key={gIdx}>
                      <h4 className="text-[10px] font-bold text-text-primary uppercase tracking-wider mb-2">
                        {fg.group}
                      </h4>
                      <ul className="space-y-1.5">
                        {fg.items.map((feat, fIdx) => (
                          <li
                            key={fIdx}
                            className="text-[11px] text-text-secondary flex items-start gap-1.5 leading-snug"
                          >
                            <span className="text-status-success font-bold shrink-0">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="pt-2 border-t border-border-divider/60">
                      <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5">
                        Not Included in {plan.name}
                      </h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((lim, lIdx) => (
                          <li
                            key={lIdx}
                            className="text-[10px] text-text-tertiary flex items-start gap-1.5"
                          >
                            <span className="text-slate-400 font-bold shrink-0">✕</span>
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
