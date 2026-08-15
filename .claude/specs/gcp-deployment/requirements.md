# Requirements Document: Claude Code & Google Cloud Deployment Pipeline

## Introduction

This specification defines the requirements for deploying the HoloKai Planetary UI Platform & Civilization Research OS using Claude Code automated workflows and Google Cloud Platform (GCP) infrastructure.

The platform comprises Next.js 15 App Router streaming frontends (`@holokai/shell`), micro-frontend remotes (`apps/web-*`), an Express/BFF routing layer (`@holokai/bff`), and a Python inference engine (`services/python-engine`). This deployment pipeline provides automated containerization, Cloud Run serverless hosting, Cloud Build CI/CD triggers, IAM role least-privilege security, and edge-native domain routing.

---

## Glossary

- **HoloKai OS**: Planetary-scale civilization research platform.
- **Claude Code**: Agentic CLI tool for code generation, auditing, and deployment automation.
- **Google Cloud Run**: Fully managed serverless execution environment for containerized microservices.
- **Google Cloud Build**: Serverless CI/CD platform for automating build, test, and container push steps.
- **Google Artifact Registry**: Secure private Docker container registry on GCP.
- **Google Secret Manager**: Secure storage for sensitive API keys (ElevenLabs, Gemini, Firebase).
- **Edge Manifest**: Dynamic routing configuration managed across Cloudflare and Google Cloud Load Balancing.

---

## Requirements

### Requirement 1: Multi-Service Containerization (Dockerfiles)

**User Story:** As a DevOps engineer, I want optimized multi-stage Dockerfiles for the Next.js Shell, BFF API, and Python Engine, so that container images are minimal, secure, and fast to cold-start.

#### Acceptance Criteria
1. WHEN building the Next.js shell (`apps/shell`) THEN the Dockerfile SHALL use Node.js 20/22 alpine with standalone output mode (`output: 'standalone'`).
2. WHEN building the Python engine (`services/python-engine`) THEN the Dockerfile SHALL use Python 3.11-slim with pre-compiled wheels and non-root execution (`USER appuser`).
3. WHEN building the BFF service (`apps/bff`) THEN the Dockerfile SHALL produce an isolated production container exposing port 4000.
4. WHEN container images are scanned THEN they SHALL contain zero critical or high CVE vulnerabilities.

---

### Requirement 2: Google Cloud Run Service Deployment

**User Story:** As an infrastructure engineer, I want the HoloKai services deployed to Google Cloud Run with automated scaling, so that the platform handles research query spikes while maintaining zero idle cost.

#### Acceptance Criteria
1. WHEN the Shell service is deployed THEN it SHALL run on Cloud Run in the `us-central1` (or multi-region) zone with min-instances=0 and max-instances=50.
2. WHEN the Python engine is deployed THEN it SHALL have dedicated memory allocation (2GiB minimum) and concurrency tuned for multi-agent LLM reasoning.
3. WHEN services communicate internally THEN the Shell and BFF SHALL route via Serverless VPC Access or direct authenticated service-to-service URLs.
4. WHEN health probes are executed THEN `/api/health` SHALL respond with `200 OK` within 200ms.

---

### Requirement 3: Automated Google Cloud Build Pipeline (`cloudbuild.yaml`)

**User Story:** As a developer using Claude Code, I want a single-command Cloud Build trigger, so that commits to `main` automatically build packages, run typechecks, build containers, and deploy to Cloud Run.

#### Acceptance Criteria
1. WHEN Cloud Build executes THEN it SHALL run `pnpm install --frozen-lockfile` and verify monorepo typecheck across all packages.
2. WHEN typecheck passes THEN Cloud Build SHALL build Docker images and push them to Google Artifact Registry (`us-central1-docker.pkg.dev/$PROJECT_ID/holokai-repo/...`).
3. WHEN images are pushed THEN Cloud Build SHALL execute `gcloud run deploy` with atomic traffic migration (`--traffic 100%`).
4. IF any build or test step fails THEN Cloud Build SHALL halt execution and prevent traffic redirection to broken revisions.

---

### Requirement 4: Google Secret Manager & IAM Least-Privilege Security

**User Story:** As a Security Engineer (`deploy.md`), I want all sensitive credentials managed in Google Secret Manager and bound to dedicated Service Accounts, so that no secrets leak into Git or client bundles.

#### Acceptance Criteria
1. WHEN services boot THEN secrets for `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, and `DATABASE_URL` SHALL be injected as environment variables directly from Secret Manager.
2. WHEN the Cloud Run service account is configured THEN it SHALL only possess `roles/secretmanager.secretAccessor` and `roles/run.invoker` permissions.
3. WHEN client requests hit the API THEN CORS headers SHALL strictly enforce the production domain (`https://holokai.systems` or configured origin).

---

### Requirement 5: Claude Code Agent Deployment Automation Scripts

**User Story:** As a pair programmer using Claude Code, I want dedicated deployment CLI scripts (`deploy-gcp.sh` / `deploy-gcp.ps1`), so that I can trigger manual or preview deployments directly from the terminal.

#### Acceptance Criteria
1. WHEN `pnpm run deploy:gcp` is executed THEN the script SHALL authenticate via `gcloud auth` and validate the active GCP project.
2. WHEN preview mode is selected THEN the script SHALL deploy a staging revision with a unique preview URL without touching production traffic.
3. WHEN the deployment completes THEN the script SHALL output live URL endpoints, cold-start latency, and service status summaries.
