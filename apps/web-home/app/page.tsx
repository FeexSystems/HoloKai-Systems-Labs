'use client';

import React, { Suspense } from 'react';
import {
  DomainSearch,
  VanguardCarousel,
  FeatureSection,
  ProcessSection,
  TestimonialCard,
  SanctuaryCard,
  ChronicleCard,
  CommsRelayCard,
  MFEErrorBoundary,
  MFELoadingSkeleton
} from '@holokai/ui';

function HomeMFEContent() {
  const handleSearch = (query: string, beastMode: boolean) => {
    console.log('Search:', query, 'Beast Mode:', beastMode);
    // Future integration with global search API
  };

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 lg:py-48 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen" />
        </div>
        
        <span className="text-sm font-mono tracking-[0.2em] text-amber-500 uppercase mb-6 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10">
          Planetary OS Remote Active
        </span>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8">
          Welcome to <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">HoloKai</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mb-12">
          The ultimate edge-native operating system designed to manage, research, and coordinate advanced planetary civilizations and ancient artifacts.
        </p>

        <div className="w-full max-w-4xl mx-auto">
          <DomainSearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Vanguards Section */}
      <section className="px-6 py-24 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">The Vanguards</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Discover the elite operatives actively defending the chronological boundaries across dimensions.</p>
          </div>
          <VanguardCarousel />
        </div>
      </section>

      {/* Systems Overview Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <FeatureSection 
          heading="Core Intelligence" 
          description="Unified architecture for advanced telemetry and artifact tracking." 
          visual={<div className="h-48 w-full bg-zinc-900 rounded-xl border border-white/10" />} 
        />
      </section>

      {/* Operations Grid */}
      <section className="px-6 py-24 border-t border-white/5 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Global Operations</h2>
            <p className="text-zinc-400 max-w-2xl">Access critical planetary infrastructure and specialized domains directly from your command center.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SanctuaryCard />
            <ChronicleCard />
            <CommsRelayCard />
          </div>
        </div>
      </section>

      {/* Process Tracking */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <ProcessSection />
      </section>
    </main>
  );
}

export default function HomeMFEPage() {
  return (
    <MFEErrorBoundary zoneName="Home Dashboard">
      <Suspense fallback={<MFELoadingSkeleton />}>
        <HomeMFEContent />
      </Suspense>
    </MFEErrorBoundary>
  );
}
