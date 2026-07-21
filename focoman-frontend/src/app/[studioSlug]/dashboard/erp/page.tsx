"use client";

import { useState, use } from "react";
import { getStudioBySlug, getEmployeesByStudio, EmployeeMock } from "@/services/mockDb";
import { notFound } from "next/navigation";

const ROLE_COLORS: Record<string, string> = {
  PHOTOGRAPHER: "bg-brand-blue-background text-brand-blue-primary",
  VIDEOGRAPHER: "bg-sky-100 text-sky-700",
  EDITOR: "bg-brand-purple-background text-brand-purple-primary",
  ALBUM_DESIGNER: "bg-pink-100 text-pink-700",
  RECEPTIONIST: "bg-amber-100 text-amber-700",
  MANAGER: "bg-green-100 text-green-700",
};

const ROLE_LABELS: Record<string, string> = {
  PHOTOGRAPHER: "Photographer",
  VIDEOGRAPHER: "Videographer",
  EDITOR: "Editor",
  ALBUM_DESIGNER: "Album Designer",
  RECEPTIONIST: "Receptionist",
  MANAGER: "Manager",
};

export default function ErpPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const studio = getStudioBySlug(studioSlug);
  if (!studio) notFound();

  const crew = getEmployeesByStudio(studio.studioId);
  const [selected, setSelected] = useState<EmployeeMock | null>(null);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = crew.filter((e) => roleFilter === "ALL" || e.role === roleFilter);

  return (
    <div className="flex h-full">
      {/* Crew List Panel */}
      <div className={`flex flex-col ${selected ? "w-1/2 border-r border-border-default" : "w-full"} h-full`}>
        {/* Header */}
        <div className="border-b border-border-default bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-text-primary">Studio Enterprise Resource Planning</h1>
              <p className="text-xs text-text-tertiary">{crew.length} crew members · {studio.brandName}</p>
            </div>
            <button className="rounded-xl bg-brand-purple-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700">
              + Add Crew Member
            </button>
          </div>

          <div className="mt-4 flex gap-3 items-center">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
            >
              <option value="ALL">All Roles</option>
              {Object.keys(ROLE_LABELS).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            {/* Workload summary */}
            <div className="flex gap-2 flex-wrap">
              <span className="rounded-full bg-surface-app border border-border-default px-3 py-1 text-[10px] font-bold text-text-secondary">
                Active: {crew.filter(e => e.status === "ACTIVE").length}
              </span>
              <span className="rounded-full bg-surface-app border border-border-default px-3 py-1 text-[10px] font-bold text-text-secondary">
                Total Active Tasks: {crew.reduce((s, e) => s + e.activeOrders, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Crew Cards */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {filtered.map((member) => (
            <div
              key={member.employeeId}
              onClick={() => setSelected(member.employeeId === selected?.employeeId ? null : member)}
              className={`cursor-pointer rounded-2xl border p-4 transition hover:shadow-sm ${
                selected?.employeeId === member.employeeId
                  ? "border-brand-purple-primary bg-brand-purple-background/20"
                  : "border-border-default bg-white hover:border-brand-purple-light"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {/* Avatar circle */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue-background to-brand-purple-background text-xs font-extrabold text-brand-purple-primary">
                      {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-text-primary">{member.name}</p>
                      <p className="text-[10px] font-mono text-text-tertiary">{member.crewHandle}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-text-tertiary">{member.email}</p>
                </div>
                <div className="shrink-0 text-right space-y-1.5">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${ROLE_COLORS[member.role]}`}>
                    {ROLE_LABELS[member.role]}
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <div className={`h-2 w-2 rounded-full ${member.status === "ACTIVE" ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="text-[10px] text-text-tertiary">{member.activeOrders} active task{member.activeOrders !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crew Detail Panel */}
      {selected && (
        <div className="w-1/2 flex flex-col h-full overflow-y-auto bg-white">
          <div className="sticky top-0 z-10 border-b border-border-default bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-text-primary">{selected.name}</h2>
              <p className="text-xs font-mono text-text-tertiary">{selected.crewHandle}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-app"
            >
              Close
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Status + Role */}
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${ROLE_COLORS[selected.role]}`}>
                {ROLE_LABELS[selected.role]}
              </span>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${selected.status === "ACTIVE" ? "bg-green-500" : "bg-gray-300"}`} />
                <span className="text-xs text-text-secondary font-medium">{selected.status}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-brand-purple-background/40 border border-purple-200 p-3 text-center">
                <p className="text-xl font-extrabold text-brand-purple-primary">{selected.activeOrders}</p>
                <p className="text-[10px] text-text-secondary">Active Tasks</p>
              </div>
              <div className="rounded-xl bg-surface-app border border-border-default p-3 text-center">
                <p className="text-xs font-bold text-text-primary">{selected.employeeCode}</p>
                <p className="text-[10px] text-text-secondary">Employee Code</p>
              </div>
              <div className="rounded-xl bg-surface-app border border-border-default p-3 text-center">
                <p className="text-xs font-bold text-text-primary">{selected.joinedDate}</p>
                <p className="text-[10px] text-text-secondary">Joined</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="rounded-xl border border-border-default p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Contact Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-text-tertiary">Phone</p><p className="font-semibold text-text-primary">{selected.phone}</p></div>
                <div><p className="text-text-tertiary">Email</p><p className="font-semibold text-text-primary">{selected.email}</p></div>
              </div>
            </div>

            {/* Crew Handle / Login */}
            <div className="rounded-xl border border-border-default bg-surface-app p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Crew Login Handle</h3>
              <p className="font-mono text-sm font-bold text-brand-purple-primary bg-white rounded-lg border border-border-default px-3 py-2">
                {selected.crewHandle}
              </p>
              <p className="mt-2 text-[10px] text-text-tertiary">This is the login handle this crew member uses to access the system.</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-lg border border-brand-purple-light px-3 py-1.5 text-xs font-semibold text-brand-purple-primary hover:bg-brand-purple-background">
                  Reset Password
                </button>
                <button className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-app">
                  Copy Handle
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg bg-brand-purple-primary px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700">
                  Assign to Order
                </button>
                <button className="rounded-lg border border-border-default px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-app">
                  Edit Profile
                </button>
                <button className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50">
                  Deactivate
                </button>
                <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
