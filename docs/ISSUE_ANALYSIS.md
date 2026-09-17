# FOCOMAN Architectural & System Issue Analysis

**Document Type:** Root Cause Analysis & Architectural Realignment  
**Status:** Active Historical & Reference Record  
**Project:** Focoman  
**Architecture:** 100% Full-Stack JavaScript / TypeScript Monorepo  

---

## 1. Executive Summary

During the architectural audit and realignment with the **Focoman Product Discovery Document**, 8 fundamental architectural, workflow, and system issues were identified. 

This document details the symptoms, root causes, and resolutions that guided the complete migration to an **OMS-First (Confirmed Order) TypeScript Monorepo** running on Next.js 15, Firebase Auth, and Google Cloud Firestore.

---

## 2. The 8 Core Architectural Issues & Root Causes

### Issue 1: Misaligned Order Creation (CRM Lead vs. OMS Confirmed Order)
* **Symptom**: The order creation pipeline attempted to act as a sales CRM, forcing users through preliminary lead stages, quotations, and pre-sales negotiations.
* **Root Cause**: Misalignment with the core value proposition of photography studios. Pre-event leads are chaotic and handled over calls/WhatsApp; the studio's true operational crisis begins **after booking confirmation**, when production deadlines, photo selections, and editing delays arise.
* **Resolution**: Realigned the entire platform to start strictly at **Confirmed Order** (`Awaiting Event` → `Post-Event In Progress` → `Completed`). Pre-event lead management was removed from Phase 1.

### Issue 2: Identity & Multi-Studio Architecture Anti-Pattern
* **Symptom**: A single user was locked to a single studio database record via custom passwords. Freelance photographers working with multiple studios had to register separate accounts with different email addresses.
* **Root Cause**: Coupling authentication (`users/{id}`) directly with studio tenancy (`studioId`), instead of separating personal identity from studio memberships.
* **Resolution**: Decoupled personal identity into **Google Sign-In (Firebase UID)**. Introduced `studio_memberships` documents and a dynamic workspace selector (`/workspaces`), enabling individuals to own a studio while simultaneously freelancing as crew members for other studios.

### Issue 3: Obsolete Dual-Stack Backend & Ephemeral Infrastructure
* **Symptom**: Legacy configurations relied on a separate Java Spring Boot service deployed to ephemeral container filesystems (H2 / Railway), causing dropped connections, 404 layout errors, and database wiped on restart.
* **Root Cause**: Split-service architecture maintaining two independent runtimes (Java backend + Next.js frontend) with mismatched endpoints and unpersisted local file storage.
* **Resolution**: Completely decommissioned Spring Boot, Java, and Railway. Consolidated into a single **100% TypeScript / JavaScript monorepo** with Next.js 15 Server Actions and Google Cloud Firestore for cloud persistence.

### Issue 4: Redundant Customer Account Creation & High Friction
* **Symptom**: Brides and event hosts were expected to register accounts, remember passwords, and log into a full dashboard just to view their wedding photos.
* **Root Cause**: Over-engineered customer portal attempting to treat end-clients as permanent SaaS users.
* **Resolution**: Eliminated customer account creation. Implemented a friction-free **Guest Passkey Order Tracker** (`/track/[passkey]`), allowing clients to track milestones, view proofs, and approve selections without a password.

### Issue 5: Silent Demo-Store Fallbacks Bypassing Security & Real Data
* **Symptom**: UI components silently fell back to an in-memory `demoStore` or `mockDb` whenever Firestore operations encountered authentication or permission failures, hiding errors from developers.
* **Root Cause**: Development mock shims were wired as silent catch-block fallbacks instead of explicitly isolated mock environments.
* **Resolution**: Purged all mock store fallbacks from mutating Server Actions (`orderActions`, `memberActions`, `customerActions`, `studioActions`). Real Firestore errors now bubble cleanly to Next.js error boundaries.

### Issue 6: Out-of-Scope Pre-Event Lifecycle Clutter
* **Symptom**: Cluttered dashboard navigation with quotation engines, invoice builders, and contract negotiation pipelines that added complexity without solving post-event delivery.
* **Root Cause**: Feature scope creep beyond the MVP boundary defined in the Product Discovery specification.
* **Resolution**: Streamlined core navigation to 4 focused operational pillars: **OMS** (Orders & Post-Event Tasks), **CRM** (Customer Directory & Order History), **ERP** (Crew Allocation & Availability), and **WhatsApp** (Milestone Notification Layer).

### Issue 7: Over-Complicated Role Matrices vs. Lightweight Crew Members
* **Symptom**: Enterprise-grade RBAC matrices (admin, manager, accountant, viewer) that were confusing and cumbersome for small-to-medium photography studios.
* **Root Cause**: Over-abstraction of user permissions ignoring real studio dynamics.
* **Resolution**: Simplified to two intuitive studio tiers:
  1. **Studio Owner**: Comprehensive studio operations, pricing, orders, and team administration.
  2. **Crew Member**: Scoped access to view assigned shoots, update workflow checklists, and upload proof links, with financial data strictly hidden.

### Issue 8: Broken Monorepo Package Boundaries & Client-Server Leaks
* **Symptom**: Next.js client components directly imported Firebase Admin SDK and secret-dependent packages, causing bundler errors and security warnings.
* **Root Cause**: Lack of boundary enforcement between client browser code and privileged server logic.
* **Resolution**: Enforced `"server-only"` guards in `packages/db` and routed all database mutations through Next.js Server Actions with authenticated session verification (`serverAuth.ts`).

---

## 3. Current Architecture Status

With all 8 issues resolved:
- The system is **100% full-stack TypeScript / JavaScript**.
- Confirmed Order is the **absolute starting point**.
- Database mutations are protected by **Firebase Admin** behind Server Actions.
- Personal identity is authenticated cleanly via **Google Sign-In**.
