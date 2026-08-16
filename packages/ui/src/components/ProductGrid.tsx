'use client';

import React from 'react';
import { Card } from './Card';

export interface ProductGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colStyles = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
};

const gapStyles = {
  sm: 'gap-3',
  md: 'gap-4 md:gap-5',
  lg: 'gap-6 md:gap-8',
};

export function ProductGrid({
  children,
  columns = 4,
  gap = 'md',
  className = '',
}: ProductGridProps) {
  return (
    <div
      className={`grid ${colStyles[columns]} ${gapStyles[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

/* ── GridProductCard (composite used inside ProductGrid) ────── */
export interface GridProductCardProps {
  name: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  price?: string;
  href?: string;
  featured?: boolean;
  onClick?: () => void;
  className?: string;
}

export function GridProductCard({
  name,
  description,
  icon,
  badge,
  price,
  href,
  featured = false,
  onClick,
  className = '',
}: GridProductCardProps) {
  const Wrapper: React.ElementType = href ? 'a' : 'div';
  const wrapperProps = href
    ? { href, 'data-track-el': name.toLowerCase().replace(/\s+/g, '-'), 'data-track-ec': 'product-grid', 'data-track-ea': 'click' }
    : onClick
    ? { role: 'button', tabIndex: 0, onClick }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        'group block rounded-3xl border p-6 transition-all duration-300 cursor-pointer',
        featured
          ? 'border-border-strong bg-gradient-to-b from-surface-hover to-background hover:border-border-strong hover:-translate-y-1 shadow-glow-brand'
          : 'border-border bg-surface hover:border-border hover:-translate-y-1',
        className,
      ].join(' ')}
    >
      {icon && (
        <div className="mb-4 size-12 rounded-2xl bg-surface-hover border border-border flex items-center justify-center text-brand transition-all duration-200 group-hover:bg-surface-hover">
          {icon}
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-bold text-white group-hover:text-brand transition-colors">
          {name}
        </h3>
        <div className="flex flex-col items-end gap-1">
          {badge && (
            <span className="shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-surface-hover text-brand border border-border">
              {badge}
            </span>
          )}
          {price && (
            <span className="text-sm font-bold text-brand">
              {price}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span>Explore</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Wrapper>
  );
}
