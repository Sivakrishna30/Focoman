"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";
import {
  updateStudioAction,
  deleteStudioAction,
  leaveStudioAction,
} from "@/actions/studioActions";

export default function StudioSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const studioSlug = (params.studioSlug as string) || "";
  const { studio, user, getIdToken, signOut } = useStudioWorkspace();

  const isOwner = studio.ownerId === user?.uid || studio.ownerEmail?.toLowerCase() === user?.email?.toLowerCase();

  // Default Studio State
  const [isDefaultStudio, setIsDefaultStudio] = useState(false);
  const [defaultToast, setDefaultToast] = useState<string | null>(null);

  // Edit Studio Form State
  const [name, setName] = useState(studio.name || "");
  const [city, setCity] = useState(studio.city || "");
  const [website, setWebsite] = useState(studio.website || "");
  const [instagram, setInstagram] = useState(studio.instagram || "");
  const [features, setFeatures] = useState(studio.features || {
    oms: true,
    crm: true,
    erp: true,
    whatsapp: true,
    marketplace: false,
    reports: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Delete / Leave Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [permanentDelete, setPermanentDelete] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Load default preference from localStorage
  useEffect(() => {
    if (user && studioSlug) {
      // null = never set (auto-default); '__cleared__' = explicitly cleared; otherwise = chosen default
      const storedDefault = localStorage.getItem(`focoman_default_workspace_${user.uid}`);
      setIsDefaultStudio(!!storedDefault && storedDefault !== '__cleared__' && storedDefault.toLowerCase() === studioSlug.toLowerCase());
    }
  }, [user, studioSlug]);

  const handleSetDefaultStudio = () => {
    if (!user || !studioSlug) return;
    localStorage.setItem(`focoman_default_workspace_${user.uid}`, studioSlug);
    setIsDefaultStudio(true);
    setDefaultToast(`"/${studioSlug}" is now set as your default studio workspace.`);
    setTimeout(() => setDefaultToast(null), 4000);
  };

  const handleClearDefaultStudio = () => {
    if (!user) return;
    // Write '__cleared__' sentinel so app knows this was intentional (vs never configured)
    localStorage.setItem(`focoman_default_workspace_${user.uid}`, '__cleared__');
    setIsDefaultStudio(false);
    setDefaultToast("Default workspace setting cleared.");
    setTimeout(() => setDefaultToast(null), 3000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication token unavailable.");

      const res = await updateStudioAction({
        studioSlug,
        updates: {
          name,
          city,
          website,
          instagram,
          features,
        },
        idToken: token,
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(res.error || "Failed to update studio settings.");
      }
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteOrLeave = async () => {
    if (!user || !studioSlug) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const token = await getIdToken();
      if (!token) throw new Error("Authentication token unavailable.");

      let res;
      if (isOwner) {
        res = await deleteStudioAction(studioSlug, token, { permanent: permanentDelete });
      } else {
        res = await leaveStudioAction(studioSlug, token);
      }

      if (!res.success) {
        setDeleteError(res.error || "Failed to process request.");
        setIsDeleting(false);
        return;
      }

      // If this was default studio, clear preference
      const storedDefault = localStorage.getItem(`focoman_default_workspace_${user.uid}`);
      if (storedDefault?.toLowerCase() === studioSlug.toLowerCase()) {
        localStorage.removeItem(`focoman_default_workspace_${user.uid}`);
        localStorage.removeItem("focoman_default_workspace");
      }

      router.push("/workspaces");
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "An error occurred during deletion.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-divider pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue-primary">
              Studio Workspace
            </span>
            <span className="font-mono text-xs text-text-tertiary bg-slate-100 px-2 py-0.5 rounded-md">
              /{studioSlug}
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-text-primary">
            Studio &amp; Workspace Settings
          </h1>
          <p className="mt-1 text-xs text-text-secondary">
            Configure studio preferences, default routing, active modules, and workspace management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/workspaces"
            className="rounded-xl border border-border-default bg-white px-3.5 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-app transition"
          >
            ← All Workspaces
          </Link>
        </div>
      </div>

      {defaultToast && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-semibold text-emerald-900 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-600">✓</span>
            <span>{defaultToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setDefaultToast(null)}
            className="text-emerald-800 font-bold hover:text-emerald-950 px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Default Studio Workspace Preference */}
      <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-text-primary">Default Workspace Routing</h2>
              {isDefaultStudio && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
                  Default Active
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-text-secondary max-w-xl leading-relaxed">
              When set as default, entering <strong className="text-text-primary">/dashboard</strong> directly or opening Focoman will launch this studio automatically.
            </p>
          </div>

          <div>
            {isDefaultStudio ? (
              <button
                type="button"
                onClick={handleClearDefaultStudio}
                className="rounded-xl border border-border-default px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-slate-50 transition"
              >
                Clear Default
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSetDefaultStudio}
                className="rounded-xl bg-brand-blue-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition shadow-xs"
              >
                Set as Default Studio
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Studio Details & Metadata (Owner Only) */}
      <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-text-primary">Studio Profile &amp; Identity</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Basic information displayed on invoices, client contracts, and WhatsApp templates.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-text-primary">Studio Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isOwner || isSaving}
                className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-brand-blue-primary disabled:bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary">Operating City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!isOwner || isSaving}
                className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-brand-blue-primary disabled:bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary">Website URL (Optional)</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={!isOwner || isSaving}
                placeholder="https://yourstudio.com"
                className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-brand-blue-primary disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary">Instagram Handle (Optional)</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                disabled={!isOwner || isSaving}
                placeholder="@yourstudio"
                className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-brand-blue-primary disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Operational Modules */}
          <div className="pt-4 border-t border-border-divider space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Operational Modules &amp; Capabilities
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { key: "oms", label: "OMS (Order Management)", desc: "Pipelines, deliverables, drive sync" },
                { key: "crm", label: "CRM (Customer Relations)", desc: "Clients, inquiries, contracts" },
                { key: "erp", label: "ERP (Crew Operations)", desc: "Crew scheduling, equipment, tasks" },
                { key: "whatsapp", label: "WhatsApp Alerts", desc: "Automated event alerts & updates" },
                { key: "reports", label: "Business Reports", desc: "Financial analytics and trends" },
              ].map((mod) => (
                <label
                  key={mod.key}
                  className={`flex flex-col justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                    features[mod.key as keyof typeof features]
                      ? "border-brand-blue-primary/40 bg-sky-50/50"
                      : "border-border-default bg-surface-app"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-text-primary">{mod.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(features[mod.key as keyof typeof features])}
                      onChange={(e) =>
                        setFeatures({
                          ...features,
                          [mod.key]: e.target.checked,
                        })
                      }
                      disabled={!isOwner || isSaving}
                      className="mt-0.5 rounded text-brand-blue-primary focus:ring-brand-blue-primary"
                    />
                  </div>
                  <span className="text-[11px] text-text-secondary mt-1">{mod.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {saveSuccess && (
            <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              ✓ Studio settings updated successfully.
            </p>
          )}

          {saveError && (
            <p className="text-xs font-semibold text-status-error bg-red-50 p-2.5 rounded-xl border border-red-200">
              {saveError}
            </p>
          )}

          {isOwner && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-brand-blue-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition shadow-xs disabled:opacity-50"
              >
                {isSaving ? "Saving Settings..." : "Save Studio Settings"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* 3. Danger Zone: Delete Studio (Owner) or Leave Studio (Member) */}
      <div className="rounded-3xl border border-red-200 bg-red-50/40 p-6 shadow-sm sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
              Danger Zone
            </span>
            <h2 className="text-base font-bold text-red-950 mt-0.5">
              {isOwner ? "Delete Studio Workspace" : "Leave Studio Workspace"}
            </h2>
            <p className="mt-1 text-xs text-red-900/80 max-w-xl leading-relaxed">
              {isOwner
                ? "Permanently delete this studio workspace, associated tasks, order registries, and team memberships."
                : "Remove your access to this studio workspace. You will need a new invite code to rejoin."}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteError(null);
              }}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition shadow-xs"
            >
              {isOwner ? "Delete Studio..." : "Leave Studio..."}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border-default animate-in fade-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-text-primary">
              {isOwner ? "Confirm Studio Deletion" : "Confirm Leave Workspace"}
            </h3>

            <p className="mt-2 text-xs text-text-secondary leading-relaxed">
              {isOwner ? (
                <>
                  Are you sure you want to delete <span className="font-bold text-text-primary">{name || studioSlug}</span> (<span className="font-mono">/{studioSlug}</span>)? This action removes access for all studio members.
                </>
              ) : (
                <>
                  Are you sure you want to leave <span className="font-bold text-text-primary">{name || studioSlug}</span>? You will lose access immediately.
                </>
              )}
            </p>

            {isOwner && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-3.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permanentDelete}
                    onChange={(e) => setPermanentDelete(e.target.checked)}
                    className="mt-0.5 rounded border-red-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs text-red-950 leading-tight">
                    <strong>Permanent Cleanup:</strong> Free up the studio identifier <span className="font-mono font-bold">/{studioSlug}</span> and clear crew memberships completely.
                  </span>
                </label>
              </div>
            )}

            {deleteError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="w-full sm:w-auto rounded-xl border border-border-default px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteOrLeave}
                disabled={isDeleting}
                className="w-full sm:w-auto rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition shadow-xs flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : isOwner ? (
                  "Yes, Delete Studio"
                ) : (
                  "Yes, Leave Studio"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
