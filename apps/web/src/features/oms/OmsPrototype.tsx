"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { fetchOrdersForUser, type OmsOrder } from "@/services/omsApi";
import type { MockUser } from "@/types/oms";
import { formatCurrency, formatDate, formatStatus } from "./formatters";
import { mockUsers } from "./mockUsers";

const statusStyles: Record<string, string> = {
  BOOKING_CONFIRMED: "bg-brand-blue-background text-brand-blue-primary",
  SHOOT_SCHEDULED: "bg-brand-purple-background text-brand-purple-primary",
  SHOOT_COMPLETED: "bg-brand-orange-background text-brand-orange-primary",
  EDITING: "bg-brand-purple-background text-brand-purple-primary",
  COMPLETED: "bg-green-50 text-status-success",
  DELIVERY_READY: "bg-green-50 text-status-success",
};

export function OmsPrototype() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [orders, setOrders] = useState<OmsOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchOrdersForUser(currentUser)
      .then(setOrders)
      .catch(() => setError("Unable to load orders from backend."))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  const totalAmount = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.amount), 0),
    [orders],
  );

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border-default bg-white px-5 py-6 lg:block">
        <div className="flex items-center gap-3">
          <Image src="/brand/focoman-logo.png" alt="Focoman" width={44} height={30} />
          <div>
            <p className="text-sm font-semibold">Focoman</p>
            <p className="text-xs text-text-tertiary">OMS Prototype</p>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          <button className="w-full rounded-md bg-brand-blue-background px-3 py-2 text-left text-sm font-medium text-brand-blue-primary">
            Orders
          </button>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border-default bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
                {currentUser.role.replace("_", " ")}
              </p>
              <h1 className="text-xl font-semibold">Orders Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-text-tertiary">{orders.length} visible orders</p>
              </div>
              <button
                className="rounded-md border border-border-default bg-white px-3 py-2 text-sm text-text-secondary"
                onClick={() => {
                  setCurrentUser(null);
                  setOrders([]);
                }}
              >
                Switch user
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <section className="grid gap-4 md:grid-cols-3">
            <Metric label="Visible Orders" value={orders.length.toString()} />
            <Metric label="Total Value" value={formatCurrency(totalAmount)} />
            <Metric label="Current Role" value={currentUser.role.replace("_", " ")} />
          </section>

          <section className="mt-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                className="h-10 rounded-md border border-border-default bg-white px-3 text-sm outline-none focus:border-brand-blue-light sm:w-80"
                placeholder="Search orders"
                type="search"
              />
              <select className="h-10 rounded-md border border-border-default bg-white px-3 text-sm outline-none focus:border-brand-blue-light">
                <option>All statuses</option>
                <option>Booking Confirmed</option>
                <option>Shoot Scheduled</option>
                <option>Editing</option>
                <option>Completed</option>
              </select>
            </div>

            {isLoading && <StateMessage message="Loading orders..." />}
            {error && <StateMessage message={error} />}
            {!isLoading && !error && <OrdersList orders={orders} />}
          </section>
        </main>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (user: MockUser) => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-app p-6">
      <section className="w-full max-w-md rounded-lg border border-border-default bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/brand/focoman-logo.png" alt="Focoman" width={58} height={38} />
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Focoman OMS</h1>
            <p className="text-sm text-text-secondary">Mock role login</p>
          </div>
        </div>

        <div className="space-y-3">
          {mockUsers.map((user) => (
            <button
              key={user.role}
              className="w-full rounded-md bg-brand-blue-primary px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-sky-600"
              onClick={() => onLogin(user)}
            >
              {user.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-default bg-white p-4">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function OrdersList({ orders }: { orders: OmsOrder[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-white">
      <div className="hidden grid-cols-[1.3fr_1.2fr_1fr_1.1fr_1fr_1fr] gap-4 border-b border-border-divider px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary md:grid">
        <span>Order ID</span>
        <span>Customer</span>
        <span>Event</span>
        <span>Status</span>
        <span>Employee</span>
        <span>Event Date</span>
      </div>
      <div className="divide-y divide-border-divider">
        {orders.map((order) => (
          <article
            key={order.orderId}
            className="grid gap-3 px-4 py-4 md:grid-cols-[1.3fr_1.2fr_1fr_1.1fr_1fr_1fr] md:items-center"
          >
            <div>
              <p className="text-xs text-text-tertiary md:hidden">Order ID</p>
              <p className="font-mono text-xs text-text-secondary">{order.orderId.slice(0, 8)}</p>
            </div>
            <Field label="Customer" value={order.customerName} />
            <Field label="Event" value={order.eventType} />
            <div>
              <p className="text-xs text-text-tertiary md:hidden">Status</p>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  statusStyles[order.status] ?? "bg-gray-50 text-text-secondary"
                }`}
              >
                {formatStatus(order.status)}
              </span>
            </div>
            <Field label="Employee" value={order.assignedEmployee} />
            <Field label="Event Date" value={formatDate(order.eventDate)} />
          </article>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-tertiary md:hidden">{label}</p>
      <p className="text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

function StateMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-border-default bg-white p-6 text-sm text-text-secondary">
      {message}
    </div>
  );
}
