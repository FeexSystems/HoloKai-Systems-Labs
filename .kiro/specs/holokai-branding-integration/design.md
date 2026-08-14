# Design Document: HoloKai Branding Integration

## Overview

The HoloKai branding integration is a visual layer enhancement that replaces placeholder branding elements with official HoloKai assets across a six-application platform ecosystem. This design focuses on consistent, responsive deployment of branding components without introducing functional changes.

The solution consists of:
1. **Centralized Asset Management**: Assets stored in shell app, referenced across all apps via package imports
2. **Reusable Component Library**: Logo, Header, and Footer components exported from a shared @holokai/branding package
3. **Responsive Logo Selection**: Viewport-aware component logic to display appropriate logo variant (horizontal vs. vertical)
4. **Meta Tag Generation**: Automated meta tag population for social media and SEO
5. **Configuration-based Manifest Updates**: Programmatic updates to manifest.json across all apps
6. **Color Palette Integration**: Application of Obsidian/Forest/Teal palette through Tailwind design tokens

## Architecture

### Component Hierarchy

```
HoloKai Branding Layer
├── Asset Management
│   ├── favicon (16x16, 32x32, 64x64 variants)
│   ├── Logo Horizontal (web layouts)
│   ├── Logo Vertical (mobile layouts)
│   └── Logo 3D (hero sections)
├── Component Library (@holokai/branding)
│   ├── Logo Component (responsive)
│   ├── Header Component (navigation integration)
│   ├── Footer Component (page bottom)
│   └── MetaTags Component (social/SEO)
├── Design Tokens (Color Palette)
│   ├── Obsidian (#1a1f2e)
│   ├── Forest (#2d5a3d)
│   └── Teal (#3fa9a8)
└── Integration Points
    ├── Shell App (contains assets)
    ├── 6 Web Apps (consume components)
    └── BFF (serves assets if needed)
```

### Asset Organization

**Centralized Location**: `apps/shell/public/logos/`
- `holokai-favicon.ico` - 32x32 browser tab icon
- `holokai-logo-horizontal.jpg` - Desktop/tablet header logo (aspect: 16:3 recommended)
- `holokai-logo-vertical.jpg` - Mobile header logo (aspect: 1:1 or 3:4)
- `holokai-logo-3d.jpg` - Hero section image (aspect: 16:9 recommended)

**Asset Distribution Method**: 
- Assets remain in shell app public directory
- Other apps reference via absolute URL paths (e.g., `https://platform/logos/holokai-logo-horizontal.jpg`)
- Alternative: Copy assets to each app's public directory during build process

### Component Library Design

**Package Structure**: `packages/branding/` or `libs/holokai-branding`

```typescript
// Logo Component - Responsive Logo Selection
export interface LogoProps {
  variant: 'horizontal' | 'vertical' | '3d';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Header Component - Navigation Integration
export interface HeaderProps {
  logoVariant?: 'auto' | 'horizontal' | 'vertical';
  className?: string;
}

// Footer Component - Page Bottom Branding
export interface FooterProps {
  logoSize?: 'small' | 'medium';
  className?: string;
}

// Meta Tags Component - Social Media Integration
export interface MetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}
```

### Responsive Behavior

**Breakpoints** (Tailwind defaults):
- Mobile: < 768px → Display vertical/compact logo
- Tablet: 768px - 1024px → Display horizontal logo
- Desktop: > 1024px → Display full-size horizontal logo

**Logo Selection Logic**:
```
if (viewport < 768px) {
  display: vertical_logo
  size: 40-60px height
} else if (viewport < 1024px) {
  display: horizontal_logo
  size: 120px width
} else {
  display: horizontal_logo
  size: 160px width
}
```

## Components and Interfaces

### Component 1: Logo Component

**Purpose**: Render HoloKai logo in various orientations and sizes

**Props**:
- `variant`: 'horizontal' | 'vertical' | '3d' - Logo style
- `size`: 'small' (40px) | 'medium' (80px) | 'large' (160px)
- `responsive`: boolean - Auto-select variant based on viewport
- `className`: string - Additional Tailwind classes

**Behavior**:
- If `responsive={true}`, automatically selects vertical for mobile, horizontal for desktop
- Maintains aspect ratio regardless of container
- Lazy-loads images for performance
- Includes Next.js Image optimization

### Component 2: Header Component

**Purpose**: Render navigation bar with integrated HoloKai branding

**Props**:
- `logoVariant`: 'auto' | 'horizontal' | 'vertical'
- `showBrand`: boolean - Show brand text alongside logo
- `className`: string - Additional classes

**Behavior**:
- Default responsive: vertical on mobile, horizontal on desktop
- Fixed positioning at top of page
- Applies Obsidian color (#1a1f2e) background by default
- Exports as reusable component for all apps

### Component 3: Footer Component

**Purpose**: Render page footer with HoloKai branding

**Props**:
- `logoSize`: 'small' | 'medium'
- `showCopyright`: boolean
- `className`: string

**Behavior**:
- Displays logo at bottom of page
- Can include copyright text: "© 2024 HoloKai Systems"
- Applies Forest color (#2d5a3d) accent by default
- Responsive sizing based on viewport

### Component 4: MetaTags Component

**Purpose**: Populate Open Graph and other meta tags for social media

**Props**:
- `title`: string - Page title
- `description`: string - Page description
- `imageUrl`: string - Default uses holokai-logo-horizontal.jpg
- `url`: string - Page URL

**Behavior**:
- Generates Open Graph meta tags (og:title, og:description, og:image, og:url)
- Includes Twitter Card meta tags
- Sets favicon link tag
- Uses HoloKai branding for og:image if not specified

## Data Models

### BrandingConfig

```typescript
interface BrandingConfig {
  logos: {
    favicon: string;           // Path to favicon.ico
    horizontal: string;        // Path to horizontal logo
    vertical: string;          // Path to vertical logo
    3d: string;               // Path to 3D logo
  };
  colors: {
    primary: string;          // Obsidian #1a1f2e
    secondary: string;        // Forest #2d5a3d
    tertiary: string;         // Teal #3fa9a8
  };
  viewportBreakpoints: {
    mobile: number;           // 768px
    tablet: number;           // 1024px
  };
}
```

### ManifestConfig

```typescript
interface ManifestConfig {
  name: string;               // "HoloKai Platform"
  short_name: string;         // "HoloKai"
  description: string;        // Brand description
  icons: Array<{
    src: string;             // Icon path
    sizes: string;           // "16x16", "32x32", etc.
    type: string;            // "image/ico", "image/jpeg"
  }>;
  theme_color: string;        // Obsidian #1a1f2e
  background_color: string;   // White or light gray
}
```

## Correctness Properties

This feature's design does not include property-based testing (PBT) because it primarily comprises visual rendering, configuration, and UI integration rather than algorithmic logic. 

**Why PBT is not applicable**:
1. **UI Rendering**: Logo display, positioning, and responsive sizing are UI concerns best validated through snapshot tests and visual regression tests, not property-based testing
2. **Configuration**: Favicon, manifest, and meta tag updates are deterministic configuration-based operations where behavior doesn't vary meaningfully with input variations
3. **Component Integration**: Component exports and imports are structural/API concerns validated through TypeScript type checking and module tests
4. **Asset Management**: Static asset serving has no meaningful input variation that would justify 100+ property test iterations

**Testing Strategy** (see Testing Strategy section below):
- Unit tests with snapshot verification for visual components
- Integration tests to verify favicon/meta tags are correctly set
- Configuration validation tests for manifest.json updates
- Smoke tests to verify components render without errors
- Manual visual regression testing to ensure consistent branding appearance

## Error Handling

### Scenario 1: Missing Asset Files

**Condition**: One or more HoloKai logo files are missing from `apps/shell/public/logos/`

**Response**:
- Build-time check during app initialization
- Console error message: "Missing branding asset: [filename]"
- Fallback to placeholder logo if available, or hide logo element
- Build continues but includes warning in logs

### Scenario 2: Favicon Cache Issue

**Condition**: Browser loads outdated favicon from cache

**Response**:
- Serve favicon with cache-busting query parameter: `favicon.ico?v=TIMESTAMP`
- Set HTTP cache headers: `max-age: 86400` (24 hours)
- Allow manual browser cache clear by user

### Scenario 3: Component Not Exported

**Condition**: Branding component library doesn't export expected component

**Response**:
- TypeScript compilation error if component missing from index
- Runtime error with clear message: "Component [Name] not found in @holokai/branding"
- Prevents app build from completing

### Scenario 4: Invalid Viewport Dimensions

**Condition**: Viewport width detection fails or returns NaN

**Response**:
- Default to desktop logo (horizontal)
- Log warning: "Viewport detection failed, defaulting to desktop layout"
- Continue rendering

### Scenario 5: Meta Tag Conflicts

**Condition**: Page already has og:image or favicon tags defined

**Response**:
- Component checks for existing tags
- If present, skips adding duplicate (allows app-specific overrides)
- Merges tags intelligently rather than replacing

## Testing Strategy

### Unit Tests

**Logo Component Tests**:
- Test responsive logo selection logic (viewport < 768px → vertical, >= 768px → horizontal)
- Test size props (small, medium, large) render correct dimensions
- Test className prop merges correctly with default classes
- Snapshot tests for component rendering

**Header Component Tests**:
- Test logo renders in header
- Test responsive logo variant selection
- Test header maintains Obsidian background color
- Snapshot tests for different viewport sizes

**Footer Component Tests**:
- Test footer renders with logo
- Test copyright text appears when enabled
- Test Forest color accent applied
- Snapshot tests for footer rendering

**MetaTags Component Tests**:
- Test Open Graph meta tags are generated correctly
- Test Twitter Card tags are present
- Test favicon link tag is present
- Test default image URL used when not specified

### Integration Tests

**Favicon Deployment**:
- Verify favicon.ico exists in all 6 apps' public directories
- Verify HTML head contains correct `<link rel="icon">` tag
- Verify manifest.json includes icons array
- Test cache headers are set correctly

**Component Integration**:
- Verify components can be imported from @holokai/branding package
- Test components render successfully in each of 6 web apps
- Verify logo displays in header, footer, and hero sections
- Test components don't break app initialization

**Asset Organization**:
- Verify all four logo files exist in shell app
- Verify paths resolve correctly across all apps
- Test asset URLs are accessible from all app contexts

**Meta Tags**:
- Verify meta tags are present in HTML head
- Test og:image, og:title, og:description are populated
- Verify favicon link tag points to correct asset
- Test on sample pages from each web app

### Smoke Tests

**Build Process**:
- Verify all apps build successfully with branding components
- Check for console warnings or errors related to branding
- Verify no type errors from branding component usage

**Component Availability**:
- Verify Logo, Header, Footer, MetaTags components export
- Verify TypeScript definitions exist (.d.ts files)
- Verify components can be imported without errors

### Visual Regression Tests (Recommended)

**Desktop Views**:
- Verify horizontal logo appears in header on desktop (>1024px)
- Verify footer displays full-size logo
- Verify colors match Obsidian/Forest/Teal palette

**Mobile Views**:
- Verify vertical/compact logo appears in header on mobile (<768px)
- Verify logo scales appropriately
- Verify no text overflow or layout breaking

**Cross-App Consistency**:
- Compare logo placement across all 6 web apps
- Verify consistent header/footer styling
- Ensure color palette matches across apps

### Configuration Tests

**Manifest.json Validation**:
- Verify manifest.json in each app contains HoloKai name
- Verify icons array has entries for multiple sizes (16x16, 32x32, 64x64)
- Verify theme_color is Obsidian (#1a1f2e)
- Validate manifest.json syntax is valid JSON

**Design Token Consistency**:
- Verify Tailwind CSS contains Obsidian, Forest, Teal variables
- Test color values are consistent across all apps
- Verify no conflicting color definitions

### Testing Implementation Notes

- Use Next.js built-in testing support (Jest + React Testing Library)
- Leverage snapshot testing for component visual verification
- Use Chromatic or similar for visual regression testing across viewports
- Create test fixtures for different viewport sizes
- Mock asset paths to test without actual files
- Test both TypeScript compilation and runtime behavior

