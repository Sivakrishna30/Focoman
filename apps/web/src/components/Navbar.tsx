"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FocomanLogo } from "@/components/FocomanLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { subscribeToAuthState, signOutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";

function UserDropdownMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue-primary text-white font-bold text-xs focus:outline-none hover:bg-brand-blue-hover shadow-xs transition"
        title={user.email || "Account"}
      >
        {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U")}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border-default bg-white py-2 shadow-lg z-50">
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
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();

  const navLinks = [
    { label: t("nav.home", "Home"), href: "/" },
    { label: t("nav.features", "Features"), href: "/features" },
    { label: t("nav.pricing", "Pricing"), href: "/pricing" },
    { label: t("nav.marketplace", "Marketplace"), href: "/marketplace" },
    { label: t("nav.about", "About Us"), href: "/about" },
  ];

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">
        {/* Left Side: Hamburger (Mobile) + Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          {/* Mobile Nav Toggle - Left Corner */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-lg p-1.5 text-text-secondary hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center shrink-0">
            <FocomanLogo className="h-7 sm:h-9 md:h-11 w-auto" showStudiosSuffix={true} />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
          <nav className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1 text-xs font-medium sm:text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 font-semibold transition ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Compact Single-line Language Switcher & Theme Switcher */}
          <LanguageSwitcher />
          <ThemeSwitcher />

          {user ? (
            <UserDropdownMenu user={user} />
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              {t("nav.signin", "Sign In")}
            </Link>
          )}
        </div>

        {/* Mobile Right: Compact Language Switcher + Theme Switcher + Sign In Button */}
        <div className="flex items-center gap-1.5 md:hidden shrink-0">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {user ? (
            <UserDropdownMenu user={user} />
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-3 py-1 text-[11px] sm:text-xs font-bold text-white shadow-xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shrink-0"
            >
              {t("nav.signin", "Sign In")}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-default bg-white px-4 py-4 shadow-lg absolute w-full left-0">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-blue-primary text-white"
                      : "bg-gray-50 text-text-secondary hover:bg-gray-100 hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

