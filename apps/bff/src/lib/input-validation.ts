/**
 * Wave 7D Task 117: Input Validation
 * Zod schemas on all endpoints
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // UUID validation
  uuid: z.string().uuid('Invalid UUID format'),

  // Email validation
  email: z.string().email('Invalid email address'),

  // URL validation
  url: z.string().url('Invalid URL format'),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  }),

  // Date range
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  }).refine(data => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, 'End date must be after start date')
};

/**
 * Oracle endpoint validation
 */
export const oracleSchemas = {
  query: z.object({
    prompt: z.string().min(1, 'Query cannot be empty').max(2000, 'Query too long (max 2000 characters)'),
    civilizationFocus: z.string().max(100, 'Civilization focus too long').optional(),
    stream: z.coerce.boolean().default(false),
    agentType: z.enum(['knowledge', 'voice', 'vision', 'archive']).optional(),
    conversationId: z.string().uuid().optional()
  }),

  speak: z.object({
    text: z.string().min(1, 'Text cannot be empty').max(5000, 'Text too long (max 5000 characters)'),
    engine: z.enum(['elevenlabs', 'deepgram']),
    voiceId: z.string().min(1, 'Voice ID required')
  })
};

/**
 * Archive endpoint validation
 */
export const archiveSchemas = {
  search: z.object({
    query: z.string().max(500, 'Search query too long').optional(),
    category: z.enum(['person', 'place', 'event', 'artifact', 'concept']).optional(),
    civilizationId: z.string().max(100).optional(),
    era: z.string().max(100).optional(),
    region: z.string().max(100).optional(),
    ...commonSchemas.pagination.shape
  }),

  upload: z.object({
    title: z.string().min(1, 'Title required').max(200, 'Title too long'),
    description: z.string().min(1, 'Description required').max(1000, 'Description too long'),
    category: z.enum(['person', 'place', 'event', 'artifact', 'concept']),
    civilizationId: z.string().max(100).optional(),
    era: z.string().max(100).optional(),
    region: z.string().max(100).optional()
  }),

  tags: z.object({
    tags: z.array(z.object({
      id: z.string(),
      name: z.string().min(1).max(50),
      category: z.enum(['topic', 'civilization', 'period', 'language', 'custom'])
    })).min(1, 'At least one tag required').max(20, 'Too many tags (max 20)')
  })
};

/**
 * Commerce endpoint validation
 */
export const commerceSchemas = {
  checkout: z.object({
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID required'),
      tier: z.enum(['free', 'pro', 'enterprise']),
      quantity: z.coerce.number().int().min(1).max(10).default(1)
    })).min(1, 'At least one item required').max(10, 'Too many items (max 10)'),
    paymentMethod: z.string().min(1, 'Payment method required'),
    billingAddress: z.object({
      name: z.string().min(1).max(100),
      email: commonSchemas.email,
      address: z.string().min(1).max(200),
      city: z.string().min(1).max(100),
      country: z.string().min(2).max(2),
      postalCode: z.string().min(1).max(20)
    }).optional()
  }),

  subscription: z.object({
    tier: z.enum(['free', 'pro', 'enterprise']),
    billingPeriod: z.enum(['month', 'year']).default('month')
  })
};

/**
 * Research endpoint validation
 */
export const researchSchemas = {
  search: z.object({
    query: z.string().min(1, 'Search query required').max(500),
    domain: z.string().max(100).optional(),
    era: z.string().max(100).optional(),
    region: z.string().max(100).optional(),
    confidence: z.coerce.number().min(0).max(1).optional(),
    ...commonSchemas.pagination.shape
  }),

  article: z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1).max(50000),
    domain: z.string().max(100),
    era: z.string().max(100).optional(),
    region: z.string().max(100).optional(),
    tags: z.array(z.string().max(50)).optional()
  })
};

/**
 * Transcription endpoint validation
 */
export const transcribeSchemas = {
  transcribe: z.object({
    audio: z.any(), // File validation happens in middleware
    mimeType: z.enum(['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg']),
    detectLanguage: z.coerce.boolean().default(true),
    language: z.string().max(10).optional()
  })
};

/**
 * Identity endpoint validation
 */
export const identitySchemas = {
  profile: z.object({
    name: z.string().min(1).max(100),
    civilization: z.string().min(1).max(50),
    role: z.string().min(1).max(50),
    bio: z.string().max(500).optional()
  }),

  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    language: z.string().max(10).default('en'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      marketing: z.boolean().default(false)
    }).optional()
  })
};

/**
 * Validation middleware factory
 */
export function validateBody(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }))
      });
    }

    req.validatedBody = result.data;
    next();
  };
}

/**
 * Query parameter validation middleware
 */
export function validateQuery(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: 'Query validation failed',
        issues: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }))
      });
    }

    req.validatedQuery = result.data;
    next();
  };
}

/**
 * Params validation middleware
 */
export function validateParams(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: 'Parameter validation failed',
        issues: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }))
      });
    }

    req.validatedParams = result.data;
    next();
  };
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * SQL injection prevention
 */
export function sanitizeSqlInput(input: string): string {
  // Remove dangerous SQL characters
  return input
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * NoSQL injection prevention
 */
export function sanitizeNoSqlInput(input: any): any {
  if (typeof input === 'string') {
    // Remove MongoDB operators
    return input.replace(/\$[a-zA-Z]+/g, '');
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      if (key.startsWith('$')) {
        continue; // Skip operator keys
      }
      sanitized[key] = sanitizeNoSqlInput(input[key]);
    }
    return sanitized;
  }

  return input;
}
