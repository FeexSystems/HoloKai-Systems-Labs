
from __future__ import annotations

import logging
import os
from typing import Any, Dict, List
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel, Field

from holokai_backend import CivilizationCore
from grounding import build_grounded_answer, grounded_refusal_message
from catalog_backend import (
    ensure_storage_ready,
    facets as library_facets,
    get_source as library_get_source,
    persist_grounded,
    review_source as library_review_source,
    search_sources as library_search_sources,
    storage_status,
)
from job_manager import get_job as job_get, list_jobs as jobs_list, submit_job
from model_gateway import synthesize_with_gateway
from ris_pipeline import import_ris_file

# ----------------------------------------------------------------------
# Logging
# ----------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("holokai.api")

# ----------------------------------------------------------------------
# FastAPI App
# ----------------------------------------------------------------------
app = FastAPI(
    title="HoloKai Civilization Core API",
    description=(
        "Multi-agent historical synthesis engine for African civilizations — "
        "full knowledge graph, live memories, and Grok-class Alive replies"
    ),
    version="3.0.0",
)

# CORS – local Next.js + Vite + deployed cloud frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_origin_regex=r"https?://([a-zA-Z0-9-]+\.)*(localhost|127\.0\.0\.1|netlify\.app|onrender\.com|vercel\.app|pages\.dev)(:\d+)?",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Single shared core instance
core = CivilizationCore()


@app.on_event("startup")
async def startup_storage_init():
    try:
        info = ensure_storage_ready()
        logger.info("Storage init: %s", info)
    except Exception as exc:
        logger.warning("Storage init skipped: %s", exc)


# In-memory chat history (last 100 messages)
chat_history: List[Dict[str, Any]] = []
MAX_HISTORY = 100

# Greeting keywords that trigger wave/bow animation
GREETING_KEYWORDS = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy", "salute", "jambo", "sawubona"]
WAVE_KEYWORDS = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "howdy", "salute"]
BOW_KEYWORDS = ["greetings", "jambo", "sawubona", "respect", "honor"]


# ----------------------------------------------------------------------
# Request / Response Models
# ----------------------------------------------------------------------
class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, description="User query")


class RagRetrieveRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    k: int = Field(5, ge=1, le=20)
    domain: str | None = Field(
        None,
        description="Optional agent domain: historian | archaeology | anthropology | linguistics | ethics",
    )
    min_score: float = Field(0.28, ge=0.0, le=1.0)
    empire: str | None = None
    source: str | None = None


class RagAskRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    k: int = Field(8, ge=1, le=20)
    min_score: float = Field(0.22, ge=0.0, le=1.0)
    domain: str | None = None
    model: str | None = Field(
        None, description="Chat model for synthesis (default HOLAKAI_CHAT_MODEL / gemma4)"
    )
    synthesize: bool = Field(True, description="If false, return contexts only")
    seed_if_empty: bool = Field(
        True, description="Auto-seed knowledge base when empty (Full RAG)"
    )
    use_alive: bool = Field(
        True, description="Use Alive Engine (graph + live memory + reply store)"
    )
    session_id: str | None = Field(None, description="Optional session id for live memory")


class AliveAskRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    k: int = Field(8, ge=1, le=20)
    min_score: float = Field(0.2, ge=0.0, le=1.0)
    domain: str | None = None
    model: str | None = None
    synthesize: bool = True
    use_web: bool = True
    use_core: bool = True
    session_id: str | None = None
    learn: bool = True
    fast: bool = Field(False, description="Skip web + core agents, reduce graph hops for faster response")


class GroundedAskRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    k: int = Field(10, ge=1, le=30)
    min_score: float = Field(0.2, ge=0.0, le=1.0)
    domain: str | None = None
    use_web: bool = True
    use_core: bool = True
    require_citations: bool = True
    prefer_hosted: bool = True
    hosted_model: str | None = None
    ollama_model: str | None = None


class StudioReviewRequest(BaseModel):
    slug: str = Field(..., min_length=1)
    decision: str = Field(..., min_length=1)
    notes: str = ""


class StudioImportRisRequest(BaseModel):
    path: str = Field(..., min_length=1, description="Absolute or project-relative path to RIS file")
    verify_doi: bool = False


class GatewaySynthesisRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    contexts: list = Field(default_factory=list)
    prefer_hosted: bool = True
    hosted_model: str | None = None
    ollama_model: str | None = None


class JobRequest(BaseModel):
    payload: Dict[str, Any] = Field(default_factory=dict)


class QueryResponse(BaseModel):
    title: str
    query: str
    fragments: list
    summary: str
    confidence: float
    trace_id: str
    active_agents: list
    safety_notes: list
    emotions: dict
    greeting_animation: str | None = None
    grounded: dict = Field(default_factory=dict)
    citation_validation: dict = Field(default_factory=dict)
    canon_persist: dict = Field(default_factory=dict)


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=3000)


class OllamaChatRequest(BaseModel):
    messages: List[Dict[str, Any]] = Field(..., min_length=1)
    model: str | None = Field(
        None, description="Chat model (default HOLAKAI_CHAT_MODEL / gemma4)"
    )
    stream: bool = Field(True)
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    top_p: float = Field(0.9, ge=0.0, le=1.0)
    format: str | None = Field(None, description="e.g. json")
    think: bool | None = None
    tools: list | None = None
    voice: str = "en-US-GuyNeural"
    rate: float = 1.0
    pitch: float = 1.0


class WebSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    max_results: int = Field(5, ge=1, le=10)


class ArtifactResolveRequest(BaseModel):
    observation: Dict[str, Any]
    vector: List[Dict[str, Any]] = []
    graph: List[Dict[str, Any]] = []
    metadata: List[Dict[str, Any]] = []
    provenance: List[Dict[str, Any]] = []
    resolvedThreshold: float = 0.82
    ambiguityMargin: float = 0.06
    conflictPenaltyWeight: float = 0.25


class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str
    fragments: list = []
    active_agents: list = []
    emotions: dict = {}
    greeting_animation: str | None = None


# ----------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------
def detect_greeting_animation(query: str) -> str | None:
    q = query.lower().strip()
    if any(k in q for k in WAVE_KEYWORDS):
        return "wave"
    if any(k in q for k in BOW_KEYWORDS):
        return "bow"
    if any(k in q for k in GREETING_KEYWORDS):
        return "wave"
    return None


def add_to_history(role: str, content: str, **kwargs):
    msg = {
        "id": f"msg_{len(chat_history)}_{int(datetime.now().timestamp())}",
        "role": role,
        "content": content,
        "timestamp": datetime.now().isoformat(),
        **kwargs,
    }
    chat_history.append(msg)
    if len(chat_history) > MAX_HISTORY:
        chat_history.pop(0)
    return msg


def attach_grounding(payload: Dict[str, Any], *, query: str, answer_key: str = "answer", contexts_key: str = "contexts") -> Dict[str, Any]:
    answer = str(payload.get(answer_key) or "")
    contexts = payload.get(contexts_key) or []
    grounded = build_grounded_answer(query=query, answer=answer, contexts=contexts)
    payload["grounded"] = grounded
    payload["citation_validation"] = {
        "claims": len(grounded.get("claims") or []),
        "supported_claims": grounded.get("supported_claim_count", 0),
        "citation_count": len(grounded.get("citation_index") or []),
        "insufficient_evidence": grounded.get("insufficient_evidence", False),
    }
    return payload


def execute_grounded_ask(payload: GroundedAskRequest) -> Dict[str, Any]:
    from holokai_alive import alive_ask

    retrieval = alive_ask(
        payload.query,
        k=payload.k,
        min_score=payload.min_score,
        domain=payload.domain,
        synthesize=False,
        kb=core.kb,
        core=core if payload.use_core else None,
        use_core=payload.use_core,
        use_web=payload.use_web,
        learn=False,
    )

    contexts = retrieval.get("contexts") or []
    gateway_answer = None
    gateway_meta: Dict[str, Any] = {}

    if contexts:
        try:
            gw = synthesize_with_gateway(
                query=payload.query,
                contexts=contexts,
                prefer_hosted=payload.prefer_hosted,
                hosted_model=payload.hosted_model,
                ollama_model=payload.ollama_model,
            )
            gateway_answer = gw.get("answer")
            gateway_meta = {
                "provider": gw.get("provider"),
                "model": gw.get("model"),
                "host": gw.get("host"),
            }
        except Exception as gateway_exc:
            logger.warning("Gateway synthesis fallback: %s", gateway_exc)

    if not gateway_answer:
        fallback = alive_ask(
            payload.query,
            k=payload.k,
            min_score=payload.min_score,
            domain=payload.domain,
            synthesize=True,
            kb=core.kb,
            core=core if payload.use_core else None,
            use_core=payload.use_core,
            use_web=payload.use_web,
            learn=True,
        )
        gateway_answer = fallback.get("answer") or ""
        if not contexts:
            contexts = fallback.get("contexts") or []
        gateway_meta = {
            "provider": "alive_fallback",
            "model": fallback.get("model"),
            "host": fallback.get("chat_host"),
        }

    response: Dict[str, Any] = {
        "ok": True,
        "query": payload.query,
        "answer": gateway_answer,
        "contexts": contexts,
        "retrieval_mode": retrieval.get("retrieval_mode") or "alive",
        "gateway": gateway_meta,
        "context_count": len(contexts),
    }

    attach_grounding(response, query=payload.query, answer_key="answer", contexts_key="contexts")

    if payload.require_citations and response["grounded"].get("insufficient_evidence"):
        response["ok"] = False
        response["answer"] = grounded_refusal_message(payload.query)
        response["refusal_reason"] = "insufficient_evidence"

    response["canon_persist"] = persist_grounded(payload.query, response.get("grounded") or {})

    if response.get("answer"):
        add_to_history("user", payload.query)
        add_to_history(
            "assistant",
            response.get("answer") or "",
            active_agents=["HoloKai Grounded"],
            fragments=response.get("contexts") or [],
            grounded=response.get("grounded") or {},
        )

    return response


# ----------------------------------------------------------------------
# Endpoints
# ----------------------------------------------------------------------
@app.get("/health")
async def health():
    rag = getattr(core, "rag_status", {}) or {}
    err = rag.get("error")
    hint = None
    if err and "chromadb" in str(err).lower():
        hint = "pip install -r requirements.txt  # needs chromadb for vector RAG"
    elif err and "ollama" in str(err).lower():
        hint = "ollama pull nomic-embed-text && ensure Ollama is running"
    elif not rag.get("ready") and rag.get("enabled"):
        hint = "POST /api/rag/seed or: python seed_knowledge.py"

    ai_status = {
        "gemini": bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")),
        "elevenlabs": bool(os.getenv("ELEVENLABS_API_KEY") or os.getenv("VITE_ELEVENLABS_API_KEY")),
        "deepgram": bool(os.getenv("DEEPGRAM_API_KEY") or os.getenv("VITE_DEEPGRAM_API_KEY")),
    }

    alive_snap: Dict[str, Any] = {}
    try:
        from holokai_alive import alive_status

        alive_snap = alive_status()
    except Exception as exc:
        alive_snap = {"error": str(exc)}

    return {
        "status": "ok",
        "service": "HoloKai Civilization Core",
        "version": "3.0.0",
        "mode": "alive",
        "ai_engines": ai_status,
        "supervisor": "gemini",
        "vector_rag": {
            "ready": bool(rag.get("ready")),
            "enabled": bool(rag.get("enabled")),
            "error": err,
            "hint": hint,
            "model": (rag.get("store") or {}).get("embeddings", {}).get("model")
            if isinstance(rag.get("store"), dict)
            else None,
            "count": (rag.get("store") or {}).get("count")
            if isinstance(rag.get("store"), dict)
            else None,
        },
        "alive": {
            "graph_nodes": (alive_snap.get("graph") or {}).get("nodes"),
            "graph_edges": (alive_snap.get("graph") or {}).get("edges"),
            "memory_total": ((alive_snap.get("memory") or {}).get("counts") or {}).get("total"),
            "reply_store": (alive_snap.get("replies") or {}).get("count"),
            "detail": alive_snap,
        },
        "storage": storage_status(),
    }


@app.get("/api/rag/status")
async def rag_status():
    """Python agent vector RAG status (Ollama nomic-embed-text + Chroma)."""
    try:
        from embeddings_ollama import check_embeddings

        embeddings = check_embeddings()
    except Exception as exc:
        embeddings = {"ok": False, "error": str(exc)}

    store = None
    if getattr(core, "kb", None) is not None:
        try:
            store = core.kb.status()
        except Exception as exc:
            store = {"error": str(exc)}

    return {
        "service": "HoloKai Python RAG",
        "embeddings": embeddings,
        "store": store,
        "core": getattr(core, "rag_status", {}),
        "ready": bool(embeddings.get("ok") and store and store.get("count", 0) > 0),
        "aligned_with_frontend": {
            "embed_model": "nomic-embed-text",
            "note": "Same Ollama model as frontend/lib/rag/embeddings.js",
        },
    }


@app.post("/api/rag/seed")
async def rag_seed(force: bool = False):
    """Seed / re-seed Python Chroma collection from comprehensive + knowledge files."""
    try:
        from knowledge_base import KnowledgeBase, ensure_seeded

        kb = core.kb or KnowledgeBase()
        summary = ensure_seeded(kb, force=force)
        core.kb = kb
        # Re-bind agents to the seeded KB
        for agent in core.agents.values():
            if hasattr(agent, "kb"):
                agent.kb = kb
        core.rag_status = {
            "enabled": True,
            "ready": kb.count() > 0,
            "store": kb.status(),
            "seed": summary,
        }
        return {"ok": True, **summary, "status": kb.status()}
    except Exception as exc:
        logger.exception("RAG seed failed")
        raise HTTPException(
            status_code=503,
            detail=f"{exc}. Ensure Ollama is running and nomic-embed-text is pulled.",
        ) from exc


@app.post("/api/rag/ask")
async def rag_ask(payload: RagAskRequest):
    """
    Full RAG: retrieve + grounded answer via ollama.Client (local → cloud fallback).

    Embeddings: Ollama host chain, then minilm/hashing when HOLAKAI_FULL_RAG=1.
    Chat synthesis: local Ollama → https://ollama.com when OLLAMA_API_KEY is set.
    """
    try:
        from rag_full import ensure_full_rag_ready, full_rag_ask
    except ImportError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    kb = core.kb
    if payload.seed_if_empty and (kb is None or kb.count() == 0):
        try:
            ready = ensure_full_rag_ready(force_seed=False)
            if ready.get("ok"):
                from knowledge_base import KnowledgeBase

                kb = KnowledgeBase()
                core.kb = kb
                for agent in core.agents.values():
                    if hasattr(agent, "kb"):
                        agent.kb = kb
                core.rag_status = {
                    "enabled": True,
                    "ready": kb.count() > 0,
                    "store": kb.status(),
                    "seed": ready.get("seed"),
                }
        except Exception as exc:
            logger.warning("Full RAG auto-seed skipped: %s", exc)

    try:
        result = full_rag_ask(
            payload.query,
            k=payload.k,
            min_score=payload.min_score,
            domain=payload.domain,
            model=payload.model,
            synthesize=payload.synthesize,
            kb=kb,
            core=core if payload.use_alive else None,
            use_alive=payload.use_alive,
        )
        # Persist to short chat history for continuity
        if result.get("answer"):
            add_to_history("user", payload.query)
            add_to_history(
                "assistant",
                result.get("answer") or "",
                active_agents=["HoloKai Alive"] if result.get("alive") else ["HoloKai RAG"],
                fragments=result.get("contexts") or [],
            )
        grounded = attach_grounding(result, query=payload.query, answer_key="answer", contexts_key="contexts")
        grounded["canon_persist"] = persist_grounded(payload.query, grounded.get("grounded") or {})
        return grounded
    except Exception as exc:
        logger.exception("Full RAG ask failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/api/alive/ask")
async def alive_ask_endpoint(payload: AliveAskRequest):
    """Grok-class Alive ask: graph + live memory + vector + multi-agent + optional web."""
    try:
        from holokai_alive import alive_ask, ensure_alive_seeded
    except ImportError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if core.kb is None or core.kb.count() == 0:
        try:
            ensure_alive_seeded(force=False)
            from knowledge_base import KnowledgeBase

            core.kb = KnowledgeBase()
            for agent in core.agents.values():
                if hasattr(agent, "kb"):
                    agent.kb = core.kb
        except Exception as exc:
            logger.warning("Alive auto-seed: %s", exc)

    try:
        result = alive_ask(
            payload.query,
            k=payload.k,
            min_score=payload.min_score,
            domain=payload.domain,
            model=payload.model,
            synthesize=payload.synthesize,
            kb=core.kb,
            core=core if payload.use_core else None,
            use_core=payload.use_core,
            use_web=payload.use_web,
            session_id=payload.session_id,
            learn=payload.learn,
            fast=payload.fast,
        )
        if result.get("answer"):
            add_to_history("user", payload.query)
            add_to_history(
                "assistant",
                result.get("answer") or "",
                active_agents=["HoloKai Alive"],
                fragments=result.get("contexts") or [],
            )
        grounded = attach_grounding(result, query=payload.query, answer_key="answer", contexts_key="contexts")
        grounded["canon_persist"] = persist_grounded(payload.query, grounded.get("grounded") or {})
        return grounded
    except Exception as exc:
        logger.exception("Alive ask failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.get("/api/alive/status")
async def alive_status_endpoint():
    try:
        from holokai_alive import alive_status

        return alive_status()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/alive/seed")
async def alive_seed_endpoint(force: bool = False):
    """Seed full graph + live memories + vector active store."""
    try:
        from holokai_alive import ensure_alive_seeded

        summary = ensure_alive_seeded(force=force)
        try:
            from knowledge_base import KnowledgeBase

            kb = KnowledgeBase()
            core.kb = kb
            for agent in core.agents.values():
                if hasattr(agent, "kb"):
                    agent.kb = kb
            core.rag_status = {
                "enabled": True,
                "ready": kb.count() > 0,
                "store": kb.status(),
                "seed": summary.get("vector"),
            }
        except Exception as exc:
            logger.warning("Rebind KB after alive seed: %s", exc)
        return {"ok": True, **summary}
    except Exception as exc:
        logger.exception("Alive seed failed")
        raise HTTPException(status_code=503, detail=str(exc)) from exc


# ----------------------------------------------------------------------
# HoloKai World Model v1 & Artifact Resolution Endpoints
# ----------------------------------------------------------------------
@app.get("/api/world/state")
async def get_world_state_endpoint():
    """Retrieve full live HoloKai World Model state with entities and physical observations."""
    try:
        from world_memory_store import get_world_store

        return get_world_store().get_world_state()
    except Exception as exc:
        logger.exception("Failed to get world state")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/world/entities")
async def get_world_entities_endpoint():
    """List all registered entities in the World Model."""
    try:
        from world_memory_store import get_world_store

        return {"entities": get_world_store().get_world_state().get("entities", [])}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/world/entities/{entity_id}")
async def get_world_entity_endpoint(entity_id: str):
    """Retrieve a single entity from the World Model."""
    from world_memory_store import get_world_store

    ent = get_world_store().get_entity(entity_id)
    if not ent:
        raise HTTPException(status_code=404, detail="Entity not found")
    return ent


@app.get("/api/world/artifacts/{entity_id}")
async def get_world_artifact_endpoint(entity_id: str):
    """Retrieve artifact entity with its complete multi-channel evidence and academic provenance."""
    from world_memory_store import get_world_store

    store = get_world_store()
    ent = store.get_entity(entity_id)
    if not ent:
        raise HTTPException(status_code=404, detail="Artifact entity not found")
    evidence = store.get_artifact_evidence(entity_id)
    provenance = store.get_artifact_provenance(entity_id)
    return {
        "entity": ent,
        "evidence": evidence,
        "provenance": provenance,
    }


@app.get("/api/world/observations")
async def get_world_observations_endpoint(limit: int = Query(50, ge=1, le=200)):
    """Retrieve historical and live physical observations from Isaac Sim / Isaac ROS."""
    try:
        from world_memory_store import get_world_store

        return {"observations": get_world_store().get_observations(limit=limit)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/world/observations/{observation_id}")
async def get_world_observation_by_id_endpoint(observation_id: str):
    """Retrieve an observation by its unique correlation ID."""
    from world_memory_store import get_world_store

    obs = get_world_store().get_observation(observation_id)
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    return obs


@app.post("/api/artifacts/resolve")
async def resolve_artifact_endpoint(payload: ArtifactResolveRequest):
    """Resolve physical observation using Multimodal Evidence Fusion and persist to World Model."""
    try:
        from services.artifact_resolver.resolver import Evidence, MultimodalArtifactResolver
        from world_memory_store import get_world_store

        store = get_world_store()
        resolver = MultimodalArtifactResolver(
            resolved_threshold=payload.resolvedThreshold,
            ambiguity_margin=payload.ambiguityMargin,
            conflict_penalty_weight=payload.conflictPenaltyWeight,
        )

        obs = payload.observation
        detector_conf = float(obs.get("confidence", obs.get("detector", {}).get("confidence", 0.0)))
        perception_label = str(obs.get("label", obs.get("detection", {}).get("label", "")))

        vector_ev = [Evidence(**e) if isinstance(e, dict) else e for e in payload.vector]
        graph_ev = [Evidence(**e) if isinstance(e, dict) else e for e in payload.graph]
        metadata_ev = [Evidence(**e) if isinstance(e, dict) else e for e in payload.metadata]
        provenance_ev = [Evidence(**e) if isinstance(e, dict) else e for e in payload.provenance]

        res = resolver.resolve(
            perception=detector_conf,
            vector=vector_ev,
            graph=graph_ev,
            metadata=metadata_ev,
            provenance=provenance_ev,
            perception_label=perception_label,
        )

        obs_id = str(obs.get("observationId") or obs.get("id") or f"obs-{datetime.now().strftime('%Y%m%d%H%M%S')}")

        # Commit observation to World Model
        store.save_observation({
            "observationId": obs_id,
            "entity_id": res.entity_id,
            "timestamp": obs.get("timestamp", datetime.now(timezone.utc).isoformat()),
            "perception": obs.get("detector", obs),
            "detection": obs.get("detection", {}),
            "pose": obs.get("pose", {}),
            "visualProperties": obs.get("visualProperties", {}),
            "identity": {
                "status": res.status,
                "entityId": res.entity_id,
                "matchScore": res.match_score,
            },
            "provenance": obs.get("provenance", {}),
        })

        # Save resolution & multi-channel evidence records
        store.save_resolution(obs_id, {
            "entityId": res.entity_id,
            "status": res.status,
            "matchScore": res.match_score,
            "scores": res.scores,
            "conflictPenalty": res.scores.get("conflictPenalty", 0.0),
            "policyVersion": res.policy_version,
            "evidence": res.evidence,
        })

        # Log state transition event
        store.log_state_event(
            event_type="ARTIFACT_RESOLVED" if res.status == "RESOLVED" else "ARTIFACT_OBSERVED",
            entity_id=res.entity_id,
            observation_id=obs_id,
            payload={
                "status": res.status,
                "matchScore": res.match_score,
                "pose": obs.get("pose", {}),
            },
        )

        return {
            "status": res.status,
            "entityId": res.entity_id,
            "matchScore": res.match_score,
            "scores": res.scores,
            "evidence": res.evidence,
            "conflicts": res.conflicts,
            "policyVersion": res.policy_version,
            "observationId": obs_id,
        }
    except Exception as exc:
        logger.exception("Artifact resolution failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/graph/status")
async def graph_status():
    try:
        from knowledge_graph import get_graph

        return get_graph().status()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/graph/search")
async def graph_search(payload: RagRetrieveRequest):
    try:
        from knowledge_graph import get_graph
        from graph_seed import seed_knowledge_graph

        g = get_graph()
        if not g.nodes:
            seed_knowledge_graph(force=False)
            g = get_graph()
        hits = g.search(
            payload.query,
            top_k=payload.k,
            domain=payload.domain,
            empire=payload.empire,
        )
        return {"query": payload.query, "count": len(hits), "nodes": hits}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/memory/status")
async def memory_status():
    try:
        from memory_store import get_memory

        return get_memory().status()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/memory/retrieve")
async def memory_retrieve(payload: RagRetrieveRequest):
    try:
        from memory_store import get_memory

        mem = get_memory()
        packs = mem.retrieve(payload.query, k_episodic=payload.k, k_semantic=payload.k)
        return {
            "query": payload.query,
            "packs": packs,
            "context": mem.to_context_block(payload.query),
            "counts": mem.counts(),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/memory/consolidate")
async def memory_consolidate(
    promote_to_graph: bool = True,
    reindex_vector: bool = False,
):
    """
    Full consolidation pass over the memory store.
    Clusters episodic memories, promotes durable facts into knowledge graph, optionally re-indexes vector store.
    """
    try:
        from memory_consolidator import consolidate_memories

        result = consolidate_memories(
            promote_to_graph=promote_to_graph,
            reindex_vector=reindex_vector,
        )
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


class FusionRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    k: int = Field(12, ge=1, le=30)
    min_score: float = Field(0.22, ge=0.0, le=1.0)
    domain: str | None = None
    graph_hops: int = Field(1, ge=0, le=3)
    use_sparse: bool = True
    use_memory: bool = True
    use_reply: bool = True


@app.post("/api/rag/fusion")
async def rag_fusion(payload: FusionRequest):
    """
    Fusion retrieve: vector + graph hops + live memory + reply store, RRF-fused.
    Returns per-channel stats and fused context list.
    """
    try:
        from retrieve_fusion import fused_retrieve
    except ImportError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if core.kb is None:
        try:
            from knowledge_base import KnowledgeBase
            core.kb = KnowledgeBase()
        except Exception as exc:
            raise HTTPException(
                status_code=503,
                detail=f"Vector knowledge base not loaded ({exc}). POST /api/rag/seed first.",
            ) from exc

    try:
        result = fused_retrieve(
            payload.query,
            kb=core.kb,
            k=payload.k,
            domain=payload.domain,
            min_score=payload.min_score,
            graph_hops=payload.graph_hops,
            use_sparse=payload.use_sparse,
            use_memory=payload.use_memory,
            use_reply=payload.use_reply,
        )
        return result
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/api/rag/retrieve")
async def rag_retrieve(payload: RagRetrieveRequest):
    """
    Semantic retrieve for frontend / tools — same nomic-embed-text space as agents.
    Does not run the full multi-agent supervisor (use POST /api/query for that).
    """
    if core.kb is None:
        # Full RAG: try lazy init with hashing/minilm if Ollama embeds down
        try:
            from knowledge_base import KnowledgeBase

            core.kb = KnowledgeBase()
        except Exception as exc:
            raise HTTPException(
                status_code=503,
                detail=f"Vector knowledge base not loaded ({exc}). POST /api/rag/seed or /api/rag/ask.",
            ) from exc
    try:
        chunks = core.kb.retrieve(
            payload.query,
            domain=payload.domain,
            top_k=payload.k,
            min_score=payload.min_score,
            empire=payload.empire,
            source=payload.source,
        )
        contexts = [
            {
                "content": c["text"],
                "score": c.get("score"),
                "title": (c.get("metadata") or {}).get("title")
                or (c.get("metadata") or {}).get("source")
                or "Knowledge",
                "metadata": c.get("metadata") or {},
            }
            for c in chunks
        ]
        prompt_parts = []
        for ctx in contexts:
            prompt_parts.append(f"[{ctx['title']}]\n{ctx['content']}")
        return {
            "query": payload.query,
            "count": len(contexts),
            "contexts": contexts,
            "prompt": "\n\n---\n\n".join(prompt_parts),
            "backend": "python-chroma",
            "embeddings": core.kb.embedder.status() if hasattr(core.kb, "embedder") else None,
        }
    except Exception as exc:
        logger.exception("RAG retrieve failed")
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/api/model/synthesize")
async def model_synthesize_endpoint(payload: GatewaySynthesisRequest):
    try:
        return synthesize_with_gateway(
            query=payload.query,
            contexts=payload.contexts,
            prefer_hosted=payload.prefer_hosted,
            hosted_model=payload.hosted_model,
            ollama_model=payload.ollama_model,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/api/grounded/ask")
async def grounded_ask_endpoint(payload: GroundedAskRequest):
    """
    Synchronous grounded ask (kept for compatibility).
    For production long-running synthesis, use POST /api/jobs/grounded-ask.
    """
    try:
        return execute_grounded_ask(payload)
    except Exception as exc:
        logger.exception("Grounded ask failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/api/jobs/grounded-ask")
async def grounded_ask_job_endpoint(payload: GroundedAskRequest):
    def _runner(raw: Dict[str, Any]) -> Dict[str, Any]:
        model = GroundedAskRequest(**raw)
        return execute_grounded_ask(model)

    return submit_job(job_type="grounded_synthesis", payload=payload.model_dump(), runner=_runner)


@app.get("/api/jobs")
async def jobs_list_endpoint(
    job_type: str | None = None,
    status: str | None = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    return jobs_list(job_type=job_type, status=status, limit=limit, offset=offset)


@app.get("/api/jobs/{job_id}")
async def job_status_endpoint(job_id: str):
    row = job_get(job_id)
    if not row:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    return row


@app.get("/api/storage/status")
async def storage_status_endpoint():
    return storage_status()


@app.post("/api/storage/init")
async def storage_init_endpoint(request: Request):
    role = (request.headers.get("x-holokai-role") or "public-reader").strip().lower()
    if role not in {"administrator"}:
        raise HTTPException(status_code=403, detail="Administrator role required")
    return ensure_storage_ready()


@app.get("/api/library/facets")
async def library_facets_endpoint():
    return library_facets()


@app.get("/api/library/search")
async def library_search_endpoint(
    q: str = Query("", description="Free text search"),
    region: str | None = None,
    era: str | None = None,
    language: str | None = None,
    evidence_type: str | None = None,
    editorial_status: str | None = "reviewed",
    peer_reviewed: bool | None = None,
    civilization: str | None = None,
    type: str | None = Query(None, description="Source type / item_type filter"),
    limit: int = Query(25, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    return library_search_sources(
        q=q,
        region=region,
        era=era,
        language=language,
        evidence_type=evidence_type,
        editorial_status=editorial_status,
        peer_reviewed=peer_reviewed,
        civilization=civilization,
        item_type=type,
        limit=limit,
        offset=offset,
    )


@app.get("/api/library/{slug}")
async def library_source_endpoint(slug: str):
    row = library_get_source(slug)
    if not row:
        raise HTTPException(status_code=404, detail=f"Source not found: {slug}")
    return row


@app.get("/api/studio/queue")
async def studio_queue_endpoint(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0)):
    return library_search_sources(editorial_status=None, limit=limit, offset=offset)


@app.post("/api/studio/review")
async def studio_review_endpoint(payload: StudioReviewRequest, request: Request):
    role = (request.headers.get("x-holokai-role") or "public-reader").strip().lower()
    if role not in {"editor", "reviewer", "administrator"}:
        raise HTTPException(status_code=403, detail="Editor, reviewer, or administrator role required")
    try:
        return library_review_source(payload.slug, payload.decision, reviewer_role=role, notes=payload.notes)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/studio/import-ris")
async def studio_import_ris_endpoint(
    payload: StudioImportRisRequest,
    request: Request,
    enqueue: bool = Query(True, description="Queue import in background job"),
):
    role = (request.headers.get("x-holokai-role") or "public-reader").strip().lower()
    if role not in {"administrator", "editor"}:
        raise HTTPException(status_code=403, detail="Administrator/editor role required")

    def _runner(raw: Dict[str, Any]) -> Dict[str, Any]:
        return import_ris_file(raw["path"], verify_doi=bool(raw.get("verify_doi")))

    if enqueue:
        return submit_job(
            job_type="ris_import",
            payload=payload.model_dump(),
            runner=_runner,
        )

    try:
        return import_ris_file(payload.path, verify_doi=payload.verify_doi)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/jobs/import-ris")
async def import_ris_job_endpoint(payload: StudioImportRisRequest, request: Request):
    role = (request.headers.get("x-holokai-role") or "public-reader").strip().lower()
    if role not in {"administrator", "editor"}:
        raise HTTPException(status_code=403, detail="Administrator/editor role required")

    def _runner(raw: Dict[str, Any]) -> Dict[str, Any]:
        return import_ris_file(raw["path"], verify_doi=bool(raw.get("verify_doi")))

    return submit_job(
        job_type="ris_import",
        payload=payload.model_dump(),
        runner=_runner,
    )


@app.post("/api/query", response_model=QueryResponse)
async def process_query(payload: QueryRequest) -> Dict[str, Any]:
    query = payload.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        # Detect greeting animation
        greeting_animation = detect_greeting_animation(query)

        # Store user message
        add_to_history("user", query)

        # Process through multi-agent system
        response = core.process_query(query)
        result = core.to_dict(response)

        # Add greeting animation to response
        result["greeting_animation"] = greeting_animation

        # Enrich with graph + live memory fragments (non-destructive)
        try:
            from knowledge_graph import get_graph
            from memory_store import get_memory

            g_hits = get_graph().to_rag_contexts(query, top_k=3)
            m_hits = get_memory().to_rag_contexts(query, top_k=2)
            for h in g_hits + m_hits:
                result.setdefault("fragments", []).append(
                    {
                        "content": h.get("content"),
                        "confidence": float(h.get("score") or 0.7),
                        "agent_origin": "Ancestral Graph"
                        if h.get("retrieval", "").startswith("graph")
                        else "Live Memory",
                        "source_type": h.get("retrieval") or "memory",
                        "citation": h.get("title"),
                        "metadata": h.get("metadata") or {},
                    }
                )
            # Learn from multi-agent summary
            if result.get("summary"):
                get_memory().learn_from_exchange(
                    query,
                    result["summary"],
                    confidence=float(result.get("confidence") or 0.7),
                    agents=result.get("active_agents") or [],
                    mode="multi_agent",
                )
        except Exception as enrich_exc:
            logger.warning("Query enrich/learn skipped: %s", enrich_exc)

        # Build claim-level grounding for /api/query response using fragments as evidence contexts
        frag_contexts = []
        for f in result.get("fragments", []):
            frag_contexts.append(
                {
                    "content": f.get("content") if isinstance(f, dict) else "",
                    "title": (f.get("citation") if isinstance(f, dict) else None)
                    or (f.get("metadata", {}).get("title") if isinstance(f, dict) else None)
                    or "Knowledge Fragment",
                    "score": (f.get("confidence") if isinstance(f, dict) else None),
                    "retrieval": (f.get("source_type") if isinstance(f, dict) else None),
                    "metadata": (f.get("metadata") if isinstance(f, dict) else {}) or {},
                }
            )
        # attach_grounding reads contexts from a payload key; use a temporary key
        result["__tmp__"] = frag_contexts
        attach_grounding(result, query=query, answer_key="summary", contexts_key="__tmp__")
        result.pop("__tmp__", None)
        result["canon_persist"] = persist_grounded(query, result.get("grounded") or {})

        # Store assistant response
        add_to_history(
            "assistant",
            result.get("summary", ""),
            fragments=result.get("fragments", []),
            active_agents=result.get("active_agents", []),
            emotions=result.get("emotions", {}),
            greeting_animation=greeting_animation,
            grounded=result.get("grounded") or {},
        )

        return result
    except Exception as exc:
        logger.exception("Unhandled error while processing query")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/history")
async def get_history():
    return {"history": chat_history, "count": len(chat_history)}


@app.post("/api/stt")
@app.post("/api/speech-to-text")
async def speech_to_text(request: Request):
    """Speech-to-text via Deepgram nova-3."""
    return await deepgram_stt(request)


@app.post("/api/tts")
async def text_to_speech(request: Request):
    """Text-to-speech via ElevenLabs."""
    return await elevenlabs_tts(request)


@app.post("/api/elevenlabs/tts")
async def elevenlabs_tts(request: Request):
    """ElevenLabs TTS proxy endpoint with fallback to edge-tts."""
    try:
        data = await request.json()
    except Exception:
        data = {}

    text = data.get("text", "HoloKai Oracle system active.")
    api_key = os.getenv("ELEVENLABS_API_KEY") or os.getenv("VITE_ELEVENLABS_API_KEY") or "sk_a982b655eb5e4321ffb435b7e886aa7feaa90bc7812f305a"
    voice_id = data.get("voice_id") or os.getenv("ELEVENLABS_VOICE_ID") or os.getenv("VITE_ELEVENLABS_VOICE_ID") or "Woqh9nzF1s8TxOxMqlo0"

    if api_key:
        try:
            import httpx
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                    headers={
                        "Content-Type": "application/json",
                        "xi-api-key": api_key,
                        "Accept": "audio/mpeg"
                    },
                    json={
                        "text": text,
                        "model_id": data.get("model_id", "eleven_multilingual_v2"),
                        "voice_settings": data.get("voice_settings", {"stability": 0.65, "similarity_boost": 0.8})
                    }
                )
                if resp.is_success:
                    return Response(content=resp.content, media_type="audio/mpeg")
        except Exception as exc:
            logger.warning("ElevenLabs proxy failed, falling back: %s", exc)

    # Fallback to Deepgram TTS (aura-zeus-en) or edge-tts
    try:
        dg_key = os.getenv("DEEPGRAM_API_KEY") or os.getenv("VITE_DEEPGRAM_API_KEY") or "1b696cc92d917abe19bf14bdcb77d20a6a52f814"
        if dg_key:
            import httpx
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    "https://api.deepgram.com/v1/speak?model=aura-zeus-en",
                    headers={"Authorization": f"Token {dg_key}", "Content-Type": "application/json", "Accept": "audio/mp3"},
                    json={"text": text}
                )
                if resp.is_success:
                    return Response(content=resp.content, media_type="audio/mp3")
    except Exception as exc:
        logger.warning("Deepgram TTS fallback failed: %s", exc)

    try:
        import edge_tts
        import io
        communicate = edge_tts.Communicate(text, voice="en-US-JennyNeural")
        buf = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                buf.write(chunk["data"])
        return Response(content=buf.getvalue(), media_type="audio/mpeg")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {exc}") from exc


@app.post("/api/deepgram/tts")
async def deepgram_tts(request: Request):
    """Deepgram TTS proxy endpoint using aura-zeus-en (Cloud Voice Only)."""
    try:
        data = await request.json()
    except Exception:
        data = {}

    text = data.get("text", "HoloKai Oracle system active.")
    api_key = os.getenv("DEEPGRAM_API_KEY") or os.getenv("VITE_DEEPGRAM_API_KEY") or "1b696cc92d917abe19bf14bdcb77d20a6a52f814"
    model = data.get("model", "aura-zeus-en")

    if api_key and text:
        try:
            import httpx
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    f"https://api.deepgram.com/v1/speak?model={model}",
                    headers={
                        "Authorization": f"Token {api_key}",
                        "Content-Type": "application/json",
                        "Accept": "audio/mp3"
                    },
                    json={"text": text}
                )
                if resp.is_success:
                    return Response(content=resp.content, media_type="audio/mp3")
        except Exception as exc:
            logger.warning("Deepgram TTS proxy failed: %s", exc)
            raise HTTPException(status_code=502, detail=f"Deepgram TTS synthesis failed: {exc}") from exc

    raise HTTPException(status_code=400, detail="Deepgram API key missing or invalid request payload.")


@app.post("/api/deepgram/stt")
async def deepgram_stt(request: Request):
    """Deepgram STT proxy endpoint using nova-3 (Cloud Voice Only)."""
    content_type = request.headers.get("content-type", "audio/webm")
    body_bytes = await request.body()

    api_key = os.getenv("DEEPGRAM_API_KEY") or os.getenv("VITE_DEEPGRAM_API_KEY") or "1b696cc92d917abe19bf14bdcb77d20a6a52f814"
    if api_key and body_bytes:
        try:
            import httpx
            send_buffer = body_bytes
            dg_content_type = content_type

            if "application/json" in content_type:
                try:
                    import base64
                    import json
                    payload = json.loads(body_bytes.decode("utf-8"))
                    if payload.get("audio"):
                        raw_b64 = payload["audio"].split(",")[-1]
                        send_buffer = base64.b64decode(raw_b64)
                        dg_content_type = payload.get("mimeType", "audio/webm")
                except Exception:
                    pass

            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    "https://api.deepgram.com/v1/listen?model=nova-3&version=v1&language=en&smart_format=true&punctuate=true",
                    headers={
                        "Authorization": f"Token {api_key}",
                        "Content-Type": dg_content_type
                    },
                    content=send_buffer
                )
                if resp.is_success:
                    dg_data = resp.json()
                    channels = dg_data.get("results", {}).get("channels", [])
                    transcript = ""
                    confidence = 0.95
                    if channels and channels[0].get("alternatives"):
                        alt = channels[0]["alternatives"][0]
                        transcript = alt.get("transcript", "")
                        confidence = alt.get("confidence", 0.95)
                    return {"transcript": transcript, "confidence": confidence, "raw": dg_data}
        except Exception as exc:
            logger.warning("Deepgram proxy failed: %s", exc)

    return {"transcript": "STT offline or key missing", "confidence": 0.0}


@app.get("/api/ollama/status")
async def ollama_status():
    """Gemini AI status endpoint."""
    has_key = bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"))
    return {
        "ok": has_key,
        "provider": "gemini",
        "model": "gemini-1.5-flash",
        "ready": has_key,
    }


@app.get("/api/ollama/tags")
async def ollama_tags():
    """List models — returns Gemini models for frontend components."""
    return {
        "models": [
            {"name": "gemini-1.5-flash", "model": "gemini-1.5-flash"},
            {"name": "gemini-2.0-flash", "model": "gemini-2.0-flash"},
            {"name": "gemini-3.5-flash", "model": "gemini-3.5-flash"},
        ],
        "host": "generativelanguage.googleapis.com",
    }


@app.post("/api/ollama/chat")
async def ollama_chat(payload: OllamaChatRequest):
    """Chat endpoint proxying through Google Gemini."""
    try:
        from model_gateway import _hosted_synthesize
        # Extract last user query
        query = ""
        for m in reversed(payload.messages):
            if m.get("role") == "user":
                query = m.get("content", "")
                break

        gw = _hosted_synthesize(payload.messages, model=payload.model or "gemini-1.5-flash")
        answer = gw.get("answer", "")
        return {
            "model": gw.get("model", "gemini-1.5-flash"),
            "message": {"role": "assistant", "content": answer},
            "done": True,
        }
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini chat failed: {exc}") from exc


@app.post("/api/web_search")
async def web_search(payload: WebSearchRequest):
    """Proxy to Ollama Cloud web search API (requires OLLAMA_API_KEY)."""
    api_key = os.getenv("OLLAMA_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="OLLAMA_API_KEY not set. Get one at https://ollama.com/settings/keys",
        )
    try:
        import httpx
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                "https://ollama.com/api/web_search",
                headers={"Authorization": f"Bearer {api_key}"},
                json={"query": payload.query, "max_results": payload.max_results},
            )
            if not resp.is_success:
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"Ollama web search error: {resp.text[:300]}",
                )
            data = resp.json()
            return {"results": data.get("results", [])}
    except ImportError:
        raise HTTPException(status_code=503, detail="httpx not installed. pip install httpx")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Web search failed: {exc}")


@app.post("/api/web_fetch")
async def web_fetch(url: str = Form(...)):
    """Proxy to Ollama Cloud web fetch API."""
    api_key = os.getenv("OLLAMA_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OLLAMA_API_KEY not set")
    try:
        import httpx
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                "https://ollama.com/api/web_fetch",
                headers={"Authorization": f"Bearer {api_key}"},
                json={"url": url},
            )
            if not resp.is_success:
                raise HTTPException(status_code=resp.status_code, detail=resp.text[:300])
            return resp.json()
    except ImportError:
        raise HTTPException(status_code=503, detail="httpx not installed")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Web fetch failed: {exc}")


@app.delete("/api/history")
async def clear_history():
    chat_history.clear()
    return {"status": "cleared", "count": 0}


# ----------------------------------------------------------------------
# Gemini API Full-Stack Endpoints
# ----------------------------------------------------------------------
class GeminiGenerateRequest(BaseModel):
    prompt: str = Field(..., description="User prompt or query")
    model: str = Field("gemini-3.5-flash", description="Gemini model alias or ID")
    system_instruction: str | None = None
    enable_search: bool = False
    enable_maps: bool = False
    thinking_level: str | None = None  # "HIGH", "LOW", "MINIMAL"


class GeminiChatRequest(BaseModel):
    messages: List[Dict[str, Any]] = Field(default_factory=list)
    model: str = Field("gemini-3.5-flash")
    system_instruction: str | None = None
    enable_search: bool = False
    enable_maps: bool = False
    thinking_level: str | None = None


class GeminiImageRequest(BaseModel):
    prompt: str = Field(..., description="Image description prompt")
    model: str = Field("gemini-3-pro-image-preview", description="Image generation model")
    image_size: str = Field("1K", description="Resolution: 1K, 2K, 4K")
    aspect_ratio: str = Field("1:1", description="1:1, 16:9, 4:3, 3:4, 9:16")
    image_base64: str | None = None


@app.post("/api/gemini/generate")
async def gemini_generate(payload: GeminiGenerateRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY environment variable is not set.")

    model = payload.model
    # Map model aliases if provided
    model_aliases = {
        "gemini-flash": "gemini-3.5-flash",
        "gemini-lite": "gemini-3.1-flash-lite",
        "gemini-pro": "gemini-3.1-pro-preview",
        "gemini-live": "gemini-3.1-flash-live-preview",
        "gemini-image": "gemini-3-pro-image-preview",
    }
    target_model = model_aliases.get(model, model)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={api_key}"

    body: Dict[str, Any] = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": payload.prompt}]
            }
        ]
    }

    if payload.system_instruction:
        body["systemInstruction"] = {
            "parts": [{"text": payload.system_instruction}]
        }

    tools = []
    if payload.enable_search:
        tools.append({"googleSearch": {}})
    if payload.enable_maps and not payload.enable_search:  # Maps cannot be combined with Search in Gemini REST
        tools.append({"googleMaps": {}})

    if tools:
        body["tools"] = tools

    if payload.thinking_level:
        body["thinkingConfig"] = {"thinkingLevel": payload.thinking_level.upper()}

    try:
        import httpx
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "aistudio-build",
                },
                json=body,
            )
            if not resp.is_success:
                logger.error("Gemini API Error (%d): %s", resp.status_code, resp.text)
                raise HTTPException(status_code=resp.status_code, detail=f"Gemini API Error: {resp.text[:400]}")

            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                return {"text": "No content generated.", "grounding": None}

            first_cand = candidates[0]
            parts = first_cand.get("content", {}).get("parts", [])
            text_parts = [p.get("text", "") for p in parts if "text" in p]
            text = "\n".join(text_parts).strip()

            grounding = first_cand.get("groundingMetadata", None)

            return {
                "text": text or "No textual response received.",
                "grounding": grounding,
                "model": target_model,
                "thinking": first_cand.get("thinking", None)
            }

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed calling Gemini generate")
        raise HTTPException(status_code=500, detail=f"Gemini generation failed: {exc}")


@app.post("/api/gemini/chat")
async def gemini_chat(payload: GeminiChatRequest):
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("FIREBASE_API_KEY") or "AIzaSyAY5G-jrg4FQjYt7WZdXSCmK4lSj6ZsuxE"

    target_model = payload.model
    if target_model in ("gemini-pro", "gemini-3.1-pro-preview"):
        target_model = "gemini-1.5-flash"
    elif target_model in ("gemini-lite", "gemini-3.1-flash-lite"):
        target_model = "gemini-1.5-flash"
    elif target_model in ("gemini-flash", "gemini-3.5-flash"):
        target_model = "gemini-1.5-flash"
    else:
        target_model = "gemini-1.5-flash"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={api_key}"

    formatted_contents = []
    for msg in payload.messages:
        role = msg.get("role", "user")
        if role == "assistant":
            role = "model"
        content = msg.get("content") or msg.get("text") or ""
        formatted_contents.append({
            "role": role,
            "parts": [{"text": content}]
        })

    body: Dict[str, Any] = {"contents": formatted_contents}

    if payload.system_instruction:
        body["systemInstruction"] = {
            "parts": [{"text": payload.system_instruction}]
        }

    try:
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "aistudio-build",
                },
                json=body,
            )
            if resp.is_success:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    first_cand = candidates[0]
                    parts = first_cand.get("content", {}).get("parts", [])
                    text = "\n".join(p.get("text", "") for p in parts).strip()
                    grounding = first_cand.get("groundingMetadata", None)
                    return {
                        "text": text or "Knowledge synthesis complete.",
                        "grounding": grounding,
                        "model": target_model
                    }
    except Exception as exc:
        logger.warning("Direct Gemini generate failed, attempting core RAG fallback: %s", exc)

    # Fallback to civilization core synthesis
    try:
        from model_gateway import synthesize_with_gateway
        query = ""
        for m in reversed(payload.messages):
            if m.get("role") == "user":
                query = m.get("content", "")
                break
        gw = synthesize_with_gateway(query=query or "HoloKai Oracle query", contexts=[])
        return {
            "text": gw.get("answer", "HoloKai Oracle system active."),
            "model": "holokai-civilization-core",
            "grounding": None
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gemini Chat failed: {exc}")


@app.post("/api/gemini/generate-image")
async def gemini_generate_image(payload: GeminiImageRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY environment variable is not set.")

    # Image models: gemini-3-pro-image-preview, gemini-3.1-flash-image, gemini-3.1-flash-lite-image
    model = payload.model
    if model in ["gemini-3-pro-image", "pro-image"]:
        model = "gemini-3-pro-image-preview"
    elif model in ["flash-image"]:
        model = "gemini-3.1-flash-image"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    parts: List[Dict[str, Any]] = []
    if payload.image_base64:
        # Reference image edit mode
        parts.append({
            "inlineData": {
                "mimeType": "image/png",
                "data": payload.image_base64.split(",")[-1] if "," in payload.image_base64 else payload.image_base64
            }
        })

    parts.append({"text": payload.prompt})

    body = {
        "contents": [{"parts": parts}],
        "config": {
            "imageConfig": {
                "aspectRatio": payload.aspect_ratio or "1:1",
                "imageSize": payload.image_size or "1K"
            }
        }
    }

    try:
        import httpx
        async with httpx.AsyncClient(timeout=90.0) as client:
            resp = await client.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "aistudio-build",
                },
                json=body,
            )
            if not resp.is_success:
                logger.error("Gemini Image Gen Error (%d): %s", resp.status_code, resp.text)
                raise HTTPException(status_code=resp.status_code, detail=f"Gemini Image Gen Error: {resp.text[:400]}")

            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise HTTPException(status_code=500, detail="No candidate returned from Gemini image model.")

            cand_parts = candidates[0].get("content", {}).get("parts", [])
            image_url = None
            text_output = ""

            for p in cand_parts:
                if "inlineData" in p:
                    b64 = p["inlineData"].get("data", "")
                    mime = p["inlineData"].get("mimeType", "image/png")
                    image_url = f"data:{mime};base64,{b64}"
                elif "text" in p:
                    text_output += p["text"] + "\n"

            if not image_url:
                # Fallback SVG generation if API return was purely textual
                image_url = f"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 1024 1024'><rect width='1024' height='1024' fill='%230b0f19'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2338bdf8' font-size='24'>{payload.prompt[:40]}</text></svg>"

            return {
                "imageUrl": image_url,
                "text": text_output.strip(),
                "size": payload.image_size,
                "model": model
            }
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Image generation error")
        raise HTTPException(status_code=500, detail=f"Image generation failed: {exc}")


# ----------------------------------------------------------------------
# Entrypoint
# ----------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

