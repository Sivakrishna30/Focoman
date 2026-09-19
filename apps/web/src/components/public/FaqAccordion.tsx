"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "What is Focoman?",
    a: "Focoman is an OMS-First (Order Management System) Business Operating System built specifically for professional photography and cinematography studios. It unifies shoot orders, service workflows, post-event production milestones, payment tracking, crew planning, and client deliveries in one structured system.",
  },
  {
    q: "Can I manage unlimited orders and events on the Free plan?",
    a: "Yes. Focoman does not charge by event count or order volume. The Free plan includes unlimited confirmed orders and shoots with the complete core Order Management System (OMS), dynamic workflows, delivery tracking, and a 14-day soft-delete recovery window.",
  },
  {
    q: "How does the 14-day trial work?",
    a: "Every new studio begins with a 14-day full-feature trial with complete access to Complete plan capabilities (including Smart Resource Automation, WhatsApp alerts, and multi-studio support). After 14 days, if you do not select a paid plan, your account automatically falls back to the Free plan. All your orders, event schedules, and studio data are 100% preserved without data loss.",
  },
  {
    q: "How does the Studio Marketplace work?",
    a: "Marketplace is an opt-in discovery capability. Each studio publishes its own independent storefront at /studio/[slug] displaying its location, services, custom packages, pricing, and verified operational metrics (calculated automatically from actual order completion timestamps). Focoman is NOT a price-comparison or discount-ranking site; each studio controls its own brand presentation, and internal financial records, CRM, and crew schedules remain strictly confidential.",
  },
  {
    q: "Do my clients need an account to view orders and deliverables?",
    a: "Yes. Clients are first-class users with secure, account-based access to view active bookings, review deliverables, track production progress, and access their complete order history directly in their client portal.",
  },
  {
    q: "How does crew assignment and resource planning work?",
    a: "You invite photographers, cinematographers, and editors to your studio workspace using their Google accounts. In Starter, you assign crew manually to shoot tasks. In Professional, you plan schedules using visual availability calendars with automatic double-booking conflict detection and skill-matching verification. In Complete, our Smart Resource Automation recommends optimal crew pairings based on venue location, role requirements, availability, and active workload, following our strict rule: System Suggests → Studio Owner Reviews → Studio Owner Confirms.",
  },
  {
    q: "How do offline payments and booking confirmation work?",
    a: "Focoman treats offline payments (Cash, UPI, Direct Bank Transfer) as first-class citizens. When a client submits a booking request, an advance payment request is issued. Clients can upload payment proof (transaction reference or screenshot). The studio owner verifies the payment in-app, which formally transitions the booking request into a confirmed order.",
  },
  {
    q: "How do WhatsApp notifications and the Operations Bot work?",
    a: "Included in the Complete plan, WhatsApp integration sends real-time milestone alerts to clients and crew members for upcoming call times, upload notices, and balance receipts. The WhatsApp Operations Bot allows studio owners to query active order statuses, check upcoming shoots, and review action items directly from WhatsApp. It is designed purely as an operational assistant, not an AI lead-generation chatbot.",
  },
  {
    q: "Can I manage multiple studios with one user account?",
    a: "Yes. Focoman uses a unified personal identity architecture. Studio owners and freelance crew members can belong to multiple studio workspaces and switch between them effortlessly with one login.",
  },
  {
    q: "Does Focoman include contract templates or e-signatures?",
    a: "No. Contracts, legal templates, and e-signatures are explicitly outside the scope of Focoman. Pre-event offline discussions and legal agreements happen directly between you and your client outside the app. Focoman focuses on tracking verified business states, confirmed deliverables, and production orchestration.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `faq-panel-${idx}`;
        const buttonId = `faq-button-${idx}`;

        return (
          <div
            key={idx}
            className={`rounded-2xl border transition bg-white ${
              isOpen
                ? "border-brand-blue-primary/40 shadow-xs"
                : "border-border-default hover:border-slate-300"
            }`}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleFaq(idx)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-primary rounded-2xl"
            >
              <span className="text-sm sm:text-base font-bold text-text-primary">
                {faq.q}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-text-secondary transition-transform duration-200">
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-blue-primary" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`px-5 pb-5 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-divider/50 pt-3 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {faq.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
