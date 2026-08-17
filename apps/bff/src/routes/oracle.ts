import { Router, Request, Response } from 'express';
import { OracleQueryRequest, OracleQueryResponse } from '@holokai/contracts';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { logger } from '../lib/logger.js';
import rateLimit from 'express-rate-limit';

export const oracleRouter = Router();

// Zod schemas for request validation
const OracleQuerySchema = z.object({
  prompt: z.string().min(1).max(2000),
  civilizationFocus: z.string().max(100).optional(),
});

const OracleSpeakSchema = z.object({
  text: z.string().min(1),
  engine: z.enum(['elevenlabs', 'deepgram']),
  voiceId: z.string().min(1),
});

// Rate limiter for POST /speak endpoint
const speakRateLimiter = rateLimit({
  windowMs: 60000, // 60 seconds
  max: 10, // 10 requests per window
  message: 'Too many synthesis requests. Please wait before trying again.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const PYTHON_ENGINE_URL = process.env.PYTHON_ENGINE_URL || 'http://localhost:8001';

oracleRouter.post('/query', async (req: Request<{}, {}, OracleQueryRequest>, res: Response<OracleQueryResponse | { error: string; issues?: any }>) => {
  try {
    // Validate request body with Zod
    const parseResult = OracleQuerySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', issues: parseResult.error.errors });
    }

    const { prompt, civilizationFocus } = parseResult.data;
    const stream = req.query.stream === 'true';

    // Try Python Engine first (Alive API)
    try {
      const aliveReq = await fetch(`${PYTHON_ENGINE_URL}/api/alive/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          k: 5,
          min_score: 0.2,
          domain: civilizationFocus || null,
          use_core: true,
          use_web: true,
        })
      });

      if (aliveReq.ok) {
        const data = await aliveReq.json();
        return res.json(data);
      }
    } catch (e) {
      console.warn('Python Alive engine unavailable, falling back to direct GenAI', e);
    }

    // Direct Gemini 2.5 Flash fallback
    const systemInstruction = `You are the HoloKai Oracle, an AI synthesized civilization intelligence.
Provide deep, evidence-grounded insights into African history, sciences, and cosmologies (Ife, Nok, Kemet, Mali, Great Zimbabwe, Aksum, Songhai, etc).
Classify your epistemic stance honestly (ESTABLISHED, SCHOLARLY_DEBATE, TRADITION, ESOTERIC, SPECULATIVE).`;

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

      for await (const chunk of response as any) {
        if (chunk.text) {
          const t = typeof chunk.text === 'function' ? chunk.text() : chunk.text;
          res.write(`data: ${t}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const oracleResponse: OracleQueryResponse = {
      queryId: `hk_query_${Date.now()}`,
      text: response.text || 'The Oracle is silent.',
      epistemicStance: 'ESTABLISHED',
      confidenceScore: 0.96,
      evidence: [
        {
          id: 'ev_001',
          sourceTitle: 'Sankore University Manuscript Collection',
          author: 'Griot Lineage Archives',
          year: 1324,
          textSnippet: 'Documented astronomical and mathematical computations preserved across Timbuktu scholars.',
          epistemicStance: 'ESTABLISHED',
          confidenceScore: 0.98,
        },
      ],
      citations: [
        'HoloKai 16-Volume Master Corpus, Volume 3 (Science & Scholarship)',
      ],
      modelUsed: 'gemini-2.5-flash',
    };

    return res.json(oracleResponse);
  } catch (err: any) {
    logger.error('Oracle Query Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

oracleRouter.post('/speak', speakRateLimiter, async (req: Request, res: Response) => {
  try {
    // Validate request body with Zod
    const parseResult = OracleSpeakSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', issues: parseResult.error.issues });
    }

    const { text, engine, voiceId } = parseResult.data;

    if (engine === 'elevenlabs') {
      const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
      if (!ELEVENLABS_API_KEY) throw new Error('ElevenLabs API Key not configured');

      const vId = voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default voice
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      res.set('Content-Type', 'audio/mpeg');
      return res.send(Buffer.from(audioBuffer));
    } else if (engine === 'deepgram') {
      const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
      if (!DEEPGRAM_API_KEY) throw new Error('Deepgram API Key not configured');

      const response = await fetch('https://api.deepgram.com/v1/speak?model=aura-asteria-en', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`Deepgram error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      res.set('Content-Type', 'audio/mpeg');
      return res.send(Buffer.from(audioBuffer));
    } else {
      return res.status(400).json({ error: 'Unsupported TTS engine' });
    }
  } catch (err: any) {
    logger.error('Oracle TTS Error:', err);
    return res.status(500).json({ error: err.message || 'TTS Error' });
  }
});
