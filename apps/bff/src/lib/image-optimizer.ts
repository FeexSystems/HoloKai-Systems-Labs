/**
 * Wave 7C Task 112: Image Optimization
 * Compress product photos, use WebP format
 */

import sharp from 'sharp';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  progressive?: boolean;
  stripMetadata?: boolean;
}

export class ImageOptimizer {
  private static readonly DEFAULT_OPTIONS: ImageOptimizationOptions = {
    width: 1200,
    quality: 85,
    format: 'webp',
    progressive: true,
    stripMetadata: true
  };

  /**
   * Optimize an image buffer
   */
  static async optimize(
    inputBuffer: Buffer,
    options: ImageOptimizationOptions = {}
  ): Promise<Buffer> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };

    let pipeline = sharp(inputBuffer);

    // Strip metadata (EXIF, IPTC, XMP) to reduce file size
    if (config.stripMetadata) {
      pipeline = pipeline.metadata();
    }

    // Resize if dimensions specified
    if (config.width || config.height) {
      pipeline = pipeline.resize(config.width, config.height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Apply format-specific optimization
    switch (config.format) {
      case 'webp':
        pipeline = pipeline.webp({ quality: config.quality });
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg({ 
          quality: config.quality, 
          progressive: config.progressive 
        });
        break;
      case 'png':
        pipeline = pipeline.png({ 
          quality: config.quality,
          compressionLevel: 9,
          adaptiveFiltering: true
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: config.quality });
        break;
    }

    return pipeline.toBuffer();
  }

  /**
   * Generate multiple responsive image sizes
   */
  static async generateResponsiveImages(
    inputBuffer: Buffer,
    sizes: number[] = [320, 640, 1024, 1920]
  ): Promise<{ size: number; buffer: Buffer }[]> {
    const results = await Promise.all(
      sizes.map(async (size) => ({
        size,
        buffer: await this.optimize(inputBuffer, { width: size, format: 'webp' })
      }))
    );

    return results;
  }

  /**
   * Generate srcset attribute for responsive images
   */
  static generateSrcset(
    baseUrl: string,
    sizes: number[],
    format: string = 'webp'
  ): string {
    return sizes
      .map(size => `${baseUrl}-${size}w.${format} ${size}w`)
      .join(', ');
  }

  /**
   * Calculate optimal quality based on image content
   */
  static async calculateOptimalQuality(inputBuffer: Buffer): Promise<number> {
    const metadata = await sharp(inputBuffer).metadata();
    
    // Lower quality for images with simple gradients
    // Higher quality for images with complex details
    const stats = await sharp(inputBuffer).stats();
    
    // Calculate entropy as a proxy for complexity
    const entropy = this.calculateEntropy(stats);
    
    if (entropy < 3) {
      return 75; // Low complexity - lower quality
    } else if (entropy < 6) {
      return 85; // Medium complexity - medium quality
    } else {
      return 95; // High complexity - higher quality
    }
  }

  /**
   * Calculate image entropy
   */
  private static calculateEntropy(stats: any): number {
    // Simplified entropy calculation
    // In production, use a more sophisticated algorithm
    const channels = ['r', 'g', 'b'];
    let totalEntropy = 0;

    for (const channel of channels) {
      const channelStats = stats.channels?.[channel];
      if (channelStats) {
        const histogram = channelStats.histogram || [];
        const entropy = this.calculateHistogramEntropy(histogram);
        totalEntropy += entropy;
      }
    }

    return totalEntropy / 3;
  }

  /**
   * Calculate entropy from histogram
   */
  private static calculateHistogramEntropy(histogram: number[]): number {
    const total = histogram.reduce((sum, val) => sum + val, 0);
    if (total === 0) return 0;

    let entropy = 0;
    for (const count of histogram) {
      if (count > 0) {
        const probability = count / total;
        entropy -= probability * Math.log2(probability);
      }
    }

    return entropy;
  }

  /**
   * Convert image to WebP format
   */
  static async convertToWebP(inputBuffer: Buffer, quality: number = 85): Promise<Buffer> {
    return sharp(inputBuffer)
      .webp({ quality })
      .toBuffer();
  }

  /**
   * Generate placeholder blur image
   */
  static async generatePlaceholder(
    inputBuffer: Buffer,
    width: number = 20,
    quality: number = 30
  ): Promise<Buffer> {
    return sharp(inputBuffer)
      .resize(width)
      .blur(2)
      .webp({ quality })
      .toBuffer();
  }

  /**
   * Get image metadata
   */
  static async getMetadata(inputBuffer: Buffer) {
    return sharp(inputBuffer).metadata();
  }

  /**
   * Validate image format
   */
  static isValidImageFormat(buffer: Buffer): boolean {
    const signature = buffer.subarray(0, 4).toString('hex');
    
    // JPEG: FF D8 FF
    if (signature.startsWith('ffd8ff')) return true;
    
    // PNG: 89 50 4E 47
    if (signature === '89504e47') return true;
    
    // WebP: 52 49 46 46
    if (signature === '52494646') return true;
    
    // GIF: 47 49 46 38
    if (signature === '47494638') return true;
    
    return false;
  }
}

/**
 * Express middleware for image optimization
 */
export function imageOptimizationMiddleware(req: any, res: any, next: any) {
  const originalSend = res.send;

  res.send = async function (body: any) {
    // Only optimize if response is an image
    const contentType = res.getHeader('Content-Type');
    
    if (contentType && contentType.startsWith('image/')) {
      try {
        const optimized = await ImageOptimizer.optimize(body, {
          format: 'webp',
          quality: 85,
          stripMetadata: true
        });
        
        res.setHeader('Content-Type', 'image/webp');
        res.setHeader('X-Optimized', 'true');
        return originalSend.call(this, optimized);
      } catch (error) {
        console.error('Image optimization failed:', error);
        // Fall back to original image
        return originalSend.call(this, body);
      }
    }
    
    return originalSend.call(this, body);
  };

  next();
}
