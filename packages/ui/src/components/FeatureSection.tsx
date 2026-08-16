'use client';

import React from 'react';

export interface FeatureSectionProps {
  eyebrow?: string;
  heading: string;
  description: string;
  cta?: { label: string; href: string };
  visual: React.ReactNode;
  reverse?: boolean;
  className?: string;
}

export function FeatureSection({
  eyebrow,
  heading,
  description,
  cta,
  visual,
  reverse = false,
  className = '',
}: FeatureSectionProps) {
  return (
    <section className={`py-24 md:py-32 ${className}`}>
      <div
        className={[
          'mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]',
          'grid gap-12 lg:gap-16 lg:items-center',
          reverse
            ? 'lg:grid-cols-[1.2fr_0.8fr]'
            : 'lg:grid-cols-[0.8fr_1.2fr]',
        ].join(' ')}
      >
        {/* Text column (swapped by CSS order on reverse) */}
        <div className={`flex flex-col gap-6 ${reverse ? 'lg:order-2' : ''}`}>
          {eyebrow && (
            <span className="text-[10px] font-mono text-brand uppercase tracking-[0.2em] font-semibold">
              {eyebrow}
            </span>
          )}

          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {heading}
          </h2>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-prose">
            {description}
          </p>

          {cta && (
            <a
              href={cta.href}
              data-track-el={cta.label.toLowerCase().replace(/\s+/g, '-')}
              data-track-ec="feature-section"
              data-track-ea="click"
              className="inline-flex items-center gap-2 rounded-full h-12 px-6 text-sm font-extrabold text-black bg-gradient-to-r from-brand to-brand-contrast hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-glow-brand w-fit"
            >
              {cta.label}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M8 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
        </div>

        {/* Visual column */}
        <div
          className={[
            'relative flex items-center justify-center',
            'rounded-[32px] overflow-hidden min-h-[360px] md:min-h-[480px]',
            'border border-border bg-gradient-to-br from-[#181826] to-[#08080f]',
            reverse ? 'lg:order-1' : '',
          ].join(' ')}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}

FeatureSection.displayName = 'FeatureSection';
