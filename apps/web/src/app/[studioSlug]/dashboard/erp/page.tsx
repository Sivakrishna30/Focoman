"use client";

import { useState, useEffect, use } from "react";
import { StudioMember } from "@focoman/types";
import { getStudioMembersAction, createMemberAction } from "@/actions/memberActions";

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

const ALL_SKILLS = ["PHOTOGRAPHY", "VIDEOGRAPHY", "PHOTO_EDITING", "ALBUM_DESIGN"];

export default function ErpPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const [crewList, setCrewList] = useState<StudioMember[]>([]);
  const [selected, setSelected] = useState<StudioMember | null>(null);
  const [skillFilter, setSkillFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: ["PHOTOGRAPHY"],
  });

  const loadCrew = async () => {
    try {
      setLoading(true);
      const data = await getStudioMembersAction(studioSlug);
      setCrewList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCrew();
  }, [studioSlug]);

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    const res = await createMemberAction({
      studioId: studioSlug,
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      skills: form.skills,
    });

    setIsSubmitting(false);

    if (res.success && res.member) {
      setShowModal(false);
      setForm({ name: "", email: "", phone: "", skills: ["PHOTOGRAPHY"] });
      await loadCrew();
      setSelected(res.member);
    } else {
      setModalError(res.error || "Failed to add crew member");
    }
  };

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
              <p className="text-xs text-text-tertiary">Studio: {studioSlug} · {crewList.length} Active Crew Members</p>
            </div>
            <button
              onClick={() => {
                setShowModal(true);
                setModalError(null);
              }}
              className="rounded-xl bg-brand-purple-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-purple-700"
            >
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
            {["ALL", ...ALL_SKILLS].map((s) => (
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
          {loading && crewList.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading crew members...</div>
          ) : filtered.length === 0 ? (
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
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            SKILL_COLORS[skill] || "bg-gray-100 text-text-secondary"
                          }`}
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
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      SKILL_COLORS[skill] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {SKILL_LABELS[skill] || skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Crew Member</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            {modalError && (
              <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-600">{modalError}</div>
            )}
            <form onSubmit={handleCreateMember} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Photography"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-purple-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="crew@studio.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-purple-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-purple-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Certified Skills *</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SKILLS.map((skill) => (
                    <label
                      key={skill}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 text-[11px] font-semibold transition ${
                        form.skills.includes(skill)
                          ? "border-brand-purple-primary bg-purple-50 text-brand-purple-primary"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded text-brand-purple-primary"
                      />
                      {SKILL_LABELS[skill] || skill}
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-purple-primary px-5 py-2 font-bold text-white transition hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}