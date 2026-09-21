import React from "react";

export function ValueAddedServices() {
  return (
    <section
      id="value-added-services"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border-divider"
    >
      <div className="mx-auto max-w-3xl text-center mb-12">
        <span
          id="vas-badge"
          className="inline-block rounded-full bg-brand-orange-background px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange-primary border border-brand-orange-soft"
        >
          Value-added services
        </span>
        <h2
          id="vas-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
        >
          Studio Setup &amp; Creative Add-ons
        </h2>
        <p
          id="vas-subtitle"
          className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed"
        >
          Optional creative design and onboarding assistance to help set up and elevate your studio operations with a minimal one-time charge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
        {/* Service 1: Branding & Website */}
        <div
          id="vas-card-branding-website"
          className="relative rounded-2xl border border-border-default bg-white p-6 sm:p-8 shadow-xs transition hover:border-brand-blue-primary/40 hover:shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-background text-brand-blue-primary border border-brand-blue-soft">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-mono text-xs font-bold text-text-tertiary">01</span>
            </div>

            <h3
              id="vas-title-branding-website"
              className="text-lg sm:text-xl font-bold text-text-primary"
            >
              Branding &amp; Website
            </h3>

            <ul className="mt-5 space-y-3">
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg
                    className="h-2.5 w-2.5"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                  >
                    <path d="M10.28 2.28a.75.75 0 00-1.06 0L4.5 7.001 2.78 5.281a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25a.75.75 0 000-1.06z" />
                  </svg>
                </span>
                <span className="font-medium text-text-primary">Logo creation</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg
                    className="h-2.5 w-2.5"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                  >
                    <path d="M10.28 2.28a.75.75 0 00-1.06 0L4.5 7.001 2.78 5.281a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25a.75.75 0 000-1.06z" />
                  </svg>
                </span>
                <span className="font-medium text-text-primary">Website / portfolio creation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Service 2: Data Migration */}
        <div
          id="vas-card-data-migration"
          className="relative rounded-2xl border border-border-default bg-white p-6 sm:p-8 shadow-xs transition hover:border-brand-orange-primary/40 hover:shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange-background text-brand-orange-primary border border-brand-orange-soft">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
              <span className="font-mono text-xs font-bold text-text-tertiary">02</span>
            </div>

            <h3
              id="vas-title-data-migration"
              className="text-lg sm:text-xl font-bold text-text-primary"
            >
              Data Migration
            </h3>

            <ul className="mt-5 space-y-3">
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg
                    className="h-2.5 w-2.5"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                  >
                    <path d="M10.28 2.28a.75.75 0 00-1.06 0L4.5 7.001 2.78 5.281a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25a.75.75 0 000-1.06z" />
                  </svg>
                </span>
                <span className="font-medium text-text-primary">
                  Migrate existing studio data into Focoman
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
