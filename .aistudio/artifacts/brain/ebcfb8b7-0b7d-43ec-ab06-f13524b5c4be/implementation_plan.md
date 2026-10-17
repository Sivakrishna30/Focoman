# Unified Vertical Order Workflow Across OMS and Order Tracking

Unify the order workflow UI in Focoman into a single, cohesive Vertical Workflow Pipeline shared between the OMS Order Details drawer and the Customer-Facing Order Tracking portal.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were confirmed during Phase 1 interactive clarification:
> - **Default Phase Expansion**: Expand the currently active phase by default while collapsing completed and upcoming phases to keep the screen concise and readable. Users can freely expand or collapse any individual phase.
> - **OMS Task Interaction**: Provide inline status action buttons (e.g., Start, Send for Review, Complete) directly within compact task rows for authorized studio owners and assigned crew members.
> - **Customer Tracking Privacy & View-Only Mode**: The customer-facing tracking view will render the identical vertical pipeline structure but strictly in view-only mode, without exposing internal crew contact lists, private staff identifiers, or administrative mutation buttons.

---

## 1. Overview & Core Concept

Currently, order progression is displayed inconsistently:
- OMS features a horizontal 3-node lifecycle stepper (`Awaiting Event` → `Post-Event` → `Completed`) with a separate `Pre-Event Shoot Planning` table above it and post-event tasks below it.
- The Customer Order Tracking page (`TrackOrderClient.tsx`) duplicates another horizontal stepper and displays a flat task list.
- Converted leads / marketplace bookings and directly registered orders are not visually differentiated in their origin pipeline.

### The Unified Solution
We introduce a single, production-grade **Unified Vertical Workflow Component** (`OrderVerticalWorkflow.tsx`) shared across both surfaces:
1. **OMS Orders Page** (`apps/web/src/app/[studioSlug]/dashboard/oms/page.tsx`): Full interactive workflow inside the order details drawer with inline status transitions, crew assignments, dependency warnings, and event locks.
2. **Order Tracking Page** (`apps/web/src/app/track/[passkey]/TrackOrderClient.tsx`): Clean, branded client timeline showing the exact same phases, progress metrics, and deliverable review stages with customer-safe access control.

---

## 2. User Experience & Visual Design

### The Vertical Pipeline Anatomy
Each phase is structured vertically with connecting timeline conduits and clear state badges:
- **Phase Marker**: Numbered circle with state styling:
  - **Completed (Green)**: Emerald checkmark ring (`bg-emerald-500 text-white`).
  - **In Progress (Blue)**: Sky-blue pulsing ring (`bg-brand-blue-primary text-white shadow-sm ring-4 ring-blue-100`).
  - **Pending / Not Started (Grey)**: Slate outline with muted text (`bg-slate-100 text-slate-400 border-slate-300`).
  - **Attention / Review / Rework (Amber)**: Warning styling (`bg-amber-100 text-amber-800 border-amber-300`).
  - **Cancelled (Red)**: Terminal cross marker (`bg-rose-500 text-white`).
- **Phase Header**: Title, short description, phase status pill, task count badge (`2/4 done`), and expand/collapse chevron.
- **Phase Content (Collapsible)**:
  - Compact task rows displaying task title, category, assignee (in OMS), status badge, and age indicator.
  - In OMS: inline status buttons (`Start`, `Send for Review`, `Complete`, `Rework`).
  - In Customer Tracking: clean status indicators and review submission affordances.

### Two Distinct Order Entry Paths
```
A. Lead / Marketplace Booking Path (Order has bookingRequestId)
┌─────────────────────────────────────────────────────────────┐
│ Phase 0: Inquiry & Advance Booking (Collapsible History)    │
│  - Inquiry Received -> Package Discussion -> Advance Paid   │
│  - Converted to Confirmed Booking (Checked)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
B. Directly Registered Order   │
┌──────────────────────────────┴──────────────────────────────┐
│ Phase 1: Pre-Event Preparation                              │
│  - Event details & countdown lock                           │
│  - Dynamic Booked Services to Crew Assignment Mapping       │
│  - Equipment & Preparation Readiness                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ Phase 2: Event Day Execution                                │
│  - Shoot Day Status & Event-Date Locking Guard              │
│  - Crew Check-in / Shoot Coverage                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ Phase 3: Post-Event Production (Parallel Independent Streams)│
│  ┌───────────────────────────┐ ┌───────────────────────────┐│
│  │   Photography Pipeline    │ │    Videography Pipeline   ││
│  │   Raw Culling -> Photo    │ │   Footage Backup -> Video ││
│  │   Edit -> Album Design    │ │   Edit -> Color Grading   ││
│  └───────────────────────────┘ └───────────────────────────┘│
│  - Strict task dependencies (Raw Selection -> Edit -> Album)│
│  - Independent progress bars per stream                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ Phase 4: Final Deliverables & Handover                      │
│  - Client Review Proofs & Digital Gallery Delivery          │
│  - Album Printing & Physical Handover                       │
│  - Independent Payment Status Clearance                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│ Phase 5: Completed (Terminal Milestone)                     │
│  - Full Order Fulfillment Confirmation                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Shared Presentation Component with Role/Context Props**
  - *Chosen Approach*: Create `OrderVerticalWorkflow.tsx` accepting `variant: 'oms' | 'tracking'`, `order: Order | CustomerTrackingView['order']`, `tasks: Task[]`, and OMS callback handlers.
  - *Why*: Guarantees 100% visual and logical alignment between OMS and Customer Tracking while strictly isolating private data and interactive mutations.
  - *Alternative Considered*: Maintaining separate JSX implementations in both files. Rejected because it inevitably causes drift in status logic, task grouping, or dependency rules.

- **Decision 2: Strict Lead vs Direct Registration Differentiation**
  - *Chosen Approach*: Inspect `order.bookingRequestId`. If present, render the preceding *Inquiry & Booking* historical phase; if absent (directly created via OMS modal), begin directly at *Phase 1: Pre-Event Preparation*.
  - *Why*: Accurately reflects existing database models without inventing new schema fields.

- **Decision 3: Independent Photography & Videography Parallel Calculation**
  - *Chosen Approach*: Separate task categories (`PHOTOGRAPHY`/`ALBUM` vs `VIDEOGRAPHY`) into parallel columns/sections within Phase 3. Photo editing never blocks video editing.
  - *Why*: Matches real photography studio operations where editors and colorists work concurrently.

- **Decision 4: Terminal Cancellation Isolation**
  - *Chosen Approach*: When `orderStatus === 'CANCELLED'`, the pipeline displays a dedicated terminal banner and stops active phase indicators, while preserving soft-delete audit history.

---

## 4. Technical Architecture & File Changes

```
apps/web/src/components/workflow/
  └── OrderVerticalWorkflow.tsx    <-- NEW: Shared unified vertical timeline component

apps/web/src/app/[studioSlug]/dashboard/oms/
  └── page.tsx                     <-- UPDATE: Replace horizontal stepper & disparate tables with OrderVerticalWorkflow

apps/web/src/app/track/[passkey]/
  └── TrackOrderClient.tsx         <-- UPDATE: Replace horizontal stepper with OrderVerticalWorkflow (tracking variant)

ORDER_WORKFLOW_IMPLEMENTATION_CHECKLIST.md <-- NEW: Root checklist tracking all 13 verification scenarios
```

### Component Architecture & State Mapping
- `OrderVerticalWorkflow.tsx`:
  - `activePhaseId`: Defaults to the calculated current active phase (`pre_event`, `event_day`, `post_event`, `delivery`, or `completed`).
  - `expandedPhases`: Set of phase IDs currently expanded.
  - `getPrerequisite(task)`: Preserves existing dependency graph:
    1. Event date lock (cannot start post-event tasks before event date).
    2. Raw photo selection prerequisite for photo editing.
    3. Photo editing prerequisite for album design.
    4. All production tasks prerequisite for final delivery.
  - `handleStatusUpdate(taskId, nextStatus)`: Passed down in OMS mode to trigger `updateTaskStatusAction`.
  - Service-to-Crew mapping: In OMS mode, supports inline crew assignment and unassignment directly in Phase 1.

### Verification Scenarios to Execute
1. Directly registered confirmed order starts at Pre-Event Preparation.
2. Booking request lead conversion retains Inquiry/Booking phase.
3. Multi-service orders display dynamic photography, videography, and album assignments.
4. Event date locking locks post-event tasks when event date is in the future.
5. Independent parallel progress tracking for photography vs videography.
6. Inline task status buttons in OMS (Start, Send for Review, Complete).
7. Customer tracking view is read-only, hides crew salaries/internal actions, and maintains customer photo review functionality.
8. Cancelled orders render clear terminal status on both pages.
