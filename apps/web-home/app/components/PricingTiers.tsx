'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Star } from 'lucide-react';
import { PricingTier as PricingTierType } from '@holokai/contracts';

const tiers: PricingTierType[] = [
  {
    id: 'free',
    name: 'Free',
    price: { amount: 0, currency: 'USD', period: 'month', displayString: '$0/mo' },
    description: 'Perfect for exploring HoloKai capabilities',
    popular: false,
    features: [
      { id: '1', name: 'Basic knowledge queries', description: '50 queries per month', availableIn: ['free', 'pro', 'enterprise'] },
      { id: '2', name: 'Document uploads', description: '5 documents', availableIn: ['free', 'pro', 'enterprise'] },
      { id: '3', name: 'Community support', description: 'Forum-based support', availableIn: ['free', 'pro', 'enterprise'] },
      { id: '4', name: 'Standard response time', description: 'Under 5 seconds', availableIn: ['free', 'pro', 'enterprise'] },
    ],
    limits: { queriesPerMonth: 50, documents: 5, voiceMinutes: 0, imageGenerations: 0 },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { amount: 29, currency: 'USD', period: 'month', displayString: '$29/mo' },
    description: 'For researchers and content creators',
    popular: true,
    features: [
      { id: '1', name: 'Unlimited knowledge queries', description: '1000 queries per month', availableIn: ['pro', 'enterprise'] },
      { id: '2', name: 'Document uploads', description: '100 documents', availableIn: ['pro', 'enterprise'] },
      { id: '3', name: 'Voice synthesis', description: '120 minutes per month', availableIn: ['pro', 'enterprise'] },
      { id: '4', name: 'Image generation', description: '50 generations per month', availableIn: ['pro', 'enterprise'] },
      { id: '5', name: 'Priority support', description: 'Email support within 24h', availableIn: ['pro', 'enterprise'] },
      { id: '6', name: 'Advanced analytics', description: 'Usage insights and reports', availableIn: ['pro', 'enterprise'] },
      { id: '7', name: 'API access', description: 'Full API access', availableIn: ['pro', 'enterprise'] },
    ],
    limits: { queriesPerMonth: 1000, documents: 100, voiceMinutes: 120, imageGenerations: 50 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { amount: 199, currency: 'USD', period: 'month', displayString: '$199/mo' },
    description: 'For teams and organizations',
    popular: false,
    features: [
      { id: '1', name: 'Unlimited everything', description: 'No limits on any feature', availableIn: ['enterprise'] },
      { id: '2', name: 'Document uploads', description: '1000 documents', availableIn: ['enterprise'] },
      { id: '3', name: 'Voice synthesis', description: '1000 minutes per month', availableIn: ['enterprise'] },
      { id: '4', name: 'Image generation', description: '500 generations per month', availableIn: ['enterprise'] },
      { id: '5', name: 'Dedicated support', description: '24/7 dedicated support', availableIn: ['enterprise'] },
      { id: '6', name: 'Custom integrations', description: 'Tailored to your needs', availableIn: ['enterprise'] },
      { id: '7', name: 'Team collaboration', description: 'Shared workspaces', availableIn: ['enterprise'] },
      { id: '8', name: 'SLA guarantee', description: '99.9% uptime SLA', availableIn: ['enterprise'] },
      { id: '9', name: 'White-label options', description: 'Custom branding', availableIn: ['enterprise'] },
    ],
    limits: { queriesPerMonth: 10000, documents: 1000, voiceMinutes: 1000, imageGenerations: 500 },
  },
];

interface TierCardProps {
  tier: PricingTierType;
  index: number;
}

function TierCard({ tier, index }: TierCardProps) {
  const isPopular = tier.popular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-6 rounded-2xl border transition-all duration-300 ${
        isPopular
          ? 'bg-gradient-to-br from-amber-500/10 to-blue-500/10 border-amber-500/30 shadow-lg shadow-amber-500/10 scale-105'
          : 'bg-[#12121a] border-white/10 hover:border-white/20'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Most Popular
        </div>
      )}

      {/* Tier Name */}
      <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-amber-400' : 'text-white'}`}>
        {tier.name}
      </h3>

      {/* Price */}
      <div className="mb-4">
        <span className="text-4xl font-bold text-white">{tier.price.displayString}</span>
        <span className="text-zinc-400 text-sm ml-1">per {tier.price.period}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-6">{tier.description}</p>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {tier.features.map((feature) => (
          <li key={feature.id} className="flex items-start gap-3">
            <div className="mt-0.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            </div>
            <div>
              <span className="text-white text-sm font-medium">{feature.name}</span>
              <span className="text-zinc-400 text-xs block">{feature.description}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <a
        href="/cart"
        className={`block w-full py-3 px-6 rounded-xl text-center font-medium transition-colors ${
          isPopular
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-(text-white'
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        Get Started
      </a>
    </motion.div>
  );
}

export function PricingTiers() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto bg-[#0a0a0f] border-t border-white/5">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Choose Your Plan
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Start free and scale as you grow. All plans include core HoloKai features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <TierCard key={tier.id} tier={tier} index={index} />
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-zinc-400 font-medium">Free</th>
                <th className="text-center py-3 px-4 text-amber-400 font-medium">Pro</th>
                <th className="text-center py-3 px-4 text-blue-400 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Knowledge Queries', free: '50/mo', pro: '1000/mo', enterprise: 'Unlimited' },
                { feature: 'Document Storage', free: '5 docs', pro: '100 docs', enterprise: '1000 docs' },
                { feature: 'Voice Synthesis', free: <X className="w-4 h-4 mx-auto text-zinc-500" />, pro: '120 min', enterprise: '1000 min' },
                { feature: 'Image Generation', free: <X className="w-4 h-4 mx-auto text-zinc-500" />, pro: '50 gen', enterprise: '500 gen' },
                { feature: 'API Access', free: <X className="w-4 h-4 mx-auto text-zinc-500" />, pro: <Check className="w-4 h-4 mx-auto text-emerald-400" />, enterprise: <Check className="w-4 h-4 mx-auto text-emerald-400" /> },
                { feature: 'Priority Support', free: <X className="w-4 h-4 mx-auto text-zinc-500" />, pro: <Check className="w-4 h-4 mx-auto text-emerald-400" />, enterprise: <Check className="w-4 h-4 mx-auto text-emerald-400" /> },
              ].map((row, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3 px-4 text-white">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-zinc-400">
                    {typeof row.free === 'string' ? row.free : row.free}
                  </td>
                  <td className="py-3 px-4 text-center text-amber-400">
                    {typeof row.pro === 'string' ? row.pro : row.pro}
                  </td>
                  <td className="py-3 px-4 text-center text-blue-400">
                    {typeof row.enterprise === 'string' ? row.enterprise : row.enterprise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
