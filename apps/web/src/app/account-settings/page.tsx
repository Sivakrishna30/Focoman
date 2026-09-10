"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { subscribeToAuthState, signOutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.replace("/sign-in");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-app flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-primary"></div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />
      
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackHref="/dashboard" />
        </div>

        <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-divider pb-6">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
                Account Settings
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Manage your personal profile and preferences.
              </p>
            </div>
            <div className="h-16 w-16 flex-shrink-0 rounded-full bg-brand-blue-primary text-white flex items-center justify-center text-2xl font-bold shadow-sm">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U")}
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-4">
                Personal Profile
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Full Name
                  </label>
                  <div className="w-full rounded-xl border border-border-default bg-gray-50 px-4 py-2.5 text-sm font-medium text-text-primary">
                    {user.displayName || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Email Address
                  </label>
                  <div className="w-full rounded-xl border border-border-default bg-gray-50 px-4 py-2.5 text-sm font-medium text-text-primary">
                    {user.email}
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-border-divider pt-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-4">
                Authentication & Security
              </h2>
              <div className="rounded-2xl border border-border-default bg-gray-50/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Sign Out</h3>
                  <p className="text-xs text-text-secondary mt-1 max-w-sm">
                    Sign out of your account on this device. You will need to sign in again to access your workspaces.
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 hover:border-red-300 transition whitespace-nowrap"
                >
                  Sign Out
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
