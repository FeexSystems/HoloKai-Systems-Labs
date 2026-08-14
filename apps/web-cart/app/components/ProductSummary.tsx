'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mic, Eye, Sparkles, Archive, Trash2, Plus, Minus } from 'lucide-react';
import { Product, PricingTier } from '@holokai/contracts';

interface CartItem {
  product: Product;
  quantity: number;
  tier: PricingTier;
}

interface ProductSummaryProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Mic,
  Eye,
  Sparkles,
  Archive,
};

export function ProductSummary({ items, onUpdateQuantity, onRemove }: ProductSummaryProps) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.tier === 'free' ? 0 : item.tier === 'pro' ? 29 : 199;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Your Selection</h2>

      {items.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => {
              const Icon = iconMap[item.product.icon || 'BookOpen'] || BookOpen;
              const price = item.tier === 'free' ? 0 : item.tier === 'pro' ? 29 : 199;

              return (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{item.product.name}</h3>
                    <p className="text-sm text-zinc-400">{item.tier.charAt(0).toUpperCase() + item.tier.slice(1)} Tier</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">${price * item.quantity}</div>
                    <div className="text-xs text-zinc-400">/mo</div>
                  </div>

                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}/mo</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/10">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}/mo</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
