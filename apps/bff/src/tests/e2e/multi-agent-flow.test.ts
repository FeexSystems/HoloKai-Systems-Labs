/**
 * Wave 7A Task 104: Multi-Agent Flow Test
 * Tests: query routed to correct agent, response formatted appropriately
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const BFF_URL = process.env.BFF_URL || 'http://localhost:4000';

describe('Multi-Agent Flow', () => {
  let authToken: string;

  beforeAll(async () => {
    console.log('Setting up test user...');
  });

  afterAll(async () => {
    console.log('Cleaning up test data...');
  });

  it('should route knowledge queries to KnowledgeAgent', async () => {
    const queryPayload = {
      prompt: 'What were the primary crops grown in ancient Kemet?',
      civilizationFocus: 'Kemet',
      agentType: 'knowledge'
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
    expect(result.agentUsed).toBe('KnowledgeAgent');
    expect(result.confidenceScore).toBeGreaterThan(0.8);
  });

  it('should route voice queries to VoiceAgent', async () => {
    const queryPayload = {
      prompt: 'Generate voice for: The Nile River was the lifeblood of ancient Kemet',
      agentType: 'voice',
      voiceSettings: {
        engine: 'elevenlabs',
        voiceId: '21m00Tcm4TlvDq8ikWAM'
      }
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
    expect(result.agentUsed).toBe('VoiceAgent');
    expect(result.audioUrl).toBeDefined();
  });

  it('should route vision queries to VisionAgent', async () => {
    const queryPayload = {
      prompt: 'Generate an image of ancient Kemetic scholars studying astronomy',
      agentType: 'vision',
      visionSettings: {
        style: 'ancient-artistic',
        format: 'png'
      }
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
    expect(result.agentUsed).toBe('VisionAgent');
    expect(result.imageUrl).toBeDefined();
  });

  it('should route archive queries to ArchiveAgent', async () => {
    const queryPayload = {
      prompt: 'Search for documents about Kemetic mathematics',
      agentType: 'archive',
      searchSettings: {
        query: 'Kemet mathematics',
        category: 'research'
      }
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
    expect(result.agentUsed).toBe('ArchiveAgent');
    expect(result.documents).toBeDefined();
    expect(Array.isArray(result.documents)).toBe(true);
  });

  it('should handle agent fallback when primary agent fails', async () => {
    // Simulate agent failure by using invalid agent type
    const queryPayload = {
      prompt: 'Test query with fallback',
      agentType: 'invalid_agent'
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
    expect(result.agentUsed).toBe('KnowledgeAgent'); // Should fallback to default
    expect(result.fallbackTriggered).toBe(true);
  });

  it('should format KnowledgeAgent responses with citations', async () => {
    const queryPayload = {
      prompt: 'Explain the Kemetic concept of Maat',
      agentType: 'knowledge'
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
    expect(result.citations).toBeDefined();
    expect(Array.isArray(result.citations)).toBe(true);
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.evidence).toBeDefined();
    expect(Array.isArray(result.evidence)).toBe(true);
  });

  it('should format VoiceAgent responses with audio metadata', async () => {
    const queryPayload = {
      prompt: 'Speak: Maat represents truth, balance, and cosmic order',
      agentType: 'voice',
      voiceSettings: {
        engine: 'deepgram',
        voiceId: 'aura-asteria-en'
      }
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
    expect(result.audioMetadata).toBeDefined();
    expect(result.audioMetadata.duration).toBeDefined();
    expect(result.audioMetadata.format).toBeDefined();
  });

  it('should maintain conversation context across multi-turn queries', async () => {
    const turn1Payload = {
      prompt: 'Who was Imhotep?',
      agentType: 'knowledge',
      conversationId: 'test_conv_001'
    };

    const response1 = await fetch(`${BFF_URL}/api/oracle/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(turn1Payload)
    });

    expect(response1.ok).toBe(true);
    const result1 = await response1.json();

    // Follow-up query that references previous context
    const turn2Payload = {
      prompt: 'What was his most famous achievement?',
      agentType: 'knowledge',
      conversationId: 'test_conv_001'
    };

    const response2 = await fetch(`${BFF_URL}/api/oracle/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(turn2Payload)
    });

    expect(response2.ok).toBe(true);
    const result2 = await response2.json();

    // Response should reference Imhotep even though not mentioned in second query
    expect(result2.text.toLowerCase()).toMatch(/imhotep|step pyramid|architect/i);
    expect(result2.contextReferences).toBeDefined();
    expect(result2.contextReferences.length).toBeGreaterThan(0);
  });

  it('should handle natural conversation patterns', async () => {
    const queryPayload = {
      prompt: 'Thank you for that information',
      agentType: 'knowledge'
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
    expect(result.responseType).toBe('pleasantry');
    expect(result.text).toBeDefined();
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('should express uncertainty when appropriate', async () => {
    const queryPayload = {
      prompt: 'What was the exact population of Kemet in 2500 BCE?',
      agentType: 'knowledge'
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
    expect(result.epistemicStance).toBe('SCHOLARLY_DEBATE');
    expect(result.confidenceScore).toBeLessThan(0.9);
    expect(result.text).toMatch(/uncertain|estimate|approximate|debate/i);
  });
});
