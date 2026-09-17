"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { subscribeToAuthState, signInWithGoogle, getCurrentUserIdToken } from "@/lib/firebaseAuth";
import { acceptInvitationAction } from "@/actions/memberActions";
import { User } from "firebase/auth";

function JoinStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || searchParams.get("token") || "";

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [inviteCode, setInviteCode] = useState(initialCode.toUpperCase());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success" | "info"; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setFeedback(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setFeedback({
        type: "error",
        message: err.message || "Failed to sign in with Google.",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentUser) {
      setFeedback({
        type: "error",
        message: "Please sign in with your Google account first to link your membership.",
      });
      return;
    }

    if (!inviteCode || inviteCode.trim().length < 5) {
      setFeedback({
        type: "error",
        message: "Please enter a valid invitation code.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const idToken = await getCurrentUserIdToken(true);
      if (!idToken) {
        throw new Error("Unable to retrieve authentication credentials. Please re-sign in.");
      }

      const res = await acceptInvitationAction({
        inviteCode: inviteCode.trim(),
        idToken,
      });

      if (!res.success) {
        setFeedback({
          type: "error",
          message: res.error || "Failed to activate studio invitation.",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: `Welcome aboard! You have joined "${res.studioName || res.studioId}". Redirecting to your dashboard...`,
      });

      setTimeout(() => {
        router.push(`/${res.studioId}/dashboard`);
      }, 1500);
    } catch (err: any) {
      console.error("[JoinStudioPage] Error:", err);
      setFeedback({
        type: "error",
        message: err.message || "An unexpected error occurred while verifying the invitation.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              : feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-brand-purple-light bg-brand-purple-background text-brand-purple-primary"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {!currentUser && (
        <div className="mt-6 rounded-2xl border border-dashed border-border-default bg-surface-app p-5 text-center">
          <p className="text-xs text-text-secondary">
            You must authenticate with your personal Google account to link your crew membership.
          </p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-text-primary shadow-xs border border-border-default hover:bg-slate-50 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {isSigningIn ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      )}

      {currentUser && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-text-secondary border border-border-default">
          <span>
            Signed in as: <strong className="text-text-primary">{currentUser.email}</strong>
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            Authenticated
          </span>
        </div>
      )}

      <form onSubmit={handleVerify} className="mt-6 space-y-5" suppressHydrationWarning>
        <div>
          <label htmlFor="invite-code" className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
            Invitation Code / Token *
          </label>
          <input
            id="invite-code"
            type="text"
            required
            placeholder="e.g. INV-A92B-4F8C"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className="mt-1.5 w-full rounded-xl border border-border-default px-4 py-2.5 font-mono text-sm uppercase outline-none focus:border-brand-purple-primary focus:ring-1 focus:ring-brand-purple-primary"
          />
          <p className="mt-1.5 text-xs text-text-tertiary">
            Your studio owner generated this invitation code when adding you to their studio team.
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-border-divider">
          <Link href="/workspaces" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !currentUser}
            className="rounded-xl bg-brand-purple-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50"
          >
            {isSubmitting ? "Activating Membership..." : "Verify & Join Studio"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function JoinStudioPage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackHref="/workspaces" />
        </div>
        <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading invitation...</div>}>
          <JoinStudioContent />
        </Suspense>
      </main>
    </div>
  );
}

