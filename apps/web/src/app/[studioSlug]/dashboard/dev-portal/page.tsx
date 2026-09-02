"use client";

import Link from "next/link";
import { use } from "react";

export default function StudioDevPortalPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md rounded-2xl border border-border-default bg-white p-8 shadow-xs space-y-4">
        <span className="rounded-full bg-brand-purple-background px-3 py-1 font-mono text-xs font-bold text-brand-purple-primary">
          DEVELOPER DIAGNOSTICS
        </span>
        <h1 className="text-xl font-bold text-text-primary">Studio Internal Portal</h1>
        <p className="text-xs text-text-secondary">
          Architecture verification and diagnostics are consolidated in the central internal Dev Portal.
        </p>
        <div className="pt-2">
          <Link
            href="/devportal"
            className="inline-block rounded-xl bg-brand-purple-primary px-5 py-2.5 text-xs font-bold text-white transition hover:bg-purple-700"
          >
            Open Developer Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}