"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getDemoActiveUser,
  setDemoActiveUser,
  resetDemoData,
  subscribeToDemoStore,
  getDemoTourSeen,
} from "@/lib/demoStore";
import { DEMO_USER_PERSONAS, DemoUserPersona } from "@/lib/demoData";
import { WorkspaceTour } from "@/components/WorkspaceTour";

interface DemoBannerProps {
  studioSlug: string;
}

export function DemoBanner({ studioSlug }: DemoBannerProps) {
  const [activeUser, setActiveUser] = useState<DemoUserPersona | null>(null);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  useEffect(() => {
    setActiveUser(getDemoActiveUser());
    const unsub = subscribeToDemoStore(() => {
      setActiveUser(getDemoActiveUser());
    });

    if (!getDemoTourSeen()) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 500);
      return () => {
        unsub();
        clearTimeout(timer);
      };
    }

    return () => unsub();
  }, []);

  const handleReset = () => {
    if (confirm("Reset demo data back to default database seed? Any changes made in your browser will be cleared.")) {
      resetDemoData();
      setResetFeedback("Demo data successfully restored to default database!");
      setTimeout(() => setResetFeedback(null), 4000);
    }
  };

  const handleSelectPersona = (p: DemoUserPersona) => {
    setDemoActiveUser(p);
    setShowPersonaMenu(false);
  };

  return (
    <>
      <div className="border-b border-brand-blue-soft bg-gradient-to-r from-brand-blue-background/90 via-white to-brand-orange-background/50 px-4 py-2 text-xs text-text-primary shadow-xs">
        <div className="mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between max-w-7xl">
          {/* Left: Indicator & explanation */}
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Demo Mode
            </span>
            <span className="text-text-secondary font-medium hidden md:inline">
              Exploring <strong className="text-text-primary">Lumina Creative Studio</strong>. Edits persist in your browser memory.
            </span>
            <span className="text-text-secondary font-medium md:hidden">
              Edits saved in browser memory.
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {resetFeedback && (
              <span className="text-[11px] font-bold text-emerald-600 animate-fade-in">
                ✓ {resetFeedback}
              </span>
            )}

            {/* Persona Switcher */}
            <div className="relative">
              <button
                id="tour-persona-switcher"
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border-default bg-white px-2.5 py-1 text-[11px] font-semibold text-text-primary shadow-xs transition hover:bg-slate-50"
                title="Switch demo user persona"
              >
                <span className="h-2 w-2 rounded-full bg-brand-orange-primary" />
                <span className="max-w-[120px] truncate">
                  {activeUser ? activeUser.name : "Arjun Sharma"}
                </span>
                <span className="text-[10px] text-text-tertiary">
                  ({activeUser?.role === "STUDIO_OWNER" ? "Owner" : "Crew"})
                </span>
                <svg className="h-3.5 w-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-2xl border border-border-default bg-white p-2 shadow-xl z-50">
                  <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                    Test As Demo Role:
                  </p>
                  <div className="space-y-1 mt-1">
                    {DEMO_USER_PERSONAS.map((p) => (
                      <button
                        key={p.uid}
                        onClick={() => handleSelectPersona(p)}
                        className={`w-full text-left rounded-xl px-2.5 py-2 text-xs transition flex items-center justify-between ${
                          activeUser?.uid === p.uid
                            ? "bg-brand-blue-background text-brand-blue-primary font-bold"
                            : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-text-primary">{p.name}</p>
                          <p className="text-[10px] text-text-tertiary">{p.title}</p>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-text-tertiary">
                          {p.role === "STUDIO_OWNER" ? "Owner" : "Crew"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tour Button */}
            <button
              id="tour-guide-toggle"
              onClick={() => setShowTour(!showTour)}
              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-bold shadow-xs transition ${
                showTour
                  ? "border-brand-blue-primary bg-brand-blue-primary text-white shadow-xs"
                  : "border-brand-blue-soft bg-white text-brand-blue-primary hover:bg-brand-blue-background"
              }`}
            >
              <span>🧭</span>
              <span>{showTour ? "Hide Tour" : "Guide Tour"}</span>
            </button>

            {/* Switch Workspace */}
            <Link
              id="tour-switch-workspace"
              href="/workspaces"
              className="inline-flex items-center gap-1 rounded-xl border border-border-default bg-white px-2.5 py-1 text-[11px] font-semibold text-text-secondary shadow-xs transition hover:bg-slate-50 hover:text-text-primary"
              title="Switch to another workspace"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Switch Workspace</span>
            </Link>

            {/* Reset Button */}
            <button
              id="tour-reset-defaults"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-xl border border-border-default bg-white px-2.5 py-1 text-[11px] font-semibold text-text-secondary shadow-xs transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              title="Reset to default seed data"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      <WorkspaceTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        studioName="Lumina Creative Studio"
      />
    </>
  );
}
