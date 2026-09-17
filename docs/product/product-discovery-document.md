# FOCOMAN Product Discovery Document

**Document Type:** Authoritative Product Specification  
**Status:** Active Source of Truth  
**Project:** Focoman  
**Domain:** Photography Studio Business Operating System (BOS)  

---

## 1. Executive Summary & Core Product Axiom

Focoman is an **OMS-First (Order Management System) Business Operating System** designed specifically for professional photography and cinematography studios.

### The Core Axiom: The Confirmed Order is the Absolute Starting Point
Unlike generic CRM software that focuses on lead prospecting, quotation generation, and sales negotiations, **Focoman Phase 1 begins strictly upon a Confirmed Order**.

```text
┌────────────────────────────────────────────────────────┐
│                   PRE-EVENT SALES                      │
│   (Leads, Enquiries, Quotes, Price Negotiations)       │
│               [EXCLUDED FROM PHASE 1]                  │
└──────────────────────────┬─────────────────────────────┘
                           │ Customer pays booking deposit & locks event date
                           ▼
┌────────────────────────────────────────────────────────┐
│            FOCOMAN ORDER LIFECYCLE (PHASE 1)           │
│                                                        │
│               [1] AWAITING EVENT                       │
│    (Order Registered, Advance Paid, Crew Allocated)    │
│                           │                            │
│                           ▼ Event Date Occurs          │
│            [2] POST-EVENT IN PROGRESS                  │
│    (Dynamic Workflow Tasks: Ingest, Edit, Proof, Print)│
│                           │                            │
│                           ▼ All Deliverables Cleared   │
│                 [3] COMPLETED                          │
│     (Final Balance Cleared, Physical Handover Done)    │
└────────────────────────────────────────────────────────┘
```

By eliminating pre-sales friction and focusing entirely on **production orchestration, team accountability, milestone progress, and client delivery**, Focoman solves the real operational nightmare of photography studios: post-event delivery delays and chaotic coordination.

---

## 2. Target Personas & Access Strategy

Focoman operates with three clear, purpose-built personas:

### 2.1 Studio Owner
* **Role**: Primary business owner or studio manager.
* **Capabilities**:
  * Registers and administers the studio workspace.
  * Registers confirmed orders with customer details, deliverables, and payment terms.
  * Allocates crew members (photographers, videographers, editors) to shoots and tasks.
  * Tracks high-level financial metrics (advance collected, pending dues, total order value).
  * Manages studio team memberships and invitations.

### 2.2 Crew Member / Freelancer
* **Role**: In-house photographers, freelance videographers, drone operators, photo editors, and album designers.
* **Capabilities**:
  * Authenticates via personal Google identity without creating separate studio accounts.
  * Fluidly switches between multiple studio workspaces where they hold membership.
  * Views assigned shoots, event dates, and locations.
  * Updates assigned workflow tasks (e.g., marking RAW footage uploaded, submitting edit preview links).
  * **Privacy Guard**: Crew members cannot view studio financial margins, client contracts, or unassigned client orders.

### 2.3 Guest Customer (No-Account Architecture)
* **Role**: Bride, groom, event host, or corporate point of contact.
* **Capabilities**:
  * **Zero Sign-Up / Zero Passwords**: Does NOT create an account, password, or login profile.
  * Tracks project progress through a secure, collision-safe **Passkey Tracking Portal** (`/track/[passkey]`).
  * Views real-time milestone status (Shoot Complete → RAW Backup → Selection Gallery → Editing → Printing → Out for Delivery).
  * Direct access to photo selection gallery links and digital proofs.
  * Receives milestone alerts directly via WhatsApp.

---

## 3. Order Data Structure & Requirements

Every confirmed order registered in Focoman encapsulates complete execution details:

### 3.1 Order Attributes
1. **Order Identification**:
   * Order Number (e.g., `ORD-2026-081`)
   * Guest Tracking Passkey (cryptographically generated unique string)
   * Studio Slug & Reference ID
2. **Customer Information**:
   * Full Name
   * Primary Contact Phone & WhatsApp Number
   * Email Address
   * Billing & Delivery Postal Address
3. **Event Schedule**:
   * Event Category (Wedding, Reception, Engagement, Birthday, Corporate, Fashion)
   * Event Date(s), Start Time, and Scheduled Duration
   * Venue Name, Map Location, and City
4. **Deliverables Package**:
   * High-Resolution Edited Digital Photos (Target Count)
   * Cinematic Teaser Video (Duration, e.g., 60-second Instagram reel)
   * Full Wedding / Event Feature Film (Duration, e.g., 30–45 mins)
   * Premium Printed Album (Sheet count, cover type, e.g., Leatherette 40 sheets)
   * Raw Media Storage Handover (Pen drive / SSD / Cloud link)
5. **Financial Agreement**:
   * Total Agreed Package Price
   * Advance Deposit Received (with confirmation date and receipt mode)
   * Event-Day Installment
   * Balance Due Upon Final Delivery Handover
   * Current Payment Status (`Advance Paid`, `Partially Paid`, `Fully Paid`)
6. **Crew Resource Allocation**:
   * Lead Traditional Photographer
   * Candid Photographer
   * Traditional Videographer
   * Cinematographer / Drone Pilot
   * Assigned Post-Production Editor / Album Designer

---

## 4. The 3 High-Level Order Stages

To avoid complex, convoluted status trees, Focoman defines exactly **three macro stages** for every order:

```text
┌─────────────────────────┐
│     AWAITING EVENT      │  Confirmed booking. Deposit secured. Date locked.
└────────────┬────────────┘  Crew assigned and availability confirmed.
             │
             ▼  Event Date occurs & shoot wraps
┌─────────────────────────┐
│  POST-EVENT IN PROGRESS │  Media ingested. Tasks executed sequentially.
└────────────┬────────────┘  Client selects photos. Edits reviewed. Album printed.
             │
             ▼  Deliverables handed over & final balance settled
┌─────────────────────────┐
│        COMPLETED        │  Order archived. All deliverables acknowledged.
└─────────────────────────┘
```

---

## 5. Dynamic Post-Event Production Pipeline

When an order transitions to `Post-Event In Progress`, Focoman automatically spins up a sequential, trackable production task workflow:

| Stage # | Milestone Task Name | Description & Completion Criteria | Assigned Role |
| :--- | :--- | :--- | :--- |
| **Task 1** | **RAW Footage Ingest & Dual Backup** | Offload memory cards, duplicate to primary NAS and secondary cold backup, verify checksums. | Lead Photographer |
| **Task 2** | **Selection Gallery Dispatch** | Export web-optimized watermarked proofs, generate client gallery link, dispatch via WhatsApp. | Studio Manager / Editor |
| **Task 3** | **Client Photo Selection** | Customer reviews gallery and submits final selection list for album and retouching. | Customer (via Tracker) |
| **Task 4** | **Photo Retouching & Color Grading** | Master color correction, exposure tuning, skin cleanup, and creative color grading on selected images. | Lead Editor |
| **Task 5** | **Video Teaser & Film Editing** | Audio sync, timeline cut, sound design, color grade, and music licensing for film deliverables. | Video Editor |
| **Task 6** | **Album Layout Design & Proofing** | Create custom digital album spreads; share PDF / web proof with client for page-by-page signoff. | Album Designer |
| **Task 7** | **Physical Print & Lab Packaging** | Send approved layout to print lab; inspect binding, print quality, and package into custom studio box. | Studio Manager |
| **Task 8** | **Final Handover & Payment Clearance** | Hand over physical album and media drive; confirm receipt of remaining balance payment. | Studio Owner |

---

## 6. WhatsApp Operational Communication Layer

WhatsApp is the dominant communication channel for photography clients and freelance crew. Focoman integrates WhatsApp as an optional operational notification layer:

1. **Order Confirmation Message**: Sent instantly to the client upon booking confirmation with event dates, deliverables summary, and their private Passkey Tracking URL.
2. **Crew Dispatch Alert**: Sent to assigned photographers 48 hours and 12 hours prior to call time with venue location and shotlist requirements.
3. **Selection Ready Ping**: Sent automatically when RAW photos are backed up and the selection gallery is live.
4. **Milestone Progress Notices**: Sent to client upon significant updates (e.g., "Your wedding album design is ready for preview!").
5. **Dispatch & Delivery Notice**: Sent with delivery tracking details when the physical album is shipped or ready for in-studio pickup.

---

## 7. Technology Architecture

Focoman is built using a **100% JavaScript / TypeScript full-stack architecture**. All legacy Java and Spring Boot implementations have been completely eliminated from the project.

* **Frontend**: Next.js 15 (React 19), App Router, Tailwind CSS 3.
* **Backend Logic**: Next.js Server Actions and Route Handlers written in TypeScript.
* **Shared Packages**: Monorepo modular packages (`packages/types`, `packages/validation`, `packages/domain`, `packages/db`, `packages/auth`, `packages/config`).
* **Authentication**: Firebase Authentication with Google Sign-in as the sole identity provider. Multi-studio memberships decoupled from Firebase UID.
* **Database**: Google Cloud Firestore (Document Database) with strict server-only Admin SDK boundaries (`packages/db`).
* **Deployment**: Google Cloud Run running containerized Next.js standalone server.

---

## 8. Product Discovery Amendment vNext — Product Evolution & Marketplace Direction

**Date:** 2026-09-14
**Reason for Amendment:** Evolve Focoman from the MVP foundation into a more professional, flexible, and configurable business operating system, introducing modular capabilities and a public Studio Marketplace, while preserving historical Phase 1 decisions.

### 8.1 Amendment Philosophy
The core Focoman platform remains unified, but capabilities will be modular and configurable. Professional studio operations must be simple, transparent, and flexible. A small studio can use essential OMS capabilities without being forced to configure a full ERP. Expanding studios can enable deeper CRM/ERP modules, WhatsApp, or the Studio Marketplace based on their maturity.

### 8.2 Affected Product Areas & Directions
* **Core OMS**: Remains the operational core and absolute starting point (Confirmed Order → Awaiting Event → Post-Event In Progress → Completed). No changes to the existing foundational lifecycle.
* **Flexible CRM**: Preserved as a modular capability providing customer directory and order history. Deep pre-event features (lead/quotation tracking) remain excluded from default workflows unless explicitly authorized as a future separate module.
* **Configurable ERP**: Focuses on crew directory, roles, and resource availability. Advanced capabilities (payroll, PF, compensation) are planned future features and must NOT be marketed or claimed as existing functionality until explicitly implemented.
* **Optional WhatsApp**: Functions as a configurable, premium communication layer. The core application must function completely without it.
* **Studio Marketplace (New Capability)**: A new, opt-in public discovery layer. Allows customers to search for studios based on location and view public studio profiles, approved tags, and verified operational performance metrics (e.g., On-Time Delivery).
* **Website Integration (VAS)**: Clarified strictly as an API integration capability bridging a studio's external website to Focoman, NOT a built-in website builder or pre-event CRM pipeline.

### 8.3 Implementation & Security Implications
* **Data Privacy Boundaries**: Strict server-side separation must be enforced between Public Marketplace profiles and Private Studio operational data. Private orders, revenue, customer details, and internal tasks must never be exposed publicly.
* **Verified Metrics**: Ratings and Marketplace performance metrics must be derived from actual Focoman operational data. Fake data, mock ratings, and arbitrary manual metric overrides are strictly prohibited.
* **Marketplace vs. Guest Portal**: The public Studio Marketplace is distinctly separate from the passkey-protected Guest Order tracking portal.
* **Provisional Pricing**: Pricing tiers are provisional during the Phase 1 Pilot program. Future commercial packaging will evaluate modular enablement (OMS Core + CRM/ERP/WhatsApp/Marketplace Add-ons).

### 8.4 Documentation Implications
All marketing copy, landing pages, and technical specifications must accurately distinguish between **Implemented**, **Approved Direction**, **Planned**, and **Not Yet Implemented** features. Unsupported claims (e.g., payroll integration or pre-event CRM) must be removed from user-facing copy.
