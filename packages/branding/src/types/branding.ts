/**
 * HoloKai Branding Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the HoloKai branding component library.
 */

/**
 * Logo component props
 */
export interface LogoProps {
  /** Logo style variant */
  variant: 'horizontal' | 'vertical' | '3d';
  /** Logo size preset */
  size?: 'small' | 'medium' | 'large';
  /** Enable responsive variant selection based on viewport */
  responsive?: boolean;
  /** Additional Tailwind CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * Header component props
 */
export interface HeaderProps {
  /** Logo variant selection mode */
  logoVariant?: 'auto' | 'horizontal' | 'vertical';
  /** Show brand text alongside logo */
  showBrand?: boolean;
  /** Additional Tailwind CSS classes */
  className?: string;
  /** Navigation items to render */
  children?: React.ReactNode;
}

/**
 * Footer component props
 */
export interface FooterProps {
  /** Logo size preset */
  logoSize?: 'small' | 'medium';
  /** Show copyright text */
  showCopyright?: boolean;
  /** Additional Tailwind CSS classes */
  className?: string;
  /** Custom copyright text */
  copyrightText?: string;
}

/**
 * MetaTags component props
 */
export interface MetaTagsProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Open Graph image URL */
  imageUrl?: string;
  /** Page URL */
  url?: string;
  /** Favicon URL */
  favicon?: string;
  /** Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image';
  /** Additional meta tags */
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

/**
 * Branding configuration interface
 */
export interface BrandingConfig {
  /** Logo asset paths */
  logos: {
    favicon: string;
    horizontal: string;
    vertical: string;
    '3d': string;
  };
  /** Color palette */
  colors: {
    primary: string;    // Obsidian #1a1f2e
    secondary: string;  // Forest #2d5a3d
    tertiary: string;   // Teal #3fa9a8
  };
  /** Viewport breakpoints for responsive behavior */
  viewportBreakpoints: {
    mobile: number;   // 768px
    tablet: number;   // 1024px
  };
}

/**
 * Web app manifest configuration interface
 */
export interface ManifestConfig {
  name: string;
  short_name: string;
  description: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
  theme_color: string;
  background_color: string;
  display?: string;
  orientation?: string;
}

/**
 * Default branding configuration
 */
export const defaultBrandingConfig: BrandingConfig = {
  logos: {
    favicon: '/logos/holokai-favicon.ico',
    horizontal: '/logos/holokai-logo-horizontal.jpg',
    vertical: '/logos/holokai-logo-vertical.jpg',
    '3d': '/logos/holokai-logo-3d.jpg'
  },
  colors: {
    primary: '#1a1f2e',    // Obsidian
    secondary: '#2d5a3d',  // Forest
    tertiary: '#3fa9a8'    // Teal
  },
  viewportBreakpoints: {
    mobile: 768,
    tablet: 1024
  }
};

/**
 * Logo size mappings in pixels
 */
export const logoSizes = {
  small: 40,
  medium: 80,
  large: 160
} as const;

/**
 * Logo size mappings for responsive behavior
 */
export const responsiveLogoSizes = {
  mobile: 40,    // < 768px
  tablet: 120,   // 768px - 1024px
  desktop: 160   // > 1024px
} as const;
