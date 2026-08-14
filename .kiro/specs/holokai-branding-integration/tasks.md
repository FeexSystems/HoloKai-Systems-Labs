# Implementation Plan: HoloKai Branding Integration

## Overview

This implementation plan converts HoloKai's branding design into a series of incremental development tasks. The approach follows a layered strategy:

1. **Foundation**: Create the shared branding component library with reusable Logo, Header, and Footer components
2. **Integration**: Integrate branding components into each of the 6 web apps and shell
3. **Meta & Manifest**: Set up meta tags and update manifest.json files
4. **Assets & Configuration**: Organize and configure asset serving and color palette integration
5. **Testing & Verification**: Comprehensive testing across all apps

The implementation uses TypeScript/React/Next.js throughout all target apps and the new branding package.

## Tasks

- [ ] 1. Create branding component library package structure
  - Set up new package directory at `packages/branding/` or `libs/holokai-branding`
  - Create `package.json` with dependencies (react, react-dom, next, tailwindcss)
  - Create `tsconfig.json` for TypeScript configuration
  - Create `src/` directory structure: `components/`, `types/`, `index.ts`
  - Set up barrel export file (`src/index.ts`) to export all components
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 2. Implement Logo component (responsive logo selection)
  - Create `src/components/Logo.tsx` with responsive viewport-aware logic
  - Implement props: `variant` (horizontal | vertical | 3d), `size` (small | medium | large), `responsive`, `className`
  - Add Tailwind CSS classes for sizing: small=40px, medium=80px, large=160px
  - Implement responsive logic: viewport < 768px → vertical, >= 768px → horizontal
  - Use Next.js Image component for optimization
  - Add JSDoc documentation and TypeScript interfaces
  - _Requirements: 2.2, 6.1, 6.6, 9.1, 9.2, 9.3_

- [ ]* 2.1 Write unit tests for Logo component
  - Test responsive variant selection (mobile → vertical, desktop → horizontal)
  - Test size props render correct dimensions
  - Test className prop merges with default classes
  - Create snapshot tests for different viewport sizes
  - _Requirements: 2.2, 6.1_

- [ ] 3. Implement Header component (navigation integration)
  - Create `src/components/Header.tsx` as reusable navigation header
  - Add props: `logoVariant` (auto | horizontal | vertical), `showBrand`, `className`
  - Integrate Logo component with responsive logic
  - Apply Obsidian color background (#1a1f2e) via Tailwind
  - Add navigation slot/children prop for app-specific navigation items
  - Export as self-contained component usable in all apps
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.1_

- [ ]* 3.1 Write unit tests for Header component
  - Test Logo renders in header
  - Test responsive logo variant selection
  - Test Obsidian background color applied
  - Create snapshot tests for header rendering
  - _Requirements: 2.1, 2.3_

- [ ] 4. Implement Footer component (page bottom branding)
  - Create `src/components/Footer.tsx` as reusable footer component
  - Add props: `logoSize` (small | medium), `showCopyright`, `className`
  - Integrate Logo component with smaller size
  - Apply Forest color accent (#2d5a3d) via Tailwind
  - Include copyright text: "© 2024 HoloKai Systems" when `showCopyright={true}`
  - Make responsive: adjust logo size on mobile
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.2_

- [ ]* 4.1 Write unit tests for Footer component
  - Test footer renders with logo
  - Test copyright text appears when enabled
  - Test Forest color accent applied
  - Create snapshot tests for footer rendering
  - _Requirements: 3.1, 3.3_

- [ ] 5. Implement MetaTags component (social media integration)
  - Create `src/components/MetaTags.tsx` for Open Graph and meta tag generation
  - Add props: `title`, `description`, `imageUrl`, `url`, `favicon`
  - Generate meta tags: og:title, og:description, og:image, og:url, og:type
  - Generate Twitter Card tags: twitter:card, twitter:title, twitter:description, twitter:image
  - Generate favicon link tag pointing to holokai-favicon.ico
  - If no imageUrl provided, default to holokai-logo-horizontal.jpg
  - Handle existing meta tags (don't duplicate)
  - Implement fallback logic for missing meta tags (requirement 5.4)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 5.1 Write unit tests for MetaTags component
  - Test Open Graph meta tags generated correctly
  - Test Twitter Card tags present
  - Test favicon link tag present
  - Test default image URL used when not specified
  - Test fallback behavior when no explicit meta tags provided
  - _Requirements: 5.1, 5.4_

- [ ] 6. Create TypeScript type definitions and exports
  - Define `src/types/branding.ts` with all component interfaces
  - Define `BrandingConfig` interface for configuration
  - Define `ManifestConfig` interface for manifest structure
  - Create `src/index.ts` barrel export with all components and types
  - Add JSDoc comments to all exports
  - Verify TypeScript compilation with no errors
  - _Requirements: 6.4, 6.5_

- [ ] 7. Checkpoint - Verify branding library builds and exports
  - Build the branding package: `npm run build` or `pnpm build`
  - Verify no TypeScript errors
  - Verify components can be imported: `import { Logo, Header, Footer } from '@holokai/branding'`
  - Test import in one web app to verify package resolution
  - Ensure all exports are accessible and properly typed

- [ ] 8. Update shell app to integrate branding components
  - Add `@holokai/branding` as dependency in `apps/shell/package.json`
  - Import Logo, Header, Footer components
  - Update shell app layout: add Header component to root layout
  - Update shell app layout: add Footer component to root layout
  - Verify shell app builds with branding components
  - Test responsive logo selection in shell
  - _Requirements: 2.1, 2.4, 3.1, 3.3, 2.2_

- [ ]* 8.1 Write integration test for shell branding integration
  - Test shell app builds with branding components
  - Verify logo renders in header on desktop and mobile
  - Verify footer displays correctly
  - _Requirements: 2.1, 3.1_

- [ ] 9. Integrate branding into web-home app
  - Add `@holokai/branding` as dependency in `apps/web-home/package.json`
  - Import Logo, Header, Footer components
  - Update layout: replace existing header with Header component
  - Update layout: replace or add Footer component
  - Integrate holokai-logo-3d.jpg in hero section (use Logo component with variant='3d')
  - Verify responsive behavior: vertical logo on mobile, horizontal on desktop
  - Test web-home builds successfully
  - _Requirements: 2.1, 2.4, 3.1, 4.1, 4.2, 4.3, 4.4, 9.1, 9.2_

- [ ]* 9.1 Write integration test for web-home branding
  - Test web-home builds with branding
  - Verify logo appears in header and footer
  - Verify 3D logo displays in hero section
  - Test responsive logo sizing on mobile viewport
  - _Requirements: 2.1, 4.1, 9.1_

- [ ] 10. Integrate branding into web-oracle app
  - Add `@holokai/branding` as dependency in `apps/web-oracle/package.json`
  - Import and integrate Header component (replace existing header)
  - Import and integrate Footer component
  - Update layout to use new branding components
  - Test responsive behavior across viewports
  - Verify web-oracle builds successfully
  - _Requirements: 2.1, 2.4, 3.1, 9.1, 9.2_

- [ ]* 10.1 Write integration test for web-oracle branding
  - Test web-oracle builds with branding components
  - Verify logo renders responsively
  - Test footer displays correctly
  - _Requirements: 2.1, 3.1_

- [ ] 11. Integrate branding into web-cart app
  - Add `@holokai/branding` as dependency in `apps/web-cart/package.json`
  - Import and integrate Header component
  - Import and integrate Footer component
  - Update layout with new branding
  - Verify responsive behavior and build success
  - _Requirements: 2.1, 2.4, 3.1, 9.1, 9.2_

- [ ]* 11.1 Write integration test for web-cart branding
  - Verify branding components integrate and render
  - Test responsive logo selection
  - _Requirements: 2.1, 3.1_

- [ ] 12. Integrate branding into web-research app
  - Add `@holokai/branding` as dependency in `apps/web-research/package.json`
  - Import and integrate Header and Footer components
  - Update app layout
  - Test responsive behavior and build
  - _Requirements: 2.1, 2.4, 3.1, 9.1, 9.2_

- [ ]* 12.1 Write integration test for web-research branding
  - Verify components render correctly
  - Test mobile and desktop responsive behavior
  - _Requirements: 2.1, 3.1_

- [ ] 13. Integrate branding into web-archive app
  - Add `@holokai/branding` as dependency in `apps/web-archive/package.json`
  - Import and integrate Header and Footer components
  - Update layout with new branding
  - Verify build and responsive functionality
  - _Requirements: 2.1, 2.4, 3.1, 9.1, 9.2_

- [ ]* 13.1 Write integration test for web-archive branding
  - Test branding integration and rendering
  - Verify responsive behavior
  - _Requirements: 2.1, 3.1_

- [ ] 14. Checkpoint - Verify all 6 apps build with branding
  - Build all apps: shell, web-home, web-oracle, web-cart, web-research, web-archive
  - Verify no TypeScript errors in any app
  - Verify no console warnings related to branding
  - Check that logos render in headers and footers
  - Verify responsive behavior on sample pages

- [ ] 15. Create favicon deployment across all apps
  - Copy holokai-favicon.ico from `apps/shell/public/logos/` to each app's public directory
  - Or: Create symlink/reference to shell asset (alternative approach)
  - Update each app's `next.config.js` if needed for asset serving
  - Add cache-busting strategy: serve favicon with query parameter `?v=TIMESTAMP`
  - Verify favicon appears in browser tab for each app
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 10.1, 10.2_

- [ ]* 15.1 Write smoke test for favicon deployment
  - Verify favicon.ico file exists in each app
  - Verify HTML head contains correct `<link rel="icon">` tag
  - Check cache headers are set appropriately
  - _Requirements: 1.1, 1.3_

- [ ] 16. Update manifest.json files across all apps
  - For each of 6 apps, update or create `public/manifest.json`
  - Set name: "HoloKai Platform" and short_name: "HoloKai"
  - Add description: "HoloKai Systems - Advanced Platform"
  - Include icons array with favicon in multiple sizes (16x16, 32x32, 64x64)
  - Set theme_color: "#1a1f2e" (Obsidian)
  - Set background_color: "#ffffff" (white)
  - Verify manifest.json syntax is valid JSON
  - Test manifest loads without errors
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 16.1 Write configuration test for manifest.json
  - Validate manifest.json structure for each app
  - Verify HoloKai name and descriptions present
  - Verify icons array has multiple sizes
  - Verify theme_color and background_color set
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 17. Implement meta tag generation for all apps
  - In each app's root layout or `_document.tsx` equivalent
  - Import MetaTags component from `@holokai/branding`
  - Integrate MetaTags component with default app title and description
  - Set default og:image to holokai-logo-horizontal.jpg
  - Ensure favicon link tag is present with cache-busting parameter
  - Test meta tags appear in HTML head
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 17.1 Write integration test for meta tags
  - Verify Open Graph meta tags present
  - Verify Twitter Card tags present
  - Verify favicon link tag present
  - Test social media sharing preview
  - _Requirements: 5.1, 5.2_

- [ ] 18. Create and configure design tokens for color palette
  - In shared design tokens package (`packages/design-tokens/`), define Tailwind CSS variables:
    - `--color-obsidian: #1a1f2e`
    - `--color-forest: #2d5a3d`
    - `--color-teal: #3fa9a8`
  - Add to Tailwind config in `tailwind.config.ts` for each app
  - Update branding components to use design token variables
  - Verify colors apply consistently across all components
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 18.1 Write configuration test for design tokens
  - Verify Tailwind CSS contains color variables
  - Verify colors are consistent across all apps
  - Check for conflicting color definitions
  - _Requirements: 8.1, 8.5_

- [ ] 19. Implement responsive image serving and optimization
  - Configure Next.js Image component to serve appropriately-sized images for each viewport
  - Implement srcSet for Logo component to serve different sizes for mobile/desktop
  - Add image optimization: lazy-loading, format conversion (AVIF/WebP)
  - Test image loading performance
  - Verify images scale appropriately on mobile and desktop
  - _Requirements: 9.3, 9.4_

- [ ]* 19.1 Write integration test for responsive images
  - Verify appropriate image sizes served for each viewport
  - Test aspect ratio maintained
  - Verify images optimize on different devices
  - _Requirements: 9.3, 9.4_

- [ ] 20. Create asset documentation and inventory
  - Create `BRANDING_ASSETS.md` document listing all HoloKai assets
  - Document asset locations: `apps/shell/public/logos/`
  - Document each asset: filename, dimensions, aspect ratio, recommended usage
  - Provide usage examples for each asset and component
  - Create quick reference guide for developers
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 21. Verify asset accessibility and paths across all apps
  - Test asset paths resolve correctly in all 6 web apps
  - Verify logo images load without 404 errors
  - Test favicon loads in all apps
  - Verify no CORS or CSP issues with asset loading
  - Document asset serving strategy (centralized vs. distributed)
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 22. Checkpoint - All apps render branding correctly
  - Build all 6 apps
  - Verify logos appear in headers (responsive: vertical on mobile, horizontal on desktop)
  - Verify footers display with branding
  - Verify favicon appears in browser tabs
  - Verify meta tags present for social sharing
  - Verify manifest.json configured
  - Verify no console errors or warnings

- [ ] 23. Run cross-app consistency tests
  - Verify Header component renders consistently across all apps
  - Verify Footer component styling matches across all apps
  - Compare color palette usage (Obsidian, Forest, Teal) across apps
  - Check logo placement and sizing consistency
  - Verify responsive behavior works on all apps
  - Document any inconsistencies found
  - _Requirements: 2.3, 2.4, 3.2, 3.3, 8.5, 9.1, 9.2_

- [ ]* 23.1 Write visual regression tests (recommended)
  - Create visual snapshots of each app at desktop viewport
  - Create visual snapshots of each app at mobile viewport
  - Compare snapshots across all 6 apps for consistency
  - Verify logo, header, footer placement matches
  - _Requirements: 2.3, 2.4, 3.2_

- [ ] 24. Update BFF (backend-for-frontend) if needed
  - Check if BFF serves any branding-related content or assets
  - If yes, update BFF to reference HoloKai assets
  - Verify BFF includes proper metadata headers
  - _Requirements: 10.2, 10.3_

- [ ] 25. Create comprehensive branding integration test suite
  - Write E2E tests validating branding across all apps
  - Test app loads with correct favicon in all browsers/viewport sizes
  - Test logo renders and is clickable/linkable as expected
  - Test responsive behavior at multiple breakpoints (320px, 768px, 1024px, 1440px)
  - Test social media sharing includes correct branding metadata
  - Test no branding-related console errors on any app
  - _Requirements: 1.1, 2.1, 3.1, 5.1, 9.1, 9.2_

- [ ] 26. Final checkpoint - Branding integration complete
  - Ensure all tests pass (unit, integration, E2E)
  - Verify all 6 apps build without errors
  - Confirm responsive branding works on multiple devices
  - Validate color palette applied consistently
  - Check social media preview cards display correctly
  - Document any known issues or limitations
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP (branding will still work, but with less test coverage)
- All tasks use TypeScript/React/Next.js technology stack
- Core implementation focuses on visual branding layer with no functional changes
- Responsive design is critical: logo selection changes at 768px breakpoint
- Color palette integration leverages existing Tailwind CSS infrastructure
- Component library is the central dependency; all apps consume from it
- Assets are centralized in shell app's public directory
- Branding integration is backward compatible; existing app functionality is preserved

