# 10 — Guest Order Tracking Verification

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED  

---

## 1. Requirements & Invariants
- `getOrderByPasskeyAction(passkey)` is unauthenticated and public.
- It returns safe tracking projection only (customer name, event type, date, location, progress, payment status).
- **Soft-Delete Invariant:** If an order has `isDeleted == true`, `getOrderByPasskeyAction` MUST return not found / error. Soft-deleted orders must never be leaked to guest tracking.
- Passkeys are cryptographically random strings (`FOC-[A-Z0-9]{8}`) generated with `crypto.randomBytes()`.
