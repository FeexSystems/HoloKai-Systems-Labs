# HoloKai Design Token & Variable Reference

This document maps HoloKai design tokens across CSS variables, Tailwind classes, and JavaScript exports.

## 1. Color Palette

| Token Name | Hex / Value | CSS Variable | Tailwind Class | JS Export (`HK_COLORS`) |
|------------|-------------|--------------|----------------|-----------------------|
| Abyss Background | `#05050A` | `--hk-bg-abyss` | `bg-holokai-abyss` | `HK_COLORS.bg.abyss` |
| Obsidian Background | `#0A0A0A` | `--hk-bg-obsidian` | `bg-holokai-obsidian` | `HK_COLORS.bg.obsidian` |
| Panel Surface | `#12121A` | `--hk-bg-panel` | `bg-holokai-panel` | `HK_COLORS.bg.panel` |
| Elevated Surface | `#1A1A26` | `--hk-bg-elevated` | `bg-holokai-elevated` | `HK_COLORS.bg.elevated` |
| Oracle Gold | `#C8952A` | `--hk-accent-oracle` | `text-holokai-gold` | `HK_COLORS.oracle.gold` |
| Oracle Light Gold | `#E8B84B` | `--hk-accent-oracle-light` | `text-holokai-goldLight` | `HK_COLORS.oracle.goldLight` |
| Heritage Amber | `#FF9D4D` | `--hk-accent-heritage` | `text-holokai-amber` | `HK_COLORS.oracle.amber` |
| Heritage Terracotta | `#D97706` | — | `text-holokai-terracotta` | `HK_COLORS.heritage.terracotta` |

## 2. Epistemic Classifications (`HK_EPISTEMIC`)

| Level | Color | Hex | Component | Definition |
|-------|-------|-----|-----------|------------|
| `ESTABLISHED` | Emerald | `#10B981` | `EpistemicBadge` | Substantial evidence (primary source, archaeology, genetics) |
| `SCHOLARLY_DEBATE` | Blue | `#3B82F6` | `EpistemicBadge` | Competing academic interpretations |
| `TRADITION` | Amber | `#F59E0B` | `EpistemicBadge` | Oral history, Griot lineages, folklore |
| `ESOTERIC` | Pink | `#EC4899` | `EpistemicBadge` | Cultural belief systems, cosmological teachings |
| `SPECULATIVE` | Purple | `#8B5CF6` | `EpistemicBadge` | Unverified hypotheses |
| `FICTIONAL` | Gray | `#6B7280` | `EpistemicBadge` | Creative or fictional adaptations |

## 3. Confidence Heuristics (`HK_CONFIDENCE`)

| Range | Level | Color | Visual Component |
|-------|-------|-------|------------------|
| `0.90 – 1.00` | Very Strong | `#10B981` | `ConfidenceIndicator` |
| `0.75 – 0.89` | Strong | `#34D399` | `ConfidenceIndicator` |
| `0.60 – 0.74` | Moderate | `#FBBF24` | `ConfidenceIndicator` |
| `0.40 – 0.59` | Uncertain | `#F97316` | `ConfidenceIndicator` |
| `0.20 – 0.39` | Weak | `#EF4444` | `ConfidenceIndicator` |
| `0.00 – 0.19` | Speculative | `#A855F7` | `ConfidenceIndicator` |

## 4. Typography

- **Display**: `Syne`, system-ui, sans-serif (`font-display`)
- **Heading**: `Syne`, system-ui, sans-serif (`font-heading`)
- **Body**: `Inter`, system-ui, sans-serif (`font-body`, `font-sans`)
- **Monospace**: `JetBrains Mono`, monospace (`font-mono`)

## 5. Motion Presets (`HK_MOTION`)

- Fast: `150ms`
- Normal: `300ms`
- Slow: `600ms`
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- **Reduced Motion**: Automatically enforced via `@media (prefers-reduced-motion: reduce)` in `index.css`.
