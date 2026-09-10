"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { setDemoTourSeen } from "@/lib/demoStore";

interface WorkspaceTourProps {
  isOpen: boolean;
  onClose: () => void;
  studioName: string;
}

interface TourStep {
  id: string;
  targetId: string;
  fallbackTargetId?: string;
  badge: string;
  actionPrompt: string;
  title: string;
  description: string;
  preferredPosition: "bottom" | "top" | "right" | "left";
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "switch-workspace",
    targetId: "tour-switch-workspace",
    fallbackTargetId: "tour-sidebar-switch",
    badge: "Step 1 of 5 · Navigation",
    actionPrompt: "👉 Click here: Switch Workspace",
    title: "Switch Studio Workspace",
    description:
      "Click here anytime to switch between different studio workspaces or return to your account's workspace directory.",
    preferredPosition: "bottom",
  },
  {
    id: "persona-switcher",
    targetId: "tour-persona-switcher",
    badge: "Step 2 of 5 · Roles & Access",
    actionPrompt: "👉 Click here: Switch Roles",
    title: "Studio Owner vs. Crew Experience",
    description:
      "You're currently in the Studio Owner view (Arjun) with full financials. Click here to switch to Rohan (Editor) to see how crew only access assigned tasks.",
    preferredPosition: "bottom",
  },
  {
    id: "nav-oms",
    targetId: "tour-nav-oms",
    fallbackTargetId: "tour-quick-oms",
    badge: "Step 3 of 5 · Core OMS",
    actionPrompt: "👉 Open here: Order Pipeline",
    title: "Order Management (OMS)",
    description:
      "Click here to see shoots moving through Awaiting Event → Post-Event In Progress → Completed, with task assignments and passkeys.",
    preferredPosition: "right",
  },
  {
    id: "nav-crm",
    targetId: "tour-nav-crm",
    fallbackTargetId: "tour-nav-erp",
    badge: "Step 4 of 5 · Business Operations",
    actionPrompt: "👉 See this: Clients & Team Allocation",
    title: "Customer CRM & Crew ERP",
    description:
      "Click here to view client booking histories, track lifetime revenue, and assign photographers and retouchers based on shoot date availability.",
    preferredPosition: "right",
  },
  {
    id: "reset-defaults",
    targetId: "tour-reset-defaults",
    badge: "Step 5 of 5 · Live Sandbox",
    actionPrompt: "👉 Click here: Reset Anytime",
    title: "Browser Memory & Reset",
    description:
      "All your edits, new orders, and status updates persist safely in your browser memory. Click 'Reset Defaults' anytime to restore default seed data.",
    preferredPosition: "bottom",
  },
];

export function WorkspaceTour({ isOpen, onClose, studioName: _studioName }: WorkspaceTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetFound, setTargetFound] = useState(true);
  const blurbRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStep];

  // Update target rect on step change, window resize, or scroll
  const updateTargetPosition = useCallback(() => {
    if (!isOpen) return;
    const target =
      document.getElementById(step.targetId) ||
      (step.fallbackTargetId ? document.getElementById(step.fallbackTargetId) : null);

    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);
      setTargetFound(true);
    } else {
      setTargetRect(null);
      setTargetFound(false);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) return;

    // Smoothly scroll target element into view if needed
    const target =
      document.getElementById(step.targetId) ||
      (step.fallbackTargetId ? document.getElementById(step.fallbackTargetId) : null);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Measure immediately and after brief layout shift
    updateTargetPosition();
    const timer = setTimeout(updateTargetPosition, 100);

    const handleWindowEvents = () => updateTargetPosition();
    window.addEventListener("resize", handleWindowEvents);
    window.addEventListener("scroll", handleWindowEvents, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleWindowEvents);
      window.removeEventListener("scroll", handleWindowEvents, true);
    };
  }, [isOpen, step, updateTargetPosition]);

  const handleFinish = useCallback(() => {
    setDemoTourSeen(true);
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  }, [currentStep, handleFinish]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleFinish();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleFinish, handleNext, handlePrev]);

  if (!isOpen) return null;

  // Calculate blurb position coordinates based on target rect and preferred direction
  let blurbStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 50,
  };

  const blurbWidth = 340;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  if (targetRect && !isMobile) {
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceRight = window.innerWidth - targetRect.right;

    if (step.preferredPosition === "right" && spaceRight > blurbWidth + 24) {
      blurbStyle = {
        position: "fixed",
        top: Math.max(16, Math.min(window.innerHeight - 260, targetRect.top - 8)),
        left: targetRect.right + 14,
        zIndex: 50,
      };
    } else if (spaceBelow > 220 || step.preferredPosition === "bottom") {
      blurbStyle = {
        position: "fixed",
        top: Math.min(window.innerHeight - 240, targetRect.bottom + 12),
        left: Math.max(16, Math.min(window.innerWidth - blurbWidth - 16, targetRect.left + (targetRect.width / 2) - (blurbWidth / 2))),
        zIndex: 50,
      };
    } else {
      // Fallback above target
      blurbStyle = {
        position: "fixed",
        bottom: window.innerHeight - targetRect.top + 12,
        left: Math.max(16, Math.min(window.innerWidth - blurbWidth - 16, targetRect.left + (targetRect.width / 2) - (blurbWidth / 2))),
        zIndex: 50,
      };
    }
  } else {
    // Default floating position if target not in DOM or on mobile
    blurbStyle = {
      position: "fixed",
      bottom: 24,
      right: isMobile ? 16 : 24,
      left: isMobile ? 16 : "auto",
      maxWidth: isMobile ? "calc(100vw - 32px)" : `${blurbWidth}px`,
      zIndex: 50,
    };
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 1. Spotlight Outline Beacon on Target Element */}
      {targetRect && (
        <div
          className="fixed pointer-events-none z-40 rounded-xl ring-2 ring-brand-orange-primary ring-offset-2 ring-offset-white shadow-md shadow-brand-orange-primary/30 transition-all duration-200 animate-pulse"
          style={{
            top: targetRect.top - 3,
            left: targetRect.left - 3,
            width: targetRect.width + 6,
            height: targetRect.height + 6,
          }}
        />
      )}

      {/* 2. Interactive Overlay Blurb (Small Popup Window) */}
      <div
        ref={blurbRef}
        style={blurbStyle}
        className="pointer-events-auto w-full max-w-[340px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-200 animate-fade-in"
      >
        {/* Blurb Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="rounded-full bg-brand-orange-primary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shrink-0">
              {step.badge}
            </span>
            {!targetFound && (
              <span className="text-[10px] text-amber-600 font-medium truncate">
                (Menu collapsed)
              </span>
            )}
          </div>
          <button
            onClick={handleFinish}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            title="Close guide blurbs"
            aria-label="Close guide"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Prompt & Title */}
        <div className="mt-3">
          <span className="inline-block text-[11px] font-bold text-brand-orange-primary bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60 mb-1">
            {step.actionPrompt}
          </span>
          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
            {step.title}
          </h4>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Blurb Footer with Step Controls */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          {/* Step dots */}
          <div className="flex items-center gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-4 bg-brand-orange-primary"
                    : "w-1.5 bg-slate-200 hover:bg-slate-300"
                }`}
                title={`Go to tip ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-bold text-white transition hover:bg-slate-800 shadow-2xs"
            >
              {currentStep === TOUR_STEPS.length - 1 ? "Got It ✓" : "Next Tip →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
