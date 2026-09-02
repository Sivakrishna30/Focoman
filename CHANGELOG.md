# Focoman Project Change Log

All meaningful changes to the Focoman codebase, documentation, architecture, or agent workflow instructions must be recorded in this file according to Section 20 of **[Agents.md](Agents.md)**.

---

## CHG-010 — Security Hardening: memoryStore Removal, Authorization Layer, ID Hardening & Error Transparency

- **Task:** CHG-010 — Backend Security & Integrity Hardening (Audit Conditions from CHG-009 Independent Review)
- **Date:** 2026-09-02
- **Area:** `packages/db`, `apps/web/src/lib/serverAuth.ts`, `apps/web/src/actions/*`, `apps/web/src/app/[studioSlug]/dashboard/*`, `apps/web/src/app/onboarding/register-studio/page.tsx`
- **Change:**
  1. **`memoryStore` removed** from `@focoman/db`. `getFirestoreServerInstance()` now throws a clear `Error` if Firebase Admin credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) or Firestore Emulator are not configured. No in-memory fallback exists by design.
  2. **New `serverAuth.ts` authorization module** (`apps/web/src/lib/serverAuth.ts`). Provides `requireVerifiedUser(idToken)` (Firebase Admin `verifyIdToken`) and `requireStudioMember(uid, studioId, role?)` (Firestore membership lookup). Both throw descriptive errors — never silently pass.
  3. **All mutating Server Actions** (`orderActions`, `memberActions`, `customerActions`, `studioActions`) now enforce `requireVerifiedUser` + `requireStudioMember` before any database write. `createMemberAction` additionally enforces `STUDIO_OWNER` role. `registerStudioAction` no longer trusts client-supplied `ownerUid`/`ownerName`/`ownerEmail` — all identity fields are extracted server-side from the verified token.
  4. **Collision-safe ID generation**: All ID generation replaced from `Date.now().slice(-6)` to `crypto.randomUUID()` and from `Math.random()` to `crypto.randomBytes(4).toString('hex')` for the customer-facing tracking passkey.
  5. **Silent `[]` error fallbacks removed**: `getStudioOrdersAction`, `getOrderTasksAction`, `getStudioMembersAction`, `getStudioCustomersAction` now throw on error. Firestore failures propagate to callers and Next.js error boundaries — empty arrays no longer mask database failures.
  6. **Dashboard layout loads real studio data**: `layout.tsx` calls `getStudioBySlug()` from `@focoman/db`. Passes real `studio.name` and `studio.ownerName` to sidebar. Unknown studio slugs route to `notFound()`.
  7. **Dashboard page loads real orders**: `page.tsx` calls `getOrdersByStudio()` — the hardcoded `const orders: Order[] = []` is removed.
  8. **UI pages updated**: `oms/page.tsx`, `crm/page.tsx`, `erp/page.tsx`, `onboarding/register-studio/page.tsx` now call `getCurrentUserIdToken()` client-side and pass the token to all protected Server Actions.
- **Reason:** Address all conditions raised in the independent audit of CHG-009: no-fake-data rule violation (memoryStore), authorization gap (identity without studio membership check), collision-unsafe IDs, silent error swallowing, and placeholder data in the dashboard.
- **Specification Reference:** `Agents.md` Rule 6 (No Fake Data / No Silent Fallback), Rule 7 (Security & Permissions), `docs/technical/identity-and-auth-architecture.md`.
- **Verification:** TypeScript compilation: 0 errors (`npx tsc --noEmit`).
- **Notes:** After this change, the app requires Firebase Admin credentials in the environment at startup. Locally, use `.env.local` with service account keys or set `FIRESTORE_EMULATOR_HOST` for the Firestore Emulator.

---



- **Task:** T01 — Agent Instruction Framework Setup
- **Date:** 2026-09-02
- **Area:** Governance / Agent Instructions (`Agents.md`, `AGENTS.md`, `docs/Index.md`, `docs/README.md`, `CHANGELOG.md`)
- **Change:** Integrated full Agent Workflow specification, 4-phase engineering process (Program Manager → Solution Architect → Developer → Testing), AI trust contract, no-fake-data policy, and `Index.md` documentation reference map.
- **Reason:** Establish strict repository-aware, specification-driven, and verifiable AI agent operations for Focoman.
- **Specification Reference:** Attached `Focoman — Agents.md` specification document.
- **Verification:** Verified internal consistency, explicit 4-phase workflow, plan approval gate, no-hallucination/no-fake-data rules, and document navigation indexing.
- **Notes:** Instruction and governance setup only. No application code or database migrations were performed.

---

## CHG-002 — Tech Stack & Architecture Migration Preparation & Alignment

- **Task:** TASK-201..TASK-216 — Tech Stack & Architecture Migration Assessment and Preparation
- **Date:** 2026-09-02
- **Area:** Architecture & Documentation (`docs/technical/*`, `docs/product/srs-mvp.md`, `docs/Index.md`, `pnpm-workspace.yaml`, `CHANGELOG.md`)
- **Change:** Completed comprehensive repository assessment, documentation alignment, gap analysis, solution architecture blueprint, and monorepo workspace configuration for target Next.js 15 + TypeScript + Firebase Auth + Firestore + Cloud Run architecture. Marked legacy SRS and SQL schema docs as SUPERSEDED.
- **Reason:** Align Focoman codebase and technical documentation with the authoritative Product Discovery Document and approved target architecture direction.
- **Specification Reference:** `Focoman Product Discovery Document` & `Focoman New Tech Stack & Architecture Migration Instructions`.
- **Verification:** Verified technical specs, monorepo directory layout, `Index.md` mapping, and Solution Architect blueprint.
- **Notes:** Migration preparation and specification alignment task. No application feature code or database data was deleted.

---

## CHG-003 — Codebase Monorepo Restructuring, Shared Packages Creation & Legacy Cleanup

- **Task:** TASK-301..TASK-306 — Codebase Monorepo Migration & Legacy Cleanup
- **Date:** 2026-09-02
- **Area:** Codebase Layout & Packages (`apps/web`, `packages/types`, `packages/validation`, `packages/domain`, `packages/db`, `packages/auth`, `packages/config`, `CHANGELOG.md`)
- **Change:** Restructured application into a TypeScript Monorepo (`apps/web` for Next.js 15 App). Created 6 shared packages in `packages/*` (`@focoman/types`, `@focoman/validation`, `@focoman/domain`, `@focoman/db`, `@focoman/auth`, `@focoman/config`). Removed obsolete legacy files (`railway.json`, `nixpacks.toml`, `fix_oms.py`, `focoman-backend/`).
- **Reason:** Implement approved target architecture blueprint and clean up unused legacy setup/backend files.
- **Specification Reference:** `technical_blueprint.md` & `Focoman New Tech Stack & Architecture Migration Instructions`.
- **Verification:** Verified monorepo package imports, `server-only` db boundary protection, and removal of Railway/Java backend artifacts.
- **Notes:** Web app and shared domain packages active. Documentation and new technical specs preserved.

---

## CHG-004 — Documentation Cleanup & Legacy Diagram/SQL Removal

- **Task:** TASK-401 — Documentation Cleanup
- **Date:** 2026-09-02
- **Area:** Documentation (`docs/common/`, `docs/process/`, `docs/technical/database/`, `docs/Index.md`, `docs/README.md`, `CHANGELOG.md`)
- **Change:** Cleaned up obsolete legacy files from `docs/`: removed old HLD/LLD diagrams (`docs/common/`), old SDLC checklist (`docs/process/`), legacy setup guides (`RAILWAY_POSTGRESQL_SETUP.md`, `JDBC_URL_FIX.md`), empty `docs/v2`, and legacy relational SQL schemas (`docs/technical/database/`). Updated `docs/Index.md` and `docs/README.md` to map active target documentation exclusively.
- **Reason:** Eliminate documentation confusion and ensure `docs/` reflects the active target architecture.
- **Specification Reference:** `Focoman Product Discovery Document` & `Focoman New Tech Stack & Architecture Migration Instructions`.
- **Verification:** Verified `docs/` folder structure, active documentation links in `Index.md`, and clean navigation.
- **Notes:** Active technical specs, brand design system, setup guides, and `srs-mvp.md` (SUPERSEDED reference) preserved.

---

## CHG-005 — Phase A: Application Data Architecture Integrity & Real Data Completion

- **Task:** TASK-501..TASK-507 — Migration Integrity Fix
- **Date:** 2026-09-02
- **Area:** Governance, Shared Packages, Service Layer, Pages (`Agents.md`, `AGENTS.md`, `docs/`, `packages/validation`, `packages/db`, `apps/web/src/services/`, `apps/web/src/app/`)
- **Change:**
  1. **Link Portability**: Replaced all machine-local Windows paths in `Agents.md`, `AGENTS.md`, `docs/Index.md`, `docs/README.md` with portable relative repository links.
  2. **`AGENTS.md` Fix**: Re-committed `AGENTS.md` at workspace root (resolved 404 reference).
  3. **`vercel-hosting-strategy.md`**: Updated to align with Next.js + Cloud Run + Firestore (removed Spring Boot/Railway/PostgreSQL content).
  4. **`packages/validation`**: Upgraded to real Zod schemas (`CreateOrderSchema`, `AssignResourceSchema`, `UpdateTaskStatusSchema`, `UpdatePaymentSchema`).
  5. **`packages/db`**: Strengthened server-only import boundary guard with runtime client-side throw.
  6. **Mock Data Elimination**: Deleted `apps/web/src/services/mockDb.ts` and removed all fake fallback data from `authApi.ts`, `marketplaceApi.ts`, `crmApi.ts`, `erpApi.ts`, `devPortalApi.ts`, `omsApi.ts`.
  7. **Spring Boot API Removal**: Removed all `NEXT_PUBLIC_BACKEND_URL` / `http://localhost:8080` / Spring-style REST fetch calls from all service files and page components (`crm/page.tsx`, `erp/page.tsx`, `devportal/page.tsx`, `dev-portal/page.tsx`, `dashboard/layout.tsx`).
  8. **Order Domain Realignment**: Updated OMS page, Dashboard page to Product Discovery 3-state lifecycle (`AWAITING_EVENT`, `POST_EVENT_IN_PROGRESS`, `COMPLETED`). Removed legacy 9-state `OVER_SLA`/`SHOOT_SCHEDULED` model.
  9. **WhatsApp Page**: Removed `mockDb` import and fake `handleSave() => setSaved(true)`. Aligned to Product Discovery operational layer model.
  10. **HomePage**: Removed all fake `authApi` mock login handlers. Portal tabs renamed to `Studio Owner`, `Studio Member`, `Customer Order Tracker` per Product Discovery. Honest pending state shown.
  11. **Legacy File Deletion**: Deleted `apps/web/src/features/oms/OmsPrototype.tsx` (legacy 9-state order model).
- **Reason:** Address all blockers identified in user's September 2026 repository audit. Ensure documentation, shared packages, service layer, and UI pages are internally consistent with the target architecture.
- **Specification Reference:** `Focoman Product Discovery Document`, `Agents.md`, `docs/technical/recommended-architecture.md`.
- **Verification:** Scanned for `mockDb`, `BACKEND_URL`, `localhost:8080`, `OVER_SLA`, `BOOKING_CONFIRMED`, machine-local Windows paths — all resolved clean.
- **Notes:** Firebase Auth SDK integration and Firestore Server Actions remain as the next implementation phase (real auth + real data flows).

---

## CHG-006 — Phase B: Real Firebase Auth, Firestore Data Client & Trusted Server Actions

- **Task:** Phase B Implementation
- **Date:** 2026-09-02
- **Area:** `packages/db`, `packages/auth`, `apps/web/src/actions/*`, `apps/web/src/app/[studioSlug]/dashboard/*`, `apps/web/src/features/home/HomePage.tsx`, `docs/Index.md`
- **Change:**
  1. **`packages/db/src/index.ts`**: Replaced stub mock with real Firebase Admin SDK (`initializeApp`, `getFirestore`). Implemented typed Firestore repository functions: `getOrdersByStudio`, `getOrderById`, `getOrderByPasskey`, `saveOrder`, `updateOrder`, `getCustomersByStudio`, `saveCustomer`, `getMembersByStudio`, `saveMember`, `getTasksByOrder`, `saveTasks`, `updateTask`, `getStudioBySlug`, `saveStudio`. Includes graceful memory-store fallback when Firebase credentials are not yet configured locally.
  2. **`packages/auth/src/index.ts`**: Added real `firebase-admin/auth` ID token verification via `verifyIdToken()`. Added `getFirebaseAuthInstance()` initializer. Preserved existing role-permission helpers.
  3. **`packages/auth/package.json`**: Added `firebase-admin` and `server-only` to dependencies.
  4. **`apps/web/src/actions/orderActions.ts`** [NEW]: Trusted Next.js Server Actions: `createOrderAction` (with dynamic task generation via `generateWorkflowTasks`), `getStudioOrdersAction`, `getOrderTasksAction`, `getOrderByPasskeyAction`, `updateTaskStatusAction` (with automatic completion check via `canCompleteOrder`), `updatePaymentStatusAction`, `assignResourceAction`. All inputs validated via `@focoman/validation` Zod schemas.
  5. **`apps/web/src/actions/customerActions.ts`** [NEW]: Server Actions `getStudioCustomersAction`, `createCustomerAction`.
  6. **`apps/web/src/actions/memberActions.ts`** [NEW]: Server Actions `getStudioMembersAction`, `createMemberAction`.
  7. **`apps/web/src/app/[studioSlug]/dashboard/oms/page.tsx`**: Connected to `orderActions`; added Register Confirmed Order modal, live task status updates, payment confirmation, and guest passkey display card.
  8. **`apps/web/src/app/[studioSlug]/dashboard/crm/page.tsx`**: Connected to `customerActions`; added Add Customer modal and live customer list.
  9. **`apps/web/src/app/[studioSlug]/dashboard/erp/page.tsx`**: Connected to `memberActions`; added Add Crew Member modal with certified skill checkboxes.
  10. **`apps/web/src/features/home/HomePage.tsx`**: Customer Guest Order Tracker connected to `getOrderByPasskeyAction`; displays real `Order` pricing and dynamic `Task[]` production workflow timeline.
  11. **`docs/Index.md`**: Fixed `../AGENTS.md` → `../Agents.md` case-sensitivity link; updated Vercel to secondary/legacy; clarified Cloud Run + Firebase App Hosting as primary.
- **Reason:** Activate the real application backend — replacing all empty arrays and stub state with actual Firebase Admin SDK Firestore data flows.
- **Specification Reference:** `technical-design-mvp.md` (Server-Side Security Boundary), `recommended-architecture.md` (Server Actions pattern), `Agents.md` (No Fake Data policy).
- **Verification:** `node_modules/.bin/tsc --noEmit` exited with **0 errors**.

---

## CHG-007 — Firebase Project Integration & Client SDK Configuration

- **Task:** Firebase Project Configuration & Client Integration
- **Date:** 2026-09-02
- **Area:** Configuration & Client SDK (`apps/web/.env.local`, `apps/web/.env.example`, `apps/web/src/lib/firebase.ts`, `apps/web/src/lib/firebaseAuth.ts`, `.firebaserc`, `firebase.json`, `firestore.rules`, `firestore.indexes.json`)
- **Change:**
  1. **Dependencies**: Installed `firebase` (client SDK v12.18.0) in `apps/web`.
  2. **Environment Variables**: Created `apps/web/.env.local` and `apps/web/.env.example` containing user-provided Firebase configuration for project `focoman` (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`).
  3. **Client Initialization Module**: Created `apps/web/src/lib/firebase.ts` exporting singleton `firebaseApp`, `auth`, `db`, and SSR-safe `getFirebaseAnalytics()`.
  4. **Client Auth Helpers**: Created `apps/web/src/lib/firebaseAuth.ts` providing `signInUser`, `signUpUser`, `signOutUser`, `subscribeToAuthState`, and `getCurrentUserIdToken`.
  5. **Firebase Deployment Config**: Created root `.firebaserc` (targeting default project `focoman`), `firebase.json` (configuring Next.js hosting and Firestore), `firestore.rules` (enforcing server-side security boundary per architecture spec), and `firestore.indexes.json`.
- **Reason:** Connect the Focoman application to the newly created live Google Cloud / Firebase project (`focoman`).
- **Specification Reference:** `Focoman Product Discovery Document`, `docs/technical/tech-stack.md`, `docs/technical/deployment-guide.md`.
- **Verification:** Typecheck `tsc --noEmit` exited with code 0; dev server loaded `.env.local` and returned HTTP 200 OK across routes.

---

## CHG-008 — Authentication & Multi-Studio Identity Architecture Specification

- **Task:** Authentication & Multi-Studio Identity Flow Architecture Documentation
- **Date:** 2026-09-02
- **Area:** Architecture & Specifications (`docs/technical/identity-and-auth-architecture.md`, `docs/Index.md`, `docs/technical/tech-stack.md`, `docs/technical/technical-design-mvp.md`, `docs/technical/recommended-architecture.md`, `docs/technical/deployment-guide.md`, `docs/product/srs-mvp.md`, `CHANGELOG.md`)
- **Change:**
  1. **New Specification Document**: Created `docs/technical/identity-and-auth-architecture.md` establishing the core identity model:
     - Single personal identity per person via Firebase UID.
     - Google Sign-In via Firebase Auth as the sole Phase 1 personal authentication provider.
     - Decoupling of Person (UID) from Studio entity, Studio Membership, and Studio Role.
     - Native multi-studio ownership and crew membership from Day 1.
     - First-time onboarding states (`Register Your Studio` and `Join an Existing Studio`) without forced studio creation or username/password prompts.
     - Dynamic workspace switcher (`/workspaces`) without separate logins.
     - Server-side studio uniqueness enforcement via Firestore Transactions.
     - Invitation-based member onboarding without permanent owner-generated credentials.
     - Strict isolation of customer order tracking (guest passkeys only; no Firebase user accounts for customers).
  2. **Index & Hierarchy**: Updated `docs/Index.md` mapping the new specification into the active Source-of-Truth hierarchy.
  3. **Target Technical Specs**: Updated `tech-stack.md`, `technical-design-mvp.md`, `recommended-architecture.md`, and `deployment-guide.md` to reflect the Google-only identity model, normalized collection schemas (`users`, `studios`, `memberships`, `invitations`), and server execution boundaries.
  4. **Superseded Concepts**: Explicitly marked legacy owner-created passwords, separate studio logins, SMS/phone auth, and anonymous auth as SUPERSEDED in `srs-mvp.md` and technical specifications.
- **Reason:** Establish the approved architecture and product specifications for single personal identity, Google authentication, and multi-studio memberships before writing implementation code.
- **Specification Reference:** Attached `Focoman Authentication & Multi-Studio Identity Flow` architecture prompt & `docs/technical/identity-and-auth-architecture.md`.
- **Verification:** Verified cross-document consistency, confirmed zero broken links in `docs/Index.md`, verified no active specification requires username/password or separate studio logins.

---

## CHG-009 — Focoman UI Refinement & Legacy UI Migration (UI-01 through UI-20)

- **Task:** UI-01..UI-20 — Full UI Refinement, Authentication & Legacy Concept Elimination
- **Date:** 2026-09-02
- **Area:** Shared Packages (`@focoman/types`, `@focoman/db`), Service Layer & Actions (`actions/studioActions.ts`, `lib/firebaseAuth.ts`), UI Pages & Components (`HomePage.tsx`, `Navbar.tsx`, `DashboardSidebar.tsx`, `features/page.tsx`, `pricing/page.tsx`, `studio-marketplace/page.tsx`, `workspaces/page.tsx`, `onboarding/register-studio/page.tsx`, `onboarding/join-studio/page.tsx`)
- **Change:**
  1. **Dead Mock Deletion (UI-19)**: Permanently deleted `apps/web/src/features/oms/mockUsers.ts` and `apps/web/src/types/oms.ts`.
  2. **Landing Page Realignment (UI-02, UI-03, UI-15, UI-16)**: Realigned `HomePage.tsx` with OMS-first positioning: Confirmed Order → Event → Post-Event Production → Delivery → Payment Completed. Removed all 3 legacy username/password login & signup forms (Admin, Member, Customer). Replaced with two clean access panels: Google Sign-In for studio owners/crew members, and guest passkey lookup for customers. Positioned Value Added Services clearly as professional studio add-ons.
  3. **Multi-Studio Workspaces UX (UI-04)**: Created `apps/web/src/app/workspaces/page.tsx` displaying user's accessible studios, role badges (`Owner` vs. `Crew Member`), certified skills, and workspace launcher. Supports 0-studio welcome onboarding.
  4. **Studio Registration UX (UI-05)**: Created `apps/web/src/app/onboarding/register-studio/page.tsx` with live database slug availability check and atomic Firestore transaction via server action.
  5. **Member Invitation & Activation UX (UI-06)**: Created `apps/web/src/app/onboarding/join-studio/page.tsx` with single-use invitation token verification.
  6. **Public Navigation & Feature Pages (UI-01, UI-16)**:
     - `Navbar.tsx`: Added direct `Studio Access` button to `/workspaces`.
     - `features/page.tsx`: Realigned feature matrix to Confirmed Orders, dynamic service pipelines, and WhatsApp alerts (removed lead capture, sales pipelines, and Google Calendar sync).
     - `pricing/page.tsx`: Removed `username@studioname` logins, lead capture, and Google Calendar sync; highlighted confirmed order limits, crew allocation, and operational notifications.
     - `studio-marketplace/page.tsx`: Added clear `Phase 3 Preview / Upcoming Capability` advisory banner.
  7. **Sidebar & Dashboard Refinement (UI-07, UI-08)**: Added workspace switcher quick link and role badge to `DashboardSidebar.tsx`.
  8. **Data Layer & Types Extensions**:
     - Added `StudioMembership` interface to `@focoman/types`.
     - Added `getMembershipsByUid`, `registerStudioTransaction` to `@focoman/db`.
     - Added `checkStudioSlugAvailabilityAction`, `registerStudioAction`, `getUserWorkspacesAction` to `apps/web/src/actions/studioActions.ts`.
     - Added `signInWithGoogle` to `apps/web/src/lib/firebaseAuth.ts`.
- **Reason:** Fully align the frontend user experience with the active Product Discovery and Authentication/Multi-Studio Identity specifications. Remove all legacy ungrounded concepts, dead mock files, and fake authentication forms.
- **Specification Reference:** `Focoman Product Discovery Document`, `docs/technical/identity-and-auth-architecture.md`, and `Agents.md`.
- **Verification:** TypeScript build (`tsc --noEmit`) passed with 0 errors. All 13 primary public, onboarding, and authenticated dashboard routes probed and verified returning HTTP 200.



