# 11 — Cross-Studio Security & Isolation

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED  

---

## 1. Security Invariant
Every mutating and reading Server Action MUST verify that:
1. Caller is an active member or owner of the studio to which the resource belongs.
2. Even if an attacker supplies a valid `orderId` or `customerId` belonging to Studio B while passing credentials for Studio A, the operation MUST be rejected with `Authorization denied` or `Resource not found`.

## 2. Automated Test Strategy
The test suite will instantiate two separate studios: `studio-alpha` and `studio-beta`.
- User A (member of Alpha) will attempt to read, update, delete, and restore an order, customer, and task belonging to `studio-beta`.
- All operations must fail with explicit authorization rejection.
