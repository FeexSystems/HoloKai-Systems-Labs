# Technical Design Document: Claude Code & Google Cloud Deployment Pipeline

## Architecture Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        GOOGLE CLOUD PLATFORM                           │
│                                                                        │
│    ┌──────────────────────┐              ┌────────────────────────┐    │
│    │  Google Cloud Build  │─────────────▶│ Google Artifact Reg.   │    │
│    │  (CI/CD Monorepo)    │              │ (Docker Images)        │    │
│    └──────────┬───────────┘              └───────────┬────────────┘    │
│               │                                      │                 │
│               │ Triggers                             │ Deploys to      │
│               ▼                                      ▼                 │
│    ┌──────────────────────┐              ┌────────────────────────┐    │
│    │ Google Secret Mgr.   │              │ Google Cloud Run       │    │
│    │ (API Keys & Secrets) │─────────────▶│ 1. @holokai/shell      │    │
│    └──────────────────────┘              │ 2. @holokai/bff        │    │
│                                          │ 3. python-engine       │    │
│                                          └───────────┬────────────┘    │
└──────────────────────────────────────────────────────┼─────────────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────────┐
                                            │ Public Edge Traffic │
                                            │ (HTTPS / 99.99% SLA)│
                                            └─────────────────────┘
```

---

## Service Breakdown & Container Specs

| Service | Technology | Port | Memory | CPU | Scaling |
| --- | --- | --- | --- | --- | --- |
| **`holokai-shell`** | Next.js 15 App Router (Standalone) | 3000 | 1 GiB | 1 vCPU | 0 - 50 instances |
| **`holokai-bff`** | Express / TypeScript | 4000 | 512 MiB | 1 vCPU | 0 - 20 instances |
| **`python-engine`** | FastAPI / Python 3.11 | 8000 | 2 GiB | 2 vCPU | 0 - 10 instances |

---

## Security & IAM Architecture

1. **Service Account**: `holokai-runner@$PROJECT_ID.iam.gserviceaccount.com`
2. **Assigned Roles**:
   - `roles/run.invoker`
   - `roles/secretmanager.secretAccessor`
   - `roles/logging.logWriter`
3. **Secret Injection**:
   - `GEMINI_API_KEY`: Injected into `python-engine` and `holokai-bff`.
   - `ELEVENLABS_API_KEY`: Injected into `holokai-bff`.
