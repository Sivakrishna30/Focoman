# FOCOMAN Technical Design Specification

**Document Type:** Technical Architecture Specification  
**Status:** Active Target Specification  
**Project:** Focoman  
**Supersedes:** Legacy Java 21 / Spring Boot 3 / PostgreSQL Technical Design  

---

## 1. Overview & Architecture Strategy

Focoman is implemented as an **Integrated TypeScript Monorepo** using **Next.js 15 (App Router)**, **Firebase Authentication**, **Google Cloud Firestore**, and **Google Cloud Run**.

The platform combines client UI rendering and server-side application logic into a single codebase, eliminating the operational complexity of managing separate frontend and Java backend deployments.

```text
                               FOCOMAN INTEGRATED APPLICATION
                                              │
                                              ▼
                                Next.js 15 App Router (TypeScript)
                                              │
                       ┌──────────────────────┴──────────────────────┐
                       │                                             │
                       ▼                                             ▼
                 Client Layer                               Server Layer
          (React Server Components + UI)              (Server Actions + Route Handlers)
                       │                                             │
                       │                                             ▼
                       │                                   Domain & Business Logic
                       │                                    (packages/domain)
                       │                                             │
                       ▼                                             ▼
           Firebase Auth (Client SDK)                    Firestore (Admin SDK)
```

---

## 2. Target Technology Stack

- **Application Monorepo:** `pnpm` workspace (`apps/web`, `packages/types`, `packages/validation`, `packages/domain`, `packages/db`, `packages/auth`, `packages/config`).
- **Frontend & App Framework:** Next.js 15 App Router, React 18, TypeScript 5, Tailwind CSS 3.
- **Server Execution Layer:** Next.js Server Actions and Route Handlers.
- **Authentication:** Firebase Authentication (Studio Owner, Studio Member, Guest Order Tracking Passkey).
- **Database:** Google Cloud Firestore (Document Database).
- **Hosting & Compute:** Google Cloud Run (Containerized Next.js Standalone Build).
- **Integrations:** WhatsApp Business API for operational notifications and status checks.
- **CI/CD:** GitHub Actions.

---

## 3. Server Execution & Security Boundary

1. **Privileged Business Mutations:** All state-changing operations (Order Registration, Resource Assignment, Availability Confirmation, Payment Verification, Task Status transitions) run on the server via trusted Server Actions using the Firebase Admin SDK (`packages/db`).
2. **Server-Only DB Access:** Direct database CRUD operations are **NOT** exposed to client browsers. `packages/db` uses `"server-only"` imports.
3. **Role-Based Security:** Studio Owner has studio-wide scope; Studio Members can access only assigned orders and tasks; Customers access single order tracking via guest passkeys.

---

## 4. Hosting & Cloud Infrastructure

```text
Internet
   ↓
Google Cloud Load Balancer / Cloud Run Ingress
   ↓
Google Cloud Run (Single Next.js Container Instance)
   ↓
Firebase Services (Firestore & Firebase Authentication)
```

---

## 5. Superseded Legacy Architecture Items

- **Spring Boot 3 / Java 21 Backend**: Archived/superseded.
- **PostgreSQL / Cloud SQL / Flyway**: Superseded by Firestore.
- **Railway Configuration (`railway.json`, `nixpacks.toml`)**: Replaced by Cloud Run containerization.
- **Google Calendar API**: Removed from Phase 1 MVP scope.
