# Implementation Tasks: Claude Code & Google Cloud Deployment Pipeline

## Tasks Breakdown

### Phase 1: Containerization & Standalone Builds

- [x] 1.1 Configure Next.js standalone output in `apps/shell/next.config.mjs` (`output: 'standalone'`)
- [x] 1.2 Create multi-stage Dockerfile for `@holokai/shell` in `apps/shell/Dockerfile`
- [x] 1.3 Create Dockerfile for `@holokai/bff` in `apps/bff/Dockerfile`
- [x] 1.4 Create Dockerfile for Python engine in `services/python-engine/Dockerfile`
- [x] 1.5 Add `.dockerignore` files optimizing build contexts and caching

### Phase 2: Google Cloud Infrastructure & Automation Scripts

- [x] 2.1 Create root `cloudbuild.yaml` defining build, container push, and Cloud Run deployment steps
- [x] 2.2 Create PowerShell deployment script `infra/gcp/deploy.ps1` for local deployment via CLI
- [x] 2.3 Create Bash deployment script `infra/gcp/deploy.sh` for Linux/CI execution
- [x] 2.4 Configure Secret Manager IAM binding instructions and deployment verification checks

### Phase 3: Monorepo Integration & Verification

- [x] 3.1 Add `deploy:gcp` script to root `package.json`
- [x] 3.2 Verify local container build using `docker build` (dry-run)
- [ ] 3.3 Test Cloud Run health check endpoints (`/api/health`)
