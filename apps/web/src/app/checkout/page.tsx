import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { CheckoutBuilder } from "@/components/public/CheckoutBuilder";
import Link from "next/link";

export default function PricingCheckoutPage() {
  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      {/* Page Hero */}
      <section className="border-b border-border-divider bg-gradient-to-b from-white to-surface-app px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-brand-orange-soft bg-brand-orange-background px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
            Modular Modules Checkout
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Configure Your Studio Modules
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary">
            Select or adjust your add-on modules. Pay only for what your studio uses with flat monthly rates.
          </p>
        </div>
      </section>

      {/* Builder & Checkout */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading checkout builder...</div>}>
          <CheckoutBuilder />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-divider bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
            <p>© {new Date().getFullYear()} Focoman. All rights reserved.</p>
            <p>Built for professional photography studios.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
