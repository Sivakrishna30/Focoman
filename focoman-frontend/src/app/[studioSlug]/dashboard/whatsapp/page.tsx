"use client";

import { useState, use } from "react";
import { getStudioBySlug, DEFAULT_WHATSAPP_SETTINGS, WhatsAppSettings } from "@/services/mockDb";
import { notFound } from "next/navigation";

const NOTIFICATION_CONFIG = [
  {
    group: "Lead & Booking",
    color: "brand-blue",
    items: [
      { key: "newLead", label: "New Lead Received", desc: "Alert when a new enquiry is logged in the system" },
      { key: "bookingConfirmed", label: "Booking Confirmed", desc: "Notify when a lead converts to a confirmed booking" },
      { key: "advanceReceived", label: "Advance Payment Received", desc: "Alert when advance payment is recorded" },
    ],
  },
  {
    group: "Shoot Day",
    color: "brand-orange",
    items: [
      { key: "shootReminder24h", label: "Shoot Day Reminder (24 hrs)", desc: "Auto-send reminder to client 24 hours before shoot" },
      { key: "shootCompleted", label: "Shoot Marked as Completed", desc: "Notify when shoot is marked done in the system" },
      { key: "editingStarted", label: "Editing Started", desc: "Alert client when editing phase begins" },
    ],
  },
  {
    group: "Delivery & Approval",
    color: "green",
    items: [
      { key: "clientPreviewReady", label: "Client Preview Ready", desc: "Notify client when photos/video are ready for review" },
      { key: "albumApproved", label: "Album Approved by Client", desc: "Alert team when client approves the album design" },
      { key: "deliveryReady", label: "Final Delivery Ready", desc: "Notify client when gallery/album is ready for pickup" },
    ],
  },
  {
    group: "Payments",
    color: "amber",
    items: [
      { key: "paymentDue", label: "Balance Payment Due", desc: "Send reminder when balance payment deadline is near" },
    ],
  },
  {
    group: "Client Delight",
    color: "brand-purple",
    items: [
      { key: "birthdayWish", label: "Birthday Wishes", desc: "Auto-send wishes on client birthdays from your studio" },
      { key: "anniversaryWish", label: "Anniversary Wishes", desc: "Auto-send wishes on wedding anniversaries" },
    ],
  },
];

const GROUP_COLORS: Record<string, { border: string; badge: string }> = {
  "brand-blue": { border: "border-brand-blue-light", badge: "bg-brand-blue-background text-brand-blue-primary" },
  "brand-orange": { border: "border-brand-orange-light", badge: "bg-brand-orange-background text-brand-orange-primary" },
  green: { border: "border-green-200", badge: "bg-green-100 text-green-700" },
  amber: { border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
  "brand-purple": { border: "border-brand-purple-light", badge: "bg-brand-purple-background text-brand-purple-primary" },
};

export default function WhatsappPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const studio = getStudioBySlug(studioSlug);
  if (!studio) notFound();

  const [settings, setSettings] = useState<WhatsAppSettings>(DEFAULT_WHATSAPP_SETTINGS);
  const [saved, setSaved] = useState(false);

  const toggleEnabled = () => setSettings((s) => ({ ...s, enabled: !s.enabled }));
  const toggleNotif = (key: keyof WhatsAppSettings["notifications"]) => {
    setSettings((s) => ({
      ...s,
      notifications: { ...s.notifications, [key]: !s.notifications[key] },
    }));
    setSaved(false);
  };

  const handleSave = () => setSaved(true);

  const enabledCount = Object.values(settings.notifications).filter(Boolean).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-8 lg:px-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary">WhatsApp Notifications</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Configure which events trigger automated WhatsApp messages to studio owners, crew, or customers.
          </p>
        </div>

        {/* Master Toggle */}
        <div className={`rounded-2xl border p-6 mb-6 transition ${settings.enabled ? "border-green-300 bg-green-50" : "border-border-default bg-surface-app"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-text-primary">WhatsApp Notifications Master Switch</h2>
              <p className="mt-1 text-xs text-text-secondary">
                {settings.enabled
                  ? `Enabled · ${enabledCount} of ${Object.keys(settings.notifications).length} notification types active`
                  : "All WhatsApp notifications are currently disabled"}
              </p>
            </div>
            <button
              onClick={toggleEnabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enabled ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${settings.enabled ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {!settings.enabled && (
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Note: WhatsApp notifications require the Studio Complete plan. Enable to configure individual alerts.
            </p>
          )}
        </div>

        {/* Notification Groups */}
        <div className="space-y-5">
          {NOTIFICATION_CONFIG.map((group) => {
            const colors = GROUP_COLORS[group.color];
            return (
              <div key={group.group} className={`rounded-2xl border bg-white p-6 ${colors.border}`}>
                <div className="flex items-center gap-2 mb-5">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
                    {group.group}
                  </span>
                </div>
                <div className="space-y-4">
                  {group.items.map((item) => {
                    const key = item.key as keyof WhatsAppSettings["notifications"];
                    const isOn = settings.notifications[key];
                    return (
                      <div key={item.key} className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${!settings.enabled ? "text-text-tertiary" : "text-text-primary"}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-text-tertiary mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          disabled={!settings.enabled}
                          onClick={() => toggleNotif(key)}
                          className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                            !settings.enabled
                              ? "cursor-not-allowed bg-gray-200"
                              : isOn
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isOn && settings.enabled ? "translate-x-4" : "translate-x-0.5"}`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="rounded-xl bg-brand-blue-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Save Notification Settings
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Settings saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
