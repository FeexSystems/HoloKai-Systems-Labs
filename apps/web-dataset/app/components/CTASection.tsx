'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: string;
  primaryHref: string;
  secondaryCTA?: string;
  secondaryHref?: string;
  variant?: 'primary' | 'secondary';
}

export function CTASection({
  title,
  description,
  primaryCTA,
  primaryHref,
  secondaryCTA,
  secondaryHref,
  variant = 'primary',
}: CTASectionProps) {
  return (
    <section
      className={`px-6 py-24 max-w-7xl mx-auto ${
        variant === 'primary' ? 'bg-gradient-to-br from-amber-500/10 to-blue-500/10 border-t border-white/5' : 'bg-[#0a0a0f] border-t border-white/5'
      }`}
    >
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {variant === 'primary' && (
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Start Your Journey Today</span>
            </div>
          )}

          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-zinc-400 mb-8">{description}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all hover:scale-105"
            >
              {primaryCTA}
              <ArrowRight className="w-4 h-4" />
            </a>
            {secondaryCTA && secondaryHref && (
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                {secondaryCTA}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function HeroCTA() {
  return (
    <CTASection
      title="Ready to Explore Ancient Knowledge?"
      description="Join thousands of researchers, historians, and content creators using HoloKai to unlock the secrets of the past."
      primaryCTA="Start Free Trial"
      primaryHref="/cart"
      secondaryCTA="View Pricing"
      secondaryHref="#pricing"
      variant="primary"
    />
  );
}

export function MidPageCTA() {
  return (
    <CTASection
      title="Transform Your Research Workflow"
      description="HoloKai's AI-powered tools help you discover, analyze, and present historical insights faster than ever before."
      primaryCTA="See How It Works"
      primaryHref="/research"
      secondaryCTA="Watch Demo"
      secondaryHref="/demo"
      variant="secondary"
    />
  );
}

export function BottomCTA() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto bg-gradient-to-r from-amber-500 via-amber-600 to-blue-500">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 text-white/80 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>Limited Time Offer</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Get 50% Off Your First Year
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join HoloKai Pro today and unlock unlimited knowledge queries, voice synthesis, and image generation at half price.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/cart"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-amber-600 font-bold hover:bg-white/90 transition-all hover:scale-105"
            >
              Claim Your Discount
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-all"
            >
              Compare Plans
            </a>
          </div>

          <p className="text-sm text-white/60 mt-4">*Offer valid for new Pro subscribers only</p>
        </motion.div>
      </div>
    </section>
  );
}
