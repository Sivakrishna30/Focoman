# FOCOMAN — APPROVED PRICING MODEL & FEATURE ENTITLEMENT ARCHITECTURE

**Amendment:** CHG-026  
**Status:** APPROVED — September 18, 2026  
**Supersedes:** Any previous provisional pricing in `docs/` or `pricing/page.tsx`

---

## 1. PLAN STRUCTURE

Focoman has exactly **four** customer-facing plan states:

| Plan | Price | Positioning |
|------|-------|-------------|
| FREE | ₹0/month | "Manage Your Orders" |
| STARTER | ₹499/month | "Run Your Studio" |
| PROFESSIONAL | ₹999/month | "Get Discovered & Operate Your Business" |
| COMPLETE | ₹1,999/month | "Automate & Scale" |

**No additional plans.** Do NOT create event-based plans, project-count plans, enterprise plans, agency plans, or add-on pricing tiers unless separately approved.

---

## 2. PRICING PHILOSOPHY

Focoman does **NOT** use event/order count as the primary pricing mechanism.

- **Unlimited orders** on all plans
- **Unlimited events** on all plans
- **No storage-as-pricing** model

Pricing differentiation is based on:
- Feature capability
- Business value
- Automation level
- Marketplace visibility
- Communication (WhatsApp)
- Scale (Multi-Studio)

---

## 3. 14-DAY FULL-FEATURE TRIAL

Every new studio receives a **14-day full-feature trial** with COMPLETE plan entitlements.

```
New Studio Created
      ↓
14-Day Trial (COMPLETE capabilities)
      ↓
User Chooses Plan
      ↓
FREE | STARTER | PROFESSIONAL | COMPLETE

If no action:
      ↓
FREE (no data deletion)
```

**Trial rules:**
- Data is NEVER deleted when trial expires
- Orders, customers, payments, and history are preserved
- Features become inaccessible per FREE plan entitlement after trial

---

## 4. FEATURE MATRIX

| Capability | FREE | STARTER ₹499 | PROFESSIONAL ₹999 | COMPLETE ₹1,999 |
|-----------|------|--------------|-------------------|-----------------|
| **OMS** | | | | |
| Unlimited Orders | ✓ | ✓ | ✓ | ✓ |
| Unlimited Events | ✓ | ✓ | ✓ | ✓ |
| Core OMS | ✓ | ✓ | ✓ | ✓ |
| Task & Status Tracking | ✓ | ✓ | ✓ | ✓ |
| Delivery Tracking | ✓ | ✓ | ✓ | ✓ |
| Basic Payment Tracking | ✓ | ✓ | ✓ | ✓ |
| **CRM** | | | | |
| Basic Customer Info (in orders) | ✓ | ✓ | ✓ | ✓ |
| Customer CRM Directory | — | ✓ | ✓ | ✓ |
| Customer History | — | ✓ | ✓ | ✓ |
| **ERP** | | | | |
| Team Management | — | ✓ | ✓ | ✓ |
| Roles & Skills | — | ✓ | ✓ | ✓ |
| Manual Assignment | — | ✓ | ✓ | ✓ |
| Availability & Schedule | — | — | ✓ | ✓ |
| Workload Planning | — | — | ✓ | ✓ |
| Conflict Detection | — | — | ✓ | ✓ |
| Resource Suggestions | — | — | ✓ | ✓ |
| Smart Resource Automation | — | — | — | ✓ |
| **Booking & Payments** | | | | |
| Booking Requests | — | ✓ | ✓ | ✓ |
| Negotiation | — | ✓ | ✓ | ✓ |
| Offline Payment Recording | — | ✓ | ✓ | ✓ |
| Payment Proof | — | ✓ | ✓ | ✓ |
| Payment Verification | — | ✓ | ✓ | ✓ |
| **Marketplace** | | | | |
| Marketplace Configuration | — | ✓ | ✓ | ✓ |
| **Public Marketplace Listing** | — | — | **✓** | ✓ |
| **Integrations** | | | | |
| Google Calendar | — | — | ✓ | ✓ |
| Google Drive | — | — | ✓ | ✓ |
| **Automation** | | | | |
| Basic Automation | — | ✓ | ✓ | ✓ |
| Advanced Automation | — | — | ✓ | ✓ |
| **Analytics** | | | | |
| Basic Analytics | ✓ | ✓ | ✓ | ✓ |
| Advanced Analytics | — | — | ✓ | ✓ |
| **WhatsApp** | | | | |
| WhatsApp Notifications | — | — | — | ✓ |
| WhatsApp Operations Bot | — | — | — | ✓ |
| **Multi-Studio** | | | | |
| Multi-Studio Management | — | — | — | ✓ |

---

## 5. PLAN DETAILS

### FREE — ₹0

Genuine usable experience. Focuses on core order management.

**Includes:**
- Unlimited orders and events
- Full OMS lifecycle (create, view, edit, cancel, delete/recover)
- Basic customer info within orders (name, phone, email)
- Task and status tracking
- Basic payment tracking
- Delivery tracking
- Basic analytics dashboard

**Does NOT include:** CRM directory, team management, marketplace, WhatsApp, booking requests, negotiation, Google integrations

---

### STARTER — ₹499/month

First serious studio management plan.

**Everything in FREE plus:**
- Customer CRM directory & history
- Basic ERP: studio members, roles, skills, manual assignment
- Booking requests from marketplace inquiries
- Optional negotiation
- Offline payment recording (Cash, UPI, Bank Transfer, Other)
- Payment proof attachment
- Studio owner payment verification
- Booking confirmation flow
- Marketplace configuration (internal only — cannot publish publicly)
- Basic automation

---

### PROFESSIONAL — ₹999/month

Introduces public marketplace visibility and advanced operations.

**Everything in STARTER plus:**
- **Public Studio Marketplace listing** (primary Professional differentiator)
- Member availability & schedule planning
- Workload visibility
- Conflict detection
- Resource suggestions (System Suggests → Owner Confirms)
- Google Calendar integration
- Google Drive integration
- Advanced automation
- Advanced analytics

---

### COMPLETE — ₹1,999/month

Full automation and scale.

**Everything in PROFESSIONAL plus:**
- Smart Resource Automation (AI-powered suggestions — owner always confirms)
- WhatsApp Notifications (outbound: Focoman → WhatsApp)
- WhatsApp Operations Bot (interactive: Focoman ↔ WhatsApp)
- Multi-Studio management
- Advanced multi-studio analytics

---

## 6. MARKETPLACE MONETIZATION PRINCIPLE

**Public marketplace publishing is gated to PROFESSIONAL+.**

Upgrade journey:
```
FREE → "I need studio management" → STARTER ₹499
STARTER → "I want customers to find me" → PROFESSIONAL ₹999
PROFESSIONAL → "I want automation" → COMPLETE ₹1,999
```

STARTER users MAY configure their marketplace profile internally (name, description, packages, pricing, negotiable flag) but CANNOT set `isVisible: true` — this is enforced server-side.

---

## 7. ENTITLEMENT ARCHITECTURE

### Central Capability IDs

```
OMS_CORE
CUSTOMER_BASIC
CUSTOMER_CRM
TEAM_MANAGEMENT
MANUAL_ASSIGNMENT
MARKETPLACE_CONFIGURATION
MARKETPLACE_PUBLIC
BOOKING_REQUESTS
NEGOTIATION
PAYMENT_RECORDING
PAYMENT_VERIFICATION
ERP_BASIC
ERP_AVAILABILITY
ERP_WORKLOAD
ERP_CONFLICT_DETECTION
ERP_RESOURCE_SUGGESTION
ERP_SMART_RESOURCE_AUTOMATION
GOOGLE_CALENDAR
GOOGLE_DRIVE
AUTOMATION_BASIC
AUTOMATION_ADVANCED
ANALYTICS_BASIC
ANALYTICS_ADVANCED
WHATSAPP_NOTIFICATIONS
WHATSAPP_BOT
MULTI_STUDIO
ADVANCED_INTEGRATIONS
```

### Implementation Location

- Types: `packages/types/src/index.ts` — `PlanType`, `CapabilityId`, `StudioPlan`
- Constants: `packages/config/src/index.ts` — `PLAN_CAPABILITIES`, `PLAN_PRICES`, `TRIAL_DURATION_DAYS`
- Logic: `packages/entitlements/src/index.ts` — `hasCapability()`, `getEffectivePlan()`, `isTrialActive()`
- Server enforcement: `apps/web/src/lib/entitlementAuth.ts` — `requireCapability()`

### Critical Rule: Product Capability ≠ Pricing Logic

Domain logic (e.g., `generateResourceSuggestions()`) must NOT contain plan checks.  
Plan checks live exclusively in the entitlement layer.  
Server actions call `requireCapability()` before invoking domain functions.

---

## 8. DOWNGRADE SAFETY

Downgrading NEVER destroys data.

On downgrade (e.g., COMPLETE → FREE):
- Orders: preserved
- Customers: preserved
- Payments: preserved
- Marketplace config: preserved (but cannot publish)
- Team members: preserved (but management UI gated)
- Historical records: preserved

Features become inaccessible per new plan entitlement, but all data remains safe.

---

## 9. SECURITY REQUIREMENTS

- Plan restrictions are NEVER enforced only in frontend code
- Server-side `requireCapability()` checks are mandatory for all plan-gated actions
- Marketplace `isVisible: true` requires server-side PROFESSIONAL+ check
- Studio isolation enforced at all levels
- Customer isolation: `customerId === decoded.uid` check on all customer-facing endpoints

---

## 10. CONTRACTS — EXCLUDED

Contracts, e-signatures, contract templates, and signing workflows are **OUT OF SCOPE** for Focoman. Do not implement or advertise.

---

*Document created: CHG-026, September 18, 2026*
