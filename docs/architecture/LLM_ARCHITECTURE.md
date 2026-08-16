# 🍔 The LLM Application "Burger" Architecture

HoloKai implements a 5-layer LLM Architecture to construct a scalable, multi-agent AI operating system. This model clearly separates concerns from the user interface down to the infrastructure layer.

## 1. Frontend - User-Facing Layer (Top Bun)
**Purpose:** Where users interact with the LLM-powered application.
- **Implementations:** 
  - `apps/shell` & `apps/web-ai`
  - Planetary UI Composites (Chat Interfaces, MegaMenus)
  - Voice-Activated Interfaces (Future)
  - Embedded AI Widgets

## 2. Logic Layer - The Application Brain
**Purpose:** Connects the interface with the intelligence, managing orchestration and multi-step reasoning.
- **Framework:** **CrewAI** (Role-based agent orchestration).
- **Workforce:** Specialized agents defined in `.agents/plugins/` (e.g., Engineering, Design, Product, Marketing).
- **Core Functions:** Prompt engineering, memory/context handling, tool execution, and routing.

## 3. Data & Integration Layer - Smart Tools
**Purpose:** Enables knowledge retrieval, APIs, and dynamic actions.
- **Implementations:**
  - RAG (Retrieval-Augmented Generation) pipelines
  - Vector Databases (Chroma / Pinecone integrations)
  - API Webhooks & External Services (e.g., GitHub, Linear)
  - File reading/writing capabilities (Tools provided to agents)

## 4. Model Layer - The Core Intelligence
**Purpose:** Powers reasoning, generation, and decision-making.
- **Implementations:**
  - Multi-provider gateway (`model_gateway.py`)
  - Dynamic routing (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro)
  - Context window and token management

## 5. Infrastructure Layer - The Bottom Bun
**Purpose:** Everything that keeps the app running securely and smoothly.
- **Implementations:**
  - Edge deployments (Cloudflare Workers)
  - Cloud hosting (Vercel, AWS/GCP)
  - CI/CD Pipelines
  - Observability & Monitoring (Datadog/Sentry)

---

## 🤖 The HoloKai AI Workforce
The Logic Layer orchestrates a specialized workforce of AI personas. These agents are strictly scaffolded under the Antigravity standard `.agents/plugins/` directory.

### Department Structure
- **Engineering:** `frontend-developer`, `backend-architect`, `ai-engineer`, etc.
- **Product:** `trend-researcher`, `sprint-prioritizer`, etc.
- **Marketing:** `growth-hacker`, `content-creator`, etc.
- **Design:** `ui-designer`, `ux-researcher`, etc.
- **Testing:** `api-tester`, `performance-benchmarker`, etc.
- **Operations:** `support-responder`, `legal-compliance-checker`, etc.

The orchestrator dynamically summons the necessary "crew" of these agents to solve complex, multi-disciplinary tasks originating from the Frontend.
