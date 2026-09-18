# Focoman Master Security & Authorization Audit

**Audit Date**: 2026-09-18  
**Scope**: Firestore security rules (`firestore.rules`), Server Actions authorization pipeline (`apps/web/src/actions/*`), token verification (`apps/web/src/lib/serverAuth.ts`), and resource ownership isolation.

---

## 1. Architectural Model

Focoman uses a **Secure Server-Authoritative Architecture**:
- All client mutations occur through Next.js 15 Server Actions running in server context.
- Firestore Security Rules enforce `allow read, write: if false;` for direct client SDK requests. Direct browser manipulation of the database is impossible.
- Every Server Action acts as a secure gateway that verifies:
  1. **User Identity (`requireVerifiedUser`)**: Cryptographically checks the caller's Firebase ID token. Ensures real Firebase UID, email, and authentication claims.
  2. **Studio Membership & RBAC (`requireStudioMember`)**: Looks up `{studioId}_{uid}` in the `memberships` collection. Checks whether the caller is active in that studio and verifies their role (`STUDIO_OWNER` or `STUDIO_MEMBER`).
  3. **Resource Ownership Boundary**: Verifies that requested entities (`Order`, `Task`, `Customer`, `StudioMember`) belong to the verified `studioId`. Users from Studio A cannot access or mutate resources belonging to Studio B.

---

## 2. Server Action Guards Checklist

| Action | Function | Token Verified? | Role Required | Resource Studio Verified? |
| :--- | :--- | :---: | :---: | :---: |
| **Orders** | `createOrderAction` | Yes | Member/Owner | Yes (Studio from payload matched) |
| | `getStudioOrdersAction` | Yes | Member/Owner | Yes |
| | `getDeletedStudioOrdersAction` | Yes | Member/Owner | Yes |
| | `getOrderAction` | Yes | Member/Owner | Yes (`order.studioId == authorizedStudio`) |
| | `updateOrderAction` | Yes | Member/Owner | Yes (`order.studioId == authorizedStudio`) |
| | `deleteOrderAction` | Yes | Member/Owner | Yes (`order.studioId == authorizedStudio`) |
| | `restoreOrderAction` | Yes | Member/Owner | Yes (`order.studioId == authorizedStudio`) |
| | `getOrderByPasskeyAction` | Guest / Public | None (Passkey) | Scoped to passkey match; soft-deleted excluded |
| **Tasks** | `createTaskAction` | Yes | Member/Owner | Yes (`order.studioId == authorizedStudio`) |
| | `updateTaskStatusAction` | Yes | Member/Owner | Yes (`task.studioId == authorizedStudio`) |
| | `deleteTaskAction` | Yes | Member/Owner | Yes (`task.studioId == authorizedStudio`) |
| | `restoreTaskAction` | Yes | Member/Owner | Yes (`task.studioId == authorizedStudio`) |
| **Customers** | `createCustomerAction` | Yes | Member/Owner | Yes (Scoped to studio) |
| | `getStudioCustomersAction` | Yes | Member/Owner | Yes |
| | `getDeletedStudioCustomersAction`| Yes | Member/Owner | Yes |
| | `getCustomerAction` | Yes | Member/Owner | Yes (`customer.studioId == authorizedStudio`)|
| | `updateCustomerAction` | Yes | Member/Owner | Yes (`customer.studioId == authorizedStudio`)|
| | `deleteCustomerAction` | Yes | Member/Owner | Yes (`customer.studioId == authorizedStudio`)|
| | `restoreCustomerAction` | Yes | Member/Owner | Yes (`customer.studioId == authorizedStudio`)|
| **Crew / Members** | `createMemberAction` | Yes | `STUDIO_OWNER` | Yes |
| | `getStudioMembersAction` | Yes | Member/Owner | Yes |
| | `getDeletedStudioMembersAction` | Yes | `STUDIO_OWNER` | Yes |
| | `getMemberAction` | Yes | Member/Owner | Yes (`member.studioId == authorizedStudio`) |
| | `updateMemberAction` | Yes | `STUDIO_OWNER` | Yes (`member.studioId == authorizedStudio`) |
| | `deleteMemberAction` | Yes | `STUDIO_OWNER` | Yes (`member.studioId == authorizedStudio`) |
| | `restoreMemberAction` | Yes | `STUDIO_OWNER` | Yes (`member.studioId == authorizedStudio`) |
| | `getStudioInvitationsAction` | Yes | `STUDIO_OWNER` | Yes |
| | `revokeInvitationAction` | Yes | `STUDIO_OWNER` | Yes |
| | `acceptInvitationAction` | Yes | Auth User | Scoped via transaction & single-use code |
| **Settings & Studio** | `registerStudioAction` | Yes | Auth User | Owner UID extracted directly from token |
| | `getUserWorkspacesAction` | Yes | Auth User | Scoped to token UID |
| | `updateStudioWhatsappConfigAction` | Yes | `STUDIO_OWNER` | Yes |
| | `resetStudioWhatsappConfigAction` | Yes | `STUDIO_OWNER` | Yes |
| | `deleteStudioAction` | Yes | `STUDIO_OWNER` | Yes |
| | `restoreStudioAction` | Yes | `STUDIO_OWNER` | Yes |
| **Marketplace** | `fetchMarketplaceProfile` | Yes | Member/Owner | Yes |
| | `saveMarketplaceProfile` | Yes | `STUDIO_OWNER` | Yes |
| | `deleteMarketplaceProfileAction` | Yes | `STUDIO_OWNER` | Yes |
| | `restoreMarketplaceProfileAction`| Yes | `STUDIO_OWNER` | Yes |
| | `searchPublicMarketplace` | Public | None | Public directory (`isVisible == true`) |
| | `getPublicMarketplaceProfile` | Public | None | Public profile (`isVisible == true`) |
