/**
 * Wave 7A Task 101: Complete User Journey Test
 * Tests: browse products → select tier → checkout → activate → query oracle
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const BFF_URL = process.env.BFF_URL || 'http://localhost:4000';

describe('Complete User Journey', () => {
  let authToken: string;
  let subscriptionId: string;

  beforeAll(async () => {
    // Setup: Create test user and get auth token
    console.log('Setting up test user...');
  });

  afterAll(async () => {
    // Cleanup: Delete test subscription and user
    console.log('Cleaning up test data...');
  });

  it('should browse available products', async () => {
    const response = await fetch(`${BFF_URL}/api/commerce/products`);
    expect(response.ok).toBe(true);

    const products = await response.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    // Verify HoloKai core products exist
    const productSlugs = products.map((p: any) => p.slug);
    expect(productSlugs).toContain('research-tier');
    expect(productSlugs).toContain('voice-services');
    expect(productSlugs).toContain('vision');
    expect(productSlugs).toContain('oracle');
    expect(productSlugs).toContain('archive');
  });

  it('should select pricing tier and view features', async () => {
    const response = await fetch(`${BFF_URL}/api/commerce/subscriptions`);
    expect(response.ok).toBe(true);

    const subscriptions = await response.json();
    expect(Array.isArray(subscriptions)).toBe(true);

    // Verify tier structure
    const tiers = subscriptions.map((s: any) => s.tier);
    expect(tiers).toContain('free');
    expect(tiers).toContain('pro');
    expect(tiers).toContain('enterprise');

    // Verify Pro tier has expected features
    const proTier = subscriptions.find((s: any) => s.tier === 'pro');
    expect(proTier).toBeDefined();
    expect(proTier.features).toBeDefined();
    expect(proTier.features.length).toBeGreaterThan(0);
  });

  it('should complete checkout flow', async () => {
    const checkoutPayload = {
      items: [
        {
          productId: 'research-tier',
          tier: 'pro',
          quantity: 1
        }
      ],
      paymentMethod: 'mock_payment'
    };

    const response = await fetch(`${BFF_URL}/api/commerce/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(checkoutPayload)
    });

    expect(response.ok).toBe(true);

    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
    expect(result.transactionId).toMatch(/^tx_/);

    subscriptionId = result.transactionId;
  });

  it('should activate subscription and verify access', async () => {
    // Verify subscription is active
    const response = await fetch(`${BFF_URL}/api/identity/subscription`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok).toBe(true);

    const subscription = await response.json();
    expect(subscription.tier).toBe('pro');
    expect(subscription.status).toBe('active');
  });

  it('should query Oracle with active subscription', async () => {
    const queryPayload = {
      prompt: 'Tell me about the astronomical knowledge of ancient Kemet',
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
    expect(result.confidenceScore).toBeGreaterThan(0);
    expect(result.evidence).toBeDefined();
    expect(Array.isArray(result.evidence)).toBe(true);
  });

  it('should handle streaming Oracle query', async () => {
    const queryPayload = {
      prompt: 'What were the mathematical contributions of Timbuktu scholars?',
      stream: true
    };

    const response = await fetch(`${BFF_URL}/api/oracle/query?stream=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(queryPayload)
    });

    expect(response.ok).toBe(true);
    expect(response.headers.get('Content-Type')).toContain('text/event-stream');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let chunks = 0;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        if (chunk.includes('data: [DONE]')) {
          break;
        }
        chunks++;
      }
    }

    expect(chunks).toBeGreaterThan(0);
  });
});
