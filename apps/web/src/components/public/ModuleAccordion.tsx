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
    name: "Order Management System - OMS",
    shortDesc: "Track and manage confirmed orders and their status across every milestone, from RAW photo selection and editing through to final album delivery and client payments.",
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
    name: "Customer Relations - CRM",
    shortDesc: "Maintain structured customer directories, past booking history, and anniversary reminders to drive repeat bookings.",
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
    name: "Studio Operations - ERP",
    shortDesc: "Assign shoot tasks, check crew calendar availability, track equipment, and manage crew payroll, travel claims, and audit-ready accounting summaries.",
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
    name: "WhatsApp Operations & Bot",
    shortDesc: "Automated WhatsApp alerts and mobile operations: send booking confirmations and gallery links to clients, shoot reminders and call-times to crew, and receive real-time order milestone updates.",
    keyValue: "Operational Convenience Layer • Central Focoman Bot • Zero Client App Installs",
    tag: "WhatsApp & Bot",
    tagColor: "bg-green-50 text-status-success border-green-200",
    cards: [
      {
        title: "Update Status Without Opening the Tool",
        desc: "Crew members and studio owners can acknowledge call times, confirm shoots, or advance production milestones (e.g. RAW Ingest Done, Gallery Dispatched) directly via interactive WhatsApp bot commands without logging into the web dashboard.",
      },
      {
        title: "Purpose-Built Operations Bot",
        desc: "Direct operational assistant in your WhatsApp chat for querying active order status, reviewing pending/upcoming shoots, receiving automated reminders, and executing owner actions.",
      },
      {
        title: "Automated Milestone Notifications",
        desc: "Notify clients instantly when RAW photos are uploaded, selection galleries are live, album layout previews are ready for sign-off, or physical albums are dispatched.",
      },
      {
        title: "Crew Shoot Reminders & Call-Times",
        desc: "Send automated 48-hour and 12-hour call-time reminders to assigned photographers and cinematographers with venue GPS coordinates, call times, and shotlist requirements.",
      },
      {
        title: "Payment & Due Reminders",
        desc: "Timely, professional balance reminders with payment verification receipts sent straight to WhatsApp, ensuring transparent receivables before handover.",
      },
      {
        title: "Zero-Login Client Passkey Tracking",
        desc: "Clients never create passwords or download separate apps. Milestone alerts include their collision-safe private passkey link for real-time progress and proofing.",
      },
    ],
  },
  {
    number: "05",
    name: "Studio Marketplace",
    shortDesc: "Independent public studio profile allowing customers to discover your studio near them, view verified operational performance metrics, and submit booking inquiries directly.",
    keyValue: "Available in Professional (₹999/mo) • Not a price comparison engine",
    tag: "Studio Marketplace",
    tagColor: "bg-pink-50 text-pink-700 border-pink-200",
    cards: [
      {
        title: "Public Studio Profile",
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
    name: "Automations & Smart Engine",
    shortDesc: "Eliminate repetitive manual busywork with smart automation that configures package deliverables, suggests crew assignments based on availability and workload, calculates payment breakdowns, and advances production pipelines automatically.",
    keyValue: "Intelligent Studio Workflows • System Suggests → Owner Confirms",
    tag: "Automations",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    cards: [
      {
        title: "Configurable Package Deliverables Setup",
        desc: "Configure service packages once (edited photos count, teaser video length, full film, album sheet specifications). Focoman automatically breaks down the deliverables and seeds production tasks upon order confirmation.",
      },
      {
        title: "Auto-Assign Crew by Availability & Workload",
        desc: "Smart resource matching evaluates shoot dates, venue locations, crew skills (candid photographer, traditional videographer, drone pilot, editor), calendar availability, and active workload to suggest conflict-free crew assignments automatically.",
      },
      {
        title: "Automatic Calculations & Payment Breakdowns",
        desc: "Automated calculation of booking advance deposits, event-day installments, remaining balance dues, crew day rates, and travel expense breakdowns without manual spreadsheet math.",
      },
      {
        title: "Automated Workflow Progression",
        desc: "When shoot dates pass, the engine automatically spins up the post-event production pipeline, notifying crew to initiate RAW ingests, dual backups, and culling tasks.",
      },
      {
        title: "Pre-Flight Conflict Detection",
        desc: "Automatic evaluation of date overlaps, member availability, and skill alignment prior to booking confirmation, preventing double-booking catastrophes.",
      },
      {
        title: "Strict Delivery & Payment Completion Lock",
        desc: "Automatically enforces operational safety gates, ensuring orders cannot be archived as completed until all physical/digital deliverables are delivered and payments are 100% cleared.",
      },
    ],
  },
];

export function ModuleAccordion() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    {mod.name}
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary">
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
