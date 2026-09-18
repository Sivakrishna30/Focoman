# 06 — CRM (Customer Relationship Management) CRUD & Recovery

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED  

---

## 1. Entity: `Customer`

### Operations Required
- `createCustomerAction`: Standalone or order-driven creation.
- `getCustomerAction`: Retrieve customer by `customerId`. Validates studio membership and `isDeleted != true`.
- `getStudioCustomersAction`: Lists customers for studio where `isDeleted != true`.
- `updateCustomerAction`: Mutates name, phone, email, address. Updates `updatedAt`.
- `deleteCustomerAction` (Soft-Delete): Sets `isDeleted = true`, `deletedAt = now()`, `deletedBy = uid`.
- `restoreCustomerAction`: Validates recovery window (`<= RECOVERY_WINDOW_DAYS`), clears deletion flags.
- `getDeletedCustomersAction`: Lists soft-deleted customers for owner recovery.

### Relational Preservation
- Deleting a customer excludes them from active CRM lists and lookups.
- Deleting a customer does NOT cascade-delete or corrupt existing orders. Historical orders retain customer details in their snapshot.
- When a customer is restored, their profile re-links to their full lifetime order history.
