'use client';

/**
 * Header Component - Navigation Bar with HoloKai Branding
 * 
 * Reusable navigation header component with integrated HoloKai logo and branding.
 * Applies Obsidian color (#1a1f2e) background by default.
 * 
 * @example
 * ```tsx
 * <Header logoVariant="auto" showBrand={true}>
 *   <nav>Navigation items...</nav>
 * </Header>
 * ```
 */

import React from 'react';
import Logo from './Logo';
import type { HeaderProps } from '../types/branding';
import { defaultBrandingConfig } from '../types/branding';

/**
 * Header Component
 */
export const Header: React.FC<HeaderProps> = ({
  logoVariant = 'auto',
  showBrand = true,
  className = '',
  children
}) => {
  const getLogoVariant = (): 'horizontal' | 'vertical' => {
    if (logoVariant === 'auto') {
      return 'horizontal'; // Will be handled by responsive prop in Logo
    }
    return logoVariant;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      style={{
        backgroundColor: defaultBrandingConfig.colors.primary
      }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo 
            variant={logoVariant === 'auto' ? 'horizontal' : logoVariant}
            responsive={logoVariant === 'auto'}
            size="medium"
            className="text-white"
          />
          {showBrand && (
            <span className="text-white text-xl font-semibold hidden sm:block">
              HoloKai
            </span>
          )}
        </div>
        
        {children && (
          <nav className="flex items-center gap-6">
            {children}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
