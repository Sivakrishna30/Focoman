"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { subscribeToAuthState, getCurrentUserIdToken } from "@/lib/firebaseAuth";
import { registerStudioAction, checkStudioSlugAvailabilityAction } from "@/actions/studioActions";
import { User } from "firebase/auth";

export default function RegisterStudioPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [form, setForm] = useState({
    name: "",
    city: "",
    website: "",
    instagram: "",
  });

  const [slugPreview, setSlugPreview] = useState("");
  const [availability, setAvailability] = useState<{ checked: boolean; available: boolean; message?: string }>({
    checked: false,
    available: true,
  });

  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({ ...prev, name }));
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSlugPreview(slug);
    setAvailability({ checked: false, available: true });
  };

  const handleCheckAvailability = async () => {
    if (!slugPreview || slugPreview.length < 3) {
      setAvailability({ checked: true, available: false, message: "Name must be at least 3 characters." });
      return;
    }
    setIsChecking(true);
    const res = await checkStudioSlugAvailabilityAction(slugPreview);
    setIsChecking(false);
    setAvailability({ checked: true, available: res.available, message: res.message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage("Please sign in with Google first before registering a studio.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    // CHG-010: Get a fresh ID token — UID and profile are verified server-side from the token.
    const idToken = await getCurrentUserIdToken(true);
    if (!idToken) {
      setErrorMessage("Authentication error. Please sign in again.");
      setIsSubmitting(false);
      return;
    }

    const res = await registerStudioAction({
      name: form.name,
      city: form.city,
      website: form.website || undefined,
      instagram: form.instagram || undefined,
      idToken,
    });

    setIsSubmitting(false);

    if (res.success && res.studio) {
      router.push(`/${res.studio.id}/dashboard`);
    } else {
      setErrorMessage(res.error || "Failed to register studio. Please choose another name.");
    }
  };

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-10">
          <div className="border-b border-border-divider pb-6">
            <span className="inline-block rounded-full bg-brand-orange-background px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
              Studio Owner Setup
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Register Your Studio
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Set up your photography business workspace. Your Google account will become the authenticated Studio Owner.
            </p>
          </div>

          {!loadingUser && !currentUser && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
              Note: You are not currently signed in with Google. You can fill in the details below, but will need to sign in with Google to complete registration.
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="studio-name" className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                Studio Name *
              </label>
              <input
                id="studio-name"
                type="text"
                required
                placeholder="e.g. Luminary Wedding Films"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border-default px-4 py-2.5 text-sm outline-none focus:border-brand-orange-primary focus:ring-1 focus:ring-brand-orange-primary"
              />
              {slugPreview && (
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-text-tertiary">
                    Studio Identifier: <code className="font-mono text-brand-orange-primary font-semibold">/{slugPreview}</code>
                  </span>
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={isChecking}
                    className="font-semibold text-brand-blue-primary hover:underline"
                  >
                    {isChecking ? "Checking database..." : "Check availability"}
                  </button>
                </div>
              )}
              {availability.checked && (
                <p className={`mt-1 text-xs font-semibold ${availability.available ? "text-emerald-600" : "text-red-600"}`}>
                  {availability.available ? "✓ Identifier is available!" : availability.message || "Identifier already in use."}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="studio-city" className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                City / Primary Location *
              </label>
              <input
                id="studio-city"
                type="text"
                required
                placeholder="e.g. Chennai, Tamil Nadu"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border-default px-4 py-2.5 text-sm outline-none focus:border-brand-orange-primary focus:ring-1 focus:ring-brand-orange-primary"
              />
            </div>

            <div>
              <label htmlFor="studio-website" className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                Website (Optional)
              </label>
              <input
                id="studio-website"
                type="url"
                placeholder="https://luminaryweddings.com"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border-default px-4 py-2.5 text-sm outline-none focus:border-brand-orange-primary focus:ring-1 focus:ring-brand-orange-primary"
              />
            </div>

            <div>
              <label htmlFor="studio-instagram" className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                Instagram / Social Handle (Optional)
              </label>
              <input
                id="studio-instagram"
                type="text"
                placeholder="@luminaryweddings"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border-default px-4 py-2.5 text-sm outline-none focus:border-brand-orange-primary focus:ring-1 focus:ring-brand-orange-primary"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-divider">
              <Link href="/workspaces" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || (availability.checked && !availability.available)}
                className="rounded-xl bg-brand-orange-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
              >
                {isSubmitting ? "Creating Workspace..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
