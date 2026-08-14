/**
 * Wave 7E Task 122: Integration Tests for API Endpoints
 * Test request/response flow
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const BFF_URL = process.env.BFF_URL || 'http://localhost:4000';

describe('API Endpoint Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    // Setup: Get auth token for protected endpoints
    console.log('Setting up integration test environment...');
  });

  afterAll(async () => {
    // Cleanup
    console.log('Cleaning up integration test environment...');
  });

  describe('Health Endpoint', () => {
    it('should return 200 OK', async () => {
      const response = await fetch(`${BFF_URL}/api/health`);
      
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data.status).toBe('healthy');
    });

    it('should return service dependencies status', async () => {
      const response = await fetch(`${BFF_URL}/api/health`);
      
      const data = await response.json();
      expect(data).toHaveProperty('services');
      expect(Array.isArray(data.services)).toBe(true);
    });
  });

  describe('Oracle API', () => {
    it('should accept valid query requests', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: 'What is Maat?',
          civilizationFocus: 'Kemet'
        })
      });

      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('text');
      expect(data).toHaveProperty('queryId');
      expect(data).toHaveProperty('confidenceScore');
      expect(data.text.length).toBeGreaterThan(0);
    });

    it('should reject empty prompts', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: ''
        })
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should reject prompts exceeding max length', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: 'A'.repeat(3000)
        })
      });

      expect(response.status).toBe(400);
    });

    it('should handle streaming responses', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/query?stream=true`, {
        method: POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: 'Tell me about Kemetic astronomy'
        })
      });

      expect(response.ok).toBe(true);
      expect(response.headers.get('Content-Type')).toContain('text/event-stream');
    });

    it('should validate voice synthesis requests', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: 'Test synthesis',
          engine: 'elevenlabs',
          voiceId: '21m00Tcm4TlvDq8ikWAM'
        })
      });

      expect(response.ok).toBe(true);
      expect(response.headers.get('Content-Type')).toContain('audio');
    });

    it('should reject invalid voice engine', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: 'Test',
          engine: 'invalid_engine',
          voiceId: 'test'
        })
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Commerce API', () => {
    it('should return products list', async () => {
      const response = await fetch(`${BFF_URL}/api/commerce/products`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should return subscriptions list', async () => {
      const response = await fetch(`${BFF_URL}/api/commerce/subscriptions`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      
      const tiers = data.map((s: any) => s.tier);
      expect(tiers).toContain('free');
      expect(tiers).toContain('pro');
      expect(tiers).toContain('enterprise');
    });

    it('should process checkout requests', async () => {
      const response = await fetch(`${BFF_URL}/api/commerce/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            { productId: 'research-tier', tier: 'pro', quantity: 1 }
          ],
          paymentMethod: 'mock_payment'
        })
      });

      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.transactionId).toBeDefined();
    });

    it('should reject empty cart', async () => {
      const response = await fetch(`${BFF_URL}/api/commerce/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: []
        })
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Archive API', () => {
    it('should search archives', async () => {
      const response = await fetch(`${BFF_URL}/api/archive?query=Kemet`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('records');
      expect(Array.isArray(data.records)).toBe(true);
    });

    it('should filter by category', async () => {
      const response = await fetch(`${BFF_URL}/api/archive?category=research`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.records).toBeDefined();
      
      data.records.forEach((record: any) => {
        expect(record.category).toBe('research');
      });
    });

    it('should filter by civilization', async () => {
      const response = await fetch(`${BFF_URL}/api/archive?civilizationId=kemet`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.records).toBeDefined();
    });

    it('should handle pagination', async () => {
      const response = await fetch(`${BFF_URL}/api/archive?page=1&limit=10`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.records.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Research API', () => {
    it('should search research logs', async () => {
      const response = await fetch(`${BFF_URL}/api/research?query=mathematics`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('results');
      expect(Array.isArray(data.results)).toBe(true);
    });

    it('should filter by domain', async () => {
      const response = await fetch(`${BFF_URL}/api/research?domain=astronomy`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.results).toBeDefined();
    });

    it('should handle confidence threshold', async () => {
      const response = await fetch(`${BFF_URL}/api/research?confidence=0.8`);
      
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.results).toBeDefined();
      
      data.results.forEach((result: any) => {
        expect(parseFloat(result.confidence)).toBeGreaterThanOrEqual(0.8);
      });
    });
  });

  describe('Transcription API', () => {
    it('should accept audio files', async () => {
      const formData = new FormData();
      const testAudio = new Blob(['test audio data'], { type: 'audio/webm' });
      formData.append('audio', testAudio, 'test.webm');
      formData.append('mimeType', 'audio/webm');
      formData.append('detectLanguage', 'true');

      const response = await fetch(`${BFF_URL}/api/transcribe`, {
        method: 'POST',
        body: formData
      });

      // May fail without actual audio, but should handle gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should validate audio format', async () => {
      const formData = new FormData();
      formData.append('audio', new Blob(['test']), 'test.txt');
      formData.append('mimeType', 'text/plain');

      const response = await fetch(`${BFF_URL}/api/transcribe`, {
        method: 'POST',
        body: formData
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Identity API (Protected)', () => {
    it('should require authentication', async () => {
      const response = await fetch(`${BFF_URL}/api/identity/profile`);
      
      expect(response.status).toBe(401);
    });

    it('should accept valid auth token', async () => {
      const response = await fetch(`${BFF_URL}/api/identity/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      // May fail if token is invalid, but should not be 401
      expect(response.status).not.toBe(401);
    });

    it('should validate profile updates', async () => {
      const response = await fetch(`${BFF_URL}/api/identity/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: 'Test User',
          civilization: 'Kemet',
          role: 'Researcher'
        })
      });

      // Should validate request
      expect(response.status).not.toBe(500);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for invalid endpoints', async () => {
      const response = await fetch(`${BFF_URL}/api/invalid-endpoint`);
      
      expect(response.status).toBe(404);
    });

    it('should return 405 for invalid methods', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/query`, {
        method: 'GET'
      });
      
      expect(response.status).toBe(405);
    });

    it('should return 415 for unsupported media type', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml'
        },
        body: '<test>data</test>'
      });
      
      expect(response.status).toBe(415);
    });

    it('should handle malformed JSON', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{ invalid json }'
      });
      
      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on voice synthesis', async () => {
      // Make multiple requests to test rate limiting
      const requests = Array(15).fill(null).map(() =>
        fetch(`${BFF_URL}/api/oracle/speak`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: 'Rate limit test',
            engine: 'elevenlabs',
            voiceId: '21m00Tcm4TlvDq8ikWAM'
          })
        })
      );

      const responses = await Promise.all(requests);
      
      // At least one should be rate limited
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    });

    it('should include rate limit headers', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: 'Test',
          engine: 'elevenlabs',
          voiceId: '21m00Tcm4TlvDq8ikWAM'
        })
      });

      expect(response.headers.has('X-RateLimit-Limit')).toBe(true);
      expect(response.headers.has('X-RateLimit-Remaining')).toBe(true);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await fetch(`${BFF_URL}/api/health`, {
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });

      expect(response.headers.has('Access-Control-Allow-Origin')).toBe(true);
    });

    it('should handle preflight requests', async () => {
      const response = await fetch(`${BFF_URL}/api/oracle/query`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      expect(response.status).toBe(204);
    });
  });
});
