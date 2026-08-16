'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Badge } from './Badge';
import { Check, X } from 'lucide-react';
import type { PricingTierConfig, PricingTier } from '@holokai/contracts';

export interface PricingSelectorProps {
  tiers: PricingTierConfig[];
  selectedTier?: PricingTier;
  onSelectTier?: (tier: PricingTier) => void;
  showComparison?: boolean;
}

export function PricingSelector({ 
  tiers, 
  selectedTier = 'pro', 
  onSelectTier,
  showComparison = true 
}: PricingSelectorProps) {
  const [hoveredTier, setHoveredTier] = useState<PricingTier | null>(null);
  
  return (
    <div className="w-full">
      {/* Tier Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-background border border-white/10 rounded-full p-1">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => onSelectTier?.(tier.id)}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedTier === tier.id
                  ? 'bg-brand text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tier.name}
              {tier.popular && (
                <Badge variant="gold" className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5">
                  Popular
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const isHovered = hoveredTier === tier.id;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTier?.(tier.id)}
              className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-brand bg-brand/5 shadow-glow-brand'
                  : 'border-white/10 bg-background hover:border-white/30'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="gold">Most Popular</Badge>
                </div>
              )}
              
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-brand">
                    ${tier.price.amount}
                  </span>
                  {tier.price.period && (
                    <span className="text-zinc-400">/{tier.price.period}</span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-2">{tier.description}</p>
              </div>
              
              {/* Features */}
              <div className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <div key={feature.id} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <Check className="w-4 h-4 text-brand" />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{feature.name}</div>
                      <div className="text-xs text-zinc-400">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Limits */}
              <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                {Object.entries(tier.limits).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-zinc-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-zinc-400 font-mono">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <Button
                variant={isSelected ? 'primary' : 'secondary'}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTier?.(tier.id);
                }}
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </Button>
              
              {/* Hover Glow Effect */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.1), transparent 50%)',
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      
      {/* Feature Comparison */}
      {showComparison && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-zinc-400 font-medium">Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.id} className="text-center py-4 px-4 text-white font-medium">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tiers[0].features.map((feature) => (
                  <tr key={feature.id} className="border-b border-white/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {feature.icon && (
                          <span className="text-brand">ICON</span>
                        )}
                        <div>
                          <div className="text-sm text-white font-medium">{feature.name}</div>
                          <div className="text-xs text-zinc-400">{feature.description}</div>
                        </div>
                      </div>
                    </td>
                    {tiers.map((tier) => {
                      const hasFeature = tier.features.some((f) => f.id === feature.id);
                      return (
                        <td key={tier.id} className="text-center py-4 px-4">
                          {hasFeature ? (
                            <Check className="w-5 h-5 text-brand mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-zinc-600 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
