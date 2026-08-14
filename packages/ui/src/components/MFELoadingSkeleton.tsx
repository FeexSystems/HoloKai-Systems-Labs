'use client';

import React from 'react';

export function MFELoadingSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-6 animate-pulse">
      <div className="w-full h-[300px] bg-[#0a0a0f] border border-white/5 rounded-2xl flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-[var(--color-brand)] animate-spin" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-[200px] bg-[#0a0a0f] border border-white/5 rounded-xl flex flex-col gap-4 p-6">
            <div className="w-12 h-12 bg-white/5 rounded-full" />
            <div className="w-3/4 h-6 bg-white/5 rounded" />
            <div className="w-full h-20 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
