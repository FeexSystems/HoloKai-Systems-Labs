/**
 * HoloKai Unified Design System Tokens
 * Source of Truth for Visual Design Taxonomy, Spatial Computing, and Epistemic Stances.
 */

export const COLOR_TOKENS = {
  // Base Neutrals
  bgAbyss: '#05050a',
  bgObsidian: '#0a0a0a',
  bgPanel: '#12121a',
  bgElevated: '#1a1a26',
  bgCard: '#1f1f2e',
  bgHeader: '#090a0f',

  // Oracle & Heritage Accents
  oracleGold: '#c8952a',
  oracleGoldLight: '#e8b84b',
  oracleGoldBright: '#ffd27a',
  heritageOrange: '#ff9100',
  heritageRed: '#dd2c00',
  heritageYellow: '#ffc400',
  heritageTerracotta: '#d97706',
  heritageBronze: '#b45309',
  heritageOchre: '#78350f',

  // Status & Telemetry
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Text Hierarchy
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.75)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  textDisabled: 'rgba(255, 255, 255, 0.25)',
} as const;

export const GRADIENT_TOKENS = {
  oracleGold: 'linear-gradient(135deg, #ffc400 0%, #ff9100 50%, #dd2c00 100%)',
  heritageSun: 'linear-gradient(135deg, #e8b84b 0%, #c8952a 100%)',
  obsidianGlass: 'linear-gradient(180deg, rgba(26, 26, 38, 0.9) 0%, rgba(10, 10, 14, 0.95) 100%)',
  glowRadial: 'radial-gradient(circle, rgba(200, 149, 42, 0.18) 0%, transparent 70%)',
} as const;

export interface EpistemicDefinition {
  label: string;
  color: string;
  bg: string;
  border: string;
  description: string;
}

export const EPISTEMIC_STANCE_TOKENS: Record<string, EpistemicDefinition> = {
  ESTABLISHED: {
    label: 'ESTABLISHED',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    description: 'Peer-reviewed archaeological & epigraphic consensus',
  },
  SCHOLARLY_DEBATE: {
    label: 'SCHOLARLY DEBATE',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.3)',
    description: 'Active academic discussion with competing hypotheses',
  },
  TRADITION: {
    label: 'ORAL TRADITION',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    description: 'Preserved oral lineage and elder knowledge corpus',
  },
  ESOTERIC: {
    label: 'ESOTERIC',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.3)',
    description: 'Symbolic, cosmological, or ritual interpretations',
  },
  SPECULATIVE: {
    label: 'SPECULATIVE',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    border: 'rgba(236, 72, 153, 0.3)',
    description: 'Unverified structural or historical hypotheses',
  },
  FICTIONAL: {
    label: 'FICTIONAL',
    color: '#6b7280',
    bg: 'rgba(107, 114, 128, 0.12)',
    border: 'rgba(107, 114, 128, 0.3)',
    description: 'Literary or mythological narrative elements',
  },
};

export const GLASS_TOKENS = {
  panel: {
    background: 'rgba(10, 10, 14, 0.88)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(200, 149, 42, 0.12)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
  cardHover: {
    borderColor: 'rgba(200, 149, 42, 0.35)',
    boxShadow: '0 10px 30px -10px rgba(200, 149, 42, 0.15)',
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
  fontDisplay: 'Syne, var(--font-sans), system-ui, sans-serif',
  fontHeading: 'Syne, var(--font-sans), system-ui, sans-serif',
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

