"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const { theme, cycleTheme } = useTheme();

  const getThemeDetails = () => {
    switch (theme) {
      case "dark":
        return {
          icon: "🌙",
          title: "Current: Dark Theme • Click for Light Theme",
          ariaLabel: "Switch theme, currently Dark",
          badgeClass: "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700",
        };
      case "light":
      default:
        return {
          icon: "☀️",
          title: "Current: Light Theme • Click for Dark Theme",
          ariaLabel: "Switch theme, currently Light",
          badgeClass: "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200",
        };
    }
  };

  const current = getThemeDetails();

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={cycleTheme}
      title={current.title}
      aria-label={current.ariaLabel}
      className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-bold transition hover:opacity-90 active:scale-95 cursor-pointer shadow-2xs shrink-0 select-none ${current.badgeClass} ${className}`}
    >
      <span className="font-extrabold tracking-tight">{current.icon}</span>
    </button>
  );
}

