"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FocomanLogo } from "@/components/FocomanLogo";
export type Plan = "basic" | "professional" | "complete";

interface DashboardSidebarProps {
  studioSlug: string;
  plan: Plan;
  studioName: string;
  ownerName: string;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: (slug: string) => `/${slug}/dashboard`,
    module: null as null,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Order Management",
    sublabel: "OMS",
    href: (slug: string) => `/${slug}/dashboard/oms`,
    module: "oms" as const,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: "Customer Relations",
    sublabel: "CRM",
    href: (slug: string) => `/${slug}/dashboard/crm`,
    module: "crm" as const,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Studio Operations",
    sublabel: "ERP",
    href: (slug: string) => `/${slug}/dashboard/erp`,
    module: "erp" as const,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    sublabel: "Notifications",
    href: (slug: string) => `/${slug}/dashboard/whatsapp`,
    module: "whatsapp" as const,
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export function DashboardSidebar({ studioSlug, plan, studioName, ownerName }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border-default bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border-divider px-5 py-4">
        <FocomanLogo className="h-9 w-auto" showStudiosSuffix={false} />
      </div>

      {/* Studio Info */}
      <div className="border-b border-border-divider px-5 py-3">
        <p className="text-xs font-bold text-text-primary truncate">{studioName}</p>
        <p className="text-xs text-text-tertiary truncate">{ownerName}</p>
        <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
          plan === "complete"
            ? "bg-brand-purple-background text-brand-purple-primary"
            : plan === "professional"
            ? "bg-brand-orange-background text-brand-orange-primary"
            : "bg-brand-blue-background text-brand-blue-primary"
        }`}>
          {plan === "complete" ? "Studio Complete" : plan === "professional" ? "Studio Professional" : "Studio Starter"}
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const accessible = item.module === null || item.module === "oms" || plan === "professional" || plan === "complete";
          const href = item.href(studioSlug);
          const isActive = pathname === href;

          if (!accessible) {
            return (
              <div
                key={item.label}
                title={`Upgrade to access ${item.label}`}
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
              key={item.label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "bg-brand-blue-primary text-white shadow-xs"
                  : "text-text-secondary hover:bg-surface-app hover:text-text-primary"
              }`}
            >
              <span>{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{item.label}</p>
                {item.sublabel && (
                  <p className={`text-[10px] ${isActive ? "text-white/70" : "text-text-tertiary"}`}>
                    {item.sublabel}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Sign Out */}
      <div className="border-t border-border-divider px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-text-secondary transition hover:bg-red-50 hover:text-red-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
