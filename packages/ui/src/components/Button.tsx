'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  ripple?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'h-12 rounded-full px-6 text-sm font-extrabold text-black bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-contrast)] hover:brightness-110 shadow-glow-brand hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
  secondary:
    'h-12 rounded-full px-6 text-sm font-bold text-white border border-[var(--color-border)] bg-[#12121a] hover:bg-[#1a1a26] hover:border-[var(--color-border)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
  ghost:
    'h-12 rounded-full px-6 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200',
  icon:
    'grid size-10 place-items-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border)] transition-all duration-200',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-10 px-4 text-xs',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    children, 
    loading = false,
    success = false,
    ripple = true,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleId = useRef(0);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || disabled || loading || success) return;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple = {
        id: rippleId.current++,
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      onClick?.(e);
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        disabled={isDisabled}
        onClick={handleClick}
        className={`relative inline-flex items-center justify-center gap-2 select-none cursor-pointer overflow-hidden ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute rounded-full bg-white/30 pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }
);

Button.displayName = 'Button';
