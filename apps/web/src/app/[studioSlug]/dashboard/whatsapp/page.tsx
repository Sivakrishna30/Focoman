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
    title: "Studio Owner Alerts",
    description: "Lightweight operational notifications sent to Studio Owner",
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
    title: "Studio Member Operational Alerts",
    description: "Notifications for planned resource assignments & assigned tasks",
    items: [
      { id: "assignment_confirm", label: "Planned Order Assignment & Availability Confirmation", enabled: true },
      { id: "task_assigned", label: "Downstream Production Task Assigned", enabled: true }
    ]
  },
  {
    title: "Customer Order Tracking Updates (Optional)",
    description: "Optional updates sent to customer WhatsApp number if provided",
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
    <div className="h-full overflow-y-auto bg-slate-50 p-6 lg:p-10">
      <div className="max-w-3xl space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800">
              PREMIUM CAPABILITY
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
            WhatsApp Operational Layer — {studioSlug}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Focoman Bot handles lightweight notifications and operational status actions for Studio Owner, Members, and Customers.
          </p>
        </div>

        {/* Master Switch */}
        <div className={`rounded-2xl border p-6 transition ${masterEnabled ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Focoman Bot WhatsApp Integration
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {masterEnabled
                  ? "Operational alerts and status checks active via central Focoman Bot"
                  : "WhatsApp notifications disabled (Core OMS application remains fully operational)"}
              </p>
            </div>
            <button
              onClick={() => setMasterEnabled(!masterEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                masterEnabled ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
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
              <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900">{group.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{group.description}</p>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {group.items.map((item) => {
                    const isActive = config[item.id] !== false; // Default to true if undefined
                    return (
                      <div key={item.id} className="flex items-center justify-between py-1">
                        <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            isActive ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${
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

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
          {statusMessage && (
            <span className={`text-xs font-bold ${statusMessage.includes("Error") || statusMessage.includes("Failed") ? "text-red-600" : "text-emerald-600"}`}>
              {statusMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
