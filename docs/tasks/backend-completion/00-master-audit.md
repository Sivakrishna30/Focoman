# 00 — Master Backend Audit: Focoman

**Document Type:** Engineering Audit & Baseline Specification  
**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Auditor:** Senior Backend Architect, Full-Stack Engineer, Security Engineer, QA Engineer  
**Status:** COMPLETE AUDIT BASELINE  

---

## 1. Executive Context & Objective

This document audits the complete backend data model, storage layer, server execution boundaries, authorization enforcement, and CRUD / soft-delete / recovery capabilities across all modules of Focoman.

### Source of Truth Hierarchy
1. `Agents.md` & Project Mandates (100% full-stack TypeScript, real credentials, no fake data, strict authorization)
2. `docs/product/srs-mvp.md` & `docs/product/product-discovery-document.md`
3. `docs/technical/identity-and-auth-architecture.md` & `docs/technical/technical-design-mvp.md`
4. Implementation Packages (`packages/types`, `packages/db`, `packages/domain`, `packages/validation`, `packages/auth`, `apps/web`)

---

## 2. Entity-by-Entity Audit

### 2.1 OMS (Order Management System)

#### Entity: `Order`
- **Firestore Collection:** `orders`
- **Document ID Strategy:** `ORD-[A-Z0-9]{8}` generated via `crypto.randomUUID()`
- **Required Fields:** `id`, `studioId`, `orderNumber`, `customer` (`id`, `name`), `eventType`, `eventDate`, `services`, `pricing` (`estimatedPrice`, `finalConfirmedPrice`, `advanceAmount`, `remainingAmount`), `paymentStatus`, `orderStatus`, `assignedResources`, `trackingPasskey`, `createdAt`, `updatedAt`
- **Optional Fields:** `customer.phone`, `eventLocation`, `packages`, `isDeleted`, `deletedAt`, `deletedBy`
- **Studio Isolation:** `studioId` (indexed with `createdAt` DESC and `orderStatus` ASC)
- **Current Backend Implementation:**
  - `createOrderAction`: Implemented in `orderActions.ts`.
  - `getStudioOrdersAction`: Implemented in `orderActions.ts`.
  - `updatePaymentStatusAction`: Implemented in `orderActions.ts`.
  - `assignResourceAction`: Implemented in `orderActions.ts`.
- **Missing Operations:**
  - `getOrderAction`: Standalone retrieval by `orderId` with studio authorization check is missing.
  - `updateOrderAction`: General updates to event details, location, services, pricing missing.
  - `deleteOrderAction` (Soft-Delete): Missing.
  - `restoreOrderAction`: Missing.
  - `getDeletedOrdersAction`: Missing.

#### Entity: `Task` (Workflow Tasks)
- **Firestore Collection:** `tasks`
- **Document ID Strategy:** `TSK-[A-Z0-9]{8}` generated via `crypto.randomUUID()`
- **Required Fields:** `id`, `orderId`, `studioId`, `title`, `serviceCategory`, `assignedMemberId`, `assignedMemberName`, `status`, `sequenceOrder`, `createdAt`, `updatedAt`
- **Optional Fields:** `reworkNotes`, `isDeleted`, `deletedAt`, `deletedBy`
- **Studio Isolation:** `studioId` and `orderId`
- **Current Backend Implementation:**
  - Auto-generated during order creation (`generateWorkflowTasks`) and saved in batch via `saveTasks`.
  - `updateTaskStatusAction`: Updates task status and recalculates parent order status.
- **Missing Operations:**
  - `createTaskAction`: Adding an ad-hoc or supplementary task to an active order is missing.
  - `getTaskAction`: Individual task retrieval is missing.
  - `getOrderTasksAction`: Standalone server action to fetch tasks for an order is missing.
  - `updateTaskAction`: Updating title, assignee, sequenceOrder, or category is missing.
  - `deleteTaskAction` (Soft-Delete): Missing.
  - `restoreTaskAction`: Missing.

#### Entity: `PaymentData` (Order Payment & Pricing)
- **Representation:** Embedded within `Order.pricing` and `Order.paymentStatus`.
- **Current Operations:** Created upon order registration; updated via `updatePaymentStatusAction`.
- **Audit Finding:** Payment data must not be destroyed upon order deletion. Because it is embedded in the order document, soft-deleting the order preserves all payment history and financial audit trails intact. When restored, payment state remains preserved.

#### Entity: `OrderResourceAssignment`
- **Representation:** Embedded array within `Order.assignedResources`.
- **Current Operations:** Created upon order creation; updated via `assignResourceAction`.
- **Audit Finding:** Soft-deleting an order preserves assigned resources without destroying member records.

---

### 2.2 CRM (Customer Relationship Management)

#### Entity: `Customer`
- **Firestore Collection:** `customers`
- **Document ID Strategy:** `CUS-[A-Z0-9]{8}` generated via `crypto.randomUUID()`
- **Required Fields:** `id`, `studioId`, `name`, `createdAt`, `updatedAt`
- **Optional Fields:** `phone`, `email`, `address`, `isDeleted`, `deletedAt`, `deletedBy`
- **Studio Isolation:** `studioId` (lowercase slug)
- **Current Backend Implementation:**
  - `createCustomerAction`: Standalone creation in `customerActions.ts`.
  - Auto-provisioned in `createOrderAction` if order references a customer.
  - `getStudioCustomersAction`: Retrieves all customers for a studio.
- **Missing Operations:**
  - `getCustomerAction`: Standalone retrieval by `customerId` with studio authorization check is missing.
  - `updateCustomerAction`: Updating contact information (name, phone, email, address) is missing.
  - `deleteCustomerAction` (Soft-Delete): Missing.
  - `restoreCustomerAction`: Missing.
  - `getDeletedCustomersAction`: Missing.
- **Relationship Rule:** Deleting a customer does NOT delete or orphan historical orders. Historical orders retain customer snapshots (`customer.id`, `customer.name`, `customer.phone`). Deleting a customer marks `isDeleted = true`, excluding them from active CRM lists while preserving past business accounting.

---

### 2.3 ERP (Crew & Studio Members)

#### Entity: `StudioMember`
- **Firestore Collection:** `members`
- **Document ID Strategy:** `MEM-[A-Z0-9]{8}` generated via `crypto.randomUUID()`
- **Required Fields:** `id`, `studioId`, `name`, `email`, `skills`, `createdAt`, `updatedAt`
- **Optional Fields:** `phone`, `isDeleted`, `deletedAt`, `deletedBy`
- **Studio Isolation:** `studioId`
- **Current Backend Implementation:**
  - `createMemberAction`: Owner registers crew member and generates single-use invitation.
  - `getStudioMembersAction`: List active members of the studio.
  - `confirmResourceAvailabilityAction`: Confirm/reject event availability in order resource assignments.
- **Missing Operations:**
  - `getMemberAction`: Standalone member profile retrieval is missing.
  - `updateMemberAction`: Updating member name, phone, skills is missing.
  - `deleteMemberAction` (Soft-Delete / Deactivate): Missing.
  - `restoreMemberAction`: Missing.
  - `getDeletedMembersAction`: Missing.
- **Relationship Rule:** Soft-deleting a crew member does NOT delete past order assignments or completed tasks. The member's historical identity (`memberId`, `memberName`) remains stable in completed tasks and audit logs.

#### Entity: `StudioMembership`
- **Firestore Collection:** `memberships`
- **Document ID Strategy:** Composite key `{studioId}_{uid}`
- **Required Fields:** `id`, `studioId`, `studioName`, `uid`, `role` (`STUDIO_OWNER` | `STUDIO_MEMBER`), `status` (`ACTIVE` | `INACTIVE`), `joinedAt`, `updatedAt`
- **Optional Fields:** `skills`, `isDeleted`, `deletedAt`, `deletedBy`
- **Studio Isolation:** `studioId` and `uid`
- **Current Backend Implementation:**
  - Provisioned during `registerStudioAction` for the owner.
  - Provisioned during `acceptInvitationAction` inside an atomic Firestore transaction.
  - Queried via `getMembershipByUidAndStudio` to enforce Server Action authorization.
- **Missing Operations:**
  - Update membership role / status (e.g., promote, deactivate).
  - Soft-delete membership (revoking studio workspace access while preserving audit trail).
  - Restore membership.

#### Entity: `StudioInvitation`
- **Firestore Collection:** `invitations`
- **Document ID Strategy:** Collision-safe invite code `INV-[A-Z0-9]{4}-[A-Z0-9]{4}`
- **Required Fields:** `id`, `studioId`, `studioName`, `email`, `skills`, `role`, `status` (`PENDING` | `ACCEPTED` | `EXPIRED`), `invitedByUid`, `createdAt`
- **Optional Fields:** `name`, `acceptedAt`, `acceptedByUid`, `isDeleted`, `deletedAt`, `deletedBy`
- **Current Backend Implementation:**
  - `createMemberAction`: Generates invite.
  - `getStudioInvitationsAction`: Lists pending invitations for owner.
  - `acceptInvitationAction`: Transactionally verifies code, checks user email, updates status to `ACCEPTED`, and writes `membership` and `member` records.
- **Missing Operations:**
  - `revokeInvitationAction` (Delete / Revoke pending invitation).
  - `restoreInvitationAction` (Reactivate revoked invitation if not expired).

#### Unimplemented ERP Modules (Per SRS/Discovery Audit)
- Payroll / Compensation records: Not yet implemented in schema; placeholder for future phase.
- Travel / Incidental claims: Not yet implemented in schema; placeholder for future phase.
- Calendar sync data: Not yet implemented in schema; placeholder for future phase.

---

### 2.4 WhatsApp Operational Configuration

#### Entity: `StudioWhatsappConfig`
- **Representation:** Stored under `Studio.whatsappConfig` (Map of event notification triggers) or standalone config document.
- **Required Fields:** Record of boolean toggles for operational triggers (3-day event reminder, post-event start, RAW photos sent, customer selection, album review, delivery ready, crew assignment alerts).
- **Current Backend Implementation:**
  - `updateStudioWhatsappConfigAction`: Saves configuration map to `studios/{studioId}`.
- **Missing Operations:**
  - Reset / delete WhatsApp configuration back to standard defaults.
- **Architectural Separation:** WhatsApp configuration is strictly separate from the live WhatsApp Business Cloud API integration provider. The backend stores operational preferences independently from external gateway credentials.

---

### 2.5 Marketplace

#### Entity: `MarketplaceProfile`
- **Firestore Collection:** `marketplace_profiles`
- **Document ID Strategy:** Matches `studioId` (slug)
- **Required Fields:** `id`, `studioId`, `name`, `slug`, `city`, `tags`, `isVisible`, `verifiedMetrics`, `createdAt`, `updatedAt`
- **Optional Fields:** `description`, `coverImageUrl`, `isDeleted`, `deletedAt`, `deletedBy`
- **Current Backend Implementation:**
  - `getMarketplaceProfileAction`: Retrieves studio marketplace profile.
  - `upsertMarketplaceProfileAction`: Updates public marketplace metadata.
  - `searchMarketplaceProfiles`: Public search by city and tags.
- **Missing Operations:**
  - `deleteMarketplaceProfileAction`: Soft-deletes or unpublishes profile (`isVisible: false`, `isDeleted: true`).
  - `restoreMarketplaceProfileAction`: Restores profile and re-enables visibility.

---

### 2.6 Identity & Studio Workspace

#### Entity: `Studio`
- **Firestore Collection:** `studios`
- **Document ID Strategy:** Normalized studio slug (e.g. `lumina-studios`)
- **Required Fields:** `id`, `name`, `city`, `ownerId`, `ownerName`, `ownerEmail`, `createdAt`, `updatedAt`
- **Optional Fields:** `ownerPhone`, `whatsappConfig`, `features`, `isDeleted`, `deletedAt`, `deletedBy`
- **Current Backend Implementation:**
  - `registerStudioAction`: Atomic Firestore transaction creating Studio + Owner Membership.
  - `getUserStudiosAction`: Queries memberships for user UID to retrieve available workspaces.
  - `getStudioBySlugAction`: Retrieves studio details.
- **Missing Operations:**
  - `updateStudioAction`: Updating studio name, city, phone, features.
  - `deleteStudioAction` (Soft-delete studio workspace).
  - `restoreStudioAction`: Restoring a soft-deleted studio within recovery window.

---

### 2.7 Guest Order Tracking

#### Entity: `OrderTracking`
- **Representation:** Access to order via `trackingPasskey` (`FOC-[A-Z0-9]{8}`).
- **Required Fields:** Passkey maps directly to an order document in the `orders` collection.
- **Current Backend Implementation:**
  - `getOrderByPasskeyAction`: Unauthenticated, safe customer read endpoint that returns strictly non-sensitive tracking information (`orderNumber`, `customer.name`, `eventType`, `eventDate`, `eventLocation`, `pricing`, `paymentStatus`, `orderStatus`).
- **Audit Finding:** Deleted orders (`isDeleted == true`) MUST NOT be queryable by passkey. If an order is soft-deleted, `getOrderByPasskeyAction` must return not found or error.

---

## 3. Summary of Audit Findings & Next Steps

1. **Delete & Restore Gap:** Across Orders, Tasks, Customers, Members, Invitations, and Studios, NO soft-delete or restore Server Actions or database repository methods exist today.
2. **Missing Core Operations:** Standalone read-by-ID (`getOrder`, `getCustomer`, `getMember`, `getTask`) and standalone update mutations (`updateOrder`, `updateCustomer`, `updateMember`, `updateTask`, `updateStudio`) are absent or incomplete.
3. **Data Isolation & Security:** `requireVerifiedUser` and `requireStudioMember` exist in `apps/web/src/lib/serverAuth.ts` and must be applied uniformly across all new CRUD, Delete, and Restore actions.
4. **Soft-Delete Architecture:** Centralized recovery configuration (`RECOVERY_WINDOW_DAYS = 14`), default non-deleted filtering in all normal read queries (`isDeleted != true`), and dedicated administrative queries for soft-deleted entities are required.
