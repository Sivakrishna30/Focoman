# Hero Dashboard OMS Table Mobile Fit & Google Sign-In 403 Fix

Align and zoom out the hero panel dashboard preview OMS table so all columns fit on mobile viewports, and resolve the Google OAuth 403 "We're sorry, but you do not have access to this page" error by restoring canonical authorized authDomain and adding resilient popup fallback.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following choices were confirmed during Phase 1 clarification:
> - **Table Scope**: Fix column alignment and zoom-out specifically for the **Hero Panel Dashboard Preview OMS Table** (Stage 4 in `RetroHeroVisual.tsx`) so columns like `Order`, `Customer`, `Event`, `Date`, `Status`, `Amount`, and `Balance` fit without cutting off on mobile screens.
> - **Sign-In Flow**: Retain **same-tab redirect** (`signInWithRedirect`) as the primary sign-in mechanism, with **popup sign-in** (`signInWithPopup`) operating as the automatic fallback if redirect encounters authorization/iframe restrictions.

---

## 1. Overview & Core Concept

- **Problem 1 (Mobile Table Cutoff)**: In the hero dashboard preview, the authentic orders table currently sets `min-w-[420px]`. On mobile screens (<400px width), the rightmost columns (`Amount` and `Balance`) are clipped or pushed off-screen.
- **Problem 2 (Google Sign-In 403 Error)**: `apps/web/src/lib/firebase.ts` dynamically sets `authDomain = window.location.host`. When accessed on preview or cloud environments (e.g. `ais-dev-...run.app`), Google OAuth rejects the redirect with **"403. That's an error. We're sorry, but you do not have access to this page"** because dynamic hostnames are not registered as authorized redirect URIs in the Google OAuth client. Additionally, when running inside an embedded preview iframe, same-tab redirect to `accounts.google.com` is blocked by Google's frame-ancestors security policies.
- **Solution Delivered**:
  1. Scale and zoom out the hero dashboard OMS table on mobile (`scale-[0.74] sm:scale-100 origin-top-left`) so all 7 columns remain visible without right-side clipping.
  2. Fix `getAuthDomain()` in `firebase.ts` to ensure canonical authorized `focoman.firebaseapp.com` is used for preview domains.
  3. Keep same-tab redirect as primary in `firebaseAuth.ts`, handling iframe top-level redirects safely, and providing a clean, automatic fallback to popup sign-in if redirect fails.

---

## 2. User Experience & Visual Design

### Hero Panel Dashboard Table
- **Mobile Experience**:
  - The dashboard OMS table displays `#`, `Order ID`, `Customer`, `Event`, `Date`, `Status`, `Amount`, and `Balance` in full view on mobile screens.
  - Sits inside a proportional wrapper (`w-[136%] origin-top-left scale-[0.735] xs:w-[118%] xs:scale-[0.847] sm:w-full sm:scale-100`) so the entire width matches the card boundary with zero horizontal clipping.

### Sign-In Experience
- **Primary Action**: User clicks "Continue with Google" -> initiates same-tab redirect via canonical authorized Firebase auth domain.
- **Fallback Action**: If redirected inside an iframe or if an error occurs, the user is offered an instant "Sign in using Popup Window" button, ensuring they can always authenticate without error screens.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Restoring Canonical `focoman.firebaseapp.com` for Non-Custom Hosts**
  - *Chosen Approach*: Only use `window.location.host` for known custom production domains (e.g., `focoman.com`). For all preview hosts (`*.run.app`, `localhost`), default to `focoman.firebaseapp.com`.
  - *Why*: Google Cloud Console OAuth Client IDs only authorize verified production domains and `*.firebaseapp.com`. Using arbitrary dynamic hostnames triggers Google's 403 Forbidden page.
- **Decision 2: Iframe Detection & Top Navigation for Redirect**
  - *Chosen Approach*: When running inside an iframe, handle redirect via `window.top` navigation or seamlessly fall back to popup.
  - *Why*: Google Accounts strictly forbids rendering inside an `<iframe>`.

---

## 4. Technical Architecture & File Changes

```
┌─────────────────────────────────────────────────────────────┐
│ 1. RetroHeroVisual.tsx (Hero Dashboard OMS Table)           │
│    - Wrap table in responsive scaling container             │
│    - Scale factor: 0.735 (mobile) -> 1.0 (desktop)          │
│    - All columns (Order, Customer, Date, Status, Amt, Bal)  │
│      fit within mobile view without clipping                │
└─────────────────────────────────────────────────────────────┘
                               ▲
┌─────────────────────────────────────────────────────────────┐
│ 2. firebase.ts (AuthDomain Configuration)                   │
│    - Ensure authDomain defaults to 'focoman.firebaseapp.com'│
│    - Avoid passing unauthorized dynamic run.app hostnames   │
│      to Google OAuth                                        │
└─────────────────────────────────────────────────────────────┘
                               ▲
┌─────────────────────────────────────────────────────────────┐
│ 3. firebaseAuth.ts & sign-in/page.tsx                       │
│    - Primary: same-tab signInWithRedirect                   │
│    - Fallback: popup sign-in trigger on error/iframe        │
│    - Clear user-facing error handling and fallback UI       │
└─────────────────────────────────────────────────────────────┘
```

### Files to Update
1. `apps/web/src/components/home/RetroHeroVisual.tsx`: Update Stage 4 dashboard OMS table container to use responsive scaling on mobile.
2. `apps/web/src/lib/firebase.ts`: Fix `getAuthDomain()` so it uses the canonical authorized Firebase domain for preview hosts.
3. `apps/web/src/lib/firebaseAuth.ts`: Update `signInWithGoogle` to keep same-tab redirect primary with automatic popup fallback.
4. `apps/web/src/app/sign-in/page.tsx`: Add popup fallback trigger if redirect is blocked.
