"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { subscribeToAuthState } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";

export default function JoinStudioPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success" | "info"; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setFeedback({
        type: "error",
        message: "Please sign in with Google first before activating a studio invitation.",
      });
      return;
    }
    setIsSubmitting(true);
    // In production, verifies token against Firestore /invitations collection
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback({
        type: "info",
        message: `Verifying invitation code "${inviteCode}". If this code matches a pending invite for ${currentUser.email}, your studio membership will be activated automatically.`,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-10">
          <div className="border-b border-border-divider pb-6">
            <span className="inline-block rounded-full bg-brand-purple-background px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-purple-primary">
              Crew Member Onboarding
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Join an Existing Studio
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Enter the single-use invitation code provided by your studio owner. Your Google account will be linked to that studio workspace.
            </p>
          </div>

          {feedback && (
            <div
              className={`mt-6 rounded-xl border p-4 text-xs font-medium ${
                feedback.type === "error"
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-brand-purple-light bg-brand-purple-background text-brand-purple-primary"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-6 space-y-5">
            <div>
              <label htmlFor="invite-code" className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                Invitation Code / Token *
              </label>
              <input
                id="invite-code"
                type="text"
                required
                placeholder="e.g. INV-8821-X9K2"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="mt-1.5 w-full rounded-xl border border-border-default px-4 py-2.5 font-mono text-sm uppercase outline-none focus:border-brand-purple-primary focus:ring-1 focus:ring-brand-purple-primary"
              />
              <p className="mt-1.5 text-xs text-text-tertiary">
                Your studio owner will generate this invitation when assigning you to their studio crew.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-divider">
              <Link href="/workspaces" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-brand-purple-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? "Verifying..." : "Accept Invitation"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
