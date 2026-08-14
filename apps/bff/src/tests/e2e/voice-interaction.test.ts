/**
 * Wave 7A Task 103: Voice Interaction Flow Test
 * Tests: voice input → transcription → query → response → voice output
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';

const BFF_URL = process.env.BFF_URL || 'http://localhost:4000';

describe('Voice Interaction Flow', () => {
  let authToken: string;

  beforeAll(async () => {
    console.log('Setting up test user with voice access...');
  });

  afterAll(async () => {
    console.log('Cleaning up test data...');
  });

  it('should transcribe audio input using Deepgram', async () => {
    // Create a mock audio file (in real test, use actual audio)
    const testAudioPath = join(__dirname, 'fixtures/test-audio.webm');
    const audioBuffer = readFileSync(testAudioPath);

    const formData = new FormData();
    formData.append('audio', new Blob([audioBuffer], { type: 'audio/webm' }), 'test-audio.webm');
    formData.append('mimeType', 'audio/webm');
    formData.append('detectLanguage', 'true');

    const response = await fetch(`${BFF_URL}/api/transcribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    expect(response.ok).toBe(true);

    const result = await response.json();
    expect(result.text).toBeDefined();
    expect(result.text.length).toBeGreaterThan(0);
    expect(result.language).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should handle transcription errors gracefully', async () => {
    // Test with invalid audio format
    const formData = new FormData();
    formData.append('audio', new Blob(['invalid audio data'], { type: 'text/plain' }), 'invalid.txt');
    formData.append('mimeType', 'text/plain');

    const response = await fetch(`${BFF_URL}/api/transcribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    // Should return error but not crash
    expect(response.status).toBeGreaterThanOrEqual(400);

    const result = await response.json();
    expect(result.error).toBeDefined();
  });

  it('should query Oracle with transcribed text', async () => {
    const transcript = 'What were the major achievements of ancient Kemet in mathematics?';

    const queryPayload = {
      prompt: transcript,
      civilizationFocus: 'Kemet'
    };

    const response = await fetch(`${BFF_URL}/api/oracle/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(queryPayload)
    });

    expect(response.ok).toBe(true);

    const result = await response.json();
    expect(result.text).toBeDefined();
    expect(result.text.length).toBeGreaterThan(0);
    expect(result.queryId).toBeDefined();
  });

  it('should synthesize voice response using ElevenLabs', async () => {
    const text = 'The ancient Kemetic scholars developed advanced mathematical systems including geometry for pyramid construction and early calculus concepts.';

    const voicePayload = {
      text,
      engine: 'elevenlabs',
      voiceId: '21m00Tcm4TlvDq8ikWAM' // Default voice
    };

    const response = await fetch(`${BFF_URL}/api/oracle/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(voicePayload)
    });

    expect(response.ok).toBe(true);
    expect(response.headers.get('Content-Type')).toContain('audio');

    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(0);
  });

  it('should synthesize voice response using Deepgram', async () => {
    const text = 'Timbuktu scholars preserved and expanded upon mathematical knowledge from across the Islamic world.';

    const voicePayload = {
      text,
      engine: 'deepgram',
      voiceId: 'aura-asteria-en'
    };

    const response = await fetch(`${BFF_URL}/api/oracle/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(voicePayload)
    });

    expect(response.ok).toBe(true);
    expect(response.headers.get('Content-Type')).toContain('audio');

    const audioBuffer = await response.arrayBuffer();
    expect(audioBuffer.byteLength).toBeGreaterThan(0);
  });

  it('should enforce rate limiting on voice synthesis', async () => {
    const text = 'Rate limit test';

    const voicePayload = {
      text,
      engine: 'elevenlabs',
      voiceId: '21m00Tcm4TlvDq8ikWAM'
    };

    // Make 11 requests (limit is 10 per minute)
    const requests = Array(11).fill(null).map(() =>
      fetch(`${BFF_URL}/api/oracle/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(voicePayload)
      })
    );

    const responses = await Promise.all(requests);

    // At least one should be rate limited
    const rateLimited = responses.some(r => r.status === 429);
    expect(rateLimited).toBe(true);
  });

  it('should validate voice synthesis request parameters', async () => {
    const invalidPayload = {
      text: '', // Empty text should fail validation
      engine: 'elevenlabs',
      voiceId: '21m00Tcm4TlvDq8ikWAM'
    };

    const response = await fetch(`${BFF_URL}/api/oracle/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(invalidPayload)
    });

    expect(response.status).toBe(400);

    const result = await response.json();
    expect(result.error).toBeDefined();
    expect(result.issues).toBeDefined();
  });

  it('should handle unsupported TTS engine gracefully', async () => {
    const voicePayload = {
      text: 'Test',
      engine: 'unsupported_engine',
      voiceId: 'test'
    };

    const response = await fetch(`${BFF_URL}/api/oracle/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(voicePayload)
    });

    expect(response.status).toBe(400);

    const result = await response.json();
    expect(result.error).toContain('Unsupported');
  });
});
