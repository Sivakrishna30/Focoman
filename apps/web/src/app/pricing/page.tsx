import { Navbar } from "@/components/Navbar";
import { PricingTwoPanels } from "@/components/public/PricingTwoPanels";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      {/* Page Hero */}
      <section className="border-b border-border-divider bg-gradient-to-b from-white to-surface-app px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-brand-orange-soft bg-brand-orange-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
            Flexible Capability Pricing
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Simple &amp; Flexible Studio Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary">
            Basic Order Management is always 100% Free. Selectively add only the CRM, Crew, Marketplace, or WhatsApp capabilities your studio needs—no rigid plans, no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards & Guarantees */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <PricingTwoPanels />

        {/* FAQ Section */}
        <div id="faq" className="space-y-6 pt-8 border-t border-border-divider">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Everything You Need to Know
            </h2>
            <p className="text-sm text-text-secondary">
              Have questions about our free tier, modular capabilities, or billing? Find quick answers below.
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} ThreadSafe Focoman. All rights reserved. | Focus beyond the frames
            </div>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                Features
              </Link>
              <Link href="/pricing" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                Pricing
              </Link>
              <Link href="/about" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                About Us
              </Link>
              <Link href="/#faq" className="text-xs font-semibold text-text-secondary hover:text-text-primary">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
