# 05 — OMS (Order Management System) CRUD & Recovery

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED  

---

## 1. Entities: `Order` & `Task`

### Operations Required: `Order`
- `createOrderAction`: Validated via `CreateOrderSchema`, generates UUID, passkey, creates order and default task pipeline.
- `getOrderAction`: Retrieves single order by `orderId`. Verifies studio membership and `isDeleted != true`.
- `getStudioOrdersAction`: Lists orders where `studioId == slug` and `isDeleted != true`.
- `updateOrderAction`: Allows updating event details, date, location, pricing, services. Verifies studio ownership.
- `deleteOrderAction` (Soft-Delete): Sets `isDeleted = true`, `deletedAt = now()`, `deletedBy = uid`.
- `restoreOrderAction`: Validates recovery window (`<= RECOVERY_WINDOW_DAYS`), clears deletion flags.
- `getDeletedOrdersAction`: Lists soft-deleted orders for owner recovery UI/admin.

### Operations Required: `Task`
- `createTaskAction`: Ad-hoc task creation for an active order.
- `getTaskAction`: Retrieves single task by `taskId`.
- `getOrderTasksAction`: Lists active tasks for an order (`isDeleted != true`).
- `updateTaskAction`: Update task details, assignee, rework notes, or sequence order.
- `updateTaskStatusAction`: Existing action for status progression.
- `deleteTaskAction` (Soft-Delete): Sets `isDeleted = true`, `deletedAt = now()`, `deletedBy = uid`. Recalculates order workflow status if necessary.
- `restoreTaskAction`: Validates recovery window, clears deletion flags, recalculates workflow status.

### Cascade & Relational Integrity Rules
- Soft-deleting an Order soft-deletes or deactivates associated workflow tasks from active pipelines.
- Soft-deleting an Order does NOT delete customer records or destroy financial audit data.
- Restoring an Order restores associated tasks that were deleted with the order.
