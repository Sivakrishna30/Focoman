"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FREE_CORE_CAPABILITY,
  PURCHASABLE_CAPABILITIES,
  calculateMonthlyTotal,
  getEffectiveCapabilities,
} from "@focoman/config";
import type { CapabilityId, CapabilityMetadata } from "@focoman/types";

export function CheckoutBuilder() {
  const searchParams = useSearchParams();
  const upgradeParam = searchParams.get("upgrade")?.toLowerCase() || searchParams.get("feature")?.toLowerCase();
  const studioParam = searchParams.get("studio");
  const planParam = searchParams.get("plan")?.toLowerCase();

  // Mode: simulate different studio accounts (Pro studio with owned capabilities vs Free studio)
  const [selectedStudioProfile, setSelectedStudioProfile] = useState<"pro" | "free">(
    planParam === "free" ? "free" : "pro"
  );

  // Owned capabilities for the Pro studio profile
  const ownedCapsForPro: CapabilityId[] = ["CUSTOMER_BASIC", "WHATSAPP_NOTIFICATIONS"];

  // Currently selected capabilities
  const [selectedCaps, setSelectedCaps] = useState<CapabilityId[]>(() => {
    if (planParam === "free" || selectedStudioProfile === "free") {
      if (upgradeParam === "crm") return ["CUSTOMER_BASIC"];
      if (upgradeParam === "erp" || upgradeParam === "crew") return ["CREW_BASIC"];
      if (upgradeParam === "whatsapp") return ["WHATSAPP_NOTIFICATIONS"];
      if (upgradeParam === "marketplace") return ["MARKETPLACE"];
      if (upgradeParam === "drive") return ["DRIVE_CLIENT_REVIEW"];
      return [];
    }
    const initial: CapabilityId[] = ["CUSTOMER_BASIC", "WHATSAPP_NOTIFICATIONS"];
    if (upgradeParam === "crm" && !initial.includes("CUSTOMER_BASIC")) initial.push("CUSTOMER_BASIC");
    if ((upgradeParam === "erp" || upgradeParam === "crew") && !initial.includes("CREW_BASIC")) initial.push("CREW_BASIC");
    if (upgradeParam === "marketplace" && !initial.includes("MARKETPLACE")) initial.push("MARKETPLACE");
    if (upgradeParam === "drive" && !initial.includes("DRIVE_CLIENT_REVIEW")) initial.push("DRIVE_CLIENT_REVIEW");
    return initial;
  });

  // Handle switching studio profile simulation
  const handleSwitchProfile = (profile: "pro" | "free") => {
    setSelectedStudioProfile(profile);
    if (profile === "pro") {
      setSelectedCaps(["CUSTOMER_BASIC", "WHATSAPP_NOTIFICATIONS"]);
    } else {
      if (upgradeParam === "crm") setSelectedCaps(["CUSTOMER_BASIC"]);
      else if (upgradeParam === "erp" || upgradeParam === "crew") setSelectedCaps(["CREW_BASIC"]);
      else if (upgradeParam === "whatsapp") setSelectedCaps(["WHATSAPP_NOTIFICATIONS"]);
      else if (upgradeParam === "marketplace") setSelectedCaps(["MARKETPLACE"]);
      else if (upgradeParam === "drive") setSelectedCaps(["DRIVE_CLIENT_REVIEW"]);
      else setSelectedCaps([]);
    }
    setSubscriptionCancelled(false);
  };

  // Renewal and subscription preferences
  const [applyOnRenewal, setApplyOnRenewal] = useState<boolean>(true);
  const [autopayLimitEnabled, setAutopayLimitEnabled] = useState<boolean>(false);
  const [autopayLimitAmount, setAutopayLimitAmount] = useState<number>(1000);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false);
  const [subscriptionCancelled, setSubscriptionCancelled] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

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

      if (capId === "CUSTOMER_ADVANCED") {
        return exists
          ? prev.filter((c) => c !== "CUSTOMER_ADVANCED")
          : [...prev.filter((c) => c !== "CUSTOMER_BASIC"), "CUSTOMER_ADVANCED"];
      }

      if (capId === "CUSTOMER_BASIC") {
        return exists
          ? prev.filter((c) => c !== "CUSTOMER_BASIC" && c !== "CUSTOMER_ADVANCED")
          : [...prev.filter((c) => c !== "CUSTOMER_ADVANCED"), "CUSTOMER_BASIC"];
      }

      if (capId === "CREW_ADVANCED") {
        return exists
          ? prev.filter((c) => c !== "CREW_ADVANCED")
          : [...prev.filter((c) => c !== "CREW_BASIC"), "CREW_ADVANCED"];
      }

      if (capId === "CREW_BASIC") {
        return exists
          ? prev.filter((c) => c !== "CREW_BASIC" && c !== "CREW_ADVANCED")
          : [...prev.filter((c) => c !== "CREW_ADVANCED"), "CREW_BASIC"];
      }

      if (capId === "WHATSAPP_OPERATIONS") {
        return exists
          ? prev.filter((c) => c !== "WHATSAPP_OPERATIONS")
          : [...prev.filter((c) => c !== "WHATSAPP_NOTIFICATIONS"), "WHATSAPP_OPERATIONS"];
      }

      if (capId === "WHATSAPP_NOTIFICATIONS") {
        return exists
          ? prev.filter((c) => c !== "WHATSAPP_NOTIFICATIONS" && c !== "WHATSAPP_OPERATIONS")
          : [...prev.filter((c) => c !== "WHATSAPP_OPERATIONS"), "WHATSAPP_NOTIFICATIONS"];
      }

      return exists ? prev.filter((c) => c !== capId) : [...prev, capId];
    });
  };

  const effectiveSet = new Set(getEffectiveCapabilities(selectedCaps));
  const monthlyTotal = calculateMonthlyTotal(selectedCaps);
  const userPlanTag = selectedCaps.length > 0 ? "PROFESSIONAL" : "FREE";

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
      items: PURCHASABLE_CAPABILITIES.filter((c) => c.category === "CUSTOMER_MANAGEMENT"),
    },
    {
      title: "Crew Management",
      description: "Team profiles, skills, assignment, availability, and conflict detection.",
      badge: "ERP",
      items: PURCHASABLE_CAPABILITIES.filter((c) => c.category === "CREW_MANAGEMENT"),
    },
    {
      title: "Studio Marketplace",
      description: "Public studio profile, custom packages, and direct booking inquiries.",
      badge: "DISCOVERY",
      items: PURCHASABLE_CAPABILITIES.filter((c) => c.category === "STUDIO_MARKETPLACE"),
    },
    {
      title: "OMS Advanced (Drive Preview & Photo Selection)",
      description: "In-app photo previews, client selection comments, and review status.",
      badge: "OMS ADVANCED",
      items: PURCHASABLE_CAPABILITIES.filter((c) => c.category === "DRIVE_CLIENT_REVIEW"),
    },
    {
      title: "WhatsApp Operations",
      description: "Automated event alerts and interactive WhatsApp bot for studio owners.",
      badge: "MESSAGING",
      items: PURCHASABLE_CAPABILITIES.filter((c) => c.category === "WHATSAPP"),
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Workspace Profile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-border-divider text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-secondary">Viewing Workspace:</span>
          <span className="font-bold text-text-primary">
            {selectedStudioProfile === "pro" ? "Lumina Studios" : "Standard Studio Profile"}
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full ${
              selectedStudioProfile === "pro"
                ? "bg-brand-orange-primary text-white"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {selectedStudioProfile === "pro" ? "PRO" : "FREE"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSwitchProfile("free")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              selectedStudioProfile === "free"
                ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400"
                : "bg-white text-text-secondary border border-border-default hover:bg-slate-100"
            }`}
          >
            Switch to Free Account View
          </button>
          <button
            type="button"
            onClick={() => handleSwitchProfile("pro")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              selectedStudioProfile === "pro"
                ? "bg-brand-orange-primary text-white ring-2 ring-orange-400"
                : "bg-white text-text-secondary border border-border-default hover:bg-slate-100"
            }`}
          >
            Switch to Pro Account View
          </button>
        </div>
      </div>

      {/* Navigated Upgrade Alert (e.g. from OMS sidebar/pages) */}
      {upgradeParam && (
        <div className="rounded-2xl border border-brand-orange-light bg-brand-orange-background/40 p-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-xs font-extrabold text-brand-orange-primary uppercase tracking-wider">
                Navigated from Studio Workspace: {upgradeParam.toUpperCase()} Selected
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {upgradeParam === "crm"
                  ? "Customer Management (CRM) has been pre-selected below. You can customize additional capabilities or proceed directly to payment."
                  : `The ${upgradeParam.toUpperCase()} capability has been pre-selected for your workspace below.`}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-full bg-brand-orange-primary text-white shrink-0">
            PRO UPGRADE
          </span>
        </div>
      )}

      {/* Plan Tag Banner & Status */}
      <div className="rounded-3xl border border-border-default bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider block">
            Studio Plan Status
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-xl font-extrabold text-text-primary">
              Current Workspace Tag:
            </h2>
            <span
              className={`px-3.5 py-1 text-xs font-black uppercase rounded-full tracking-widest ${
                userPlanTag === "PROFESSIONAL"
                  ? "bg-brand-orange-primary text-white shadow-xs"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {userPlanTag === "PROFESSIONAL" ? "PRO PLAN" : "FREE PLAN"}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {userPlanTag === "PROFESSIONAL"
              ? "You have active paid capabilities configured. Any changes will take effect on your next subscription renewal."
              : "You are currently on the Free Basic Order Management tier. Add capabilities below to upgrade to Professional."}
          </p>
        </div>

        <div className="text-left md:text-right shrink-0 border-t md:border-t-0 md:border-l border-border-divider pt-3 md:pt-0 md:pl-6">
          <span className="text-xs font-semibold text-text-tertiary block">Selected Monthly Total</span>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-text-primary">₹{monthlyTotal}</span>
            <span className="text-xs text-text-secondary font-medium">/mo</span>
          </div>
        </div>
      </div>

      {/* Interactive Selection Grid */}
      <div className="space-y-8">
        <div className="border-b border-border-divider pb-4">
          <h3 className="text-2xl font-extrabold text-text-primary">
            Select Your Studio Capabilities
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Check or uncheck individual capabilities to build your exact studio configuration.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-divider/60 pb-2">
                <div>
                  <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <span>{cat.title}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-text-tertiary uppercase">
                      {cat.badge}
                    </span>
                  </h4>
                  <p className="text-xs text-text-secondary">{cat.description}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {cat.items.map((cap) => {
                  const isDirectlySelected = selectedCaps.includes(cap.id);
                  const isExpanded = expandedCardIds.includes(cap.id);

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
                          : "border-border-default hover:border-slate-300"
                      }`}
                    >
                      <div>
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
                              <h5 className="text-sm font-bold text-text-primary">
                                {cap.name}
                              </h5>
                              <div className="flex flex-wrap gap-1.5 mt-0.5">
                                {selectedStudioProfile === "pro" && ownedCapsForPro.includes(cap.id) && (
                                  <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-brand-blue-primary">
                                    Active in Workspace
                                  </span>
                                )}
                                {isCoveredByAdvanced && (
                                  <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                    Included in Advanced
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-lg font-extrabold text-text-primary">
                              ₹{cap.price}
                            </span>
                            <span className="text-xs text-text-tertiary">/mo</span>
                          </div>
                        </div>

                        <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                          {cap.description}
                        </p>

                        <ul className="mt-3 space-y-1 border-t border-border-divider pt-3">
                          {cap.features.slice(0, 3).map((feat, fIdx) => (
                            <li key={fIdx} className="text-[11px] text-text-secondary flex items-start gap-1.5">
                              <span className="text-brand-blue-primary font-bold shrink-0">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-border-divider/70 space-y-2 text-[11px] text-text-secondary">
                            {cap.features.slice(3).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-start gap-1.5">
                                <span className="text-brand-blue-primary font-bold shrink-0">✓</span>
                                <span>{feat}</span>
                              </div>
                            ))}
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
                          {isDirectlySelected ? "Selected" : isCoveredByAdvanced ? "Included" : "+ Add"}
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

      {/* Subscription Preferences & Autopay Limits */}
      <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-extrabold text-text-primary border-b border-border-divider pb-3">
          Subscription &amp; Billing Settings
        </h3>

        <div className="space-y-4 text-xs text-text-secondary">
          {/* Renewal option */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-border-default hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={applyOnRenewal}
              onChange={(e) => setApplyOnRenewal(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-blue-primary focus:ring-brand-blue-primary"
            />
            <div>
              <span className="font-bold text-text-primary block">
                Update plan on next subscription renewal
              </span>
              <span className="text-text-tertiary">
                Changes will be scheduled for your next monthly billing cycle without prorated mid-cycle penalty charges.
              </span>
            </div>
          </label>

          {/* Autopay Limit option */}
          <div className="p-4 rounded-xl border border-border-default space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autopayLimitEnabled}
                onChange={(e) => setAutopayLimitEnabled(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-blue-primary focus:ring-brand-blue-primary"
              />
              <div>
                <span className="font-bold text-text-primary block">
                  Set Autopay Safety Limit
                </span>
                <span className="text-text-tertiary">
                  Cap maximum automatic deductions to prevent unexpected charges.
                </span>
              </div>
            </label>

            {autopayLimitEnabled && (
              <div className="pl-7 flex items-center gap-3">
                <span className="font-semibold text-text-primary">Max Monthly Cap: ₹</span>
                <input
                  type="number"
                  value={autopayLimitAmount}
                  onChange={(e) => setAutopayLimitAmount(Number(e.target.value))}
                  className="w-32 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-text-primary focus:border-brand-blue-primary focus:outline-none"
                  min={monthlyTotal}
                  step={50}
                />
                <span className="text-text-tertiary text-[11px]">(Min: ₹{monthlyTotal})</span>
              </div>
            )}
          </div>

          {/* Cancel Subscription option */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-red-900 block">Cancel Subscription</span>
                <span className="text-red-700 text-[11px]">
                  Revert workspace back to 100% Free Basic Order Management at the end of current cycle.
                </span>
              </div>
              {!subscriptionCancelled && (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirmation(true)}
                  className="px-3 py-1.5 rounded-lg border border-red-300 bg-white text-xs font-bold text-red-700 hover:bg-red-50"
                >
                  Cancel Plan
                </button>
              )}
            </div>

            {showCancelConfirmation && !subscriptionCancelled && (
              <div className="mt-3 p-3 rounded-lg bg-white border border-red-300 space-y-2">
                <p className="font-semibold text-red-900">
                  Are you sure you want to cancel your paid capabilities?
                </p>
                <p className="text-[11px] text-text-secondary">
                  Your workspace will keep access until the end of the current billing cycle, then revert to Basic Order management.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSubscriptionCancelled(true);
                      setSelectedCaps([]);
                      setShowCancelConfirmation(false);
                    }}
                    className="px-3 py-1 rounded bg-red-600 text-white font-bold text-[11px]"
                  >
                    Yes, Cancel Paid Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirmation(false)}
                    className="px-3 py-1 rounded bg-slate-100 text-text-primary font-bold text-[11px]"
                  >
                    Keep My Capabilities
                  </button>
                </div>
              </div>
            )}

            {subscriptionCancelled && (
              <div className="mt-2 rounded-lg bg-red-100 p-2.5 text-xs text-red-800 font-bold">
                ✓ Subscription cancellation scheduled for end of cycle. Workspace tag will revert to FREE.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Summary & Payment Gateway Placeholder */}
      <div className="rounded-3xl border border-brand-orange-primary/30 bg-gradient-to-br from-white via-orange-50/20 to-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-divider pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-orange-primary">
              ORDER BREAKDOWN
            </span>
            <h3 className="text-xl font-extrabold text-text-primary">
              Monthly Subscription Total
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-text-primary">₹{monthlyTotal}</span>
            <span className="text-xs text-text-secondary font-medium">/ month</span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-text-secondary">
          <div className="flex items-center justify-between py-1 border-b border-border-divider/50">
            <span>Basic Order management (₹0 Forever)</span>
            <span className="font-bold text-emerald-700">INCLUDED (₹0)</span>
          </div>
          {selectedCaps.map((cId) => {
            const cap = PURCHASABLE_CAPABILITIES.find((p) => p.id === cId);
            if (!cap) return null;
            return (
              <div key={cId} className="flex items-center justify-between py-1 border-b border-border-divider/50">
                <span className="font-medium text-text-primary">{cap.name}</span>
                <span className="font-extrabold text-text-primary">₹{cap.price}/mo</span>
              </div>
            );
          })}
        </div>

        {checkoutSuccess ? (
          <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-6 text-center space-y-2">
            <span className="text-2xl">🎉</span>
            <h4 className="text-base font-extrabold text-emerald-900">
              Capabilities Updated Successfully!
            </h4>
            <p className="text-xs text-emerald-800">
              Your studio workspace configuration has been updated. Payment gateway integration will complete automatically during billing renewal.
            </p>
            <div className="pt-2">
              <Link
                href="/pricing"
                className="inline-block px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                Return to Pricing Page
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setCheckoutSuccess(true)}
              className="w-full rounded-xl bg-brand-orange-primary px-8 py-4 text-xs font-extrabold text-white shadow-sm transition hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment Gateway (₹{monthlyTotal}/mo)</span>
              <span>→</span>
            </button>
            <p className="text-center text-[11px] text-text-tertiary">
              Secure 256-bit SSL Payment Gateway · Cancel or adjust capabilities anytime from your studio settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
