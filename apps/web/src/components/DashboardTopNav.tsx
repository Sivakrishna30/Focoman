"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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
    <div className="h-14 border-b border-[#D8D2C4] bg-[#FAF7F2] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-[0_1px_2px_rgba(40,30,20,0.04)]">
      <div className="flex items-center gap-2">
        {/* Top left space kept clean */}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-[#0EA5E9] text-white font-bold text-xs border border-[#0369A1] shadow-[0_2px_0_#0369A1] hover:bg-[#0284C7] active:translate-y-[1.5px] active:shadow-none focus:outline-none transition"
              title={user.email || "Account"}
            >
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U")}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-md border border-[#D8D2C4] bg-[#FFFFFF] p-1.5 shadow-[0_4px_16px_rgba(40,30,20,0.12)] z-50">
                <div className="px-3 py-2 border-b border-[#E6E0D4] mb-1">
                  <p className="text-xs font-bold text-[#1C1917] truncate">{user.displayName || "Studio Member"}</p>
                  <p className="text-[10px] text-[#8C857B] truncate">{user.email}</p>
                </div>

                <Link
                  href="/workspaces"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-1.5 text-xs font-medium text-[#57534E] hover:bg-[#FAF7F2] hover:text-[#1C1917] rounded transition"
                >
                  My Workspaces
                </Link>

                {role === "STUDIO_OWNER" && (
                  <div className="my-1.5 border-y border-[#E6E0D4] py-2.5 px-3 bg-[#FAF7F2] rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C857B]">
                        Studio Plan
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          hasAnySubscription
                            ? "bg-[#F0F9FF] text-[#0369A1] border border-[#7DD3FC]"
                            : "bg-[#ECE6DE] text-[#57534E] border border-[#D8D2C4]"
                        }`}
                      >
                        {hasAnySubscription ? "PRO" : "FREE"}
                      </span>
                    </div>

                    {!isFullySelected ? (
                      <Link
                        href={studioSlug ? `/checkout?studio=${studioSlug}` : "/checkout"}
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center flex items-center justify-center rounded-md bg-[#0EA5E9] border border-[#0369A1] px-3 py-1.5 text-xs font-bold text-white shadow-[0_2px_0_#0369A1] hover:bg-[#0284C7] active:translate-y-[1.5px] active:shadow-none transition"
                      >
                        Upgrade Plan
                      </Link>
                    ) : (
                      <Link
                        href={studioSlug ? `/checkout?studio=${studioSlug}` : "/checkout"}
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center flex items-center justify-center rounded-md border border-[#C4BCAB] bg-white px-3 py-1.5 text-xs font-bold text-[#1C1917] shadow-[0_2px_0_#C4BCAB] hover:bg-[#FAF7F2] active:translate-y-[1.5px] active:shadow-none transition"
                      >
                        Manage Subscription
                      </Link>
                    )}
                  </div>
                )}

                <Link
                  href="/account-settings"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-1.5 text-xs font-medium text-[#57534E] hover:bg-[#FAF7F2] hover:text-[#1C1917] rounded transition"
                >
                  Account Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left block px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
