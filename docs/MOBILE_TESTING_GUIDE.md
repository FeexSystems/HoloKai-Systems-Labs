# Mobile Viewport Testing Guide
**Last Updated:** August 2, 2026  
**Scope:** HoloKai Systems - Landing Page + Civilization Core  
**Target Devices:** 320px – 1920px viewports

---

## 📱 Test Device Profiles

### Small Mobile (320px–375px)
- iPhone SE (2nd Gen): 375×667
- iPhone 12 mini: 375×812
- Samsung Galaxy A12: 360×800
- **Testing Focus:** Text overflow, button stacking, sidebar behavior

### Standard Mobile (376px–480px)
- iPhone 12/13: 390×844
- Pixel 5/6: 393×851
- OnePlus 9: 412×915
- **Testing Focus:** Hero typography, navigation tabs, visualizer scaling

### Tablet (481px–1024px)
- iPad (7th Gen): 768×1024
- iPad Air: 820×1180
- Samsung Galaxy Tab S6: 800×1280
- **Testing Focus:** Multi-column layouts, sidebar drawer, responsive grids

### Desktop (1025px+)
- MacBook Air: 1440×900
- Windows Desktop: 1920×1080
- 4K Monitor: 2560×1440
- **Testing Focus:** Full-width content, animation performance, multi-panel views

---

## 🧪 Testing Environment Setup

### Browser DevTools
```
Chrome/Edge:
1. Press F12 to open DevTools
2. Click device toolbar icon (⌱📱)
3. Select device from dropdown or enter custom dimensions
4. Test orientation: Portrait → Landscape

Firefox:
1. Press Ctrl+Shift+M (responsive design mode)
2. Enter custom dimensions in top-left
3. Test at 320px, 375px, 480px, 768px, 1024px

Safari (macOS):
1. Develop → Enter Responsive Design Mode
2. Select device or custom size
```

### Real Device Testing
Use physical devices when possible (DevTools can be misleading):
- **Network:** Test on 4G/LTE (Chrome DevTools: Throttle → Slow 4G)
- **Touch:** Test touch interactions, swipe, scroll
- **Orientation:** Rotate device to test landscape mode
- **Gesture:** Long-press, double-tap, pinch-zoom

### Performance Profiling
```javascript
// Console: Measure paint timing
performance.mark('start');
// ... perform action ...
performance.mark('end');
performance.measure('action', 'start', 'end');
console.log(performance.getEntriesByName('action')[0].duration);

// Check for layout thrashing
// Open DevTools → Performance tab → Record → Perform action → Stop
// Look for long purple bars (rendering) or red triangles (performance issues)
```

---

## ✅ Landing Page Tests

### Hero Section (Index.tsx)

#### 320px Viewport (Portrait)
- [ ] Heading text: `text-3xl` (no overflow)
- [ ] Subheading visible and readable
- [ ] CTA buttons stack vertically (`flex-col`)
- [ ] Button width: `w-full` (edge-to-edge with padding)
- [ ] Key-art container: hidden (no visible decorative elements)
- [ ] No horizontal scroll
- [ ] Stats row (bottom): 3×1 grid stacks to 1 column

**Expected Layout:**
```
┌─ HERO SECTION ──────────┐
│                         │
│ Where Civilization      │
│ Remembers.              │
│                         │
│ [ENTER 3D LAB]          │
│ [CIVILIZATION CORE]     │
│                         │
│ 08 · Humanoid units     │
│ 4.29M · Knowledge nodes │
│ 2000+ · Languages       │
└─────────────────────────┘
```

#### 480px Viewport (Portrait)
- [ ] Heading text: `text-5xl` (readable, no overflow)
- [ ] Gradient subtext maintains color
- [ ] Buttons: still stacked or side-by-side (verify at sm: breakpoint)
- [ ] Key-art: hidden
- [ ] No horizontal scroll
- [ ] Touch targets ≥44×44px (button height: py-4 = 16px + content = ~48px ✓)

#### 768px Viewport (Tablet, Portrait)
- [ ] Heading text: `text-6xl` (full hero scale)
- [ ] Hero + key-art: 2-column layout appears (`lg:col-span-5`)
- [ ] Buttons: horizontal row (`flex-row`)
- [ ] Key-art visible: orbital/decorative elements render
- [ ] No layout shifts
- [ ] Stats grid: 3-column layout

#### 1024px+ Viewport (Desktop)
- [ ] Full hero section rendered
- [ ] Key-art: large decorative elements
- [ ] Animation: orbital elements animate smoothly (≥60 FPS)
- [ ] Multi-panel layout: no crowding
- [ ] Responsive spacing maintained

---

### Anatomy Section (AnatomySection.tsx)

#### 320px–480px Viewport
- [ ] Section title: `text-5xl sm:text-7xl` (readable)
- [ ] Stats grid: `grid-cols-2` layout (2 stats per row)
- [ ] System selector buttons: stack vertically
- [ ] 3D preview: responsive dimensions
  - Width: 48×48px on 320px → 64×64px on 480px
- [ ] Specs list: wraps without overflow

**Test Spec Tags:**
```
✓ Hyperspectral eyes
✓ Spatial audio mesh
✓ Haptic epidermis
(wraps to next line if needed)
```

#### 768px–1024px Viewport
- [ ] 2-column layout: systems (left) + preview (right)
- [ ] Preview: `md:min-h-[420px]`
- [ ] Full system grid below: `md:grid-cols-2`

#### 1024px+ Viewport
- [ ] 12-column grid layout
- [ ] Preview: `xl:min-h-[480px]`
- [ ] System grid: `xl:grid-cols-3` (3 cards per row)

**Performance Check:**
- [ ] Lazy-loaded LabCanvas loads in <2s
- [ ] No jank on scroll
- [ ] Suspense fallback visible briefly (LOADING HUMANOID PREVIEW)

---

### MeetTheVanguard Section

#### Video Card (CollectiveVideoCard)
- [ ] 320px: full-width video, aspect-video maintained
- [ ] Play button: centered, visible overlay
- [ ] Caption text: readable, no truncation
- [ ] On hover: play button opacity changes (desktop)

**Test Actions:**
1. Click play button
2. Verify video plays (or error handling if video fails)
3. Check audio/mute state

#### Image Gallery
- [ ] 320px: single-column layout (`md:grid-cols-2` → 1 col on mobile)
- [ ] Image hover: `group-hover:scale-105` (desktop only)
- [ ] Lightbox opens on click
- [ ] Lightbox: max-h-[88vh] max-w-full (no overflow)

**Lightbox Test:**
```
1. Click any gallery image
2. Verify modal opens with backdrop blur
3. Image centered and constrained
4. Click CLOSE button → modal closes
5. Click backdrop → modal closes
6. Press Escape key → modal closes
```

---

## 🎯 Civilization Core Tests

### Sidebar (Mobile Drawer)

#### 320px–767px Viewport
- [ ] Sidebar: hidden (`hidden lg:flex`)
- [ ] Hamburger menu visible in header
- [ ] Hamburger icon: Menu (☰) when sidebar closed
- [ ] Click hamburger: sidebar slides in from left
- [ ] Hamburger icon: X (✕) when sidebar open
- [ ] Click X: sidebar slides out
- [ ] Backdrop: semi-transparent (bg-black/50) visible behind sidebar
- [ ] Click backdrop: sidebar closes
- [ ] Press Escape: sidebar closes
- [ ] Sidebar width: 240px (w-60) takes up 2/3 on mobile (240 ÷ 360 ≈ 67%)

**Visual Test:**
```
CLOSED STATE (320px):
┌──────────────────────┐
│ ☰  Page Header   🔍  │  ← Hamburger on left
├──────────────────────┤
│  Main Content Area   │
│  (Full Width)        │
└──────────────────────┘

OPEN STATE (320px):
┌──────────────┬──────────────────┐
│   Sidebar    │     Backdrop     │
│              │  (Click to close)│
│ • Oracle ... │      Content     │
│ • Archiv ... │     Behind       │
│ • 3D Gall... │                  │
└──────────────┴──────────────────┘
```

#### 768px+ Viewport (Tablet/Desktop)
- [ ] Sidebar: always visible (`lg:flex`)
- [ ] Hamburger menu: hidden
- [ ] Sidebar + main content: side-by-side layout
- [ ] No backdrop overlay
- [ ] Toggle button still functional (optional on desktop)

---

### Header (ShellHeader)

#### 320px Viewport
- [ ] Hamburger button: visible, clickable
- [ ] Logo: max-h-7 (28px) or h-5 (20px)
- [ ] Page title: truncated if needed (text-sm, truncate)
- [ ] No text collision
- [ ] Header height: ≤56px

#### 480px Viewport
- [ ] Header elements slightly more spaced
- [ ] Logo: h-5 or h-6
- [ ] Title: readable without truncation (if room)

#### 768px+ Viewport
- [ ] Full header layout
- [ ] Logo: h-6 or h-7
- [ ] Search bar: visible (if implemented)

---

### OracleCorePanel Tabs

#### 320px Viewport
- [ ] 6 tabs in horizontal scroll container
- [ ] No vertical wrapping
- [ ] Smooth horizontal scroll (swipe-able)
- [ ] Active tab: underline indicator visible
- [ ] All tabs clickable and responsive
- [ ] Tab labels: abbreviated if needed (e.g., "Voice" not "Voice Synthesis")

**Tab List Test:**
```
Expected visible (partial scroll):
[Voice Synthesis│Wolfram Compute│Gemini Chatbot│ ➜
                 ↑ Swipe right for more
```

#### 480px Viewport
- [ ] More tabs visible without scroll
- [ ] Scroll still works if needed

#### 768px+ Viewport
- [ ] All 6 tabs visible without scroll
- [ ] Horizontal scroll disabled (or unnecessary)

---

### Visualizer (HoloKaiVoiceOracle)

#### 320px Viewport
- [ ] Visualizer: w-48 h-48 (192×192px)
- [ ] Centered in viewport
- [ ] No overflow or clipping
- [ ] Lower controls (query bar, buttons) accessible below

#### 480px Viewport
- [ ] Visualizer: w-64 h-64 (256×256px)
- [ ] Still centered, no overflow
- [ ] Animation: smooth, no stuttering (60 FPS)

#### 768px+ Viewport
- [ ] Visualizer: w-80 h-80 (320×320px)
- [ ] Full responsive layout
- [ ] Animation: optimal performance

**Animation Performance Test:**
```javascript
// In Chrome DevTools Console:
(async () => {
  const fps = [];
  let lastTime = performance.now();
  const checkFPS = () => {
    const now = performance.now();
    fps.push(1000 / (now - lastTime));
    lastTime = now;
    if (fps.length < 60) requestAnimationFrame(checkFPS);
    else console.log('Average FPS:', Math.round(fps.reduce((a,b)=>a+b)/fps.length));
  };
  checkFPS();
})();
```

---

### Panel Transitions

#### Navigation Test
```
1. Start on Oracle Panel
2. Click "Archive" in sidebar
3. Panel transitions (fade/slide animation)
4. Archive panel renders
5. No layout shift
6. Back button works

Repeat for: Archive → 3D Gallery → Timeline → Map
```

#### Keyboard Navigation
- [ ] Tab key cycles through focusable elements
- [ ] Shift+Tab reverses focus order
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/drawers
- [ ] Cmd+K (or Ctrl+K) opens search palette

---

## 🔧 Responsive Breakpoint Tests

### Tailwind Breakpoints
```
sm:  640px   (tablet start)
md:  768px   (tablet, landscape phone)
lg:  1024px  (desktop start, sidebar visible)
xl:  1280px  (large desktop)
2xl: 1536px  (ultra-wide)
```

### Critical Breakpoint Tests
Test these viewport widths explicitly:

| Viewport | Device | Test Focus |
|----------|--------|-----------|
| 320px | iPhone SE | Text overflow, button stacking |
| 375px | iPhone 12 mini | Hero layout, tabs |
| 480px | Pixel 5 | Typography scaling, visualizer |
| 640px | iPad mini | sm: breakpoint activation |
| 768px | iPad | lg: sidebar appears, key-art hidden |
| 1024px | iPad Pro | Desktop layout, full animation |
| 1440px | MacBook | Large monitor layout |
| 1920px | Full HD | Ultra-wide spacing |

**Resize Test Protocol:**
1. Open DevTools responsive mode
2. Set width to 320px
3. Verify: hamburger visible, sidebar hidden
4. Resize to 768px (watch for layout shift)
5. Verify: hamburger hidden, sidebar visible
6. Resize to 1440px
7. Verify: all elements at maximum comfortable size

---

## 🎨 Visual Regression Tests

### Color & Contrast
- [ ] Hero gradient: amber-100 → amber-400 → amber-700 (readable)
- [ ] Text on dark backgrounds: ≥4.5:1 contrast ratio
  - Use: https://webaim.org/resources/contrastchecker/
- [ ] Focus states: yellow/amber outline visible
- [ ] Hover states: color change noticeable

### Typography
- [ ] Font sizes: Readable at 16px (base text size)
- [ ] Line height: Minimum 1.5 for body text
- [ ] Letter spacing: Monospace headers maintain tracking
- [ ] Truncation: Text truncates with ellipsis (not cut off)

### Spacing & Alignment
- [ ] Padding: Consistent on mobile (px-6 = 24px, often acceptable minimum)
- [ ] Margins: Vertical rhythm maintained (gap-3, gap-4, gap-6)
- [ ] Alignment: Elements center/left/right as expected
- [ ] Grid gaps: Responsive (gap-2 sm:gap-4)

---

## 🚀 Performance Testing

### Lighthouse Mobile Score
Target: **≥85 Performance**

```
1. Open Chrome DevTools → Lighthouse
2. Select "Mobile"
3. Run audit
4. Review metrics:
   - First Contentful Paint (FCP): <3s ✓
   - Largest Contentful Paint (LCP): <4s ✓
   - Cumulative Layout Shift (CLS): <0.1 ✓
   - Time to Interactive (TTI): <5s ✓
```

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): <2.5s (green)
- [ ] FID (First Input Delay): <100ms (green)
- [ ] CLS (Cumulative Layout Shift): <0.1 (green)

Check at: https://pagespeed.web.dev/

### Network Throttling Test
```
Chrome DevTools → Network tab:
1. Select "Slow 4G" throttle
2. Reload page
3. Verify load time: <7s (acceptable for 4G)
4. Check missing assets (304 vs 200 status codes)
5. Verify lazy-loaded images load on scroll
```

---

## ♿ Accessibility Testing

### Keyboard Navigation
- [ ] All buttons focusable (Tab key)
- [ ] Focus indicator visible (yellow/amber ring)
- [ ] Link underlines visible or announced
- [ ] Form inputs have labels or aria-labels
- [ ] Escape key closes modals/drawers

**Test Command:**
```
1. Remove mouse/trackpad
2. Navigate page with Tab, Enter, Escape, Arrow keys
3. Verify all interactive elements reachable
4. Check focus order (logical, top-to-bottom)
```

### Screen Reader Testing (NVDA, JAWS, VoiceOver)
- [ ] Page title announced
- [ ] Heading hierarchy correct (h1 → h2 → h3, no skipping)
- [ ] Images have alt text
- [ ] Buttons have descriptive labels
- [ ] Form fields labeled
- [ ] Live regions announced (if applicable)

**macOS VoiceOver Test:**
```
Cmd + F5 to enable VoiceOver
VO = Control + Option (default)
VO + Right Arrow = next element
VO + Space = activate button
VO + U = rotor (navigate headings/links/forms)
Cmd + F5 to disable
```

### Touch Target Sizes
- [ ] Buttons: minimum 44×44px (typical: 48×48px)
- [ ] Links: minimum 44×44px
- [ ] Form inputs: ≥48px tall
- [ ] Spacing between targets: ≥8px

**Measure in DevTools:**
```
1. Right-click element → Inspect
2. Hover over element in Elements panel
3. Look for purple highlight dimensions
4. Verify: width ≥44px, height ≥44px
```

### Zoom & Text Scaling
- [ ] Zoom to 200%: page remains usable, no horizontal scroll
- [ ] Zoom to 400%: text readable, layout adapts
- [ ] Browser text size: increase to 200% (Settings → Appearance → Font size)
- [ ] Content reflows without breaking

---

## 🐛 Common Issues & Fixes

### Issue: Text Overflow on Mobile
**Symptom:** Hero heading spills beyond viewport edge
**Check:**
```tsx
// ❌ Wrong: Fixed text size
<h1 className="text-6xl">...</h1>

// ✓ Correct: Responsive text size
<h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl">...</h1>
```

### Issue: Sidebar Covers Content
**Symptom:** Content unreadable when sidebar open on mobile
**Check:**
```tsx
// ✓ Should have backdrop overlay
{isMobile && !sidebarCollapsed && (
  <div className="fixed inset-0 bg-black/50 z-20" />
)}
```

### Issue: Tabs Wrap on Mobile
**Symptom:** Tab navigation occupies 50%+ of viewport height
**Check:**
```jsx
// ❌ Wrong: allows wrapping
<div className="flex flex-wrap gap-2">

// ✓ Correct: horizontal scroll
<div className="flex flex-nowrap overflow-x-auto scrollbar-none">
```

### Issue: Animation Jank
**Symptom:** Visualizer or transitions stutter/lag on mobile
**Check:**
```javascript
// Profile in DevTools → Performance tab
// Look for:
// - Long yellow bars (JS execution)
// - Long purple bars (rendering)
// - Red triangles (performance issues)

// Fix: Use will-change, reduce particles, optimize redraws
<div className="will-change-transform">
  {/* animated content */}
</div>
```

### Issue: Images Too Large
**Symptom:** Images don't load or take >2s to display
**Check:**
```jsx
// ✓ Use responsive images
<img 
  src={image.src}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
/>

// ✓ Compress images: <100KB for mobile hero
// Use WebP format (fallback to JPG)
```

---

## 📝 Test Report Template

```markdown
## Mobile Test Report
**Date:** [DATE]
**Tester:** [NAME]
**Device:** [iPhone 12 / Pixel 5 / iPad / etc.]
**Browser:** [Chrome / Safari / Firefox]
**Viewport:** [375px × 667px]
**Network:** [WiFi / 4G LTE / Slow 4G]

### Pass/Fail Summary
- [ ] Hero section responsive: **PASS**
- [ ] Sidebar drawer: **PASS**
- [ ] Tab scroll: **PASS**
- [ ] Navigation: **PASS**
- [ ] Performance: **PASS** (LCP: 2.1s)

### Issues Found
1. **Issue:** Text overflow on 320px
   **Expected:** text-3xl, wrapping text
   **Actual:** text-6xl, spillover
   **Severity:** P0
   **Fix:** Apply responsive breakpoints

2. **Issue:** Visualizer animation stutters
   **Expected:** 60 FPS smooth animation
   **Actual:** ~30 FPS, visible jank
   **Severity:** P1
   **Fix:** Profile and optimize

### Accessibility
- Keyboard navigation: **PASS**
- Screen reader: **PASS** (tested with NVDA)
- Touch targets: **PASS** (all ≥44×44px)
- Contrast: **PASS** (all ≥4.5:1)

### Sign-Off
✓ Ready for deployment
```

---

## 🔄 Continuous Testing Checklist

### Before Each Commit
- [ ] Test at 3 breakpoints: 320px, 768px, 1024px
- [ ] No console errors (F12 → Console tab)
- [ ] No layout shifts (DevTools → Rendering → Paint flashing)
- [ ] Responsive classes applied: `hidden lg:flex`, `text-sm sm:text-lg`, etc.

### Before Pull Request
- [ ] Full mobile device testing (real device if possible)
- [ ] Lighthouse audit: ≥85 Performance
- [ ] Accessibility audit: PASS
- [ ] No regressions in other components
- [ ] Git: clean commit history, descriptive messages

### Before Production Deployment
- [ ] All P0/P1 tests passing
- [ ] Performance budget met
- [ ] Cross-browser testing: Chrome, Safari, Firefox
- [ ] Real device testing: iOS, Android
- [ ] Staging environment deployed + verified
- [ ] Rollback plan documented

---

**Document Version:** 1.0  
**Last Updated:** August 2, 2026  
**Maintained By:** FeexSystems Labs  

For questions or updates, refer to `IMPLEMENTATION_GUIDE_P0_P1.md`
