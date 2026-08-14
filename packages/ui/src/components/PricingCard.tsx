'use client';

import React from 'react';

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  badge?: string;
  featured?: boolean;
}

export interface PricingCardProps {
  tier: PricingTier;
  className?: string;
}

export function PricingCard({ tier, className = '' }: PricingCardProps) {
  return (
    <div
      className={[
        'relative flex flex-col rounded-3xl border p-6 md:p-8 transition-all duration-300',
        tier.featured
          ? 'border-[var(--color-border-strong)] bg-gradient-to-b from-[var(--color-surface-hover)] via-[#0e0e18] to-[#05050a] shadow-glow-brand hover:-translate-y-1'
          : 'border-[var(--color-border)] bg-[#12121a] hover:border-[var(--color-border)] hover:-translate-y-0.5',
        className,
      ].join(' ')}
    >
      {/* Featured shimmer edge */}
      {tier.featured && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(135deg, rgba(169,213,176,0.12) 0%, transparent 50%, rgba(169,213,176,0.06) 100%)',
          }}
        />
      )}

      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[var(--color-brand)] text-black">
            {tier.badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <span className="text-xs font-mono text-[var(--color-brand)] uppercase tracking-widest">{tier.name}</span>
        <div className="mt-3 flex items-end gap-1">
          <span className="text-4xl font-extrabold text-white tracking-tight">{tier.price}</span>
          {tier.period && (
            <span className="text-zinc-500 text-sm mb-1">/{tier.period}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{tier.description}</p>
      </div>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1" role="list" aria-label={`${tier.name} features`}>
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300">
            <svg
              className="shrink-0 mt-0.5 text-[var(--color-brand)]"
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              aria-hidden="true"
            >
              <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={tier.cta.href}
        data-track-el={`pricing-${tier.id}-cta`}
        data-track-ec="pricing"
        data-track-ea="click"
        className={[
          'block w-full rounded-full h-12 text-sm font-extrabold text-center leading-[3rem] transition-all duration-200',
          tier.featured
            ? 'bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-contrast)] text-black hover:brightness-110 hover:-translate-y-0.5 shadow-glow-brand'
            : 'border border-[var(--color-border)] bg-transparent text-[var(--color-brand)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border)]',
        ].join(' ')}
      >
        {tier.cta.label}
      </a>
    </div>
  );
}

PricingCard.displayName = 'PricingCard';
