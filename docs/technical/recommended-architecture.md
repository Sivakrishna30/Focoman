# FOCOMAN Recommended Architecture Specification

**Document Type:** Technical Architecture Specification  
**Status:** Active Target Specification  
**Project:** Focoman  
**Supersedes:** Legacy Dual-Service (Java Backend + Next.js Frontend) Architecture  

---

## 1. Overview & Architecture Philosophy

Focoman uses an **Integrated Modular Monolith** built entirely in **TypeScript** using **Next.js 15 (App Router)** deployed to **Google Cloud Run**, with **Firebase Authentication** and **Google Cloud Firestore**.

Rather than splitting the project into a separately deployed Spring Boot backend service and a separately deployed frontend app, Focoman combines client UI rendering and trusted server-side business logic within one integrated application monorepo.

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

## 2. Monorepo Repository Structure (`pnpm-workspace.yaml`)

```text
focoman/
├── apps/
│   └── web/                        # Main Next.js 15 integrated web application
│       ├── app/                    # App Router pages & Server Actions
│       ├── components/             # React UI components
│       ├── hooks/                  # Client-side hooks
│       ├── lib/                    # Web utilities & Firebase client SDK
│       └── package.json
│
├── packages/
│   ├── types/                      # Shared TypeScript domain contracts
│   ├── validation/                 # Shared Zod validation schemas
│   ├── domain/                     # Pure domain logic & workflow engines
│   ├── db/                         # SERVER-ONLY Firestore Admin SDK wrapper
│   ├── auth/                       # Firebase Auth session & permission helpers
│   └── config/                     # Shared environment & system constants
│
├── docs/                           # Documentation & Index.md
├── Agents.md                       # Master Agent Operating Specification
├── AGENTS.md                       # Workspace Rule Entry Point
└── CHANGELOG.md                    # Project Change Log
```

---

## 3. Server Execution Boundary & Security Principles

1. **No Generic Client CRUD:** Generic database CRUD operations are **NOT** exposed directly to the browser.
2. **Server Actions for Business Mutations:** Privileged operations (order registration, resource assignment, payment confirmation, WhatsApp triggers) run through trusted Next.js Server Actions or API Route Handlers.
3. **Server-Only Database Access:** `packages/db` uses `"server-only"` imports to prevent Firebase Admin SDK credentials from ever leaking into client browser bundles.
4. **Firebase Authentication:** Role-based access control for Studio Owner, Studio Member, and Customer (Guest Passkey tracking).

---

## 4. Production Deployment Model

```text
GitHub Repository
       ↓
GitHub Actions CI/CD Pipeline
       ↓
Docker Build (Next.js Standalone Image)
       ↓
Google Cloud Run Deployment
       ↓
Firebase Services (Firestore & Firebase Auth)
```

Cloud Run handles zero-downtime deployment, traffic management, and auto-scaling automatically.

---

## 5. Legacy Architecture Replacement Notes

- **Spring Boot 3 / Java 17 Backend**: Replaced by Next.js Server Actions and `packages/domain`.
- **PostgreSQL / Cloud SQL / Flyway**: Replaced by Google Cloud Firestore.
- **Railway Artifacts (`railway.json`, `nixpacks.toml`)**: Removed in favor of Cloud Run.
- **Separate API Service Deployment**: Replaced by single integrated Cloud Run container.
