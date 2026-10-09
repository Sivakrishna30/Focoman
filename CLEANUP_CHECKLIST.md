# Cleanup Checklist: Removal of Experimental UI Systems

* [x] Inspect the existing code and identify multilingual UI implementation.
  * *Note: Identified `apps/web/src/context/LanguageContext.tsx` (all multi-depth Tamil, Thanglish, English translations and state), `apps/web/src/components/LanguageSwitcher.tsx`, and imports/usages in `layout.tsx`, `Navbar.tsx`, `DashboardTopNav.tsx`, `DashboardSidebar.tsx`, `BackButton.tsx`, `HomePage.tsx`, and `DashboardHomeView.tsx`.*
* [x] Remove the multilingual UI system and its exclusively related code.
  * *Note: Removed `LanguageProvider` from `layout.tsx`; deleted `LanguageContext.tsx` (all Tamil, English, and Tanglish dictionaries & state) and `LanguageSwitcher.tsx`; removed `LanguageSwitcher` and `useLanguage` from `Navbar.tsx`, `DashboardTopNav.tsx`, `DashboardSidebar.tsx`, `BackButton.tsx`, `HomePage.tsx`, and `DashboardHomeView.tsx`. Retained standard English copywriting as the single default UI language. Verified zero TS errors and all 31 tests passing.*
* [x] Update this checklist immediately.
* [x] Inspect and identify dark/light mode implementation.
  * *Note: Identified `ThemeContext.tsx` (`ThemeMode`, `localStorage` key `focoman_theme`, `ThemeProvider`, `useTheme`, html class toggling), `ThemeSwitcher.tsx`, unused imports in `Navbar.tsx`, `DashboardTopNav.tsx`, `DashboardSidebar.tsx`, wrapper in `layout.tsx`, and dark/monochrome CSS rules (`.dark`, `[data-theme="dark"]`, `.monochrome`, `.dark *`) in `globals.css` and `Navbar.tsx` inline dark classes.*
* [x] Remove dark/light switching and its exclusively related settings and logic.
  * *Note: Removed `ThemeProvider` from `layout.tsx`; deleted `ThemeContext.tsx` and `ThemeSwitcher.tsx`; removed `ThemeSwitcher` imports from `Navbar.tsx`, `DashboardTopNav.tsx`, and `DashboardSidebar.tsx`; cleaned dark Tailwind classes in `Navbar.tsx`; removed dark/monochrome CSS rules and theme overrides from `globals.css` while fully preserving standard brand colors, button styles, status badges, and all Retro UI styling in `retro-theme.css`. Verified zero TS errors and all 31 unit tests passing.*
* [x] Update this checklist immediately.
* [x] Inspect and identify the Modern UI variant and Retro/Modern switch.
  * *Note: Identified `UiStyleContext.tsx` (`UiStyleMode`, `focoman_ui_style` storage, `UiStyleProvider`, `useUiStyle`), `UiStyleToggle.tsx` (Retro/Modern toggle button), usages in `Navbar.tsx` and `DashboardTopNav.tsx`, and provider wrapping in `layout.tsx`. In `layout.tsx`, `retro-ui` class is already on `<html>` and `<body>`.*
* [x] Remove the Modern UI variant and the switch, retaining Retro UI as the sole design.
  * *Note: Removed `UiStyleProvider` from `layout.tsx`; deleted `UiStyleContext.tsx` and `UiStyleToggle.tsx`; removed `UiStyleToggle` imports and JSX elements from `Navbar.tsx` and `DashboardTopNav.tsx`; retained `retro-ui` class and `data-ui-style="retro"` permanently on `<html>` and `<body>` in `layout.tsx`, making the tactile Retro UI the sole permanent design language. Preserved all retro theme variables and styles in `retro-theme.css`. Verified zero TS errors and all 31 unit tests passing.*
* [x] Update this checklist immediately.
* [x] Review the three cleanup areas for remaining references and update the checklist with the actual completion status.
  * *Note: Final audit completed. Verified zero residual imports, hooks, contexts, or components across all three systems (`LanguageContext`, `LanguageSwitcher`, `useLanguage`, `ThemeContext`, `ThemeSwitcher`, `useTheme`, `UiStyleContext`, `UiStyleToggle`, `useUiStyle`). TypeScript compile (`npx tsc --noEmit`) passes with 0 errors, and all 31 test suites pass with 0 failures. The Retro UI remains the sole, permanent UI system with all brand colors and layout structures intact.*

