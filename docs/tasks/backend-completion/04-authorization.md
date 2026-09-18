# 04 — Server Authorization & Resource Ownership Rules

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Auditor:** Senior Security Architect  
**Status:** SPECIFIED  

---

## 1. Zero-Trust Server Action Authorization Flow

Every Server Action executing a read or mutation on a studio resource MUST strictly follow this 7-step sequence:

```text
Incoming Request (payload + idToken)
  ↓
1. requireVerifiedUser(idToken) -> extract caller UID
  ↓
2. Determine target studioSlug/studioId
  ↓
3. requireStudioMember(caller UID, target studioId, [requiredRole]) -> verifies active membership
  ↓
4. Load target entity from database
  ↓
5. Verify target entity.studioId === target studioId (Cross-Studio Isolation Guard)
  ↓
6. If entity is soft-deleted and action is normal operation -> REJECT (Not Found / Deleted)
  ↓
7. Execute domain operation / repository write
```

## 2. Role Rules
- `STUDIO_OWNER`:
  - Full CRUD on Orders, Tasks, Customers, Members, Invitations, WhatsApp Config, Marketplace Profile, Studio Workspace.
  - Can view soft-deleted records (`getDeleted*Action`).
  - Can perform `restore*Action` within `RECOVERY_WINDOW_DAYS`.
- `STUDIO_MEMBER`:
  - Can read orders, tasks, members, customers within the authorized studio.
  - Can update task status for assigned tasks.
  - Cannot soft-delete or restore orders, members, customers, or studio configuration.

## 3. Cross-Studio Protection
Under no circumstances may a user authenticated in Studio A mutate or read records belonging to Studio B, even if the user guesses the record ID. This will be verified in automated tests.
