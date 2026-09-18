# 12 — Soft-Delete & Recovery Window Engine

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED  

---

## 1. Centralized Recovery Window
- Configured in `@focoman/config` via `RECOVERY_WINDOW_DAYS = 14`.
- Extensible to other day intervals (7, 14, 30) or per-studio configuration without data migration.

## 2. Recovery Lifecycle & State Machine
```text
ACTIVE (isDeleted: false or undefined)
  ↓
DELETE OPERATION (delete*Action)
  ↓
SOFT DELETED (isDeleted: true, deletedAt: ISO string, deletedBy: callerUid)
  ↓
  ├──> within RECOVERY_WINDOW_DAYS: restore*Action -> ACTIVE (clears flags)
  └──> after RECOVERY_WINDOW_DAYS: restore*Action rejected with "Recovery window expired"
```

## 3. Rules on Cascade
- Order soft-deletion soft-deletes its child tasks to keep active task boards clean.
- Order soft-deletion does NOT delete customer records or erase audit trails.
- Member soft-deletion does NOT modify or erase historical completed orders or assignments.
