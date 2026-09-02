const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  assignedTo: string | null;
  reportedBy: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, init);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const devPortalApi = {
  getAllTasks: () => request<TaskDTO[]>("/api/dev/tasks"),
  getTasksByStatus: (status: string) => request<TaskDTO[]>(`/api/dev/tasks/status/${encodeURIComponent(status)}`),
  getTasksByAssignee: (assignee: string) => request<TaskDTO[]>(`/api/dev/tasks/assignee/${encodeURIComponent(assignee)}`),
  createTask: (title: string, description: string, type: string, priority: string, reportedBy: string, module: string) =>
    request<TaskDTO>(`/api/dev/tasks?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${encodeURIComponent(type)}&priority=${encodeURIComponent(priority)}&reportedBy=${encodeURIComponent(reportedBy)}&module=${encodeURIComponent(module)}`, { method: "POST" }),
  updateTaskStatus: (taskId: string, status: string) =>
    request<TaskDTO>(`/api/dev/tasks/${encodeURIComponent(taskId)}/status?status=${encodeURIComponent(status)}`, { method: "PUT" }),
  assignTask: (taskId: string, assignedTo: string) =>
    request<TaskDTO>(`/api/dev/tasks/${encodeURIComponent(taskId)}/assign?assignedTo=${encodeURIComponent(assignedTo)}`, { method: "PUT" }),
  deleteTask: (taskId: string) =>
    request<void>(`/api/dev/tasks/${encodeURIComponent(taskId)}`, { method: "DELETE" }),
};
