"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FocomanLogo } from "@/components/FocomanLogo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <FocomanLogo className="h-12 sm:h-14 w-auto" showStudiosSuffix={true} />
        </Link>

        <nav className="flex items-center gap-1 rounded-full bg-gray-100 p-1 text-xs font-medium sm:text-sm">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 font-semibold transition ${
                  isActive
                    ? "bg-brand-blue-primary text-white shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
