'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ancientEpistemicTransition, humanoidSyncTransition } from '../motion/profiles';

export interface MegaMenuItem {
  title: string;
  href: string;
  description: string;
  badge?: string;
}

export interface MegaMenuCategory {
  id: string;
  title: string;
  items: MegaMenuItem[];
  featured?: {
    title: string;
    description: string;
    href: string;
    image?: string;
  };
}

export interface MegaMenuProps {
  categories?: MegaMenuCategory[];
  onClose?: () => void;
}

const DEFAULT_CATEGORIES: MegaMenuCategory[] = [
  {
    id: 'civilizations',
    title: 'Pan-African Kingdoms',
    items: [
      { title: 'Kemet & Kush Codex', href: '/#kemet', description: 'Nile Valley epigraphy, pyramids & lunar calendars', badge: 'Active' },
      { title: 'Timbuktu Archives', href: '/#timbuktu', description: 'Sankore University astronomy & mathematical manuscripts' },
      { title: 'Great Zimbabwe', href: '/#zimbabwe', description: 'Dry-stone architectural geometry & gold routes' },
      { title: 'Aksumite Dynasty', href: '/#aksum', description: 'Ge’ez inscriptions, stelae & Red Sea trade network' },
    ],
    featured: {
      title: 'Timbuktu Mathematical Codex',
      description: 'Newly digitized 14th-century trigonometry and stellar navigation manuscripts.',
      href: '/#timbuktu',
    },
  },
  {
    id: 'domains',
    title: 'Epistemic Domains',
    items: [
      { title: 'Epigraphy & Scripts', href: '/#scripts', description: 'Hieroglyphs, Ge’ez, Nsibidi, Tifinagh & Meroitic' },
      { title: 'Divination Mathematics', href: '/#divination', description: 'Ifa 16-Bit binary matrix & geomancy algorithms' },
      { title: 'Archaeoastronomy', href: '/#astronomy', description: 'Nabta Playa megaliths & Dogon Sirian observations' },
      { title: 'Metallurgy & Masonry', href: '/#metallurgy', description: 'Nok iron smelting & Lalibela rock-cut churches' },
    ],
  },
  {
    id: 'system',
    title: 'OS Platform',
    items: [
      { title: 'System Telemetry', href: '/system', description: 'Real-time edge performance, memory & MFE status', badge: 'Live' },
      { title: 'Oracle AI Engine', href: '/#oracle', description: 'Multi-agent query synthesis & vector search' },
      { title: 'Evidence Matrix', href: '/#evidence', description: '6-state claim verification & scholarly consensus' },
      { title: '16-Volume Library', href: '/#library', description: 'Peer-reviewed historiography & spatial assets' },
    ],
  },
];

export function MegaMenu({ categories = DEFAULT_CATEGORIES, onClose }: MegaMenuProps) {
  const [activeCatId, setActiveCatId] = useState(categories[0]?.id || '');
  const activeCategory = categories.find((c) => c.id === activeCatId) || categories[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={ancientEpistemicTransition}
      className="absolute inset-x-0 top-full z-50 border-b border-[var(--color-border)] bg-[#0a0a0f]/95 backdrop-blur-2xl shadow-2xl"
    >
      <div className="mx-auto max-w-[1440px] p-6 md:p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Category Sidebar Column */}
        <div className="flex flex-col gap-2 border-r border-white/5 pr-6">
          <span className="text-xs font-mono text-[var(--color-brand)] font-bold uppercase tracking-widest block mb-4">
            Research Categories
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className={`relative w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                cat.id === activeCatId
                  ? 'text-[var(--color-brand)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* layoutId active highlight — slides between buttons */}
              {cat.id === activeCatId && (
                <motion.span
                  layoutId="mega-menu-active-cat"
                  className="absolute inset-0 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]"
                  transition={humanoidSyncTransition}
                />
              )}
              <span className="relative z-10">{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Product / Item Grid */}
        <motion.div
          key={activeCatId}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={humanoidSyncTransition}
          className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {activeCategory?.items.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              onClick={onClose}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...humanoidSyncTransition, delay: idx * 0.04 }}
              whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
              className="p-4 rounded-xl border border-white/5 bg-[#12121a] hover:bg-[#1a1a26] hover:border-[var(--color-border)] transition-colors group block"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm group-hover:text-[var(--color-brand)] transition-colors">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-brand)] font-mono text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </motion.a>
          ))}
        </motion.div>

        {/* Featured Promotional Card */}
        <AnimatePresence mode="wait">
          {activeCategory?.featured && (
            <motion.div
              key={activeCatId + '-featured'}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={ancientEpistemicTransition}
              className="rounded-2xl border border-[var(--color-border)] bg-gradient-to-b from-[#181824] to-[#0d0d14] p-6 text-white flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[var(--color-brand)] uppercase tracking-wider font-bold">
                  Featured Research
                </span>
                <h4 className="font-extrabold text-base text-[var(--color-brand)]">
                  {activeCategory.featured.title}
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activeCategory.featured.description}
                </p>
              </div>
              <a
                href={activeCategory.featured.href}
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                Explore Codex →
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
