"use client";

import { useState } from "react";
import Link from "next/link";

interface SystemComponent {
  name: string;
  type: string;
  targetStack: string;
  status: "ACTIVE" | "PENDING_PROVISION" | "CONFIGURED";
  description: string;
}

const SYSTEM_COMPONENTS: SystemComponent[] = [
  {
    name: "@focoman/types",
    type: "Shared Package",
    targetStack: "TypeScript",
    status: "ACTIVE",
    description: "Domain interfaces for Order, Studio, StudioMember, Customer, Task per Product Discovery spec.",
  },
  {
    name: "@focoman/domain",
    type: "Shared Package",
    targetStack: "TypeScript",
    status: "ACTIVE",
    description: "Pure domain logic: 3-state order lifecycle, dynamic workflow tasks generator, order completion validator.",
  },
  {
    name: "@focoman/validation",
    type: "Shared Package",
    targetStack: "Zod",
    status: "ACTIVE",
    description: "Zod validation schemas for order creation, resource assignment, task status update, payment verification.",
  },
  {
    name: "@focoman/db",
    type: "Shared Package",
    targetStack: "Firebase Admin SDK (server-only)",
    status: "ACTIVE",
    description: "Server-only database boundary guard protecting Cloud Firestore access from client bundles.",
  },
  {
    name: "@focoman/auth",
    type: "Shared Package",
    targetStack: "Firebase Auth",
    status: "ACTIVE",
    description: "Role-based authorization helpers for Studio Owner, Studio Member, and Customer Guest.",
  },
  {
    name: "Web Application",
    type: "Frontend",
    targetStack: "Next.js App Router",
    status: "ACTIVE",
    description: "Multi-tenant studio dashboards (OMS, CRM, ERP, WhatsApp) and customer tracking portal.",
  },
  {
    name: "Cloud Firestore",
    type: "Database",
    targetStack: "Google Cloud Firestore",
    status: "CONFIGURED",
    description: "NoSQL document database for studios, orders, members, tasks, and customers collections.",
  },
  {
    name: "Hosting & Runtime",
    type: "Infrastructure",
    targetStack: "Vercel / Cloud Run",
    status: "CONFIGURED",
    description: "Serverless web runtime with server actions and secure secret management.",
  },
];

export default function DevPortalPage() {
  const [activeTab, setActiveTab] = useState<"architecture" | "env">("architecture");

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950 px-8 py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-brand-purple-primary px-2 py-0.5 font-mono text-xs font-bold text-white">
                INTERNAL
              </span>
              <h1 className="text-xl font-black tracking-tight">Focoman Developer Diagnostics Portal</h1>
            </div>
            <p className="text-xs text-slate-400">
              Architecture & System Verification · Next.js Monorepo + Firebase / Cloud Run Target
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"
            >
              ← Back to App
            </Link>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-6 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`pb-2 transition ${
              activeTab === "architecture"
                ? "border-b-2 border-brand-purple-primary text-brand-purple-light"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Target Architecture Components ({SYSTEM_COMPONENTS.length})
          </button>
          <button
            onClick={() => setActiveTab("env")}
            className={`pb-2 transition ${
              activeTab === "env"
                ? "border-b-2 border-brand-purple-primary text-brand-purple-light"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Diagnostics & Environment
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-6xl mx-auto space-y-6">
        {activeTab === "architecture" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h2 className="text-sm font-bold text-slate-200">Architectural Status: Monorepo Migration Active</h2>
              <p className="text-xs text-slate-400 mt-1">
                All legacy Spring Boot, PostgreSQL relational SQL, and mock database dependencies have been eliminated.
                Shared domain types, pure logic engines, and server-only database boundaries are active.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SYSTEM_COMPONENTS.map((comp) => (
                <div key={comp.name} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white">{comp.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        comp.status === "ACTIVE"
                          ? "bg-emerald-900/60 text-emerald-400 border border-emerald-700"
                          : "bg-blue-900/60 text-blue-400 border border-blue-700"
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brand-purple-light">{comp.targetStack}</p>
                  <p className="text-xs text-slate-400">{comp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "env" && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-200">Client Runtime Diagnostics</h2>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="rounded-lg bg-slate-900 p-3">
                <span className="text-slate-500">Framework:</span>
                <p className="font-bold text-slate-200 mt-1">Next.js 15 (App Router)</p>
              </div>
              <div className="rounded-lg bg-slate-900 p-3">
                <span className="text-slate-500">Node Environment:</span>
                <p className="font-bold text-slate-200 mt-1">{process.env.NODE_ENV || "development"}</p>
              </div>
              <div className="rounded-lg bg-slate-900 p-3">
                <span className="text-slate-500">App Environment:</span>
                <p className="font-bold text-slate-200 mt-1">{process.env.NEXT_PUBLIC_APP_ENV || "local"}</p>
              </div>
              <div className="rounded-lg bg-slate-900 p-3">
                <span className="text-slate-500">Server DB Protection:</span>
                <p className="font-bold text-emerald-400 mt-1">Enforced (@focoman/db server-only)</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}