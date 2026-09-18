# FOCOMAN — MAJOR PRODUCT DESIGN AMENDMENT
## Marketplace → Booking → Confirmed Order → OMS Lifecycle

**Status:** APPROVED PRODUCT DESIGN CHANGE  
**Date:** September 18, 2026  

---

### 1. AUTHORITATIVE SOURCE-OF-TRUTH RULE
- Treat `docs/product/product-discovery-document.md` as primary source of truth.
- Treat this document as the newest approved product direction.
- Product Discovery remains authoritative for everything not explicitly changed here.
- Legacy documents (`srs-mvp.md`, etc.) MUST NOT override Product Discovery or this amendment.

---

### 2. CORE PRODUCT DIRECTION CHANGE
The product lifecycle expands from simple confirmed orders to:

```
Marketplace → Studio Profile → Studio Services / Packages → Booking Request / Lead → Optional Negotiation → Final Agreed Amount → Advance Payment Request → Payment → Payment Verification → Booking Confirmed → Confirmed Order → Pre-flight / Conflict Check → Resource Planning → Event → Post-Event Workflow → Delivery → Final Payment → Completed
```

- **Cancellation** is a business state (`CANCELLED`).
- **Deletion** is a data-management operation (`isDeleted: true` soft-delete with 14-day recovery).
- Never merge Cancelled, Deleted, and Completed.

---

### 3. MARKETPLACE MODEL
- **NOT** a price-comparison marketplace.
- No comparison tables, ranking systems, side-by-side package comparisons, or price leaderboards across studios.
- Each studio has an independent marketplace presence. Customers explore one studio at a time.
- Studio manages profile, services, packages, pricing, descriptions, negotiable setting.

---

### 4. STUDIO PACKAGES
- Packages belong to individual studios (`studioId`).
- Package fields: `id`, `studioId`, `name`, `description`, `services`, `price`, `isNegotiable`, `createdAt`, `updatedAt`, `isDeleted`.
- No global package catalogue.

---

### 5. NEGOTIATION
- Optional per package (`isNegotiable: boolean`).
- When negotiable = ON, customer can request negotiation (`BOOKING_NEGOTIATING`).
- Owner and customer agree on final amount, which updates the booking amount for payment/order creation.
- No complex auction/bidding or chat engines required.

---

### 6. CONTRACTS — REMOVED FROM SCOPE
- Contracts are explicitly OUT OF SCOPE.
- Remove contract workflows, templates, e-signatures, signing states from product docs & flows.

---

### 7. BOOKING CONFIRMATION & ADVANCE PAYMENTS
- Booking Confirmation is a major state transition requiring verified payment (advance or full).
- States distinguished:
  - `Payment Recorded` / `Payment Submitted`
  - `Payment Pending Verification`
  - `Payment Verified`
  - `Booking Confirmed`
- Supports offline payments (Cash, UPI, Bank Transfer, Other) with optional payment proof attachment (receipt / screenshot).
- Offline payments must be verified by Studio Owner before confirming the booking.
- Online payment gateway readiness maintained (without hardcoding specific gateway or forcing commission fees).

---

### 8. PRE-FLIGHT / CONFLICT CHECK & AUTOMATED RESOURCE SUGGESTIONS
- Before confirming booking/order, pre-flight check evaluates:
  - Event date conflicts (overlapping events/orders)
  - Location notes / Google Maps link / coordinates
  - Crew/member role, skill matching, availability, workload
- Automation principle: **SYSTEM SUGGESTS → STUDIO OWNER REVIEWS → STUDIO OWNER CONFIRMS → ASSIGNMENT SAVED**. No autonomous background assignment.

---

### 9. CUSTOMER ACCOUNT & AUTHENTICATION
- Primary relationship types: Studio Owner, Studio Member, Customer.
- Single personal identity (Firebase UID) with relationship context.
- Customer account features: profile, marketplace interaction, booking requests, negotiation, payment submissions, order tracking, authorized order history across studios.
- Strict data isolation: Customer sees only authorized projections/DTOs (no internal notes, crew assignments, internal financials, or private studio configs).

---

### 10. DELETE VS CANCEL
- **Cancel**: Business state (`CANCELLED`). Preserves business history, reason, timestamp.
- **Delete**: Data management (`isDeleted: true`). Soft-delete with centrally configurable recovery window (`RECOVERY_WINDOW_DAYS = 14`).

---

### 11. STATUS SEPARATION
Order/Booking Status, Payment Status, and Task Status are strictly separate:
- **Order/Booking Status**: `BOOKING_REQUEST`, `BOOKING_NEGOTIATING`, `AWAITING_PAYMENT`, `PAYMENT_PENDING_VERIFICATION`, `BOOKING_CONFIRMED`, `CONFIRMED_ORDER`, `CANCELLED`, `COMPLETED`.
- **Payment Status**: `PENDING`, `SUBMITTED`, `PENDING_VERIFICATION`, `VERIFIED`, `COMPLETED`.
- **Task Status**: `PENDING`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`, `BLOCKED`.
