'use client';

import React from 'react';

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  organization?: string;
  avatarUrl?: string;
  rating?: number; // 1-5
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className = '' }: TestimonialCardProps) {
  return (
    <figure
      className={[
        'group relative rounded-3xl border border-border bg-surface',
        'p-6 md:p-8 flex flex-col gap-5',
        'hover:border-border hover:-translate-y-1 transition-all duration-300 shadow-xl',
        className,
      ].join(' ')}
    >
      {/* Quote mark */}
      <span
        className="absolute top-5 right-6 text-5xl font-serif text-brand/15 leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        "
      </span>

      {/* Stars */}
      {testimonial.rating && (
        <div className="flex gap-0.5" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="14" height="14" viewBox="0 0 14 14"
              className={i < testimonial.rating! ? 'text-brand' : 'text-zinc-700'}
              aria-hidden="true"
            >
              <path
                d="M7 1l1.68 3.4 3.75.55-2.71 2.64.64 3.73L7 9.5l-3.36 1.77.64-3.73L1.57 4.95l3.75-.55L7 1z"
                fill="currentColor"
              />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-base text-zinc-200 leading-relaxed relative z-10">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <figcaption className="flex items-center gap-3 pt-2 border-t border-white/5">
        {testimonial.avatarUrl ? (
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.author}
            className="size-10 rounded-full object-cover border border-border"
          />
        ) : (
          <div
            className="size-10 rounded-full bg-gradient-to-br from-surface-hover to-surface-hover border border-border flex items-center justify-center text-brand text-sm font-bold"
            aria-hidden="true"
          >
            {testimonial.author[0]}
          </div>
        )}
        <div>
          <span className="block text-sm font-bold text-white">{testimonial.author}</span>
          {(testimonial.role || testimonial.organization) && (
            <span className="text-[10px] font-mono text-zinc-500">
              {[testimonial.role, testimonial.organization].filter(Boolean).join(' · ')}
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

TestimonialCard.displayName = 'TestimonialCard';
