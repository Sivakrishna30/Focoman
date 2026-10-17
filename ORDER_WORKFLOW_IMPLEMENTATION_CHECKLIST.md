# Unified Vertical Order Workflow Implementation Checklist

## Affected Files & Existing Logic

1. **`apps/web/src/components/workflow/OrderVerticalWorkflow.tsx`** [COMPLETED]
   - Reusable unified vertical workflow pipeline component.
   - Supports both `oms` and `tracking` variants.
   - Implements full 5-phase timeline + Phase 0 Lead/Booking origin distinction + Terminal Cancelled state.
   - Preserves dynamic service-to-crew mapping, task status transitions, dependency locking, and parallel streams.

2. **`apps/web/src/app/[studioSlug]/dashboard/oms/page.tsx`** [COMPLETED]
   - Integrated `OrderVerticalWorkflow` in the order details preview drawer.
   - Connected inline task status update actions (`handleUpdateTaskStatus`), crew assignments, and ERP member wizard.
   - Replaced redundant horizontal steppers while preserving existing order actions, filters, search, and soft-delete/cancel dialogs.

3. **`apps/web/src/app/track/[passkey]/TrackOrderClient.tsx`** [COMPLETED]
   - Integrated `OrderVerticalWorkflow` (`variant="tracking"`).
   - Ensured customer-safe read-only rendering without leaking private crew details, wages, or administrative actions.
   - Preserved customer review proof selections, comments, collaborator sharing, and Google account sync.

4. **`packages/types/src/index.ts` & `packages/domain/src/index.ts`** [COMPLETED]
   - Added `bookingRequestId?: string` to `CustomerTrackingView['order']` projection.
   - Preserved full type safety across domain projections and Next.js client components.

---

## Task Progress & Verification Matrix

- [x] **Audit & Planning**: Complete audit of existing order models, task dependencies, CRM/Marketplace booking flow, and tracking authentication.
- [x] **Phase 1: Shared Component (`OrderVerticalWorkflow.tsx`)**: Built the unified vertical timeline component with all 5 phases, parallel streams, and status badges.
- [x] **Phase 2: OMS Integration**: Connected `OrderVerticalWorkflow` to OMS order details drawer with full crew assignment & task mutation capabilities.
- [x] **Phase 3: Order Tracking Integration**: Connected `OrderVerticalWorkflow` to `TrackOrderClient.tsx` with customer permissions & view-only safety.
- [x] **Phase 4: Verification of 13 Core Scenarios**:
  - [x] Scenario 1: Directly registered confirmed order begins with Pre-Event Preparation.
  - [x] Scenario 2: Lead/booking order retains Inquiry & Booking progression.
  - [x] Scenario 3: Multiple services display dynamic service-to-crew assignments.
  - [x] Scenario 4: Pre-event tasks show correct actual statuses and progress.
  - [x] Scenario 5: Event-date restrictions continue to lock future post-event tasks.
  - [x] Scenario 6: Photography & videography pipelines display as separate parallel groups with independent progress.
  - [x] Scenario 7: Existing task dependencies prevent premature task progression.
  - [x] Scenario 8: Client Review and Rework statuses remain fully functional.
  - [x] Scenario 9: Final delivery and completion milestones respect completion requirements.
  - [x] Scenario 10: Cancelled orders display dedicated terminal state consistently.
  - [x] Scenario 11: OMS and Order Tracking display consistent workflow data.
  - [x] Scenario 12: Customer tracking respects permissions without exposing internal data.
  - [x] Scenario 13: Order actions, filters, search, and responsive layout remain intact.
- [x] **Phase 5: Build & Test Verification**: Ran `compile_applet` (succeeded) and `npm test` (31/31 tests passed).
