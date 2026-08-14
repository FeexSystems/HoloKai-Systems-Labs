/**
 * Wave 7C Task 115: Response Compression
 * Gzip compression on all JSON responses
 */

import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

/**
 * Compression filter - only compress compressible content types
 */
export function shouldCompress(req: Request, res: Response): boolean {
  const type = res.getHeader('Content-Type') as string;

  // Don't compress if already compressed
  if (res.getHeader('Content-Encoding')) {
    return false;
  }

  // Only compress these content types
  const compressibleTypes = [
    'text/',
    'application/json',
    'application/javascript',
    'application/xml',
    'application/xhtml+xml',
    'image/svg+xml'
  ];

  return compressibleTypes.some(t => type?.includes(t));
}

/**
 * Compression middleware with custom filter
 */
export const compressionMiddleware = compression({
  filter: shouldCompress,
  threshold: 1024, // Only compress responses larger than 1KB
  level: 6, // Compression level (1-9, 6 is default)
  chunkSize: 16 * 1024 // 16KB chunks
});

/**
 * Brotli compression middleware (if supported)
 * Note: Requires node-compression or similar package
 */
export function brotliCompression(req: Request, res: Response, next: NextFunction) {
  // Check if client supports Brotli
  const acceptEncoding = req.get('Accept-Encoding') || '';
  
  if (acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
    // Brotli compression would be applied here
    // This requires a Brotli compression library
  }
  
  next();
}

/**
 * Add compression headers to response
 */
export function addCompressionHeaders(req: Request, res: Response, next: NextFunction) {
  // Vary header for proper caching with compression
  res.setHeader('Vary', 'Accept-Encoding');
  
  next();
}
