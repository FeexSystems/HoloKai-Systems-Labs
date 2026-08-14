import type { Config } from 'tailwindcss';

export const planetaryPreset: Partial<Config> = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        foreground: 'var(--color-text)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          subtle: 'var(--color-surface-subtle)',
          hover: 'var(--color-surface-hover)',
          elevated: 'var(--color-bg-elevated)',
        },
        muted: 'var(--color-text-muted)',
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
          strong: 'var(--color-border-strong)',
        },
        brand: {
          DEFAULT: 'var(--color-brand)',
          contrast: 'var(--color-brand-contrast)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        'glow-brand': '0 0 20px rgba(169,213,176,0.25), 0 0 40px rgba(169,213,176,0.10)',
        'glow-active': '0 0 30px rgba(57,130,111,0.40), 0 0 60px rgba(57,130,111,0.15)',
        'glow-subtle': '0 0 12px rgba(143,175,145,0.15)',
      },
      transitionTimingFunction: {
        planetary: 'cubic-bezier(.16,1,.3,1)',
        smooth: 'cubic-bezier(.22,1,.36,1)',
      },
    },
  },
};

export default planetaryPreset;
