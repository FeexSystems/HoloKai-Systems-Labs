import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, Info } from 'lucide-react';
import type { FeatureComparison, PricingTier } from '@holokai/contracts';

export interface ComparisonTableProps {
  comparison: FeatureComparison;
  highlightedTier?: PricingTier;
  onTierSelect?: (tier: PricingTier) => void;
}

export function ComparisonTable({ 
  comparison, 
  highlightedTier = 'pro',
  onTierSelect 
}: ComparisonTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-6 text-zinc-400 font-medium sticky left-0 bg-[#0a0a0f] z-10 min-w-[250px]">
              Feature
            </th>
            {comparison.tiers.map((tier) => (
              <th
                key={tier.id}
                className={`text-center py-4 px-6 font-medium cursor-pointer transition-colors ${
                  tier.id === highlightedTier
                    ? 'text-[var(--color-brand)] bg-[var(--color-brand)]/5'
                    : 'text-white hover:bg-white/5'
                }`}
                onClick={() => onTierSelect?.(tier.id)}
              >
                <div className="flex flex-col items-center gap-2">
                  <span>{tier.name}</span>
                  {tier.popular && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-brand)]/20 text-[var(--color-brand)]">
                      Popular
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.features.map((feature, index) => {
            const isHovered = hoveredRow === feature.id;
            
            return (
              <motion.tr
                key={feature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredRow(feature.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-white/5 transition-colors ${
                  isHovered ? 'bg-white/5' : ''
                }`}
              >
                {/* Feature Name */}
                <td className="py-4 px-6 sticky left-0 bg-[#0a0a0f] z-10 min-w-[250px]">
                  <div className="flex items-start gap-3">
                    {feature.icon && (
                      <div className="mt-0.5 text-[var(--color-brand)]">
                        <span className="text-xs">ICON</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{feature.name}</div>
                      <div className="text-xs text-zinc-400 mt-1">{feature.description}</div>
                    </div>
                    <Info className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                  </div>
                </td>

                {/* Tier Availability */}
                {comparison.tiers.map((tier) => {
                  const hasFeature = tier.features.some((f) => f.id === feature.id);
                  const isHighlighted = tier.id === highlightedTier;
                  
                  return (
                    <td
                      key={tier.id}
                      className={`text-center py-4 px-6 ${
                        isHighlighted && hasFeature ? 'bg-[var(--color-brand)]/5' : ''
                      }`}
                    >
                      {hasFeature ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex justify-center"
                        >
                          <Check className="w-5 h-5 text-[var(--color-brand)]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex justify-center"
                        >
                          <X className="w-5 h-5 text-zinc-600" />
                        </motion.div>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-[var(--color-brand)]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-4 h-4 text-zinc-600" />
          <span>Not Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[var(--color-brand)]" />
          <span>Highlighted Tier</span>
        </div>
      </div>
    </div>
  );
}
