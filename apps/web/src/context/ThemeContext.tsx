"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "monochrome";

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("focoman_theme") as ThemeMode | null;
      if (saved && (saved === "light" || saved === "dark" || saved === "monochrome")) {
        setThemeState(saved);
        applyThemeClass(saved);
      } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          // Default to light unless user explicitly chose, or match preference
          setThemeState("light");
          applyThemeClass("light");
        }
      }
    } catch {
      // Ignore localStorage errors in restricted contexts
    }
    setMounted(true);
  }, []);

  const applyThemeClass = (targetTheme: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove("dark", "monochrome", "light");
    root.setAttribute("data-theme", targetTheme);
    if (targetTheme === "dark") {
      root.classList.add("dark");
    } else if (targetTheme === "monochrome") {
      root.classList.add("monochrome");
    } else {
      root.classList.add("light");
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyThemeClass(newTheme);
    try {
      localStorage.setItem("focoman_theme", newTheme);
    } catch {
      // Ignore
    }
  };

  const cycleTheme = () => {
    let nextTheme: ThemeMode = "dark";
    if (theme === "light") nextTheme = "dark";
    else if (theme === "dark") nextTheme = "monochrome";
    else nextTheme = "light";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as ThemeMode,
      setTheme: () => {},
      cycleTheme: () => {},
    };
  }
  return context;
}
