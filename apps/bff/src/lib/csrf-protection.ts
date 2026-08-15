/**
 * Wave 7D Task 120: CSRF Protection
 * Token-based CSRF on state-changing operations
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * CSRF token configuration
 */
const CSRF_CONFIG = {
  tokenLength: 32,
  tokenExpiration: 3600000, // 1 hour
  cookieName: 'csrf_token',
  headerName: 'x-csrf-token'
};

/**
 * Generate a random CSRF token
 */
function createCSRFTokenString(): string {
  return crypto.randomBytes(CSRF_CONFIG.tokenLength).toString('hex');
}

/**
 * Generate a CSRF token with timestamp
 */
function generateCSRFTokenWithTimestamp(): { token: string; timestamp: number } {
  return {
    token: createCSRFTokenString(),
    timestamp: Date.now()
  };
}

/**
 * Validate CSRF token string format
 */
function checkCSRFTokenFormat(token: string, sessionToken: string): boolean {
  // In production, tokens should be stored in session/database
  // For now, we'll do basic validation
  if (!token || !sessionToken) {
    return false;
  }

  if (token.length !== CSRF_CONFIG.tokenLength * 2) {
    return false;
  }

  // Check if token matches hexadecimal pattern
  if (!/^[a-f0-9]+$/.test(token)) {
    return false;
  }

  return true;
}

/**
 * CSRF token storage (in production, use Redis or database)
 */
class CSRFTokenStore {
  private tokens: Map<string, { token: string; timestamp: number; expiresAt: number }> = new Map();

  set(sessionId: string, token: string): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + CSRF_CONFIG.tokenExpiration;

    this.tokens.set(sessionId, {
      token,
      timestamp,
      expiresAt
    });

    // Clean up expired tokens periodically
    this.cleanup();
  }

  get(sessionId: string): string | null {
    const stored = this.tokens.get(sessionId);
    
    if (!stored) {
      return null;
    }

    if (Date.now() > stored.expiresAt) {
      this.tokens.delete(sessionId);
      return null;
    }

    return stored.token;
  }

  validate(sessionId: string, token: string): boolean {
    const storedToken = this.get(sessionId);
    
    if (!storedToken) {
      return false;
    }

    return storedToken === token;
  }

  delete(sessionId: string): void {
    this.tokens.delete(sessionId);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [sessionId, stored] of this.tokens.entries()) {
      if (now > stored.expiresAt) {
        this.tokens.delete(sessionId);
      }
    }
  }
}

export const csrfTokenStore = new CSRFTokenStore();

/**
 * Generate CSRF token middleware
 */
export function generateCSRFToken(req: Request, res: Response, next: NextFunction) {
  const sessionId = (req as any).sessionID || req.ip || 'default';
  const { token, timestamp } = generateCSRFTokenWithTimestamp();

  // Store token in session
  csrfTokenStore.set(sessionId, token);

  // Set token in cookie (HttpOnly for security)
  res.cookie(CSRF_CONFIG.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_CONFIG.tokenExpiration / 1000,
    path: '/'
  });

  // Also return token in response for client-side use
  (req as any).csrfToken = token;

  next();
}

/**
 * Validate CSRF token middleware
 */
export function validateCSRFToken(req: Request, res: Response, next: NextFunction) {
  // Skip validation for GET, HEAD, OPTIONS (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const sessionId = (req as any).sessionID || req.ip || 'default';
  
  // Get token from header
  const headerToken = req.get(CSRF_CONFIG.headerName);
  
  // Get token from cookie
  const cookieToken = req.cookies?.[CSRF_CONFIG.cookieName];

  // Validate both tokens match and are valid
  if (!headerToken || !cookieToken) {
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'CSRF token is required for this operation'
    });
  }

  if (headerToken !== cookieToken) {
    return res.status(403).json({
      error: 'CSRF token mismatch',
      message: 'CSRF tokens do not match'
    });
  }

  // Validate against stored token
  if (!csrfTokenStore.validate(sessionId, headerToken)) {
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF token is invalid or expired'
    });
  }

  next();
}

/**
 * Double Submit Cookie Pattern
 * Alternative CSRF protection method
 */
export function doubleSubmitCookie(req: Request, res: Response, next: NextFunction) {
  // Skip validation for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies?.[CSSRF_CONFIG.cookieName];
  const headerToken = req.get(CSRF_CONFIG.headerName);

  if (!cookieToken || !headerToken) {
    return res.status(403).json({
      error: 'CSRF validation failed',
      message: 'CSRF tokens required'
    });
  }

  if (cookieToken !== headerToken) {
    return res.status(403).json({
      error: 'CSRF validation failed',
      message: 'CSRF token mismatch'
    });
  }

  next();
}

/**
 * CSRF token refresh middleware
 */
export function refreshCSRFToken(req: Request, res: Response, next: NextFunction) {
  const sessionId = (req as any).sessionID || req.ip || 'default';
  
  // Delete old token
  csrfTokenStore.delete(sessionId);
  
  // Generate new token
  generateCSRFToken(req, res, next);
}

/**
 * Add CSRF token to response
 */
export function addCSRFToken(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).csrfToken;
  
  if (token) {
    res.setHeader('X-CSRF-Token', token);
  }
  
  next();
}

/**
 * CSRF-safe methods (no validation required)
 */
export const CSRF_SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];

/**
 * Check if request method requires CSRF validation
 */
export function requiresCSRFValidation(method: string): boolean {
  return !CSRF_SAFE_METHODS.includes(method.toUpperCase());
}

/**
 * Apply CSRF protection to specific routes
 */
export function csrfProtection(options: {
  generateOnGet?: boolean;
  ignoreMethods?: string[];
} = {}) {
  const { generateOnGet = true, ignoreMethods = [] } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Generate token on GET requests if configured
    if (req.method === 'GET' && generateOnGet) {
      return generateCSRFToken(req, res, next);
    }

    // Skip validation for ignored methods
    if (ignoreMethods.includes(req.method)) {
      return next();
    }

    // Validate token for state-changing methods
    if (requiresCSRFValidation(req.method)) {
      return validateCSRFToken(req, res, next);
    }

    next();
  };
}

/**
 * CSRF error handler
 */
export function csrfErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.message && err.message.includes('CSRF')) {
    return res.status(403).json({
      error: 'CSRF Error',
      message: err.message
    });
  }
  next(err);
}
