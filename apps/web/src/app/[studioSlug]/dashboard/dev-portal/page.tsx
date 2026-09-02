"use client";

import { useState, useEffect, use } from "react";
import { devPortalApi, TaskDTO } from "@/services/devPortalApi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const TYPE_COLORS: Record<string, string> = {
  BUG: "bg-red-100 text-red-700",
  FEATURE: "bg-blue-100 text-blue-700",
  ENHANCEMENT: "bg-purple-100 text-purple-700",
  TASK: "bg-gray-100 text-gray-700",
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

export default function DevPortalPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterModule, setFilterModule] = useState("ALL");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("TASK");
  const [formPriority, setFormPriority] = useState("MEDIUM");
  const [formModule, setFormModule] = useState("FRONTEND");
  const [reportedBy, setReportedBy] = useState("Developer");

  useEffect(() => {
    loadTasks();
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

  const filtered = tasks.filter((task) => {
    const matchStatus = filterStatus === "ALL" || task.status === filterStatus;
    const matchModule = filterModule === "ALL" || task.module === filterModule;
    return matchStatus && matchModule;
  });

  if (loading) return <div className="p-8 text-sm text-text-secondary">Loading dev portal...</div>;
  if (error) return <div className="p-8 text-sm text-red-600">{error}</div>;

  return (
    <div className="flex h-full">
      {/* Task List Panel */}
      <div className={`flex flex-col ${showCreateForm ? "w-1/2 border-r border-border-default" : "w-full"} h-full`}>
        <div className="border-b border-border-default bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-text-primary">Dev Portal - Testing Mode</h1>
              <p className="text-xs text-text-tertiary">{tasks.length} total tasks · Issue tracker & task management</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="rounded-xl bg-brand-purple-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700"
            >
              + New Task
            </button>
          </div>

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
            </select>
          </div>

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
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-border-default bg-white p-5 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-text-tertiary">{task.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TYPE_COLORS[task.type]}`}>
                      {task.type}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-text-primary">{task.title}</h3>
                  <p className="mt-1 text-xs text-text-tertiary line-clamp-2">{task.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-text-tertiary">
                    <span>Module: <span className="font-semibold">{task.module}</span></span>
                    <span>Reported by: <span className="font-semibold">{task.reportedBy}</span></span>
                    {task.assignedTo && <span>Assigned: <span className="font-semibold">{task.assignedTo}</span></span>}
                  </div>
                </div>
                <div className="shrink-0">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_COLORS[task.status]}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
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
                <input
                  type="text"
                  placeholder="Assign to..."
                  defaultValue={task.assignedTo || ""}
                  onBlur={(e) => handleAssign(task.id, e.target.value)}
                  className="rounded-lg border border-border-default px-2 py-1 text-[10px] font-semibold outline-none focus:border-brand-purple-primary w-32"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Panel */}
      {showCreateForm && (
        <div className="w-1/2 flex flex-col h-full overflow-y-auto bg-white">
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
    </div>
  );
}