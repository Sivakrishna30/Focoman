"use client";

import { useState, useEffect, useCallback, use, useMemo } from "react";
import { StudioMember, Order, OrderStatus } from "@focoman/types";
import { getStudioMembersAction, createMemberAction } from "@/actions/memberActions";
import { getStudioOrdersAction, confirmResourceAvailabilityAction } from "@/actions/orderActions";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";
import {
  isDemoStudio,
  getDemoMembers,
  getDemoOrders,
  createDemoMember,
  confirmDemoResourceAvailability,
  subscribeToDemoStore,
} from "@/lib/demoStore";

const SKILL_LABELS: Record<string, string> = {
  PHOTOGRAPHY: "Photographer",
  VIDEOGRAPHY: "Videographer",
  PHOTO_EDITING: "Photo Editor",
  ALBUM_DESIGN: "Album Designer",
};

const SKILL_COLORS: Record<string, string> = {
  PHOTOGRAPHY: "badge-brand-blue",
  VIDEOGRAPHY: "badge-brand-orange",
  PHOTO_EDITING: "badge-brand-purple",
  ALBUM_DESIGN: "badge-brand-blue",
};

const ALL_SKILLS = ["PHOTOGRAPHY", "VIDEOGRAPHY", "PHOTO_EDITING", "ALBUM_DESIGN"];

export default function ErpPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const { idToken: workspaceToken, authLoading, getIdToken } = useStudioWorkspace();
  const [crewList, setCrewList] = useState<StudioMember[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<StudioMember | null>(null);
  const [skillFilter, setSkillFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const isDemo = isDemoStudio(studioSlug);

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
  const [createdInvite, setCreatedInvite] = useState<{ code: string; email: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async (tokenOverride?: string | null) => {
    try {
      setLoading(true);
      if (isDemo) {
        setCrewList(getDemoMembers());
        setOrders(getDemoOrders());
        setLoading(false);
        return;
      }
      const token = tokenOverride ?? workspaceToken ?? (await getIdToken(false));
      if (!token) {
        setLoading(false);
        return;
      }
      const [membersData, ordersData] = await Promise.all([
        getStudioMembersAction(studioSlug, token),
        getStudioOrdersAction(studioSlug, token)
      ]);
      setCrewList(membersData);
      setOrders(ordersData);
    } catch (err) {
      console.error("[ErpPage] Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [studioSlug, isDemo, workspaceToken, getIdToken]);

  useEffect(() => {
    if (isDemo) {
      void loadData();
      const unsub = subscribeToDemoStore(() => {
        void loadData();
      });
      return () => unsub();
    } else if (!authLoading) {
      void loadData(workspaceToken);
    }
  }, [studioSlug, isDemo, authLoading, workspaceToken, loadData]);

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

    if (isDemo) {
      const res = createDemoMember({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        skills: form.skills,
      });
      setIsSubmitting(false);
      if (res.success && res.member) {
        setShowModal(false);
        setForm({ name: "", email: "", phone: "", skills: ["PHOTOGRAPHY"] });
        setCrewList(getDemoMembers());
        setSelected(res.member);
      } else {
        setModalError("Failed to add crew member in demo mode");
      }
      return;
    }

    const token = await getIdToken(true);
    if (!token) {
      setModalError("Authentication error. Please sign in again.");
      setIsSubmitting(false);
      return;
    }

    const res = await createMemberAction({
      idToken: token,
      studioId: studioSlug,
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      skills: form.skills,
    });

    setIsSubmitting(false);

    if (res.success && res.member) {
      setShowModal(false);
      const memberName = form.name;
      const memberEmail = form.email;
      setForm({ name: "", email: "", phone: "", skills: ["PHOTOGRAPHY"] });
      await loadData();
      setSelected(res.member);
      if (res.invitationCode) {
        setCreatedInvite({
          code: res.invitationCode,
          name: memberName,
          email: memberEmail,
        });
      }
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
    <div className="flex h-full bg-surface-app">
      {/* Crew Members List Panel */}
      <div className={`flex flex-col ${selected ? "w-1/2 border-r border-border-default" : "w-full"} h-full`}>
        {/* Header */}
        <header className="header-brand-purple">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge-brand-purple">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                  ERP · Studio Operations
                </span>
                <span className="badge-status-neutral">
                  Studio: <strong className="font-semibold text-text-primary">{studioSlug}</strong>
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                Studio Enterprise Resource Planning
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Crew assignments, certified skills, and event availability tracking · {crewList.length} Active Crew Members
              </p>
            </div>
            <button
              onClick={() => {
                setShowModal(true);
                setModalError(null);
              }}
              className="btn-brand-purple"
            >
              + Add Crew Member
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              suppressHydrationWarning
              autoComplete="off"
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border-default bg-surface-app px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:bg-white focus:outline-none focus:border-brand-purple-primary focus:ring-2 focus:ring-brand-purple-soft"
            />
          </div>

          {/* Skill Filter Buttons */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["ALL", ...ALL_SKILLS].map((s) => (
              <button
                key={s}
                onClick={() => setSkillFilter(s)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                  skillFilter === s
                    ? "bg-brand-purple-primary text-white shadow-2xs"
                    : "border border-border-default bg-white text-text-secondary hover:bg-surface-app hover:text-text-primary"
                }`}
              >
                {s === "ALL" ? "All Skills" : SKILL_LABELS[s] || s}
              </button>
            ))}
          </div>
        </header>

        {/* Crew Member List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {loading && crewList.length === 0 ? (
            <div className="py-16 text-center text-xs text-text-tertiary">Loading crew members...</div>
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
                    ? "card-brand-purple"
                    : "border-border-default bg-white hover:border-brand-purple-light hover:shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple-background font-extrabold text-brand-purple-primary text-sm shadow-2xs border border-brand-purple-soft">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{emp.name}</h3>
                    <p className="text-xs text-text-secondary">
                      {emp.email} {emp.phone ? `· ${emp.phone}` : ""}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {emp.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={SKILL_COLORS[skill] || "badge-status-neutral"}
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
        <div className="w-1/2 flex flex-col h-full bg-white overflow-y-auto border-l border-border-default">
          <div className="sticky top-0 z-10 border-b border-border-default bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple-primary">Crew Profile</span>
              <h2 className="text-sm font-bold text-text-primary">Member Overview</h2>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="btn-brand-outline py-1.5 px-3 text-xs"
            >
              Close
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-purple-background font-extrabold text-brand-purple-primary text-xl shadow-2xs border border-brand-purple-soft">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">{selected.name}</h2>
                <p className="text-xs text-text-secondary">{selected.email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border-default p-4 space-y-3 bg-surface-app/40">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Contact Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-text-tertiary">Phone</p><p className="font-semibold text-text-primary mt-0.5">{selected.phone || "-"}</p></div>
                <div><p className="text-text-tertiary">Email</p><p className="font-semibold text-text-primary mt-0.5">{selected.email || "-"}</p></div>
              </div>
            </div>

            <div className="rounded-2xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3">Certified Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selected.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={SKILL_COLORS[skill] || "badge-status-neutral"}
                  >
                    {SKILL_LABELS[skill] || skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3">Upcoming Assignments</h3>
              <div className="space-y-3">
                {orders.filter(o => 
                  o.assignedResources?.some(r => r.memberId === selected.id) && 
                  o.orderStatus !== "COMPLETED"
                ).length > 0 ? (
                  orders
                    .filter(o => o.assignedResources?.some(r => r.memberId === selected.id) && o.orderStatus !== "COMPLETED")
                    .map(order => {
                      const assignment = order.assignedResources.find(r => r.memberId === selected.id)!;
                      return (
                        <div key={order.id} className="flex flex-col gap-2 p-3.5 rounded-xl border border-border-default bg-surface-app/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-text-primary">{order.eventType}</p>
                              <p className="text-[11px] text-text-secondary mt-0.5 font-mono">
                                <span className="font-bold text-brand-blue-primary">{order.orderNumber}</span> · {new Date(order.eventDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={SKILL_COLORS[assignment.skill] || "badge-status-neutral"}>
                              {SKILL_LABELS[assignment.skill] || assignment.skill}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-default">
                            <span className="text-[10px] font-bold uppercase text-text-tertiary">Availability:</span>
                            {assignment.availabilityConfirmed === true ? (
                              <span className="badge-status-success">Confirmed</span>
                            ) : assignment.availabilityConfirmed === false ? (
                              <span className="badge-status-error">Rejected</span>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    if (isDemo) {
                                      confirmDemoResourceAvailability(order.id, selected.id, true);
                                      setOrders(getDemoOrders());
                                      return;
                                    }
                                    const token = await getIdToken(false);
                                    if (token) {
                                      await confirmResourceAvailabilityAction(order.id, selected.id, true, token);
                                      await loadData();
                                    }
                                  }}
                                  className="btn-brand-purple py-1 px-2.5 text-[10px]"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={async () => {
                                    if (isDemo) {
                                      confirmDemoResourceAvailability(order.id, selected.id, false);
                                      setOrders(getDemoOrders());
                                      return;
                                    }
                                    const token = await getIdToken(false);
                                    if (token) {
                                      await confirmResourceAvailabilityAction(order.id, selected.id, false, token);
                                      await loadData();
                                    }
                                  }}
                                  className="btn-brand-outline py-1 px-2.5 text-[10px]"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-xs text-text-tertiary">No upcoming assignments found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div>
                <div className="badge-brand-purple mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
                  Crew Member
                </div>
                <h3 className="text-base font-bold text-text-primary">Add Crew Member</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-text-tertiary hover:text-text-primary font-bold">✕</button>
            </div>
            {modalError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">{modalError}</div>
            )}
            <form onSubmit={handleCreateMember} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-text-primary">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-purple-primary focus:ring-1 focus:ring-brand-purple-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-text-primary">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="crew@studio.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-purple-primary focus:ring-1 focus:ring-brand-purple-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-text-primary">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-purple-primary focus:ring-1 focus:ring-brand-purple-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-text-primary mb-1.5">Certified Skills *</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SKILLS.map((skill) => (
                    <label
                      key={skill}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-[11px] font-semibold transition ${
                        form.skills.includes(skill)
                          ? "border-brand-purple-primary bg-brand-purple-background/40 text-brand-purple-primary"
                          : "border-border-default text-text-secondary hover:bg-surface-app"
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
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-brand-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-brand-purple"
                >
                  {isSubmitting ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invitation Code Dialog */}
      {createdInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-border-default animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-border-default pb-4">
              <div>
                <span className="badge-status-success">
                  Invitation Created
                </span>
                <h3 className="mt-1.5 text-base font-bold text-text-primary">
                  Crew Member Invitation Ready
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreatedInvite(null)}
                className="text-text-tertiary hover:text-text-primary text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-text-secondary">
              Share this single-use code with <strong>{createdInvite.name}</strong> ({createdInvite.email}). When they sign in with their Google account, their workspace access will be automatically linked to this studio.
            </p>

            <div className="mt-4 rounded-2xl border border-brand-purple-soft bg-brand-purple-background/40 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple-primary">
                Single-Use Invite Code
              </span>
              <div className="mt-1 font-mono text-xl font-extrabold tracking-widest text-brand-purple-primary">
                {createdInvite.code}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                Direct Onboarding Link
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  readOnly
                  type="text"
                  value={typeof window !== "undefined" ? `${window.location.origin}/onboarding/join-studio?code=${createdInvite.code}` : `/onboarding/join-studio?code=${createdInvite.code}`}
                  className="w-full rounded-xl border border-border-default bg-surface-app px-3 py-2 font-mono text-xs text-text-primary outline-none select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const link = `${window.location.origin}/onboarding/join-studio?code=${createdInvite.code}`;
                    navigator.clipboard.writeText(link);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="btn-brand-purple shrink-0 py-2 px-3 text-xs"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setCreatedInvite(null)}
                className="btn-brand-purple"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}