# HoloKai Mobile Viewport & Code Quality Audit
**Date:** August 2, 2026  
**Scope:** FeexSystems/HoloKai-Systems-  
**Language Composition:** JavaScript (57.7%) | Python (27.1%) | TypeScript (14.7%)

---

## Executive Summary

This document catalogues all identified mobile viewport layout issues, responsive design gaps, and code quality improvements across the HoloKai application. The repository contains two primary user-facing codebases:

1. **`HoloKai - landingpage/`** — Public landing page (separate Vite project)
2. **`holo-kai/`** — Civilization Core (Oracle Portal, research tools)

### Key Findings

- **6 Critical Mobile Layout Issues** (already documented in user request)
- **8 Additional Problematic Components** requiring responsive fixes
- **3 Structural/Code Quality Issues** impacting maintainability
- **2 Performance Opportunities** (bundling, image optimization)

---

## PART A: Previously Documented Mobile Layout Issues (CRITICAL)

### 1. **Sidebar.jsx** ❌ NOT RESPONSIVE
**File:** `holo-kai/src/components/core/Sidebar.jsx`  
**Issue:** Fixed width `w-60` takes 240px on mobile, squashing main content  
**Fix Required:**
- Hide on mobile (`hidden lg:flex`)
- Convert to responsive drawer with slide-out menu toggle
- Mobile breakpoint: `<768px`

### 2. **OracleCorePanel.jsx** ❌ TABS WRAP
**File:** `holo-kai/src/components/core/OracleCorePanel.jsx`  
**Issue:** 6 navigation tabs stack into 5+ rows on mobile (lines 72–143)  
**Fix Required:**
- Wrap tab bar in horizontal scroll container
- Apply `flex flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-none`
- Allow touch swipe on mobile

### 3. **HoloKaiVoiceOracle.jsx** ❌ FIXED HEIGHT VISUALIZER
**File:** `holo-kai/src/components/oracle/HoloKaiVoiceOracle.jsx`  
**Issue:** Guardian orbital visualizer has fixed `min-h-[400px] w-80 h-80` (line 298), causes vertical expansion on mobile  
**Fix Required:**
- Apply fluid scaling: `w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80`
- Enforce `max-w-full` on container

### 4. **PageShell.jsx** ❌ HEADER COLLISION
**File:** `holo-kai/src/components/PageShell.jsx`  
**Issue:** Header uses `flex items-center justify-between` without responsive wrapping on `<380px` (lines 37–75)  
**Fix Required:**
- Add responsive flex ordering: `flex-col sm:flex-row`
- Hide back button text on tiny screens
- Cap logo height to `h-6`

### 5. **HoloKaiLogo.tsx** ❌ UNCONSTRAINED IMAGE
**File:** `holo-kai/src/landing/components/HoloKaiLogo.tsx`  
**Issue:** Image can scale beyond container, causing nav headers to pop vertically (lines 21–35)  
**Fix Required:**
- Enforce strict inline max-height: `max-h-7 sm:max-h-8 shrink-0 object-contain`
- Add inline fallback badge rendering

### 6. **Index.tsx (Landing)** ❌ HERO OVERFLOW & UNRESPONSIVE TYPOGRAPHY
**File:** `holo-kai/src/landing/pages/Index.tsx`  
**Issues:**
- Hero headlines `text-6xl sm:text-7xl lg:text-[7.2rem]` expand beyond 100vw (lines 240–245)
- Key-art showcase (lg:col-span-5) renders on mobile (lines 290–314)
- CTA button rows not wrapping on small screens (lines 253–276)

**Fix Required:**
- Set responsive text steps: `text-3xl sm:text-6xl md:text-8xl`
- Wrap key-art in `hidden lg:flex`
- Apply `w-full sm:w-auto` to buttons
- Enforce `overflow-x-hidden` on root

---

## PART B: Additional Problematic Components (HIGH PRIORITY)

### 7. **CivilizationCore.jsx** ❌ LAYOUT COLLAPSE
**File:** `holo-kai/src/pages/CivilizationCore.jsx`  
**Issues:**
- No mobile drawer for sidebar (sidebar always renders on line 151)
- Main workspace has no responsive max-width constraints
- ShellHeader tabs may not be hidden on mobile

**Fix Required:**
- Add mobile sidebar toggle button in header
- Use media query hook (`use-mobile.jsx` mentioned in docs but verify implementation)
- Constrain main workspace to avoid excessive line lengths on desktop
- Hide non-essential tabs below `md:` breakpoint

### 8. **VanguardUnitVoiceSelector.jsx** ❌ INVALID DOM NESTING + MOBILE CARD OVERFLOW
**File:** `holo-kai/src/components/oracle/VanguardUnitVoiceSelector.jsx`  
**Issues:**
- Grid uses `grid-cols-2 sm:grid-cols-4` (line 53), causing card compression on tablets
- Specs wrap awkwardly due to `flex flex-wrap gap-1` (line 93)
- Button voice test has nested button structure (lines 76–85) — already fixed per user notes

**Fix Required:**
- Adjust grid breakpoints: `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`
- Card content: add `min-h-0` to allow flex to shrink properly
- Ensure specs display as single line or wrap gracefully

### 9. **AnatomySection.tsx** ❌ STATS GRID MISALIGNMENT
**File:** `holo-kai/src/landing/components/sections/AnatomySection.tsx`  
**Issue:** Stats grid uses `grid-cols-2 sm:grid-cols-3` (line 54), causing odd alignment on tablets  
**Fix Required:**
- Adjust to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Enforce uniform min-height for cards

### 10. **MeetTheVanguard.tsx** ❌ IMAGE GALLERY RESPONSIVENESS
**File:** `holo-kai/src/landing/components/MeetTheVanguard.tsx`  
**Issue:** Image grid uses `md:grid-cols-2` (line 166), but no mobile single-column fallback defined  
**Fix Required:**
- Verify grid defaults to single column on mobile (appears correct but confirm)
- Ensure aspect ratio maintained across all breakpoints

### 11. **UnitLabViewer.tsx** ❌ SIDE PANEL OVERFLOW + BUTTON ROW WRAPPING
**File:** `holo-kai/src/landing/components/lab/UnitLabViewer.tsx`  
**Issues:**
- Side dossier panel hidden on mobile (`hidden md:flex` line 215) ✓ Good
- Bottom button row may overflow on small screens due to flex gap (lines 271–332)
- Control buttons at top (lines 138–203) use flex wrap but no max-width constraint

**Fix Required:**
- Wrap bottom control buttons: `flex flex-col sm:flex-row gap-2`
- Stack vertically on mobile, horizontal on desktop
- Apply `flex-shrink-0` to buttons to prevent squashing

### 12. **Hero3DStage.tsx** ❌ POTENTIAL CANVAS SIZING
**File:** `holo-kai/src/landing/components/Hero3DStage.tsx` (not retrieved, but mentioned in Index.tsx line 20)  
**Assumption:** May have fixed dimensions or overflow issues on mobile  
**Fix Required:**
- Verify canvas has `w-full h-auto` with aspect ratio maintained
- Fallback to static image on small screens if rendering is heavy

### 13. **SplineLab.tsx** ❌ HEADER BUTTON OVERFLOW
**File:** `holo-kai/src/landing/pages/SplineLab.tsx`  
**Issue:** Fixed header with multiple buttons may not have mobile burger menu (lines 93–103 in reference)  
**Fix Required:**
- Verify header is responsive with `flex-wrap` or hamburger on mobile
- Constrain button labels or hide non-essential text on `<640px`

---

## PART C: Structural & Code Quality Issues

### 14. **Sidebar.jsx** ❌ UNUSED IMPORT
**File:** `holo-kai/src/components/core/Sidebar.jsx`  
**Line:** 4  
**Issue:** `Shield` icon imported but not used in component  
**Fix:** Remove unused import

### 15. **Panel Props Management** ⚠️ CONDITIONAL LOGIC
**File:** `holo-kai/src/pages/CivilizationCore.jsx` (lines 127–146)  
**Issue:** Panel props are conditionally built based on `view` state, but not all panels receive props they might need  
**Improvement:** 
- Document expected props for each panel
- Consider prop spreading pattern or HOC wrapper
- Ensure consistent error handling if props are missing

### 16. **Global Scroll Behavior** ⚠️ PARTICLES CANVAS
**File:** `holo-kai/src/landing/pages/Index.tsx` (lines 27–92)  
**Issue:** ParticleField creates 100+ particles, recomputes on window resize; may impact mobile performance  
**Improvement:**
- Reduce particle count on mobile: `Math.min(50, Math.floor(...))`
- Use `prefers-reduced-motion` media query to disable on demand
- Consider debouncing resize listener

---

## PART D: Performance Opportunities

### 17. **Image Lazy Loading**
**Recommendation:** Verify all images use `loading="lazy"` (observed in Index.tsx, UnitLabViewer.tsx)  
**Status:** ✓ Mostly applied; verify across all sections

### 18. **Bundle Splitting**
**File:** `holo-kai/vite.config.js` (lines 346–394)  
**Current:** Three-vendor splits for Three.js, Spline, Lucide, Framer Motion  
**Improvement:** Consider lazy-loading Spline entirely behind a route boundary to avoid loading for users who don't visit lab

### 19. **Scrollbar Styling**
**Observation:** Multiple uses of `scrollbar-thin scrollbar-none` with custom Tailwind classes  
**Recommendation:** Ensure scrollbar-thin is defined in Tailwind config; verify it works across mobile browsers

---

## PART E: Accessibility & Usability Gaps

### 20. **Touch Target Sizes**
**Issue:** Small icon buttons (e.g., Volume2 icons in VanguardUnitVoiceSelector, lines 84–85) may be <44×44px on mobile  
**Recommendation:** Ensure all interactive elements meet 44×44px minimum on mobile

### 21. **Focus States**
**Observation:** Focus rings applied with `focus-visible:ring-2 focus-visible:ring-amber-400`  
**Status:** ✓ Good; verify across all interactive elements

### 22. **Keyboard Navigation**
**File:** `holo-kai/src/landing/components/lab/UnitLabViewer.tsx` (lines 91–104)  
**Status:** ✓ Arrow keys and Escape supported; verify accessibility with screen readers

---

## Recommended Fix Priority

| Priority | Component | Issue | Effort |
|----------|-----------|-------|--------|
| **P0 - CRITICAL** | Sidebar.jsx | Mobile not hidden | 2h |
| **P0 - CRITICAL** | Index.tsx (Hero) | Text overflow, key-art on mobile | 1.5h |
| **P1 - HIGH** | OracleCorePanel.jsx | Tabs wrap on mobile | 1h |
| **P1 - HIGH** | HoloKaiVoiceOracle.jsx | Fixed height visualizer | 1h |
| **P1 - HIGH** | CivilizationCore.jsx | Layout collapse, no drawer | 2h |
| **P2 - MEDIUM** | PageShell.jsx | Header collision | 0.75h |
| **P2 - MEDIUM** | VanguardUnitVoiceSelector.jsx | Grid/card overflow | 0.5h |
| **P2 - MEDIUM** | UnitLabViewer.tsx | Button row wrapping | 0.75h |
| **P3 - LOW** | Code quality (unused imports, props) | Maintainability | 0.5h |
| **P3 - LOW** | Performance (particles, bundle split) | Optimization | 1h |

**Total Estimated Effort:** ~11 hours

---

## Testing Checklist

After applying fixes, verify:

- [ ] **Mobile (320px–480px):** All text readable, no horizontal scroll, buttons tap-friendly
- [ ] **Tablet (481px–768px):** Grids align, sidebars visible or drawer toggles, no layout shift
- [ ] **Desktop (768px+):** Original designs preserved, no regression
- [ ] **Landscape mobile:** Verify vertical space usage (especially hero section)
- [ ] **Dark mode:** Contrast remains adequate (AA or AAA for small text)
- [ ] **Keyboard navigation:** Tab order logical, focus visible
- [ ] **Touch performance:** No jank on particle canvas or 3D lab
- [ ] **Network throttle (3G):** Images load progressively, no blocking renders

---

## Next Steps

1. **Fix P0 issues first** (Sidebar, Hero text overflow)
2. **Apply responsive grid fixes** to anatomy/vanguard sections
3. **Add mobile drawer state management** to CivilizationCore
4. **Test on real devices** (not just DevTools)
5. **Profile performance** on mid-range Android devices
6. **Document breakpoint strategy** in AGENTS.md or new RESPONSIVE.md

---

**Audit conducted by:** Copilot (@copilot)  
**Repository:** FeexSystems/HoloKai-Systems-  
**Commit:** 0c6570d6653dacae18ab8ab98928e0d66e774e9e
