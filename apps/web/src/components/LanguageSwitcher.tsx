"use client";

import React from "react";
import { useLanguage, LanguageMode } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  // 3-step simple cycle: Full Tamil (ta_pure) -> Tamil + English (ta_easy) -> Full English (en)
  const handleCycleLanguage = () => {
    if (language === "en") {
      setLanguage("ta_pure");
    } else if (language === "ta_pure") {
      setLanguage("ta_easy");
    } else {
      setLanguage("en");
    }
  };

  const getButtonContent = () => {
    switch (language) {
      case "ta_pure":
        return {
          label: "Tha",
          fullTitle: "Full Tamil (Tha)",
          next: "Tha/En",
          badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "ta_easy":
        return {
          label: "Tha/En",
          fullTitle: "Tamil with English terms (Tha/En)",
          next: "En",
          badgeClass: "bg-brand-blue-50 text-brand-blue-primary border-brand-blue-200",
        };
      case "en":
      default:
        return {
          label: "En",
          fullTitle: "English (En)",
          next: "Tha",
          badgeClass: "bg-slate-50 text-text-primary border-border-default",
        };
    }
  };

  const current = getButtonContent();

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={handleCycleLanguage}
      title={`Current: ${current.fullTitle} • Click to switch to ${current.next}`}
      aria-label={`Change language, current is ${current.fullTitle}`}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-bold transition hover:opacity-90 active:scale-95 cursor-pointer shadow-2xs shrink-0 ${current.badgeClass} ${className}`}
    >
      <span className="text-[11px] sm:text-xs">🌐</span>
      <span className="font-extrabold tracking-tight">{current.label}</span>
      <span className="text-[9px] opacity-60">⇄</span>
    </button>
  );
}


