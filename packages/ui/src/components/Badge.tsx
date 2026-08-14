'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'mono';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-white/10 text-zinc-300 border border-white/10',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-[var(--color-surface-hover)] text-[var(--color-brand)] border border-[var(--color-border)]',
  danger:  'bg-red-500/15 text-red-400 border border-red-500/30',
  info:    'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  gold:    'bg-[var(--color-surface-hover)] text-[var(--color-brand)] border border-[var(--color-border)]',
  mono:    'bg-white/5 text-zinc-400 border border-white/10 font-mono tracking-widest uppercase',
};

const dotColors: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-zinc-400',
  success: 'bg-emerald-400',
  warning: 'bg-[var(--color-brand)]',
  danger:  'bg-red-400',
  info:    'bg-sky-400',
  gold:    'bg-[var(--color-brand)]',
  mono:    'bg-zinc-400',
};

const sizeStyles = {
  sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
  md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
};

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`shrink-0 rounded-full ${dotColors[variant]} ${size === 'sm' ? 'size-1.5' : 'size-2'}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';
