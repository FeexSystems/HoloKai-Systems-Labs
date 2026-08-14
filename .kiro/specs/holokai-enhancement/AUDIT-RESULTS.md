# HoloKai Branding Audit - Results

## Executive Summary

**Status**: Brand assets ready, but legacy color references need migration

**Brand Assets**: ✅ ALL 4 REQUIRED ASSETS PRESENT
- `apps/shell/public/logos/holokai-favicon.ico`
- `apps/shell/public/logos/holokai-logo-3d.jpg`
- `apps/shell/public/logos/holokai-logo-horizontal.jpg`
- `apps/shell/public/logos/holokai-logo-vertical.jpg`

**Issues Found**: Amber/gold color references in UI components that need migration

---

## Audit Results

### 1. Brand Assets ✅
```
apps/shell/public/logos/
├── holokai-favicon.ico ✅
├── holokai-logo-3d.jpg ✅
├── holokai-logo-horizontal.jpg ✅
└── holokai-logo-vertical.jpg ✅
```

**Status**: All required assets are present and ready to use.

---

### 2. Color Palette Migration Required ⚠️

**Found Amber/Gold References**: In `packages/ui/src/` components

**Files with amber- references**:
1. `packages/ui/src/primitives/Text.tsx` - gold color variant
2. `packages/ui/src/primitives/Switch.tsx` - amber focus ring
3. `packages/ui/src/primitives/Select.tsx` - amber focus ring
4. `packages/ui/src/primitives/RadioGroup.tsx` - amber selected state
5. `packages/ui/src/primitives/Checkbox.tsx` - amber checked state
6. `packages/ui/src/primitives/Box.tsx` - gold border variant
7. `packages/ui/src/primitives/Avatar.tsx` - amber border and text
8. `packages/ui/src/navigation/Launchpad.tsx` - amber borders, focus rings, icons
9. `packages/ui/src/navigation/GlobalFooter.tsx` - amber border
10. `packages/ui/src/spatial/CyberMannequinViewer.tsx` - amber borders, text

**Migration Required**: Replace `amber-` with semantic tokens:

| Current | Target Semantic Token |
|---------|----------------------|
| `amber-400` | `var(--color-brand)` (Teal Bright: #79B59F) |
| `amber-500` | `var(--color-border)` or `var(--color-brand)` |
| `amber-500/20` | `var(--color-border)/0.25` |
| `amber-500/30` | `var(--color-border)/0.3` |
| `amber-500/40` | `var(--color-border)/0.4` |
| `amber-500/50` | `var(--color-border)/0.5` |
| `amber-500/60` | `var(--color-border)/0.6` |
| `text-amber-300` | `text-[var(--color-brand)]` |
| `text-amber-400` | `text-[var(--color-brand)]` |
| `bg-amber-500/5` | `bg-[var(--color-brand)]/5` |
| `bg-amber-500/10` | `bg-[var(--color-brand)]/10` |
| `bg-amber-500/15` | `bg-[var(--color-brand)]/15` |

---

### 3. Semantic Token Verification ✅

**Design Tokens Already Correct**:
- `--color-brand`: Teal Bright (#79B59F) ✅
- `--color-surface`: Dark surface colors ✅
- `--color-border`: Border opacity tokens ✅
- `--color-surface-hover`: Hover states ✅
- `--font-display`: Cinzel, Playfair Display ✅
- `--font-sans`: Inter ✅

---

### 4. Application Structure ✅

All 7 required apps present:
- `apps/shell` ✅
- `apps/web-home` ✅
- `apps/web-cart` ✅
- `apps/web-oracle` ✅
- `apps/web-research` ✅
- `apps/web-archive` ✅
- `apps/bff` ✅

---

## Audit Conclusion

### What's Ready ✅
- All brand assets exist in `apps/shell/public/logos/`
- Design tokens properly configured with Obsidian/Forest/Teal palette
- All 7 apps exist with correct structure
- Semantic tokens documented and available

### What Needs Work ⚠️
- Migrate 10 files with amber/gold color references to semantic tokens
- Update Launchpad component specifically (most complex, high-impact)
- Verify GlobalFooter uses HoloKai branding

---

## Action Plan

### Priority 1: Brand Assets Integration (Task 2)
- Copy logo assets to each app's public directory
- Update favicon in all 7 apps
- Update meta tags with HoloKai branding

### Priority 2: Color Migration (Task 7)
- Migrate Text.tsx, Switch.tsx, Select.tsx, RadioGroup.tsx, Checkbox.tsx, Box.tsx, Avatar.tsx
- Migrate Launchpad.tsx (most complex)
- Migrate GlobalFooter.tsx
- Migrate CyberMannequinViewer.tsx
- Run type-check: `pnpm tsc --noEmit`

### Priority 3: Header/Footer (Tasks 4, 5)
- Create consistent header with HoloKai logo
- Create consistent footer with branding

---

## Next Steps

1. ✅ Audit complete - document ready
2. Start Task 2: Extract HoloKai brand assets
3. Start Task 7: Verify color palette complete
4. Begin Color Migration spec

**Estimated Effort**: 2-3 days for complete branding integration

---

*Audit Date*: 2026-08-11  
*Auditor*: Kiro Orchestrator  
*Status*: Ready for implementation

