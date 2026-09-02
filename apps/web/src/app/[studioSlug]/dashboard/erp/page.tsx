"use client";

import { useState, use } from "react";
import { StudioMember } from "@focoman/types";

const SKILL_LABELS: Record<string, string> = {
  PHOTOGRAPHY: "Photographer",
  VIDEOGRAPHY: "Videographer",
  PHOTO_EDITING: "Photo Editor",
  ALBUM_DESIGN: "Album Designer",
};

const SKILL_COLORS: Record<string, string> = {
  PHOTOGRAPHY: "bg-brand-blue-background text-brand-blue-primary",
  VIDEOGRAPHY: "bg-sky-100 text-sky-700",
  PHOTO_EDITING: "bg-brand-purple-background text-brand-purple-primary",
  ALBUM_DESIGN: "bg-pink-100 text-pink-700",
};

export default function ErpPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const [crewList, setCrewList] = useState<StudioMember[]>([]);
  const [selected, setSelected] = useState<StudioMember | null>(null);
  const [skillFilter, setSkillFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = crewList.filter((m) => {
    const matchSkill = skillFilter === "ALL" || m.skills.includes(skillFilter);
    const matchSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.phone && m.phone.includes(search));
    return matchSkill && matchSearch;
  });

  return (
    <div className="flex h-full">
      {/* Crew Members List Panel */}
      <div className={`flex flex-col ${selected ? "w-1/2 border-r border-border-default" : "w-full"} h-full`}>
        {/* Header */}
        <div className="border-b border-border-default bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-text-primary">Studio Enterprise Resource Planning (ERP)</h1>
              <p className="text-xs text-text-tertiary">Studio crew members, skills & availability management</p>
            </div>
            <button className="rounded-xl bg-brand-purple-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700">
              + Add Crew Member
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
            />
          </div>

          {/* Skill Filter Buttons */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["ALL", "PHOTOGRAPHY", "VIDEOGRAPHY", "PHOTO_EDITING", "ALBUM_DESIGN"].map((s) => (
              <button
                key={s}
                onClick={() => setSkillFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  skillFilter === s
                    ? "bg-brand-purple-primary text-white"
                    : "bg-surface-app text-text-secondary hover:bg-gray-200"
                }`}
              >
                {s === "ALL" ? "All Skills" : SKILL_LABELS[s] || s}
              </button>
            ))}
          </div>
        </div>

        {/* Crew Member List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-default bg-white p-8 text-center text-xs text-text-tertiary">
              {search || skillFilter !== "ALL"
                ? "No crew members match the selected filters."
                : "No crew members added yet. Add photographers, videographers, and editors to assign them to orders."}
            </div>
          ) : (
            filtered.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelected(emp)}
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  selected?.id === emp.id
                    ? "border-brand-purple-primary bg-brand-purple-background/30 shadow-xs"
                    : "border-border-default bg-white hover:border-brand-purple-light hover:shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple-background font-extrabold text-brand-purple-primary text-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{emp.name}</h3>
                    <p className="text-xs text-text-tertiary">
                      {emp.email} {emp.phone ? `· ${emp.phone}` : ""}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {emp.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${SKILL_COLORS[skill] || "bg-gray-100 text-text-secondary"}`}
                        >
                          {SKILL_LABELS[skill] || skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Crew Detail Drawer */}
      {selected && (
        <div className="w-1/2 flex flex-col h-full bg-white overflow-y-auto">
          <div className="border-b border-border-default px-6 py-5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">Member Overview</h2>
            <button onClick={() => setSelected(null)} className="text-xs text-text-tertiary hover:text-text-primary font-bold">
              ✕ Close
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-purple-background font-extrabold text-brand-purple-primary text-xl">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">{selected.name}</h2>
                <p className="text-xs text-text-secondary">{selected.email}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Contact Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-text-tertiary">Phone</p><p className="font-semibold text-text-primary">{selected.phone || "—"}</p></div>
                <div><p className="text-text-tertiary">Email</p><p className="font-semibold text-text-primary">{selected.email || "—"}</p></div>
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Certified Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selected.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${SKILL_COLORS[skill] || "bg-gray-100 text-gray-700"}`}
                  >
                    {SKILL_LABELS[skill] || skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Resource Allocation Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg bg-brand-purple-primary px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700">
                  Assign to Order
                </button>
                <button className="rounded-lg border border-border-default px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-app">
                  Edit Member Skills
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}