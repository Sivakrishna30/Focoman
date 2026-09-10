"use client";

import { useState, useEffect, useCallback, use, useMemo } from "react";
import { Customer, Order } from "@focoman/types";
import { getStudioCustomersAction, createCustomerAction } from "@/actions/customerActions";
import { getStudioOrdersAction } from "@/actions/orderActions";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";
import {
  isDemoStudio,
  getDemoCustomers,
  getDemoOrders,
  createDemoCustomer,
  subscribeToDemoStore,
} from "@/lib/demoStore";

export default function CrmPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const { idToken: workspaceToken, authLoading, getIdToken } = useStudioWorkspace();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const isDemo = isDemoStudio(studioSlug);

  // New Customer Modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const loadData = useCallback(async (tokenOverride?: string | null) => {
    try {
      setLoading(true);
      if (isDemo) {
        setCustomers(getDemoCustomers());
        setOrders(getDemoOrders());
        setLoading(false);
        return;
      }
      const token = tokenOverride ?? workspaceToken ?? (await getIdToken(false));
      if (!token) {
        setLoading(false);
        return;
      }
      const [customersData, ordersData] = await Promise.all([
        getStudioCustomersAction(studioSlug, token),
        getStudioOrdersAction(studioSlug, token)
      ]);
      setCustomers(customersData);
      setOrders(ordersData);
    } catch (err) {
      console.error("[CrmPage] Failed to load data:", err);
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

  const customerMetrics = useMemo(() => {
    const metrics: Record<string, { totalOrders: number; lifetimeValue: number; pendingReceivables: number; latestOrder: string | null }> = {};
    customers.forEach(c => {
      metrics[c.id] = { totalOrders: 0, lifetimeValue: 0, pendingReceivables: 0, latestOrder: null };
    });
    
    orders.forEach(o => {
      if (metrics[o.customer.id]) {
        metrics[o.customer.id].totalOrders += 1;
        metrics[o.customer.id].lifetimeValue += o.pricing.finalConfirmedPrice || 0;
        metrics[o.customer.id].pendingReceivables += o.pricing.remainingAmount || 0;
        
        if (!metrics[o.customer.id].latestOrder || new Date(o.createdAt) > new Date(metrics[o.customer.id].latestOrder!)) {
          metrics[o.customer.id].latestOrder = o.createdAt;
        }
      }
    });
    
    return metrics;
  }, [customers, orders]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    if (isDemo) {
      const res = createDemoCustomer({
        name: form.name,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
      });
      setIsSubmitting(false);
      if (res.success && res.customer) {
        setShowModal(false);
        setForm({ name: "", phone: "", email: "", address: "" });
        setCustomers(getDemoCustomers());
        setSelected(res.customer);
      } else {
        setModalError("Failed to add customer in demo mode");
      }
      return;
    }

    const token = await getIdToken(true);
    if (!token) {
      setModalError("Authentication error. Please sign in again.");
      setIsSubmitting(false);
      return;
    }

    const res = await createCustomerAction({
      idToken: token,
      studioId: studioSlug,
      name: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      address: form.address || undefined,
    });

    setIsSubmitting(false);

    if (res.success && res.customer) {
      setShowModal(false);
      setForm({ name: "", phone: "", email: "", address: "" });
      await loadData();
      setSelected(res.customer);
    } else {
      setModalError(res.error || "Failed to add customer");
    }
  };

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      (c.phone && c.phone.includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.address && c.address.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex h-full">
      {/* Customer List Panel */}
      <div className={`flex flex-col ${selected ? "w-1/2 border-r border-border-default" : "w-full"} h-full`}>
        <div className="border-b border-border-default bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-text-primary">Customer Relationship Management</h1>
              <p className="text-xs text-text-tertiary">Studio: {studioSlug} · {customers.length} Confirmed Client Records</p>
            </div>
            <button
              onClick={() => {
                setShowModal(true);
                setModalError(null);
              }}
              className="rounded-xl bg-brand-orange-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-orange-600"
            >
              + Add Customer
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search by name, phone, email, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-orange-primary"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-surface-app border border-border-default px-3 py-1 text-[10px] font-bold text-text-secondary">
              Total Clients: {customers.length}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {loading && customers.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading customers...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-default bg-white p-8 text-center text-xs text-text-tertiary">
              {search ? `No customer found matching "${search}".` : "No customers registered yet. Clients from confirmed orders appear here."}
            </div>
          ) : (
            filtered.map((cus) => {
              const metrics = customerMetrics[cus.id];
              return (
                <div
                  key={cus.id}
                  onClick={() => setSelected(cus.id === selected?.id ? null : cus)}
                  className={`cursor-pointer rounded-2xl border p-4 transition hover:shadow-sm ${
                    selected?.id === cus.id
                      ? "border-brand-orange-primary bg-brand-orange-background/20"
                      : "border-border-default bg-white hover:border-brand-orange-light"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-text-primary">{cus.name}</p>
                      <p className="text-xs text-text-tertiary">{cus.phone || "No phone registered"} {cus.email ? `· ${cus.email}` : ""}</p>
                      <div className="mt-2 flex gap-3 text-[10px] font-semibold text-text-tertiary">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>{metrics?.totalOrders || 0} Orders</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>₹{((metrics?.lifetimeValue || 0) / 1000).toFixed(1)}K LTV</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="inline-block rounded-full bg-surface-app border border-border-default px-2 py-0.5 text-[10px] font-bold text-text-secondary">
                        Registered: {cus.createdAt ? new Date(cus.createdAt).toLocaleDateString() : "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Customer Detail Panel */}
      {selected && (
        <div className="w-1/2 flex flex-col h-full overflow-y-auto bg-white">
          <div className="sticky top-0 z-10 border-b border-border-default bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-text-primary">{selected.name}</h2>
              <p className="text-xs text-text-tertiary">{selected.phone || "No phone registered"}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-app"
            >
              Close
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border-default p-4 bg-slate-50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-1">Total Lifetime Value</p>
                <p className="text-2xl font-extrabold text-text-primary">₹{customerMetrics[selected.id]?.lifetimeValue?.toLocaleString() || 0}</p>
                <p className="text-xs text-text-secondary mt-1">{customerMetrics[selected.id]?.totalOrders || 0} Confirmed Orders</p>
              </div>
              <div className="rounded-xl border border-border-default p-4 bg-slate-50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-1">Pending Dues</p>
                <p className={`text-2xl font-extrabold ${(customerMetrics[selected.id]?.pendingReceivables || 0) > 0 ? "text-brand-orange-primary" : "text-emerald-600"}`}>
                  ₹{customerMetrics[selected.id]?.pendingReceivables?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-text-secondary mt-1">Remaining Balance</p>
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Contact Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-text-tertiary">Phone</p><p className="font-semibold text-text-primary">{selected.phone || "—"}</p></div>
                <div><p className="text-text-tertiary">Email</p><p className="font-semibold text-text-primary">{selected.email || "—"}</p></div>
                <div className="col-span-2"><p className="text-text-tertiary">Address</p><p className="font-semibold text-text-primary">{selected.address || "—"}</p></div>
                <div><p className="text-text-tertiary">Registered Date</p><p className="font-semibold text-text-primary">{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "—"}</p></div>
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Order History</h3>
              <div className="space-y-3">
                {orders.filter(o => o.customer.id === selected.id).length > 0 ? (
                  orders.filter(o => o.customer.id === selected.id).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <div>
                        <p className="text-sm font-bold text-text-primary">{order.eventType}</p>
                        <p className="text-[10px] text-text-secondary mt-0.5">{order.orderNumber} · {new Date(order.eventDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-text-primary">₹{order.pricing.finalConfirmedPrice}</p>
                        <p className={`text-[10px] font-extrabold uppercase mt-0.5 ${order.orderStatus === 'COMPLETED' ? 'text-emerald-600' : 'text-sky-600'}`}>
                          {order.orderStatus.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-tertiary">No orders found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Customer Profile</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            {modalError && (
              <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-600">{modalError}</div>
            )}
            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anitha Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-orange-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-orange-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  placeholder="client@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-orange-primary"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700">Location / Address</label>
                <input
                  type="text"
                  placeholder="City, Area"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-orange-primary"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-orange-primary px-5 py-2 font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}