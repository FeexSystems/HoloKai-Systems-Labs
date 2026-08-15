'use client';

/**
 * Logo Component - Responsive HoloKai Logo Display
 * 
 * Renders HoloKai logo in various orientations and sizes with responsive viewport-aware logic.
 * 
 * @example
 * ```tsx
 * <Logo variant="horizontal" size="large" responsive={true} />
 * ```
 */

import React, { useState, useEffect } from 'react';
import type { LogoProps } from '../types/branding';
import { defaultBrandingConfig, logoSizes, responsiveLogoSizes } from '../types/branding';

/**
 * Logo Component
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'medium',
  responsive = false,
  className = '',
  alt = 'HoloKai'
}) => {
  const [currentVariant, setCurrentVariant] = useState<'horizontal' | 'vertical' | '3d'>(variant);
  const [currentSize, setCurrentSize] = useState<number>(logoSizes[size]);

  useEffect(() => {
    if (!responsive) {
      setCurrentVariant(variant);
      setCurrentSize(logoSizes[size]);
      return;
    }

    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        // Mobile: vertical logo
        setCurrentVariant('vertical');
        setCurrentSize(responsiveLogoSizes.mobile);
      } else if (width < 1024) {
        // Tablet: horizontal logo, medium size
        setCurrentVariant('horizontal');
        setCurrentSize(responsiveLogoSizes.tablet);
      } else {
        // Desktop: horizontal logo, large size
        setCurrentVariant('horizontal');
        setCurrentSize(responsiveLogoSizes.desktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [responsive, variant, size]);

  const logoPath = defaultBrandingConfig.logos[currentVariant];
  
  // Calculate dimensions based on variant
  const getDimensions = () => {
    if (currentVariant === 'vertical') {
      return { width: currentSize, height: currentSize };
    }
    // Horizontal and 3D logos are wider
    return { width: currentSize * 2, height: currentSize };
  };

  const { width, height } = getDimensions();

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={logoPath}
        alt={alt}
        width={width}
        height={height}
        className="object-contain max-h-full"
        style={{
          maxWidth: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default Logo;
