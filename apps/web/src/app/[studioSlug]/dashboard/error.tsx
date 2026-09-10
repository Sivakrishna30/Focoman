"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-full items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-900">Dashboard View Error</h2>
        <p className="mt-2 text-xs text-slate-500">
          {error.message || "An unexpected error occurred while loading this dashboard view."}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-brand-blue-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-600"
          >
            Try Again
          </button>
          <Link
            href="/workspaces"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Switch Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
