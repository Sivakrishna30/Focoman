"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FocomanLogo } from "@/components/FocomanLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { signOutUser } from "@/lib/firebaseAuth";

export type Plan = "basic" | "professional" | "complete";

export interface DashboardSidebarProps {
  studioSlug: string;
  plan: Plan;
  studioName: string;
  ownerName: string;
  features?: {
    oms: boolean;
    crm: boolean;
    erp: boolean;
    whatsapp: boolean;
    marketplace: boolean;
  };
  appEnv?: string;
}

const MODULE_ACTIVE_CLASSES: Record<string, string> = {
  oms: "bg-brand-blue-primary text-white shadow-xs",
  crm: "bg-brand-orange-primary text-white shadow-xs",
  erp: "bg-brand-purple-primary text-white shadow-xs",
  whatsapp: "bg-brand-blue-primary text-white shadow-xs",
  marketplace: "bg-brand-purple-primary text-white shadow-xs",
  default: "bg-brand-blue-primary text-white shadow-xs",
};

export function DashboardSidebar({ studioSlug, plan, studioName, ownerName, features, appEnv }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    {
      label: t("nav.dashboard", "Dashboard"),
      sublabel: undefined,
      key: "dashboard",
      href: (slug: string) => `/${slug}/dashboard`,
      module: null as null,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: t("dash.orders", "Order Management"),
      sublabel: "OMS",
      key: "oms",
      href: (slug: string) => `/${slug}/dashboard/oms`,
      module: "oms" as const,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: t("dash.crm", "Customer Relations"),
      sublabel: "CRM",
      key: "crm",
      href: (slug: string) => `/${slug}/dashboard/crm`,
      module: "crm" as const,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: t("dash.erp", "Studio Operations"),
      sublabel: "ERP",
      key: "erp",
      href: (slug: string) => `/${slug}/dashboard/erp`,
      module: "erp" as const,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: t("dash.whatsapp", "WhatsApp"),
      sublabel: "Notifications",
      key: "whatsapp",
      href: (slug: string) => `/${slug}/dashboard/whatsapp`,
      module: "whatsapp" as const,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: t("dash.marketplace", "Studio Marketplace"),
      sublabel: "Public Profile",
      key: "marketplace",
      href: (slug: string) => `/${slug}/dashboard/marketplace`,
      module: "marketplace" as const,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error("[DashboardSidebar] Sign out error:", err);
    }
    router.push("/");
  };

  const navContent = (onLinkClick?: () => void) => (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border-divider px-5 py-4">
        <FocomanLogo className="h-9 w-auto" showStudiosSuffix={false} />
        {onLinkClick && (
          <button
            onClick={onLinkClick}
            className="rounded-lg p-1.5 text-text-tertiary hover:bg-slate-100 md:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Studio Info */}
      <div className="border-b border-border-divider px-5 py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-text-primary truncate">{studioName}</p>
          <Link
            id="tour-sidebar-switch"
            href="/workspaces"
            prefetch={true}
            onClick={onLinkClick}
            className="text-[10px] font-semibold text-brand-blue-primary hover:underline shrink-0"
            title="Switch Workspace"
          >
            {t("nav.switch", "Switch")}
          </Link>
        </div>
        <p className="text-xs text-text-tertiary truncate">{ownerName}</p>
        <span
          className={`mt-1.5 inline-block text-[10px] ${
            plan === "complete"
              ? "badge-brand-purple"
              : plan === "professional"
              ? "badge-brand-orange"
              : "badge-brand-blue"
          }`}
        >
          {plan === "complete" ? "Studio Complete" : plan === "professional" ? "Studio Professional" : "Studio Starter"}
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isDevPortal = (item.module as string | null) === "dev";
          const isTestingMode = appEnv === "testing";
          
          // Phase 1 Modularity: Determine access based on specific feature flags if present, otherwise fallback to plan logic
          let accessible = false;
          
          if (isDevPortal) {
            accessible = isTestingMode;
          } else if (item.module === null || item.module === "oms") {
            accessible = true; // Dashboard and OMS are always accessible
          } else if (features) {
            accessible = !!features[item.module as keyof typeof features];
          } else {
            // Legacy plan fallback
            accessible = plan === "professional" || plan === "complete";
          }

          const href = item.href(studioSlug);
          const isActive = pathname === href;
          const activeClass = item.module && MODULE_ACTIVE_CLASSES[item.module]
            ? MODULE_ACTIVE_CLASSES[item.module]
            : MODULE_ACTIVE_CLASSES.default;

          if (!accessible) {
            return (
              <div
                key={item.key}
                title={isDevPortal ? "Only visible in testing mode" : `Enable module in settings to access ${item.label}`}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 opacity-40"
              >
                <span className="text-text-tertiary">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-tertiary truncate">{item.label}</p>
                  {item.sublabel && <p className="text-[10px] text-text-tertiary">{item.sublabel}</p>}
                </div>
                <svg className="h-3 w-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            );
          }

          return (
            <Link
              key={item.key}
              id={item.module ? `tour-nav-${item.module}` : "tour-nav-dashboard"}
              href={href}
              prefetch={true}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? activeClass
                  : "text-text-secondary hover:bg-surface-app hover:text-text-primary"
              }`}
            >
              <span>{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{item.label}</p>
                {item.sublabel && (
                  <p className={`text-[10px] ${isActive ? "text-white/80" : "text-text-tertiary"}`}>
                    {item.sublabel}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Language, Theme Switcher & Sign Out */}
      <div className="border-t border-border-divider px-3 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-text-tertiary">{t("nav.theme", "Theme")}</span>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <button
          onClick={() => {
            if (onLinkClick) onLinkClick();
            void handleSignOut();
          }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-red-50 hover:text-red-600 text-left"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t("nav.signout", "Sign Out")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="flex h-13 w-full items-center justify-between border-b border-border-default bg-white px-3 sm:px-4 md:hidden shrink-0 z-30">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <FocomanLogo className="h-6 sm:h-7 w-auto shrink-0" showStudiosSuffix={false} />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <span className="text-[11px] sm:text-xs font-bold text-text-primary max-w-[70px] sm:max-w-[120px] truncate" title={studioName}>
            {studioName}
          </span>
          <Link
            href="/workspaces"
            prefetch={true}
            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary hover:text-brand-blue-primary hover:bg-brand-blue-50 transition"
          >
            {t("nav.switch", "Switch")}
          </Link>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-72 max-w-[80vw] flex-1 flex-col shadow-xl">
            {navContent(() => setMobileOpen(false))}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border-default bg-white md:flex">
        {navContent()}
      </aside>
    </>
  );
}
