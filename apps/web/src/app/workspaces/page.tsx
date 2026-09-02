"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {loadingUser ? (
          <div className="py-20 text-center text-sm text-text-tertiary">
            Checking authentication status...
          </div>
        ) : !currentUser ? (
          /* Unauthenticated State */
          <div className="rounded-3xl border border-border-default bg-white p-8 text-center shadow-sm sm:p-12">
            <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              Single Personal Identity
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Sign In to Access Your Studio Workspaces
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
              Focoman uses your Google account as your universal personal identity across all studio ownerships and crew memberships.
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleGoogleSignIn}
                className="inline-flex items-center gap-3 rounded-xl border border-border-default bg-white px-6 py-3 text-sm font-bold text-text-primary shadow-xs transition hover:bg-gray-50 hover:shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
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

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-border-default px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-red-50 hover:text-red-600 transition"
                >
                  Sign Out
                </button>
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
