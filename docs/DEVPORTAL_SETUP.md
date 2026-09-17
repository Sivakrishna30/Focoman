# DevPortal - Internal Engineering & Diagnostics System

**Document Type:** Internal Engineering Documentation  
**Status:** Active Target Specification  
**Project:** Focoman  
**Architecture:** Next.js 15 App Router & Firebase Platform  

---

## 1. Overview

The DevPortal is an internal engineering utility within Focoman designed to track platform tasks, monitor system status, and verify module readiness (OMS, CRM, ERP, WhatsApp, Auth).

It is accessible at:
- **Global Route**: `/devportal`
- **Studio Dashboard Route**: `/[studioSlug]/dashboard/dev-portal`

---

## 2. Features

### 2.1 Task Management
- **Full task table**: View engineering tasks categorized by module (`OMS`, `CRM`, `ERP`, `Auth`, `UI`, `Team`).
- **Status lifecycle**: Track tasks across `Open`, `In Progress`, `In Review`, `Testing`, `Done`, `Closed`.
- **Priority & Assignment**: Filter by priority (`Low`, `Medium`, `High`, `Critical`) and assigned engineer.
- **Inline status updates**: Update task progress directly in the interface.

### 2.2 System & Database Inspector
- **Architecture**: 100% Full-Stack TypeScript (Next.js 15 + Firestore).
- **Connection status**: Verifies Firestore database connectivity and Firebase Auth environment configuration.
- **Module metrics**: Real-time counts of confirmed orders, active workflow tasks, and registered studio workspaces.

---

## 3. Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────┐
│              DevPortal UI (React 19 / Tailwind)         │
│          apps/web/src/app/devportal/page.tsx            │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼ Server Actions
┌─────────────────────────────────────────────────────────┐
│               Server Execution Layer                    │
│          apps/web/src/services/devPortalApi.ts          │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼ packages/db (Server-Only)
┌─────────────────────────────────────────────────────────┐
│               Google Cloud Firestore                    │
│            Collection: /dev_tasks/{taskId}              │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Verification & Diagnostics

### Checking System Health
1. Open `http://localhost:3000/devportal`.
2. Observe the System Status panel:
   - **Green status**: Firebase project variables detected and Firestore accessible.
   - **Warning status**: Missing Firebase Admin environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).

### Creating a Diagnostic Task
1. Click **"+ New Task"**.
2. Enter task title, description, module (`OMS`), and priority.
3. Save task and verify it appears in the table.

---

## 5. Security Note

The DevPortal is restricted to internal team diagnostics and development testing. In production environments, access is guarded via Studio Owner credentials or environment flags (`NODE_ENV !== 'production'`).
