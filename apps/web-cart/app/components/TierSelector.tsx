'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { PricingTier as PricingTierType } from '@holokai/contracts';

interface TierSelectorProps {
  selectedTier: PricingTier;
  onTierChange: (tier: PricingTier) => void;
}

const tiers: PricingTierType[] = ['free', 'pro', 'enterprise'];

const tierInfo: Record<PricingTier, { name: string; price: string; description: string; features: string[]; popular: boolean }> = {
  free: {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring HoloKai',
    features: ['50 queries/month', '5 documents', 'Community support'],
    popular: false,
  },
  pro: {
    name: 'Pro',
    price: '$29',
    description: 'For researchers and creators',
    features: ['1000 queries/month', '100 documents', '120 voice minutes', '50 image generations', 'Priority support', 'API access'],
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: '$199',
    description: 'For teams and organizations',
    features: ['Unlimited everything', '1000 documents', '1000 voice minutes', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
    popular: false,
  },
};

export function TierSelector({ selectedTier, onTierChange }: TierSelectorProps) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Select Your Plan</h2>

      <div className="space-y-3">
        {tiers.map((tier) => {
          const info = tierInfo[tier];
          const isSelected = selectedTier === tier;

          return (
            <motion.label
              key={tier}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tiers.indexOf(tier) * 0.1 }}
              className={`relative block p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="tier"
                value={tier}
                checked={isSelected}
                onChange={() => onTierChange(tier)}
                className="sr-only"
              />

              {info.popular && (
                <div className="absolute -top-2 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-white">{info.name}</div>
                  <div className="text-2xl font-bold text-amber-400">{info.price}<span className="text-sm text-zinc-400">/mo</span></div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-amber-500 bg-amber-500' : 'border-white/30'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              <p className="text-sm text-zinc-400 mb-3">{info.description}</p>

              <ul className="space-y-1">
                {info.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.label>
          );
        })}
      </div>
    </div>
  );
}
