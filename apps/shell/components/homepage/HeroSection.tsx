'use client';

import React, { Suspense, useState } from 'react';
import { motion } from 'motion/react';
import { DomainSearch, ancientEpistemicTransition, holokaiVariants } from '@holokai/ui';
import dynamic from 'next/dynamic';

// Lazy load CivilizationGlobe with CSS gradient fallback
const CivilizationGlobe = dynamic(() => import('../three').then(mod => ({ default: mod.CivilizationGlobe })), {
  loading: () => null,
  ssr: false,
});

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 xl:pt-40 xl:pb-28">
      {/* CSS gradient fallback while 3D loads */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, #0B1710 0%, #05050a 70%)',
        }}
        aria-hidden="true"
      />

      {/* CivilizationGlobe 3D background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Suspense fallback={null}>
          <CivilizationGlobe onLoad={() => setIsLoaded(true)} />
        </Suspense>
      </div>

      <div className="relative z-10 mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">
        <div className="mx-auto max-w-5xl text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-4 py-1.5 mb-8">
            <span className="size-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" aria-hidden="true" />
            <span className="text-xs font-mono font-semibold text-[var(--color-brand)] uppercase tracking-widest">
              Civilization-Scale Research OS
            </span>
          </div>

          <motion.div
            variants={holokaiVariants.cardEntrance}
            initial="hidden"
            whileInView="visible"
            transition={ancientEpistemicTransition}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Main heading — tight tracking per Design DNA §01 */}
            <motion.h1
              className="text-5xl font-extrabold tracking-[-0.05em] leading-[0.95] text-white
                         md:text-7xl
                         xl:text-[clamp(4rem,7vw,7rem)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Where{' '}
              <motion.span
                className="bg-gradient-to-r from-[#79B59F] via-[#A9D5B0] to-[#39826F] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                Civilizations
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                Remember
              </motion.span>
            </motion.h1>

            {/* Sub-description */}
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Pan-African epigraphy, astronomy & AI synthesis engine. Query 5,000 years of
              civilizational knowledge through the Oracle Research Engine.
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href="/home"
                data-track-el="hero-get-started"
                data-track-ec="hero"
                data-track-ea="click"
                className="inline-flex items-center gap-2 rounded-full h-12 px-8 text-sm font-extrabold text-black bg-gradient-to-r from-[var(--color-brand)] to-[#39826F] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg shadow-[var(--color-brand)]/20"
              >
                Get Started
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 7h12M8 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="/oracle"
                data-track-el="hero-learn-more"
                data-track-ec="hero"
                data-track-ea="click"
                className="inline-flex items-center gap-2 rounded-full h-12 px-8 text-sm font-bold text-white border border-[var(--color-border)] bg-[var(--color-surface-hover)] hover:border-[var(--color-brand)]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Learn More
              </a>
            </motion.div>

            {/* Domain search as the hero CTA (spec §13, §14) */}
            <motion.div
              className="mx-auto mt-10 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <DomainSearch
                placeholder="Search civilizations, artifacts, eras…"
                onSearch={(q) => {
                  if (typeof window !== 'undefined') {
                    window.location.href = `/oracle?q=${encodeURIComponent(q)}`;
                  }
                }}
              />
            </motion.div>
          </motion.div>

          {/* Supporting badges */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              '5,000+ Years of Data',
              '16-Volume Archive',
              'AI Synthesis Engine',
              'Epistemic Classification',
            ].map((label, index) => (
              <motion.span
                key={label}
                className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--color-border)] text-zinc-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
