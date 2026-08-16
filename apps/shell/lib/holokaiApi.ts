/**
 * Sophisticated Mock API for HoloKai Studio Editor & Intelligence Modules
 * 
 * This module simulates a complex backend environment for the HoloKai platform,
 * maintaining in-memory state for jobs, queues, and storage status. It simulates
 * realistic network delays, failure rates, and background processing.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface JobOptions {
  limit?: number;
  offset?: number;
  verifyDoi?: boolean;
  role?: string;
  decision?: string;
  notes?: string;
  slug?: string;
}

export interface StudioJob {
  id: string;
  job_type: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  backend: string;
  updated_at: string;
  result?: {
    output?: any;
    error?: string;
  };
}

export interface StudioQueueItem {
  slug: string;
  title: string;
  editorial_status: string;
  rights_status: string;
}

// ── In-Memory State ────────────────────────────────────────────────────────

// Initial mockup data
let mockStorageStatus = {
  backend: 'PostgreSQL 16 (Grounded-Cluster-01)',
  error: null as string | null,
  capacity: '78% utilized',
  uptime: '45d 12h',
};

let mockQueue: StudioQueueItem[] = [
  {
    slug: 'kemet-dynasty-iv',
    title: 'Architectural Texts of the Fourth Dynasty',
    editorial_status: 'staged',
    rights_status: 'cleared',
  },
  {
    slug: 'swahili-monsoons-1200',
    title: 'Trade Winds: Kilwa Chronicle Extracts',
    editorial_status: 'needs_review',
    rights_status: 'pending_translation',
  },
  {
    slug: 'nubian-archers-tactics',
    title: 'Military treatises of the Medjay',
    editorial_status: 'staged',
    rights_status: 'cleared',
  },
  {
    slug: 'timbuktu-astronomy',
    title: 'Sankore University: Lunar Observations',
    editorial_status: 'conflict',
    rights_status: 'disputed',
  }
];

let mockJobs: StudioJob[] = [
  {
    id: 'job_4829fa8c',
    job_type: 'grounded_synthesis',
    status: 'succeeded',
    backend: 'gpu-worker-node-1',
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    result: {
      output: { grounded: { supported_claim_count: 243 } }
    }
  },
  {
    id: 'job_1193bd2a',
    job_type: 'ris_import',
    status: 'failed',
    backend: 'ingestion-worker-node-3',
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    result: {
      error: 'Malformed RIS file encoding. Expected UTF-8.'
    }
  }
];

// ── Helpers ────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => 'job_' + Math.random().toString(16).substring(2, 10);

const simulateNetwork = async (minMs = 300, maxMs = 1200) => {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await delay(ms);
  
  // 5% chance of random network failure
  if (Math.random() < 0.05) {
    throw new Error('Network timeout: The HoloKai gateway is currently congested.');
  }
};

// ── API Exports ────────────────────────────────────────────────────────────

/**
 * Fetch the current editorial queue of manuscripts and staged texts.
 */
export async function studioQueue(options: JobOptions = {}): Promise<{ items: StudioQueueItem[], total: number }> {
  await simulateNetwork();
  
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  
  const items = mockQueue.slice(offset, offset + limit);
  return { items, total: mockQueue.length };
}

/**
 * List all running, queued, and completed jobs.
 */
export async function listJobs(options: JobOptions = {}): Promise<{ items: StudioJob[], total: number }> {
  // Keep delay short for polling purposes
  await delay(200); 
  
  // Sort jobs by newest first (descending)
  const sortedJobs = [...mockJobs].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  
  const items = sortedJobs.slice(offset, offset + limit);
  return { items, total: sortedJobs.length };
}

/**
 * Check the status of the underlying storage backend.
 */
export async function storageStatus(): Promise<typeof mockStorageStatus> {
  await simulateNetwork(100, 400);
  
  // Occasionally simulate a warning state
  if (Math.random() < 0.1) {
    return {
      ...mockStorageStatus,
      error: 'Warning: High disk latency detected on Grounded-Cluster-01.',
    };
  }
  
  return { ...mockStorageStatus, error: null };
}

/**
 * Approve, reject, or mark a queue item for changes.
 */
export async function studioReview(options: JobOptions, role: string = 'editor'): Promise<void> {
  await simulateNetwork(400, 900);
  
  if (role !== 'editor' && role !== 'admin') {
    throw new Error('Unauthorized: Insufficient clearance for editorial review.');
  }
  
  if (!options.slug || !options.decision) {
    throw new Error('Bad Request: Missing slug or decision payload.');
  }
  
  const index = mockQueue.findIndex(item => item.slug === options.slug);
  
  if (index === -1) {
    throw new Error(`Not Found: Queue item with slug '${options.slug}' does not exist.`);
  }
  
  if (options.decision === 'rejected') {
    // Remove rejected items from the queue entirely
    mockQueue = mockQueue.filter(item => item.slug !== options.slug);
  } else {
    // Update status
    mockQueue[index] = {
      ...mockQueue[index],
      editorial_status: options.decision
    };
  }
}

/**
 * Kick off a background job to import a RIS file.
 * Returns the job immediately, then simulates background processing.
 */
export async function createImportRisJob(path: string, options: JobOptions = {}): Promise<StudioJob> {
  await simulateNetwork(300, 600);
  
  if (!path.endsWith('.ris')) {
    throw new Error('Invalid file format. Only .ris bibliography files are supported.');
  }
  
  const jobId = generateId();
  
  const newJob: StudioJob = {
    id: jobId,
    job_type: 'ris_import',
    status: 'queued',
    backend: 'ingestion-worker-node-' + Math.floor(Math.random() * 5),
    updated_at: new Date().toISOString(),
  };
  
  mockJobs.push(newJob);
  
  // Simulate background processing queue progression
  setTimeout(() => processJobInBackground(jobId, options), 2000);
  
  return newJob;
}

/**
 * Internal background processor that simulates the lifecycle of a job
 */
async function processJobInBackground(jobId: string, options: JobOptions) {
  const jobIndex = mockJobs.findIndex(j => j.id === jobId);
  if (jobIndex === -1) return;
  
  // Move to 'running'
  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    status: 'running',
    updated_at: new Date().toISOString()
  };
  
  // Simulate processing time
  const processingTime = Math.floor(Math.random() * 8000) + 4000;
  await delay(processingTime);
  
  // 15% chance of job failure for realism
  const shouldFail = Math.random() < 0.15;
  
  if (shouldFail) {
    mockJobs[jobIndex] = {
      ...mockJobs[jobIndex],
      status: 'failed',
      updated_at: new Date().toISOString(),
      result: {
        error: options.verifyDoi 
          ? 'DOI verification failed. CrossRef API timeout.'
          : 'Data corruption detected in RIS file line 42.'
      }
    };
    return;
  }
  
  // Success state
  const inserted = Math.floor(Math.random() * 50) + 10;
  const updated = Math.floor(Math.random() * 20);
  
  mockJobs[jobIndex] = {
    ...mockJobs[jobIndex],
    status: 'succeeded',
    updated_at: new Date().toISOString(),
    result: {
      output: {
        records_deduped: inserted + updated + Math.floor(Math.random() * 5),
        upsert: {
          inserted,
          updated
        }
      }
    }
  };
}
