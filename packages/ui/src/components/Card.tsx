'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'feature' | 'elevated' | 'glass';
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  standard:
    'rounded-3xl border border-amber-500/20 bg-[#12121a] p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 shadow-xl',
  feature:
    'min-h-[480px] overflow-hidden rounded-[32px] border border-amber-500/30 bg-gradient-to-b from-[#12121a] via-[#0a0a0f] to-[#05050a] p-8 lg:p-12 text-white transition-all duration-300 hover:-translate-y-1 shadow-2xl',
  elevated:
    'rounded-3xl border border-white/10 bg-[#1a1a26] p-6 text-white transition-all duration-300 hover:-translate-y-1 shadow-xl',
  glass:
    'rounded-3xl border border-amber-500/20 bg-[#0a0a0f]/85 backdrop-blur-2xl p-6 text-white transition-all duration-300 shadow-2xl',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'standard', className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${variantStyles[variant]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
