"use client";

import { useState } from "react";

interface ModuleData {
  number: string;
  name: string;
  shortDesc: string;
  keyValue: string;
  tag: string;
  tagColor: string;
  cards: { title: string; desc: string }[];
  integrations?: string[];
}

const MODULES: ModuleData[] = [
  {
    number: "01",
    name: "OMS — Order Management System",
    shortDesc: "The core engine powering your confirmed orders, shoot milestones, and post-event deliverables.",
    keyValue: "Mandatory Core • Unlimited Orders & Events included in all plans",
    tag: "Core Engine",
    tagColor: "bg-brand-blue-background text-brand-blue-primary border-brand-blue-light/50",
    cards: [
      {
        title: "Confirmed Order Intake",
        desc: "Register confirmed client orders with comprehensive event information, venue locations, packages, and agreed pricing.",
      },
      {
        title: "Dynamic Service Workflows",
        desc: "Auto-generate operational workflows tailored to photography, cinematography, and album design service requirements.",
      },
      {
        title: "Milestone & Status Tracking",
        desc: "Track every production phase: RAW backup, photo culling, color grading, video editing, album printing, and final delivery.",
      },
      {
        title: "Payment & Advance Tracking",
        desc: "Log advance payments, record payment methods (UPI, cash, bank transfer), monitor balances, and verify receipts.",
      },
      {
        title: "Soft Delete & 14-Day Recovery",
        desc: "Safe order lifecycle management. Cancelled orders remain distinct from soft-deleted orders with a safe 14-day recovery window.",
      },
      {
        title: "Guest Order Passkey Tracking",
        desc: "Zero-login client access. Clients view real-time shoot status and delivery links via a secure private passkey.",
      },
    ],
  },
  {
    number: "02",
    name: "CRM — Customer Relationship Management",
    shortDesc: "Centralize customer profiles, order history, and booking records across shoots.",
    keyValue: "Optional Support Module • Begins at Starter (₹499/mo)",
    tag: "Support Module",
    tagColor: "bg-brand-orange-background text-brand-orange-primary border-brand-orange-soft",
    cards: [
      {
        title: "Customer Directory & Profiles",
        desc: "Centralized client directory with verified phone numbers, email addresses, and postal addresses.",
      },
      {
        title: "Confirmed Order History",
        desc: "Instant visibility into all past and active photoshoot orders for every customer across years of service.",
      },
      {
        title: "Payment & Receivables History",
        desc: "Track cumulative customer spend, historical receipts, advance deposits, and outstanding receivables.",
      },
      {
        title: "Booking & Inquiry Records",
        desc: "Review past booking inquiries and requests directly attached to customer profile records.",
      },
    ],
  },
  {
    number: "03",
    name: "ERP — Studio Operations & Resource Planning",
    shortDesc: "Organize crew members, verify availability, plan schedules, and match skills to event dates.",
    keyValue: "Basic in Starter • Advanced & Integrations in Professional • Smart Automation in Complete",
    tag: "Operations & People",
    tagColor: "bg-brand-purple-background text-brand-purple-primary border-brand-purple-light/50",
    cards: [
      {
        title: "Crew Profiles & Certified Skills",
        desc: "Manage photographers, cinematographers, drone pilots, and editors with tagged technical proficiencies (Starter+).",
      },
      {
        title: "Manual & Planned Assignment",
        desc: "Assign crew members to upcoming shoots and track their confirmation before shoot day (Starter+).",
      },
      {
        title: "Availability & Workload Calendars",
        desc: "Visual schedule planning to detect double-bookings, crew availability conflicts, and workload balance (Professional+).",
      },
      {
        title: "Conflict Detection & Skill Matching",
        desc: "Automatic warnings when assigning busy crew or members whose skills don't match the required shoot services (Professional+).",
      },
      {
        title: "Smart Resource Suggestions",
        desc: "System evaluates date, venue location, required roles, availability, and workload to recommend optimal crew matches. Owner reviews and confirms (Complete).",
      },
    ],
    integrations: [
      "Google Calendar: Direct synchronization of crew shoot schedules",
      "Google Drive: In-app preview of RAW photo folders and client deliverables",
    ],
  },
  {
    number: "04",
    name: "WhatsApp — Premium Operational Communication",
    shortDesc: "Real-time WhatsApp notifications, status alerts, and operational reminders for studio owners and clients.",
    keyValue: "Included in Complete (₹1,999/mo) • Purpose-built operational bot",
    tag: "Communication & Bot",
    tagColor: "bg-green-50 text-status-success border-green-200",
    cards: [
      {
        title: "Automated Milestone Alerts",
        desc: "Notify clients instantly when RAW photos are uploaded, selection galleries are ready, or deliverables are dispatched.",
      },
      {
        title: "Upcoming Order & Shoot Alerts",
        desc: "Send shoot schedule reminders to crew members and clients with venue location and call times.",
      },
      {
        title: "Payment & Due Reminders",
        desc: "Timely, professional balance reminders with payment verification receipts sent straight to WhatsApp.",
      },
      {
        title: "WhatsApp Operations Bot",
        desc: "Direct operational assistant for checking order status, reviewing pending/upcoming shoots, receiving reminders, and executing owner actions.",
      },
    ],
  },
  {
    number: "05",
    name: "Marketplace — Studio Storefront & Inquiries",
    shortDesc: "Independent public studio profile allowing customers to discover your studio, view packages, and submit booking inquiries.",
    keyValue: "Configure in Starter • Public Publishing in Professional (₹999/mo) • Not a price comparison engine",
    tag: "Discovery & Storefront",
    tagColor: "bg-pink-50 text-pink-700 border-pink-200",
    cards: [
      {
        title: "Independent Studio Storefront",
        desc: "Your studio owns its unique URL (/studio/[slug]). Showcase your bio, city, services, and verified operational delivery metrics.",
      },
      {
        title: "Configurable Service Packages",
        desc: "Publish your customized package options, transparent pricing, deliverables specifications, and negotiable status.",
      },
      {
        title: "Direct Booking Inquiries",
        desc: "Prospective clients submit booking requests directly to your studio with event dates, locations, and service requirements.",
      },
      {
        title: "Optional In-App Negotiation",
        desc: "When enabled on a package, discuss and record an agreed final amount before issuing the advance payment request.",
      },
      {
        title: "Privacy Protected Operations",
        desc: "Public visitors see only your approved public showcase. Internal customer CRM, finances, orders, and crew tasks are strictly private.",
      },
    ],
  },
  {
    number: "06",
    name: "Automation — Intelligent Operational Guidance",
    shortDesc: "Proactive suggestions and workflow automation built on the core principle: System Suggests → Owner Reviews → Owner Confirms.",
    keyValue: "Basic in Starter • Advanced in Professional • Smart Resource Automation in Complete",
    tag: "Workflow Automation",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    cards: [
      {
        title: "System Suggests → Owner Confirms",
        desc: "Zero autonomous surprises. The system analyzes operational state and proposes actions; the studio owner always has final approval.",
      },
      {
        title: "Event & Status Pipeline Automation",
        desc: "Automatic progression reminders when shoot dates pass, guiding your team to initiate RAW backups and culling tasks.",
      },
      {
        title: "Payment Advance & Balance Automation",
        desc: "Automatic invoice balance calculation, advance payment verification state transitions, and delivery clearance locks.",
      },
      {
        title: "Pre-Flight & Conflict Checks",
        desc: "Automatic evaluation of date overlaps, member availability, and skill alignment prior to booking confirmation.",
      },
    ],
  },
];

export function ModuleAccordion() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleModule = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4">
      {MODULES.map((mod, idx) => {
        const isExpanded = expandedIndex === idx;
        const panelId = `module-panel-${mod.number}`;
        const headerId = `module-header-${mod.number}`;

        return (
          <div
            key={mod.number}
            className={`rounded-2xl border transition-all duration-200 bg-white ${
              isExpanded
                ? "border-brand-blue-primary/40 shadow-md ring-1 ring-brand-blue-primary/10"
                : "border-border-default shadow-xs hover:border-border-default/80"
            }`}
          >
            {/* Parent Panel Header / Toggle */}
            <button
              id={headerId}
              type="button"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => toggleModule(idx)}
              className="w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-primary rounded-2xl cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-bold text-text-secondary">
                  {mod.number}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-text-primary truncate">
                      {mod.name}
                    </h3>
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${mod.tagColor}`}
                    >
                      {mod.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary line-clamp-1 sm:line-clamp-none">
                    {mod.shortDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border-divider/50">
                <span className="text-[11px] font-medium text-text-tertiary hidden md:inline">
                  {mod.keyValue}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue-primary bg-brand-blue-background px-3 py-1.5 rounded-lg">
                  {isExpanded ? "Collapse" : "Explore Details"}
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </button>

            {/* Expandable Content (Crawlable in DOM) */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={`border-t border-border-divider transition-all duration-200 ${
                isExpanded ? "block p-5 sm:p-6 bg-slate-50/50" : "hidden"
              }`}
            >
              <div className="mb-4">
                <p className="text-xs font-semibold text-text-secondary">{mod.keyValue}</p>
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mod.cards.map((card, cIdx) => (
                  <div
                    key={cIdx}
                    className="rounded-xl border border-border-default bg-white p-4 shadow-xs"
                  >
                    <h4 className="text-xs font-bold text-text-primary">{card.title}</h4>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">{card.desc}</p>
                  </div>
                ))}
              </div>

              {mod.integrations && mod.integrations.length > 0 && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50/40 p-4">
                  <h4 className="text-xs font-bold text-status-success uppercase tracking-wider mb-2">
                    Native Studio Integrations
                  </h4>
                  <ul className="space-y-1">
                    {mod.integrations.map((item, iIdx) => (
                      <li key={iIdx} className="text-xs text-text-secondary flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
