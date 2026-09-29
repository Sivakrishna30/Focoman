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
import { subscribeToAuthState } from "@/lib/firebaseAuth";
import type { User } from "firebase/auth";
import type { CapabilityId } from "@focoman/types";

export function CheckoutBuilder() {
  const searchParams = useSearchParams();
  const upgradeParam = searchParams.get("upgrade")?.toLowerCase() || searchParams.get("feature")?.toLowerCase();
  const studioParam = searchParams.get("studio");

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Currently selected capabilities
  const [selectedCaps, setSelectedCaps] = useState<CapabilityId[]>(() => {
    const initial: CapabilityId[] = [];
    if (upgradeParam === "crm") initial.push("CUSTOMER_CRM");
    else if (upgradeParam === "erp" || upgradeParam === "crew") initial.push("STUDIO_ERP");
    else if (upgradeParam === "reports" || upgradeParam === "analytics") initial.push("BUSINESS_REPORTS");
    else if (upgradeParam === "whatsapp") initial.push("WHATSAPP_NOTIFICATIONS");
    else if (upgradeParam === "marketplace") initial.push("MARKETPLACE");
    else if (upgradeParam === "drive") initial.push("DRIVE_CLIENT_REVIEW");
    return initial;
  });
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  const handleToggleCapability = (capId: CapabilityId) => {
    setSelectedCaps((prev) => {
      const exists = prev.includes(capId);

      // WhatsApp Bot includes Notifications
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Workspace / Logged In Status Banner */}
      {user ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-border-divider text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-secondary">Viewing Workspace:</span>
            <span className="font-bold text-text-primary">
              {studioParam ? `${studioParam} Studio` : "Active Workspace"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-secondary">Logged in as:</span>
            <span className="font-bold text-text-primary">{user.email}</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-amber-50/50 border border-amber-200/60 p-4 text-xs text-amber-800">
          You are not currently logged in. To configure modules and persist them to an active workspace, please <Link href="/sign-in" className="font-bold underline hover:text-amber-900">Sign In</Link> first.
        </div>
      )}

      {/* Navigated Upgrade Alert (e.g. from OMS sidebar/pages) */}
      {upgradeParam && (
        <div className="rounded-2xl border border-brand-orange-light bg-brand-orange-background/40 p-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-extrabold text-brand-orange-primary uppercase tracking-wider">
                Navigated from Studio Workspace: {upgradeParam.toUpperCase()} Selected
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {upgradeParam === "crm"
                  ? "Customer Management (CRM) has been pre-selected below. You can customize additional modules or proceed directly to payment."
                  : `The ${upgradeParam.toUpperCase()} module has been pre-selected for your workspace below.`}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-full bg-brand-orange-primary text-white shrink-0">
            PRO UPGRADE
          </span>
        </div>
      )}

      {/* Interactive Selection Grid */}
      <div className="space-y-6">
        <div className="border-b border-border-divider pb-4">
          <h3 className="text-2xl font-extrabold text-text-primary">
            Select Your Studio Modules
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Build your custom plan by selecting from the modular add-on options below.
          </p>
        </div>

        {/* OMS - Basic - Free Core Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-extrabold text-text-primary">Order Management System (OMS) - Basic</h4>
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  Core Engine · Included Free
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Track and manage orders and their status across every milestone, from lead and inquiry through booking, event, production, and final delivery.
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <span className="text-2xl font-black text-text-primary">₹0</span>
              <span className="text-xs text-text-tertiary font-bold"> / forever</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 text-xs text-text-secondary">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">•</span>
              <span>Create and manage confirmed studio orders</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">•</span>
              <span>Pre-event &amp; post-event workflow tracking</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">•</span>
              <span>Log event info, package pricing, &amp; customer details</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">•</span>
              <span>Record advance payments &amp; outstanding balances</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">•</span>
              <span>Client passkey tracking for event progress</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-black">•</span>
              <span>No order limits or hidden subscription charges</span>
            </div>
          </div>
        </div>

        {/* Unified Modules Stack */}
        <div className="bg-white border border-border-default rounded-3xl p-6 shadow-xs space-y-5">
          <div className="border-b border-border-divider pb-3">
            <h4 className="text-base font-extrabold text-text-primary">
              Choose Add-on Modules
            </h4>
            <p className="text-xs text-text-secondary mt-0.5">
              Select one or more professional modules. They will integrate seamlessly into your workspace.
            </p>
          </div>

          <div className="space-y-4">
            {PURCHASABLE_CAPABILITIES.map((cap) => {
              const isDirectlySelected = selectedCaps.includes(cap.id);

              const isCoveredByAdvanced =
                cap.id === "WHATSAPP_NOTIFICATIONS" && selectedCaps.includes("WHATSAPP_OPERATIONS");

              return (
                <div
                  key={cap.id}
                  onClick={() => handleToggleCapability(cap.id)}
                  className={`group relative rounded-2xl border p-5 transition-all duration-200 cursor-pointer bg-white ${
                    isDirectlySelected
                      ? "border-brand-blue-primary bg-brand-blue-background/5 shadow-sm ring-2 ring-brand-blue-primary/15"
                      : isCoveredByAdvanced
                      ? "border-emerald-300 bg-emerald-50/30"
                      : "border-border-default hover:border-slate-300 hover:bg-slate-50/20"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Checkbox and text info */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isDirectlySelected || isCoveredByAdvanced}
                          onChange={() => handleToggleCapability(cap.id)}
                          className="h-5 w-5 rounded border-slate-300 text-brand-blue-primary focus:ring-brand-blue-primary cursor-pointer transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h5 className="text-sm font-extrabold text-text-primary">
                            {cap.name}
                          </h5>
                          {isCoveredByAdvanced && (
                            <span className="inline-block rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-800">
                              Included in Bot
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {cap.description}
                        </p>
                        
                        {/* Features List as clean grid */}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-3 mt-3 border-t border-slate-100 text-[11px] text-text-secondary">
                          {cap.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-1.5 pl-1">
                              <span className="text-emerald-500 font-extrabold shrink-0">•</span>
                              <span className="leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Price and Status Button */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <span className="text-xl font-extrabold text-text-primary">
                          ₹{cap.price}
                        </span>
                        <span className="text-xs text-text-tertiary">/mo</span>
                      </div>

                      <div className="md:mt-2">
                        <span
                          className={`inline-block text-[11px] font-extrabold px-3.5 py-1.5 rounded-full tracking-wide shadow-2xs transition-all duration-150 ${
                            isDirectlySelected
                              ? "bg-brand-blue-primary text-white"
                              : isCoveredByAdvanced
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-text-primary border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {isDirectlySelected ? "✓ Selected" : isCoveredByAdvanced ? "✓ Included" : "+ Add Module"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <h4 className="text-base font-extrabold text-emerald-900">
              Modules Updated Successfully!
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
              Secure 256-bit SSL Payment Gateway · Cancel or adjust modules anytime from your studio settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
