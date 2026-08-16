'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Badge } from './Badge';
import { holokaiVariants, humanoidSyncTransition } from '../motion/profiles';

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  imageUrl?: string;
  rating?: number;
  featured?: boolean;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  category,
  inventory,
  imageUrl,
  rating,
  featured,
  onAddToCart
}: ProductCardProps) {
  return (
    <motion.div 
      variants={holokaiVariants.cardEntrance}
      whileHover={{ scale: 1.02, transition: humanoidSyncTransition }}
      whileTap={{ scale: 0.98, transition: humanoidSyncTransition }}
      className={`flex flex-col p-6 rounded-2xl bg-background border transition-colors duration-300 ${featured ? 'border-border-strong shadow-glow-brand' : 'border-white/10 hover:border-white/30'}`}
    >
      {imageUrl && (
        <div className="w-full h-48 mb-6 rounded-xl bg-black/50 overflow-hidden relative border border-white/5 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
          <div className="text-zinc-600 font-mono text-xs z-20">NO IMAGE DATA</div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <Badge variant={featured ? 'gold' : 'default'} className="mb-2 uppercase tracking-wider text-[10px]">
            {category}
          </Badge>
          <h3 className="text-xl font-bold text-white leading-tight">{name}</h3>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-2xl font-bold text-brand">${price.toFixed(2)}</span>
          {rating && (
            <span className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
              <span className="text-brand">★</span> {rating}
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">
        {description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <span className={`text-xs font-mono ${inventory < 10 ? 'text-red-400' : 'text-zinc-500'}`}>
          {inventory > 0 ? `${inventory} UNITS REMAINING` : 'OUT OF STOCK'}
        </span>
        <Button 
          variant={featured ? 'primary' : 'secondary'} 
          disabled={inventory === 0}
          onClick={() => onAddToCart?.(id)}
        >
          {inventory > 0 ? 'Acquire' : 'Depleted'}
        </Button>
      </div>
    </motion.div>
  );
}
