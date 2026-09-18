"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  // 3-step intentional cycle: En -> Tha (ta_easy) -> Tha/En (thanglish) -> En
  const handleCycleLanguage = () => {
    if (language === "en") {
      setLanguage("ta_easy");
    } else if (language === "ta_easy" || language === "ta_pure") {
      setLanguage("thanglish");
    } else {
      setLanguage("en");
    }
  };

  const getBadgeDetails = () => {
    switch (language) {
      case "ta_easy":
      case "ta_pure":
        return {
          badge: "த",
          title: "Current: Tamil (த) • Click to switch to Tanglish (த/En)",
          ariaLabel: "Language selector, currently Tamil",
          activeClass: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
        };
      case "thanglish":
        return {
          badge: "த/En",
          title: "Current: Tanglish (த/En) • Click to switch to English (En)",
          ariaLabel: "Language selector, currently Tanglish",
          activeClass: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
        };
      case "en":
      default:
        return {
          badge: "En",
          title: "Current: English (En) • Click to switch to Tamil (த)",
          ariaLabel: "Language selector, currently English",
          activeClass: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        };
    }
  };

  const current = getBadgeDetails();

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={handleCycleLanguage}
      title={current.title}
      aria-label={current.ariaLabel}
      className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-bold transition hover:opacity-90 active:scale-95 cursor-pointer shadow-2xs shrink-0 select-none ${current.activeClass} ${className}`}
    >
      <span className="font-extrabold tracking-tight">{current.badge}</span>
    </button>
  );
}


