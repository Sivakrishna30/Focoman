"use client";

import { useState, useEffect } from "react";
import { devPortalApi, TaskDTO } from "@/services/devPortalApi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const TYPE_COLORS: Record<string, string> = {
  BUG: "bg-red-100 text-red-700",
  FEATURE: "bg-blue-100 text-blue-700",
  ENHANCEMENT: "bg-purple-100 text-purple-700",
  TASK: "bg-gray-100 text-gray-700",
  TEAM: "bg-green-100 text-green-700",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-purple-100 text-purple-700",
  TESTING: "bg-yellow-100 text-yellow-700",
  DONE: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
};

export default function DevPortalPage() {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterModule, setFilterModule] = useState("ALL");
  const [filterAssignee, setFilterAssignee] = useState("ALL");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [showDbInspector, setShowDbInspector] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("TASK");
  const [formPriority, setFormPriority] = useState("MEDIUM");
  const [formModule, setFormModule] = useState("FRONTEND");
  const [reportedBy, setReportedBy] = useState("Developer");

  useEffect(() => {
    loadTasks();
    checkDbConnection();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await devPortalApi.getAllTasks();
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const checkDbConnection = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/actuator/health`);
      if (response.ok) {
        const health = await response.json();
        setDbStatus(health);
      }
    } catch {
      setDbStatus({ status: "DOWN" });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await devPortalApi.createTask(formTitle, formDescription, formType, formPriority, reportedBy, formModule);
      setFormTitle("");
      setFormDescription("");
      setFormType("TASK");
      setFormPriority("MEDIUM");
      setFormModule("FRONTEND");
      setShowCreateForm(false);
      await loadTasks();
    } catch {
      alert("Failed to create task");
    }
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    try {
      await devPortalApi.updateTaskStatus(taskId, status);
      await loadTasks();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleAssign = async (taskId: string, assignee: string) => {
    try {
      await devPortalApi.assignTask(taskId, assignee);
      await loadTasks();
    } catch {
      alert("Failed to assign task");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await devPortalApi.deleteTask(taskId);
      await loadTasks();
    } catch {
      alert("Failed to delete task");
    }
  };

  const filtered = tasks.filter((task) => {
    const matchStatus = filterStatus === "ALL" || task.status === filterStatus;
    const matchModule = filterModule === "ALL" || task.module === filterModule;
    const matchAssignee = filterAssignee === "ALL" || task.assignedTo === filterAssignee;
    return matchStatus && matchModule && matchAssignee;
  });

  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignedTo).filter(Boolean)));

  if (loading) return <div className="p-8 text-sm text-text-secondary">Loading dev portal...</div>;
  if (error) return <div className="p-8 text-sm text-red-600">{error}</div>;

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex flex-col ${showCreateForm ? "w-3/4 border-r border-border-default" : "w-full"} h-full`}>
        <div className="border-b border-border-default bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-text-primary">Dev Portal - Task Management</h1>
              <p className="text-xs text-text-tertiary">{tasks.length} total tasks · Bug tracking & project management</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDbInspector(!showDbInspector)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                {showDbInspector ? "Hide" : "Show"} DB Inspector
              </button>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="rounded-xl bg-brand-purple-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700"
              >
                + New Task
              </button>
            </div>
          </div>

          {/* Database Status */}
          {dbStatus && (
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${dbStatus.status === "UP" ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="text-[10px] font-semibold text-text-secondary">
                Database: {dbStatus.status === "UP" ? "Connected" : "Disconnected"}
              </span>
            </div>
          )}

          {/* Filters */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="TESTING">Testing</option>
              <option value="DONE">Done</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
            >
              <option value="ALL">All Modules</option>
              <option value="FRONTEND">Frontend</option>
              <option value="BACKEND">Backend</option>
              <option value="CRM">CRM</option>
              <option value="ERP">ERP</option>
              <option value="OMS">OMS</option>
              <option value="AUTH">Auth</option>
              <option value="UI">UI</option>
              <option value="TEAM">Team</option>
            </select>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
            >
              <option value="ALL">All Assignees</option>
              {uniqueAssignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-surface-app border border-border-default px-3 py-1 text-[10px] font-bold text-text-secondary">
              Open: {tasks.filter(t => t.status === "OPEN").length}
            </span>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[10px] font-bold text-blue-700">
              In Progress: {tasks.filter(t => t.status === "IN_PROGRESS").length}
            </span>
            <span className="rounded-full bg-green-50 border border-green-200 px-3 py-1 text-[10px] font-bold text-green-700">
              Done: {tasks.filter(t => t.status === "DONE").length}
            </span>
            <span className="rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-[10px] font-bold text-purple-700">
              Team: {tasks.filter(t => t.module === "TEAM").length}
            </span>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-border-default">
                <tr>
                  <th className="px-4 py-3 font-bold text-text-secondary">ID</th>
                  <th className="px-4 py-3 font-bold text-text-secondary">Title</th>
                  <th className="px-4 py-3 font-bold text-text-secondary">Type</th>
                  <th className="px-4 py-3 font-bold text-text-secondary">Priority</th>
                  <th className="px-4 py-3 font-bold text-text-secondary">Status</th>
                  <th className="px-4 py-3 font-bold text-text-secondary">Assigned To</th>
                  <th className="px-4 py-3 font-bold text-text-secondary">Module</th>
                  <th className="px-4 py-3 font-bold text-text-secondary">Reported By</th>
                  <th className="px-4 py-3 font-bold text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {filtered.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-text-tertiary">{task.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-text-primary">{task.title}</div>
                      <div className="text-[10px] text-text-tertiary line-clamp-1">{task.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TYPE_COLORS[task.type]}`}>
                        {task.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                        className="rounded-lg border border-border-default px-2 py-1 text-[10px] font-semibold outline-none focus:border-brand-purple-primary"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="TESTING">Testing</option>
                        <option value="DONE">Done</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Unassigned"
                        defaultValue={task.assignedTo ?? ""}
                        onBlur={(e) => handleAssign(task.id, e.target.value)}
                        className="rounded-lg border border-border-default px-2 py-1 text-[10px] font-semibold outline-none focus:border-brand-purple-primary w-28"
                      />
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{task.module}</td>
                    <td className="px-4 py-3 text-text-secondary">{task.reportedBy}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Task Panel */}
      {showCreateForm && (
        <div className="w-1/4 flex flex-col h-full overflow-y-auto bg-white">
          <div className="border-b border-border-default px-6 py-5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">Create New Task</h2>
            <button onClick={() => setShowCreateForm(false)} className="text-xs text-text-tertiary hover:text-text-primary font-bold">
              ✕ Close
            </button>
          </div>

          <form onSubmit={handleCreateTask} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
                placeholder="Brief task title"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Description</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                rows={4}
                className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
                placeholder="Detailed description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
                >
                  <option value="BUG">Bug</option>
                  <option value="FEATURE">Feature</option>
                  <option value="ENHANCEMENT">Enhancement</option>
                  <option value="TASK">Task</option>
                  <option value="TEAM">Team</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Priority</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Module</label>
                <select
                  value={formModule}
                  onChange={(e) => setFormModule(e.target.value)}
                  className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
                >
                  <option value="FRONTEND">Frontend</option>
                  <option value="BACKEND">Backend</option>
                  <option value="CRM">CRM</option>
                  <option value="ERP">ERP</option>
                  <option value="OMS">OMS</option>
                  <option value="AUTH">Auth</option>
                  <option value="UI">UI</option>
                  <option value="TEAM">Team</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Reported By</label>
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-purple-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-purple-primary px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-700"
            >
              Create Task
            </button>
          </form>
        </div>
      )}

      {/* Database Inspector Panel */}
      {showDbInspector && (
        <div className="w-1/3 flex flex-col h-full overflow-y-auto bg-gray-50 border-l border-border-default">
          <div className="border-b border-border-default px-6 py-5 flex items-center justify-between bg-white">
            <h2 className="text-sm font-bold text-text-primary">Database Inspector</h2>
            <button onClick={() => setShowDbInspector(false)} className="text-xs text-text-tertiary hover:text-text-primary font-bold">
              ✕ Close
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Connection Status */}
            <div className="bg-white rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold text-text-primary mb-3">Connection Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-secondary">Status</span>
                  <span className={`text-[10px] font-bold ${dbStatus?.status === "UP" ? "text-green-600" : "text-red-600"}`}>
                    {dbStatus?.status || "Unknown"}
                  </span>
                </div>
                {dbStatus?.components?.db && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-secondary">Database</span>
                      <span className="text-[10px] font-bold text-text-primary">
                        {dbStatus.components.db.status}
                      </span>
                    </div>
                    {dbStatus.components.db.details?.database && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-text-secondary">Type</span>
                        <span className="text-[10px] font-bold text-text-primary">
                          {dbStatus.components.db.details.database}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold text-text-primary mb-3">Table Statistics</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-secondary">Total Tasks</span>
                  <span className="text-[10px] font-bold text-text-primary">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-secondary">Open Tasks</span>
                  <span className="text-[10px] font-bold text-text-primary">
                    {tasks.filter(t => t.status === "OPEN").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-secondary">In Progress</span>
                  <span className="text-[10px] font-bold text-text-primary">
                    {tasks.filter(t => t.status === "IN_PROGRESS").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-secondary">Completed</span>
                  <span className="text-[10px] font-bold text-text-primary">
                    {tasks.filter(t => t.status === "DONE").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold text-text-primary mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {tasks
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className="text-[10px] border-l-2 border-brand-purple-primary pl-2">
                      <div className="font-semibold text-text-primary">{task.title}</div>
                      <div className="text-text-tertiary">
                        {new Date(task.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Database Info */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <h3 className="text-xs font-bold text-blue-900 mb-2">💡 Database Access</h3>
              <p className="text-[10px] text-blue-700 mb-2">
                To directly query the database, use Railway's SQL editor or connect via psql:
              </p>
              <code className="text-[10px] bg-blue-100 p-2 rounded block break-all text-blue-900">
                psql -h postgres.railway.internal -U postgres -d railway
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}