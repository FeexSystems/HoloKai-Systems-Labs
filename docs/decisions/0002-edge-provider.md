# ADR 0002: Cloudflare Workers & Vercel Edge for Edge Intelligence Layer

- **Status**: Accepted
- **Date**: 2026-08-07
- **Deciders**: HoloKai Systems Engineering

## Context
Planetary-scale applications require edge-native routing, geolocation telemetry, and dynamic micro-frontend manifest resolution to eliminate origin round-trip latency.

## Decision
We adopt **Cloudflare Workers** as the global Edge Intelligence Layer (`edge/geo-router-worker`, `edge/mfe-manifest-worker`) combined with Vercel Edge Runtime for SSR hosting.

## Consequences
- **Positive**: Geolocation headers (`x-holokai-geo-country`) are injected at edge PoPs before hitting origin.
- **Positive**: MFE manifests resolve at edge with sub-50ms latency.
- **Negative**: Requires handling Cloudflare Workers environment bindings (`Env`).
