'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Badge } from './Badge';
import { Check } from 'lucide-react';
import { holokaiVariants, humanoidSyncTransition, ancientEpistemicTransition } from '../motion/profiles';

export interface SubscriptionCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: string[];
  popular?: boolean;
  onSubscribe?: (id: string) => void;
}

export function SubscriptionCard({
  id,
  name,
  description,
  price,
  billingPeriod,
  features,
  popular,
  onSubscribe
}: SubscriptionCardProps) {
  return (
    <motion.div 
      variants={holokaiVariants.cardEntrance}
      whileHover={{ scale: popular ? 1.08 : 1.02, transition: humanoidSyncTransition as any }}
      className={`relative flex flex-col p-8 rounded-2xl bg-[#0a0a0f] border transition-colors duration-300 ${popular ? 'border-[var(--color-border-strong)] shadow-glow-active scale-105 z-10' : 'border-white/10 hover:border-white/30'}`}
    >
      {popular && (
        <motion.div 
          animate={{ y: [0, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-3 inset-x-0 flex justify-center"
        >
          <Badge variant="gold" className="bg-gradient-to-r from-[var(--pui-teal-bright)] to-[var(--pui-moss-bright)] border-none px-4 py-1">
            RECOMMENDED PROTOCOL
          </Badge>
        </motion.div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-extrabold text-white mb-2">{name}</h3>
        <p className="text-sm text-zinc-400 h-10">{description}</p>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-black text-[var(--color-brand)]">${price.toFixed(2)}</span>
          <span className="text-sm font-mono text-zinc-500 mb-1">/{billingPeriod}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[var(--color-brand)] shrink-0 mt-0.5" />
            <span className="text-sm text-zinc-300 leading-tight">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        variant={popular ? 'primary' : 'secondary'} 
        className="w-full h-12 text-lg uppercase tracking-widest font-bold"
        onClick={() => onSubscribe?.(id)}
      >
        Initialize
      </Button>
    </motion.div>
  );
}
