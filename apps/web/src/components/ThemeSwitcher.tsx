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
          label: "Dark",
          next: "Monochrome (Mono)",
          badgeClass: "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700",
        };
      case "monochrome":
        return {
          icon: "🎞️",
          label: "Mono",
          next: "Light",
          badgeClass: "bg-zinc-900 text-zinc-100 border-zinc-700 hover:bg-zinc-800",
        };
      case "light":
      default:
        return {
          icon: "☀️",
          label: "Light",
          next: "Dark",
          badgeClass: "bg-slate-50 text-text-primary border-border-default hover:bg-slate-100",
        };
    }
  };

  const current = getThemeDetails();

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={cycleTheme}
      title={`Current: ${current.label} Theme • Click for ${current.next}`}
      aria-label={`Toggle theme, current is ${current.label}`}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs shrink-0 ${current.badgeClass} ${className}`}
    >
      <span className="text-[11px] sm:text-xs">{current.icon}</span>
      <span className="font-extrabold tracking-tight">{current.label}</span>
    </button>
  );
}
