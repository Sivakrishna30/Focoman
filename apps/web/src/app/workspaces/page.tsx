"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { subscribeToAuthState, signInWithGoogle, signOutUser } from "@/lib/firebaseAuth";
import { getUserWorkspacesAction } from "@/actions/studioActions";
import { StudioMembership } from "@focoman/types";
import { User } from "firebase/auth";

export default function WorkspacesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [workspaces, setWorkspaces] = useState<StudioMembership[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
      if (user) {
        setLoadingWorkspaces(true);
        // CHG-011: Pass the Firebase ID token (JWT), not the UID — identity is verified server-side.
        const idToken = await user.getIdToken();
        const data = await getUserWorkspacesAction(idToken);
        setWorkspaces(data);
        setLoadingWorkspaces(false);
      } else {
        setWorkspaces([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loadingUser && !currentUser) {
      router.replace("/sign-in");
    }
  }, [loadingUser, currentUser, router]);

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error("Sign-in failed:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (
        errorMessage.includes("auth/unauthorized-domain") ||
        (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "auth/unauthorized-domain")
      ) {
        const domain = typeof window !== "undefined" ? window.location.hostname : "current domain";
        setAuthError(
          `Domain "${domain}" is not authorized in Firebase. Please add "${domain}" to Authorized Domains in Firebase Console (Authentication -> Settings -> Authorized domains).`
        );
      } else {
        setAuthError(errorMessage || "Sign-in failed. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackHref="/dashboard" />
        </div>
        {loadingUser ? (
          <div className="py-20 text-center text-sm text-text-tertiary">
            Checking authentication status...
          </div>
        ) : !currentUser ? (
          /* Unauthenticated State - Now redirects to home */
          <div className="py-20 text-center text-sm text-text-tertiary">
            Redirecting...
          </div>
        ) : (
          /* Authenticated State */
          <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border-divider pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
                  Personal Identity
                </span>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                  Your Studio Workspaces
                </h1>
                <p className="text-xs text-text-secondary">
                  Logged in as <span className="font-semibold text-text-primary">{currentUser.displayName || currentUser.email}</span> ({currentUser.email})
                </p>
              </div>
            </div>

            {loadingWorkspaces ? (
              <div className="py-12 text-center text-xs text-text-tertiary">
                Fetching accessible studio workspaces...
              </div>
            ) : workspaces.length === 0 ? (
              /* State A: 0 Memberships */
              <div className="rounded-3xl border border-border-default bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-background text-brand-orange-primary font-bold text-xl">
                  📸
                </div>
                <h2 className="mt-4 text-xl font-bold text-text-primary">
                  Welcome to Focoman!
                </h2>
                <p className="mx-auto mt-2 max-w-md text-xs text-text-secondary">
                  You are not currently linked to any photography studio workspace. Choose an onboarding option below to get started:
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-lg mx-auto">
                  <Link
                    href="/onboarding/register-studio"
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-brand-orange-primary/30 bg-brand-orange-background/30 p-6 text-center transition hover:border-brand-orange-primary hover:bg-brand-orange-background/60"
                  >
                    <span className="text-sm font-bold text-brand-orange-primary">
                      Register Your Studio
                    </span>
                    <span className="mt-1 text-[11px] text-text-secondary">
                      Establish a new studio workspace as the Owner
                    </span>
                  </Link>

                  <Link
                    href="/onboarding/join-studio"
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-brand-purple-primary/30 bg-brand-purple-background/30 p-6 text-center transition hover:border-brand-purple-primary hover:bg-brand-purple-background/60"
                  >
                    <span className="text-sm font-bold text-brand-purple-primary">
                      Join an Existing Studio
                    </span>
                    <span className="mt-1 text-[11px] text-text-secondary">
                      Accept an invitation from a studio owner
                    </span>
                  </Link>
                </div>

                {/* Sample Demo Workspace Launch for new users */}
                <div className="mt-8 pt-6 border-t border-slate-100 max-w-lg mx-auto">
                  <div className="rounded-2xl border border-dashed border-brand-orange-soft bg-orange-50/50 p-4 text-center">
                    <span className="rounded-full bg-brand-orange-primary px-2 py-0.5 text-[10px] font-extrabold uppercase text-white tracking-wide">
                      Instant Sample Tour
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-slate-900">Want to test drive Focoman first?</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Explore Lumina Studios with preloaded mock orders, workflow tasks, and local browser memory.
                    </p>
                    <Link
                      href="/demo-studio/dashboard"
                      className="mt-3 inline-block rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 shadow-xs"
                    >
                      Explore Demo Workspace →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* State B: Has Memberships */
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {workspaces.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-border-default bg-white p-6 shadow-xs transition hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-text-tertiary">
                            /{m.studioId}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                              m.role === "STUDIO_OWNER"
                                ? "bg-brand-orange-background text-brand-orange-primary"
                                : "bg-brand-purple-background text-brand-purple-primary"
                            }`}
                          >
                            {m.role === "STUDIO_OWNER" ? "Owner" : "Crew Member"}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-bold text-text-primary">
                          {m.studioName || m.studioId}
                        </h3>
                        {m.skills && m.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {m.skills.map((s) => (
                              <span
                                key={s}
                                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-border-divider">
                        <Link
                          href={`/${m.studioId}/dashboard`}
                          className="block text-center rounded-xl bg-brand-blue-primary py-2.5 text-xs font-bold text-white transition hover:bg-sky-600 shadow-xs"
                        >
                          Launch Workspace →
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Sample Demo Workspace Card */}
                  <div className="rounded-2xl border border-dashed border-brand-orange-soft bg-brand-orange-background/20 p-6 shadow-xs transition hover:shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-brand-orange-primary">
                          /demo-studio
                        </span>
                        <span className="rounded-full bg-brand-orange-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                          Demo Sandbox
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-text-primary">
                        Lumina Studios (Demo)
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Explore mock orders, team ERP, CRM clients, and guided tour with browser memory.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-brand-orange-soft/50">
                      <Link
                        href="/demo-studio/dashboard"
                        className="block text-center rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 shadow-xs"
                      >
                        Explore Demo Workspace →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Additional Actions */}
                <div className="rounded-2xl border border-dashed border-border-default bg-surface-app p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">Need another workspace?</h4>
                    <p className="text-xs text-text-secondary">
                      You can register your own studio or accept invitations to join other studios anytime.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href="/onboarding/register-studio"
                      className="rounded-xl border border-brand-orange-primary bg-white px-4 py-2 text-xs font-bold text-brand-orange-primary hover:bg-orange-50 transition"
                    >
                      + Register Studio
                    </Link>
                    <Link
                      href="/onboarding/join-studio"
                      className="rounded-xl border border-brand-purple-primary bg-white px-4 py-2 text-xs font-bold text-brand-purple-primary hover:bg-purple-50 transition"
                    >
                      + Join Studio
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
