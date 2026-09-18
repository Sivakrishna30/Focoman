# Task 07: Top Panel & Mobile Header Optimization

## Objective
Streamline the top navigation bar and dashboard header controls to be minimal, clear, and mobile-first, removing visual crowding and duplicated controls.

## Scope
- `apps/web/src/components/LanguageSwitcher.tsx`
- `apps/web/src/components/ThemeSwitcher.tsx`
- `apps/web/src/components/Navbar.tsx`
- `apps/web/src/components/DashboardTopNav.tsx`
- `apps/web/src/components/DashboardSidebar.tsx`

## Design Directives
1. **Language Control:** Single compact button showing current code (`En`, `Tha`, `Tha/En`) with clean toggle dropdown or cycling interaction.
2. **Theme Control:** Single accessible icon button (`☀️` / `🌙` / `🎞️`) with tooltip on desktop and immediate feedback on mobile.
3. **Zero Horizontal Overflow:** Ensure header components fit cleanly on 320px, 360px, 375px, 390px, and 414px viewports without wrapping or button clipping.

## Status
IN PROGRESS
