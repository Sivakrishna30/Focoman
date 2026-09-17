# FOCOMAN Technology Stack Specification

**Document Type:** Technical Architecture Specification  
**Status:** Active Target Specification  
**Project:** Focoman  
**Architecture:** 100% Full-Stack JavaScript / TypeScript Monorepo  

---

## Target Technology Stack Matrix

| Area | Approved Target Technology | Implementation & Operational Details |
| :--- | :--- | :--- |
| **Architecture Style** | **TypeScript Integrated Monorepo** | Single Next.js application containing client UI and server-side business logic. |
| **Monorepo Layout** | **`pnpm` / `npm` Workspace** | `apps/web` (Next.js App) + `packages/*` (`types`, `validation`, `domain`, `db`, `auth`, `config`). |
| **Frontend Framework** | **Next.js 15 (React 18)** | React Server Components, Client Components, App Router (`src/app/`). |
| **Styling** | **Tailwind CSS 3** | Responsive, mobile-first studio dashboard design system. |
| **Server-Side Application Logic** | **Next.js Server Actions & Route Handlers** | Trusted server execution boundary for business mutations and privileged operations. |
| **Authentication** | **Firebase Authentication (Google Sign-In)** | Single personal identity per person via Firebase UID. Studio memberships decoupled from UID. No custom username/passwords, no SMS, no anonymous auth. Order tracking via guest passkeys. |
| **Primary Database** | **Google Cloud Firestore** | Document-oriented database with structured collections (`users`, `studios`, `memberships`, `invitations`, `customers`, `orders`, `tasks`). |
| **Server DB Access** | **Firebase Admin SDK (`packages/db`)** | Server-Only database abstraction. Generic unrestricted CRUD is **NOT** exposed to client browser. |
| **Shared Contracts** | **Shared TypeScript Types & Zod Validation** | `packages/types` and `packages/validation` shared between UI forms and server logic. |
| **Hosting & Compute** | **Google Cloud Run** | Single containerized Next.js application deployment on Cloud Run. |
| **Containerization** | **Docker** | Production Dockerfile packaging Next.js standalone server for Cloud Run. |
| **Integrations** | **WhatsApp Business API** | Premium operational layer for alerts, status checks, and resource availability updates. |
| **CI/CD** | **GitHub Actions** | Automated build, test, and Google Cloud Run deployment pipeline. |

---

## Architecture Boundaries & Scope Exclusions

- **100% Full-Stack JavaScript / TypeScript**: The entire application runs exclusively on Node.js, Next.js 15, and TypeScript. All legacy Java and Spring Boot codebases have been completely decommissioned.
- **Serverless Cloud Persistence**: All persistence is managed natively via Google Cloud Firestore; no relational SQL or local file databases are used.
- **Google Authentication**: Firebase Authentication provides personal identity; custom platform passwords and separate studio login portals are completely eliminated.
- **OMS-First MVP Scope**: Pre-event sales lead negotiations and Google Calendar integrations are excluded from Phase 1 scope per the Product Discovery Document.
