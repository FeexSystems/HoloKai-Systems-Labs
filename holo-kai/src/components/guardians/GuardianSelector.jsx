import React from 'react';
import { GUARDIANS } from '@/lib/guardians';
import GuardianCard from './GuardianCard';
import { useHoloKai } from '@/lib/HoloKaiContext';

export default function GuardianSelector({
  selectedId,
  onSelect,
  layout = 'grid', // 'grid' | 'carousel' | 'compact'
  className = '',
}) {
  const { selectGuardian } = useHoloKai();

  const handleSelect = (id) => {
    selectGuardian(id);
    onSelect?.(id);
  };

  if (layout === 'compact') {
    return (
      <div className={`flex items-center gap-2 overflow-x-auto scrollbar-none py-2 ${className}`}>
        {GUARDIANS.map((g) => {
          const isSelected = (selectedId || GUARDIANS[0].id) === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: g.accentColor }}
              />
              <span>{g.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {GUARDIANS.map((g) => (
        <GuardianCard
          key={g.id}
          guardian={g}
          state={(selectedId || GUARDIANS[0].id) === g.id ? 'selected' : 'default'}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
