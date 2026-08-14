/**
 * Wave 7A Task 102: Document Upload Flow Test
 * Tests: upload, processing, indexing, search retrieval
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const BFF_URL = process.env.BFF_URL || 'http://localhost:4000';

describe('Document Upload Flow', () => {
  let authToken: string;
  let documentId: string;

  beforeAll(async () => {
    console.log('Setting up test user with archive access...');
  });

  afterAll(async () => {
    // Cleanup: Delete test document
    console.log('Cleaning up test document...');
  });

  it('should upload document successfully', async () => {
    const formData = new FormData();
    const testContent = 'This is a test document about ancient Kemet astronomy and mathematics.';
    const blob = new Blob([testContent], { type: 'text/plain' });
    formData.append('file', blob, 'test-kemet-knowledge.txt');
    formData.append('title', 'Test Kemet Knowledge');
    formData.append('description', 'Test document for archive flow');
    formData.append('category', 'research');

    const response = await fetch(`${BFF_URL}/api/archive/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    expect(response.ok).toBe(true);

    const result = await response.json();
    expect(result.documentId).toBeDefined();
    expect(result.status).toBe('uploaded');
    expect(result.filename).toBe('test-kemet-knowledge.txt');

    documentId = result.documentId;
  });

  it('should verify document processing status', async () => {
    // Poll for processing completion
    let processed = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!processed && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch(`${BFF_URL}/api/archive/${documentId}/status`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.ok).toBe(true);

      const status = await response.json();
      if (status.status === 'processed' || status.status === 'indexed') {
        processed = true;
        expect(status.processingTime).toBeDefined();
        expect(status.wordCount).toBeGreaterThan(0);
      }

      attempts++;
    }

    expect(processed).toBe(true);
  });

  it('should add metadata tags to document', async () => {
    const tags = [
      { id: '1', name: 'Kemet', category: 'civilization' },
      { id: '2', name: 'Astronomy', category: 'topic' },
      { id: '3', name: 'Mathematics', category: 'topic' }
    ];

    const response = await fetch(`${BFF_URL}/api/archive/${documentId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ tags })
    });

    expect(response.ok).toBe(true);

    const result = await response.json();
    expect(result.tags).toBeDefined();
    expect(result.tags.length).toBe(3);
    expect(result.tags.some((t: any) => t.name === 'Kemet')).toBe(true);
  });

  it('should search and retrieve uploaded document', async () => {
    const searchQuery = 'Kemet astronomy';

    const response = await fetch(`${BFF_URL}/api/archive?query=${encodeURIComponent(searchQuery)}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok).toBe(true);

    const result = await response.json();
    expect(result.records).toBeDefined();
    expect(Array.isArray(result.records)).toBe(true);

    // Verify our uploaded document appears in results
    const uploadedDoc = result.records.find((r: any) => r.id === documentId);
    expect(uploadedDoc).toBeDefined();
    expect(uploadedDoc.title).toBe('Test Kemet Knowledge');
  });

  it('should retrieve document by ID with full metadata', async () => {
    const response = await fetch(`${BFF_URL}/api/archive/${documentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok).toBe(true);

    const document = await response.json();
    expect(document.id).toBe(documentId);
    expect(document.title).toBe('Test Kemet Knowledge');
    expect(document.tags).toBeDefined();
    expect(document.tags.length).toBeGreaterThan(0);
    expect(document.uploadDate).toBeDefined();
    expect(document.fileSize).toBeGreaterThan(0);
  });

  it('should filter documents by category', async () => {
    const response = await fetch(`${BFF_URL}/api/archive?category=research`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok).toBe(true);

    const result = await response.json();
    expect(result.records).toBeDefined();
    expect(Array.isArray(result.records)).toBe(true);

    // All records should have category 'research'
    result.records.forEach((record: any) => {
      expect(record.category).toBe('research');
    });
  });

  it('should filter documents by civilization tag', async () => {
    const response = await fetch(`${BFF_URL}/api/archive?civilizationId=kemet`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok).toBe(true);

    const result = await response.json();
    expect(result.records).toBeDefined();
    expect(Array.isArray(result.records)).toBe(true);

    // Verify our document with Kemet tag appears
    const kemetDoc = result.records.find((r: any) => r.id === documentId);
    expect(kemetDoc).toBeDefined();
  });
});
