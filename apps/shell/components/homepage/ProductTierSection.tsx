'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  PricingCard,
  ScrollReveal,
  ScrollRevealStagger,
  holokaiVariants,
  type PricingTier,
} from '@holokai/ui';

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'mo',
    description: 'Explore civilizations and query the Oracle with essential research tools.',
    features: [
      '10 Oracle queries per day',
      'Access to civilization index',
      'Basic epistemic classification',
      'Community research notes',
    ],
    cta: { label: 'Get Started', href: '/home' },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: 'mo',
    description: 'Full archive access, voice synthesis, and advanced multi-agent synthesis.',
    features: [
      'Unlimited Oracle queries',
      '16-volume archive access',
      'Voice input & synthesis',
      'Epistemic confidence scoring',
      'Priority synthesis engine',
    ],
    cta: { label: 'Start Pro Trial', href: '/cart?tier=pro' },
    badge: 'Most Popular',
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199',
    period: 'mo',
    description: 'Institutional deployment with custom agents, API access, and dedicated support.',
    features: [
      'Everything in Pro',
      'Custom Vanguard agents',
      'API & webhook access',
      'Document upload & indexing',
      'Dedicated support & SLA',
    ],
    cta: { label: 'Contact Sales', href: '/home#enterprise' },
  },
];

export function ProductTierSection() {
  return (
    <section className="py-24 md:py-32 bg-[#05050a]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">
        <ScrollReveal className="text-center mb-16">
          <span className="text-[10px] font-mono text-[var(--color-brand)] uppercase tracking-[0.2em] block mb-4">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Choose your research tier
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Start free, scale to institutional deployment. Every tier includes epistemic
            classification and civilization-scale search.
          </p>
        </ScrollReveal>

        <ScrollRevealStagger className="grid gap-6 md:grid-cols-3 items-stretch">
          {TIERS.map((tier) => (
            <motion.div key={tier.id} variants={holokaiVariants.cardEntrance} className="flex">
              <PricingCard tier={tier} className="flex-1" />
            </motion.div>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}
