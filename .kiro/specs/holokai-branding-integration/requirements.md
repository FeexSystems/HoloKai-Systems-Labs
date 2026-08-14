# Requirements Document: HoloKai Branding Integration

## Introduction

This specification defines requirements for integrating HoloKai branding assets throughout the multi-app platform. The integration encompasses replacing placeholder branding elements with HoloKai's visual identity across six web applications and the backend-for-frontend service. This is a visual branding layer implementation with no functional changes—purely a UI/UX enhancement that establishes a professional, consistent brand presence.

The four available HoloKai assets (favicon, 3D logo, horizontal logo, vertical logo) will be strategically deployed across favicons, headers, navigation bars, footers, hero sections, and metadata to create a cohesive brand experience.

## Glossary

- **HoloKai**: The brand identity for the platform
- **Shell App**: The main application gateway and container (apps/shell)
- **Web Apps**: Individual feature-specific applications (web-home, web-oracle, web-cart, web-research, web-archive)
- **BFF**: Backend-for-frontend service (apps/bff)
- **Favicon**: Small icon displayed in browser tabs and bookmarks
- **Hero Section**: Large visual element at top of page with primary messaging
- **Meta Tags**: HTML metadata used by browsers and social media platforms
- **Manifest.json**: Web app manifest file defining app metadata and icons
- **Branding Component Library**: Reusable components for logo, header, and footer elements
- **Visual Identity**: The complete set of logos, colors, and design elements representing HoloKai
- **Placeholder**: Temporary branding or generic elements to be replaced

## Requirements

### Requirement 1: Favicon Deployment

**User Story:** As a user navigating the platform, I want to see the HoloKai favicon in browser tabs, so that I can quickly identify and switch between platform windows.

#### Acceptance Criteria

1. WHEN any app loads in a browser THEN THE Favicon_Deployment_Service SHALL set the browser tab icon to holokai-favicon.ico
2. WHEN a page is bookmarked THEN THE Favicon_Deployment_Service SHALL display the HoloKai favicon in bookmark lists
3. FOR ALL six web apps (shell, web-home, web-oracle, web-cart, web-research, web-archive) THEN THE Favicon_Deployment_Service SHALL use holokai-favicon.ico as the favicon source
4. WHERE a browser caches favicon from previous sessions THEN THE Favicon_Deployment_Service SHALL serve the favicon with proper cache headers for updates

### Requirement 2: Logo Integration in Headers and Navigation

**User Story:** As a user exploring the platform, I want to see the HoloKai logo prominently in application headers and navigation areas, so that I have constant visual reinforcement of the brand.

#### Acceptance Criteria

1. WHEN a page loads THEN THE Navigation_Component SHALL display the HoloKai horizontal logo in the top-left header area
2. WHEN the viewport is mobile-sized THEN THE Navigation_Component SHALL display the HoloKai vertical logo for better mobile fit
3. WHEN a user interacts with navigation THEN THE Navigation_Component SHALL maintain consistent logo placement and sizing across all pages
4. FOR ALL six web apps THEN THE Navigation_Component SHALL use the same HoloKai branding in headers
5. WHERE logo containers exist THEN THE Navigation_Component SHALL apply consistent padding and alignment

### Requirement 3: Footer Branding

**User Story:** As a user reaching the bottom of a page, I want to see consistent HoloKai branding in the footer, so that the brand presence feels complete and professional.

#### Acceptance Criteria

1. WHEN a page displays a footer THEN THE Footer_Component SHALL include a HoloKai logo or brand mark
2. WHEN the footer is rendered THEN THE Footer_Component SHALL maintain consistent styling with the header branding
3. FOR ALL six web apps THEN THE Footer_Component SHALL include branding consistent with the visual identity
4. WHERE footer space is limited THEN THE Footer_Component SHALL use appropriately-sized logo variants

### Requirement 4: Hero Section Logo Integration

**User Story:** As a user landing on the homepage, I want to see the HoloKai 3D logo in the hero section, so that the brand makes an immediate visual impact.

#### Acceptance Criteria

1. WHEN a user visits the web-home application THEN THE Hero_Section SHALL display the holokai-logo-3d.jpg image prominently
2. WHEN the hero section is rendered THEN THE Hero_Section SHALL position the logo with proper spacing and visual hierarchy
3. WHEN the page loads THEN THE Hero_Section SHALL optimize the 3D logo for fast rendering and responsive display
4. WHERE viewport is mobile THEN THE Hero_Section SHALL scale the 3D logo appropriately for mobile screens

### Requirement 5: Meta Tags and Social Media Integration

**User Story:** As a user sharing platform content on social media, I want proper HoloKai branding in preview cards, so that shared content looks professional and brand-consistent.

#### Acceptance Criteria

1. WHEN a page is shared on social media THEN THE Meta_Tag_Service SHALL include the HoloKai favicon or logo in the Open Graph meta tags
2. WHEN a page is shared THEN THE Meta_Tag_Service SHALL include og:image meta tag with HoloKai branding
3. FOR ALL six web apps THEN THE Meta_Tag_Service SHALL populate meta tags with HoloKai brand information
4. WHERE meta tags are not explicitly defined THEN THE Meta_Tag_Service SHALL use default HoloKai branding meta tags
5. WHEN a page is indexed by search engines THEN THE Meta_Tag_Service SHALL include appropriate brand information in meta descriptions

### Requirement 6: Branding Component Library

**User Story:** As a developer maintaining the platform, I want reusable branding components, so that I can maintain consistency and reduce duplication across all applications.

#### Acceptance Criteria

1. THE Branding_Component_Library SHALL provide a Logo component for inserting HoloKai logos in any orientation (horizontal, vertical, 3D)
2. THE Branding_Component_Library SHALL provide a Header component with integrated HoloKai branding
3. THE Branding_Component_Library SHALL provide a Footer component with integrated HoloKai branding
4. WHERE components are used THEN THE Branding_Component_Library SHALL export all components from a central package (@holokai/branding or similar)
5. WHEN components are imported THEN THE Branding_Component_Library SHALL include TypeScript type definitions for proper developer experience
6. WHERE responsive design is needed THEN THE Branding_Component_Library SHALL handle logo size and orientation changes based on viewport

### Requirement 7: Manifest.json Updates

**User Story:** As an app administrator configuring web app manifests, I want HoloKai branding in manifest files, so that the platform appears correctly when added to device home screens or app listings.

#### Acceptance Criteria

1. FOR ALL six web apps THEN THE Manifest_Updater SHALL update manifest.json files to include holokai-favicon.ico or appropriate logo variants
2. WHEN manifest.json is configured THEN THE Manifest_Updater SHALL include name: "HoloKai" and appropriate descriptions
3. WHEN manifest.json is configured THEN THE Manifest_Updater SHALL include icons array pointing to HoloKai branding assets
4. WHERE multiple icon sizes are supported THEN THE Manifest_Updater SHALL provide favicon in supported sizes (16x16, 32x32, 64x64, etc.)

### Requirement 8: Consistent Color Palette Application

**User Story:** As a designer ensuring brand consistency, I want the HoloKai branding to use the established color palette, so that visual identity remains cohesive across all brand elements.

#### Acceptance Criteria

1. WHEN branding components are rendered THEN THE Color_Palette_Service SHALL apply Obsidian color (#1a1f2e or equivalent) as primary/dark elements
2. WHEN branding components are rendered THEN THE Color_Palette_Service SHALL apply Forest color (#2d5a3d or equivalent) as secondary/accent elements
3. WHEN branding components are rendered THEN THE Color_Palette_Service SHALL apply Teal color (#3fa9a8 or equivalent) as tertiary/highlight elements
4. WHERE color overrides are needed THEN THE Color_Palette_Service SHALL maintain Tailwind CSS variable consistency
5. FOR ALL six web apps THEN THE Color_Palette_Service SHALL enforce the same color palette through shared design tokens

### Requirement 9: Responsive Branding Display

**User Story:** As a user accessing the platform on various devices, I want branding to display correctly regardless of screen size, so that the visual identity remains strong on mobile, tablet, and desktop.

#### Acceptance Criteria

1. WHEN viewport width is less than 768px THEN THE Responsive_Branding_Service SHALL display vertical or compact logo variants
2. WHEN viewport width is 768px or greater THEN THE Responsive_Branding_Service SHALL display horizontal or full-size logo variants
3. WHEN logo containers are resized THEN THE Responsive_Branding_Service SHALL maintain logo aspect ratio
4. WHERE image optimization is possible THEN THE Responsive_Branding_Service SHALL serve appropriately-sized images for each viewport

### Requirement 10: Asset Organization and Consistency

**User Story:** As a developer integrating branding assets, I want clear asset organization, so that I can reliably locate and reference HoloKai branding files.

#### Acceptance Criteria

1. WHEN assets are accessed THEN THE Asset_Organization_Service SHALL provide consistent paths to all four HoloKai logo variants
2. WHEN new apps need branding THEN THE Asset_Organization_Service SHALL define a standard location for accessing shared assets (from shell or package)
3. WHERE assets are duplicated across apps THEN THE Asset_Organization_Service SHALL centralize asset serving from a single source
4. WHEN documentation is needed THEN THE Asset_Organization_Service SHALL include an asset inventory documenting all branding files and recommended usage

