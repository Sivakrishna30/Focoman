# Focoman Project Documentation Index & Source-of-Truth Map

**Document Type:** Project Reference Entry Point  
**Project:** Focoman  
**Purpose:** Provide a centralized navigation map for active project specifications, target technical architecture blueprints, database schemas, setup guides, and governance instructions.

---

## 1. Overview

This document is the primary entry point for AI agents and human developers to discover authoritative project knowledge. 

Before making project decisions, agents **MUST** consult `Index.md` to identify and read the relevant current source specifications.

---

## 2. Source-of-Truth Hierarchy

When evaluating specifications and implementation guidelines:

1. **Primary Product Source of Truth:** `Focoman Product Discovery Document` (OMS-First, Confirmed Order Model).
2. **Target Technical Architecture Specifications:** `docs/technical/tech-stack.md`, `docs/technical/recommended-architecture.md`, `docs/technical/technical-design-mvp.md`, `docs/technical/deployment-guide.md`.
3. **Agent Governance & Workflow Specification:** `Agents.md`, `AGENTS.md`.
4. **Operational & Setup Guides:** `docs/QUICK_SETUP_GUIDE.md`, `docs/DEVPORTAL_SETUP.md`.
5. **Superseded Specifications:** `docs/product/srs-mvp.md` (Superseded legacy SRS).

*Rule:* If a newer authoritative document conflicts with an older document, the newer active document takes precedence. Old documents must not override current specifications.

---

## 3. Governance & Agent Instruction System

- **[Agents.md](file:///c:/Users/DELL/Downloads/FocoMan/Agents.md)** — Master Agent Operating Specification (Workflow, 4-Phase Protocol, AI Trust Contract, Engineering Rules, Definitions of Done).
- **[AGENTS.md](file:///c:/Users/DELL/Downloads/FocoMan/AGENTS.md)** — AGY/Gemini IDE agent workspace directives.
- **[CHANGELOG.md](file:///c:/Users/DELL/Downloads/FocoMan/CHANGELOG.md)** — Record of all meaningful engineering changes, traceable to tasks, specs, and test results.

---

## 4. Primary Active Product Specifications

- **Focoman Product Discovery Document** — **Primary Product Source of Truth.** Defines OMS-first scope starting from Confirmed Order (*Awaiting Event* → *Post-Event In Progress* → *Completed*), Studio Owner/Member/Customer roles, resource availability confirmation, dynamic workflows, and WhatsApp operational layer.
- **[SRS MVP (Legacy/Superseded)](file:///c:/Users/DELL/Downloads/FocoMan/docs/product/srs-mvp.md)** — *SUPERSEDED.* Preserved for historical reference only.

---

## 5. Active Target Technical Architecture Specifications

- **[Tech Stack Specification](file:///c:/Users/DELL/Downloads/FocoMan/docs/technical/tech-stack.md)** — **Active Target Stack.** Defines Next.js 15, TypeScript Monorepo, Firebase Auth, Firestore, and Google Cloud Run.
- **[Recommended Architecture](file:///c:/Users/DELL/Downloads/FocoMan/docs/technical/recommended-architecture.md)** — **Active Target Architecture.** Integrated Next.js App monorepo layout (`apps/web`, `packages/*`), Server Actions execution boundary, and Cloud Run deployment model.
- **[Technical Design Specification](file:///c:/Users/DELL/Downloads/FocoMan/docs/technical/technical-design-mvp.md)** — **Active Technical Design.** Server-side security boundaries, role permissions, and Firestore collection strategy.
- **[Deployment Guide](file:///c:/Users/DELL/Downloads/FocoMan/docs/technical/deployment-guide.md)** — **Active Deployment Guide.** Container build and Google Cloud Run deployment configuration.
- **[Vercel Hosting Strategy](file:///c:/Users/DELL/Downloads/FocoMan/docs/technical/vercel-hosting-strategy.md)** — Secondary hosting strategy for web static assets.

---

## 6. Design System

- **[Brand Design System](file:///c:/Users/DELL/Downloads/FocoMan/docs/design/brand-design-system.md)** — Design tokens, brand identity, color palettes, typography, and UI component styling rules.

---

## 7. Setup & Operational Guides

- **[Quick Setup Guide](file:///c:/Users/DELL/Downloads/FocoMan/docs/QUICK_SETUP_GUIDE.md)** — Local environment initialization and startup instructions.
- **[DevPortal Setup Guide](file:///c:/Users/DELL/Downloads/FocoMan/docs/DEVPORTAL_SETUP.md)** — Developer portal setup and API credentials setup.
- **[Issue Analysis Document](file:///c:/Users/DELL/Downloads/FocoMan/docs/ISSUE_ANALYSIS.md)** — Diagnostic records for past platform issues.

---

## 8. Brand Assets

- **Brand Assets Directory:** `assets/brand/`
