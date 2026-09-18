# 07 — ERP (Studio Members, Memberships, Invitations) CRUD & Recovery

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED  

---

## 1. Entities: `StudioMember`, `StudioMembership`, `StudioInvitation`

### Operations Required: `StudioMember`
- `createMemberAction`: Owner creates crew member, generates invitation.
- `getMemberAction`: Retrieve single member by `memberId`.
- `getStudioMembersAction`: List active members (`isDeleted != true`).
- `updateMemberAction`: Update member details, phone, skills list.
- `deleteMemberAction` (Soft-Delete): Sets `isDeleted = true`, `deletedAt = now()`, `deletedBy = uid`.
- `restoreMemberAction`: Validates recovery window, clears deletion flags.
- `getDeletedMembersAction`: Lists soft-deleted members for owner recovery.

### Operations Required: `StudioInvitation`
- `createMemberAction`: Generates invite with collision-safe token `INV-...`.
- `getStudioInvitationsAction`: List pending invitations.
- `revokeInvitationAction`: Marks invitation `REVOKED` or soft-deletes invite to prevent unauthorized redemption.
- `restoreInvitationAction`: Re-opens a revoked invitation if not expired.
- `acceptInvitationAction`: Atomic transaction redeeming invitation code and provisioning membership.

### Operations Required: `StudioMembership`
- `updateMembershipRoleAction`: Change role between `STUDIO_MEMBER` and `STUDIO_OWNER`.
- `revokeMembershipAction`: Deactivates membership (`status = INACTIVE`, `isDeleted = true`).
- `restoreMembershipAction`: Reactivates membership (`status = ACTIVE`, `isDeleted = false`).
