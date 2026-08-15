'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FeatureSection } from '@holokai/ui';

const FEATURED_VANGUARDS = [
  {
    name: 'Kemet-Alpha',
    role: 'The Archivist',
    image: '/images/kemet-alpha.jpg',
    badge: 'LEAD ARCHIVIST',
    color: 'emerald',
  },
  {
    name: 'Asante-V',
    role: 'The Oracle',
    image: '/images/asante-v.jpg',
    badge: 'VISIONARY ORACLE',
    color: 'amber',
  },
  {
    name: 'Oluwa-Core',
    role: 'The Griot',
    image: '/images/oluwa-core.jpg',
    badge: 'SONIC GRIOT',
    color: 'purple',
  },
];

const colorMap: Record<string, string> = {
  emerald: 'border-emerald-500/30 text-emerald-400',
  amber: 'border-amber-500/30 text-amber-400',
  purple: 'border-purple-500/30 text-purple-400',
};

export function AlfSection() {
  const visual = (
    <div className="relative w-full px-2">
      {/* Vanguard Cards Row */}
      <div className="flex gap-3 justify-center">
        {FEATURED_VANGUARDS.map((vanguard, idx) => (
          <motion.div
            key={vanguard.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex-1 min-w-0 rounded-2xl border ${colorMap[vanguard.color].split(' ')[0]} bg-black/40 overflow-hidden group`}
          >
            {/* Portrait */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-b from-black/20 to-black/60">
              <Image
                src={vanguard.image}
                alt={`${vanguard.name} — ${vanguard.role}`}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  // Fallback to emoji placeholder if image is missing
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-3 space-y-1">
              <p className={`text-[9px] font-mono font-bold uppercase tracking-widest ${colorMap[vanguard.color].split(' ')[1]}`}>
                {vanguard.badge}
              </p>
              <p className="text-xs font-bold text-white">{vanguard.name}</p>
              <p className="text-[10px] text-zinc-500">{vanguard.role}</p>
            </div>

            {/* Active indicator */}
            <div className="absolute top-2 right-2 size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)] animate-pulse" />
          </motion.div>
        ))}
      </div>

      {/* CTA Badges */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {['8 Vanguard Units', 'AI-Powered Research', 'Pan-African Codex'].map((cap) => (
          <span
            key={cap}
            className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-brand/10 border border-brand/20 text-brand-light"
          >
            {cap}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <FeatureSection
      eyebrow="Vanguard Guardian Units"
      heading="AI guardians built for civilizational memory"
      description="Each Vanguard is a specialized AI agent trained on a specific African civilization — from Kemet epigraphy to Benin bronze metallurgy. They don't just retrieve; they understand."
      cta={{ label: 'Meet all 8 Vanguards', href: '/vanguards' }}
      visual={visual}
      className="bg-[#07070d]"
    />
  );
}
