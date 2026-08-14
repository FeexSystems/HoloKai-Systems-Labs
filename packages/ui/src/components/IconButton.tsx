'use client';

import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Accent colour when active/hovered */
  accent?: 'amber' | 'white' | 'red' | 'emerald';
  /** Tooltip label (also sets aria-label) */
  label: string;
  children: React.ReactNode;
}

const sizeStyles: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg',
};

const accentStyles: Record<NonNullable<IconButtonProps['accent']>, string> = {
  amber: 'hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border)] hover:text-[var(--color-brand)]',
  white: 'hover:bg-white/10 hover:border-white/20 hover:text-white',
  red: 'hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300',
  emerald: 'hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-300',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      size = 'md',
      accent = 'amber',
      label,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={[
          'grid place-items-center rounded-full',
          'bg-white/5 border border-white/10 text-zinc-400',
          'transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/70',
          'select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0',
          sizeStyles[size],
          accentStyles[accent],
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
