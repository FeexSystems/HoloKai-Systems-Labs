/**
 * HoloKai Centralized Design Tokens
 * JavaScript reference for components requiring dynamic token values (charts, D3, Three.js, inline styles).
 */

export const HK_COLORS = {
  bg: {
    obsidian: '#0A0A0A',
    abyss: '#05050A',
    panel: '#12121A',
    elevated: '#1A1A26',
    header: '#090A0F',
  },
  text: {
    primary: '#F4F4F5',
    secondary: '#A1A1AA',
    muted: '#71717A',
    gold: '#C8952A',
  },
  oracle: {
    gold: '#C8952A',
    goldLight: '#E8B84B',
    goldBright: '#FFD27A',
    amber: '#FF9D4D',
  },
  heritage: {
    terracotta: '#D97706',
    bronze: '#B45309',
    ochre: '#78350F',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

export const HK_CONFIDENCE = {
  veryStrong: { min: 0.90, max: 1.00, label: 'Very Strong', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' },
  strong:     { min: 0.75, max: 0.89, label: 'Strong',      color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.3)' },
  moderate:   { min: 0.60, max: 0.74, label: 'Moderate',    color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)' },
  uncertain:  { min: 0.40, max: 0.59, label: 'Uncertain',   color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)' },
  weak:       { min: 0.20, max: 0.39, label: 'Weak',        color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
  speculative:{ min: 0.00, max: 0.19, label: 'Speculative',  color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)' },
};

export const HK_EPISTEMIC = {
  ESTABLISHED:      { label: 'Established',       color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', description: 'Supported by substantial archaeological, textual, or scientific evidence.' },
  SCHOLARLY_DEBATE: { label: 'Scholarly Debate',  color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', description: 'Active academic consensus debate with competing interpretations.' },
  TRADITION:        { label: 'Tradition / Oral',  color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', description: 'Part of historical oral tradition, Griot lineages, or cultural folklore.' },
  ESOTERIC:         { label: 'Esoteric Knowledge', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.3)', description: 'Cultural belief system, cosmological teaching, or mystical framework.' },
  SPECULATIVE:      { label: 'Speculative',       color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)', description: 'Unverified historical hypothesis or extrapolation.' },
  FICTIONAL:        { label: 'Fictional Narrative', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)', border: 'rgba(107, 114, 128, 0.3)', description: 'Creative narrative, mythic allegory, or modern fictional adaptation.' },
};

export const HK_MOTION = {
  durationFast: '150ms',
  durationNormal: '300ms',
  durationSlow: '600ms',
  easeSpring: 'cubic-bezier(0.16, 1, 0.3, 1)',
};
