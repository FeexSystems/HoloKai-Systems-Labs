# ADR 0001: Next.js App Router for Streaming SSR & React Server Components

- **Status**: Accepted
- **Date**: 2026-08-07
- **Deciders**: HoloKai Systems Engineering

## Context
The HoloKai application was previously structured as a pure Client-Side Rendered (CSR) single page application. To achieve the Planetary UI Platform specification's near-zero perceived latency and sub-1s LCP targets on 4G, a streaming Server-Side Rendering (SSR) framework was required.

## Decision
We adopt **Next.js App Router** across the primary shell host (`apps/shell`) and micro-frontend remotes (`apps/web-oracle`, `apps/web-archive`).

## Consequences
- **Positive**: Enables React Server Components (RSC), selective hydration via `@holokai/runtime`, and automatic HTML streaming boundaries (`loading.tsx`).
- **Positive**: Substantially reduces client bundle size for initial page load.
- **Negative**: Requires maintaining Node.js runtime environment for SSR rendering.
