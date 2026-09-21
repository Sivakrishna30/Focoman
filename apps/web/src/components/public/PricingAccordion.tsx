"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FREE_CORE_CAPABILITY,
  PURCHASABLE_CAPABILITIES,
  calculateMonthlyTotal,
  getEffectiveCapabilities,
} from "@focoman/config";
import type { CapabilityId, CapabilityMetadata } from "@focoman/types";

export function PricingAccordion() {
  // Start with no paid capabilities selected by default (Free Core OMS ₹0)
  const [selectedCaps, setSelectedCaps] = useState<CapabilityId[]>([]);

  // Expandable details state per card
  const [expandedCardIds, setExpandedCardIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCapability = (capId: CapabilityId) => {
    setSelectedCaps((prev) => {
      const exists = prev.includes(capId);

      // If toggling off an Advanced capability, keep or remove Basic as appropriate
      if (capId === "CUSTOMER_ADVANCED") {
        if (exists) {
          return prev.filter((c) => c !== "CUSTOMER_ADVANCED");
        } else {
          return [...prev.filter((c) => c !== "CUSTOMER_BASIC"), "CUSTOMER_ADVANCED"];
        }
      }

      if (capId === "CUSTOMER_BASIC") {
        if (exists) {
          return prev.filter((c) => c !== "CUSTOMER_BASIC" && c !== "CUSTOMER_ADVANCED");
        } else {
          return [...prev.filter((c) => c !== "CUSTOMER_ADVANCED"), "CUSTOMER_BASIC"];
        }
      }

      if (capId === "CREW_ADVANCED") {
        if (exists) {
          return prev.filter((c) => c !== "CREW_ADVANCED");
        } else {
          return [...prev.filter((c) => c !== "CREW_BASIC"), "CREW_ADVANCED"];
        }
      }

      if (capId === "CREW_BASIC") {
        if (exists) {
          return prev.filter((c) => c !== "CREW_BASIC" && c !== "CREW_ADVANCED");
        } else {
          return [...prev.filter((c) => c !== "CREW_ADVANCED"), "CREW_BASIC"];
        }
      }

      if (capId === "WHATSAPP_OPERATIONS") {
        if (exists) {
          return prev.filter((c) => c !== "WHATSAPP_OPERATIONS");
        } else {
          return [...prev.filter((c) => c !== "WHATSAPP_NOTIFICATIONS"), "WHATSAPP_OPERATIONS"];
        }
      }

      if (capId === "WHATSAPP_NOTIFICATIONS") {
        if (exists) {
          return prev.filter((c) => c !== "WHATSAPP_NOTIFICATIONS" && c !== "WHATSAPP_OPERATIONS");
        } else {
          return [...prev.filter((c) => c !== "WHATSAPP_OPERATIONS"), "WHATSAPP_NOTIFICATIONS"];
        }
      }

      // Default toggle for independent capabilities
      if (exists) {
        return prev.filter((c) => c !== capId);
      } else {
        return [...prev, capId];
      }
    });
  };

  const effectiveSet = new Set(getEffectiveCapabilities(selectedCaps));
  const monthlyTotal = calculateMonthlyTotal(selectedCaps);

  // Group capabilities by category for structured visual display
  const categories: {
    title: string;
    description: string;
    badge: string;
    items: CapabilityMetadata[];
  }[] = [
    {
      title: "Customer Management",
      description: "Client directory, history, receivables, and repeat booking reminders.",
      badge: "CRM",
      items: PURCHASABLE_CAPABILITIES.filter(
        (c) => c.category === "CUSTOMER_MANAGEMENT"
      ),
    },
    {
      title: "Crew Management",
      description: "Team profiles, skills, assignment, availability, and conflict detection.",
      badge: "ERP",
      items: PURCHASABLE_CAPABILITIES.filter(
        (c) => c.category === "CREW_MANAGEMENT"
      ),
    },
    {
      title: "Studio Marketplace",
      description: "Public studio profile, custom packages, and direct booking inquiries.",
      badge: "DISCOVERY",
      items: PURCHASABLE_CAPABILITIES.filter(
        (c) => c.category === "STUDIO_MARKETPLACE"
      ),
    },
    {
      title: "OMS Advanced (Drive Preview & Photo Selection)",
      description: "In-app photo previews, client selection comments, and review status.",
      badge: "OMS ADVANCED",
      items: PURCHASABLE_CAPABILITIES.filter(
        (c) => c.category === "DRIVE_CLIENT_REVIEW"
      ),
    },
    {
      title: "WhatsApp Operations",
      description: "Automated event alerts and interactive WhatsApp bot for studio owners.",
      badge: "MESSAGING",
      items: PURCHASABLE_CAPABILITIES.filter((c) => c.category === "WHATSAPP"),
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. FREE CORE HIGHLIGHT */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-blue-primary/30 bg-gradient-to-br from-white via-brand-blue-background/10 to-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full bg-brand-blue-primary px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                FREE CORE
              </span>
              <span className="text-xs font-bold text-status-success flex items-center gap-1">
                <span>✓</span> Always ₹0 Forever
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                {FREE_CORE_CAPABILITY.name}
              </h2>
              <p className="text-sm font-medium text-text-secondary mt-1">
                {FREE_CORE_CAPABILITY.description}
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs font-medium text-text-secondary">
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

          <div className="shrink-0 flex flex-col items-start lg:items-end justify-center rounded-2xl border border-border-default bg-white p-6 shadow-xs min-w-[220px]">
            <span className="text-xs font-semibold text-text-tertiary">Free Core Price</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-text-primary">₹0</span>
              <span className="text-xs text-text-secondary font-medium">/forever</span>
            </div>
            <p className="mt-1 text-[11px] text-text-tertiary">Unlimited Orders &amp; Events</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue-primary">
              Included in Every Plan →
            </span>
          </div>
        </div>
      </div>

      {/* 2. BUILD YOUR PLAN SECTION */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
            BUILD YOUR PLAN
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Choose Only the Capabilities Your Studio Needs
          </h2>
          <p className="text-sm text-text-secondary">
            Select add-on capabilities to customize your workspace. Upgrade, downgrade, or change your capabilities anytime with transparent monthly pricing.
          </p>
        </div>

        {/* Capability Category Blocks */}
        <div className="space-y-8">
          {categories.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-divider pb-2">
                <div>
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <span>{cat.title}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold text-text-tertiary uppercase">
                      {cat.badge}
                    </span>
                  </h3>
                  <p className="text-xs text-text-secondary">{cat.description}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {cat.items.map((cap) => {
                  const isDirectlySelected = selectedCaps.includes(cap.id);
                  const isEffectivelyIncluded = effectiveSet.has(cap.id);
                  const isExpanded = expandedCardIds.includes(cap.id);

                  // Check if this card is automatically covered by an Advanced version
                  const isCoveredByAdvanced =
                    (cap.id === "CUSTOMER_BASIC" && selectedCaps.includes("CUSTOMER_ADVANCED")) ||
                    (cap.id === "CREW_BASIC" && selectedCaps.includes("CREW_ADVANCED")) ||
                    (cap.id === "WHATSAPP_NOTIFICATIONS" && selectedCaps.includes("WHATSAPP_OPERATIONS"));

                  return (
                    <div
                      key={cap.id}
                      onClick={() => handleToggleCapability(cap.id)}
                      className={`group relative rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between bg-white ${
                        isDirectlySelected
                          ? "border-brand-blue-primary shadow-sm ring-2 ring-brand-blue-primary/10"
                          : isCoveredByAdvanced
                          ? "border-emerald-300 bg-emerald-50/20"
                          : "border-border-default hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      <div>
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isDirectlySelected || isCoveredByAdvanced}
                              onChange={() => handleToggleCapability(cap.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4 rounded border-slate-300 text-brand-blue-primary focus:ring-brand-blue-primary cursor-pointer"
                            />
                            <div>
                              <h4 className="text-base font-bold text-text-primary">
                                {cap.name}
                              </h4>
                              {isCoveredByAdvanced && (
                                <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  Included in Advanced
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xl font-extrabold text-text-primary">
                              ₹{cap.price}
                            </span>
                            <span className="text-xs text-text-tertiary">/mo</span>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-text-secondary leading-relaxed">
                          {cap.description}
                        </p>

                        {/* Feature Highlights */}
                        <ul className="mt-4 space-y-1.5 border-t border-border-divider pt-3">
                          {cap.features.slice(0, 3).map((feat, fIdx) => (
                            <li
                              key={fIdx}
                              className="text-[11px] text-text-secondary flex items-start gap-1.5"
                            >
                              <span className="text-brand-blue-primary font-bold shrink-0">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-border-divider/70 space-y-2 text-[11px] text-text-secondary">
                            {cap.features.slice(3).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-start gap-1.5">
                                <span className="text-brand-blue-primary font-bold shrink-0">✓</span>
                                <span>{feat}</span>
                              </div>
                            ))}

                            {cap.limitations && cap.limitations.length > 0 && (
                              <div className="mt-2 rounded-lg bg-amber-50 p-2 text-amber-800 text-[10px]">
                                <span className="font-bold uppercase tracking-wider block mb-1">
                                  Access &amp; Usage Rules:
                                </span>
                                {cap.limitations.map((lim, lIdx) => (
                                  <div key={lIdx} className="flex items-center gap-1">
                                    <span>•</span>
                                    <span>{lim}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-2 flex items-center justify-between border-t border-border-divider/50">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(cap.id);
                          }}
                          className="text-[11px] font-bold text-brand-blue-primary hover:underline cursor-pointer"
                        >
                          {isExpanded ? "Show Less" : "View All Details"}
                        </button>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDirectlySelected
                              ? "bg-brand-blue-background text-brand-blue-primary"
                              : isCoveredByAdvanced
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-text-tertiary"
                          }`}
                        >
                          {isDirectlySelected
                            ? "Selected"
                            : isCoveredByAdvanced
                            ? "Included"
                            : "+ Add"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. INLINE SUMMARY & CHECKOUT BLOCK */}
      <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-tertiary">
              ESTIMATED MONTHLY PLAN TOTAL
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
                ₹{monthlyTotal}
              </span>
              <span className="text-xs text-text-secondary font-semibold">/ month</span>
              <span className="text-[10px] font-bold rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700">
                Includes Free Core OMS (₹0)
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Selected Capabilities ({selectedCaps.length}):{" "}
              {selectedCaps.length === 0 ? (
                <span className="font-semibold text-text-tertiary">Basic Order Management Only (Free)</span>
              ) : (
                <span className="font-semibold text-text-primary">
                  {selectedCaps
                    .map((c) => PURCHASABLE_CAPABILITIES.find((p) => p.id === c)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/sign-in"
              className="w-full sm:w-auto text-center rounded-xl bg-brand-blue-primary px-8 py-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-sky-600 flex items-center justify-center gap-2"
            >
              <span>Continue with Selected Capabilities</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
