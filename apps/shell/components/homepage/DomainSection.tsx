'use client';

import React from 'react';
import { ProductGrid, GridProductCard } from '@holokai/ui';

const CIVILIZATIONS = [
  {
    id: 'kemet',
    name: 'Kemet (Ancient Egypt)',
    description: 'Hieroglyphic archives, pharaonic dynasties, astronomical calendars, and Nile Valley epigraphy.',
    badge: '3100 BCE',
    featured: true,
  },
  {
    id: 'nubia',
    name: 'Nubia & Kush',
    description: 'Meroitic script, pyramids of Meroe, bloomery metallurgy, and trans-Saharan trade networks.',
    badge: '800 BCE',
  },
  {
    id: 'mali',
    name: 'Mali Empire',
    description: "Mansa Musa's pilgrimage, Timbuktu manuscript libraries, and trans-Saharan gold routes.",
    badge: '1235 CE',
  },
  {
    id: 'benin',
    name: 'Benin Kingdom',
    description: 'Royal court bronze castings, Oba lineage records, and Edo oral tradition archives.',
    badge: '1180 CE',
    featured: true,
  },
];

export function DomainSection() {
  return (
    <section className="py-24 md:py-32 bg-[#05050a]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-mono text-brand-light uppercase tracking-[0.2em] block mb-3">
              Civilization Index
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Explore the Archive
            </h2>
          </div>
          <a
            href="/archive"
            className="text-sm font-semibold text-brand-light hover:text-brand-light underline underline-offset-4 transition-colors shrink-0"
          >
            View all civilizations →
          </a>
        </div>

        <ProductGrid columns={4} gap="md">
          {CIVILIZATIONS.map((civ) => (
            <GridProductCard
              key={civ.id}
              name={civ.name}
              description={civ.description}
              badge={civ.badge}
              featured={civ.featured}
              href={`/archive?civ=${civ.id}`}
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2" y="10" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 2l8 8H2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              }
            />
          ))}
        </ProductGrid>
      </div>
    </section>
  );
}
