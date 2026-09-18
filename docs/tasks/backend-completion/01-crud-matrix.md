# 01 — Backend CRUD & Recovery Capability Matrix

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Auditor:** Senior Backend Architect + Full-Stack Engineer + QA Engineer  
**Status:** BASELINE AUDIT MATRIX  

---

## 1. Complete Entity CRUD Matrix

| Entity | Create | Read | Update | Delete | Restore | Current Implementation | Missing Capabilities |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **Order** | **YES** | **PARTIAL** | **PARTIAL** | **NO** | **NO** | `createOrderAction`, `getStudioOrdersAction`, `updatePaymentStatusAction`, `assignResourceAction` | `getOrderAction` (by ID), `updateOrderAction` (general fields), `deleteOrderAction` (soft delete), `restoreOrderAction`, `getDeletedOrdersAction` |
| **Task** | **PARTIAL** | **NO** | **PARTIAL** | **NO** | **NO** | Auto-batch generated upon order creation; `updateTaskStatusAction` | `createTaskAction` (ad-hoc), `getTaskAction` (by ID), `getOrderTasksAction`, `updateTaskAction` (details/assignee), `deleteTaskAction` (soft delete), `restoreTaskAction` |
| **Customer** | **YES** | **PARTIAL** | **NO** | **NO** | **NO** | `createCustomerAction`, `getStudioCustomersAction` | `getCustomerAction` (by ID), `updateCustomerAction`, `deleteCustomerAction` (soft delete), `restoreCustomerAction`, `getDeletedCustomersAction` |
| **Studio Member** | **YES** | **PARTIAL** | **NO** | **NO** | **NO** | `createMemberAction`, `getStudioMembersAction`, `confirmResourceAvailabilityAction` | `getMemberAction` (by ID), `updateMemberAction`, `deleteMemberAction` (soft delete), `restoreMemberAction`, `getDeletedMembersAction` |
| **Studio Membership** | **YES** | **YES** | **NO** | **NO** | **NO** | Atomic create in `registerStudio` & `acceptInvitation`; `getMembershipByUidAndStudio` | `updateMembershipRoleAction`, `revokeMembershipAction` (soft delete), `restoreMembershipAction` |
| **Studio Invitation** | **YES** | **YES** | **NO** | **NO** | **NO** | `createMemberAction` (creates invite), `getStudioInvitationsAction`, `acceptInvitationTransaction` | `revokeInvitationAction` (cancel pending invite), `restoreInvitationAction` |
| **Studio Workspace** | **YES** | **YES** | **PARTIAL** | **NO** | **NO** | `registerStudioAction`, `getUserStudiosAction`, `getStudioBySlugAction`, `updateStudioWhatsappConfigAction` | `updateStudioAction` (name, city, contact, feature flags), `deleteStudioAction` (soft delete), `restoreStudioAction` |
| **WhatsApp Config** | **YES** | **YES** | **YES** | **NO** | **NO** | Stored on studio doc; `updateStudioWhatsappConfigAction` | `resetStudioWhatsappConfigAction` (delete/reset to defaults) |
| **Marketplace Profile** | **YES** | **YES** | **YES** | **NO** | **NO** | `upsertMarketplaceProfileAction`, `getMarketplaceProfileAction`, `searchMarketplaceProfiles` | `deleteMarketplaceProfileAction` (unpublish/soft delete), `restoreMarketplaceProfileAction` |
| **Guest Tracking** | N/A | **YES** | N/A | N/A | N/A | `getOrderByPasskeyAction` | Exclude soft-deleted orders from passkey query |

---

## 2. Capability Definitions & Standards

### Standard Operations
1. **CREATE**: Server action accepting validated input + caller Firebase ID token. Checks caller authentication and studio membership. Generates collision-resistant ID via `crypto.randomUUID()`. Writes timestamps `createdAt` and `updatedAt`.
2. **READ**: Queries by ID or studio slug. **Enforces that soft-deleted entities are excluded by default** (`isDeleted != true`). Authenticates caller and verifies caller has active membership in the target studio.
3. **UPDATE**: Accepts partial validated payload + ID token. Verifies resource ownership and studio boundary. Mutates specified fields and refreshes `updatedAt`.
4. **DELETE (Soft Delete)**: Sets `isDeleted: true`, `deletedAt: string (ISO)`, `deletedBy: string (caller UID)`. Retains original ID, relationships, and history. Does NOT cascade destructive deletion to historical records.
5. **RESTORE**: Checks recovery window (`now - deletedAt <= RECOVERY_WINDOW_DAYS`). Clears `isDeleted: false`, `deletedAt: null`, `deletedBy: null`. Records `updatedAt: string (ISO)`. Preserves original identity and relationships.
