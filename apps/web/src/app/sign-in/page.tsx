"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithGoogle } from "@/lib/firebaseAuth";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";

export default function SignInPage() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Google sign-in failed:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("auth/unauthorized-domain")) {
        const domain = typeof window !== "undefined" ? window.location.hostname : "current domain";
        setAuthError(
          `Domain "${domain}" is not authorized. Please add it in Firebase Console.`
        );
      } else if (errorMessage.includes("auth/popup-closed-by-user") || errorMessage.includes("Cross-Origin-Opener-Policy")) {
        setAuthError(
          "Popups are blocked by this environment. Please open this app in a New Tab to use Google Sign-in."
        );
      } else {
        setAuthError("Popups are blocked in the preview. Please click 'Open App' (top right arrow) to open in a new tab to sign in.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-app text-text-primary selection:bg-brand-blue-soft flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg mb-6 self-start md:self-auto md:w-full">
          <BackButton fallbackHref="/" />
        </div>
        <div className="w-full max-w-lg rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              Operational Access
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Studio Workspace Access
            </h1>
            <p className="mx-auto mt-2 text-sm text-text-secondary">
              Sign in to access your studio operations and team dashboard.
            </p>
          </div>

          <div className="mx-auto mt-8">
            <div className="rounded-2xl border border-border-default bg-gray-50/50 p-6 sm:p-8 text-center">
              <h2 className="text-lg font-bold text-text-primary">
                Sign In to Focoman
              </h2>
              
              {authError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                  {authError}
                </div>
              )}
              
              <div className="mt-6 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="inline-flex w-full justify-center items-center gap-3 rounded-xl border border-border-default bg-white px-6 py-3 text-sm font-bold text-text-primary shadow-xs transition hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
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

                <p className="text-[10px] sm:text-xs text-text-tertiary max-w-xs mt-2">
                  By signing in, you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-text-primary transition">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-text-primary transition">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
