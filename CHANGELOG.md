# Focoman Project Change Log

All meaningful changes to the Focoman codebase, documentation, architecture, or agent workflow instructions must be recorded in this file according to Section 20 of **[Agents.md](Agents.md)**.

---

## CHG-025 — Hero Title Grammar Correction for Tamil

- **Task:** CHG-025 — Fix Duplicated/Awkward Words in Hero Statement for Tamil & Thanglish
- **Date:** 2026-09-16
- **Area:** `apps/web/src/context/LanguageContext.tsx`, `CHANGELOG.md`
- **Change:**
  - Corrected `hero.title_part1` and `hero.title_highlight` so that concatenating them in Tamil yields a grammatically flawless phrase: **"ஒளிப்பட நிலையங்களுக்கான முழுமையான வணிக இயக்க அமைப்பு"** ("For Photography Studios: A Complete Business Operating System") without repeating "ஒளிப்பட நிலையங்கள்".
- **Reason:** User feedback pointing out the duplicated/awkward statement in the Tamil hero title.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-024 — Tamil Character Language Badge Update

- **Task:** CHG-024 — Update Language Toggle Badge for Tamil to 'த'
- **Date:** 2026-09-16
- **Area:** `apps/web/src/context/LanguageContext.tsx`, `apps/web/src/components/LanguageSwitcher.tsx`, `CHANGELOG.md`
- **Change:**
  - Updated the language badge for Tamil mode to use the native Tamil character **`த`** instead of English letters `Tha`.
  - Updated Thanglish mode badge to **`த/En`**.
- **Reason:** Direct user request: "In language toggle button i still see Tha in english. I want த."
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-023 — Thanglish (Tha/En) Tamil Words Script Conversion

- **Task:** CHG-023 — Replace English Transliterations of Tamil Words in Thanglish Mode with Proper Tamil Script
- **Date:** 2026-09-16
- **Area:** `apps/web/src/context/LanguageContext.tsx`, `CHANGELOG.md`
- **Change:**
  - Updated all Thanglish (`thanglish` / `Tha/En`) translation strings so that all Tamil words are written in native Tamil script (e.g. `உங்கள்`, `மற்றும்`, `அனைத்தையும்`, `ஒரே இடத்தில்`, `சேமிக்கவும்`) rather than transliterated English characters (`unga`, `mattrum`, `ellathayum`, `ore idathula`, `pannunga`).
  - Retained industry-standard English technical loanwords (such as Studio, Orders, RAW, CRM, ERP, WhatsApp, Spreadsheet) alongside native Tamil script.
- **Reason:** Direct user request to ensure Tamil words in Thanglish are rendered in proper Tamil script instead of Romanized English letters.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-022 — Language Badges & Light/Dark Theme Switcher Refinement

- **Task:** CHG-022 — Streamline Theme Toggling to Light/Dark & Restore Short Language Badges
- **Date:** 2026-09-16
- **Area:** `apps/web/src/context/ThemeContext.tsx`, `apps/web/src/context/LanguageContext.tsx`, `apps/web/src/components/ThemeSwitcher.tsx`, `apps/web/src/components/LanguageSwitcher.tsx`, `CHANGELOG.md`
- **Change:**
  1. **Light / Dark Theme Switcher**:
     - Removed monochrome theme mode; theme cycling strictly toggles between Light (`☀️`) and Dark (`🌙`).
     - Matched the theme toggle button styling directly with the language switcher button (rounded-full pill, border, hover states, consistent padding).
  2. **Short Language Badges**:
     - Restored concise badge labels:
       - **`En`** for English mode
       - **`Tha`** for Tamil mode (translating the entire UI to Tamil)
       - **`Tha/En`** for Tanglish mode (spoken Tamil in English script)
- **Reason:** Direct user instructions to remove monochrome theme and restore short badge labels (`En`, `Tha`, `Tha/En`).
- **Specification Reference:** User prompt instruction.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-021 — Multilingual, Tanglish Standardization, Monochromatic Design System, & SSR Safety

- **Task:** CHG-021 — UI Language, Tanglish & Responsive Theme Professionalization + Runtime Error Fixes
- **Date:** 2026-09-16
- **Area:** `apps/web/src/context/ThemeContext.tsx`, `apps/web/src/context/LanguageContext.tsx`, `apps/web/src/components/ThemeSwitcher.tsx`, `apps/web/src/components/LanguageSwitcher.tsx`, `apps/web/src/components/Navbar.tsx`, `apps/web/src/components/DashboardTopNav.tsx`, `apps/web/src/components/DashboardSidebar.tsx`, `apps/web/src/app/globals.css`, `docs/tasks/ui-language-theme-professionalization/*`, `CHANGELOG.md`
- **Change:**
  1. **Monochromatic & Accessible Themes**:
     - Standardized Light, Dark, and Monochrome palettes across global CSS and components.
     - Dark mode surfaces configured with `#0B0F19` canvas, `#111827` card elevation, and `#1E293B` borders.
  2. **Multilingual & Standardized Tanglish**:
     - Built 3-mode intentional cycling: English (`EN`), Natural Tamil (`தமிழ்`), and Standardized Spoken Tanglish (`TG`).
     - Preserved industry terms (RAW, Album, Shoot, Deliverables, Invoice, WhatsApp) in standard English across modes.
     - Standardized single-word English UI action controls (Sign In, Back, Save, Cancel, Add, Edit, Delete).
  3. **Mobile-First Header & Navigation Density**:
     - Consolidated language and theme controls into minimal, accessible single-badge and icon buttons.
     - Verified zero horizontal overflow and responsive scaling across mobile breakpoints (320px–414px) and desktop.
  4. **SSR & Fast Refresh Runtime Safety**:
     - Added `typeof document !== "undefined"` and `typeof window !== "undefined"` defensive guards to avoid hydration errors during server/client handoffs and live hot reload.
- **Reason:** User request to resolve runtime warnings and professionalize language, theme, and mobile navigation density.
- **Specification Reference:** UI Language, Tanglish & Responsive Theme Professionalization task specification.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-020 — Studio Operations & Accounting Copy Refinement: Clean, Minimal Payroll & Auditing Focus

- **Task:** CHG-020 — Remove "Deployment Teams" and Streamline ERP Copy to Minimal, Professional Task Assignment, Payroll, and Auditing
- **Date:** 2026-09-16
- **Area:** `apps/web/src/features/home/HomePage.tsx`, `apps/web/src/app/features/page.tsx`, `docs/product/modular-evolution-and-marketplace.md`, `docs/product/srs-mvp.md`, `CHANGELOG.md`
- **Change:**
  1. **Eliminated Clumsy/Over-Engineered Jargon**:
     - Removed all references to "deployment teams" and military-sounding team units across the marketing site, feature cards, and SRS specifications.
  2. **Minimal, Professional Studio Operations Copy**:
     - Streamlined the module summary to: *"Assign shoot tasks, check crew calendar availability, track studio gear, and manage crew payroll and travel claims. Structured accounting and expense summaries keep your studio audit-ready, tracking true net profit and simplifying tax filing."*
     - Replaced team unit cards with **Crew Task Assignment & Ownership** and clean **Crew Payroll & Compensation** (tracking shoot wages, per-event day rates, travel claims, and standard tax withholdings).
- **Reason:** Direct user guidance: Eliminate clumsy phrasing, remove "deployment teams", and speak cleanly about assigning tasks, managing basic crew payroll, and accounting summaries that help studio owners with auditing and tax returns.
- **Specification Reference:** User prompt instruction.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-019 — Google Workspace Native Integration Architecture: Google Drive In-App Previews & Google Calendar Synchronization

- **Task:** CHG-019 — Architect and Integrate Google Drive & Google Calendar Across Modules with In-App Previews
- **Date:** 2026-09-16
- **Area:** `apps/web/src/features/home/HomePage.tsx`, `apps/web/src/app/features/page.tsx`, `apps/web/src/app/[studioSlug]/dashboard/oms/page.tsx`, `apps/web/src/app/track/[passkey]/page.tsx`, `docs/product/modular-evolution-and-marketplace.md`, `docs/product/srs-mvp.md`, `CHANGELOG.md`
- **Change:**
  1. **Architectural Placement Clarified**:
     - Defined Google Drive and Google Calendar not as disconnected standalone modules, but as **Native Embedded Integrations** residing directly within the relevant operational modules:
       - **Google Drive in OMS (Order Management)**: Direct linking to shoot folders, RAW selection galleries, and album deliverables with embedded in-app preview capability without tab switching.
       - **Google Calendar in ERP (Crew Operations & Scheduling)**: Live two-way synchronization of shoot dates, call times, crew assignments, and visual availability.
  2. **In-App Preview & UI Enhancements**:
     - Added Google Drive order folder preview card inside the Studio OMS order drawer.
     - Added Google Drive Shoot Gallery & Deliverables preview to the passkey-protected guest tracking page.
     - Added dedicated Native Integrations section and FAQ on the marketing home and features pages.
  3. **Product Specification & Documentation Sync**:
     - Updated `srs-mvp.md` (Sections 5.1, 5.3, 5.4) and `modular-evolution-and-marketplace.md` (Section E).
- **Reason:** User request: Integrate Google Drive and Google Calendar throughout the tool, establishing native embedded in-app previews so studio teams and clients never have to open separate tools or juggle browser tabs.
- **Specification Reference:** User prompt instruction.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-018 — CRM Specification Refinement: Streamlined Contact Directories and Removal of Redundant Family Hierarchy Features

- **Task:** CHG-018 — Remove Primary/Secondary Contacts and VIP Family Members Features in CRM
- **Date:** 2026-09-16
- **Area:** `apps/web/src/features/home/HomePage.tsx`, `apps/web/src/app/features/page.tsx`, `docs/product/modular-evolution-and-marketplace.md`, `docs/product/srs-mvp.md`, `CHANGELOG.md`
- **Change:**
  1. **Removed**:
     - Removed "Primary & Secondary Contacts" feature cards and descriptions across UI and product docs.
     - Removed "VIP Family Members List" feature cards and descriptions across UI and product docs.
  2. **Refined CRM Focus**:
     - Positioned CRM on core studio essentials: Centralized Customer Directory & Profiles, Complete Event & Order History, Client Styling Preferences & Shoot Notes, Anniversary & Milestone Reminders for repeat business, Lifetime Value Tracking, and Direct Re-Booking.
     - Formally documented multi-contact hierarchies and family list complexity as excluded over-engineering.
- **Reason:** Direct user guidance: Eliminate unnecessary multi-contact and VIP family list overhead to keep CRM simple, direct, and focused on essential client data and repeat booking reminders.
- **Specification Reference:** User prompt instruction.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-017 — Navigation CTA Refinement: Module-Centric Feature Exploration

- **Task:** CHG-017 — Replace "Explore More Features" with Precise Module Breakdown CTAs
- **Date:** 2026-09-16
- **Area:** `apps/web/src/features/home/HomePage.tsx`, `apps/web/src/app/about/page.tsx`, `CHANGELOG.md`
- **Change:**
  - Replaced the vague `Explore More Features →` button on the home page with `Explore Detailed Module Breakdown →`.
  - Replaced `Explore Features` on the About page with `Explore Module Breakdown`.
  - Clarifies that all capabilities and tools are organized directly inside the core modules (Order Management, CRM, Operations/Crew ERP, and Marketplace), rather than standing as disconnected features.
- **Reason:** Direct user guidance: Ensure navigation buttons accurately reflect that features live structured inside the explained modules.
- **Specification Reference:** User prompt instruction.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-016 — Landing Page Copy Refinement: Elimination of Bracketed Terms & Outcome-Driven Accounting & Auditing

- **Task:** CHG-016 — Remove Bracketed Terms on Landing Page and Refine Auditing/Accounts/Tax Purpose
- **Date:** 2026-09-16
- **Area:** `apps/web/src/features/home/HomePage.tsx`, `apps/web/src/app/features/page.tsx`, `docs/product/modular-evolution-and-marketplace.md`, `docs/product/srs-mvp.md`, `CHANGELOG.md`
- **Change:**
  1. **Elimination of Bracketed Terms**:
     - Removed bracketed jargon on the landing page (`(OMS)`, `(CRM)`, `(ERP)`, `(Team A/B)`, `(10 Members)`, and inline examples).
     - Headings now use natural business names: `Order Management`, `Customer Relationship Management`, `Studio Operations and Crew Management`.
  2. **Professional Auditing, Accounts & Tax Readiness**:
     - Replaced mechanical feature labels ("tax ledger summary") with outcome- and purpose-driven descriptions:
     - Articulated why the system is used: keeps studio income, crew payouts, and verified travel claims continuously organized to give studio owners an accurate audit trail of actual net profit, eliminating end-of-year accounting panic and making annual tax filing effortless.
- **Reason:** Direct user guidance: Remove awkward bracketed terms on the landing page and describe the tangible business purpose and utility of studio financial accounts and tax auditing.
- **Specification Reference:** User prompt instruction.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-015 — Copy & Typography Refinement: Elimination of AI-Style Em Dashes and Robotic Hyphens

- **Task:** CHG-015 — Replace Em Dashes and AI Hyphens with Natural Human Punctuation
- **Date:** 2026-09-16
- **Area:** `apps/web/src/features/home/HomePage.tsx`, `apps/web/src/components/WorkspaceTour.tsx`, `apps/web/src/app/features/page.tsx`, `apps/web/src/app/about/page.tsx`, `apps/web/src/app/pricing/page.tsx`, `apps/web/src/app/[studioSlug]/dashboard/oms/page.tsx`, `apps/web/src/app/[studioSlug]/dashboard/crm/page.tsx`, `apps/web/src/app/[studioSlug]/dashboard/erp/page.tsx`, `docs/product/srs-mvp.md`, `CHANGELOG.md`
- **Change:**
  1. **User Request Target**: Replaced the em dash in *"Track and manage confirmed orders and their status across every milestone—from RAW photo selection..."* with a natural comma across `HomePage.tsx`, `features/page.tsx`, `WorkspaceTour.tsx`, and `srs-mvp.md`.
  2. **Feature Titles & Modules**: Replaced robotic hyphens and em dashes in module titles with clean parentheses:
     - `Order Management — OMS` -> `Order Management (OMS)`
     - `Customer Relationship Management — CRM` -> `Customer Relationship Management (CRM)`
     - `Enterprise Resource Planning — ERP` -> `Enterprise Resource Planning (ERP)`
     - In pricing page: `Order Management System (OMS)`, `Customer Relationship Management (CRM)`, `Studio Resource Operations (ERP)`.
  3. **Section Headings & Descriptions**: Replaced `Module 01 — Core OMS` with `Module 01: Core OMS` (and similarly for CRM/ERP), and eliminated em dashes in `about/page.tsx`, `features/page.tsx`, and `srs-mvp.md`.
  4. **Table Fallbacks**: Replaced em dash fallback placeholders (`"—"`) in CRM and ERP details panels with standard `"-"`.
- **Reason:** Direct user guidance: Eliminate telltale AI punctuation patterns (em dashes and robotic hyphens) in favor of polished human punctuation and standard business typography.
- **Specification Reference:** User prompt instruction.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-014 — Specification Refinement: Pragmatic Studio CRM, Team ERP & Modular Plan FAQ

- **Task:** CHG-014 — Studio CRM, ERP Architecture Specification & FAQ Simplification
- **Date:** 2026-09-16
- **Area:** `docs/product/modular-evolution-and-marketplace.md`, `docs/product/srs-mvp.md`, `apps/web/src/features/home/HomePage.tsx`, `apps/web/src/app/features/page.tsx`, `CHANGELOG.md`
- **Change:**
  1. **FAQ Simplification**:
     - Updated *"Do I have to use every feature?"* to be clear, direct, and plan-oriented: studios only pay for what they need, starting with the Starter plan for OMS, and upgrading to Professional or Complete when ready for CRM, Crew ERP with simple payroll, or WhatsApp alerts.
  2. **Pragmatic Studio CRM Specification**:
     - Focused on high-utility studio data: primary & secondary contacts (Bride/Groom, event coordinator), full past event and package history, key family members and VIP lists for shoots, and automated anniversary & upcoming milestone reminders for repeat bookings.
     - Formally excluded low-utility engineering bloat (complex family tree visualizers, aesthetic moodboard scrapers, and generic B2B pipeline bloat).
  3. **Pragmatic Studio ERP Specification**:
     - Visual calendar availability & scheduling (Outlook / Google Calendar model) displaying crew blocked times to prevent double booking.
     - Team grouping (Team A, Team B, Team C) for handling simultaneous multi-event dates.
     - Asset & equipment tracking (cameras, lenses, gimbals, mics, memory cards checkout/return).
     - Simple payroll and payout engine with travel & incidental claims (fuel, meals, out-of-town expenses) approved by studio owners.
     - Studio accounting & tax filing ledger summarizing gross income, payouts, and expenses for tax returns.
     - Formally excluded statutory corporate enterprise HR compliance (PF, gratuity, labor union frameworks).
- **Reason:** Direct user guidance: Eliminate academic/engineering bloat, focus on practical features that real studio owners use daily to run operations, prevent double-bookings, pay crew, and file taxes.
- **Specification Reference:** `docs/product/modular-evolution-and-marketplace.md`, `docs/product/srs-mvp.md`.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-013 — Copy & Messaging Realignment: Professional OMS Value Proposition & Customer-Facing Marketplace Positioning

- **Task:** CHG-013 — Professional OMS & Marketplace Messaging Alignment
- **Date:** 2026-09-16
- **Area:** `apps/web/src/features/home/HomePage.tsx`, `apps/web/src/app/features/page.tsx`, `apps/web/src/components/WorkspaceTour.tsx`, `docs/product/srs-mvp.md`, `CHANGELOG.md`
- **Change:**
  1. **Order Management System (OMS) Description Realignment**:
     - Replaced mechanical state machine strings and generic copy with direct, functionality-first explanation:
       - *HomePage.tsx*: "Track and manage confirmed orders and their status across every milestone—from RAW photo selection and editing through to final album delivery and client payments."
       - *features/page.tsx*: "The core order management system to track and manage your studio's confirmed orders and their status across every milestone—from RAW photo selection and editing through to final album delivery and client payments."
       - *WorkspaceTour.tsx*: "Track and manage confirmed orders and their status across every milestone—from RAW photo selection and editing through to final album delivery and payments."
     - Synchronized the polished OMS definition in `docs/product/srs-mvp.md`.
  2. **Studio Marketplace Realignment**:
     - Removed "Planned" badges and shifted to customer-centric discovery positioning (locating studios near the client, authentic operational performance metrics, on-time delivery track records, and verified reviews & ratings).
     - Emphasized studio owner privacy and visibility controls over their public listings.
- **Reason:** User feedback: Eliminate internal state-machine developer jargon from public and studio-facing descriptions, replace with high-craft professional studio copy, and record changes in documentation and change logs.
- **Specification Reference:** `docs/product/product-discovery-document.md`, `docs/product/srs-mvp.md`, `Agents.md`.
- **Verification:** Verified compilation and linting with 0 errors.

---

## CHG-012 — Audit Remediation: Member Invitation Lifecycle, Authorization Hardening, Firestore Indexes & Documentation Consistency

- **Task:** CHG-012 — Comprehensive Audit Resolution
- **Date:** 2026-09-14
- **Area:** `packages/types`, `packages/db`, `apps/web/src/actions/*`, `apps/web/src/app/onboarding/join-studio`, `apps/web/src/app/[studioSlug]/dashboard/erp`, `firestore.indexes.json`, `docs/technical/*`, `apps/web/src/app/features`, `apps/web/src/app/pricing`
- **Change:**
  1. **Member Invitation & Activation Lifecycle**:
     - Added `StudioInvitation` type to `packages/types`.
     - Implemented `saveInvitation`, `getInvitationByCode`, `getInvitationsByStudio`, and atomic `acceptInvitationTransaction` in `@focoman/db`.
     - Added `acceptInvitationAction` and `getStudioInvitationsAction` to `memberActions.ts`. Enhanced `createMemberAction` to automatically issue single-use cryptographic invitation tokens.
     - Implemented real Google Auth account linking and token validation in `apps/web/src/app/onboarding/join-studio/page.tsx`.
     - Enhanced ERP crew management modal in `apps/web/src/app/[studioSlug]/dashboard/erp/page.tsx` with instant invitation code and shareable onboarding link display.
  2. **Server Action Authorization Hardening**:
     - Enforced `requireStudioMember(decoded.uid, studioSlug, "STUDIO_OWNER")` in `updateStudioWhatsappConfigAction` (`studioActions.ts`) to close the identified authorization gap.
  3. **Firestore Composite Indexes**:
     - Updated `firestore.indexes.json` with composite indexes for `orders` (`studioId` + `createdAt`, `studioId` + `orderStatus` + `createdAt`), `tasks` (`orderId` + `sequenceOrder`), `memberships` (`uid` + `status`, `studioId` + `status`), and `invitations` to prevent runtime `FAILED_PRECONDITION` errors.
  4. **Deployment & Environment Variable Consistency**:
     - Updated `@focoman/db` and `serverAuth.ts` to transparently accept both `FIREBASE_CLIENT_EMAIL` / `FIREBASE_ADMIN_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` / `FIREBASE_ADMIN_PRIVATE_KEY`.
     - Updated `docs/technical/deployment-guide.md` and technical design docs to align with environment variables and `pnpm / npm workspace` conventions.
  5. **Features & Pricing Alignment with Product Discovery Scope**:
     - Realigned `/features` to clarify external gallery link handover rather than native cloud media hosting in Phase 1.
     - Added pilot program disclosure banner to `/pricing` noting provisional status per the Product Discovery Document and keeping multi-studio personal Google identity access unlocked across tiers.
- **Reason:** Comprehensive resolution of all architectural findings and gaps identified during the GitHub repository audit against the Product Discovery Document.
- **Specification Reference:** `docs/product/product-discovery-document.md`, `docs/technical/identity-and-auth-architecture.md`, `Agents.md`.
- **Verification:** ESLint and production Next.js build compilation passed with 0 warnings or errors.

---

## CHG-011 — Product Documentation Realignment: Confirmed Order as Starting Point & Total Spring Boot Elimination

- **Task:** CHG-011 — Authoritative Product Documentation Synchronization & Legacy Architecture Elimination
- **Date:** 2026-09-14
- **Area:** `docs/product/*`, `docs/technical/*`, `docs/QUICK_SETUP_GUIDE.md`, `docs/DEVPORTAL_SETUP.md`, `docs/ISSUE_ANALYSIS.md`, `docs/Index.md`, `docs/README.md`, `apps/web/src/app/devportal/page.tsx`
- **Change:**
  1. **New Authoritative Product Discovery Document Created**: Added `docs/product/product-discovery-document.md` as the primary product source of truth. Confirmed Order is established as the absolute starting point for Phase 1. The three macro order stages (`Awaiting Event` → `Post-Event In Progress` → `Completed`) and dynamic post-event task generation pipeline are fully codified.
  2. **Product Requirements (`srs-mvp.md`) Realigned**: Updated requirements specification to mark pre-event sales leads, quotation generation, and negotiations as out-of-scope for Phase 1. Realigned order lifecycle and role definitions.
  3. **Completely Rewrote Quick Setup Guide (`QUICK_SETUP_GUIDE.md`)**: Removed all obsolete Railway, Spring Boot, Java, H2, and PostgreSQL content. Replaced with accurate setup instructions for the Next.js 15 TypeScript monorepo, Node.js 20+, Firebase Auth, Firestore Admin credentials, and npm scripts (`npm run dev`, `npm run build`, `npm run lint`).
  4. **Completely Rewrote DevPortal Guide (`DEVPORTAL_SETUP.md`)**: Removed Spring Boot Actuator, Railway SQL Editor, and JDBC references. Documented the Next.js 15 DevPortal at `/devportal` and `/[studioSlug]/dashboard/dev-portal`.
  5. **Completely Rewrote Issue Analysis (`ISSUE_ANALYSIS.md`)**: Replaced obsolete Railway ephemeral filesystem notes with root cause analyses for the 8 real architectural issues resolved during the platform modernization.
  6. **Purged Legacy References Across Technical Documentation**: Cleaned up `Index.md`, `README.md`, `tech-stack.md`, `recommended-architecture.md`, `technical-design-mvp.md`, `identity-and-auth-architecture.md`, `vercel-hosting-strategy.md`, and `deployment-guide.md` to confirm the application is 100% full-stack TypeScript / JavaScript.
- **Reason:** User directive: "Confirmed order is the starting point. Please update the documentation as well. I think documentation has correct data only. Please make sure to follow the documentations like product discovery document and all documents, but few may be outdated. Remove all spring boot reference we have completely moved to javascript."
- **Specification Reference:** `docs/product/product-discovery-document.md`, `docs/Index.md`.
- **Verification:** Full compilation build and linting verified with zero errors.

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



