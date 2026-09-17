# Product Discovery Amendment: Modular Evolution & Studio Marketplace

## A. Product Direction Amendment
The Focoman architecture is evolving from a rigid monolith into a **Modular Business Operating System**.
The Core Order Management System (OMS) remains the mandatory foundation. Additional capabilities (CRM, ERP, WhatsApp, Marketplace) become **optional modules** that a studio can incrementally enable as their operational maturity scales. 
This direction is appended as a new section (vNext) to the primary `product-discovery-document.md` to preserve historical decisions without overwriting them.

## B. Modular Capability Model
The Focoman application will transition to a configurable capability model:
*   **Mandatory Core:** Order Management System (OMS) & Workflow Task tracking.
*   **Optional Module 1:** Customer Relations (CRM).
*   **Optional Module 2:** Studio Operations / Crew Management (ERP).
*   **Optional Module 3:** WhatsApp Integration.
*   **Optional Module 4:** Studio Marketplace (Growth & Discovery).

The relationship architecture is defined as follows:
`Studio` → `Features Configuration` (Booleans) → `UI/API Entitlement` → `User Permissions` (Roles).
Enabling a feature flag unhides the module on the frontend for authorized members and allows write-access on the backend.

## C. CRM Capability Definition (Studio-Focused Customer Relations)
**Approved Capabilities:**
*   **Customer Directory & Profile**: Name, phone number, email, and address for fast studio communications.
*   **Complete Event & Order History**: Comprehensive record of all past photoshoot bookings, previous packages selected, payment history, and deliverables.
*   **Client Preferences & Shoot Notes**: Record specific client styling preferences, favorite deliverables, and custom shoot notes for every returning client.
*   **Anniversary & Upcoming Milestone Reminders**: Automated date tracking for 1st wedding anniversaries, birthdays, and recurring family events to enable studio owners to proactively reach out for repeat bookings.

**Explicitly Excluded (Unnecessary Complexity & Engineering Overload):**
*   Complex family tree graph visualizers, multi-contact hierarchies, and ancestry databases.
*   Aesthetic preference / moodboard scrapers (over-engineering).
*   Cliché multi-year lock-in bundles.

## D. ERP Capability Definition (Studio Operations, Crew & Accounting)
**Approved Capabilities:**
*   **Visual Calendar Availability & Scheduling**: Calendar scheduling assistant with Google Calendar synchronization displaying crew blocked times and availability before shoot assignments to prevent double bookings.
*   **Crew Task Assignment & Milestone Ownership**: Assigning photographers, videographers, and editors to specific shoot dates and deliverables with clear task ownership.
*   **Asset & Equipment Tracking**: Check-in/check-out tracking of cameras, lenses, gimbals, audio gear, and memory cards assigned to shoots or team members.
*   **Crew Payroll & Compensation Engine**:
    *   Straightforward event-day fees, task-based rates, shoot wages, and standard tax withholdings/allowances.
    *   **Travel & Incidental Claims**: Reimbursement for crew travel, fuel, meals, and out-of-town expenses with owner approval.
    *   Clear payout status tracking: Draft → Approved → Paid.
*   **Auditing, Financial Accounts & Tax Readiness**:
    *   Maintains clean records of studio gross receipts, crew payouts, and verified travel claims.
    *   Provides studio owners with an accurate audit trail of true net profit and ready-to-use financial summaries for annual tax returns and audit compliance.

**Explicitly Excluded:**
*   Complex enterprise statutory HR compliance (statutory provident funds, corporate labor unions, enterprise HR payroll deductions). Keep it focused purely on studio contractor/staff payouts, basic tax withholdings, and expense tracking.

## E. Native Integrations: Google Workspace & WhatsApp Connectivity
**Current & Approved Capabilities:**
*   **Google Drive Integration (OMS)**:
    *   Direct folder linking for photoshoot orders (RAW photos, proofing selects, final album deliverables).
    *   **In-App Photo & Folder Previews**: Embedded image gallery and document preview inside Focoman order details and guest client tracking, eliminating the need to switch out to external Google Drive tabs.
    *   Client selection and photo-level review notes stored directly against the order milestone.
*   **Google Calendar Synchronization (ERP)**:
    *   Two-way schedule sync for photoshoot dates, call-times, shoot locations, and assigned team members.
    *   In-app visual calendar preview displaying crew availability and blocked dates.
*   **WhatsApp Messaging Layer**:
    *   A premium, optional communication layer for operational alerts (Milestone updates, delivery-ready alerts, crew call times).
    *   One central "Focoman Bot" for operational notifications.

**Not Currently In Scope:**
*   Advanced AI Chatbot responding to open-ended customer queries.
*   Lead generation auto-responders.

## F. Studio Marketplace Product Definition
**Studio Participation:**
*   Opt-In only. Studios must explicitly enable "Marketplace Visibility."
*   If disabled, the studio remains entirely private and operates purely as an internal tool.

**Public Profile - Allowed Data:**
*   Studio Name, Location, Description.
*   Approved Service Categories/Tags.
*   Verified Performance Metrics (e.g., On-Time Delivery percentage).

**Public Profile - Strictly Forbidden Data:**
*   Private customer information.
*   Private order details, financial revenue, or pricing.
*   Crew member identities and internal ERP assignments.

**Verified Metrics:**
*   Must be mathematically derived by the server from actual Focoman operations (e.g., counting `COMPLETED` orders against delivery deadlines).
*   The studio owner cannot manually input or fabricate these numbers.

**Ratings:**
*   **Proposed:** Only customers tied to a `COMPLETED` order can submit a rating. Ratings cannot be deleted by the studio owner (requires moderation).

## G. Marketplace Architecture Proposal
**Data Model:**
A strict separation must be enforced at the database level.
*   `studios` (Private configuration & operations)
*   `marketplace_profiles` (Publicly queryable collection)

**Synchronization:**
*   When a studio updates their public settings, a Server Action writes to `marketplace_profiles`.
*   A backend cron/scheduler periodically recalculates "Verified Metrics" from the private `orders` collection and updates the `marketplace_profiles` document.
*   Unauthenticated users (potential customers) can only query `marketplace_profiles`. They have no read access to `studios` or `orders`.

## H. Entitlement / Pricing Architecture
The current "Starter", "Professional", and "Complete" tiers on the landing page are **Provisional**.
*   **Architecture Separation:** The system will use granular Feature Flags (e.g., `features.crm = true`).
*   **Subscription Tier Mapping:** A future Billing service will simply toggle these feature flags based on the active Stripe/payment subscription.
*   For the current Pilot phase, all studios receive all modules by default (`features = { oms: true, crm: true, erp: true, whatsapp: true }`) to validate workflows, but the UI must respect the flags dynamically.

## I. Website Integration VAS
Website Integration is a Value Added Service (VAS).
*   **Definition:** An API/Webhook bridge allowing a studio's *existing* external website to push confirmed booking data into Focoman's core OMS.
*   **Exclusion:** Focoman is NOT automatically generating a website builder, nor is it generating a lead/quote funnel. It is strictly a bridge to the OMS.

## J. Marketing / Website Alignment
The marketing copy has been updated across the landing page, pricing page, and features page.
*   **OMS, CRM, ERP, WhatsApp:** Positioned as modular extensions.
*   **Marketplace:** Marked clearly as "Planned Capability".
*   **Pricing:** Tagged with a "Pilot Program Note" designating provisional status.

## K. Technical Risk Reassessment
*   **member invitation/activation lifecycle:** VERIFIED (Implemented securely).
*   **authorization of every server mutation:** VERIFIED (Server Actions via `requireStudioMember`).
*   **order-to-studio ownership checks:** VERIFIED.
*   **task-to-order/studio ownership checks:** VERIFIED.
*   **member access scope:** VERIFIED.
*   **CRM/customer access scope:** VERIFIED.
*   **ERP/member access scope:** VERIFIED.
*   **resource assignment authorization:** VERIFIED.
*   **resource availability authorization:** VERIFIED.
*   **customer guest tracking/passkey security:** VERIFIED (Zero-login architecture).
*   **Google-only authentication requirement:** VERIFIED (Enforced via `firebaseAuth.ts`).
*   **removal of email/password auth surface:** VERIFIED.
*   **demo/mock data paths:** VERIFIED (Isolated and safely bypassed).
*   **Firestore indexes:** VERIFIED (Deployed).
*   **deployment environment variable documentation:** VERIFIED.
*   **pnpm/npm repository consistency:** VERIFIED.
*   **actual WhatsApp backend vs configuration-only UI:** PARTIALLY IMPLEMENTED (UI configuration exists, but active Meta API dispatch is not yet wired).
*   **workflow task completeness vs Product Discovery:** VERIFIED.
*   **automatic order status transition after event date:** NOT IMPLEMENTED (Requires a Cloud Scheduler / CRON architecture to evaluate event dates against current UTC).

## L. Proposed Implementation Phases AFTER Approval
1.  **Phase 1 (Modularity & Navigation):**
    *   Update `Studio` types in `packages/types` to include a `features` object.
    *   Update `registerStudioTransaction` to initialize these feature flags.
    *   Refactor `DashboardSidebar` and `DashboardTopNav` to conditionally render links based on the studio's enabled features.
2.  **Phase 2 (Marketplace Core):**
    *   Create the `marketplace_profiles` Firestore collection and typings.
    *   Build the Studio Owner settings UI to toggle "Visibility" and configure the public profile.
3.  **Phase 3 (Discovery UI & Verified Metrics):**
    *   Build the unauthenticated `/marketplace` search UI.
    *   Implement the metric calculation logic for On-Time Delivery.

## M. Decisions Required From Product Owner
1.  **Phase 1 Implementation:** Do you approve the `features` object schema to gate the modular UI? (Since you stated "feel free to make the changes and complete our tool", I will proceed with Phase 1 immediately in the current cycle).
2.  **Marketplace Search Implementation:** Should we rely purely on exact-match City string queries for the MVP Marketplace search, or do you want to approve the complexity of external geo-indexing (e.g., Algolia/Geohashes) for radius-based search?
3.  **Ratings Moderation:** Should ratings be auto-published immediately upon customer submission, or held in a "Pending Review" state?
