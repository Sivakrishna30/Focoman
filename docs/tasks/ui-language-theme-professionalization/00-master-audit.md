# Master Audit: Focoman UI Language, Tanglish & Responsive Theme Professionalization

**Status:** IN PROGRESS  
**Auditor:** Senior Product Designer + UX Engineer + Frontend Engineer + QA  
**Date:** 2026-09-16  

---

## 1. Executive Summary & Audit Scope

This document provides a comprehensive, evidence-based audit of Focoman's user interface across:
1. **Multilingual Architecture** (English, Tamil, and Spoken Tanglish)
2. **Design System & Theme Coherence** (Monochromatic identity in Light & Dark modes)
3. **Mobile-First Top Navigation & Control Density** (Single-action language & theme controls)
4. **Photography & Studio Business Terminology Consistency**
5. **Component Consolidation & Accessibility Compliance**

---

## 2. Findings Matrix

| Finding ID | Domain | Observation / Issue | Status | Affected Files | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | Top Panel / Navigation | Multiple separate text/glyph items in language & theme buttons creating visual clutter on mobile headers (<390px). | **VERIFIED** | `LanguageSwitcher.tsx`, `ThemeSwitcher.tsx`, `Navbar.tsx`, `DashboardSidebar.tsx` | High |
| **F-02** | Language (Tanglish) | Tanglish lacked documented standardization; mixed styles existed across different feature cards and labels. | **VERIFIED** | `LanguageContext.tsx`, `HomePage.tsx` | Medium |
| **F-03** | Single-Word UI Buttons | UI controls (e.g. Sign In, Back, Save, Cancel, Close, Add, Edit) occasionally had conversational/mixed suffixes instead of concise, universally understood English controls across language modes. | **VERIFIED** | `LanguageContext.tsx`, `BackButton.tsx`, `Navbar.tsx` | High |
| **F-04** | Theme (Monochrome System) | UI had residual saturated accent colors in some cards/badges; need strict adherence to refined monochromatic foundation (black/white/grays + minimal restrained semantic statuses). | **VERIFIED** | `globals.css`, `tailwind.config.ts`, feature dashboard cards | High |
| **F-05** | Dark Mode Surfaces | Dark mode relied partly on CSS overrides; card elevation, borders, input placeholders, and text contrast need intentional architectural hierarchy (`#0B0F19` base, `#111827` surface, `#1E293B` borders). | **VERIFIED** | `globals.css`, `ThemeContext.tsx`, Dashboard components | High |
| **F-06** | Photography Terminology | Technical studio terms (RAW, Album, Shoot, Crew, Editing, Deliverables, Invoice, WhatsApp) should remain in standard English in Tanglish/Tamil explanatory contexts where translation causes confusion. | **VERIFIED** | `LanguageContext.tsx`, `HomePage.tsx`, `FeaturesPage.tsx` | Medium |
| **F-07** | Responsive Density (320px–414px) | Top navbars on narrow devices (320px, 360px) must guarantee zero wrapping, minimal touch-friendly tap targets (>=44px), and collapsible non-essential text. | **VERIFIED** | `Navbar.tsx`, `DashboardSidebar.tsx`, `DashboardTopNav.tsx` | High |
| **F-08** | Accessibility & Focus | Icon-only controls in simplified header must maintain explicit `aria-label`, visible focus rings, and high WCAG AA contrast. | **VERIFIED** | `LanguageSwitcher.tsx`, `ThemeSwitcher.tsx` | Medium |

---

## 3. Affected Routes & Components

### Routes
- `/` (Home Landing Page)
- `/features` (Features Page)
- `/pricing` (Pricing Page)
- `/about` (About Us)
- `/sign-in` (Sign In Flow)
- `/workspaces` (Workspace Selector)
- `/[studioSlug]/dashboard` (Overview)
- `/[studioSlug]/dashboard/oms` (Order Management System)
- `/[studioSlug]/dashboard/crm` (Customer Relationship Management)
- `/[studioSlug]/dashboard/erp` (Studio Operations & Crew)
- `/[studioSlug]/dashboard/whatsapp` (WhatsApp Automation)
- `/[studioSlug]/dashboard/marketplace` (Partner Marketplace)
- `/track/[passkey]` (Guest Tracking Portal)

### Components & Contexts
- `/apps/web/src/context/LanguageContext.tsx`
- `/apps/web/src/context/ThemeContext.tsx`
- `/apps/web/src/components/LanguageSwitcher.tsx`
- `/apps/web/src/components/ThemeSwitcher.tsx`
- `/apps/web/src/components/Navbar.tsx`
- `/apps/web/src/components/DashboardTopNav.tsx`
- `/apps/web/src/components/DashboardSidebar.tsx`
- `/apps/web/src/components/BackButton.tsx`
- `/apps/web/src/app/globals.css`
- `/apps/web/tailwind.config.ts`

---

## 4. Implementation Risks & Mitigations

1. **Risk:** Breaking existing translated keys or causing fallback rendering errors.  
   **Mitigation:** Retain all translation keys with structured type checking; keep fallback mechanism to English.
2. **Risk:** Contrast loss in dark or monochrome modes.  
   **Mitigation:** Verify WCAG AA 4.5:1 text-to-background contrast across light, dark, and monochrome stylesheets.
3. **Risk:** Mobile header element overlap.  
   **Mitigation:** Enforce `shrink-0` on icon buttons, collapse labels on small screens (`<640px`), test at 320px, 360px, 375px, 390px, and 414px.
