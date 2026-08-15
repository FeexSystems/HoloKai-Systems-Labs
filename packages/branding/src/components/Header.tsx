'use client';

/**
 * Header Component - Navigation Bar with HoloKai Branding
 * 
 * Reusable navigation header component with integrated HoloKai logo and branding.
 * Applies Obsidian color (#1a1f2e) background by default.
 * 
 * @example
 * ```tsx
 * <Header showBrand={true}>
 *   <nav>Navigation items...</nav>
 * </Header>
 * ```
 */

import React from 'react';
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
  return (
    <header
      className={`relative z-50 h-[84px] w-full ${className}`}
      style={{
        backgroundColor: defaultBrandingConfig.colors.primary
      }}
    >
      {/* Container removed as requested for layout evaluation */}
    </header>
  );
};

export default Header;
