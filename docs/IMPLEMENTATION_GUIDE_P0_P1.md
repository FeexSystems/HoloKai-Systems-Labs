# P0 & P1 Mobile Implementation Guide
**Status:** Ready for Development  
**Date:** August 2, 2026  
**Target Completion:** 11 hours total effort

---

## 📑 Table of Contents
1. **P0 Fixes** (Critical - 3.5h total)
   - Sidebar Responsive (2h)
   - Hero Typography & Layout (1.5h)
2. **P1 Fixes** (High Priority - 4h total)
   - OracleCorePanel Tabs (1h)
   - HoloKaiVoiceOracle Visualizer (1h)
   - CivilizationCore Layout (2h)
   - PageShell Header (0.75h)
3. **Implementation Workflow**
4. **Testing Checklist**

---

## P0.1: Sidebar Responsive Drawer Implementation

### Problem Summary
Fixed `w-60` (240px) sidebar squashes mobile content on <768px screens.

### Solution: Mobile Drawer Pattern

**Affected Files:**
- `holo-kai/src/components/core/Sidebar.jsx`
- `holo-kai/src/pages/CivilizationCore.jsx`
- `holo-kai/src/components/core/ShellHeader.jsx`
- `holo-kai/src/hooks/use-mobile.jsx` (create if missing)

### Step 1: Create Mobile Hook (if missing)

```typescript
// holo-kai/src/hooks/use-mobile.jsx
import { useEffect, useState } from 'react';

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    const handler = () => checkMobile();
    window.addEventListener('resize', handler);
    
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
}
```

### Step 2: Update Sidebar (Hide on Mobile)

```jsx
// holo-kai/src/components/core/Sidebar.jsx - Line 52 (BEFORE)
<aside className="w-60 flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/10 bg-zinc-950 text-zinc-100 z-30">

// AFTER: Add responsive classes
<aside className="hidden lg:flex w-60 flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/10 bg-zinc-950 text-zinc-100 z-30">
```

**Key Changes:**
- Add `hidden lg:flex` to hide sidebar on mobile/tablet
- Keep all existing internal styling unchanged
- No state logic changes in Sidebar itself

### Step 3: Update CivilizationCore (State + Mobile Detection)

```jsx
// holo-kai/src/pages/CivilizationCore.jsx

import { useMobile } from '@/hooks/use-mobile';
// ... existing imports ...

export default function CivilizationCore({ initialView = 'oracle' }) {
  const { activeGuardian, aiState } = useHoloKai();
  const isMobile = useMobile(768); // NEW: Mobile detection

  // Navigation View State
  const [view, setView] = useState(initialView);
  const [, setSourceToOpen] = useState(null);
  const [showLogUpdate, setShowLogUpdate] = useState(false);
  const [sourceDrawerCitation, setSourceDrawerCitation] = useState(null);

  // FX & Customization State
  const [scanlineEnabled, setScanlineEnabled] = useState(true);
  const [soundEffectsEnabled] = useState(true);
  
  // UPDATED: Auto-collapse sidebar on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);

  // NEW: Auto-sync sidebar state with mobile breakpoint
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

  // ... rest of component ...

  return (
    <div className="flex h-screen overflow-hidden relative font-sans transition-colors duration-500 bg-[#06070a] text-zinc-100 selection:bg-amber-500/20 selection:text-amber-400">
      {/* Main Sidebar Navigation */}
      {!sidebarCollapsed && (
        <Sidebar activeView={view} onNavigate={handleNavigate} />
      )}

      {/* Primary Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-500 bg-[#090a0f]">
        {/* TOP INTEGRATED HEADER */}
        <ShellHeader
          view={view}
          onNavigate={handleNavigate}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}  // NEW: Pass mobile flag
          onToggleSidebar={() => {
            if (soundEffectsEnabled) retroAudio.playClick();
            setSidebarCollapsed(!sidebarCollapsed);
          }}
          // ... rest of props ...
        />
        {/* ... rest of component ... */}
      </main>
    </div>
  );
}
```

### Step 4: Update ShellHeader (Add Hamburger Button)

```jsx
// holo-kai/src/components/core/ShellHeader.jsx

import { Menu, X } from 'lucide-react';

export default function ShellHeader({
  view,
  onNavigate,
  sidebarCollapsed,
  isMobile,  // NEW
  onToggleSidebar,
  // ... other props ...
}) {
  return (
    <header className="border-b border-white/10 bg-zinc-950 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        
        {/* NEW: Hamburger menu on mobile */}
        {isMobile && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 text-zinc-400 hover:text-white transition"
            aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
          >
            {sidebarCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Header content */}
        {/* ... existing content ... */}
      </div>
    </header>
  );
}
```

### Step 5: Add Mobile Drawer Overlay (Optional Enhancement)

```jsx
// Add after ShellHeader in CivilizationCore.jsx

{/* Mobile sidebar drawer backdrop */}
{isMobile && !sidebarCollapsed && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setSidebarCollapsed(true)}
    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
  />
)}
```

### Acceptance Checklist
- [ ] Sidebar hidden on 320px, 480px viewports
- [ ] Hamburger icon visible on mobile
- [ ] Hamburger toggles sidebar open/close
- [ ] Sidebar animations smooth (200ms)
- [ ] Escape key closes sidebar (add in ShellHeader keydown)
- [ ] Navigation items fully readable in drawer
- [ ] No horizontal scroll on any viewport
- [ ] Desktop (768px+): sidebar always visible, hamburger hidden

**Estimated Effort:** 2 hours

---

## P0.2: Hero Typography & Layout Overflow Fix

### Problem Summary
Hero headline `text-6xl+` overflows on mobile, key-art renders on small screens.

### Solution: Responsive Typography + Hidden Key-Art

**Affected File:**
- `holo-kai/src/landing/pages/Index.tsx`

### Implementation

```tsx
// holo-kai/src/landing/pages/Index.tsx - Lines 230-320

// BEFORE (Line 240-245)
<h1 className="max-w-5xl font-display text-6xl font-light leading-[0.84] tracking-[-0.045em] text-white sm:text-7xl md:text-8xl lg:text-[7.2rem]">

// AFTER: Add mobile breakpoint
<h1 className="max-w-5xl font-display text-3xl font-light leading-[0.84] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7.2rem]">
  Where Civilization
  <br />
  <span className="bg-gradient-to-r from-amber-100 via-amber-400 to-amber-700 bg-clip-text font-bold italic text-transparent">
    Remembers.
  </span>
</h1>

// BEFORE (Lines 253-276): Button row
<div className="flex gap-3">
  <button... className="border border-white/25 px-8 py-4...">
    ENTER 3D LAB
  </button>
  <button... className="border border-amber-500/40 bg-amber-500/10 px-8 py-4...">
    CIVILIZATION CORE
  </button>
</div>

// AFTER: Add responsive wrapping
<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
  <button 
    type="button"
    onClick={() => navigate("/lab-spline")}
    className="w-full sm:w-auto border border-white/25 px-8 py-4 text-xs tracking-[0.2em] text-white transition hover:bg-white/5"
  >
    ENTER 3D LAB
  </button>
  <button
    type="button"
    onClick={() => navigate("/core")}
    className="w-full sm:w-auto border border-amber-500/40 bg-amber-500/10 px-8 py-4 text-xs tracking-[0.2em] text-amber-200 transition hover:bg-amber-500/20"
  >
    CIVILIZATION CORE
  </button>
</div>

// BEFORE (Lines 290-314): Key-art showcase
<motion.div
  className="relative hidden min-h-[420px] items-center justify-center lg:col-span-5 lg:flex xl:min-h-[480px]"
>

// AFTER: Explicitly verify hidden on mobile
<motion.div
  className="relative hidden min-h-[420px] items-center justify-center lg:col-span-5 lg:flex xl:min-h-[480px]"
>
  {/* Already correct, but verify it stays */}
</motion.div>
```

### Add overflow-x-hidden to Root

```tsx
// In Index.tsx or main layout:
<div className="overflow-x-hidden">
  {/* All page content */}
</div>

// OR in global CSS (src/index.css or tailwind config)
html {
  @apply overflow-x-hidden;
}
```

### Acceptance Checklist
- [ ] Hero text: `text-3xl` (320px), `text-5xl` (480px), `text-7xl` (1024px+)
- [ ] Key-art hidden on 320px, 480px viewports
- [ ] Buttons stack vertically on mobile, horizontal on sm:
- [ ] No horizontal scroll on any viewport
- [ ] Gradient text remains visible and contrasted
- [ ] All content readable without zoom on 320px
- [ ] Tested at 320px, 375px, 480px, 768px, 1024px

**Estimated Effort:** 1.5 hours

---

## P1.1: OracleCorePanel Tabs Horizontal Scroll

### Problem Summary
6 tabs wrap into 5+ rows on mobile, occupying >40% viewport.

### Solution: Horizontal Scroll Container

**Affected File:**
- `holo-kai/src/components/core/OracleCorePanel.jsx`

### Implementation

```jsx
// holo-kai/src/components/core/OracleCorePanel.jsx - Lines 68-149

// BEFORE: flex-wrap causes vertical stacking
<motion.div 
  variants={itemVariants}
  className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3"
>
  <div className="flex items-center gap-1.5 flex-wrap">
    {/* 6 Tab Buttons */}
    {TAB_OPTIONS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => handleSelectTab(tab)}
        className="whitespace-nowrap px-4 py-2 text-sm..."
      >
        {tab.label}
      </button>
    ))}
  </div>
</motion.div>

// AFTER: Horizontal scroll container
<motion.div 
  variants={itemVariants}
  className="border-b border-white/10"
>
  <div className="flex flex-nowrap overflow-x-auto scrollbar-none pb-2 pr-2">
    {/* Tab buttons */}
    {TAB_OPTIONS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => handleSelectTab(tab)}
        className="flex-none whitespace-nowrap px-4 py-3 text-sm border-b-2 transition"
        style={{
          borderColor: active === tab.id ? '#f59e0b' : 'transparent',
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
</motion.div>
```

### Key Changes:
- Replace `flex-wrap` with `flex-nowrap`
- Add `overflow-x-auto` for horizontal scrolling
- Add `scrollbar-none` to hide scrollbar
- Add `flex-none` to tab buttons to prevent shrinking
- Add `pb-2 pr-2` for scroll gutter padding

### Acceptance Checklist
- [ ] 6 tabs fit in horizontal scroll on 320px viewport
- [ ] No vertical wrapping
- [ ] Smooth touch scroll (no jank)
- [ ] All tabs clickable
- [ ] Active tab indicator visible
- [ ] Desktop (768px+): all tabs visible without scroll

**Estimated Effort:** 1 hour

---

## P1.2: HoloKaiVoiceOracle Visualizer Responsive Scaling

### Problem Summary
Fixed `h-80 w-80` visualizer expands on mobile, pushes controls off-screen.

### Solution: Fluid Responsive Scaling

**Affected File:**
- `holo-kai/src/components/oracle/HoloKaiVoiceOracle.jsx`

### Implementation

```jsx
// Search for visualizer container with h-80 w-80 styling

// BEFORE: Fixed dimensions
<div className="relative min-h-[400px] w-80 h-80 mx-auto">
  <VoiceVisualizer unit={selectedUnit} />
</div>

// AFTER: Responsive scaling
<div className="relative mx-auto flex items-center justify-center max-w-full">
  <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
    <VoiceVisualizer unit={selectedUnit} />
  </div>
</div>

// Alternative: Apply directly to visualizer if it's a single component
<div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto">
  {/* SVG orbital visualizer */}
</div>
```

### Container Context Fix

```jsx
// Ensure parent container has proper constraints
<div className="flex flex-col items-center gap-6 max-w-full">
  {/* Visualizer */}
  <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
    {/* ... */}
  </div>

  {/* Controls below */}
  <div className="w-full max-w-xl px-4">
    {/* Query bar, buttons, etc. */}
  </div>
</div>
```

### Acceptance Checklist
- [ ] Visualizer: 48×48px on 320px, 64×64px on 640px, 80×80px on 1024px+
- [ ] No overflow on mobile devices
- [ ] Lower controls (query bar, buttons) accessible
- [ ] Animated halo animation smooth
- [ ] Animation FPS ≥60 on mobile (may need particle reduction)
- [ ] Tested at 320px, 480px, 768px, 1024px

**Estimated Effort:** 1 hour

---

## P1.3: CivilizationCore Layout + Drawer State Management

### Problem Summary
Sidebar always renders on mobile, layout collapses, no hamburger menu.

### Solution: Mobile Drawer State + Auto-Collapse
*(Covered in detail under P0.1 above)*

**Key Points:**
- Use `useMobile()` hook to detect mobile breakpoint
- Auto-collapse sidebar on initial load if mobile
- Add hamburger menu to ShellHeader
- Smooth drawer animations with Framer Motion
- Escape key handling

**Estimated Effort:** 2 hours

---

## P1.4: PageShell Header Collision Fix

### Problem Summary
Header elements collide on <380px screens (back button, logo, title).

### Solution: Responsive Flex Ordering + Hidden Labels

**Affected File:**
- `holo-kai/src/components/PageShell.jsx`

### Implementation

```jsx
// holo-kai/src/components/PageShell.jsx - Lines 37-75

// BEFORE: Fixed horizontal layout
<div className="mx-auto flex items-center justify-between gap-4 px-6 py-4">
  <Link to={backTo} className="flex items-center gap-1.5 text-[10px] font-mono shrink-0">
    <ChevronLeft className="w-3.5 h-3.5" />
    {backLabel}  {/* Always visible - causes collision */}
  </Link>
  <h2 className="text-lg font-semibold">{title}</h2>
  <Link to="/" className="shrink-0">
    <img src="..." className="h-5 md:h-6" />
  </Link>
</div>

// AFTER: Responsive wrapping + hidden labels
<div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-6 py-4">
  <Link 
    to={backTo} 
    className="flex items-center gap-1.5 text-[10px] font-mono shrink-0"
  >
    <ChevronLeft className="w-3.5 h-3.5" />
    <span className="hidden sm:inline">{backLabel}</span>
  </Link>
  
  <h2 className="text-sm sm:text-lg font-semibold min-w-0 truncate">
    {title}
  </h2>
  
  <Link to="/" className="shrink-0">
    <img 
      src="..." 
      className="h-5 sm:h-5 md:h-6 object-contain"
      alt="HoloKai logo"
    />
  </Link>
</div>
```

### Key Changes:
- `flex-col sm:flex-row` for responsive stacking
- `hidden sm:inline` to hide back label on tiny screens
- `min-w-0 truncate` on title for text overflow handling
- `gap-2 sm:gap-4` for mobile spacing
- Logo height capped at `h-5` (no md: upgrade)

### Acceptance Checklist
- [ ] Back button: icon only on <380px, label visible on ≥380px
- [ ] Logo max-height: `h-5` on all viewports
- [ ] Title truncated if needed (no collision)
- [ ] No vertical height expansion
- [ ] Header fits in 56px height max
- [ ] Tested at 320px, 360px, 380px, 480px viewports

**Estimated Effort:** 0.75 hours

---

## Implementation Workflow (Step-by-Step)

### Day 1: P0 Fixes (3.5 hours)

**1. Sidebar Mobile (2h)**
1. Create `use-mobile.jsx` hook
2. Update `Sidebar.jsx` with `hidden lg:flex`
3. Update `CivilizationCore.jsx` with mobile state sync
4. Update `ShellHeader.jsx` with hamburger button
5. Test at 320px, 768px, 1024px

**2. Hero Typography (1.5h)**
1. Update heading sizes in `Index.tsx` (line 240)
2. Add button wrapping (`flex-col sm:flex-row`)
3. Verify key-art `hidden lg:flex`
4. Add `overflow-x-hidden` to root
5. Test at 320px, 480px, 1024px

### Day 2: P1 Fixes (4 hours)

**3. OracleCorePanel Tabs (1h)**
1. Replace `flex-wrap` with `flex-nowrap`
2. Add `overflow-x-auto scrollbar-none`
3. Adjust tab styling
4. Test scroll on 320px, 480px

**4. Voice Visualizer (1h)**
1. Find and replace fixed dimensions
2. Apply `w-48 sm:w-64 md:w-80` scaling
3. Verify container constraints
4. Test animation performance

**5. CivilizationCore Layout (2h)**
1. Integrate `useMobile` hook
2. Auto-sync sidebar state
3. Add hamburger with animations
4. Escape key handling
5. Backdrop dimming
6. Test at multiple viewports

### Day 2 Afternoon: P1.4 + Testing (2 hours)

**6. PageShell Header (0.75h)**
1. Add `flex-col sm:flex-row`
2. Hide back label on mobile
3. Add title truncation
4. Test at 320px, 380px, 480px

**7. Comprehensive Testing (1.25h)**
1. Run through mobile testing guide
2. Test all P0/P1 components
3. Verify no regressions
4. Performance checks (Lighthouse)

---

## Git Workflow

```bash
# Create feature branches
git checkout -b fix/p0-sidebar-mobile
# ... implement, commit ...
git push origin fix/p0-sidebar-mobile

git checkout -b fix/p0-hero-overflow
# ... implement, commit ...
git push origin fix/p0-hero-overflow

git checkout -b fix/p1-oracle-tabs
# ... implement, commit ...
git push origin fix/p1-oracle-tabs

# After all PR approvals, merge to main
git checkout main
git pull
git merge fix/p0-sidebar-mobile
git push origin main
```

---

## Testing Checklist

### Unit/Component Testing
- [ ] Sidebar drawer opens/closes smoothly
- [ ] Hero text readable at all breakpoints
- [ ] Tabs scroll without jank
- [ ] Visualizer scales fluidly
- [ ] Page header doesn't collide

### Integration Testing
- [ ] Navigation works when sidebar toggled
- [ ] No layout shifts on breakpoint changes
- [ ] Focus management in drawer
- [ ] Keyboard navigation (Tab, Escape)

### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] Pixel 5 (393px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)

### Performance Testing
- [ ] Lighthouse Mobile: ≥85 Performance
- [ ] 3G load time: <5s
- [ ] Animation FPS: ≥60 on mobile
- [ ] No layout shift (CLS <0.1)

### Accessibility Testing
- [ ] Touch targets ≥44×44px
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Zoom at 200% without overflow

---

## Notes & Troubleshooting

### Common Issues

**Issue: Hamburger menu not appearing**
- Verify `isMobile` prop passed to ShellHeader
- Check `useMobile()` hook is working (test with console.log)
- Verify Tailwind breakpoints configured correctly

**Issue: Text still overflows on 320px**
- Check `text-3xl` is applied (not `text-6xl`)
- Verify `overflow-x-hidden` on root element
- Test with actual device (DevTools may lie)

**Issue: Sidebar drawer doesn't close on Escape**
- Add keydown handler to CivilizationCore
- Check `setSidebarCollapsed(true)` is called
- Verify event.key === 'Escape'

**Issue: Animation jank on drawer toggle**
- Reduce animation duration (try 300ms instead of 500ms)
- Check for layout thrashing (avoid rapid reflows)
- Profile with DevTools Performance tab

---

**Estimate Total:** 11 hours  
**Ready to Start:** August 2, 2026  
**Target Completion:** August 4, 2026
