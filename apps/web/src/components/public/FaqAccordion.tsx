"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "What is Focoman?",
    a: "Focoman is a studio operating system designed for photography and cinematography businesses. It unifies confirmed shoot orders, crew scheduling, post-event editing workflows, milestone deliveries, and payments in one structured system.",
  },
  {
    q: "Is the Free plan really free with unlimited orders?",
    a: "Yes. The Free plan includes unlimited confirmed orders, shoot scheduling, dynamic workflows, and milestone tracking. We never charge per event or per order volume.",
  },
  {
    q: "How does the 30-day free trial work?",
    a: "Every new studio gets 30 days of full access to the Complete plan (Smart Resource Automation, WhatsApp notifications, and multi-studio support) with zero risk and no credit card required. If you don't choose a paid plan after 30 days, your workspace automatically moves to the Free plan with 100% of your studio data safely preserved.",
  },
  {
    q: "How are WhatsApp notifications tiered across plans?",
    a: "Starter (₹499/mo) includes automated notifications for order workflow pipeline status updates, booking confirmations, payment receipts, and gallery delivery links. Professional (₹999/mo) adds automated upcoming event shoot and call-time schedule reminders. Complete (₹1,999/mo) includes all notifications plus the two-way interactive WhatsApp Operations Bot for status lookups and shoot queries.",
  },
  {
    q: "What is the Studio Marketplace?",
    a: "The Studio Marketplace is an opt-in public directory (/studios) where studios showcase packages, starting prices, and live calendar availability to receive direct client booking inquiries. Your internal CRM, financials, and crew rosters remain completely private.",
  },
  {
    q: "How does crew allocation and scheduling work?",
    a: "Starter provides manual crew assignment to shoot tasks and a team directory. Professional adds interactive crew availability calendars with automatic double-booking conflict checks. Complete introduces Smart Resource Automation, suggesting optimal crew pairings based on role, workload, and location.",
  },
  {
    q: "How do offline payments (UPI, Cash, Bank Transfer) work?",
    a: "Focoman supports standard offline payment methods. Clients can upload payment proof (UPI reference or screenshot). Once the studio owner verifies and marks it received in-app, the booking formally advances to a confirmed order.",
  },
  {
    q: "Can I manage multiple studios with one account?",
    a: "Yes. With a single personal login, you can create or join multiple studio workspaces and switch between them instantly. Multi-studio management is included in the Complete plan (₹1,999/mo).",
  },
  {
    q: "Do clients need to sign in to access their orders?",
    a: "Yes. Clients log in securely with their Google account to review event details, track editing progress, access selection galleries, and view payment receipts in their private client portal.",
  },
  {
    q: "Does Focoman handle legal contracts or e-signatures?",
    a: "No. Legal contracts and custom proposals are handled directly between you and your client outside Focoman. We focus on executing confirmed bookings, operational workflows, and milestone delivery.",
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
