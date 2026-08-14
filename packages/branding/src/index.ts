/**
 * @holokai/branding
 * 
 * HoloKai Branding Component Library
 * 
 * A reusable component library for HoloKai branding across all platform applications.
 * Includes Logo, Header, Footer, and MetaTags components with responsive behavior
 * and consistent color palette application.
 * 
 * @example
 * ```tsx
 * import { Logo, Header, Footer, MetaTags } from '@holokai/branding';
 * 
 * function App() {
 *   return (
 *     <>
 *       <MetaTags title="My Page" description="My Description" />
 *       <Header logoVariant="auto">
 *         <nav>Navigation</nav>
 *       </Header>
 *       <main>Content</main>
 *       <Footer showCopyright={true} />
 *     </>
 *   );
 * }
 * ```
 */

// Components
export { Logo } from './components/Logo';
export { Header } from './components/Header';
export { Footer } from './components/Footer';
export { MetaTags } from './components/MetaTags';

// Types
export type {
  LogoProps,
  HeaderProps,
  FooterProps,
  MetaTagsProps,
  BrandingConfig,
  ManifestConfig
} from './types/branding';

// Constants
export {
  defaultBrandingConfig,
  logoSizes,
  responsiveLogoSizes
} from './types/branding';
