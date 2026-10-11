import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | Focoman",
  description: "Terms and conditions governing the use of the Focoman Studio Operations platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary selection:bg-brand-blue-soft">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackHref="/" />
        </div>

        <div className="rounded-3xl border border-border-default bg-white p-8 shadow-sm sm:p-12">
          <div className="border-b border-border-divider pb-8">
            <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              Legal
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Terms and Conditions
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Last updated: October 2026 • Effective for all Focoman studio workspaces
            </p>
          </div>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-text-secondary">
            <section>
              <h2 className="text-base font-bold text-text-primary">1. Agreement to Terms</h2>
              <p className="mt-2">
                By accessing or using Focoman (operated by ThreadSafe), you agree to be bound by these Terms and Conditions. If you are registering on behalf of a photography studio or organization, you confirm that you have the authority to bind that entity to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">2. Studio Workspaces and Accounts</h2>
              <p className="mt-2">
                You are responsible for maintaining the confidentiality of your workspace login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">3. Service Description and Usage</h2>
              <p className="mt-2">
                Focoman provides business operating tools including order workflows, crew management, shoot scheduling, client tracking portals, and WhatsApp notification automations. You agree to use the service only for lawful business operations and in compliance with all relevant industry regulations.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">4. Subscriptions and Payments</h2>
              <p className="mt-2">
                Paid plans, modules, and add-ons are billed according to the agreed billing cycle. Trial periods provide full feature access without automated charges unless explicitly converted to a paid tier.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">5. Studio Data Ownership</h2>
              <p className="mt-2">
                All client details, shoot schedules, booking financial records, and operational assets uploaded to your workspace remain your property. Focoman does not claim ownership over your studio records.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-text-primary">6. Contact Information</h2>
              <p className="mt-2">
                For questions regarding these Terms, contact our legal and support team at{" "}
                <a href="mailto:support@focoman.com" className="font-semibold text-brand-blue-primary underline">
                  support@focoman.com
                </a>.
              </p>
            </section>
          </div>

          <div className="mt-12 border-t border-border-divider pt-6 flex justify-between items-center text-xs text-text-tertiary">
            <Link href="/privacy" className="underline hover:text-text-primary">
              View Privacy Policy →
            </Link>
            <Link href="/sign-in" className="font-semibold text-brand-blue-primary hover:underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
