import { Navbar } from "@/components/Navbar";
import { getOrderByPasskeyAction } from "@/actions/orderActions";
import { notFound } from "next/navigation";
import { OrderStatus, TaskStatus } from "@focoman/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "Awaiting Event",
  POST_EVENT_IN_PROGRESS: "Post-Event In Progress",
  COMPLETED: "Completed",
};

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  ASSIGNED: "Pending",
  IN_PROGRESS: "In Progress",
  REVIEW: "Under Review",
  REWORK: "Revising",
  COMPLETED: "Completed",
};

export default async function TrackOrderPage({ params }: { params: Promise<{ passkey: string }> }) {
  const { passkey } = await params;
  
  const res = await getOrderByPasskeyAction(passkey);
  if (!res.success || !res.order) {
    notFound();
  }

  const order = res.order;
  const tasks = res.tasks || [];

  const isCompleted = order.orderStatus === "COMPLETED";

  return (
    <div className="min-h-screen bg-surface-app text-text-primary flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col p-4 py-12">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-divider pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
                  Order Tracking
                </span>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                  {order.eventType}
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                  Order Number: <span className="font-semibold text-text-primary">{order.orderNumber}</span>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-xs ${
                  isCompleted ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : 
                  order.orderStatus === "POST_EVENT_IN_PROGRESS" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                  "bg-sky-100 text-sky-800 border border-sky-300"
                }`}>
                  {STATUS_LABELS[order.orderStatus]}
                </div>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 mt-8">
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Event Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Customer</dt>
                    <dd className="font-semibold">{order.customer.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Date</dt>
                    <dd className="font-semibold">{new Date(order.eventDate).toLocaleDateString()}</dd>
                  </div>
                  {order.eventLocation && (
                    <div className="flex justify-between">
                      <dt className="text-text-secondary">Location</dt>
                      <dd className="font-semibold">{order.eventLocation}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Services</dt>
                    <dd className="font-semibold text-right max-w-[200px] truncate" title={order.services.join(", ")}>
                      {order.services.join(", ") || "None"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-primary mb-3">Payment Summary</h3>
                <div className="rounded-xl bg-slate-50 p-4 border border-border-divider">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-text-secondary">Total Value</dt>
                      <dd className="font-semibold text-text-primary">₹{order.pricing.finalConfirmedPrice}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-text-secondary">Advance Paid</dt>
                      <dd className="font-semibold text-emerald-600">₹{order.pricing.advanceAmount}</dd>
                    </div>
                    <div className="my-2 border-t border-border-divider pt-2 flex justify-between font-bold">
                      <dt className="text-text-primary">Remaining Balance</dt>
                      <dd className={order.pricing.remainingAmount > 0 ? "text-brand-orange-primary" : "text-emerald-600"}>
                        ₹{order.pricing.remainingAmount}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-bold text-text-primary mb-4 border-b border-border-divider pb-2">Production Status</h3>
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between rounded-xl border border-border-default p-4">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{task.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{task.serviceCategory}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        task.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                        task.status === "ASSIGNED" ? "bg-slate-100 text-slate-600" :
                        "bg-brand-blue-background text-brand-blue-primary"
                      }`}>
                        {TASK_STATUS_LABELS[task.status]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary italic">No production tasks have been created yet.</p>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-default bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-text-tertiary sm:px-6 lg:px-8">
          © {new Date().getFullYear()} ThreadSafe Focoman. All rights reserved. | Focus beyond the frames
        </div>
      </footer>
    </div>
  );
}
