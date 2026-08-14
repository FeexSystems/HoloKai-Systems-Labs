'use client';

import React from 'react';

const TICKER_ITEMS = [
  { label: 'Kemet', value: 'Nile Valley · 3100 BCE' },
  { label: 'Nubia / Kush', value: 'Meroë · 800 BCE' },
  { label: 'Aksum', value: 'Horn of Africa · 100 CE' },
  { label: 'Great Zimbabwe', value: 'Southern Africa · 1100 CE' },
  { label: 'Mali Empire', value: 'West Africa · 1235 CE' },
  { label: 'Benin Kingdom', value: 'Nigeria · 1180 CE' },
  { label: 'Carthage', value: 'North Africa · 814 BCE' },
  { label: 'Songhai', value: 'West Africa · 1464 CE' },
];

export function ProductTicker() {
  // Duplicate for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="w-full overflow-hidden border-y border-brand/15 py-3 bg-[#08080e]"
      aria-label="Civilization index ticker"
    >
      <div
        className="flex gap-8 items-center"
        style={{
          animation: 'ticker-scroll 40s linear infinite',
          width: `max-content`,
        }}
      >
        {items.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="flex items-center gap-3 shrink-0"
            aria-hidden={i >= TICKER_ITEMS.length}
          >
            <span className="size-1 rounded-full bg-brand/60" aria-hidden="true" />
            <span className="text-xs font-mono font-bold text-brand-light uppercase tracking-widest">
              {item.label}
            </span>
            <span className="text-xs text-zinc-600">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
