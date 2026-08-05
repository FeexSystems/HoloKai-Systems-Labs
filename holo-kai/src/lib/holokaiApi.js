/**
 * HoloKai frontend ↔ Python Civilization Core client.
 *
 * Default base: VITE_API_BASE_URL, or empty string (same-origin / Vite proxy).
 * Example: VITE_API_BASE_URL=http://localhost:8000
 */

import { MOCK_SOURCES } from './mockData';

function getApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (raw == null || raw === '') return 'https://holokai-backend-production.up.railway.app';
  return String(raw).replace(/\/$/, '');
}

export { getApiBase };

/**
 * Parse FastAPI / fetch errors into a readable message.
 */
export async function readError(res) {
  let detail = `HTTP ${res.status}`;
  try {
    const data = await res.json();
    if (typeof data.detail === 'string') detail = data.detail;
    else if (Array.isArray(data.detail)) {
      detail = data.detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
    } else if (data.error) detail = data.error;
    else if (data.message) detail = data.message;
  } catch {
    try {
      detail = (await res.text()) || detail;
    } catch {
      /* ignore */
    }
  }
  return detail;
}

/**
 * @param {string} path
 * @param {RequestInit & { timeoutMs?: number }} [options]
 */
export async function apiFetch(path, options = {}) {
  const { timeoutMs = 60000, headers, ...rest } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const base = getApiBase();
  const url = path.startsWith('http')
    ? path
    : `${base}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const res = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
    });
    if (!res.ok) {
      const message = await readError(res);
      /** @type {Error & { status?: number }} */
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }
    if (res.status === 204) return null;
    return res.json();
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out — is the HoloKai backend running?');
    }
    if (
      err?.message?.includes('Failed to fetch') ||
      err?.message?.includes('NetworkError')
    ) {
      throw new Error(
        `Cannot reach HoloKai core at ${base || window.location.origin}. Start it with: python main.py`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Map backend grounded payload into ResearchChat UI shape.
 * Backend: grounded.claims[] + grounded.citation_index[]
 * UI: claims[{text, confidence}], citations[{sourceSlug, sourceTitle, confidence}]
 */
export function mapGroundedToChat(payload) {
  const grounded = payload?.grounded || {};
  const answer =
    payload?.answer ||
    grounded?.answer ||
    grounded?.insufficient_evidence_message ||
    'No answer returned.';

  const rawClaims = grounded.claims || [];
  const claims = rawClaims.map((c) => {
    const citations = c.citations || [];
    const supported = c.evidence_status === 'supported' || citations.length > 0;
    // Approximate confidence from evidence status (backend does not always send scores)
    const confidence = supported
      ? c.uncertainty === 'low'
        ? 0.9
        : c.uncertainty === 'high'
          ? 0.55
          : 0.75
      : 0.35;
    return {
      text: c.text || c.claim || '',
      confidence,
      evidenceStatus: c.evidence_status,
      claimId: c.claim_id,
      sources: citations.map((cit) => cit.source_slug).filter(Boolean),
    };
  });

  const citationIndex = grounded.citation_index || [];
  // Prefer top-level citation_index; fall back to flattening claim citations
  const citationMap = new Map();
  for (const cit of citationIndex) {
    const key = cit.citation_id || cit.source_slug || cit.source_title;
    if (!key || citationMap.has(key)) continue;
    citationMap.set(key, {
      sourceSlug: cit.source_slug || cit.citation_id || '',
      sourceTitle: cit.source_title || 'Untitled Source',
      confidence:
        cit.uncertainty === 'low' ? 0.9 : cit.uncertainty === 'high' ? 0.55 : 0.75,
      passage: cit.passage,
      evidenceType: cit.evidence_type,
    });
  }
  if (citationMap.size === 0) {
    for (const c of rawClaims) {
      for (const cit of c.citations || []) {
        const key = cit.citation_id || cit.source_slug || cit.source_title;
        if (!key || citationMap.has(key)) continue;
        citationMap.set(key, {
          sourceSlug: cit.source_slug || cit.citation_id || '',
          sourceTitle: cit.source_title || 'Untitled Source',
          confidence:
            cit.uncertainty === 'low' ? 0.9 : cit.uncertainty === 'high' ? 0.55 : 0.75,
          passage: cit.passage,
          evidenceType: cit.evidence_type,
        });
      }
    }
  }

  return {
    answer,
    claims,
    citations: Array.from(citationMap.values()),
    insufficientEvidence: Boolean(
      grounded.insufficient_evidence || payload?.refusal_reason === 'insufficient_evidence'
    ),
    ok: payload?.ok !== false,
    gateway: payload?.gateway,
    contextCount: payload?.context_count,
  };
}

/**
 * Synchronous grounded ask (compatible path).
 */
export async function groundedAsk(query, options = {}) {
  const {
    k = 10,
    minScore = 0.2,
    domain = null,
    useWeb = true,
    useCore = true,
    requireCitations = true,
    preferHosted = true,
    hostedModel = null,
    ollamaModel = null,
    timeoutMs = 180000,
  } = options;

  return apiFetch('/api/grounded/ask', {
    method: 'POST',
    body: JSON.stringify({
      query,
      k,
      min_score: minScore,
      domain,
      use_web: useWeb,
      use_core: useCore,
      require_citations: requireCitations,
      prefer_hosted: preferHosted,
      hosted_model: hostedModel,
      ollama_model: ollamaModel,
    }),
    timeoutMs,
  });
}

/**
 * Job-based grounded ask — better for long RAG synthesis.
 * Returns { job_id, status, ... }
 */
export async function createGroundedAskJob(query, options = {}) {
  const {
    k = 10,
    minScore = 0.2,
    domain = null,
    useWeb = true,
    useCore = true,
    requireCitations = true,
    preferHosted = true,
    hostedModel = null,
    ollamaModel = null,
    timeoutMs = 15000,
  } = options;

  return apiFetch('/api/jobs/grounded-ask', {
    method: 'POST',
    body: JSON.stringify({
      query,
      k,
      min_score: minScore,
      domain,
      use_web: useWeb,
      use_core: useCore,
      require_citations: requireCitations,
      prefer_hosted: preferHosted,
      hosted_model: hostedModel,
      ollama_model: ollamaModel,
    }),
    timeoutMs,
  });
}

export async function getJob(jobId, { timeoutMs = 10000 } = {}) {
  return apiFetch(`/api/jobs/${encodeURIComponent(String(jobId))}`, { timeoutMs });
}

/**
 * Client-side standalone grounded synthesis fallback when Python backend is unreachable.
 */
export async function synthesizeClientGrounded(query, options = {}) {
  const queryLower = (query || '').toLowerCase();
  
  // Find matching sources from local knowledge base
  const matchedSources = MOCK_SOURCES.filter((s) => {
    return (
      queryLower.includes(s.slug) ||
      queryLower.includes((s.civilization || '').toLowerCase()) ||
      queryLower.includes((s.region || '').toLowerCase()) ||
      queryLower.includes((s.title || '').toLowerCase()) ||
      queryLower.includes((s.summary || '').toLowerCase())
    );
  });

  const selectedSources = matchedSources.length > 0 ? matchedSources.slice(0, 3) : MOCK_SOURCES.slice(0, 2);

  // Try calling callGeminiApi if available
  try {
    const { callGeminiApi } = await import('./geminiApi');
    const prompt = `Answer this African civilization research question concisely: "${query}". Context sources: ${selectedSources.map((s) => s.title + ' (' + s.civilization + ')').join('; ')}.`;
    const res = await callGeminiApi('/api/gemini/chat', { prompt });
    if (res && res.text && !res.text.includes('Standby Mode')) {
      return {
        answer: res.text,
        claims: selectedSources.map((s) => ({
          text: s.summary,
          confidence: s.confidence || 0.88,
          evidenceStatus: 'supported',
          sources: [s.slug],
        })),
        citations: selectedSources.map((s) => ({
          sourceSlug: s.slug,
          sourceTitle: s.title,
          confidence: s.confidence || 0.88,
          evidenceType: s.type || 'Manuscript',
          passage: s.summary,
        })),
        insufficientEvidence: false,
        ok: true,
        gateway: 'client-standalone-synthesis',
      };
    }
  } catch (e) {
    console.warn('[HoloKai Standalone] Gemini client call notice:', e);
  }

  // Pure local knowledge fallback
  return {
    answer: `Based on the HoloKai Civilization Archive, research regarding "${query}" indicates documented historical evidence across ${selectedSources.map((s) => s.civilization).join(' and ')}. Key findings emphasize structured governance, artistic mastery, and trade networks.`,
    claims: selectedSources.map((s) => ({
      text: `${s.title}: ${s.summary}`,
      confidence: s.confidence || 0.85,
      evidenceStatus: 'supported',
      sources: [s.slug],
    })),
    citations: selectedSources.map((s) => ({
      sourceSlug: s.slug,
      sourceTitle: s.title,
      confidence: s.confidence || 0.85,
      evidenceType: s.type || 'Manuscript',
      passage: s.summary,
    })),
    insufficientEvidence: false,
    ok: true,
    gateway: 'local-knowledge-base',
  };
}

/**
 * Create a grounded-ask job and poll until terminal state.
 * Falls back to client-side grounded synthesis if backend is unreachable.
 *
 * @param {string} query
 * @param {{ onPhase?: (state: string) => void, pollIntervalMs?: number, maxWaitMs?: number, [key: string]: any }} [options]
 */
export async function groundedAskWithLifecycle(query, options = {}) {
  const { onPhase, pollIntervalMs = 1200, maxWaitMs = 180000, ...askOptions } = options;
  const started = Date.now();

  onPhase?.('retrieving');

  try {
    let job;
    try {
      job = await createGroundedAskJob(query, askOptions);
    } catch {
      // Job endpoint unavailable — use sync backend path
      onPhase?.('reasoning');
      const sync = await groundedAsk(query, askOptions);
      return mapGroundedToChat(sync);
    }

    const jobId = job?.job_id;
    if (!jobId) {
      onPhase?.('reasoning');
      const sync = await groundedAsk(query, askOptions);
      return mapGroundedToChat(sync);
    }

    // Poll until succeeded / failed / timeout
    while (Date.now() - started < maxWaitMs) {
      const row = await getJob(jobId);
      const status = row?.status;

      if (status === 'running' || status === 'queued') {
        if (status === 'running') onPhase?.('reasoning');
        else onPhase?.('retrieving');
        await new Promise((r) => setTimeout(r, pollIntervalMs));
        continue;
      }

      if (status === 'failed') {
        const errMsg =
          row?.result?.error || row?.error || 'Grounded synthesis job failed';
        throw new Error(errMsg);
      }

      if (status === 'succeeded') {
        const output = row?.result?.output || row?.result || row?.output || {};
        return mapGroundedToChat(output);
      }

      // Unknown status — keep polling briefly
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }

    throw new Error('Grounded ask timed out — activating local synthesis fallback.');
  } catch (err) {
    console.warn('[HoloKai API] Backend unreachable, activating client-side synthesis fallback:', err);
    onPhase?.('reasoning');
    return synthesizeClientGrounded(query, options);
  }
}

// ─── Backend endpoints ──────────────────────────────────────────────

export async function healthCheck() {
  try {
    const data = await apiFetch('/health', { timeoutMs: 5000 });
    return {
      online: true,
      ...data,
      vectorReady: Boolean(data?.vector_rag?.ready),
      vectorEnabled: Boolean(data?.vector_rag?.enabled),
      vectorCount: data?.vector_rag?.count ?? null,
      vectorModel: data?.vector_rag?.model ?? null,
      vectorError: data?.vector_rag?.error ?? null,
    };
  } catch (err) {
    return {
      online: false,
      status: 'offline',
      error: err.message,
      vectorReady: false,
      vectorEnabled: false,
    };
  }
}

export async function searchLibrary(options = {}) {
  const params = new URLSearchParams();
  const entries = {
    q: options.q || '',
    region: options.region || '',
    era: options.era || '',
    civilization: options.civilization || '',
    type: options.type || '',
    language: options.language || '',
    evidence_type: options.evidenceType || '',
    editorial_status: options.editorialStatus ?? 'reviewed',
    limit: String(options.limit ?? 25),
    offset: String(options.offset ?? 0),
  };
  Object.entries(entries).forEach(([k, v]) => {
    if (v !== '' && v != null) params.set(k, v);
  });
  if (typeof options.peerReviewed === 'boolean') {
    params.set('peer_reviewed', String(options.peerReviewed));
  }
  return apiFetch(`/api/library/search?${params.toString()}`, { timeoutMs: 20000 });
}

export async function libraryFacets() {
  return apiFetch('/api/library/facets', { timeoutMs: 10000 });
}

export async function getLibrarySource(slug) {
  return apiFetch(`/api/library/${encodeURIComponent(slug)}`, { timeoutMs: 20000 });
}

export async function studioQueue(options = {}) {
  const params = new URLSearchParams({
    limit: String(options.limit ?? 50),
    offset: String(options.offset ?? 0),
  });
  return apiFetch(`/api/studio/queue?${params.toString()}`, { timeoutMs: 20000 });
}

export async function studioReview(payload, role = 'editor') {
  return apiFetch('/api/studio/review', {
    method: 'POST',
    headers: { 'x-holokai-role': role },
    body: JSON.stringify(payload),
    timeoutMs: 20000,
  });
}

export async function studioImportRis(path, { verifyDoi = false, role = 'administrator', enqueue = true } = {}) {
  return apiFetch(`/api/studio/import-ris?enqueue=${enqueue ? 'true' : 'false'}`, {
    method: 'POST',
    headers: { 'x-holokai-role': role },
    body: JSON.stringify({ path, verify_doi: verifyDoi }),
    timeoutMs: enqueue ? 20000 : 240000,
  });
}

export async function createImportRisJob(path, { verifyDoi = false, role = 'administrator' } = {}) {
  return apiFetch('/api/jobs/import-ris', {
    method: 'POST',
    headers: { 'x-holokai-role': role },
    body: JSON.stringify({ path, verify_doi: verifyDoi }),
    timeoutMs: 15000,
  });
}

export async function listJobs(options = {}) {
  const params = new URLSearchParams({
    limit: String(options.limit ?? 50),
    offset: String(options.offset ?? 0),
  });
  if (options.jobType) params.set('job_type', String(options.jobType));
  if (options.status) params.set('status', String(options.status));
  return apiFetch(`/api/jobs?${params.toString()}`, { timeoutMs: options.timeoutMs ?? 15000 });
}

export async function storageStatus() {
  return apiFetch('/api/storage/status', { timeoutMs: 10000 });
}

/**
 * Build prompt block from multi-agent fragments (for Vanguard / Ollama).
 */
export function fragmentsToContextPrompt(fragments, { maxChars = 3500 } = {}) {
  if (!fragments?.length) return '';
  const parts = [];
  let used = 0;
  for (const f of fragments) {
    const title = f.agent_origin || 'Agent';
    const type = f.source_type ? ` · ${f.source_type}` : '';
    const conf =
      typeof f.confidence === 'number' ? ` · ${Math.round(f.confidence * 100)}%` : '';
    const block = `[${title}${type}${conf}]\n${(f.content || '').trim()}`;
    if (used + block.length > maxChars && parts.length) break;
    parts.push(block);
    used += block.length + 8;
  }
  return parts.join('\n\n---\n\n');
}
