"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const { t } = useLanguage();

  return (
    <Link
      href={fallbackHref}
      className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition group"
    >
      <svg
        className="h-4 w-4 transition-transform group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {t("nav.back", "Back")}
    </Link>
  );
}
