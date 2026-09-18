# Task 01: Language & Multilingual Audit

## Objective
Audit all user-facing strings across English, Tamil, and Tanglish to ensure translation fidelity, elimination of awkward hybrid scripts, and preservation of approved English copy.

## Scope
- `LanguageContext.tsx`
- Navigation bars (`Navbar.tsx`, `DashboardSidebar.tsx`, `DashboardTopNav.tsx`)
- Landing page features (`HomePage.tsx`, `/features/page.tsx`)
- Milestone tags and payment statuses

## Current Findings
- Language modes exist: `en`, `thanglish`, `ta_easy` (Tamil with English terms), `ta_pure` (Full Tamil).
- The language switch control must be simplified to an uncluttered, single-button interaction with clear `En` / `Tha` / `Tha/En` modes.
- Approved English marketing copy must remain intact without unintended alterations.

## Acceptance Criteria
- [ ] English strings match official product discovery documents and approved copy.
- [ ] Tamil strings use proper, natural Tamil without mechanical English transliteration into Tamil script.
- [ ] Tanglish strings follow the `02-tanglish-standard.md` guideline.
- [ ] Basic UI controls (buttons, links) use single-word English.

## Status
IN PROGRESS
