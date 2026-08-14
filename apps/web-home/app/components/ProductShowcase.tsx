'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mic, Eye, Sparkles, Archive, ArrowRight } from 'lucide-react';
import { Product, PricingTier } from '@holokai/contracts';

const products: Product[] = [
  {
    id: 'research-tier',
    slug: 'research-tier',
    name: 'HoloKai Research Tier',
    category: 'research',
    holoKaiProduct: 'research-tier',
    description: 'Access to comprehensive knowledge base with ancient texts, historical analysis, and research tools',
    href: '/research',
    icon: 'BookOpen',
    featured: true,
    availableTiers: ['free', 'pro', 'enterprise'],
  },
  {
    id: 'voice-services',
    slug: 'voice-services',
    name: 'HoloKai Voice Services',
    category: 'voice',
    holoKaiProduct: 'voice-services',
    description: 'AI-powered voice synthesis in ancient languages with custom voice cloning capabilities',
    href: '/voice',
    icon: 'Mic',
    featured: true,
    availableTiers: ['pro', 'enterprise'],
  },
  {
    id: 'vision',
    slug: 'vision',
    name: 'HoloKai Vision',
    category: 'vision',
    holoKaiProduct: 'vision',
    description: 'Generate and analyze ancient artifacts, manuscripts, and historical imagery with AI',
    href: '/vision',
    icon: 'Eye',
    featured: true,
    availableTiers: ['pro', 'enterprise'],
  },
  {
    id: 'oracle',
    slug: 'oracle',
    name: 'HoloKai Oracle',
    category: 'oracle',
    holoKaiProduct: 'oracle',
    description: 'Real-time knowledge queries with multi-step reasoning and context-aware responses',
    href: '/oracle',
    icon: 'Sparkles',
    featured: true,
    availableTiers: ['free', 'pro', 'enterprise'],
  },
  {
    id: 'archive',
    slug: 'archive',
    name: 'HoloKai Archive',
    category: 'archive',
    holoKaiProduct: 'archive',
    description: 'Secure document storage with version control, semantic search, and tier-based access control',
    href: '/archive',
    icon: 'Archive',
    featured: true,
    availableTiers: ['free', 'pro', 'enterprise'],
  },
];

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Mic,
  Eye,
  Sparkles,
  Archive,
};

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[product.icon || 'BookOpen'] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div
        className={`relative p-6 rounded-2xl border transition-all duration-300 ${
          isHovered
            ? 'bg-gradient-to-br from-amber-500/10 to-blue-500/10 border-amber-500/30 shadow-lg shadow-amber-500/10'
            : 'bg-[#12121a] border-white/10 hover:border-white/20'
        }`}
      >
        {/* Glowing border effect */}
        {isHovered && (
          <motion.div
            layoutId="glow"
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/20 to-blue-500/20 blur-xl -z-10"
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
          isHovered ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-zinc-400'
        }`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Available Tiers */}
        <div className="flex gap-2 mb-4">
          {product.availableTiers?.map((tier) => (
            <span
              key={tier}
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                tier === 'pro'
                  ? 'bg-amber-500/20 text-amber-400'
                  : tier === 'enterprise'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-zinc-700 text-zinc-300'
              }`}
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={product.href}
          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
            isHovered ? 'text-amber-400' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Learn More
          <ArrowRight className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
        </a>
      </div>
    </motion.div>
  );
}

export function ProductShowcase() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Explore HoloKai Products
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Comprehensive tools for research, voice synthesis, artifact generation, intelligent queries, and document management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
