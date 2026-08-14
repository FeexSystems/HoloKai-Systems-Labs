import React from 'react';
import { motion } from 'motion/react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Badge } from './Badge';
import { Check, Star, ArrowRight } from 'lucide-react';
import type { Product, PricingTier, UseCase } from '@holokai/contracts';

export interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (tier: PricingTier) => void;
  availableTiers?: PricingTier[];
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onSubscribe,
  availableTiers = ['free', 'pro', 'enterprise'],
}: ProductDetailModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      description={product.description}
      size="xl"
    >
      <div className="space-y-8">
        {/* Product Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Icon/Visual */}
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center">
            {product.icon && (
              <div className="text-6xl text-[var(--color-brand)]">
                <span className="opacity-50">ICON</span>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="space-y-4">
            {product.badge && (
              <Badge variant="gold" className="text-sm">
                {product.badge}
              </Badge>
            )}
            
            {product.category && (
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Category</div>
                <div className="text-sm text-white capitalize">{product.category}</div>
              </div>
            )}

            {product.price && (
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Starting Price</div>
                <div className="text-2xl font-bold text-[var(--color-brand)]">
                  {product.price.displayString || `$${product.price.amount}`}
                </div>
                {product.price.period && (
                  <span className="text-sm text-zinc-400 ml-1">/{product.price.period}</span>
                )}
              </div>
            )}

            {product.availableTiers && product.availableTiers.length > 0 && (
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Available Tiers</div>
                <div className="flex flex-wrap gap-2">
                  {product.availableTiers.map((tier) => (
                    <Badge key={tier} variant="default" className="text-xs">
                      {tier.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Use Cases */}
        {product.useCases && product.useCases.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Use Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.useCases.map((useCase) => (
                <motion.div
                  key={useCase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-sm font-medium text-white mb-2">{useCase.title}</div>
                  <div className="text-xs text-zinc-400 mb-3">{useCase.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {useCase.idealFor.map((audience) => (
                      <span key={audience} className="text-xs text-zinc-500">
                        {audience}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Key Features</h3>
          <div className="space-y-3">
            {[
              'AI-powered analysis and synthesis',
              'Real-time collaboration tools',
              'Advanced search and filtering',
              'Secure document management',
              'Cross-platform accessibility',
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <Check className="w-5 h-5 text-[var(--color-brand)] flex-shrink-0" />
                <span className="text-sm text-zinc-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Options */}
        {availableTiers && availableTiers.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableTiers.map((tier) => (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    tier === 'pro'
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                  onClick={() => onSubscribe?.(tier)}
                >
                  <div className="text-lg font-bold text-white mb-1 capitalize">{tier}</div>
                  <div className="text-xs text-zinc-400 mb-3">
                    {tier === 'free' && 'Perfect for exploring'}
                    {tier === 'pro' && 'For serious users'}
                    {tier === 'enterprise' && 'For teams and institutions'}
                  </div>
                  <Button
                    variant={tier === 'pro' ? 'primary' : 'secondary'}
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubscribe?.(tier);
                    }}
                  >
                    Select {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="text-sm text-zinc-400">
            Start your journey with HoloKai today
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
