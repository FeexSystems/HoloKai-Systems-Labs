'use client';

/**
 * Footer Component - Page Bottom with HoloKai Branding
 * 
 * Reusable footer component with integrated HoloKai logo and branding.
 * Applies Forest color (#2d5a3d) accent by default.
 * 
 * @example
 * ```tsx
 * <Footer logoSize="small" showCopyright={true} />
 * ```
 */

import React from 'react';
import Logo from './Logo';
import type { FooterProps } from '../types/branding';
import { defaultBrandingConfig } from '../types/branding';

/**
 * Footer Component
 */
export const Footer: React.FC<FooterProps> = ({
  logoSize = 'small',
  showCopyright = true,
  copyrightText = '© 2024 HoloKai Systems',
  className = ''
}) => {
  return (
    <footer
      className={`w-full py-6 ${className}`}
      style={{
        backgroundColor: defaultBrandingConfig.colors.secondary
      }}
    >
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo 
            variant="horizontal"
            size={logoSize}
            className="text-white opacity-90"
          />
          <span className="text-white text-sm opacity-75">
            {copyrightText}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-white opacity-75">
          <a href="#" className="hover:opacity-100 transition-opacity">
            Privacy
          </a>
          <a href="#" className="hover:opacity-100 transition-opacity">
            Terms
          </a>
          <a href="#" className="hover:opacity-100 transition-opacity">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
