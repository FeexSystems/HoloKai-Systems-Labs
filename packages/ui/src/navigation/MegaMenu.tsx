'use client';

import React, { useState } from 'react';

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
    <div className="absolute inset-x-0 top-full z-50 border-b border-amber-500/30 bg-[#0a0a0f]/95 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="mx-auto max-w-[1440px] p-6 md:p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Category Sidebar Column */}
        <div className="space-y-2 border-r border-white/5 pr-6">
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-4">
            Research Categories
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                cat.id === activeCatId
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Product / Item Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeCategory?.items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={onClose}
              className="p-4 rounded-xl border border-white/5 bg-[#12121a] hover:bg-[#1a1a26] hover:border-amber-500/30 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </a>
          ))}
        </div>

        {/* Featured Promotional Card */}
        {activeCategory?.featured && (
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#181824] to-[#0d0d14] p-6 text-white flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                Featured Research
              </span>
              <h4 className="font-extrabold text-base text-amber-200">
                {activeCategory.featured.title}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeCategory.featured.description}
              </p>
            </div>
            <a
              href={activeCategory.featured.href}
              onClick={onClose}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              Explore Codex →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
