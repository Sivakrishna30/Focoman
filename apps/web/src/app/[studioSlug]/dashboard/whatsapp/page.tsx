"use client";

import { useState, use, useEffect } from "react";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";
import { updateStudioWhatsappConfigAction } from "@/actions/studioActions";
import {
  isDemoStudio,
  getDemoWhatsappConfig,
  saveDemoWhatsappConfig,
  subscribeToDemoStore,
} from "@/lib/demoStore";

/**
 * WhatsApp Premium Operational Layer Configuration
 * Primary Source of Truth: Focoman Product Discovery Document
 * Operational convenience layer for Studio Owner, Members, and Customers.
 */

const NOTIFICATION_GROUPS = [
  {
    title: "Studio Owner Alerts (OMS)",
    description: "Lightweight operational notifications sent to Studio Owner for upcoming events and production milestones.",
    badgeClass: "badge-brand-blue",
    badgeLabel: "OMS · Owner Alerts",
    dotClass: "bg-brand-blue-primary",
    switchClass: "bg-brand-blue-primary",
    cardBorder: "border-border-default hover:border-brand-blue-light",
    items: [
      { id: "upcoming_3day", label: "Upcoming Order Reminder (3 days before event)", enabled: true },
      { id: "post_event_start", label: "Post-Event Workflow Started", enabled: true },
      { id: "raw_photos_sent", label: "RAW Photos Marked Sent", enabled: true },
      { id: "customer_selection_done", label: "Customer Selection Completed", enabled: true },
      { id: "album_review_done", label: "Album Review Completed", enabled: true },
      { id: "ready_for_delivery", label: "Ready for Delivery Notification", enabled: true }
    ]
  },
  {
    title: "Studio Member Operational Alerts (ERP)",
    description: "Notifications for planned crew assignments and downstream production task assignments.",
    badgeClass: "badge-brand-purple",
    badgeLabel: "ERP · Crew Operations",
    dotClass: "bg-brand-purple-primary",
    switchClass: "bg-brand-purple-primary",
    cardBorder: "border-border-default hover:border-brand-purple-light",
    items: [
      { id: "assignment_confirm", label: "Planned Order Assignment & Availability Confirmation", enabled: true },
      { id: "task_assigned", label: "Downstream Production Task Assigned", enabled: true }
    ]
  },
  {
    title: "Customer Order Tracking Updates (CRM)",
    description: "Optional updates sent to customer WhatsApp number for milestone transparency and tracking.",
    badgeClass: "badge-brand-orange",
    badgeLabel: "CRM · Customer Relations",
    dotClass: "bg-brand-orange-primary",
    switchClass: "bg-brand-orange-primary",
    cardBorder: "border-border-default hover:border-brand-orange-light",
    items: [
      { id: "customer_post_event", label: "Post-Event Workflow Updates", enabled: true },
      { id: "customer_ready_delivery", label: "Order Ready for Delivery", enabled: true },
      { id: "customer_payment_remind", label: "Payment Status Updates", enabled: true }
    ]
  }
];

export default function WhatsappPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const { studio, idToken, authLoading, getIdToken } = useStudioWorkspace();
  
  const isDemo = isDemoStudio(studioSlug);
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isDemo) {
      const demoCfg = getDemoWhatsappConfig();
      setConfig(demoCfg);
      setMasterEnabled(demoCfg.masterEnabled !== false);
      const unsub = subscribeToDemoStore(() => {
        const updated = getDemoWhatsappConfig();
        setConfig(updated);
        setMasterEnabled(updated.masterEnabled !== false);
      });
      return () => unsub();
    } else if (studio.whatsappConfig) {
      setConfig(studio.whatsappConfig);
      setMasterEnabled(studio.whatsappConfig.masterEnabled !== false);
    }
  }, [studio, isDemo]);

  const toggleItem = (id: string) => {
    setConfig(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const finalConfig = { ...config, masterEnabled };
      if (isDemo) {
        saveDemoWhatsappConfig(finalConfig);
        setStatusMessage("WhatsApp notification configuration updated successfully (saved to browser memory).");
        return;
      }

      const token = idToken || await getIdToken(true);
      if (!token) throw new Error("Authentication required");

      const res = await updateStudioWhatsappConfigAction(studioSlug, finalConfig, token);
      
      if (res.success) {
        setStatusMessage("WhatsApp notification configuration updated successfully.");
      } else {
        setStatusMessage("Failed to update: " + res.error);
      }
    } catch (err: any) {
      setStatusMessage("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return <div className="p-10 text-sm text-text-secondary">Loading workspace...</div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-surface-app p-6 lg:p-10">
      <div className="max-w-3xl space-y-8">
        <header className="header-brand-blue">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="badge-brand-blue">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                  Operational Notifications
                </span>
                <span className="badge-status-success">
                  Central Focoman Bot
                </span>
                <span className="badge-status-neutral">
                  Studio: <strong className="font-semibold text-text-primary">{studioSlug}</strong>
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                WhatsApp Operational Layer
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Automated messaging and interactive operational status actions for Studio Owner, Members, and Customers.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-brand-blue"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </header>

        {/* Master Switch */}
        <div className={`rounded-2xl border p-6 transition ${masterEnabled ? "border-brand-blue-soft bg-brand-blue-background/40 shadow-xs" : "border-border-default bg-white"}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${masterEnabled ? "bg-brand-blue-primary animate-pulse" : "bg-text-tertiary"}`} />
                <h2 className="text-sm font-extrabold text-text-primary">
                  Focoman Bot WhatsApp Automation
                </h2>
              </div>
              <p className="mt-1 text-xs text-text-secondary">
                {masterEnabled
                  ? "Operational alerts and status updates actively routed via central Focoman Bot."
                  : "WhatsApp notifications paused (Core OMS application remains fully operational)."}
              </p>
            </div>
            <button
              onClick={() => setMasterEnabled(!masterEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                masterEnabled ? "bg-brand-blue-primary" : "bg-border-default"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  masterEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Groups */}
        {masterEnabled && (
          <div className="space-y-6">
            {NOTIFICATION_GROUPS.map((group) => (
              <div key={group.title} className={`rounded-2xl border bg-white p-6 shadow-xs transition ${group.cardBorder}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-base font-extrabold text-text-primary">{group.title}</h3>
                  <span className={group.badgeClass}>
                    <span className={`h-1.5 w-1.5 rounded-full ${group.dotClass}`} />
                    {group.badgeLabel}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-4">{group.description}</p>

                <div className="space-y-3 pt-3 border-t border-border-default">
                  {group.items.map((item) => {
                    const isActive = config[item.id] !== false; // Default to true if undefined
                    return (
                      <div key={item.id} className="flex items-center justify-between py-1.5">
                        <span className="text-xs font-semibold text-text-primary">{item.label}</span>
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            isActive ? group.switchClass : "bg-border-default"
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                              isActive ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-brand-blue"
          >
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
          {statusMessage && (
            <span className={statusMessage.includes("Error") || statusMessage.includes("Failed") ? "badge-status-error" : "badge-status-success"}>
              {statusMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
