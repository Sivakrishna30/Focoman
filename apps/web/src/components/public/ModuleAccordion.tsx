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
    shortDesc: "Track and manage orders and their status across every milestone, from lead and inquiry through booking, event, production, and final delivery.",
    tag: "Core Engine",
    tagColor: "bg-brand-blue-background text-brand-blue-primary border-brand-blue-light/50",
    cards: [
      {
        title: "Confirmed Order",
        desc: "Create and manage confirmed orders with customer details, event information, package details, pricing, payments, and the complete post-event workflow through final delivery.",
      },
      {
        title: "Studio Marketplace Orders",
        desc: "Manage leads and bookings from Studio Marketplace packages, including customer details, selected packages, advance payment, booking confirmation, event planning, and the post-event workflow.",
      },
      {
        title: "Order Status Tracking",
        desc: "View pending, active, and completed orders in one place and check the current status of each order throughout the booking and production workflow.",
      },
      {
        title: "Client Passkey Tracking",
        desc: "Give clients a password-protected private link to check their event progress and access their gallery, photos, and delivery links without creating an account.",
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
        title: "Customer Directory and Profiles",
        desc: "Centralized client directory with verified phone numbers, email addresses, and postal addresses.",
      },
      {
        title: "Order, Payment and Receivables History",
        desc: "Instant visibility into all past and active photoshoot orders, cumulative customer spend, historical receipts, advance deposits, and outstanding receivables across years of service.",
      },
      {
        title: "Booking and Inquiry Records",
        desc: "Review past booking inquiries and requests directly attached to customer profile records.",
      },
      {
        title: "Anniversary and Customer Milestone Reminders",
        desc: "Use previous event dates to remind studios about upcoming anniversaries and important customer milestones, creating opportunities to reconnect and offer relevant photography services.",
      },
    ],
  },
  {
    number: "03",
    name: "Studio Operations - ERP",
    shortDesc: "Manage your studio team, assign shoots and production tasks, check crew availability, and keep track of crew expenses and payments.",
    tag: "Operations and Team",
    tagColor: "bg-brand-purple-background text-brand-purple-primary border-brand-purple-light/50",
    cards: [
      {
        title: "Team Directory and Roles",
        desc: "Add photographers, videographers, drone pilots, and editors with their roles, skills, and contact details so your studio team is organized in one place.",
      },
      {
        title: "Shoot and Task Assignment",
        desc: "Assign team members to confirmed shoots and production tasks, and keep track of the work assigned to each crew member across active projects.",
      },
      {
        title: "Crew Availability",
        desc: "Check crew availability before assigning shoots and tasks, and view the current availability of team members when planning upcoming studio work.",
      },
      {
        title: "Expenses and Crew Payments",
        desc: "Record shoot day-rates, travel expenses, and crew payments to keep track of production costs and understand the expenses related to each studio project.",
      },
    ],
  },
  {
    number: "04",
    name: "WhatsApp Operations and Bot",
    shortDesc: "Send automated booking confirmations and gallery links to clients, dispatch call times to crew, and manage studio operations on the go with an interactive WhatsApp bot.",
    tag: "WhatsApp and Bot",
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
        title: "Crew Reminders and Call Times",
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
        title: "Public Studio Profile and Direct Inquiries",
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
    name: "Business Reports and Analytics",
    shortDesc: "Track your studio income with monthly and yearly revenue charts, monitor pending client balances, see your most profitable shoot categories, and review on-time delivery track records.",
    tag: "Business and Growth",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    cards: [
      {
        title: "Monthly and Yearly Revenue Reports",
        desc: "See your total studio earnings by month and year. Track growth over time and compare peak wedding season vs off-season revenue.",
      },
      {
        title: "Pending Balances and Cash Flow",
        desc: "Get an instant list of all pending client dues, advance deposits received, and balance payments to collect before album delivery.",
      },
      {
        title: "Most Profitable Shoot Categories",
        desc: "Know exactly which photoshoot packages earn you the most profit—Weddings, Engagements, Receptions, Baby Shoots, or Corporate Events.",
      },
      {
        title: "On-Time Delivery and Speed",
        desc: "Review your average turnaround time from shoot day to final album hand-off to maintain high client satisfaction and earn 5-star reviews.",
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
    <div className="space-y-3.5 sm:space-y-4">
      {MODULES.map((mod, idx) => {
        const isExpanded = expandedIndices.includes(idx);

        return (
          <div
            key={idx}
            className="rounded-xl border border-[#D8D2C4] bg-[#FFFDF9] shadow-[0_2px_0_#C4BCAB] transition hover:border-[#BFB8A7] overflow-hidden"
          >
            {/* Header row (Clickable) */}
            <button
              type="button"
              onClick={() => toggleModule(idx)}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left group transition-colors hover:bg-[#FAF7F2]"
              aria-expanded={isExpanded}
            >
              <div className="min-w-0 flex-1">
                <h3 className="retro-serif-heading text-base sm:text-lg font-bold text-[#1C1917] group-hover:text-brand-orange-primary transition-colors">
                  {mod.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  {mod.shortDesc}
                </p>
              </div>

              {/* Just arrow mark */}
              <div className="shrink-0 flex items-center justify-center pl-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF5E8] border border-[#D8D2C4] group-hover:border-brand-orange-soft transition-colors">
                  <svg
                    className={`h-4 w-4 text-[#57534E] transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-brand-orange-primary" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </button>

            {/* Expanded 4 child feature panels */}
            {isExpanded && (
              <div className="border-t border-[#E8E0D0] bg-[#FAF7F2] p-4 sm:p-5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {mod.cards.map((card, cIdx) => (
                    <div
                      key={cIdx}
                      className="rounded-lg border border-[#D8D2C4] bg-[#FFFDF9] p-3.5 shadow-xs transition hover:border-[#BFB8A7] flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1C1917]">
                          {card.title}
                        </h4>
                        <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
