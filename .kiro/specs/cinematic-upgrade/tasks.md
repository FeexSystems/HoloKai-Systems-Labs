# Implementation Plan: HoloKai Cinematic Upgrade & Design DNA

## Overview

Migrate all hardcoded amber/gold Tailwind classes to the Obsidian/Forest/Teal semantic token palette (`--color-brand`, `--color-surface`, `--color-border`). Introduce a WebGL `CivilizationGlobe` hero background, staggered Framer Motion text reveals in the Oracle Chamber, and an organic particle system. Harden the BFF with Zod validation, rate limiting, and structured Pino logging. Resolve all `outputFileTracingRoot` gaps and scaffold `.env.example` files across every app.

**Design DNA target:** `#050806` Abyss → `#A9D5B0` Moss-Bright / `#39826F` Teal-Bright
**Key finding:** Design tokens in `@holokai/design-tokens` already use the correct palette. All legacy gold is hardcoded Tailwind utility classes in `@holokai/ui` and `apps/shell` — not in the token layer.

## Tasks

- [x] 1. Audit all hardcoded amber/gold values in `packages/ui/src/**` — search for `amber-`, `#f59e0b`, `#e8b84b`, `rgba(200,149,42`, `rgba(245,158,11` and produce a full file-by-file replacement map before touching any code

- [x] 2. Add `glow` box-shadow utilities to `packages/design-tokens/tailwind.preset.ts` — add `glow: { brand: '0 0 20px rgba(169,213,176,0.25), 0 0 40px rgba(169,213,176,0.10)', active: '0 0 30px rgba(57,130,111,0.40), 0 0 60px rgba(57,130,111,0.15)', subtle: '0 0 12px rgba(143,175,145,0.15)' }` under `boxShadow`

- [x] 3. Update `--font-display` in `packages/design-tokens/src/tokens/typography.css` to the Archaeological Futurism stack — `"Cinzel", "Playfair Display", "Cormorant Garamond", Georgia, serif`

- [x] 4. Load `Cinzel` and `Inter` via `next/font/google` in `apps/shell/app/layout.tsx` and apply `--font-sans` and `--font-display` CSS variable bindings on the `<html>` element

- [x] 5. Migrate `packages/ui/src/components/ProductCard.tsx` — replace `text-amber-500` price, `border-amber-500/50` featured border, and `shadow-[0_0_30px_rgba(245,158,11,0.15)]` featured glow with `text-[var(--color-brand)]`, `border-[var(--color-border-strong)]`, and `shadow-glow-brand`

- [x] 6. Migrate `packages/ui/src/components/SubscriptionCard.tsx` — replace `border-rose-500/50`, `shadow-[0_0_30px_rgba(243,24,96,0.15)]`, `text-rose-500`, and the `from-rose-500 to-amber-500` badge gradient with teal/moss equivalents using `var(--color-brand)`, `shadow-glow-active`, and `from-[var(--pui-teal-bright)] to-[var(--pui-moss-bright)]`

- [x] 7. Migrate `packages/ui/src/components/ResearchLogCard.tsx` — replace `text-amber-500` title and `hover:border-amber-500/30` with `text-[var(--color-brand)]` and `hover:border-[var(--color-border)]`

- [x] 8. Migrate `packages/ui/src/navigation/MegaMenu.tsx` — replace `border-amber-500/30` panel border, `text-amber-400` labels, and `bg-amber-500/20 border-amber-500/30` active-category highlight with semantic `var(--color-border)`, `var(--color-brand)`, and `var(--color-surface-hover)` tokens

- [x] 9. Migrate `packages/ui/src/navigation/GlobalHeader.tsx` — replace announcement bar `from-amber-600 via-amber-500 to-amber-700` gradient with `from-[var(--pui-forest-active)] via-[var(--pui-teal-bright)] to-[var(--pui-forest-deep)]`, and all `text-amber-400`, `border-amber-500/20` references with semantic tokens

- [x] 10. Migrate `apps/shell/components/homepage/AIBuilderSection.tsx` — replace `from-amber-500/20` decorative gradient, `border-amber-500/20` terminal border, `text-amber-500/70` label, `bg-amber-500/80` cursor, `text-amber-400` output text, and `from-amber-500 to-emerald-500` progress bar with teal/moss equivalents

- [x] 11. Refactor `packages/ui/src/oracle/OracleChamber.tsx` for semantic tokens and motion — replace all `amber-*` classes, wrap each `StreamingMarkdown` paragraph in `<motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}` with `delay: index * 0.06` using `ancientEpistemicTransition`, add `holokaiVariants.cardEntrance` entrance on `EpistemicBadge`, and update the CTA button to `bg-[var(--color-surface)] border-[var(--color-brand)] text-[var(--color-brand)]`

- [x] 12. Update `packages/ui/src/oracle/VoiceVisualizer.tsx` canvas gradient hex values — listening: `#10b981/#059669` → `#A9D5B0/#39826F`, speaking: `#ffd27a/#e8b84b` → `#79B59F/#A9D5B0`, idle: `rgba(232,184,75,0.4)/rgba(200,149,42,0.2)` → `rgba(143,175,145,0.4)/rgba(143,175,145,0.2)`

- [x] 13. Update `packages/ui/src/oracle/AncientScriptVoiceVisualizer.tsx` canvas colors — active glyph color `#f59e0b` → `#A9D5B0`, active shadowColor `#f59e0b` → `#79B59F`, idle shadowColor `#3b82f6` → `#163A31`

- [x] 14. Install 3D dependencies in `apps/shell` — run `pnpm add @react-three/fiber@^9 @react-three/drei@^10 three@^0.177` and `pnpm add -D @types/three@^0.177`, then confirm no peer-dependency conflicts with React 19

- [x] 15. Create `apps/shell/components/three/CivilizationGlobe.tsx` — implement a `@react-three/fiber` `<Canvas>` with a slow-rotating wireframe sphere (`color: #0B1710`), 400-point atmospheric particle field (`color: #79B59F`, size 0.015), and a subtle torus orbital ring (`color: #39826F`, opacity 0.3); export with `dynamic(() => import(...), { ssr: false })` wrapping for lazy load

- [x] 16. Integrate `CivilizationGlobe` into `apps/shell/components/homepage/HeroSection.tsx` — replace the static `radial-gradient(... rgba(200,149,42,...))` with the lazy-loaded globe positioned `absolute inset-0 pointer-events-none`, replace the heading gradient from amber to `from-[#79B59F] via-[#A9D5B0] to-[#39826F]`, update the eyebrow badge and supporting badges to semantic tokens, add `motion.div` entrance using `ancientEpistemicTransition`

- [x] 17. Create `packages/ui/src/oracle/KnowledgeParticleField.tsx` — a `<canvas>` component rendering 60 slow-drifting particles in `#163A31`, `#39826F`, `#79B59F` that float and fade; positioned `absolute inset-0 z-0 pointer-events-none`; mount inside `OracleChamber` behind all content layers; export from `packages/ui/src/index.ts`

- [x] 18. Add Zod request validation to `apps/bff/src/routes/oracle.ts` — define `OracleQuerySchema` (`prompt: z.string().min(1).max(2000)`, `civilizationFocus: z.string().max(100).optional()`) and `OracleSpeakSchema` (`text`, `engine: z.enum(['elevenlabs','deepgram'])`, `voiceId`), apply `safeParse` to both endpoints and return structured `{ error, details }` 400s on failure

- [x] 19. Add rate limiting to `POST /speak` in `apps/bff` — install `express-rate-limit@^7`, create a limiter of 10 requests per 60s window, apply only to the `/speak` route

- [x] 20. Set up Pino structured logging in `apps/bff` — install `pino@^9` and `pino-pretty@^13`, create `apps/bff/src/lib/logger.ts` with environment-aware pretty/JSON transport, replace all `console.error` and `console.warn` calls in `oracle.ts` with `logger.error` and `logger.warn`

- [x] 21. Harden `apps/bff/src/routes/identity.ts` — replace `req as AuthRequest` casts with guarded `auth?.userId` null checks returning `401`, add `ProfileUpdateSchema` Zod validation on `POST /profile/update` returning `400` before any DB call

- [x] 22. Add `outputFileTracingRoot` to 5 MFE `next.config.mjs` files missing it — `apps/web-oracle`, `apps/web-archive`, `apps/web-research`, `apps/web-home`, and `apps/web-cart`; add `path` and `fileURLToPath` imports identical to the pattern already in `apps/shell/next.config.mjs`

- [x] 23. Create `.env.example` files for all 7 apps — `apps/shell`, `apps/web-oracle`, `apps/web-cart`, `apps/web-research`, `apps/web-archive`, `apps/web-home`, and `apps/bff`; include all required env vars with placeholder values

- [x] 24. Run type-check across modified packages — `pnpm --filter @holokai/ui exec tsc --noEmit`, `pnpm --filter @holokai/bff exec tsc --noEmit`, `pnpm --filter @holokai/shell exec tsc --noEmit`; resolve any errors before marking complete

- [x] 25. Full build verification and manual visual QA — run `pnpm build` from workspace root, confirm no amber/gold remains in the shell UI, verify the CivilizationGlobe renders with a CSS-gradient fallback on failure, verify `POST /api/oracle/query` with empty body returns 400 with Zod details, verify 11th `/speak` request within 60s returns 429

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": [1, 2, 3, 14, 18, 19, 20, 21, 22, 23] },
    { "wave": 2, "tasks": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15] },
    { "wave": 3, "tasks": [16, 17] },
    { "wave": 4, "tasks": [24] },
    { "wave": 5, "tasks": [25] }
  ]
}
```

## Notes

- **Design tokens are already correct.** `packages/design-tokens/src/tokens/colors.css` has the full Obsidian/Forest/Teal primitive and semantic token set. No token changes are needed — only Tailwind class replacements in components.
- **`apps/web-cart` is also missing `outputFileTracingRoot`** despite not being listed in the original plan — confirmed by reading the file directly; included in Task 22.
- **`apps/bff/src/routes/identity.ts`** already uses `StrictAuthProp` from `@clerk/clerk-sdk-node` and is protected by `ClerkExpressRequireAuth()` middleware, but the null guard is missing on both handlers — fixed in Task 21.
- **Q1 (3D library):** `react-three-fiber` is used. `anime.js` is not added — `motion/react` handles all animation orchestration.
- **Q2 (Fonts):** `Cinzel` via Google Fonts is the fallback until custom fonts are delivered. Swap-in later by updating `--font-display` only.
- **Q3 (Theme scope):** Hardcoded `bg-[#05050a]` page backgrounds in `apps/shell` are deferred — only component-level color tokens are migrated in this phase.
