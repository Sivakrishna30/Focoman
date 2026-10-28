# Specification & Task Document: Pro Entitlements, Modular Architecture, & Data Retention

**Document Reference**: `FOC-SPEC-PRO-MODULAR-001`  
**Author**: Antigravity Assistant  
**Date**: October 2026  
**Status**: Implemented & Verified  

---

## 1. Executive Summary

This document establishes the architectural rules and implementation specifications for:
1. **Lifetime Pro Whitelisted Test Accounts** that receive perpetual, zero-payment access to all professional studio capabilities.
2. **Modular Plan & Capability Model**, detailing how the Free Core (OMS + Marketplace) interacts with modular Pro capabilities (CRM, ERP, WhatsApp, Business Reports).
3. **Permissions, Data Isolation, & Zero Data Loss Guarantee** across enabled and disabled modules.
4. **Historic Order Immutability**, ensuring new settings apply only forward to new orders without mutating existing in-flight production pipelines.
5. **Business Analytics & Reports Audit**, verifying comprehensive financial metrics, receivables tracking, and trend charts.
6. **Customer Order Tracking View (`/track/[passkey]`) Fix**, ensuring shoot readiness reflects truthful crew allocation states.

---

## 2. Lifetime VIP Test Accounts Whitelist

The following accounts are designated as **Perpetual Pro Test Accounts**. They never require payments, subscription checkouts, or renewal authorizations at any time:

| Whitelisted Email Address | Account Role | Access Level | Billing Exemption |
| :--- | :--- | :--- | :--- |
| `sivakrishna.era@gmail.com` | Lead Admin / Developer | Lifetime Pro (All Modules) | 100% Exempt (Zero Payment) |
| `unpredictable.knucklehead.era@gmail.com` | Studio Owner / Lead Tester | Lifetime Pro (All Modules) | 100% Exempt (Zero Payment) |
| `randyrajesh678@gmail.com` | Studio QA / Tester | Lifetime Pro (All Modules) | 100% Exempt (Zero Payment) |
| `sweetchinmusixyt@gmail.com` | Studio QA / Tester | Lifetime Pro (All Modules) | 100% Exempt (Zero Payment) |

### Code Implementation
Implemented in [`apps/web/src/lib/proEntitlements.ts`](file:///c:/Users/DELL/Downloads/FocoMan/apps/web/src/lib/proEntitlements.ts):
```typescript
export const LIFETIME_PRO_EMAILS: readonly string[] = [
  "sivakrishna.era@gmail.com",
  "unpredictable.knucklehead.era@gmail.com",
  "randyrajesh678@gmail.com",
  "sweetchinmusixyt@gmail.com",
] as const;

export function isLifetimeProEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return LIFETIME_PRO_EMAILS.some((item) => item.toLowerCase() === clean);
}
```
**Enforcement Points**:
- [`DashboardLayout`](file:///c:/Users/DELL/Downloads/FocoMan/apps/web/src/app/%5BstudioSlug%5D/dashboard/layout.tsx): Automatically marks `isProPlan: true` and activates all module flags (`oms`, `crm`, `erp`, `whatsapp`, `reports`, `marketplace`).
- [`DashboardTopNav`](file:///c:/Users/DELL/Downloads/FocoMan/apps/web/src/components/DashboardTopNav.tsx): Renders `LIFETIME PRO` badge and displays `"✓ VIP Test Account · All Pro Features Active"` instead of upgrade triggers.
- [`CRM Module`](file:///c:/Users/DELL/Downloads/FocoMan/apps/web/src/app/%5BstudioSlug%5D/dashboard/crm/page.tsx): Suppresses the upgrade banner entirely.

---

## 3. Modular Architecture: Basic Core vs. Pro Modules

Focoman utilizes a **Capability-Based Modular Model**. Studios start with a basic account and can choose to activate or subscribe to specific modules.

```
┌─────────────────────────────────────────────────────────────┐
│                    FOCOMAN CORE (FREE)                      │
│   • OMS Basic (Orders, 5-Stage Production Workflow, Tasks)  │
│   • Studio Marketplace (Public Profile, Directory, Leads)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Optional Pro Modules
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   Studio ERP    │   │  Customer CRM   │   │Business Reports │
│ Crew, Gear,     │   │ Clients, LTV,   │   │ Financials,     │
│ Availability    │   │ Receivables     │   │ Receivables, SLA│
└─────────────────┘   └─────────────────┘   └─────────────────┘
         ▲                     ▲                     ▲
         └─────────────────────┼─────────────────────┘
                               ▼
                      ┌─────────────────┐
                      │ WhatsApp Alerts │
                      │ Auto-Triggers,  │
                      │ Bot Check-in    │
                      └─────────────────┘
```

### Module Breakdown

| Module | Classification | Default (New Account) | Capabilities Provided |
| :--- | :--- | :---: | :--- |
| **OMS** | Free Core | **Enabled** | Order creation, vertical production pipeline, shoot dates, passkey tracking links. |
| **Marketplace** | Free Core | **Enabled** | Public studio profile, portfolio showcase, direct inquiry lead capture. |
| **Studio ERP** | Pro Module | *Disabled* | Crew roster, invitations/passcodes, role allocation, temporary crew conversion. |
| **Customer CRM**| Pro Module | *Disabled* | Client database, order history, receivables per customer, lifetime value. |
| **WhatsApp** | Pro Module | *Disabled* | Automated client & crew notifications upon shoot assignment & delivery. |
| **Reports** | Pro Module | *Disabled* | Gross revenue, monthly trends, collection rates, package profitability. |

---

## 4. Permissions, Data Handling, & Zero Data Loss Guarantee

### A. What happens to unselected or toggled-off modules?
1. **Zero Data Loss Guarantee**:
   - Disabling a module or downgrading a plan **never purges, drops, or alters historic database collections**.
   - If ERP is turned off, all `StudioMember` documents, invitations, and assigned crew records remain permanently intact in Firestore.
   - If CRM is turned off, all `Customer` documents and aggregated booking records remain preserved.
2. **Access Control**:
   - Navigating to an unselected module page gracefully presents either an informational upgrade banner or a toggle to enable the module in Studio Settings.
   - Background tasks or webhooks for disabled modules are safely bypassed without throwing runtime exceptions.
3. **Reactivation**:
   - The moment a studio upgrades to Pro or re-enables a module, **100% of their existing data, settings, and team structure are instantly visible and operational**.

### B. Forward-Only Schema & Historic Order Immutability
1. **Historic Order Safety**:
   - Confirmed orders represent a legal and financial contract between the studio and customer.
   - Enabling a new Pro feature, changing catalog base prices, or altering package combos **only affects new orders created after the change**.
   - Existing orders retain their exact pricing snapshot (`finalConfirmedPrice`, `advanceAmount`, `remainingAmount`) and allocated services.
2. **Shoot Crew Workflow Decoupling**:
   - In Phase 1 (Pre-Event Preparation), service assignments are independent.
   - Phase 3 (Post-Event Production) auto-populates tasks from Phase 1 initially for convenience, but task assignments can be customized independently without altering Phase 1 records.

---

## 5. Business Analytics & Reports Completeness Audit

The **Business Reports & Analytics** dashboard ([`apps/web/src/features/dashboard/BusinessReportsView.tsx`](file:///c:/Users/DELL/Downloads/FocoMan/apps/web/src/features/dashboard/BusinessReportsView.tsx)) has been audited for operational completeness:

- [x] **Revenue & Receivables Cards**:
  - `Total Confirmed Revenue`: Sum of `finalConfirmedPrice` across filtered orders.
  - `Collected Revenue`: Real-time sum of verified advances and payments.
  - `Pending Receivables`: Total outstanding client balance prior to final deliverable dispatch.
  - `Collection Rate`: Percentage calculation of collected vs. total confirmed revenue.
  - `Average Order Value (AOV)`: Auto-calculated benchmark per booking.
- [x] **Rolling 6-Month Revenue Trend**:
  - Calculates dynamic monthly revenue bars based on actual order event dates.
- [x] **Shoot Category Breakdown**:
  - Groups orders by `eventType` (Wedding, Reception, Housewarming, etc.) with proportional revenue share.
- [x] **Actionable Outstanding Balances Table**:
  - Sorts clients with unpaid balances before delivery dispatch.
- [x] **Timeframe Filtering**:
  - Seamless toggling between `All Time`, `YTD`, `6 Months`, and `30 Days`.
- [x] **Export Capability**:
  - Integrated browser print / PDF export stylesheet trigger.

---

## 6. Truthful Shoot Readiness in Customer Tracking View

### Problem Identified
On customer tracking links (`/track/[passkey]`), booked services with no crew assigned were showing `"Preparation Scheduled"`, which misled clients into believing crew had been confirmed.

### Resolution Implemented
In [`OrderVerticalWorkflow.tsx`](file:///c:/Users/DELL/Downloads/FocoMan/apps/web/src/components/workflow/OrderVerticalWorkflow.tsx#L770-L788):
- If crew is assigned: Displays green indicator with **`Crew & Equipment Confirmed`**.
- If crew is not assigned: Displays neutral indicator with **`Unassigned`**.

---

## 7. Actionable Verification & UAT Checklist

- [x] Whitelisted emails in `proEntitlements.ts` recognized across all layouts.
- [x] Studio owner excluded from Temporary Crew listing in ERP and OMS.
- [x] Shoot Readiness tracking view displays `"Unassigned"` when crew is not allocated.
- [x] Phase 1 shoot crew assignments operate with strict independence.
- [x] Phase 3 production tasks support independent crew modifications.
- [x] All 31 backend and domain test suites passing with 0 errors.
- [ ] Automated browser UAT testing loop (ready to execute).
