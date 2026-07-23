"use client";

import { useState, useEffect, use } from "react";
import { getStudioBySlug, getEmployeesByStudio, EmployeeMock } from "@/services/mockDb";
import { notFound } from "next/navigation";
import { authApi, JoinRequestDTO } from "@/services/authApi";

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

  const initialCrew = getEmployeesByStudio(studio.studioId);
  const [crewList, setCrewList] = useState<EmployeeMock[]>(initialCrew);
  const [selected, setSelected] = useState<EmployeeMock | null>(null);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"members" | "requests">("members");

  // Join Requests state
  const [pendingRequests, setPendingRequests] = useState<JoinRequestDTO[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    authApi.getPendingJoinRequests(studio.studioId).then((reqs) => setPendingRequests(reqs));
  }, [studio.studioId]);

  const handleApprove = async (req: JoinRequestDTO) => {
    const res = await authApi.approveJoinRequest(req.requestId);
    if (res.success) {
      setActionFeedback(`Approved ${req.applicantName}. Added to active crew list!`);
      setPendingRequests((prev) => prev.filter((r) => r.requestId !== req.requestId));
      
      // Add to crew list
      const newCrew: EmployeeMock = {
        employeeId: `emp-${Math.floor(100 + Math.random() * 900)}`,
        name: req.applicantName,
        role: req.primaryExpertise.toUpperCase().includes("VIDEO") ? "VIDEOGRAPHER" : "PHOTOGRAPHER",
        primaryRole: req.primaryExpertise,
        secondaryRoles: req.skills,
        activeOrders: 0,
        completedOrders: 0,
        phone: req.mobile,
        email: req.email,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        status: "ACTIVE",
        employeeCode: `${studio.prefix}-MEM-${Math.floor(100 + Math.random() * 900)}`,
        crewHandle: req.username,
      };
      setCrewList((prev) => [newCrew, ...prev]);
    }
  };

  const handleReject = async (req: JoinRequestDTO) => {
    const res = await authApi.rejectJoinRequest(req.requestId);
    if (res.success) {
      setActionFeedback(`Rejected application from ${req.applicantName}.`);
      setPendingRequests((prev) => prev.filter((r) => r.requestId !== req.requestId));
    }
  };

  const filtered = crewList.filter((e) => roleFilter === "ALL" || e.role === roleFilter);

  return (
    <div className="flex h-full">
      {/* Crew & Requests Panel */}
      <div className={`flex flex-col ${selected ? "w-1/2 border-r border-border-default" : "w-full"} h-full`}>
        {/* Header */}
        <div className="border-b border-border-default bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-text-primary">Studio Enterprise Resource Planning (ERP)</h1>
              <p className="text-xs text-text-tertiary">{crewList.length} active crew members · {studio.brandName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab(activeTab === "members" ? "requests" : "members")}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === "requests"
                    ? "bg-brand-orange-primary text-white shadow-xs"
                    : "bg-surface-app border border-border-default text-text-primary hover:bg-gray-100"
                }`}
              >
                Join Requests ({pendingRequests.length})
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="mt-4 flex gap-4 border-b border-border-divider text-xs font-bold">
            <button
              onClick={() => setActiveTab("members")}
              className={`pb-2 transition ${activeTab === "members" ? "border-b-2 border-brand-purple-primary text-brand-purple-primary" : "text-text-tertiary"}`}
            >
              Active Crew Members ({crewList.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-2 transition flex items-center gap-1.5 ${activeTab === "requests" ? "border-b-2 border-brand-orange-primary text-brand-orange-primary" : "text-text-tertiary"}`}
            >
              Pending Approval Queue
              {pendingRequests.length > 0 && (
                <span className="rounded-full bg-brand-orange-primary px-1.5 py-0.5 text-[10px] text-white">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>

          {actionFeedback && (
            <div className="mt-3 rounded-lg border border-brand-purple-light/40 bg-brand-purple-background p-3 text-xs font-medium text-brand-purple-primary">
              {actionFeedback}
            </div>
          )}

          {/* Role Filter (Only for Members Tab) */}
          {activeTab === "members" && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["ALL", "PHOTOGRAPHER", "VIDEOGRAPHER", "EDITOR", "ALBUM_DESIGNER", "MANAGER"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                    roleFilter === r
                      ? "bg-brand-purple-primary text-white"
                      : "bg-surface-app text-text-secondary hover:bg-gray-200"
                  }`}
                >
                  {r === "ALL" ? "All Roles" : ROLE_LABELS[r] || r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab Content 1: Active Members List */}
        {activeTab === "members" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {filtered.map((emp) => (
              <div
                key={emp.employeeId}
                onClick={() => setSelected(emp)}
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  selected?.employeeId === emp.employeeId
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
                      {emp.crewHandle} · <span className="font-mono text-brand-purple-primary font-semibold">{emp.employeeCode}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {emp.secondaryRoles?.map((skill, idx) => (
                        <span key={idx} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-text-secondary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${ROLE_COLORS[emp.role] || "bg-gray-100 text-gray-700"}`}>
                    {emp.primaryRole}
                  </span>
                  <p className="mt-1 text-[11px] text-text-secondary font-medium">
                    {emp.activeOrders} active task{emp.activeOrders !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 2: Pending Approval Queue */}
        {activeTab === "requests" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-default bg-white p-8 text-center text-xs text-text-tertiary">
                No pending crew join requests at this time.
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.requestId} className="rounded-2xl border border-brand-orange-soft bg-white p-5 shadow-xs">
                  <div className="flex flex-col justify-between gap-2 border-b border-border-divider pb-3 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-orange-primary">{req.requestId}</span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                          Pending Approval
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-bold text-text-primary">{req.applicantName}</h3>
                      <p className="text-xs text-text-secondary">
                        Handle: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-brand-purple-primary">{req.username}</code> • Mobile: {req.mobile}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req)}
                        className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-green-700 transition"
                      >
                        Approve Member
                      </button>
                      <button
                        onClick={() => handleReject(req)}
                        className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-text-secondary">Primary Expertise: </span>
                      <span className="font-bold text-brand-purple-primary bg-purple-50 px-2 py-0.5 rounded">{req.primaryExpertise}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-text-secondary">Skillsets Selected: </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {req.skills?.map((skill, idx) => (
                          <span key={idx} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-text-primary font-medium">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected Crew Detail Drawer */}
      {selected && activeTab === "members" && (
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
                <p className="text-xs text-text-secondary">{selected.primaryRole}</p>
                <span className="mt-1 inline-block text-xs text-text-secondary font-medium">{selected.status}</span>
              </div>
            </div>

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

            <div className="rounded-xl border border-border-default p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Contact Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-text-tertiary">Phone</p><p className="font-semibold text-text-primary">{selected.phone}</p></div>
                <div><p className="text-text-tertiary">Email</p><p className="font-semibold text-text-primary">{selected.email}</p></div>
              </div>
            </div>

            <div className="rounded-xl border border-border-default bg-surface-app p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">Crew Login Handle</h3>
              <p className="font-mono text-sm font-bold text-brand-purple-primary bg-white rounded-lg border border-border-default px-3 py-2">
                {selected.crewHandle}
              </p>
              <p className="mt-2 text-[10px] text-text-tertiary">This is the login handle this crew member uses to access the system.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
