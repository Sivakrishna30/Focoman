import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Focoman",
  description: "Privacy policy describing how Focoman handles studio records, authentication, and client data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary selection:bg-brand-blue-soft">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackHref="/" />
        </div>

        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="border-b border-border-divider pb-8">
            <span className="inline-block rounded-full bg-brand-orange-background px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
              Privacy
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Last updated: October 2026 • Effective for all Focoman studio workspaces
            </p>
          </div>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-text-secondary">
            <section>
              <h2 className="text-base font-bold text-text-primary">1. Information We Collect</h2>
              <p className="mt-2">
                We collect information necessary to deliver studio management features. This includes:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Account profile information (such as Google profile name and email address used for sign-in).</li>
                <li>Studio business details (studio name, branch locations, contact numbers).</li>
                <li>Operational records (order bookings, shoot dates, crew assignments, delivery stages).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">2. How We Use Your Information</h2>
              <p className="mt-2">
                Your data is used solely to provide and improve your Focoman experience, including:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Authenticating and managing studio workspace access.</li>
                <li>Processing shoot workflows and sending automated order tracking updates to clients.</li>
                <li>Dispatching operational reminders and crew call-sheet alerts via WhatsApp or email.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">3. Data Security and Isolation</h2>
              <p className="mt-2">
                We utilize strict multi-tenant access control and end-to-end enterprise authentication protocols. Client shoot files, guest links, and order records are partitioned strictly within your studio’s private workspace.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">4. Third-Party Integrations</h2>
              <p className="mt-2">
                When using optional integrations (such as Google Authentication or WhatsApp Business API), data is processed in accordance with the security standards and privacy terms of those respective providers.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">5. Contact Us</h2>
              <p className="mt-2">
                If you have inquiries or privacy requests regarding your stored studio records, please email us at{" "}
                <a href="mailto:support@focoman.com" className="font-semibold text-brand-orange-primary underline">
                  support@focoman.com
                </a>.
              </p>
            </section>
          </div>

          <div className="mt-12 border-t border-border-divider pt-6 flex justify-between items-center text-xs text-text-tertiary">
            <Link href="/terms" className="underline hover:text-text-primary">
              View Terms and Conditions →
            </Link>
            <Link href="/sign-in" className="font-semibold text-brand-orange-primary hover:underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
