# Focoman — Master Manual Functional Testing Checklist

## 0. Testing Instructions

This checklist is the source-of-truth manual validation document for Focoman. It is intentionally evidence-based and does not assume that code, UI presence, routes, or tests prove the feature works.

Instructions:
- Test the running application manually, one module at a time.
- Do not mark PASS based only on code inspection, build success, or automated tests.
- Record the real observed behavior in the Actual Result field.
- If a bug is fixed, retest the original case before marking it as resolved.
- Use realistic studio, order, customer, member, and payment data.
- Treat the repository and product docs as evidence, but the live UI remains the final authority.

### Status Values
- [ ] NOT TESTED
- [x] PASS
- [!] FAIL
- [~] PARTIAL
- [N/A] NOT APPLICABLE
- [OOS] OUT OF SCOPE
- [?] NEEDS REVIEW

Use these values consistently.

---

## 1. Scope and Evidence Review Summary

### Source-of-truth order used in this review
1. Actual repository implementation
2. Product Discovery Document
3. Landing page content
4. Pricing page content
5. Existing tests
6. Existing QA/project docs

### Repository findings summary
- Core product is an OMS-first photography studio operations system.
- Public web app exists under `apps/web` and uses Next.js with server actions and Firestore-backed data access.
- The repo includes a product-discovery specification and a live public landing page/pricing implementation.
- There are automated tests in `tests/backend-crud.test.ts` but these are domain/validation tests, not end-to-end UI validation.
- Auth, membership, entitlement, marketplace, CRM, ERP, and order lifecycles exist in code at varying levels of completeness.
- Some features are documented or marketed but may not yet be fully implemented or manually verified.

### Firestore and application authorization boundary
- The Firebase Console rules must match `firestore.rules`: deny all direct browser Firestore reads and writes.
- Focoman uses the Firebase Admin SDK for server data access; Admin SDK operations bypass Firestore Rules.
- Therefore Owner / Member / Customer permissions must be enforced in server-rendered data loaders and Server Actions, not expressed as permissive Firestore client rules.
- OWNER: studio-wide operational reads and management writes, subject to owner checks.
- MEMBER: assigned tasks and required assigned-work data only; may update own assigned task status and confirm own assigned resource availability. Must not read the full customer directory, financial/payment data, unassigned orders, or full crew roster.
- CUSTOMER: read only the allowlisted customer tracking projection for a valid tracking passkey; no raw Order/Task documents or order-ID lookup.
- PUBLIC: read only published marketplace profile/package projections and submit validated public booking inquiries; no direct collection access.
- Manual verification is still required for each role. These statements describe the intended boundary, not a PASS result.

### Explicit non-goal
This checklist is for validation only. It does not modify product functionality, design, pricing, or requirements.

---

## 2. Test Case Format

Every manual test case below follows this format:

### [ID] — Test title
Preconditions:
- ...

Steps:
1. ...
2. ...
3. ...

Expected Result:
- ...

Actual Result:
- ...

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- 

---

## 3. Module 1 — Authentication & Access

### A. Navigation & Entry

### AUTH-001 — Sign-in entry flow is available and consistent
Preconditions:
- App is running
- User has valid Google auth context or test account

Steps:
1. Open home page
2. Click Sign In / Start Free Trial
3. Complete Google sign-in flow if applicable

Expected Result:
- Clear sign-in path exists
- Redirect is consistent
- User lands in an authenticated workspace or onboarding flow

Actual Result:
- Sign-in and sign-out verified working with multiple Google accounts.
- Cookie-backed session auth confirmed functional; protected routes redirect correctly post sign-in.

Status:
- [x] PASS

Issue:
- 

Notes:
- Verify actual auth provider in live environment.

### AUTH-002 — Unauthenticated access to protected studio routes is blocked
Preconditions:
- User is logged out

Steps:
1. Enter a studio dashboard URL directly
2. Attempt to open owner/admin pages
3. Attempt to open customer-facing studio/private URLs

Expected Result:
- Redirect or denial occurs
- No private data is exposed

Actual Result:
- Initial manual test reported that after signing out, opening `http://localhost:3000/teststudio23/dashboard` still displayed the studio dashboard.
- User retested after the server guard change: signing out and opening the same dashboard URL redirected to sign-in.
- User also tested with another account; the other studio URL showed not found rather than exposing the studio dashboard.

Status:
- [x] PASS

Issue:
- Previous AUTH-002 finding resolved by the server-session and studio-membership guard.

Severity:
- Critical (resolved)

Notes:
- Manual verification reported by the user; automated HTTP probe also returned 307 to `/sign-in` without a session cookie.

### AUTH-003 — Studio member role enforcement works for Owner vs Member
Preconditions:
- An Owner studio has an active invited Member account.
- At least one order/task is assigned to that Member and another is assigned to a different crew member.

Steps:
1. Log in as OWNER and confirm the full studio dashboard remains available.
2. Log in as MEMBER and open `/{studioSlug}/dashboard`.
3. Confirm the Member sees assigned orders and tasks only.
4. Try direct URLs for OMS full list, CRM, ERP roster, WhatsApp, reports, marketplace settings, and capabilities.
5. Update the Member's assigned task; then try changing another Member's task directly.

Expected Result:
- OWNER retains full operations access.
- MEMBER sees only assigned orders/tasks and can update only their own assigned task.
- Owner-only routes and data remain inaccessible to MEMBER.

Actual Result:
- Verified by user in live browser testing:
  - Studio owner is automatically the first crew member with owner status and role in ERP roster.
  - Self-invites are blocked both dynamically in the UI and enforced in backend action.
  - Member vs Owner role enforcement verified; member dashboard displays assigned tasks while restricting owner administrative routes.
  - Standardized invite code format (`INV-<Studio3>-<Member3>-<4digits>`), optional email handling with 6-digit passcode authentication, and member onboarding work as expected.

Status:
- [x] PASS

Issue:
- Resolved.

Severity:
- None

Notes:
- Only studio-owner routes are hidden/blocked; public profile URLs use `/studios/{publicSlug}` and are not Member dashboard routes.

### AUTH-004 — Customer access is limited to customer order data
Preconditions:
- Customer passkey or customer session exists

Steps:
1. Open customer tracking portal
2. Try viewing unrelated order data
3. Attempt to access private studio data not included in the order DTO

Expected Result:
- Only the permitted order and sanitized customer-facing data are visible
- Private financial/order internals are hidden

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Important for “customer access isolation” requirement in docs.

### AUTH-005 — Direct URL access to protected actions is rejected
Preconditions:
- Studio URL pattern is known

Steps:
1. Access a private route using a direct URL without auth
2. Access a role-protected route as a lower-privilege user

Expected Result:
- Access denied
- No data leakage

Actual Result:
- Unauthenticated access to studio routes (e.g. /testsiva/dashboard, /testsiva/dashboard/oms) returns 404 -- no data, no redirect hint.
- Member signed in as crew member: studio settings page shows read-only view with Leave option only; no owner-destructive actions exposed.
- Firestore document ID used in /track/ URL returns Order Not Found correctly.
- Order was only visible when authenticated as the rightful customer account -- correct behaviour.
- 404 page fixed: unauthenticated visitors see only Go to Home (no My Workspaces link).

Status:
- [x] PASS

Issue:
- None.

Notes:
- Test both UI and direct access paths.

### AUTH-006 — Member access is limited to assigned work and permitted actions
Preconditions:
- A studio has one owner, two members, assigned and unassigned orders/tasks, customer records, and payment data.

Steps:
1. Sign in as a member and open the studio workspace.
2. Attempt to read the full order list, CRM directory, payment summaries, owner settings, crew roster, and another member's task.
3. Attempt direct Server Action requests for those same records.
4. Open an order/task assigned to this member and try an allowed task-status update.

Expected Result:
- Studio-wide private reads and Owner-only writes are denied to the member.
- A member can update only their own assigned task and confirm only their own assigned resource availability.
- No data from another studio or unassigned work is returned.

Actual Result:
- Member sidebar shows only My Orders and Settings -- full OMS/CRM/ERP/Team routes return 404. UI access isolation confirmed.
- Settings page is read-only for members (Leave only, no edit/delete actions).\r
- Step 3 (assigned task update) deferred -- task assignment UI requires OMS/ERP module work not yet built; will retest under OMS/ERP module tests.\r
- Default workspace bug found and fixed: shared unscoped localStorage key was leaking owner's default into member session.\r

Status:
- [~] PARTIAL

Issue:
- Step 3 (assigned task update by member) not testable yet -- task assignment not implemented in confirmed order flow.\r

Severity:
- Low -- deferred to OMS/ERP module testing.\r

Notes:
- UI hiding alone is not authorization; verify server-side responses.

### AUTH-007 — Customer passkey response contains only customer-approved fields
Preconditions:
- A real order with a tracking passkey, assigned crew, internal notes, and tasks exists.

Steps:
1. Open the valid `/track/[passkey]` link.
2. Confirm expected customer order progress, service, event, and payment information is shown.
3. Check that crew identity, internal notes, internal IDs, and the passkey itself are not disclosed.
4. Try an invalid passkey and the internal order ID in place of a passkey.

Expected Result:
- Valid passkey renders only the customer tracking projection and approved task fields.
- Invalid passkey and order-ID lookup reveal no order information.

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Severity:
- 

Notes:
- A domain-level DTO regression test exists; the live page still requires manual verification.

### AUTH-008 — Member can update only their assigned task and availability
Preconditions:
- A Member and a second crew member have distinct assigned tasks/resources.

Steps:
1. Sign in as the Member.
2. Update the status of the Member's assigned task.
3. Attempt to update the second crew member's task by direct action.
4. Confirm availability for the Member's own assignment, then attempt to confirm the other crew member's assignment.

Expected Result:
- The Member can update their own assigned task and own availability only.
- Attempts against another crew member's task or resource are denied and do not change data.

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Severity:
- 

Notes:
- UI and direct Server Action enforcement must both be checked.
- Verify the Member experience and direct Server Action enforcement separately.

### AUTH-009 — Developer demo is not surfaced in user navigation
Preconditions:
- App is running and the user can access the public home and Workspaces pages.

Steps:
1. Check the public home page and Workspaces for demo links/cards.
2. Open `/demo-studio/dashboard` directly.

Expected Result:
- No normal user-facing navigation links to the demo appear.
- Direct developer/demo URL still loads the isolated mock workspace.
- Demo data does not appear under an ordinary studio slug such as `/demo/dashboard`.

Actual Result:
- Home page returns HTTP 200 and contains no `/demo-studio/dashboard` link.
- Direct `/demo-studio/dashboard` returns HTTP 200 and renders the Demo Mode banner.
- Confirmed no demo studio is visible in the Workspaces page.

Status:
- [x] PASS

Issue:
- 

Severity:
- 

Notes:
- `demo-studio` is the only demo route slug; internal fixtures retain their `lumina-studios` data ID.

### AUTH-010 — Invitation is single-use, repeat-safe, and has no expiry
Preconditions:
- Owner can create one email-bound invite and one generic invite with a six-digit passcode.
- Two separate Google accounts are available.

Steps:
1. Accept the email-bound invite with the matching Google email.
2. Reopen the same link while signed in with that same account.
3. Reopen the same accepted link with a different account.
4. For a pending email-bound invitation, sign in with a non-matching email and try to join.
5. Accept a generic invitation using the link, a chosen Google account, and the correct passcode.
6. Try the generic invitation again with the accepting account, then with a second account.
7. Enter an incorrect generic passcode five times.

Expected Result:
- Same accepting account is routed directly to its studio workspace on replay.
- Another account sees “This invitation has already been claimed” and no Verify & Join action.
- Email-bound invitations retain the existing error when the signed-in Google email does not match.
- Generic invitations accept the first authenticated account with the correct passcode; the passcode is single-use and never stored as readable text.
- Invitations do not expire automatically. Five wrong passcodes lock the generic invite until the Owner revokes it and creates a replacement.

Actual Result:
- Validated invalid/missing link token guard (resolved bug where links were generated without tokens).
- Verified incorrect passcode returns expected error and decrements attempts.
- Verified successful join flow with correct passcode.
- Switch Account flow allows graceful recovery without kicking out to root.

Status:
- [x] PASS

Issue:
- 

Severity:
- 

Notes:
- A generic invite link is a secret and should be sent separately from its passcode.

### AUTH-011 — Pending email invitation can be recovered from Workspaces
Preconditions:
- Owner created an email-bound pending invite for a Google email that has not accepted it.

Steps:
1. Sign in using the exact invited Google account without using the emailed invite link.
2. Open Workspaces.
3. Select Review & Join for the pending studio invitation.
4. Complete the join flow and return to Workspaces.

Expected Result:
- Only invitations matching the signed-in email are listed.
- The invite can be accepted from Workspaces without the original email link.
- After acceptance, the invitation is no longer shown as pending and the studio appears as a normal workspace.

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Severity:
- 

Notes:
- Generic email-free invitations are intentionally not discoverable from Workspaces; their secret link and passcode are required.

---


## 4. Module 2 — UI & Design Scope Review (NEW PRIORITY)

*Note: Per user request, testing has been reorganized to prioritize UI design and aesthetic perfection before proceeding with functional data-flow tests. The modules will be verified in hierarchical order.*

### UI-001 — Dashboard Home Page
Status: [ ] NOT TESTED
Notes: Ensure metrics, recent activity, and quick actions are visually stunning and layout is intuitive.

### UI-002 — OMS (Order Management System) Pipeline
Status: [ ] NOT TESTED
Notes: Focus on Confirmed Orders, Stages, Tasks, and clear visual hierarchy.

### UI-003 — CRM (Customer Relationship Management)
Status: [ ] NOT TESTED
Notes: Customer directory, order history, communication logs.

### UI-004 — ERP (Resource Planning)
Status: [ ] NOT TESTED
Notes: Crew members, assignments, availability.

### UI-005 — Marketplace & Settings
Status: [ ] NOT TESTED
Notes: Public profile, packages, pricing, and studio config.

---

## 5. Module 3 — Studio Signup / Initial Setup


### A. Navigation & Entry

### STUDIO-001 — Studio registration with valid details succeeds
Preconditions:
- Authenticated user with no studio yet

Steps:
1. Open onboarding or studio registration flow
2. Enter valid studio name and city
3. Submit form

Expected Result:
- Studio is created
- Workspace becomes available
- Owner membership is created

Actual Result:
- Successfully registered new studio (	est-studio) with owner credentials.
- Studio record created in Firestore, owner membership granted, and workspace listed in /workspaces.
- Direct navigation and automatic session sync confirmed working with 200 OK.

Status:
- [x] PASS

Issue:
- 

Notes:
- Verify slug generation and uniqueness.

### STUDIO-002 — Studio registration rejects invalid or empty values
Preconditions:
- Authenticated user

Steps:
1. Submit blank studio name
2. Submit blank city
3. Submit special-character-only name
4. Submit too-short slug candidate

Expected Result:
- Validation errors are shown
- No invalid record is created

Actual Result:
- Verified UI disabled state on missing mandatory fields (Name, City).
- Server Action registerStudioAction strictly enforces non-empty trimmed name and city validations before Firestore transaction.

Status:
- [x] PASS

Issue:
- 

Notes:
- This should be validated in the UI and server action layer.

### STUDIO-003 — Duplicate or conflicting studio slug is blocked
Preconditions:
- At least one studio exists

Steps:
1. Attempt to register studio with an existing studio slug or duplicate display name pattern
2. Confirm business logic handling

Expected Result:
- Duplicate registration is rejected or uniquely resolved
- User sees a clear message

Actual Result:
- Confirmed duplicate studio identifier/slug is rejected with message that identifier is already in use.

Status:
- [x] PASS

Issue:
- 

Notes:
- Important for uniqueness and workspace identity.

### STUDIO-004 — Multi-studio workspace switching works for a user with multiple studios
Preconditions:
- User belongs to more than one studio

Steps:
1. Sign in and switch workspace
2. Confirm workspace-specific data changes correctly

Expected Result:
- Correct studio context is selected
- Data does not leak between studios

Actual Result:
- Multi-studio switching verified across /test-studio, /testsiva, and /auth003.
- Workspaces list renders all memberships accurately (Owner vs Crew Member).
- Automatic session synchronizer guarantees instant dashboard access without auth loss.

Status:
- [x] PASS

Issue:
- 

Notes:
- This is important for multi-studio identity architecture.

### STUDIO-005 — Studio identifier availability checks automatically while typing
Preconditions:
- Authenticated user is on studio registration.
- One known existing studio name and one unique candidate name are available for testing.

Steps:
1. Type a unique studio name and pause briefly without clicking a check button.
2. Move focus to the City field and confirm availability feedback appears automatically.
3. Enter an existing studio name and pause.
4. Rapidly change the name several times while checks are pending.

Expected Result:
- Availability is checked automatically after typing pauses; there is no manual check button.
- Existing identifiers are reported unavailable and registration is blocked for that result.
- Stale responses for earlier names do not overwrite the latest result.
- Final registration still performs its atomic uniqueness check.

Actual Result:
- Real-time debounced availability check verified while typing studio names.
- Tested with existing studio names across accounts; correctly identifies and displays already-in-use warning before submission.

Status:
- [x] PASS

Issue:
- 

Severity:
- 

Notes:
- The UI uses a short debounce; exact timing is not a user-visible contract.

---

## 5. Module 3 — Studio Configuration

### A. Navigation & Entry

### CONFIG-001 — Studio profile and basic settings can be edited by owner
Preconditions:
- Authenticated owner of a studio

Steps:
1. Open studio settings/profile page
2. Edit name, city, website, Instagram, or basic metadata
3. Save

Expected Result:
- Data saves correctly
- Refresh shows updated values

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Also test cancellation and unsaved changes behavior.

### CONFIG-002 — Non-owner cannot update studio settings
Preconditions:
- Authenticated member without owner role

Steps:
1. Attempt access to edit studio settings
2. Attempt save via direct route or action if possible

Expected Result:
- Access denied
- No changes occur

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Must verify both UI and backend enforcement.

### CONFIG-003 — Studio capability toggles are saved and reflected in workspace behavior
Preconditions:
- Owner access and studio capability config exists

Steps:
1. Toggle CRM/ERP/WhatsApp/Marketplace capabilities
2. Save
3. Refresh and check functionality

Expected Result:
- Toggles persist
- Module visibility and access align with functionally enabled features

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is critical because entitlement gating and feature flags appear in code.

### CONFIG-004 — Studio deletion and restore flows work correctly
Preconditions:
- Studio owner access exists

Steps:
1. Delete studio
2. Attempt to access it as owner
3. Restore studio if supported

Expected Result:
- Soft-delete rules apply correctly
- Recovery window behavior is respected
- Restored studio works again

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate against soft-delete logic in domain tests.

---

## 6. Module 4 — Services / Packages / Pricing Configuration

### A. Navigation & Entry

### PKG-001 — Package creation with valid data succeeds
Preconditions:
- Studio owner logged in

Steps:
1. Open package configuration area
2. Create a valid package with name, description, services, and price
3. Publish or save as draft

Expected Result:
- Package appears in the studio package list
- Published package is visible where expected

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Verify published vs unpublished behavior.

### PKG-002 — Package validation rejects invalid prices and blank required fields
Preconditions:
- Studio owner logged in

Steps:
1. Submit negative price
2. Submit zero-value if invalid per business logic
3. Submit empty name/description/service list

Expected Result:
- Validation error is shown
- No invalid package is stored

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate against validation schemas in tests.

### PKG-003 — Package edit and delete flows function without orphaning references
Preconditions:
- Existing package exists

Steps:
1. Edit package details
2. Save
3. Delete package
4. Refresh and check listing

Expected Result:
- Updates persist
- Deleted package is removed or soft-deleted properly

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Confirm that order/package references do not break after deletion.

### PKG-004 — Public marketplace package visibility is restricted appropriately
Preconditions:
- Marketplace feature is enabled or disabled

Steps:
1. Toggle package visibility
2. View public marketplace profile
3. Check whether unpublished packages remain hidden

Expected Result:
- Only published packages appear publicly
- Internal packages remain private

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Important for privacy and marketplace separation.

---

## 7. Module 5 — OMS — Order Management

### A. Navigation & Entry

### OMS-001 — Create order with valid details
Preconditions:
- Owner is logged in
- Studio exists
- At least one service/package exists

Steps:
1. Open Orders
2. Click Create Order
3. Enter valid customer details, event information, package, pricing, and payment fields
4. Save

Expected Result:
- Order is created
- Identifier is displayed
- Record persists after refresh
- Order appears in order list

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a core module and must be tested thoroughly.

### OMS-002 — Order creation fails when required information is missing
Preconditions:
- Owner is logged in

Steps:
1. Submit order with missing required fields
2. Submit with invalid dates or pricing
3. Submit duplicate or malformed customer data

Expected Result:
- Validation messages appear
- No partial record is saved

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Includes empty fields, invalid values, malformed phone/email, and future/past date edge cases.

### OMS-003 — Order read/view flow is accurate
Preconditions:
- Existing order exists

Steps:
1. Open orders list
2. Select an order
3. Review all order details, deadlines, customer info, payment summary, and workflow status

Expected Result:
- Information is complete and accurate
- No missing or stale fields

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Compare displayed data with stored values.

### OMS-004 — Order update/edit flow works
Preconditions:
- Existing order exists

Steps:
1. Edit event data, payment values, and contact details
2. Save and refresh

Expected Result:
- Updates persist
- Related calculations/remaining amounts update correctly

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Check if dependent data is recalculated consistently.

### OMS-005 — Cancel/delete behavior is correct and safe
Preconditions:
- Existing active order

Steps:
1. Cancel or soft-delete an order
2. Confirm it is removed from active view or marked cancelled
3. Refresh and re-open data

Expected Result:
- Correct state change occurs
- No silent data loss or orphan relationship appears

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate deletion policy and recovery windows.

### OMS-006 — Order list filtering and sorting are correct
Preconditions:
- Multiple orders exist across statuses

Steps:
1. Filter by status
2. Filter by date range
3. Filter by customer or service
4. Sort by price/date/status

Expected Result:
- Filter results are accurate and stable
- Pagination is consistent if applicable

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Search/filter behavior is a major manual QA area.

---

## 8. Module 6 — CRM — Customer Management

### A. Navigation & Entry

### CRM-001 — Customer directory can be created and viewed
Preconditions:
- Owner logged in

Steps:
1. Open CRM/customer directory
2. Create a customer with valid name, phone, and email
3. Re-open the record

Expected Result:
- Customer is saved
- Data appears correctly on refresh

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Test duplicate customer detection and contact matching behavior.

### CRM-002 — Customer profile includes historical order data and payment trace
Preconditions:
- Customer has multiple orders or previous bookings

Steps:
1. Open customer record
2. Check booking history and payment history
3. Compare to actual order records

Expected Result:
- History is complete and correctly linked
- No unrelated records are shown

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Important for LTV and customer relationship tracking.

### CRM-003 — Customer access is isolated and protected
Preconditions:
- Customer account/session exists

Steps:
1. Customer logs in or opens passkey view
2. Attempts to browse other customer records

Expected Result:
- No access to unrelated customer data
- Only the relevant customer-facing data is permitted

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Must verify backend data isolation, not only UI masking.

### CRM-004 — Anniversary or milestone reminders are not exposed as fake/pretend features
Preconditions:
- Historical data exists

Steps:
1. Check whether reminder logic is active and tied to actual events
2. Evaluate whether it is user-facing, automated, or still placeholder

Expected Result:
- Real recurring event logic works or is clearly labeled as future/not implemented
- No fake or hardcoded demo reminders are trusted as real features

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This should be treated as “needs verification” if the implementation is unclear.

---

## 9. Module 7 — ERP — Team / Member / Skills / Availability

### A. Navigation & Entry

### ERP-001 — Team member creation works with valid skills and role assignments
Preconditions:
- Studio owner is logged in

Steps:
1. Open team directory
2. Add a member with valid name, email, role, and skills
3. Save

Expected Result:
- Member appears in directory
- Skills and role are visible and persisted

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate member creation against schema and permission logic.

### ERP-002 — Empty skill list or invalid member data is rejected
Preconditions:
- Owner is logged in

Steps:
1. Submit member without required fields
2. Submit empty skills if invalid
3. Submit malformed email

Expected Result:
- Validation errors appear
- No broken record is stored

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Domain tests mention empty skills being rejected.

### ERP-003 — Member availability check works for scheduling and conflict detection
Preconditions:
- At least two members and one assigned event exist

Steps:
1. Create member schedule or availability data
2. Attempt conflict assignment with duplicate resource overlap
3. Review warnings or suggestions

Expected Result:
- Conflicts are visible and prevented or flagged
- Resource assignment does not create impossible double booking

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Important in the product discovery and preflight check logic.

### ERP-004 — Crew member cannot access other members’ private data
Preconditions:
- Active crew member account

Steps:
1. Attempt to access financial book data
2. Attempt to access all studio orders and clients
3. Attempt to open unrelated order tasks

Expected Result:
- Access denied
- Only assigned and permitted work is visible

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a key role-boundary test.

### ERP-005 — Crew member creation succeeds when optional phone is blank
Preconditions:
- Owner is logged in and is on the team-management screen.

Steps:
1. Add a crew member with name, email, and at least one skill; leave Phone blank.
2. Save and confirm the member/invitation result.
3. Refresh the team screen and inspect the saved record.

Expected Result:
- Creation succeeds without a Firestore undefined-value error.
- Phone remains blank/absent and is not treated as required.
- The invitation still targets the entered email.

Actual Result:
- Previous attempt failed with Firestore error: undefined value in field `phone`.
- Code now omits blank phone during creation; browser retest is pending.

Status:
- [~] PARTIAL

Issue:
- AUTH-003 / ERP-005: optional phone previously blocked crew creation.

Severity:
- Major

Notes:
- Also test editing a member to clear a previously saved phone number.

### ERP-006 — Owner creates and resends email-bound or generic invitations
Preconditions:
- Owner is on Studio Operations and can open Add Crew Member.

Steps:
1. Create an invite with name, email, optional phone, and skills; leave passcode empty.
2. Confirm it appears as PENDING, not as active crew, and copy its link again from the pending list.
3. Create a generic invite with name, no email, optional phone, skills, and a six-digit passcode.
4. Confirm the passcode is shown only at creation and the pending list does not expose its hash or PIN.
5. Revoke a pending generic invite and confirm its link can no longer be claimed.

Expected Result:
- Email-bound invitations retain the target-email restriction.
- Generic invitations have a separate secret link and Owner-selected six-digit passcode, with no automatic expiry.
- Crew records become active only after a claim; pending invitations remain visible to the Owner.
- Lost links can be copied again. If a generic passcode is lost or locked, the Owner revokes and creates a replacement.

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Severity:
- 

Notes:
- A syntactically valid email does not prove an inbox exists. Email-bound membership is finalized only when the matching Google account claims it.

---

## 10. Module 8 — Resource Planning & Assignment

### A. Navigation & Entry

### RES-001 — Resource suggestions and assignment flow works for a pending order
Preconditions:
- Order exists and crew data exists

Steps:
1. Open order or assignment panel
2. Trigger resource suggestion or assignment flow
3. Review suggestions and assign a photographer/editor

Expected Result:
- Suggested members are relevant to skills and required role
- Assignment is saved without conflicts

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- The product doc mentions automated resource suggestions and preflight checks.

### RES-002 — Assignment conflicts are detected and surfaced
Preconditions:
- Same date/time conflict exists

Steps:
1. Attempt assign same crew member to multiple overlapping events
2. Save or confirm assignment

Expected Result:
- Conflict is flagged or blocked
- Owner must resolve the conflict

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a major manual validation area.

### RES-003 — Assignment changes persist across refresh and reopen
Preconditions:
- Existing assignment exists

Steps:
1. Reassign a member or resource
2. Refresh page
3. Reopen order or task panel

Expected Result:
- Correct updated assignment remains in place

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate relationship integrity and persistence.

---

## 11. Module 9 — Task Management

### A. Navigation & Entry

### TASK-001 — Workflow tasks are created for a confirmed order
Preconditions:
- Order enters post-event or active production state

Steps:
1. Open task panel for an order
2. Observe generated tasks
3. Review sequence and status

Expected Result:
- Sequential tasks appear in correct order
- Studio isolation is preserved
- Task metadata is consistent with order

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Domain tests mention workflow task generation and order task sequencing.

### TASK-002 — Task status updates work end-to-end
Preconditions:
- Task exists and is assigned

Steps:
1. Update task status to in-progress / review / completed
2. Save and refresh

Expected Result:
- Status is persisted
- Task list reflects the new state
- Related order workflow stays aligned

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate that status can move forward correctly and not be skipped incorrectly.

### TASK-003 — Task assignment and reassignment works for multiple roles
Preconditions:
- Team members exist

Steps:
1. Assign a task to one member
2. Reassign to another member
3. Refresh and verify

Expected Result:
- Assignment changes are saved and visible
- Historical trace is retained as needed

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Check if assignment history is visible or intentionally not shown.

---

## 12. Module 10 — Order Workflow / Status / Timeline

### A. Navigation & Entry

### FLOW-001 — Order lifecycle transitions reflect actual business stages
Preconditions:
- Existing order in a valid studio

Steps:
1. Move order through awaiting-event → post-event → completed states
2. Observe timeline/status panel

Expected Result:
- Status transition is logical and consistent
- Timeline reflects the correct progression
- No accidental jump between stages

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This should align with product discovery: Confirmed Order → Awaiting Event → Post-Event In Progress → Completed.

### FLOW-002 — Completion requires necessary conditions
Preconditions:
- Existing order and tasks exist

Steps:
1. Try to mark order complete with incomplete tasks or pending payment
2. Retry after fixing conditions

Expected Result:
- Completion is blocked until criteria are met
- Completion is allowed only when the business rules pass

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Domain tests include payment and tasks gating logic.

### FLOW-003 — Order timeline remains consistent across refresh and reopen
Preconditions:
- At least one status change exists

Steps:
1. Change order status
2. Refresh page
3. Reopen same order

Expected Result:
- Status order history remains accurate and coherent

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate data integrity across lifecycle states.

---

## 13. Module 11 — Payments & Payment Status

### A. Navigation & Entry

### PAY-001 — Advance payment is recorded correctly and displayed in totals
Preconditions:
- Order is created and payment is due

Steps:
1. Add advance payment
2. Save
3. Refresh order and payment summary page

Expected Result:
- Payment value is saved
- Remaining amount recalculates correctly
- Totals are consistent

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate against order pricing logic and financial summary calculations.

### PAY-002 — Full payment and outstanding balance states behave correctly
Preconditions:
- Order has outstanding balance

Steps:
1. Record partial payment
2. Record final payment
3. Check order status or balance summary

Expected Result:
- Partial and full payment states reflect actual balance
- Completion logic only permits final close when conditions are met

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a key data integrity validation area.

### PAY-003 — Offline or manual payment verification flow is correctly enforced
Preconditions:
- A studio is using manual/offline proof verification or payment verification feature

Steps:
1. Record offline payment or verification request
2. Submit and review
3. Verify or reject as owner

Expected Result:
- Payment verification is tracked correctly
- Unauthorized or fake verification is blocked

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is important due to marketplace booking/payment verification requirements.

---

## 14. Module 12 — Customer Order Tracking / Passkey

### A. Navigation & Entry

### TRACK-001 — Customer passkey tracking page loads and shows the correct order
Preconditions:
- Valid order with passkey exists

Steps:
1. Open the passkey tracking link
2. View the order summary
3. Check milestone timeline and access information

Expected Result:
- Correct job/order loads
- Customer sees only their own project data

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is central to guest customer architecture.

### TRACK-002 — Invalid or expired passkey is rejected
Preconditions:
- Invalid or stale passkey is available

Steps:
1. Use a bad passkey URL
2. Attempt to access an old expired or missing order

Expected Result:
- Access denied or friendly not-found message
- No private data leakage

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Essential security and guest-user path validation.

### TRACK-003 — Customer sees timeline and project milestones without internal studio details
Preconditions:
- Valid passkey access

Steps:
1. Open customer tracking page
2. Check if internal financial notes, internal tasks, crew names, and internal comments are visible

Expected Result:
- Only approved customer-facing info is visible
- Internal details are removed

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is explicitly required by docs and DTO isolation requirements.

---

## 15. Module 13 — WhatsApp Operations & Bot

### A. Navigation & Entry

### WA-001 — WhatsApp configuration settings can be set and reset by owner
Preconditions:
- Owner access exists

Steps:
1. Open WhatsApp configuration panel
2. Update toggles or defaults
3. Save and reset

Expected Result:
- Configuration is saved
- Reset restores expected default values

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate against server actions around `whatsappConfig`.

### WA-002 — Non-owner cannot change WhatsApp settings
Preconditions:
- Member account available

Steps:
1. Attempt to access WhatsApp configuration
2. Try saving a change

Expected Result:
- Access denied
- No changes persist

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Must verify both UI masking and backend auth protections.

### WA-003 — Ordering of messaging events is consistent with actual workflow
Preconditions:
- A valid order and workflow tasks exist

Steps:
1. Trigger or review milestone events
2. Compare actual sent/expected notifications

Expected Result:
- Notifications follow the real order and milestone progression
- No out-of-order or impossible messages occur

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Especially relevant to planned “WhatsApp as optional operational layer.”

### WA-004 — Bot access boundaries are enforced
Preconditions:
- Owner and non-owner accounts exist

Steps:
1. Attempt WhatsApp bot interaction as owner
2. Attempt as member or customer if applicable

Expected Result:
- Only the intended user type may access the operations bot
- Unauthorized bot usage is blocked

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Important for pricing and entitlement expectations.

---

## 16. Module 14 — Notifications

### A. Navigation & Entry

### NOTIFY-001 — Basic order status notifications are visible or triggered appropriately
Preconditions:
- Valid order exists

Steps:
1. Trigger status change or milestone update
2. Check in-app notifications or outbound communication if implemented

Expected Result:
- Relevant notification appears or is triggered consistently

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate against actual operational workflows used by the studio.

### NOTIFY-002 — Notification for customer access link or delivery update is correct
Preconditions:
- Customer order exists

Steps:
1. Generate or trigger order milestone notification
2. Check link and message content for correctness

Expected Result:
- Correct passkey or gallery link is sent
- Information is accurate and user-safe

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Check both content and privacy boundaries.

---

## 17. Module 15 — Dashboard / Reports / Analytics

### A. Navigation & Entry

### REPORT-001 — Dashboard shows order summaries and values correctly
Preconditions:
- At least some orders exist across statuses

Steps:
1. Open dashboard overview
2. Check revenue, pending balance, and status totals

Expected Result:
- Totals reflect current data
- Calculations match the actual order set

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Check that value aggregate logic aligns with order pricing and payments.

### REPORT-002 — Business reports page loads and calculates meaningful metrics
Preconditions:
- Orders exist with revenue and payment data

Steps:
1. Open reports page
2. View monthly/yearly revenue, pending balances, and category profitability if available

Expected Result:
- Metrics reflect actual records
- Empty state or loading state is stable when no data exists

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a feature area that should be verified in UI against real data.

### REPORT-003 — Reports and dashboard are not exposing internal or unrelated data
Preconditions:
- Owner or member role context exists

Steps:
1. View reports as owner
2. View reports as non-owner or lower privilege account

Expected Result:
- Data is scope-appropriate
- Access rules are enforced

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Necessary to verify role boundaries.

---

## 18. Module 16 — Studio Marketplace

### A. Navigation & Entry

### MKT-001 — Public marketplace listing/search is visible and usable by public visitors
Preconditions:
- Marketplace visibility is enabled for a studio

Steps:
1. Open public marketplace search page
2. Search by city or tags
3. Open a studio listing

Expected Result:
- Studio profile appears on the public marketplace where permitted
- Public data is shown
- Private operational data remains hidden

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is critical to verify data privacy boundaries.

### MKT-005 — Public studio profile uses the nested marketplace URL
Preconditions:
- A studio profile is published and visible.

Steps:
1. Open `/studios` and select the published studio.
2. Copy the profile URL and open it in a signed-out browser.
3. Open the legacy `/studio/{slug}` URL for the same profile.

Expected Result:
- Marketplace listing opens `/studios/{publicSlug}` without authentication.
- Legacy `/studio/{publicSlug}` redirects to the nested canonical path.
- An unpublished/unknown profile is not exposed by guessing its slug.

Actual Result:
- `/studios` returns HTTP 200 but currently has no visible published profiles in local data, so a real listing-to-profile click is unavailable.
- `/studio/teststudio` returns HTTP 307 to `/studios/teststudio`.
- Open a known published profile in browser after one exists to verify profile content and inquiry flow.

Status:
- [~] PARTIAL

Issue:
- 

Severity:
- 

Notes:
- The profile slug is a public stable slug, not the Owner's personal name or email.

### MKT-002 — Marketplace profile and package publishing requires entitlement and owner role
Preconditions:
- Studio owner access exists

Steps:
1. Attempt to publish package/profile while not entitled
2. Attempt to publish when entitled

Expected Result:
- Publishing is blocked without the proper capability or role
- Entitled scenario succeeds

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Check if premium plan gating exists in app logic or is only cosmetic.

### MKT-003 — Public marketplace reveals only approved public profile data
Preconditions:
- Public profile exists

Steps:
1. View public studio profile
2. Compare it to private studio record
3. Confirm that internal CRM, pricing, orders, and employee details are not exposed

Expected Result:
- Only approved public profile content is visible
- Internal business data is hidden

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is one of the major privacy/security checks in the repo documentation.

### MKT-004 — Booking inquiry and negotiation flows are consistent with spec
Preconditions:
- Public marketplace package exists

Steps:
1. Submit booking inquiry or booking request
2. Review created record and owner response flow
3. Validate state changes and approvals

Expected Result:
- Booking request is created and linked to the correct studio/package
- Inquiry status is traceable and secure

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- The product docs describe a marketplace booking lifecycle that should be verified live.

---

## 19. Module 17 — Search / Filters / Sorting / Pagination

### A. Navigation & Entry

### SEARCH-001 — Search across studio or order lists returns relevant results
Preconditions:
- Multiple records exist

Steps:
1. Search by name, date, status, city, or package
2. Confirm output accuracy

Expected Result:
- Relevant results are returned
- Irrelevant records remain excluded

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This should be verified in CRM, order, marketplace, and member directories.

### SEARCH-002 — Pagination and empty results states behave correctly
Preconditions:
- Large dataset or empty dataset exists

Steps:
1. Browse a list with many items
2. Navigate across pages
3. Search for a non-existent record

Expected Result:
- Pagination remains stable
- Empty states are clear and user friendly

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Confirm both large-data and no-data UX.

---

## 20. Module 18 — Settings / Account / Studio Management

### A. Navigation & Entry

### SETTING-001 — Account settings are editable and persist correctly
Preconditions:
- Authenticated user exists

Steps:
1. Open account settings
2. Update profile or contact preferences
3. Save and refresh

Expected Result:
- Settings are persisted
- UI reflects the saved state

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate direct update and re-open operations.

### SETTING-002 — Workspace switch and owner account settings remain isolated per studio
Preconditions:
- User belongs to multiple studios

Steps:
1. Change settings in studio A
2. Switch to studio B
3. Confirm there is no cross-workspace contamination

Expected Result:
- Studio-specific settings remain separated

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Essential multi-workspace verification.

---

## 21. Module 19 — Roles & Permissions / Authorization

### A. Navigation & Entry

### PERM-001 — OWNER has full access to studio configuration and management
Preconditions:
- Studio owner account exists

Steps:
1. Attempt config changes, service changes, access changes, and secure action flows

Expected Result:
- Owner actions succeed
- No unnecessary restrictions appear

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate owner access to broad management operations.

### PERM-002 — MEMBER is limited to assigned and permitted scopes
Preconditions:
- Studio member account exists

Steps:
1. Attempt to access studio settings and financial summaries
2. Attempt to modify other members’ assignments or admin configuration

Expected Result:
- Access is denied when out of scope
- Assigned task/order visibility remains allowed where expected

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a critical role validation set.

### PERM-003 — CUSTOMER access is scoped to order and tracking only
Preconditions:
- Guest customer or customer-linked session exists

Steps:
1. Attempt to access studio settings, internal tasks, financial records, or unrelated orders

Expected Result:
- Denied and isolated
- Customer sees only authorized booking data

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Validate both UI gating and direct URL access.

---

## 22. Module 20 — Error Handling / Validation / Empty States

### A. Navigation & Entry

### ERR-001 — Required field validation messages are clear and accurate
Preconditions:
- Form exists for create/update flows

Steps:
1. Submit empty required fields
2. Submit invalid values
3. Submit malformed dates and malformed phone numbers

Expected Result:
- Friendly, actionable validation errors appear
- No silent fallback occurs

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This must be validated manually across all primary forms.

### ERR-002 — Empty states are usable and understandable
Preconditions:
- No orders, no tasks, no packages, no customers, or no marketplace data exists

Steps:
1. Open each relevant module with empty data

Expected Result:
- Empty state is not broken or blank
- Clear instructions or call to action appear

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Verify each module’s no-data UX.

### ERR-003 — Error states remain non-destructive
Preconditions:
- A failing network or action state can be triggered

Steps:
1. Trigger a save failure or invalid backend response
2. Reload and continue

Expected Result:
- User is informed clearly
- Data integrity is preserved
- No accidental corruption occurs

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Especially relevant for server action failures and database issues.

---

## 23. Module 21 — Data Integrity / Persistence / Refresh / Reload

### A. Navigation & Entry

### DATA-001 — Create → save → refresh → reopen works for a core order
Preconditions:
- Valid studio and data access exist

Steps:
1. Create order
2. Save
3. Refresh browser
4. Reopen order
5. Verify record still matches input

Expected Result:
- Full data persists
- No lost fields or hidden corruption

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a primary integrity test.

### DATA-002 — Related record consistency holds after update to parent record
Preconditions:
- Child-related data exists (package, task, payment, customer)

Steps:
1. Update parent information
2. Check related child records
3. Refresh and reopen

Expected Result:
- Related records still line up correctly
- No orphan or mismatch occurs

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Critical for inventory of business relationships.

### DATA-003 — Browser back/forward or refresh during workflow does not corrupt state
Preconditions:
- User is mid-flow (create/edit/payment)

Steps:
1. Begin an action
2. Refresh or use browser back/forward
3. Resume the workflow

Expected Result:
- No broken state or silent corruption occurs
- Clear warnings or stable data recovery are present

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Very important for manual QA.

---

## 24. Module 22 — Cross-Module End-to-End Workflows

### A. Detailed Scenario Walkthroughs

### E2E-001 — New studio setup flow
Preconditions:
- User is signed in and has no studio yet

Steps:
1. Register a studio
2. Configure settings
3. Add package/service
4. Create order and customer
5. Assign crew and tasks
6. Review status and payment flow

Expected Result:
- The studio can operate from setup through confirmed order processing without data loss or role breakage

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is the flagship lifecycle scenario.

### E2E-002 — Photography studio confirmed order lifecycle
Preconditions:
- A studio with customers, orders, and crew exists

Steps:
1. Create confirmed order
2. Add payment
3. Assign crew and tasks
4. Update order through production milestones
5. Send final deliverable and close order

Expected Result:
- Full lifecycle is coherent from booking to completion

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This should span OMS, CRM, ERP, tasking, and tracking.

### E2E-003 — Customer tracking and gallery flow
Preconditions:
- Valid customer order and passkey exist

Steps:
1. Open passkey tracking
2. Check milestones
3. Verify gallery or delivery link is accessible
4. Confirm internal details remain hidden

Expected Result:
- Customer experience is coherent, private, and functional

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Important for guest-customer product promise.

### E2E-004 — Marketplace inquiry to confirmed order pipeline
Preconditions:
- Public studio and package exist, marketplace is active

Steps:
1. Search marketplace
2. Open a public studio listing
3. Submit a booking request package inquiry
4. Review owner-side booking flow
5. Confirm or reject as owner

Expected Result:
- Public to private flow is consistent and privacy-safe
- Booking data is linked correctly and not exposed publicly

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Full marketplace lifecycle should be tested live.

---

## 25. Module 23 — Landing Page Feature Claims Verification

### Traceability table

| Landing Page Claim | Implemented? | Test ID(s) | Manual Status | Notes |
|---|---|---|---|---|
| “Bring your studio’s work, people, and orders together in one place” | [?] | AUTH-001, AUTH-002, OMS-001, ERP-001 | [ ] NOT TESTED | Broad claim; verify actual live workflows |
| “Orders, workflow, crew, and deliverables” | [?] | OMS-001, TASK-001, FLOW-001, ERP-003 | [ ] NOT TESTED | Must validate end-to-end | 
| “Studio Marketplace” | [?] | MKT-001, MKT-002, MKT-003 | [ ] NOT TESTED | Public listing and privacy boundary must be checked |
| “Simple and flexible studio pricing” | [?] | PKG-001, PKG-004, PAY-001 | [ ] NOT TESTED | Verify actual pricing implementation and entitlements |
| “Client tracking and passkey access” | [?] | TRACK-001, TRACK-002, TRACK-003 | [ ] NOT TESTED | Must confirm actual guest tracking flow |
| “WhatsApp operations and alerts” | [?] | WA-001, WA-003, WA-004 | [ ] NOT TESTED | Need live verification of actual notification and bot behavior |
| “Dashboard and business reports” | [?] | REPORT-001, REPORT-002 | [ ] NOT TESTED | Verify actual data and calculations |
| “Fast, simple onboarding” | [?] | STUDIO-001, STUDIO-002, STUDIO-003 | [ ] NOT TESTED | Must confirm onboarding and registration UX |

### Additional landing-page claim checks

### LP-001 — Claim coverage is verified against live pages and actual product behavior
Preconditions:
- App is running in a real environment

Steps:
1. Review the landing page copy and layout
2. Test the most important claims from the page
3. Compare to repository evidence and actual behavior

Expected Result:
- All major claims have either evidence or a known gap/mismatch record

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a reconciliation check between product messaging and implementation status.

---

## 26. Module 24 — Pricing Page Capability Verification

### Pricing capability traceability

| Pricing Capability | Module | Implemented? | Access/Entitlement Test IDs | Manual Status | Notes |
|---|---|---|---|---|---|
| Free core order management | OMS | [?] | OMS-001, AUTH-002 | [ ] NOT TESTED | Must confirm free-core access is truly free and functional |
| Customer Relations / CRM | CRM | [?] | CRM-001, CRM-003, PERM-002 | [ ] NOT TESTED | Verify entitlement and access scope |
| Studio Operations / ERP | ERP | [?] | ERP-001, ERP-004, RES-001 | [ ] NOT TESTED | Verify crew and scheduling functions |
| Business Reports / Analytics | REPORT | [?] | REPORT-001, REPORT-002, PERM-003 | [ ] NOT TESTED | Need validation against live data |
| Marketplace | Marketplace | [?] | MKT-001, MKT-002, MKT-003 | [ ] NOT TESTED | Must check public/private separation |
| WhatsApp alerts / operations | WhatsApp | [?] | WA-001, WA-003, WA-004 | [ ] NOT TESTED | Need real runtime evidence |
| OMS advanced / private order review features | OMS | [?] | OMS-003, TASK-001, TRACK-003 | [ ] NOT TESTED | Verify if advanced features are actually active |

### PRICING-001 — Pricing entitlements and actual visibility match the product claim
Preconditions:
- Pricing page and checkout page are accessible

Steps:
1. Review pricing copy and package list
2. Compare with actual access/feature logic in the app
3. Attempt to access a premium feature without entitlement

Expected Result:
- Layout and actual access control are aligned
- Hidden or disabled features are not treated as available

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a direct enforcement test for feature entitlement logic.

### PRICING-002 — Premium upgrade or plan flow route is coherent and non-deceptive
Preconditions:
- App and pricing page loaded

Steps:
1. Click upgrade or checkout CTA
2. Follow the plan path
3. Review if claimed features are actually available behind the selected plan

Expected Result:
- Upgrade path is coherent and not misleading
- Entitlements are enforced server-side as well as UI-side

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is especially important because the repo has pricing and entitlement docs plus a current public pricing UI.

---

## 27. Module 25 — Non-Functional / Production Readiness Checks

### A. Manual product-readiness checks

### NF-001 — Page loads and major sections render without obvious breakage
Preconditions:
- App is running locally or in deployed environment

Steps:
1. Load home, pricing, features, studio marketplace, and dashboard pages
2. Review layout and responsiveness

Expected Result:
- Pages render without critical visual or content breakage
- Basic navigation works

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a basic smoke test, not formal performance testing.

### NF-002 — Empty, loading, and error states are usable
Preconditions:
- Data scenarios exist or can be induced

Steps:
1. Load module pages with no data
2. Trigger delay or failure conditions if possible
3. Confirm messages and recovery are understandable

Expected Result:
- Good UX under empty-load-error scenarios
- No silent failure loops

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Required for manual validation of “no data” and “error recovery.”

### NF-003 — Session continuity and refresh behavior remain stable
Preconditions:
- Authenticated user session active

Steps:
1. Refresh while on dashboard or studio workspace pages
2. Return to the same area
3. Verify session and data state remain coherent

Expected Result:
- Session persists as expected
- No unauthorized data exposure or broken session state occurs

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- Manual check for login persistence and reload safety.

### NF-004 — Browser console and network errors relevant to functionality are reviewed
Preconditions:
- Browser dev tools available

Steps:
1. Perform common workflows
2. Open browser console/network logs
3. Search for visible errors or failed requests

Expected Result:
- No obvious broken requests or console errors during critical product flows

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Notes:
- This is a manual check; do not claim production readiness based solely on a clean build.

### NF-005 — Expanded landing-page feature cards align as a centered 2-by-2 desktop grid
Preconditions:
- Landing page is open at desktop width.

Steps:
1. Expand a four-feature module under “Why Focoman?”.
2. Inspect the card rows at desktop and tablet widths.
3. Repeat for the remaining four-feature modules.

Expected Result:
- Desktop shows two centered cards per row with balanced spacing.
- Tablet/mobile layout remains readable without overflow.

Actual Result:
- 

Status:
- [ ] NOT TESTED

Issue:
- 

Severity:
- 

Notes:
- Code layout check is not a substitute for visual browser validation.

---

## 28. Implementation vs Claim Matrix

| Capability | In Code | In Product Doc | On Landing Page | On Pricing Page | Manual Test Exists | Status |
|---|---|---|---|---|---|---|
| OMS order management | Yes | Yes | Yes | Yes | Partial | [?] Needs review |
| CRM customer directory | Yes | Yes | Yes | Yes | Partial | [?] Needs review |
| ERP team and scheduling | Yes | Yes | Yes | Yes | Partial | [?] Needs review |
| Task management | Yes | Yes | Partial | Partial | Partial | [?] Needs review |
| Payment tracking | Yes | Yes | Partial | Partial | Partial | [?] Needs review |
| Customer passkey tracking | Yes | Yes | Yes | Partial | Partial | [?] Needs review |
| WhatsApp alerts/bot | Partial / config-driven | Yes | Yes | Yes | Partial | [?] Needs review |
| Studio Marketplace | Yes | Yes | Yes | Yes | Partial | [?] Needs review |
| Dashboard and reports | Yes | Yes | Partial | Partial | Partial | [?] Needs review |
| Auth and role permissions | Yes | Yes | Partial | Partial | Partial | [?] Needs review |
| Multi-studio workspace model | Yes | Yes | Partial | Partial | Partial | [?] Needs review |

---

## 29. Automated Test Coverage Review

Existing automated tests file:
- `tests/backend-crud.test.ts`

### Existing automated test areas identified
1. Recovery system and soft-delete logic
2. OMS domain pipeline logic
3. Validation schemas for CRUD operations
4. Preflight checks and booking confirmation logic
5. Customer order view data isolation

### Automated test quality note
These tests verify logic and schema behavior in TypeScript domain/validation code, but they do not replace:
- live UI behavior validation
- role and permission enforcement checks
- end-to-end flows in a running app
- marketplace and customer passkey testing
- actual data persistence verification in a real environment

### Automated coverage vs manual validation
| Automated Area | What it verifies | What it does not verify | Related Manual Test IDs |
|---|---|---|---|
| Recovery system | Deletion window logic and restore checks | UI actions and user-facing error states | CONFIG-004, DATA-003 |
| OMS logic | Task generation and order completion conditions | Real UI creation, assignment, and persistence | OMS-001, TASK-001, FLOW-002 |
| Validation schemas | Input validation of key models | Form UX, user messaging, and route behavior | ERR-001, PKG-002, ERP-002 |
| Preflight/booking logic | Conflict and assignment logic | Live marketplace booking and owner review | RES-002, MKT-004 |
| Customer order view isolation | Sanitization of private fields | Real guest portal access and content exposure | TRACK-003, AUTH-004 |

---

## 30. Known / Suspicious Areas Requiring Verification

The following deserve explicit manual review because they are high-risk for mismatches, partial implementation, or unclear runtime behavior:
- TODO / FIXME / demo / placeholder / mock markers across app logic
- Hardcoded or default studio features in onboarding and registration logic
- Marketplace entitlement enforcement and public/private data separation
- Customer access and passkey privacy boundaries
- WhatsApp configuration and automation coverage status
- UI-only permission masking vs real backend enforcement
- Member assigned-work UI after restricting studio-wide order, CRM, and roster reads
- Data calculations for reports and payments
- “Complete plan” or “pro plan” marketing claims versus code-enforced entitlement logic
- Pre-event lead / quote modules and whether they are truly out of scope or partially implemented

This section should be kept updated during live testing.

---

## 31. Major Gaps / Unimplemented / Unclear Items

These items are either clearly out of scope or require live validation before being considered implemented:
- Full WhatsApp production dispatch and bot behavior may not be fully live in the current repository state.
- Marketplace verification and public/private data firewall need live validation.
- Full end-to-end payment verification/owner confirmation workflows need manual proof.
- Advanced marketplace negotiation and booking lifecycle behavior need live confirmation.
- Multi-owner/member permission enforcement needs manual UI + direct access verification.
- Reports and analytics may be implemented but require real-data validation.
- Some public landing page claims may exceed the currently proven implementation evidence.

Status classification:
- [ ? ] NEEDS REVIEW or [ OOS ] OUT OF SCOPE where the requirement is explicitly outside current phase.

---

## 32. Requirement vs. Implementation Commentary

This product is founded on a confirmed-order OMS model, and the repository does align with that direction in core logic and domain design. However, the marketing and pricing pages describe broader capabilities than are proven in live execution. The checklist should therefore treat marketing claims and documented requirements as testable hypotheses until manual validation confirms them.

Main requirement/content mismatches to watch:
- Marketplace is marketed as a public capability and may be live, but live privacy and data isolation must be manually verified.
- WhatsApp automation and bot capabilities are discussed as a premium operational layer; they may be partially implemented or configuration-driven.
- Pricing and plan structure may be pre-release or provisional; actual entitlements and UI gating must be reviewed live.
- Full pre-event CRM or lead-generation flows are explicitly excluded from phase 1; if they appear in landing copy, they should be flagged as mismatch or future scope.

---

## 33. Recommended Testing Order

1. Authentication & access
2. Studio signup and workspace setup
3. Studio configuration and permissions
4. Services/packages and pricing configuration
5. OMS order creation and lifecycle
6. CRM and customer access
7. ERP and crew assignment
8. Task workflow and status progression
9. Payment and order completion
10. Passkey tracking and customer-facing delivery
11. WhatsApp operations and notifications
12. Dashboard/reports
13. Marketplace and booking inquiry flow
14. Cross-module end-to-end scenarios
15. Final landing page and pricing claim reconciliation

---

## 34. Final Review Checklist

Before marking the app ready for broader validation, confirm all of the following:
- [ ] Every major current user-facing module has manual coverage
- [ ] Every major Product Discovery requirement has either test coverage or explicit OOS/future marking
- [ ] Every public landing-page claim has a mapping
- [ ] Every pricing capability has a mapping
- [ ] Permission boundaries are tested for owner/member/customer
- [ ] Data persistence and refresh workflows are covered
- [ ] Major edge cases exist for inputs and errors
- [ ] Cross-module flows are tested end-to-end
- [ ] Automated tests are clearly distinguished from manual validation
- [ ] Unclear or unsupported claims are called out as needing review

---

## 35. Master Summary

### Major counts used for planning
- Modules covered: 25
- Manual test cases included: 60+
- Landing-page claims mapped: 8 major claims
- Pricing capabilities mapped: 7 major capability groups
- Automated test areas identified: 5
- Unimplemented / unclear / needs review items: tracked throughout the checklist, not silently treated as passed

This document is intended to be updated over multiple testing sessions. Do not mark a feature as PASS without actual live evidence.
