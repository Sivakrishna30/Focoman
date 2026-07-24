"use client";

import { useState, useEffect, use } from "react";
import { crmApi, CustomerDTO } from "@/services/crmApi";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const SOURCE_COLORS: Record<string, string> = {
  INSTAGRAM: "bg-pink-100 text-pink-700",
  WEBSITE: "bg-brand-blue-background text-brand-blue-primary",
  REFERRAL: "bg-green-100 text-green-700",
  WALKIN: "bg-amber-100 text-amber-700",
  GOOGLE: "bg-red-100 text-red-700",
  WHATSAPP: "bg-emerald-100 text-emerald-700",
};

export default function CrmPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = use(params);
  const router = useRouter();
  const [studioId, setStudioId] = useState<string>("");
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [selected, setSelected] = useState<CustomerDTO | null>(null);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/studios/${encodeURIComponent(studioSlug)}`, { cache: "no-store" });
        if (!res.ok) { setError("Studio not found"); return; }
        const studio = await res.json();
        setStudioId(studio.studioId);
        const data = await crmApi.getCustomers(studio.studioId);
        setCustomers(data);
      } catch {
        setError("Unable to load CRM data from backend.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [studioSlug]);

  const filtered = customers.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === "ALL" || c.leadSource === sourceFilter;
    return matchSearch && matchSource;
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalRevenue, 0);
  const repeatClients = customers.filter(c => c.totalOrders > 1).length;
  const vipCount = customers.filter(c => c.tags && c.tags.includes("VIP")).length;

  if (loading) return <div className="p-8 text-sm text-text-secondary">Loading CRM data from database...</div>;
  if (error) return <div className="p-8 text-sm text-red-600">{error}</div>;

  return (
    <div className="flex h-full">
      {/* Customer List Panel */}
      <div className={`flex flex-col ${selected ? "w-1/2 border-r border-border-default" : "w-full"} h-full`}>
        <div className="border-b border-border-default bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-text-primary">Customer Relationship Management</h1>
              <p className="text-xs text-text-tertiary">{customers.length} customers · Database records</p>
            </div>
            <button className="rounded-xl bg-brand-orange-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600">
              + Add Customer
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search by name, mobile, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-orange-primary"
            />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-orange-primary"
            >
              <option value="ALL">All Sources</option>
              {["INSTAGRAM", "WEBSITE", "REFERRAL", "WALKIN", "GOOGLE", "WHATSAPP"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-surface-app border border-border-default px-3 py-1 text-[10px] font-bold text-text-secondary">
              Total Revenue: ₹{(totalRevenue / 1000).toFixed(0)}K
            </span>
            <span className="rounded-full bg-surface-app border border-border-default px-3 py-1 text-[10px] font-bold text-text-secondary">
              Repeat Clients: {repeatClients}
            </span>
            <span className="rounded-full bg-surface-app border border-border-default px-3 py-1 text-[10px] font-bold text-text-secondary">
              VIP: {vipCount}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {filtered.map((cus) => (
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-text-primary">{cus.name}</p>
                    {cus.tags && cus.tags.split(",").map((tag) => (
                      <span key={tag} className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${tag === "VIP" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-text-tertiary">{cus.mobile} {cus.email ? `· ${cus.email}` : ""}</p>
                  <p className="text-[10px] text-text-tertiary">{cus.city} · {cus.eventTypes?.replace(/,/g, ", ")}</p>
                </div>
                <div className="shrink-0 text-right space-y-1.5">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${SOURCE_COLORS[cus.leadSource]}`}>
                    {cus.leadSource}
                  </span>
                  <p className="text-xs font-bold text-brand-orange-primary">₹{cus.totalRevenue.toLocaleString()}</p>
                  <p className="text-[10px] text-text-tertiary">{cus.totalOrders} order{cus.totalOrders > 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Detail Panel */}
      {selected && (
        <div className="w-1/2 flex flex-col h-full overflow-y-auto bg-white">
          <div className="sticky top-0 z-10 border-b border-border-default bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-text-primary">{selected.name}</h2>
              <p className="text-xs text-text-tertiary">{selected.mobile}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-app"
            >
              Close
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-brand-orange-background/40 border border-orange-200 p-3 text-center">
                <p className="text-xl font-extrabold text-brand-orange-primary">{selected.totalOrders}</p>
                <p className="text-[10px] text-text-secondary">Total Orders</p>
              </div>
              <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
                <p className="text-xl font-extrabold text-green-700">₹{(selected.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-[10px] text-text-secondary">Lifetime Value</p>
              </div>
              <div className="rounded-xl bg-surface-app border border-border-default p-3 text-center">
                <p className="text-xs font-bold text-text-primary">{selected.leadSource}</p>
                <p className="text-[10px] text-text-secondary">Lead Source</p>
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Contact Details</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p className="text-text-tertiary">Mobile</p><p className="font-semibold text-text-primary">{selected.mobile}</p></div>
                <div><p className="text-text-tertiary">Email</p><p className="font-semibold text-text-primary">{selected.email || "—"}</p></div>
                <div><p className="text-text-tertiary">City</p><p className="font-semibold text-text-primary">{selected.city}</p></div>
                <div><p className="text-text-tertiary">Last Event</p><p className="font-semibold text-text-primary">{selected.lastEventDate}</p></div>
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Event Types Booked</h3>
              <div className="flex flex-wrap gap-2">
                {selected.eventTypes?.split(",").map((e) => (
                  <span key={e} className="rounded-full bg-brand-blue-background px-3 py-1 text-xs font-medium text-brand-blue-primary">
                    {e.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border-default p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Tags</h3>
                <button className="text-xs font-semibold text-brand-orange-primary hover:underline">+ Add Tag</button>
              </div>
              {selected.tags ? (
                <div className="flex flex-wrap gap-2">
                  {selected.tags.split(",").map((t) => (
                    <span key={t} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{t.trim()}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-tertiary">No tags added</p>
              )}
            </div>

            <div className="rounded-xl border border-border-default p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg bg-brand-orange-primary px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600">
                  New Order for Customer
                </button>
                <button className="rounded-lg border border-border-default px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-app">
                  Send WhatsApp
                </button>
                <button className="rounded-lg border border-border-default px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-app">
                  Edit Profile
                </button>
                <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
                  Delete Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}