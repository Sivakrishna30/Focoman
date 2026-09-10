"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { subscribeToAuthState, signOutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";

export function DashboardTopNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  if (!user) return <div className="h-14 border-b border-border-default bg-white hidden md:flex items-center justify-end px-6"></div>;

  return (
    <div className="h-14 border-b border-border-default bg-white hidden md:flex items-center justify-end px-6 sticky top-0 z-40">
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
    </div>
  );
}
