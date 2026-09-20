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
      "No Studio Marketplace profile or booking inquiries",
      "No WhatsApp alerts or notifications",
      "No Google Calendar or Drive sync",
      "Single studio workspace (Multi-studio requires Complete)",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹499",
    cadence: "per month",
    positioning: "Run Your Studio",
    valueProp: "For boutique studios managing customer history, team profiles, manual crew allocation, and order workflow WhatsApp notifications.",
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
        group: "WhatsApp Notifications",
        items: [
          "Automated notifications on order workflow pipeline status updates",
          "Booking confirmations, advance payment receipts & balance due alerts",
          "Photo selection gallery ready & final delivery notifications",
        ],
      },
    ],
    limitations: [
      "No Studio Marketplace publishing or in-app booking inquiry intake",
      "No crew calendar scheduling or double-booking conflict checks",
      "No automated event shoot reminders (Available in Professional)",
      "No interactive WhatsApp Operations Bot (Exclusive to Complete)",
      "No Google Calendar or Drive sync",
      "Single studio workspace (Multi-studio requires Complete)",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹999",
    cadence: "per month",
    positioning: "Get Discovered & Operate Your Business",
    valueProp: "Full studio operations with public Studio Marketplace publishing, incoming booking inquiries, crew availability planning, and automated event reminders.",
    badgeColor: "bg-brand-orange-background text-brand-orange-primary border-brand-orange-soft",
    ctaText: "Choose Professional",
    ctaHref: "/sign-in",
    featuresIncluded: [
      {
        group: "Everything in Starter, plus:",
        items: [
          "All Free and Starter OMS, CRM, ERP, and WhatsApp notification capabilities",
        ],
      },
      {
        group: "Studio Marketplace & Booking Inquiries",
        items: [
          "Enable & publish live Studio Marketplace profile at /studio/[slug]",
          "Showcase service packages, pricing & negotiable toggle",
          "Receive direct incoming booking inquiries from public visitors",
          "In-app inquiry negotiation & agreed final amount log",
          "Advance payment verification & booking confirmation transition",
          "Verified operational metrics badge (on-time delivery % & completed orders)",
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
        group: "WhatsApp Notifications & Event Reminders",
        items: [
          "All Starter order workflow pipeline status notifications included",
          "Automated upcoming event shoot & schedule reminders",
          "New incoming booking inquiry alerts & milestone progress notices",
        ],
      },
      {
        group: "Native Cloud Integrations & Analytics",
        items: [
          "Google Calendar two-way synchronization for shoot dates",
          "Google Drive embedded folder and photo preview attachment",
          "Order volume, revenue, workflow pipeline & crew workload reports",
        ],
      },
    ],
    limitations: [
      "No Smart Resource Automation (AI/Intelligent crew assignment by workload/skills)",
      "No two-way interactive WhatsApp Operations Bot (Exclusive to Complete)",
      "Single studio workspace (Multi-studio requires Complete)",
    ],
  },
  {
    id: "complete",
    name: "Complete",
    price: "₹1,999",
    cadence: "per month",
    positioning: "Automate & Scale",
    valueProp: "The ultimate operating system with Smart Resource Automation, interactive WhatsApp Operations Bot, and exclusive multi-studio workspace management.",
    badgeColor: "bg-brand-purple-background text-brand-purple-primary border-brand-purple-light/50",
    ctaText: "Start 30-Day Complete Trial",
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
        group: "WhatsApp Operations & Interactive Bot",
        items: [
          "All Starter & Professional notifications and event reminders included",
          "Two-way interactive WhatsApp Operations Bot for checking orders, upcoming shoots, and quick status updates",
          "Interactive event schedule confirmations & task acknowledgments via WhatsApp bot",
        ],
      },
      {
        group: "Exclusive Multi-Studio Architecture",
        items: [
          "Multi-studio workspace management under a single identity (Exclusive to Complete)",
          "Multi-studio consolidated analytics, workload, & revenue reporting",
          "Priority operational support & dedicated onboarding",
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
