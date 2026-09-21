"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { subscribeToAuthState, signOutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";

export function DashboardTopNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
    <div className="h-14 border-b border-border-default bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-text-tertiary">Studio OS</span>
        <Link
          href="/pricing/checkout"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-brand-orange-primary hover:bg-orange-200 transition"
        >
          Plan &amp; Capabilities
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher />
        <ThemeSwitcher />

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
                  href="/pricing/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-xs font-bold text-brand-orange-primary hover:bg-orange-50 transition"
                >
                  ★ Upgrade &amp; Capabilities
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
        )}
      </div>
    </div>
  );
}
