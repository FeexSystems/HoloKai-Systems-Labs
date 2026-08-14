import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getDeepgramClient } from '../lib/deepgram-client.js';

const router = Router();

// Validation schemas
const transcribeSchema = z.object({
  audio: z.any(), // Buffer or file
  mimeType: z.string().optional().default('audio/wav'),
  detectLanguage: z.boolean().optional().default(false),
});

// POST /api/transcribe - Transcribe audio to text
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.audio) {
      res.status(400).json({ error: 'Audio data is required' });
      return;
    }

    const audioBuffer = Buffer.isBuffer(req.body.audio) 
      ? req.body.audio 
      : Buffer.from(req.body.audio);

    const mimeType = req.body.mimeType || 'audio/wav';
    const detectLanguage = req.body.detectLanguage || false;

    const deepgramClient = getDeepgramClient();

    let result;
    if (detectLanguage) {
      result = await deepgramClient.transcribeWithLanguageDetection(audioBuffer, mimeType);
    } else {
      result = await deepgramClient.transcribe(audioBuffer, mimeType);
    }

    res.json({
      text: result.text,
      confidence: result.confidence,
      language: result.language,
      duration: result.duration,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// WebSocket endpoint for real-time transcription would be added here
// For now, we'll provide a placeholder for future implementation

export { router as transcribeRouter };
