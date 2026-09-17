"use client";

import { useState, useEffect } from "react";
import { fetchMarketplaceProfile, saveMarketplaceProfile } from "@/actions/marketplaceActions";
import { MarketplaceProfile } from "@focoman/types";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";

export function MarketplaceSettingsClient({ studioId }: { studioId: string }) {
  const [profile, setProfile] = useState<Partial<MarketplaceProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const { getIdToken } = useStudioWorkspace();

  useEffect(() => {
    async function load() {
      const token = await getIdToken();
      if (!token) {
        setMessage({ type: "error", text: "Authentication required." });
        setLoading(false);
        return;
      }
      const res = await fetchMarketplaceProfile(studioId, token);
      if (res.success && res.profile) {
        setProfile(res.profile);
      }
      setLoading(false);
    }
    load();
  }, [studioId, getIdToken]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    const token = await getIdToken();
    if (!token) {
      setMessage({ type: "error", text: "Authentication required." });
      setSaving(false);
      return;
    }
    
    const res = await saveMarketplaceProfile(studioId, {
      name: profile.name,
      city: profile.city,
      description: profile.description,
      tags: profile.tags || [],
      isVisible: profile.isVisible || false,
    }, token);

    if (res.success) {
      setMessage({ type: "success", text: "Marketplace profile updated successfully." });
      if (res.profile) setProfile(res.profile);
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update profile." });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-sm text-text-secondary">Loading profile settings...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-border-default bg-white p-6 shadow-sm">
      {message && (
        <div className={`rounded-xl p-4 text-sm font-semibold ${message.type === "success" ? "bg-green-50 text-status-success" : "bg-red-50 text-status-error"}`}>
          {message.text}
        </div>
      )}

      <div>
        <h3 className="text-base font-bold text-text-primary">Public Visibility</h3>
        <p className="text-xs text-text-secondary mt-1">If enabled, your studio will be discoverable by potential clients in the public marketplace.</p>
        <div className="mt-4 flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={profile.isVisible || false}
              onChange={(e) => setProfile({ ...profile, isVisible: e.target.checked })}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
          <span className="text-sm font-semibold text-text-primary">
            {profile.isVisible ? "Visible to Public" : "Hidden (Private)"}
          </span>
        </div>
      </div>

      <div className="border-t border-border-divider pt-6">
        <label className="block text-sm font-semibold text-text-primary">Public Studio Name</label>
        <input 
          type="text" 
          value={profile.name || ""}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="mt-2 block w-full rounded-xl border border-border-input px-4 py-2 text-sm focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary" 
          placeholder="e.g. Luminary Studios"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary">Service City</label>
        <input 
          type="text" 
          value={profile.city || ""}
          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          className="mt-2 block w-full rounded-xl border border-border-input px-4 py-2 text-sm focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary" 
          placeholder="e.g. Bangalore"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-primary">Studio Description</label>
        <textarea 
          value={profile.description || ""}
          onChange={(e) => setProfile({ ...profile, description: e.target.value })}
          rows={4}
          className="mt-2 block w-full rounded-xl border border-border-input px-4 py-2 text-sm focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary" 
          placeholder="Tell clients about your style, experience, and services..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-text-primary">Service Tags</label>
        <p className="text-xs text-text-secondary mb-2">Comma separated values (e.g. Wedding, Portrait, Corporate)</p>
        <input 
          type="text" 
          value={(profile.tags || []).join(", ")}
          onChange={(e) => setProfile({ ...profile, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
          className="block w-full rounded-xl border border-border-input px-4 py-2 text-sm focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary" 
          placeholder="Wedding, Portrait, Corporate"
        />
      </div>

      <div className="pt-4 border-t border-border-divider flex justify-end">
        <button 
          type="submit" 
          disabled={saving}
          className="rounded-xl bg-brand-blue-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
