"use client";

import { useState } from "react";

interface ModuleData {
  number: string;
  name: string;
  shortDesc: string;
  tag: string;
  tagColor: string;
  cards: { title: string; desc: string }[];
}

const MODULES: ModuleData[] = [
  {
    number: "01",
    name: "Order Management System - OMS",
    shortDesc: "Track and manage confirmed orders and their status across every milestone, from RAW photo selection and editing through to final album delivery and client payments.",
    tag: "Core Engine",
    tagColor: "bg-brand-blue-background text-brand-blue-primary border-brand-blue-light/50",
    cards: [
      {
        title: "Confirmed Order",
        desc: "Create and manage confirmed orders and the complete post-event workflow from RAW backup and photo selection through editing, album design, client review, printing, final delivery, and payment completion.",
      },
      {
        title: "Studio Marketplace Complete Workflow",
        desc: "Manage Studio Marketplace bookings through a pre-event workflow covering leads and inquiries, advance payment, booking confirmation, and event planning, in addition to the post-event workflow through to final delivery and payment completion.",
      },
      {
        title: "Client Passkey Tracking",
        desc: "Give clients a secure, private link to track their event progress and access their gallery, photos, and delivery links without creating an account.",
      },
      {
        title: "Order Lifecycle & Recovery",
        desc: "Manage active, cancelled, and completed orders separately, with a 14-day recovery window for deleted orders.",
      },
    ],
  },
  {
    number: "02",
    name: "Customer Relations - CRM",
    shortDesc: "Maintain structured customer directories, past booking history, and anniversary reminders to drive repeat bookings.",
    tag: "Support Module",
    tagColor: "bg-brand-orange-background text-brand-orange-primary border-brand-orange-soft",
    cards: [
      {
        title: "Customer Directory & Profiles",
        desc: "Centralized client directory with verified phone numbers, email addresses, and postal addresses.",
      },
      {
        title: "Order, Payment & Receivables History",
        desc: "Instant visibility into all past and active photoshoot orders, cumulative customer spend, historical receipts, advance deposits, and outstanding receivables across years of service.",
      },
      {
        title: "Booking & Inquiry Records",
        desc: "Review past booking inquiries and requests directly attached to customer profile records.",
      },
      {
        title: "Anniversary & Customer Milestone Reminders",
        desc: "Use previous event dates to remind studios about upcoming anniversaries and important customer milestones, creating opportunities to reconnect and offer relevant photography services.",
      },
    ],
  },
  {
    number: "03",
    name: "Studio Operations - ERP",
    shortDesc: "Assign shoot tasks, check crew calendar availability, track equipment, and manage crew payroll, travel claims, and audit-ready accounting summaries.",
    tag: "Operations & People",
    tagColor: "bg-brand-purple-background text-brand-purple-primary border-brand-purple-light/50",
    cards: [
      {
        title: "Crew Profiles & Roles",
        desc: "Create crew member profiles and assign their roles and skills, such as videographers, editors, drone pilots, and other studio crew.",
      },
      {
        title: "Manual Crew Assignment",
        desc: "Manually assign crew members to confirmed events based on their availability and current workload.",
      },
      {
        title: "Crew Workload Tracker",
        desc: "Give studio owners a clear view of each crew member’s assigned projects, pending work, and current project status.",
      },
      {
        title: "Smart Resource Suggestions",
        desc: "Suggest suitable crew members based on event date, location, required roles and skills, availability, and workload. The studio owner reviews and confirms the suggested assignment.",
      },
    ],
  },
  {
    number: "04",
    name: "WhatsApp Operations & Bot",
    shortDesc: "Automated WhatsApp alerts and mobile operations: send booking confirmations and gallery links to clients, shoot reminders and call-times to crew, and receive real-time order milestone updates.",
    tag: "WhatsApp & Bot",
    tagColor: "bg-green-50 text-status-success border-green-200",
    cards: [
      {
        title: "Automated WhatsApp Notifications",
        desc: "Send booking confirmations, event reminders, production updates, gallery links, and delivery updates to clients and crew through WhatsApp.",
      },
      {
        title: "WhatsApp Status Updates",
        desc: "Allow studio owners and crew members to update supported event and production statuses directly through WhatsApp without opening the Focoman dashboard.",
      },
      {
        title: "Focoman Operations Bot",
        desc: "Use the Focoman WhatsApp Bot to check active orders, upcoming events, pending tasks, and other supported studio operations directly from WhatsApp.",
      },
      {
        title: "Crew Reminders & Call Times",
        desc: "Send scheduled reminders to assigned crew members with event date, call time, venue location, and required shoot information.",
      },
    ],
  },
  {
    number: "05",
    name: "Studio Marketplace",
    shortDesc: "Independent public studio profile allowing customers to discover your studio near them, view verified operational performance metrics, and submit booking inquiries directly.",
    tag: "Studio Marketplace",
    tagColor: "bg-pink-50 text-pink-700 border-pink-200",
    cards: [
      {
        title: "Public Studio Profile & Direct Inquiries",
        desc: "Showcase your studio profile with bio, city, services, and verified operational delivery metrics on a unique URL, allowing prospective clients to submit direct booking requests with event dates, locations, and service requirements.",
      },
      {
        title: "Configurable Service Packages",
        desc: "Publish your customized package options, transparent pricing, deliverables specifications, and negotiable status.",
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
    tag: "Automations",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    cards: [
      {
        title: "Automatic Payment Calculations",
        desc: "Automatically calculate advance payments, event-day installments, remaining balances, crew day rates, and configured travel expenses.",
      },
      {
        title: "Automated Workflow Progression",
        desc: "Automatically start the required post-event production workflow when an event is completed, and notify the relevant crew about their pending production tasks.",
      },
      {
        title: "Pre-Flight Conflict Detection",
        desc: "Check event dates, crew availability, workload, and required skills before booking confirmation to identify potential scheduling and resource conflicts.",
      },
      {
        title: "Native Studio Integrations",
        desc: "Synchronize crew shoot schedules directly with Google Calendar, and manage Google Drive folders with in-app preview and client comments options.",
      },
    ],
  },
];

export function ModuleAccordion() {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const toggleModule = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      {MODULES.map((mod, idx) => {
        const isExpanded = expandedIndices.includes(idx);
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
                  <span className="block text-base sm:text-lg font-bold text-text-primary">
                    {mod.name}
                  </span>
                  <span className="block mt-1 text-xs text-text-secondary">
                    {mod.shortDesc}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end shrink-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                  <svg
                    className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${isExpanded ? "rotate-180 text-brand-blue-primary" : ""}`}
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
