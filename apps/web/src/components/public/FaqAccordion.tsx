"use client";

import { useState } from "react";

interface FaqItem {
  category: string;
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  // 1. Order Management System (OMS)
  {
    category: "Order Management (OMS)",
    q: "What is included in Basic Order Management, and is it really free forever?",
    a: "Yes. Basic Order Management is ₹0 forever with no order limits or time limits. You can create confirmed orders, track workflow stages from shoot to final delivery, assign basic customer and event details, and manage payment milestones without any subscription fee.",
  },
  {
    category: "Order Management (OMS)",
    q: "Does Focoman store my raw photos and videos?",
    a: "No. Focoman does not host large RAW photos or video files. Your files remain stored in your own Google Drive. With OMS Advanced (₹299/month), Focoman connects to your Google Drive folders so your clients can view in-app previews, submit selected photo numbers, and leave review comments directly inside their private tracking link.",
  },

  // 2. Customer Relations (CRM)
  {
    category: "Customer Relations (CRM)",
    q: "What does the Customer Management (CRM) add-on provide?",
    a: "The CRM add-on gives you a dedicated client directory. It maintains a history of all past events, tracks cumulative lifetime spend and pending payments across multiple years, and alerts you to upcoming customer anniversaries so you can secure repeat bookings.",
  },
  {
    category: "Customer Relations (CRM)",
    q: "Can I manage orders if I do not purchase the CRM add-on?",
    a: "Yes. In the free Basic OMS, you can still enter customer names, phone numbers, and addresses directly on individual orders. The CRM add-on is only needed if you want an indexed client directory, lifetime financial summaries, and automated anniversary reminder alerts.",
  },

  // 3. Studio Operations & Crew (ERP)
  {
    category: "Studio Operations & Crew (ERP)",
    q: "How does Crew Management work?",
    a: "Crew Management allows you to build a team directory with assigned roles, such as traditional photographer, candid photographer, cinematographer, drone operator, or editor. You can check their availability on your calendar, assign crew to confirmed events, set call times, and monitor open workloads.",
  },
  {
    category: "Studio Operations & Crew (ERP)",
    q: "What happens if a crew member is assigned to two events on the same day?",
    a: "The system detects scheduling conflicts before you confirm the assignment. It flags that the crew member is already booked on that date and suggests other available team members with matching skills, preventing accidental double-booking.",
  },

  // 4. WhatsApp Operations & Bot
  {
    category: "WhatsApp Operations & Bot",
    q: "What is the difference between WhatsApp Notifications and the WhatsApp Bot?",
    a: "WhatsApp Notifications (₹199/month) sends automated messages for order updates, including booking confirmations, crew call-time reminders, and client delivery links. WhatsApp Operations (₹499/month) includes an interactive bot that lets the studio owner text questions on WhatsApp to check upcoming event schedules, active orders, and pending tasks.",
  },
  {
    category: "WhatsApp Operations & Bot",
    q: "Who can access the WhatsApp Bot, and are there usage limits?",
    a: "Only the verified studio owner's phone number can chat with the WhatsApp Bot to keep your business data private. To ensure predictable costs, it includes 499 bot queries per month. If you reach this limit, the bot pauses until the next billing cycle with no extra fees, while automated event notifications continue delivering normally.",
  },

  // 5. Studio Marketplace
  {
    category: "Studio Marketplace",
    q: "What is the Studio Marketplace and how does it bring bookings?",
    a: "The Marketplace provides your studio with a public profile page. Prospective clients in your city can browse your verified delivery track record, service packages, and starting prices, and send direct booking inquiries straight to your studio dashboard.",
  },
  {
    category: "Studio Marketplace",
    q: "Can visitors or other studios see my private customer records or finances?",
    a: "No. Public visitors only see the packages, photos, and studio bio you choose to display. Your client database, internal order notes, customer payment records, crew rates, and studio accounts are completely private and accessible only inside your authenticated studio workspace.",
  },

  // 6. Pricing & Custom Plans
  {
    category: "Pricing & Custom Plans",
    q: "How does the modular pricing model work?",
    a: "You start with Basic Order Management for free. You only pay for the specific add-on modules your studio needs, starting from ₹199/month. Advanced capabilities automatically include all basic-tier features, so you never pay twice for the same tool.",
  },
  {
    category: "Pricing & Custom Plans",
    q: "What happens if I cancel a paid add-on or downgrade my plan?",
    a: "You can cancel paid add-ons at any time with no penalties. You keep full access to those features until the end of your prepaid monthly billing period. After that, your workspace smoothly returns to the free Basic Order Management plan without losing any of your existing orders, client records, or event data.",
  },

  // 7. Value-Added Services
  {
    category: "Value-Added Services",
    q: "What are Value-added services?",
    a: "Value-added services are optional, one-time setup services provided by our team. They include professional studio logo creation, setting up a branded portfolio website, and configuring your studio workflow templates.",
  },
  {
    category: "Value-Added Services",
    q: "How does data migration work if my studio currently uses Excel or paper registers?",
    a: "Our team can help import your existing client registers, upcoming event bookings, and historical order details from Excel or CSV files directly into Focoman. This lets you transition your studio smoothly without re-typing records manually.",
  },
];

export function FaqAccordion() {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleFaq = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndices.includes(idx);
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
              className="w-full text-left p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-primary rounded-2xl"
            >
              <span className="block text-sm sm:text-base font-bold text-text-primary">
                {faq.q}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-text-secondary transition-transform duration-200 mt-1 sm:mt-0">
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
              className={`px-5 pb-5 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-divider/50 pt-3.5 ${
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
