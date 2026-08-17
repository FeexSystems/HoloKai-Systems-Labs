'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyThreeDProps {
  component: 'globe' | 'card' | 'artifact';
  fallback?: React.ReactNode;
  [key: string]: any;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8 rounded-2xl border border-white/10 bg-white/5">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      <p className="text-sm text-zinc-400">Loading 3D component...</p>
    </div>
  </div>
);

export function LazyThreeD({ component, fallback = <DefaultFallback />, ...props }: LazyThreeDProps) {
  return (
    <Suspense fallback={fallback}>
      <div className="p-6 rounded-2xl border border-amber-500/20 bg-black/40 text-center font-mono text-xs text-amber-400" {...props}>
        [3D Surface Component: {component}]
      </div>
    </Suspense>
  );
}
