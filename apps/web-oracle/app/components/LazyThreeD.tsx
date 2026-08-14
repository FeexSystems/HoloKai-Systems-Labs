'use client';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Wave 7C Task 111: Bundle Optimization
 * Lazy load 3D components to reduce initial bundle size
 */

// Lazy load heavy 3D components
const CivilizationGlobe = lazy(() => import('./CivilizationGlobe'));
const ProductCard3D = lazy(() => import('./ProductCard3D'));
const ArtifactViewer = lazy(() => import('./ArtifactViewer'));

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
  const ComponentMap = {
    globe: CivilizationGlobe,
    card: ProductCard3D,
    artifact: ArtifactViewer
  };

  const LazyComponent = ComponentMap[component];

  if (!LazyComponent) {
    return <div>Unknown component: {component}</div>;
  }

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Code split agent components
 */
export const KnowledgeAgent = lazy(() => import('./agents/KnowledgeAgent'));
export const VoiceAgent = lazy(() => import('./agents/VoiceAgent'));
export const VisionAgent = lazy(() => import('./agents/VisionAgent'));
export const ArchiveAgent = lazy(() => import('./agents/ArchiveAgent'));

/**
 * Lazy load route components
 */
export const HomePage = lazy(() => import('../pages/HomePage'));
export const ProductPage = lazy(() => import('../pages/ProductPage'));
export const ArchivePage = lazy(() => import('../pages/ArchivePage'));
export const OraclePage = lazy(() => import('../pages/OraclePage'));
