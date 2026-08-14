import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getVoiceClient, ANCIENT_VOICE_PRESETS } from '../lib/voice-client.js';

const router = Router();

// Validation schemas
const synthesizeSchema = z.object({
  text: z.string().min(1).max(5000),
  voiceId: z.string().optional(),
  modelId: z.string().optional(),
  stability: z.number().min(0).max(1).optional(),
  similarityBoost: z.number().min(0).max(1).optional(),
  presetId: z.string().optional(),
});

// GET /api/voice/presets - Get available voice presets
router.get('/presets', (req: Request, res: Response) => {
  try {
    const voiceClient = getVoiceClient();
    const presets = voiceClient.getVoicePresets();
    res.json({ presets });
  } catch (error) {
    console.error('Get voice presets error:', error);
    res.status(500).json({ error: 'Failed to retrieve voice presets' });
  }
});

// POST /api/voice/synthesize - Synthesize text to speech
router.post('/synthesize', async (req: Request, res: Response) => {
  try {
    const body = synthesizeSchema.parse(req.body);
    const voiceClient = getVoiceClient();

    let options: any = {};

    // If presetId is provided, use preset settings
    if (body.presetId) {
      const preset = voiceClient.getVoicePreset(body.presetId);
      if (preset) {
        options.voiceId = preset.voiceId;
        options.modelId = preset.modelId;
        options.stability = preset.stability;
        options.similarityBoost = preset.similarityBoost;
      }
    } else {
      // Use individual settings
      if (body.voiceId) options.voiceId = body.voiceId;
      if (body.modelId) options.modelId = body.modelId;
      if (body.stability !== undefined) options.stability = body.stability;
      if (body.similarityBoost !== undefined) options.similarityBoost = body.similarityBoost;
    }

    const audioBuffer = await voiceClient.synthesize(body.text, options);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="speech.mp3"',
      'Content-Length': audioBuffer.length,
    });

    res.send(audioBuffer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request body', details: error.errors });
      return;
    }

    console.error('Voice synthesis error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

// GET /api/voice/stream - Stream audio synthesis
router.get('/stream', async (req: Request, res: Response) => {
  try {
    const { text, presetId } = synthesizeSchema.parse(req.query);
    const voiceClient = getVoiceClient();

    let options: any = {};

    // If presetId is provided, use preset settings
    if (presetId) {
      const preset = voiceClient.getVoicePreset(presetId);
      if (preset) {
        options.voiceId = preset.voiceId;
        options.modelId = preset.modelId;
        options.stability = preset.stability;
        options similarityBoost = preset.similarityBoost;
      }
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of voiceClient.streamSynthesize(text || "No text provided", options)) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error('Voice streaming error:', error);
    res.status(500).json({ error: 'Failed to stream audio' });
  }
});

// POST /api/voice/voices - Get available voices from ElevenLabs
router.get('/voices', async (req: Request, res: Response) => {
  try {
    const voiceClient = getVoiceClient();
    const voices = await voiceClient.getVoices();
    res.json({ voices });
  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({ error: 'Failed to retrieve voices' });
  }
});

export { router as voiceRouter };
