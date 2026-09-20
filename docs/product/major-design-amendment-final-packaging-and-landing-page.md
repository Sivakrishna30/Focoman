# FOCOMAN — MAJOR PRODUCT DESIGN AMENDMENT
## Commercial Packaging, 30-Day Trial, WhatsApp Tiering & Final Landing Page Architecture

**Amendment:** CHG-032  
**Status:** APPROVED PRODUCT DESIGN CHANGE  
**Date:** September 20, 2026  
**Supersedes:** Any prior 14-day trial references and single-tier WhatsApp packaging in `pricing-and-entitlements.md` and legacy docs.

---

### 1. AUTHORITATIVE SCOPE & RATIFICATION
- The public landing page (`apps/web/src/app/page.tsx`), pricing matrix (`PricingAccordion.tsx`), and FAQ (`FaqAccordion.tsx`) represent the **FINAL APPROVED SPECIFICATION** for commercial packaging, public presentation, and product capabilities.
- All product and technical documentation must align with this ratified design amendment.

---

### 2. 30-DAY FULL-FEATURE TRIAL (REPLACES 14-DAY TRIAL)
The trial period is officially amended from 14 days to **30 days**:

```
New Studio Workspace Registered
            ↓
  30-Day Full Trial (Complete Plan Capabilities)
  • Smart Resource Automation enabled
  • WhatsApp notifications & Operations Bot enabled
  • Multi-studio switching enabled
  • Zero risk, no credit card required
            ↓
  User Chooses Plan (Free | Starter | Professional | Complete)
            ↓
  If No Action Taken at Day 30:
  • Automatic, non-destructive fallback to Free Plan (₹0)
  • 100% of studio data (orders, clients, financial records) safely preserved
  • Core OMS capabilities remain permanently accessible
```

---

### 3. AMENDED WHATSAPP PACKAGING & EVENT ARCHITECTURE
WhatsApp capabilities are decoupled from artificial user silos ("client" vs "crew") and structured around **operational lifecycle events**:

1. **Free Plan (₹0)**:
   - No automated WhatsApp dispatches.
2. **Starter Plan (₹499/mo) — Order Workflow Pipeline Notifications**:
   - Outbound automated alerts triggered on order pipeline status updates:
     - Booking confirmation & client access passkey link.
     - Advance payment receipt acknowledgment & balance due alerts.
     - Photo selection gallery ready link & final deliverable download notices.
3. **Professional Plan (₹999/mo) — Workflow Alerts + Event Reminders**:
   - Includes all Starter pipeline status notifications.
   - Adds automated upcoming event shoot & call-time schedule reminders (48h / 12h before shoot).
   - New incoming booking inquiry alerts to studio owner.
   - Production milestone progress & editing task completion notices.
4. **Complete Plan (₹1,999/mo) — Notifications + Interactive Operations Bot**:
   - Includes all Starter & Professional notifications and event reminders.
   - Interactive two-way WhatsApp Operations Bot for querying active orders, checking upcoming shoot schedules, and conversational status lookups.

---

### 4. STUDIO MARKETPLACE ARCHITECTURAL SEPARATION
- **Opt-in Public Discovery**: Studios opt into publishing their profile at `/studios/[slug]`.
- **Private Data Firewall**: Internal CRM records, financial books, profit margins, and internal crew rosters are strictly isolated from the public marketplace.
- **Dedicated Public Section**: On the public landing page, the Studio Marketplace is positioned as a dedicated showcase section directly after the 5-stage workflow, presented with an orange accent aesthetic and focused primary actions to "Explore Studio Marketplace" and "Publish Your Studio".
- **Entitlement**:
  - Viewing the marketplace and submitting booking inquiries is open to all visitors/clients.
  - Publishing studio packages and receiving in-app booking inquiries requires the **Professional Plan (₹999/mo)** or **Complete Plan (₹1,999/mo)**.

---

### 5. FINAL LANDING PAGE ARCHITECTURE & SECTION FLOW
The landing page layout is formally ratified as:
1. **Global Header & Navigation**: Brand shield icon, navigation links (`Features`, `Workflow`, `Marketplace`, `Pricing`, `Integrations`, `FAQ`), and Auth action buttons (`Sign In`, `Start Free Trial`).
2. **Hero Section**: Value proposition ("The Studio Business Operating System: Orders, Workflows, Crew & Deliveries. Under Control."), live interactive stage visual preview, and 30-Day Trial CTA.
3. **5-Stage Visual Workflow Carousel**:
   - Stage 01: Discovery & Inquiry (Packages, dates, live inquiries).
   - Stage 02: Advance & Pre-Flight (Payments, verification, conflict checks).
   - Stage 03: Crew & Shoot Day (Assignments, call-times, Google Calendar).
   - Stage 04: Post-Production (Milestones, editors, WhatsApp alerts).
   - Stage 05: Delivery & Final Balance (Selection galleries, settlement, completion).
4. **Studio Marketplace Showcase**: Two-column layout pairing value narrative with a verified studio profile card preview.
5. **Pricing Section**:
   - High-level value notes: 30-day trial with zero risk, automatic Free fallback with 100% data preservation, and unlimited events/orders management across all plans.
   - 4-Tier Interactive Accordion (Free ₹0, Starter ₹499, Professional ₹999, Complete ₹1,999) with expandable capability groups and explicit limitations.
6. **Native Integrations Section**: Google Workspace (Calendar, Drive), WhatsApp Cloud API, and Offline Payment Rails.
7. **FAQ Section**: Direct, professional, modern English answering core product, pricing, and specs questions with minimal context.
8. **Final CTA**: High-impact, focused 30-Day Free Trial conversion card in brand blue palette.
