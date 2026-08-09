'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'h-12 rounded-full px-6 text-sm font-extrabold text-black bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
  secondary:
    'h-12 rounded-full px-6 text-sm font-bold text-white border border-amber-500/30 bg-[#12121a] hover:bg-[#1a1a26] hover:border-amber-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
  ghost:
    'h-12 rounded-full px-6 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200',
  icon:
    'grid size-10 place-items-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-amber-500/20 hover:border-amber-500/40 transition-all duration-200',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 select-none cursor-pointer ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
