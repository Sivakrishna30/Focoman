# 13 — Integration Tests Specification

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED  

---

## 1. Test Architecture
Tests run natively via `node:test` and `node:assert`, evaluating:
1. Domain functions (`canCompleteOrder`, `evaluateOrderStatus`, `isWithinRecoveryWindow`, `applySoftDelete`, `applyRestore`)
2. Repository and Server Actions CRUD operations for:
   - Orders (Create, Read, Update, Soft-Delete, Restore, List-Active, List-Deleted)
   - Tasks (Create, Read, Update, Soft-Delete, Restore, List-Active)
   - Customers (Create, Read, Update, Soft-Delete, Restore, List-Active)
   - Members (Create, Read, Update, Soft-Delete, Restore, List-Active)
   - Invitations (Create, Read, Revoke, Accept)
   - Studio Workspace (Create/Register, Read, Update, Soft-Delete, Restore)
   - Marketplace Profiles (Upsert, Read, Soft-Delete, Restore, Search)
   - WhatsApp Configuration (Read, Update, Reset)
   - Guest Tracking (Passkey lookup for active orders, rejection of soft-deleted orders)
   - Cross-Studio Isolation (Rejection of unauthorized access across studios)
   - Recovery Window Expiry (Rejection of restore attempts beyond 14 days)
