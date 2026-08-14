import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getGeminiClient } from '../lib/gemini-client.js';

const router = Router();

// Validation schema
const streamQuerySchema = z.object({
  prompt: z.string().min(1).max(5000),
  systemPrompt: z.string().optional(),
  session_id: z.string().optional(),
});

// POST /api/gemini/stream - Streaming endpoint for Gemini
router.post('/stream', async (req: Request, res: Response) => {
  try {
    const body = streamQuerySchema.parse(req.body);
    const { prompt, systemPrompt, session_id } = body;

    const geminiClient = getGeminiClient();
    
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const generator = systemPrompt 
      ? geminiClient.streamWithSystemPrompt(systemPrompt, prompt)
      : gemini.streamContent(prompt);

    for await (const chunk of generator) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text, done: chunk.done })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request body', details: error.errors });
      return;
    }

    console.error('Gemini streaming error:', error);
    res.status(500).json({ error: 'Failed to stream response' });
  }
});

export { router as geminiStreamRouter };
