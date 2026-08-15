import React from 'react';

/**
 * High-tech cybernetic Skeleton Loading components for HoloKai section layouts.
 * Provides smooth visual placeholders during data fetch on mobile & slow networks.
 */

export function SkeletonBlock({ className = '', style }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-zinc-900/80 border border-white/5 relative overflow-hidden ${className}`}
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
    </div>
  );
}

export function SkeletonGrid({ count = 6, cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={`grid gap-4 ${cols} w-full`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-zinc-950/70 p-4 space-y-3 relative overflow-hidden backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="w-8 h-8 rounded-lg" />
              <SkeletonBlock className="w-24 h-4 rounded" />
            </div>
            <SkeletonBlock className="w-12 h-3 rounded-full" />
          </div>
          <SkeletonBlock className="w-full h-12 rounded-lg" />
          <div className="flex items-center justify-between pt-2">
            <SkeletonBlock className="w-20 h-3 rounded" />
            <SkeletonBlock className="w-16 h-3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTimeline() {
  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex items-center gap-3 mb-6">
        <SkeletonBlock className="w-32 h-6 rounded-lg" />
        <SkeletonBlock className="w-20 h-4 rounded-full" />
      </div>
      <div className="relative pl-6 space-y-4 border-l border-amber-500/20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative rounded-xl border border-white/10 bg-zinc-950/80 p-4 space-y-2">
            <div className="absolute -left-[31px] top-5 w-3 h-3 rounded-full bg-amber-500/40 border border-amber-400 animate-ping" />
            <div className="flex justify-between items-center">
              <SkeletonBlock className="w-28 h-4 rounded" />
              <SkeletonBlock className="w-16 h-3 rounded-full" />
            </div>
            <SkeletonBlock className="w-3/4 h-4 rounded" />
            <SkeletonBlock className="w-full h-10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex gap-3 items-start">
        <SkeletonBlock className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-2 flex-1 max-w-md">
          <SkeletonBlock className="w-24 h-3 rounded" />
          <SkeletonBlock className="w-full h-16 rounded-2xl" />
        </div>
      </div>
      <div className="flex gap-3 items-start flex-row-reverse">
        <SkeletonBlock className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-2 flex-1 max-w-sm">
          <SkeletonBlock className="w-20 h-3 rounded ml-auto" />
          <SkeletonBlock className="w-full h-12 rounded-2xl" />
        </div>
      </div>
      <div className="flex gap-3 items-start">
        <SkeletonBlock className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-2 flex-1 max-w-lg">
          <SkeletonBlock className="w-28 h-3 rounded" />
          <SkeletonBlock className="w-full h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonOracle() {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="w-28 h-8 rounded-xl shrink-0" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 flex justify-center">
          <SkeletonBlock className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-amber-500/30" />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <SkeletonBlock className="w-48 h-6 rounded" />
          <SkeletonBlock className="w-full h-24 rounded-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton({ variant = 'general' }) {
  switch (variant) {
    case 'oracle':
      return <SkeletonOracle />;
    case 'archive':
    case 'library':
      return <SkeletonGrid count={6} />;
    case 'timeline':
      return <SkeletonTimeline />;
    case 'chat':
    case 'vanguard':
      return <SkeletonChat />;
    default:
      return (
        <div className="w-full p-4 sm:p-6 space-y-6">
          <div className="flex justify-between items-center">
            <SkeletonBlock className="w-44 h-7 rounded-xl" />
            <SkeletonBlock className="w-24 h-6 rounded-lg" />
          </div>
          <SkeletonGrid count={4} />
        </div>
      );
  }
}

export default SectionSkeleton;
