# ADR 0003: TypeScript BFF API Gateway Layer

- **Status**: Accepted
- **Date**: 2026-08-07
- **Deciders**: HoloKai Systems Engineering

## Context
The legacy Python FastAPI monolith mixed API gateway concerns, CORS management, and domain REST endpoints into a single un-typed file.

## Decision
We introduce **`apps/bff`**, a Node.js / TypeScript Backend-For-Frontend (BFF) API Gateway that enforces `@holokai/contracts` platform schemas, manages health probes, and routes requests to domain services.

## Consequences
- **Positive**: Complete type safety between frontend remotes and backend API gateway.
- **Positive**: Isolates heavy Python AI/ML background computations behind a resilient BFF interface.
