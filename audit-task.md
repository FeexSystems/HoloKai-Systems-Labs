# HoloKai Cinematic Upgrade — Amber/Gold Replacement Audit

**Search scope:** `packages/ui/src/**`
**Patterns searched:** `amber-`, `#f59e0b`, `#e8b84b`, `rgba(200,149,42`, `rgba(245,158,11`
**Files with hits:** 15

---

## Replacement Token Reference

| Legacy Pattern | Recommended Token |
|----------------|-------------------|
| `text-amber-*` | `text-[var(--color-brand)]` |
| `border-amber-*` | `border-[var(--color-border)]` or `border-[var(--color-border-strong)]` |
| `bg-amber-*` | `bg-[var(--color-surface-hover)]` or `bg-[var(--color-brand)]` |
| `from-amber-*` | `from-[var(--pui-forest-active)]` |
| `via-amber-*` | `via-[var(--pui-teal-bright)]` |
| `to-amber-*` | `to-[var(--pui-forest-deep)]` |
| `shadow-[..rgba(245,158,11..]` | `shadow-glow-brand` or `shadow-glow-active` |
| `#f59e0b` / `#e8b84b` (canvas hex) | `#A9D5B0` (moss-bright) or `#39826F` (teal-bright) |
| `rgba(200,149,42,...)` / `rgba(245,158,11,...)` | `rgba(143,175,145,...)` (muted moss) |

---


## File: packages/ui/src/components/ProductCard.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 37 | `border-amber-500/50` (featured border) | `border-[var(--color-border-strong)]` |
| 37 | `shadow-[0_0_30px_rgba(245,158,11,0.15)]` (featured glow) | `shadow-glow-brand` |
| 55 | `text-amber-500` (price display) | `text-[var(--color-brand)]` |
| 57 | `text-amber-500` (star rating icon) | `text-[var(--color-brand)]` |

---

## File: packages/ui/src/components/SubscriptionCard.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 43 | `from-rose-500 to-amber-500` (badge gradient) | `from-[var(--pui-teal-bright)] to-[var(--pui-moss-bright)]` |
| 68 | `text-amber-500` (Check icon color in feature list) | `text-[var(--color-brand)]` |

> **Note:** `border-rose-500/50` and `shadow-[0_0_30px_rgba(243,24,96,0.15)]` are rose-based, not amber.
> They are included in Task 6 scope but were not flagged by this amber-only audit.

---

## File: packages/ui/src/components/ResearchLogCard.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 22 | `hover:border-amber-500/30` | `hover:border-[var(--color-border)]` |
| 24 | `text-amber-500` (card title) | `text-[var(--color-brand)]` |

---

## File: packages/ui/src/components/PricingCard.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 27 | `border-amber-500/50` (featured card border) | `border-[var(--color-border-strong)]` |
| 27 | `bg-gradient-to-b from-amber-500/10` (featured bg gradient) | `from-[var(--pui-forest-active)]/10` |
| 27 | `shadow-2xl shadow-amber-500/15` | `shadow-2xl shadow-glow-brand` |
| 27 | `hover:-translate-y-1` — keep as-is | — |
| 28 | `border-amber-500/20` (non-featured border) | `border-[var(--color-border)]` |
| 28 | `hover:border-amber-500/40` | `hover:border-[var(--color-border-strong)]` |
| 40 | `rgba(200,149,42,0.12)` (shimmer gradient start) | `rgba(143,175,145,0.12)` |
| 40 | `rgba(200,149,42,0.06)` (shimmer gradient end) | `rgba(143,175,145,0.06)` |
| 47 | `bg-amber-500 text-black` (badge pill) | `bg-[var(--color-brand)] text-black` |
| 53 | `text-xs font-mono text-amber-400` (tier name label) | `text-[var(--color-brand)]` |
| 69 | `text-amber-400` (SVG checkmark icon) | `text-[var(--color-brand)]` |
| 79 | `from-amber-500 to-amber-600` (featured CTA button) | `from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)]` |
| 79 | `shadow-amber-500/30` (CTA button shadow) | `shadow-glow-brand` |
| 80 | `border-amber-500/30` (non-featured CTA border) | `border-[var(--color-border)]` |
| 80 | `text-amber-400` (non-featured CTA text) | `text-[var(--color-brand)]` |
| 80 | `hover:bg-amber-500/10` | `hover:bg-[var(--color-surface-hover)]` |
| 80 | `hover:border-amber-500/50` | `hover:border-[var(--color-border-strong)]` |

---

## File: packages/ui/src/components/GlassPanel.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 13 | `variant === 'amber'` → `border-amber-500/20 bg-[#12121a]/90` | `border-[var(--color-border)] bg-[#12121a]/90` |
| 21 | `shadow-[0_0_30px_rgba(245,158,11,0.15)]` (glow prop) | `shadow-glow-brand` |

---

## File: packages/ui/src/navigation/GlobalHeader.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 63 | `from-amber-600 via-amber-500 to-amber-700` (announcement bar gradient) | `from-[var(--pui-forest-active)] via-[var(--pui-teal-bright)] to-[var(--pui-forest-deep)]` |
| 63 | `border-amber-400/30` (announcement bar border) | `border-[var(--color-border)]` |
| 65 | `text-amber-300` (version badge text) | `text-[var(--color-brand)]` |
| 72 | `border-amber-500/20` (main header border) | `border-[var(--color-border)]` |
| 79 | `from-amber-400 via-amber-600 to-amber-800` (logo gradient) | `from-[var(--pui-moss-bright)] via-[var(--pui-teal-bright)] to-[var(--pui-forest-active)]` |
| 79 | `shadow-amber-500/20` (logo shadow) | `shadow-glow-subtle` |
| 81 | `text-amber-400` (logo inner text) | `text-[var(--color-brand)]` |
| 84 | `group-hover:text-amber-300` (brand name hover) | `group-hover:text-[var(--color-brand)]` |
| 86 | `text-amber-400/90` (subtitle text) | `text-[var(--color-brand)]` |
| 91 | `border-amber-500/20` (nav pill border) | `border-[var(--color-border)]` |
| 93 | `bg-amber-500 text-black` (active MegaMenu trigger) | `bg-[var(--color-brand)] text-black` |
| 93 | `text-amber-300` (inactive MegaMenu trigger) | `text-[var(--color-brand)]` |
| 102 | `from-amber-500 to-amber-600` (active nav pill gradient) | `from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)]` |
| 115 | `border-amber-500/30` (search button border) | `border-[var(--color-border)]` |
| 115 | `text-amber-400` (search button text) | `text-[var(--color-brand)]` |
| 115 | `hover:border-amber-500/50` | `hover:border-[var(--color-border-strong)]` |
| 117 | `border-amber-500/30` (keyboard shortcut border) | `border-[var(--color-border)]` |
| 130 | `bg-amber-500 text-black` (cart badge) | `bg-[var(--color-brand)] text-black` |
| 134 | `from-amber-500 to-amber-600` (account button gradient) | `from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)]` |
| 153 | `border-amber-500/20` (mobile drawer border) | `border-[var(--color-border)]` |
| 160 | `border-amber-500/30` (mobile search button border) | `border-[var(--color-border)]` |
| 160 | `text-amber-400` (mobile search button text) | `text-[var(--color-brand)]` |
| 164 | `bg-amber-500` (mobile account button) | `bg-[var(--color-brand)]` |

---

## File: packages/ui/src/navigation/MegaMenu.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 73 | `border-amber-500/30` (panel bottom border) | `border-[var(--color-border)]` |
| 79 | `text-amber-400` (sidebar section label) | `text-[var(--color-brand)]` |
| 85 | `text-amber-300` (active category text) | `text-[var(--color-brand)]` |
| 91 | `bg-amber-500/20 border border-amber-500/30` (active category highlight `layoutId` span) | `bg-[var(--color-surface-hover)] border border-[var(--color-border)]` |
| 112 | `hover:border-amber-500/30` (item card hover border) | `hover:border-[var(--color-border)]` |
| 113 | `group-hover:text-amber-300` (item title hover color) | `group-hover:text-[var(--color-brand)]` |
| 116 | `bg-amber-500/20 text-amber-400` (item badge pill) | `bg-[var(--color-surface-hover)] text-[var(--color-brand)]` |
| 127 | `border-amber-500/30` (featured card border) | `border-[var(--color-border)]` |
| 132 | `text-amber-400` (featured card eyebrow label) | `text-[var(--color-brand)]` |
| 133 | `text-amber-200` (featured card heading) | `text-[var(--color-brand)]` |
| 137 | `text-amber-400 hover:text-amber-300` (explore link) | `text-[var(--color-brand)] hover:text-[var(--color-brand)]` |

---

## File: packages/ui/src/navigation/CommandBar.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 101 | `border-amber-500/30` (dialog panel border) | `border-[var(--color-border)]` |
| 103 | `text-amber-400` (`⌘K` label) | `text-[var(--color-brand)]` |
| 126 | `hover:bg-amber-500/10 hover:border-amber-500/20` (item hover) | `hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border)]` |
| 129 | `text-amber-400` (category badge text) | `text-[var(--color-brand)]` |
| 129 | `border-amber-500/20` (category badge border) | `border-[var(--color-border)]` |
| 131 | `group-hover:text-amber-300` (item title hover) | `group-hover:text-[var(--color-brand)]` |
| 135 | `group-hover:text-amber-400` (shortcut hover) | `group-hover:text-[var(--color-brand)]` |

---

## File: packages/ui/src/navigation/GlobalFooter.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 7 | `border-amber-500/20` (footer top border) | `border-[var(--color-border)]` |
| 13 | `from-amber-500 to-amber-300` (logo gradient) | `from-[var(--pui-moss-bright)] to-[var(--pui-teal-bright)]` |
| 13 | `shadow-amber-500/20` (logo shadow) | `shadow-glow-subtle` |
| 23 | `text-amber-400` (status/version label) | `text-[var(--color-brand)]` |
| 31 | `text-amber-400` (Research OS column heading) | `text-[var(--color-brand)]` |
| 45 | `text-amber-400` (Institution column heading) | `text-[var(--color-brand)]` |
| 58 | `text-amber-400` (Governance column heading) | `text-[var(--color-brand)]` |
| 75 | `hover:text-amber-400` (GitHub link hover) | `hover:text-[var(--color-brand)]` |
| 76 | `hover:text-amber-400` (ArXiv Papers link hover) | `hover:text-[var(--color-brand)]` |
| 77 | `hover:text-amber-400` (Dataset Index link hover) | `hover:text-[var(--color-brand)]` |

---

## File: packages/ui/src/oracle/OracleChamber.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 23 | `text-amber-300` (`### ` heading in `FormattedMarkdown`) | `text-[var(--color-brand)]` |
| 30 | `text-amber-400` (`## ` heading in `FormattedMarkdown`) | `text-[var(--color-brand)]` |
| 52 | `text-amber-300` (`**bold**` inline in `FormattedMarkdown`) | `text-[var(--color-brand)]` |
| 151 | `border-amber-500/30` (outer chamber border) | `border-[var(--color-border)]` |
| 153 | `border-amber-500/20` (header divider border) | `border-[var(--color-border)]` |
| 154 | `text-amber-400` (Oracle header label) | `text-[var(--color-brand)]` |
| 155 | `bg-amber-400` (pulsing dot indicator) | `bg-[var(--color-brand)]` |
| 163 | `bg-amber-500/10 border-amber-500/30` (model badge) | `bg-[var(--color-surface-hover)] border-[var(--color-border)]` |
| 163 | `text-amber-400` (model badge text) | `text-[var(--color-brand)]` |
| 183 | `border-amber-500/80` (listening state input border) | `border-[var(--color-border-strong)]` |
| 183 | `shadow-[0_0_15px_rgba(251,191,36,0.3)]` (listening input glow) | `shadow-glow-active` |
| 184 | `bg-amber-400` (audio bar visualizer) | `bg-[var(--color-brand)]` |
| 185 | `text-amber-400` (LISTENING... label) | `text-[var(--color-brand)]` |
| 191 | `border-amber-500/30` (query input border) | `border-[var(--color-border)]` |
| 191 | `focus:border-amber-400` (query input focus border) | `focus:border-[var(--color-border-strong)]` |
| 195 | `hover:bg-amber-500/20 hover:text-amber-400` (mic button hover) | `hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-brand)]` |
| 200 | `from-amber-500 to-amber-600` (submit button gradient) | `from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)]` |
| 200 | `shadow-amber-500/25` (submit button shadow) | `shadow-glow-brand` |
| 206 | `border-amber-500/25` (dossier surface border) | `border-[var(--color-border)]` |
| 208 | `text-amber-400` (dossier Research Dossier label) | `text-[var(--color-brand)]` |

---

## File: packages/ui/src/oracle/VoiceVisualizer.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 76 | `gradient.addColorStop(1, '#e8b84b')` (speaking bar gradient end) | `'#A9D5B0'` (moss-bright) |
| 79 | `gradient.addColorStop(0, 'rgba(232, 184, 75, 0.4)')` (idle bar gradient top) | `'rgba(143,175,145,0.4)'` |
| 80 | `gradient.addColorStop(1, 'rgba(200, 149, 42, 0.2)')` (idle bar gradient bottom) | `'rgba(143,175,145,0.2)'` |
| 106 | `'0 0 30px rgba(245,158,11,0.35), 0 0 60px rgba(245,158,11,0.15)'` (speaking boxShadow) | `shadow-glow-active` value: `'0 0 30px rgba(57,130,111,0.40), 0 0 60px rgba(57,130,111,0.15)'` |
| 111 | `'rgba(245,158,11,0.5)'` (speaking borderColor) | `'rgba(57,130,111,0.5)'` |
| 112 | `'rgba(245,158,11,0.2)'` (idle borderColor) | `'rgba(57,130,111,0.2)'` |
| 116 | `border-amber-500/20` (wrapper border class) | `border-[var(--color-border)]` |
| 120 | `bg-amber-400` (speaking indicator dot) | `bg-[var(--color-brand)]` |
| 121 | `text-amber-300` (status label) | `text-[var(--color-brand)]` |

---

## File: packages/ui/src/oracle/AncientScriptVoiceVisualizer.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 65 | `ctx.fillStyle = isActive ? rgba(232, 184, 75, ...)` (active glyph color) | `rgba(169,213,176,${p.opacity})` (moss-bright) |
| 65 | `ctx.shadowColor = isActive ? '#f59e0b'` (active glyph shadow) | `'#79B59F'` |
| 65 | `ctx.shadowColor = ... '#3b82f6'` (idle glyph shadow) | `'#163A31'` |
| 87 | `'0 0 24px rgba(245,158,11,0.4), 0 0 48px rgba(245,158,11,0.15)'` (active boxShadow) | `'0 0 24px rgba(57,130,111,0.4), 0 0 48px rgba(57,130,111,0.15)'` |
| 89 | `rgba(245,158,11,0.5)` (active borderColor) | `rgba(57,130,111,0.5)` |
| 89 | `rgba(245,158,11,0.2)` (idle borderColor) | `rgba(57,130,111,0.2)` |
| 94 | `border-amber-500/20` (wrapper border class) | `border-[var(--color-border)]` |
| 96 | `text-amber-300` (header label) | `text-[var(--color-brand)]` |

---

## File: packages/ui/src/spatial/CyberMannequinViewer.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 75 | `ctx.strokeStyle = 'rgba(232, 184, 75, 0.15)'` (radar grid rings) | `'rgba(169,213,176,0.15)'` |
| 124 | `gradient.addColorStop(0, rgba(232, 184, 75, ...))` (bone gradient start) | `rgba(169,213,176,${alpha})` |
| 124 | `gradient.addColorStop(1, rgba(255, 210, 122, ...))` (bone gradient end) | `rgba(121,181,159,${alpha * 0.7})` |
| 135 | `ctx.shadowColor = '#f59e0b'` (bone glow) | `'#79B59F'` |
| 149 | `ctx.fillStyle = ... rgba(255, 210, 122, ${alpha})` (joint fill) | `rgba(169,213,176,${alpha})` |
| 149 | `ctx.shadowColor = idx === 4 ? '#10b981' : '#f59e0b'` (joint shadow) | `idx === 4 ? '#10b981' : '#79B59F'` |
| 171 | `border-amber-500/30` (card wrapper border) | `border-[var(--color-border)]` |
| 171 | `hover:border-amber-500/60` (card hover border) | `hover:border-[var(--color-border-strong)]` |
| 176 | `bg-amber-400` (status indicator dot) | `bg-[var(--color-brand)]` |
| 177 | `text-amber-300` (header label) | `text-[var(--color-brand)]` |
| 191 | `border-amber-500/30` (hint badge border) | `border-[var(--color-border)]` |
| 191 | `text-amber-300` (hint badge text) | `text-[var(--color-brand)]` |
| 201 | `text-amber-400` (telemetry footer label) | `text-[var(--color-brand)]` |

---

## File: packages/ui/src/primitives/Avatar.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 24 | `border-amber-500/20` (avatar ring) | `border-[var(--color-border)]` |
| 35 | `text-amber-500` (fallback initials text) | `text-[var(--color-brand)]` |

---

## File: packages/ui/src/primitives/Box.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 42 | `gold: 'border border-amber-500/25'` (gold border variant) | `'border border-[var(--color-border)]'` |

---

## File: packages/ui/src/primitives/Checkbox.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 14 | `checked:bg-amber-500` | `checked:bg-[var(--color-brand)]` |
| 14 | `checked:border-amber-500` | `checked:border-[var(--color-brand)]` |
| 14 | `focus:ring-amber-500/50` | `focus:ring-[var(--color-brand)]/50` |

---

## File: packages/ui/src/primitives/RadioGroup.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 30 | `border-amber-500 bg-amber-500/5` (checked item wrapper) | `border-[var(--color-border-strong)] bg-[var(--color-surface-hover)]` |
| 46 | `border-amber-500` (radio button ring when checked) | `border-[var(--color-border-strong)]` |
| 48 | `bg-amber-500` (radio button fill dot) | `bg-[var(--color-brand)]` |
| 52 | `text-amber-400` (checked label text) | `text-[var(--color-brand)]` |

---

## File: packages/ui/src/primitives/Select.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 23 | `focus:ring-amber-500/50` | `focus:ring-[var(--color-brand)]/50` |
| 23 | `focus:border-amber-500/50` | `focus:border-[var(--color-border-strong)]` |

---

## File: packages/ui/src/primitives/Switch.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 13 | `peer-focus:ring-amber-500/50` (focus ring) | `peer-focus:ring-[var(--color-brand)]/50` |
| 13 | `peer-checked:bg-amber-500` (checked fill) | `peer-checked:bg-[var(--color-brand)]` |

---

## File: packages/ui/src/primitives/Text.tsx

| Line | Current Value | Replacement |
|------|---------------|-------------|
| 42 | `goldLight: 'text-[#e8b84b]'` (goldLight color variant) | `'text-[#A9D5B0]'` (moss-bright) |
| 43 | `amber: 'text-amber-400'` (amber color variant) | `'text-[var(--color-brand)]'` |

> **Note:** `gold: 'text-[#c8952a]'` (line 42) uses a legacy warm-gold hex not in the audit pattern set.
> It is close enough in spirit to warrant migration to `text-[var(--color-brand)]` at your discretion.

---

---

## Summary Statistics

| File | Amber hits | Hex hits | rgba hits | Total |
|------|-----------|----------|-----------|-------|
| `components/ProductCard.tsx` | 4 | 0 | 1 | 4 |
| `components/SubscriptionCard.tsx` | 2 | 0 | 0 | 2 |
| `components/ResearchLogCard.tsx` | 2 | 0 | 0 | 2 |
| `components/PricingCard.tsx` | 11 | 0 | 2 | 13 |
| `components/GlassPanel.tsx` | 1 | 0 | 1 | 2 |
| `navigation/GlobalHeader.tsx` | 17 | 0 | 0 | 17 |
| `navigation/MegaMenu.tsx` | 11 | 0 | 0 | 11 |
| `navigation/CommandBar.tsx` | 7 | 0 | 0 | 7 |
| `navigation/GlobalFooter.tsx` | 10 | 0 | 0 | 10 |
| `oracle/OracleChamber.tsx` | 18 | 0 | 1 | 18 |
| `oracle/VoiceVisualizer.tsx` | 5 | 1 | 5 | 7 |
| `oracle/AncientScriptVoiceVisualizer.tsx` | 2 | 2 | 4 | 6 |
| `spatial/CyberMannequinViewer.tsx` | 7 | 2 | 3 | 10 |
| `primitives/Avatar.tsx` | 2 | 0 | 0 | 2 |
| `primitives/Box.tsx` | 1 | 0 | 0 | 1 |
| `primitives/Checkbox.tsx` | 3 | 0 | 0 | 3 |
| `primitives/RadioGroup.tsx` | 4 | 0 | 0 | 4 |
| `primitives/Select.tsx` | 2 | 0 | 0 | 2 |
| `primitives/Switch.tsx` | 2 | 0 | 0 | 2 |
| `primitives/Text.tsx` | 1 | 1 | 0 | 2 |
| **TOTAL** | **112** | **6** | **17** | **127** |

---

## Files with ZERO Hits (confirmed clean)

- `artifact/ArtifactCard.tsx`
- `civilization/CivilizationCard.tsx`
- `civilization/CivilizationDossier.tsx`
- `components/Accordion.tsx`
- `components/AIChatLauncher.tsx`
- `components/ArchiveCard.tsx`
- `components/Badge.tsx`
- `components/Button.tsx`
- `components/Card.tsx`
- `components/ChronicleCard.tsx`
- `components/CommsRelayCard.tsx`
- `components/DataTable.tsx`
- `components/DefenseGridCard.tsx`
- `components/Dialog.tsx`
- `components/DomainSearch.tsx`
- `components/Drawer.tsx`
- `components/FeatureSection.tsx`
- `components/IconButton.tsx`
- `components/Input.tsx`
- `components/LogisticsCard.tsx`
- `components/MFEErrorBoundary.tsx`
- `components/MFELoadingSkeleton.tsx`
- `components/ProcessSection.tsx`
- `components/ProductGrid.tsx`
- `components/RealmManagerCard.tsx`
- `components/SanctuaryCard.tsx`
- `components/Skeleton.tsx`
- `components/Spinner.tsx`
- `components/StanceBadge.tsx`
- `components/SynapseManagerCard.tsx`
- `components/Tabs.tsx`
- `components/TestimonialCard.tsx`
- `components/Toast.tsx`
- `components/Tooltip.tsx`
- `components/TransmissionCenterCard.tsx`
- `components/VanguardCard.tsx`
- `components/VanguardCarousel.tsx`
- `components/VanguardNodeCard.tsx`
- `epistemology/EpistemicBadge.tsx`
- `epistemology/EvidenceMatrix.tsx`
- `motion/profiles.ts`
- `navigation/AccountModal.tsx`
- `navigation/Launchpad.tsx`
- `oracle/VoiceOracleChamber.tsx`
- `primitives/Grid.tsx`
- `primitives/Stack.tsx`
- `providers/QueryProvider.tsx`
- `spatial/SpatialCanvas.tsx`
- `index.ts`

---

*Audit produced by Kiro — read-only, no source files modified.*
