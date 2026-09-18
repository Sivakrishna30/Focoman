# 03 — Authentication Audit & Unused Surface Quarantine

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Auditor:** Security Engineer  
**Status:** AUDITED  

---

## 1. Authentication Architecture Audit

Per `docs/technical/identity-and-auth-architecture.md`:
- Sole Phase 1 identity provider: **Google Sign-in through Firebase Authentication**.
- Personal identity is uniquely identified by Firebase UID.
- Custom usernames, email/password registrations, anonymous accounts, and SMS OTP logins are **expressly prohibited** as contradictory auth surfaces.

### Surface Review
- Client UI (`apps/web`): Google Sign-In button (`signInWithPopup(auth, googleProvider)`).
- Server Actions (`apps/web/src/actions/*`): Verified via `requireVerifiedUser(idToken)` calling `admin.auth().verifyIdToken(idToken)`.
- No custom passwords, salts, or username registrations are stored in Firestore.
- No anonymous auth tokens are used for guest tracking (tracking uses passkey strings `FOC-...` against order records).

## 2. Findings & Verification
- Unused auth paths: None present in active code. Legacy mock in-memory stores have already been eliminated per CHG-010.
- All mutating Server Actions now require `idToken` parameter and verify identity server-side.
