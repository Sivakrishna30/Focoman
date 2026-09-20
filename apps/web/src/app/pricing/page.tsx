import { Navbar } from "@/components/Navbar";
import { PricingAccordion } from "@/components/public/PricingAccordion";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      {/* Page Hero */}
      <section className="border-b border-border-divider bg-gradient-to-b from-white to-surface-app px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-brand-orange-soft bg-brand-orange-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
            Transparent Studio Plans
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Choose the Right Plan for Your Studio
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
            Every plan includes our core Order Management System. Upgrade as your team grows and your operational pipeline expands.
          </p>
        </div>
      </section>

      {/* Pricing Cards & Guarantees */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PricingAccordion />
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
