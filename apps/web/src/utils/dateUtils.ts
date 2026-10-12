export interface EventDaysRemaining {
  diffDays: number;
  label: string; // e.g. "in 18 days", "in 1 day", "today", "18 days ago"
  display: string; // e.g. "In 18 days", "Tomorrow", "Today", "18 days ago"
  postEventDays: number; // diffDays + 1: Post-event production begins the next day after event
  postEventLabel: string; // e.g. "in 19 days", "in 2 days", "in 1 day"
}

/**
 * Calculates calendar days remaining until an event date.
 * Post-event production commences the day after the event (diffDays + 1).
 * Handles both "YYYY-MM-DD" and ISO strings safely without timezone offset shifts.
 */
export function getEventDaysRemaining(dateStr?: string | null): EventDaysRemaining | null {
  if (!dateStr) return null;
  const cleanStr = dateStr.trim();
  const parts = cleanStr.split("T")[0].split("-");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  const eventDate = new Date(year, month, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const postEventDays = diffDays + 1;
  let postEventLabel = "";
  if (postEventDays > 1) {
    postEventLabel = `in ${postEventDays} days`;
  } else if (postEventDays === 1) {
    postEventLabel = "in 1 day";
  } else if (postEventDays === 0) {
    postEventLabel = "starts today";
  } else {
    postEventLabel = `${Math.abs(postEventDays)} days ago`;
  }

  if (diffDays > 1) {
    return { diffDays, label: `in ${diffDays} days`, display: `In ${diffDays} days`, postEventDays, postEventLabel };
  } else if (diffDays === 1) {
    return { diffDays, label: "in 1 day", display: "Tomorrow", postEventDays, postEventLabel };
  } else if (diffDays === 0) {
    return { diffDays, label: "today", display: "Today", postEventDays, postEventLabel };
  } else if (diffDays === -1) {
    return { diffDays, label: "yesterday", display: "Yesterday", postEventDays, postEventLabel };
  } else {
    const absDays = Math.abs(diffDays);
    return { diffDays, label: `${absDays} days ago`, display: `${absDays} days ago`, postEventDays, postEventLabel };
  }
}

export interface OrderAgingBreakdown {
  totalAgeDays: number;
  studioDays: number;
  customerDays: number;
  isUpcoming: boolean;
  statusLabel: string;
}

/**
 * Calculates overall post-event order age, studio working days, and customer review pending days.
 * Age starts from the Event Date (when the event occurred) until today (or completion).
 */
export function calculateOrderAging(
  eventDateStr?: string | null,
  tasks: Array<{ status: string; createdAt?: string; updatedAt?: string }> = [],
  isCompleted: boolean = false,
  completedAt?: string | null
): OrderAgingBreakdown {
  if (!eventDateStr) {
    return {
      totalAgeDays: 0,
      studioDays: 0,
      customerDays: 0,
      isUpcoming: false,
      statusLabel: "Date not specified",
    };
  }

  const cleanStr = eventDateStr.trim();
  const parts = cleanStr.split("T")[0].split("-");
  if (parts.length !== 3) {
    return {
      totalAgeDays: 0,
      studioDays: 0,
      customerDays: 0,
      isUpcoming: false,
      statusLabel: "Invalid date",
    };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const eventDate = new Date(year, month, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check if upcoming
  if (eventDate.getTime() > today.getTime()) {
    const remainingDays = Math.round((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      totalAgeDays: 0,
      studioDays: 0,
      customerDays: 0,
      isUpcoming: true,
      statusLabel: `Event upcoming in ${remainingDays} days`,
    };
  }

  // Calculate overall days from event date to completion date (or today)
  const endDate = isCompleted && completedAt ? new Date(completedAt) : today;
  const totalMs = Math.max(0, endDate.getTime() - eventDate.getTime());
  const totalAgeDays = Math.round(totalMs / (1000 * 60 * 60 * 24));

  // Calculate task-level customer review days
  let customerDays = 0;
  for (const t of tasks) {
    if (t.status === "REVIEW") {
      const taskRefDate = t.updatedAt ? new Date(t.updatedAt) : t.createdAt ? new Date(t.createdAt) : today;
      const reviewDays = Math.max(1, Math.round((now.getTime() - taskRefDate.getTime()) / (1000 * 60 * 60 * 24)));
      customerDays = Math.max(customerDays, reviewDays);
    }
  }

  // Studio days = total age minus customer review time (minimum 0)
  const studioDays = Math.max(0, totalAgeDays - customerDays);

  return {
    totalAgeDays,
    studioDays,
    customerDays,
    isUpcoming: false,
    statusLabel: isCompleted
      ? `${totalAgeDays} days turnaround`
      : `${totalAgeDays} days in production`,
  };
}

/**
 * Calculates human-readable duration / aging badge for an individual task.
 */
export function calculateTaskAgeBadge(task: {
  status: string;
  createdAt?: string;
  updatedAt?: string;
}): { label: string; days: number; colorClass: string } {
  const now = new Date();
  const created = task.createdAt ? new Date(task.createdAt) : now;
  const updated = task.updatedAt ? new Date(task.updatedAt) : created;

  if (task.status === "COMPLETED") {
    const days = Math.max(1, Math.round((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      days,
      label: `Completed: ${days}d`,
      colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (task.status === "REVIEW") {
    const days = Math.max(1, Math.round((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      days,
      label: `Client Review: ${days}d`,
      colorClass: "bg-amber-50 text-amber-800 border-amber-200",
    };
  }

  if (task.status === "IN_PROGRESS" || task.status === "REWORK") {
    const days = Math.max(1, Math.round((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      days,
      label: `Studio: ${days}d`,
      colorClass: "bg-blue-50 text-brand-blue-primary border-blue-200",
    };
  }

  // ASSIGNED
  const days = Math.max(1, Math.round((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
  return {
    days,
    label: `Assigned: ${days}d`,
    colorClass: "bg-slate-50 text-slate-600 border-slate-200",
  };
}
