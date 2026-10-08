"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { subscribeToAuthState, signOutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";
import { StudioPlan } from "@focoman/types";
import { getStudioAction } from "@/actions/studioActions";

export function DashboardTopNav({
  role,
  planInfo: initialPlanInfo,
}: {
  role: "STUDIO_OWNER" | "STUDIO_MEMBER";
  planInfo?: StudioPlan | null;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlanInfo, setCurrentPlanInfo] = useState<StudioPlan | null | undefined>(initialPlanInfo);
  const router = useRouter();
  const params = useParams();
  const studioSlug = (params?.studioSlug as string) || "";
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setCurrentPlanInfo(initialPlanInfo);
  }, [initialPlanInfo]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !studioSlug || initialPlanInfo !== undefined) return;
    const fetchPlan = async () => {
      try {
        const token = await user.getIdToken();
        const res = await getStudioAction(studioSlug, token);
        if (res.success && res.studio) {
          setCurrentPlanInfo(res.studio.planInfo);
        }
      } catch (err) {
        console.warn("[DashboardTopNav] Plan info load error:", err);
      }
    };
    fetchPlan();
  }, [user, studioSlug, initialPlanInfo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  const selectedCaps = (currentPlanInfo?.selectedCapabilities || []) as string[];
  const hasCRM = selectedCaps.includes("CUSTOMER_CRM");
  const hasERP = selectedCaps.includes("STUDIO_ERP");
  const hasReports = selectedCaps.includes("BUSINESS_REPORTS");
  const hasDrive = selectedCaps.includes("DRIVE_CLIENT_REVIEW");
  const hasMarketplace = selectedCaps.includes("MARKETPLACE");
  const hasWhatsApp =
    selectedCaps.includes("WHATSAPP_NOTIFICATIONS") || selectedCaps.includes("WHATSAPP_OPERATIONS");

  const isFullySelected =
    (hasCRM && hasERP && hasReports && hasDrive && hasMarketplace && hasWhatsApp) ||
    currentPlanInfo?.plan === "COMPLETE";

  const hasAnySubscription =
    isFullySelected ||
    selectedCaps.length > 0 ||
    currentPlanInfo?.plan === "PROFESSIONAL";

  return (
    <div className="h-14 border-b border-border-default bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {/* Top left space kept clean */}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue-primary text-white font-bold text-xs focus:outline-none hover:bg-brand-blue-hover shadow-xs transition"
              title={user.email || "Account"}
            >
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U")}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border-default bg-white py-2 shadow-lg z-50">
                <div className="px-4 py-2 border-b border-border-default mb-1">
                  <p className="text-xs font-semibold text-text-primary truncate">{user.displayName || "Studio Member"}</p>
                  <p className="text-[10px] text-text-tertiary truncate">{user.email}</p>
                </div>

                <Link
                  href="/workspaces"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-app hover:text-brand-blue-primary transition"
                >
                  {t("nav.workspaces", "My Workspaces")}
                </Link>

                {role === "STUDIO_OWNER" && (
                  <div className="my-1.5 border-y border-border-default/60 py-2.5 px-3 bg-slate-50/70">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                        Studio Plan
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          hasAnySubscription
                            ? "bg-brand-blue-background text-brand-blue-primary border border-brand-blue-soft"
                            : "bg-slate-200/80 text-slate-700"
                        }`}
                      >
                        {hasAnySubscription ? "PRO" : "FREE"}
                      </span>
                    </div>

                    {!isFullySelected ? (
                      <Link
                        href={studioSlug ? `/checkout?studio=${studioSlug}` : "/checkout"}
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center flex items-center justify-center rounded-xl bg-brand-blue-primary px-3 py-2 text-xs font-bold text-white shadow-2xs hover:bg-brand-blue-hover transition"
                      >
                        Upgrade Plan
                      </Link>
                    ) : (
                      <Link
                        href={studioSlug ? `/checkout?studio=${studioSlug}` : "/checkout"}
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center flex items-center justify-center rounded-xl border border-border-default bg-white px-3 py-2 text-xs font-bold text-text-primary hover:bg-slate-100 transition shadow-2xs"
                      >
                        Manage Subscription
                      </Link>
                    )}
                  </div>
                )}

                <Link
                  href="/account-settings"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-app hover:text-brand-blue-primary transition"
                >
                  {t("nav.settings", "Account Settings")}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left block px-4 py-2 text-xs font-medium text-status-error hover:bg-red-50 transition"
                >
                  {t("nav.signout", "Sign Out")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
