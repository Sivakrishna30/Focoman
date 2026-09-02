"use client";

import { useState, use } from "react";
import { Customer } from "@focoman/types";

export default function CrmPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [search, setSearch] = useState("");

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
              <p className="text-xs text-text-tertiary">Studio customer directory · Confirmed client records</p>
            </div>
            <button className="rounded-xl bg-brand-orange-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600">
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
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-default bg-white p-8 text-center text-xs text-text-tertiary">
              {search ? `No customer found matching "${search}".` : "No customers registered yet. Clients from confirmed orders appear here."}
            </div>
          ) : (
            filtered.map((cus) => (
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
                    {cus.address && <p className="text-[10px] text-text-tertiary">{cus.address}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-block rounded-full bg-surface-app border border-border-default px-2 py-0.5 text-[10px] font-bold text-text-secondary">
                      Registered: {cus.createdAt ? new Date(cus.createdAt).toLocaleDateString() : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            ))
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
            <div className="rounded-xl border border-border-default p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Contact Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-text-tertiary">Phone</p><p className="font-semibold text-text-primary">{selected.phone || "—"}</p></div>
                <div><p className="text-text-tertiary">Email</p><p className="font-semibold text-text-primary">{selected.email || "—"}</p></div>
                <div><p className="text-text-tertiary">Address</p><p className="font-semibold text-text-primary">{selected.address || "—"}</p></div>
                <div><p className="text-text-tertiary">Registered Date</p><p className="font-semibold text-text-primary">{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "—"}</p></div>
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Customer Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg bg-brand-orange-primary px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600">
                  New Order for Customer
                </button>
                <button className="rounded-lg border border-border-default px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-app">
                  Send WhatsApp Notification
                </button>
                <button className="rounded-lg border border-border-default px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-app">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}