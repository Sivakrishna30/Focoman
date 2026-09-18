# 14 — Final Verification & Readiness Checklist

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED — IN PROGRESS  

---

## Architecture Checklist
- [ ] Next.js server execution architecture intact
- [ ] Firebase Admin correctly configured with fail-fast validation
- [ ] Firestore repository boundary intact with `"server-only"`
- [ ] No in-memory mock fallback in production data paths

## CRUD & Recovery Checklist
- [ ] OMS CRUD (Orders & Tasks: Create, Read, Update, Delete/Soft-Delete, Restore)
- [ ] CRM CRUD (Customers: Create, Read, Update, Delete/Soft-Delete, Restore)
- [ ] ERP CRUD (Members, Memberships, Invitations: Create, Read, Update, Delete/Revoke, Restore)
- [ ] WhatsApp Configuration (Read, Update, Reset)
- [ ] Marketplace Profiles (Create/Upsert, Read, Soft-Delete, Restore, Search)
- [ ] Centralized Recovery Window (`RECOVERY_WINDOW_DAYS = 14`)
- [ ] Normal read queries exclude soft-deleted records by default
- [ ] Relationships preserved without orphaned data

## Security Checklist
- [ ] Authentication required on all mutating Server Actions (`requireVerifiedUser`)
- [ ] Studio membership authorization enforced (`requireStudioMember`)
- [ ] Cross-studio isolation strictly validated
- [ ] Safe, unauthenticated guest order tracking with soft-deleted exclusion
- [ ] Firestore rules deny all direct client mutations (`allow read, write: if false;`)

## Quality & Testing Checklist
- [ ] Unit & domain tests PASS
- [ ] Integration & security tests PASS
- [ ] Typecheck PASS
- [ ] Lint PASS
- [ ] Build PASS
- [ ] CHANGELOG.md updated with factual entries
