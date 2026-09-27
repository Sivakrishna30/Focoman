"use client";

import { useState } from "react";
import { MemberOrderSummary, MemberTaskSummary, TaskStatus } from "@focoman/types";
import { updateTaskStatusAction } from "@/actions/orderActions";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";

const TASK_STATUSES: TaskStatus[] = ["ASSIGNED", "IN_PROGRESS", "REVIEW", "REWORK", "COMPLETED"];

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  REVIEW: "In Review",
  REWORK: "Rework",
  COMPLETED: "Completed",
};

export function MemberWorkDashboardView({
  studioId,
  orders,
  initialTasks,
  hasCrewProfile,
}: {
  studioId: string;
  orders: MemberOrderSummary[];
  initialTasks: MemberTaskSummary[];
  hasCrewProfile: boolean;
}) {
  const { getIdToken } = useStudioWorkspace();
  const [tasks, setTasks] = useState(initialTasks);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateTaskStatus = async (task: MemberTaskSummary, status: TaskStatus) => {
    const idToken = await getIdToken(true);
    if (!idToken) {
      setErrorMessage("Your session has expired. Sign in again to update this task.");
      return;
    }

    setSavingTaskId(task.id);
    setErrorMessage(null);
    try {
      const result = await updateTaskStatusAction({
        taskId: task.id,
        orderId: task.orderId,
        studioId,
        idToken,
        status,
      });
      if (!result.success || !result.task) {
        setErrorMessage(result.error || "Could not update this task.");
        return;
      }
      setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status: result.task!.status } : item));
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Could not update this task.");
    } finally {
      setSavingTaskId(null);
    }
  };

  return (
    <section className="flex-1 overflow-y-auto bg-surface-app px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="border-b border-border-divider pb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue-primary">Member Workspace</span>
          <h1 className="mt-1 text-2xl font-extrabold text-text-primary">My Orders &amp; Tasks</h1>
          <p className="mt-1 text-sm text-text-secondary">Events and production tasks assigned to your crew profile.</p>
        </header>

        {errorMessage && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {!hasCrewProfile ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            Your studio membership is active, but it is not linked to an active crew profile yet. Ask the studio owner to check your invitation and team record.
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-default bg-white p-8 text-center">
            <h2 className="text-base font-bold text-text-primary">No assigned orders yet</h2>
            <p className="mt-1 text-sm text-text-secondary">Orders assigned to your crew profile will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderTasks = tasks
                .filter((task) => task.orderId === order.id)
                .sort((left, right) => left.sequenceOrder - right.sequenceOrder);

              return (
                <article key={order.id} className="border-b border-border-divider bg-white p-5 sm:p-6">
                  <div className="flex flex-col gap-3 border-b border-border-divider pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">{order.orderNumber}</p>
                      <h2 className="mt-1 text-lg font-bold text-text-primary">{order.eventType}</h2>
                      <p className="mt-1 text-sm text-text-secondary">
                        {new Date(`${order.eventDate}T00:00:00`).toLocaleDateString()} {order.eventLocation ? `· ${order.eventLocation}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-text-tertiary">{order.services.join(", ")}</p>
                    </div>
                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {order.orderStatus.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">My Tasks ({orderTasks.length})</h3>
                    {orderTasks.length ? (
                      <ul className="mt-3 divide-y divide-border-divider">
                        {orderTasks.map((task) => (
                          <li key={task.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{task.title}</p>
                              <p className="mt-0.5 text-xs text-text-tertiary">{task.serviceCategory}</p>
                            </div>
                            <label className="flex items-center gap-2 text-xs text-text-secondary">
                              <span className="sr-only">Status for {task.title}</span>
                              <select
                                aria-label={`Status for ${task.title}`}
                                value={task.status}
                                disabled={savingTaskId === task.id}
                                onChange={(event) => void updateTaskStatus(task, event.target.value as TaskStatus)}
                                className="rounded-md border border-border-default bg-white px-3 py-2 text-xs font-semibold text-text-primary disabled:opacity-60"
                              >
                                {TASK_STATUSES.map((status) => (
                                  <option key={status} value={status}>{TASK_STATUS_LABELS[status]}</option>
                                ))}
                              </select>
                            </label>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-text-secondary">You are assigned to this event; no production tasks are assigned to you yet.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
