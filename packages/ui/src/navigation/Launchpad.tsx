'use client';

import React, { useState } from 'react';

export interface LaunchpadItem {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  href: string;
  category?: string;
  badge?: string;
  featured?: boolean;
}

export interface LaunchpadProps {
  items: LaunchpadItem[];
  searchPlaceholder?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

const colStyles = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
};

export function Launchpad({
  items,
  searchPlaceholder = 'Search products…',
  columns = 3,
  className = '',
}: LaunchpadProps) {
  const [query, setQuery] = useState('');

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(query.toLowerCase())
  );

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative flex items-center">
        <svg
          className="absolute left-4 text-zinc-500 pointer-events-none"
          width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className={[
            'w-full h-12 pl-11 pr-4 rounded-2xl',
            'bg-[#12121a] border border-[var(--color-border)] text-white placeholder-zinc-600',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/40 focus:border-[var(--color-brand)]/60',
            'transition-all duration-200 text-sm',
          ].join(' ')}
        />
      </div>

      {/* Grid */}
      {query === '' && categories.length > 0 ? (
        <div className="flex flex-col gap-8">
          {categories.map((cat) => (
            <div key={cat}>
              <span className="text-[10px] font-mono text-[var(--color-brand)] uppercase tracking-[0.2em] mb-4 block">
                {cat}
              </span>
              <div className={`grid ${colStyles[columns]} gap-3`}>
                {items
                  .filter((item) => item.category === cat)
                  .map((item) => <LaunchpadTile key={item.id} item={item} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid ${colStyles[columns]} gap-3`}>
          {filtered.length > 0 ? (
            filtered.map((item) => <LaunchpadTile key={item.id} item={item} />)
          ) : (
            <p className="col-span-full text-center text-sm text-zinc-500 py-12 font-mono">
              No results for "{query}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function LaunchpadTile({ item }: { item: LaunchpadItem }) {
  return (
    <a
      href={item.href}
      data-track-el={`launchpad-${item.id}`}
      data-track-ec="launchpad"
      data-track-ea="click"
      className={[
        'group relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200',
        item.featured
          ? 'border-[var(--color-border-strong)] bg-gradient-to-b from-[var(--color-surface-hover)] to-[#0a0a0f] hover:border-[var(--color-border-strong)]'
          : 'border-[var(--color-border)] bg-[#12121a] hover:border-[var(--color-border)] hover:bg-[#16161f]',
        'hover:-translate-y-0.5',
      ].join(' ')}
    >
      {item.icon && (
        <div className="size-10 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-brand)] group-hover:bg-[var(--color-surface-hover)] transition-colors">
          {item.icon}
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-white group-hover:text-[var(--color-brand)] transition-colors">
            {item.name}
          </span>
          {item.badge && (
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-brand)] border border-[var(--color-border)]">
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{item.description}</p>
      </div>
    </a>
  );
}

Launchpad.displayName = 'Launchpad';
