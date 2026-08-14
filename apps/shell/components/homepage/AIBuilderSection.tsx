'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FeatureSection } from '@holokai/ui';

export function AIBuilderSection() {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Analyze Meroitic script divergence from Egyptian hieroglyphs';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const visual = (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative w-full max-w-lg mx-auto group"
    >
      {/* Decorative framing */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--pui-teal-bright)]/20 via-transparent to-[var(--pui-teal-bright)]/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-700" />
      <div className="absolute -inset-1 bg-gradient-to-b from-[var(--pui-teal-bright)]/10 via-transparent to-[var(--pui-teal-bright)]/10 rounded-2xl blur-md group-hover:blur-lg transition-all duration-700" />
      
      {/* Terminal Container */}
      <motion.div 
        layout
        className="relative rounded-2xl border border-[var(--color-border)] bg-[#030308]/90 p-6 font-mono text-xs md:text-sm space-y-4 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="size-2 rounded-full bg-red-500/50" />
              <span className="size-2 rounded-full bg-brand/50" />
              <span className="size-2 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[var(--color-brand)]/70 font-semibold tracking-widest text-[10px] uppercase">
              HoloKai Oracle Terminal V.9
            </span>
          </div>
          <span className="size-2 rounded-full bg-brand-light animate-ping" aria-hidden="true" />
        </div>

        {/* Terminal Content */}
        <div className="space-y-4">
          <motion.div layout className="flex items-start gap-3">
            <span className="text-brand/50 mt-0.5">❯</span>
            <span className="text-white relative">
              {typedText}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="inline-block w-1.5 h-4 bg-[var(--color-brand)]/80 ml-1 align-middle" 
              />
            </span>
          </motion.div>

          {typedText.length === fullText.length && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }} // ancientEpistemicTransition
              className="space-y-3 overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 mt-0.5">~</span>
                <span className="text-zinc-400 italic">Cross-referencing 847 epigraphic sources across Nubia...</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-zinc-600 mt-0.5">~</span>
                <span className="text-zinc-400 italic">Synthesizing chronological linguistic drift matrices...</span>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-start gap-3"
              >
                <span className="text-brand mt-0.5">✓</span>
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-[var(--color-brand)] font-semibold">Epistemic stance: ESTABLISHED</span>
                  <span className="text-emerald-400/80">Confidence: 0.92</span>
                  <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)]" 
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Outer Glow */}
      <div className="absolute -inset-10 bg-[var(--pui-teal-bright)]/5 rounded-[3rem] blur-3xl pointer-events-none" aria-hidden="true" />
    </motion.div>
  );

  return (
    <FeatureSection
      eyebrow="AI Research Engine"
      heading="Multi-agent synthesis across 5,000 years"
      description="The Oracle Research Engine cross-references hieroglyphic records, astronomical data, and epigraphic archives — classifying every claim with epistemic confidence scores."
      cta={{ label: 'Query the Oracle', href: '/oracle' }}
      visual={visual}
      className="bg-[#07070d]"
    />
  );
}
