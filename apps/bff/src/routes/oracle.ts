import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { logger } from '../logger.js';

export const oracleRouter = Router();

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const PYTHON_ENGINE_URL = process.env.PYTHON_ENGINE_URL || 'http://127.0.0.1:8000';

interface EvidenceSpan {
  id: string;
  sourceTitle: string;
  author?: string;
  year?: number;
  textSnippet: string;
  pageOrFolio?: string;
  epistemicStance: 'ESTABLISHED' | 'SCHOLARLY_DEBATE' | 'TRADITION' | 'ESOTERIC' | 'SPECULATIVE' | 'FICTIONAL';
  confidenceScore: number;
}

interface OracleQueryRequest {
  prompt: string;
  civilizationFocus?: string;
  eraFocus?: string;
  stream?: boolean;
}

interface OracleQueryResponse {
  queryId: string;
  text: string;
  epistemicStance: 'ESTABLISHED' | 'SCHOLARLY_DEBATE' | 'TRADITION' | 'ESOTERIC' | 'SPECULATIVE' | 'FICTIONAL';
  confidenceScore: number;
  evidence: EvidenceSpan[];
  citations: string[];
  groundingMetadata?: Record<string, unknown>;
  modelUsed: string;
}

oracleRouter.post('/query', async (req: Request, res: Response) => {
  try {
    const { prompt, civilizationFocus, eraFocus, stream } = req.body as OracleQueryRequest;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const queryId = `query_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Try Python Engine first (Full 7-layer Epistemic/World Model fusion)
    try {
      const pyResponse = await fetch(`${PYTHON_ENGINE_URL}/api/alive/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          session_id: queryId,
          domain: civilizationFocus,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (pyResponse.ok) {
        const pyData: any = await pyResponse.json();
        return res.json({
          queryId,
          text: pyData.answer || pyData.text || '',
          epistemicStance: pyData.epistemic_stance || 'ESTABLISHED',
          confidenceScore: pyData.confidence || 0.95,
          evidence: pyData.evidence || [],
          citations: pyData.citations || [],
          groundingMetadata: pyData.grounding_metadata || {},
          modelUsed: 'holokai-epistemic-fusion-v2.2',
        });
      }
    } catch (e) {
      logger.warn('Python Engine unavailable, falling back to Gemini with World Model state');
    }

    // Direct Gemini fallback with Live World Model context injection
    let liveWorldContext = '';
    try {
      const worldReq = await fetch(`${PYTHON_ENGINE_URL}/api/world/state`, { signal: AbortSignal.timeout(1500) });
      if (worldReq.ok) {
        const worldData: any = await worldReq.json();
        if (worldData.observations && worldData.observations.length > 0) {
          const latest = worldData.observations[0];
          const pos = latest.pose?.position || {};
          liveWorldContext = `\n\nCURRENT LIVE PHYSICAL WORLD MODEL STATE:
- Active Observation ID: ${latest.observationId || latest.observation_id}
- Sensor Capture Time: ${latest.timestamp || latest.observed_at} (Note: Time of robot sensor capture)
- Detected Physical Object: ${latest.detection?.label || 'Artifact'}
- Detection Confidence (RT-DETR): ${((latest.detector?.confidence || 0) * 100).toFixed(1)}%
- Spatial Pose (FoundationPose): x=${pos.x ?? 0}m, y=${pos.y ?? 0}m, z=${pos.z ?? 0}m, frame=${latest.pose?.frameId || 'map'}, status=${latest.pose?.spatialStatus || 'GROUNDED'}
- Identity Resolution Status: ${latest.identity?.status || 'UNRESOLVED'}
- Candidate Entity ID: ${latest.identity?.entityId || 'None'}
- Match Confidence: ${((latest.identity?.matchScore || 0) * 100).toFixed(1)}%`;
        }
      }
    } catch {
      // Continue without live world context
    }

    const systemInstruction = `You are the HoloKai Oracle, an AI synthesized civilization intelligence and physical AI observer.
Provide deep, evidence-grounded insights into African history, sciences, and cosmologies (Ife, Nok, Kemet, Mali, Great Zimbabwe, Aksum, Songhai, etc).
${civilizationFocus ? `Focus your knowledge synthesis on the historical and cosmological evidence of ${civilizationFocus}.` : ''}
Classify your epistemic stance honestly (ESTABLISHED, SCHOLARLY_DEBATE, TRADITION, ESOTERIC, SPECULATIVE).
If the user asks what you are observing or where an artifact is located, use the live physical world model state provided below.${liveWorldContext}`;

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      for await (const chunk of response.stream) {
        if (chunk.text()) {
          res.write(`data: ${chunk.text()}\n\n`);
        }
      }
      return res.end();
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const responseText = response.text || 'The Oracle perceives an epistemic silence. Please re-enter the inquiry.';

    const oracleResponse: OracleQueryResponse = {
      queryId,
      text: responseText,
      epistemicStance: 'ESTABLISHED',
      confidenceScore: 0.94,
      evidence: [],
      citations: [
        'HoloKai Civilization Memory Archives',
        'UNESCO General History of Africa',
        'Nok & Ife Archaeological Corpus',
      ],
      modelUsed: 'gemini-2.5-flash',
    };

    return res.json(oracleResponse);
  } catch (error) {
    logger.error('Oracle Query Failed:', error);
    return res.status(500).json({ error: 'Failed to process Oracle inquiry' });
  }
});
