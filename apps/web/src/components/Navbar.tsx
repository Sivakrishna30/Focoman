"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FocomanLogo } from "@/components/FocomanLogo";
import { subscribeToAuthState, signOutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
];

function UserDropdownMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            My Workspaces
          </Link>
          <Link
            href="/account-settings"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-app hover:text-brand-blue-primary transition"
          >
            Account Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left block px-4 py-2 text-xs font-medium text-status-error hover:bg-red-50 transition"
          >
            Sign Out
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

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left Side: Hamburger (Mobile) + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Nav Toggle - Left Corner */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-md p-2 text-text-secondary hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-3">
            <FocomanLogo className="h-8 sm:h-12 md:h-14 w-auto" showStudiosSuffix={true} />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
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

          {user ? (
            <UserDropdownMenu user={user} />
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex rounded-full bg-brand-blue-primary px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-sky-600"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Right: Sign In Button */}
        <div className="flex items-center md:hidden">
          {user ? (
            <UserDropdownMenu user={user} />
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-full bg-brand-blue-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-sky-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-default bg-white px-4 py-4 shadow-lg absolute w-full left-0">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
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

