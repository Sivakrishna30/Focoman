"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark";

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
      if (saved && (saved === "light" || saved === "dark")) {
        setThemeState(saved);
        applyThemeClass(saved);
      } else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setThemeState("light");
        applyThemeClass("light");
      }
    } catch {
      // Ignore localStorage errors in restricted contexts
    }
    setMounted(true);
  }, []);

  const applyThemeClass = (targetTheme: ThemeMode) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("dark", "light", "monochrome");
    root.setAttribute("data-theme", targetTheme);
    if (targetTheme === "dark") {
      root.classList.add("dark");
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
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";
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
