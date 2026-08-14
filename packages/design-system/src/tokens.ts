/**
 * HoloKai Unified Design System Tokens
 * Source of Truth for Visual Design Taxonomy, Spatial Computing, and Epistemic Stances.
 * Strictly aligned with HOLOKAI DESIGNDNA (v2.0 Living Research Lab).
 */

export const COLOR_TOKENS = {
  // Core Backgrounds (Section 3.1)
  abyss: '#050806',
  obsidian: '#08110C',
  labDeep: '#0B1710',
  bgAbyss: '#050806',
  bgObsidian: '#08110C',
  bgPanel: '#0B1710',
  bgElevated: '#0B291B',
  bgCard: '#0B291B',
  bgHeader: '#08110C',

  // Primary Green Spectrum (Section 3.2)
  forestDeep: '#0B291B',
  forestActive: '#12402A',
  moss: '#8FAF91',
  mossBright: '#A9D5B0',

  // Scientific Teal (Section 3.3)
  tealDeep: '#163A31',
  tealBright: '#39826F',
  tealActive: '#79B59F',

  // Status & Telemetry
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#39826F',

  // Typography Colors (Section 3.4 & 6.1)
  textPrimary: '#E6EEE8',
  textSecondary: '#8C9991',
  textMuted: '#58655D',
  textDisabled: 'rgba(230, 238, 232, 0.25)',

  // Borders (Section 3.5)
  borderSubtle: 'rgba(143, 175, 145, 0.10)',
  borderActive: 'rgba(111, 175, 120, 0.45)',
} as const;

export const GRADIENT_TOKENS = {
  forestGlow: 'linear-gradient(135deg, #12402A 0%, #0B291B 50%, #08110C 100%)',
  tealAnalysis: 'linear-gradient(135deg, #79B59F 0%, #163A31 100%)',
  obsidianLab: 'linear-gradient(180deg, rgba(11, 23, 16, 0.9) 0%, rgba(5, 8, 6, 0.95) 100%)',
  glowRadial: 'radial-gradient(circle, rgba(143, 175, 145, 0.15) 0%, transparent 70%)',
} as const;

export interface EpistemicDefinition {
  label: string;
  color: string;
  bg: string;
  border: string;
  description: string;
}

/**
 * Section 11 — EPISTEMIC COLOR SYSTEM
 * Classification mappings strictly adhering to Design DNA:
 * ESTABLISHED → scientific green (#8FAF91)
 * SCHOLARLY_DEBATE → teal (#79B59F)
 * TRADITION → sage (#A9D5B0)
 * ESOTERIC → muted violet-gray (#8B8399)
 * SPECULATIVE → muted amber-gray (#998F83)
 * FICTIONAL → neutral gray (#65736A)
 */
export const EPISTEMIC_STANCE_TOKENS: Record<string, EpistemicDefinition> = {
  ESTABLISHED: {
    label: 'ESTABLISHED',
    color: '#A9D5B0',
    bg: 'rgba(169, 213, 176, 0.12)',
    border: 'rgba(169, 213, 176, 0.35)',
    description: 'Peer-reviewed archaeological & epigraphic consensus',
  },
  SCHOLARLY_DEBATE: {
    label: 'SCHOLARLY DEBATE',
    color: '#79B59F',
    bg: 'rgba(121, 181, 159, 0.12)',
    border: 'rgba(121, 181, 159, 0.35)',
    description: 'Active academic discussion with competing hypotheses',
  },
  TRADITION: {
    label: 'ORAL TRADITION',
    color: '#8FAF91',
    bg: 'rgba(143, 175, 145, 0.12)',
    border: 'rgba(143, 175, 145, 0.35)',
    description: 'Preserved oral lineage and elder knowledge corpus',
  },
  ESOTERIC: {
    label: 'ESOTERIC',
    color: '#8B8399',
    bg: 'rgba(139, 131, 153, 0.12)',
    border: 'rgba(139, 131, 153, 0.35)',
    description: 'Symbolic, cosmological, or ritual interpretations',
  },
  SPECULATIVE: {
    label: 'SPECULATIVE',
    color: '#998F83',
    bg: 'rgba(153, 143, 131, 0.12)',
    border: 'rgba(153, 143, 131, 0.35)',
    description: 'Unverified structural or historical hypotheses',
  },
  FICTIONAL: {
    label: 'FICTIONAL',
    color: '#65736A',
    bg: 'rgba(101, 115, 106, 0.12)',
    border: 'rgba(101, 115, 106, 0.35)',
    description: 'Literary or mythological narrative elements',
  },
};

export const GLASS_TOKENS = {
  panel: {
    background: 'rgba(8, 17, 12, 0.88)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(143, 175, 145, 0.10)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
  },
  cardHover: {
    borderColor: 'rgba(111, 175, 120, 0.45)',
    boxShadow: '0 10px 30px -10px rgba(18, 64, 42, 0.35)',
  },
} as const;

export const MOTION_TOKENS = {
  instant: '100ms',
  fast: '160ms',
  normal: '240ms',
  slow: '400ms',
  reveal: '650ms',
  cinematic: '900ms',
  durationFast: '150ms',
  durationNormal: '300ms',
  durationSlow: '600ms',
  easeSpring: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const EASING_TOKENS = {
  standard: [0.2, 0.8, 0.2, 1],
  enter: [0.16, 1, 0.3, 1],
  exit: [0.7, 0, 0.84, 0],
} as const;

export const RADIUS_TOKENS = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  hero: '48px',
  full: '9999px',
} as const;

export const TYPOGRAPHY_TOKENS = {
  fontDisplay: 'Cinzel, var(--font-sans), serif',
  fontHeading: 'Cinzel, var(--font-sans), serif',
  fontBody: 'Inter, var(--font-sans), system-ui, sans-serif',
  fontMono: 'JetBrains Mono, monospace',
  scale: {
    displayXl: 'clamp(3.5rem, 7vw, 7rem)',
    displayLg: 'clamp(3rem, 6vw, 5.5rem)',
    displayMd: 'clamp(2.5rem, 5vw, 4.5rem)',
    headingXl: 'clamp(2.5rem, 4vw, 4rem)',
    headingLg: 'clamp(2rem, 3.5vw, 3rem)',
    headingMd: 'clamp(1.5rem, 2.5vw, 2.25rem)',
    bodyLg: '1.25rem',
    bodyMd: '1rem',
    bodySm: '0.875rem',
    bodyXs: '0.75rem',
  },
} as const;

export const SPACING_TOKENS = {
  maxContentWidth: '1440px',
  sectionDesktop: '112px',
  sectionTablet: '80px',
  sectionMobile: '60px',
} as const;


