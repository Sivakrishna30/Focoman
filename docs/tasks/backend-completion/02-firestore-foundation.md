# Firestore Foundation Audit & Specification

**Date**: 2026-09-18  
**Scope**: Firestore collections, indices, document schemas, and soft-delete/recovery representation.

---

## 1. Collections & Document IDs

| Collection | Document ID Strategy | Studio Isolation Field | Soft-Delete Fields |
| :--- | :--- | :--- | :--- |
| `studios` | Studio Slug (e.g., `lumina-studios`, lowercase) | `id` (Self) | `isDeleted`, `deletedAt`, `deletedBy` |
| `memberships` | `{studioId}_{uid}` | `studioId` | `status: 'ACTIVE' \| 'INACTIVE'` |
| `members` | Auto-generated UUID or Firestore ID | `studioId` | `isDeleted`, `deletedAt`, `deletedBy` |
| `invitations` | Code (e.g., `INV-ABCD-1234`) | `studioId` | `isDeleted`, `deletedAt`, `deletedBy`, `status: 'REVOKED'` |
| `orders` | Order ID (e.g. `ORD-XXXX` or UUID) | `studioId` | `isDeleted`, `deletedAt`, `deletedBy` |
| `tasks` | Task ID (UUID) | `studioId`, `orderId` | `isDeleted`, `deletedAt`, `deletedBy` |
| `customers` | Customer ID (UUID / `CUST-XXXX`) | `studioId` | `isDeleted`, `deletedAt`, `deletedBy` |
| `marketplace_profiles`| Studio ID / Slug | `studioId` | `isDeleted`, `deletedAt`, `deletedBy`, `isVisible` |

---

## 2. Default Query Behavior & Filtering

- **Active Normal Queries**: Must filter out soft-deleted records (`isDeleted != true` or client/server exclusion). In Firestore, fields that do not exist or are `null` / `false` must be handled cleanly. 
  - Implementation strategy in `@focoman/db`:
    ```ts
    // Query includes documents where isDeleted is false or not set
    const docs = snap.docs
      .map(d => d.data() as T)
      .filter(item => !item.isDeleted);
    ```
    This avoids requiring complex composite inequality indexes across all legacy documents while guaranteeing 100% exclusion of soft-deleted records across all normal read operations.
- **Dedicated Deleted Queries**:
  - `getDeletedOrdersByStudioId(studioId)`
  - `getDeletedCustomersByStudioId(studioId)`
  - `getDeletedMembersByStudioId(studioId)`
  These filter specifically for `item.isDeleted === true`.

---

## 3. Recovery Window & Timestamp Model

All entities implementing `SoftDeletable` track:
- `isDeleted?: boolean`: Set to `true` on deletion, `false` / cleared on restore.
- `deletedAt?: string | null`: ISO 8601 timestamp string (`new Date().toISOString()`).
- `deletedBy?: string | null`: Authenticated caller's `uid`.
- Recovery eligibility:
  $$\text{Eligible if } (\text{now} - \text{deletedAt}) \le (\text{RECOVERY\_WINDOW\_DAYS} \times 86400 \times 1000)$$
  where `RECOVERY_WINDOW_DAYS = 14`.
