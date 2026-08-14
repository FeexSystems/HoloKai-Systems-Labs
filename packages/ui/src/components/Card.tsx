'use client';

import React, { useState } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'feature' | 'elevated' | 'glass';
  enable3DTilt?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  standard:
    'rounded-3xl border border-[var(--color-border)] bg-[#12121a] p-6 text-white shadow-xl hover:border-[var(--color-border)]',
  feature:
    'min-h-[480px] overflow-hidden rounded-[32px] border border-[var(--color-border-strong)] bg-gradient-to-b from-[#181826] via-[#0e0e16] to-[#05050a] p-8 lg:p-12 text-white shadow-2xl hover:border-[var(--color-border-strong)]',
  elevated:
    'rounded-3xl border border-white/10 bg-[#1a1a26] p-6 text-white shadow-xl hover:border-[var(--color-border)]',
  glass:
    'rounded-3xl border border-[var(--color-border)] bg-[#0a0a0f]/85 backdrop-blur-2xl p-6 text-white shadow-2xl hover:border-[var(--color-border)]',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'standard', enable3DTilt = true, className = '', children, ...props }, ref) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0, mouseX: 50, mouseY: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enable3DTilt) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max 6deg tilt
      const rotateY = ((x - centerX) / centerX) * 6;

      setTilt({
        x: rotateX,
        y: rotateY,
        mouseX: (x / rect.width) * 100,
        mouseY: (y / rect.height) * 100,
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0, mouseX: 50, mouseY: 50 });
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1000px',
        }}
        className="w-full"
      >
        <div
          style={{
            transform: isHovered
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale(1.01)`
              : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
            transition: isHovered
              ? 'transform 0.15s cubic-bezier(0.55, 0, 0.35, 1)'
              : 'transform 0.4s cubic-bezier(0.55, 0, 0.35, 1)',
            transformStyle: 'preserve-3d',
          }}
          className={`relative overflow-hidden group ${variantStyles[variant]} ${className}`}
          {...props}
        >
          {/* Dynamic Follow-Mouse Glare Spotlight Sheen */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
              style={{
                background: `radial-gradient(400px circle at ${tilt.mouseX}% ${tilt.mouseY}%, rgba(169,213,176,0.18), transparent 70%)`,
              }}
            />
          )}

          {/* Animated Edge Shimmer */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-[var(--color-brand)]/30 rounded-[inherit]" />

          <div className="relative z-10">{children}</div>
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';
