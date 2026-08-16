'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  HeroSection,
  ProductTicker,
  AIBuilderSection,
  DomainSection,
  ProductTierSection,
  ValuePropositionsSection,
  HostingSection,
  SecuritySection,
  AlfSection,
  UnboxSection,
  ManagementSection,
  TestimonialsSection,
  FAQSection,
  LaunchpadSection,
  NewsletterSection,
  FullPageScrollWrapper,
} from '@/components/homepage';
import {
  VisionSection,
  AnatomySection,
  IntelligenceSection,
  EpistemicMatrixSection,
  MeetTheVanguard,
} from '@holokai/ui';
import { AIChatLauncher } from '@holokai/ui';

export default function HomePage() {
  const router = useRouter();

  const handleExploreVanguard = () => {
    document.getElementById('collective')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreIntelligence = () => {
    document.getElementById('intelligence')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenLab = () => {
    router.push('/lab');
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-[var(--color-brand)] selection:text-black">
      {/* 
        FullPageScrollWrapper orchestrates cinematic section snapping,
        staggered motion choreography, and viewport animations 
      */}
      <FullPageScrollWrapper scrollDelay={800}>
        {/* Section 1: Hero with 3D CivilizationGlobe & DomainSearch */}
        <div id="hero" className="w-full">
          <HeroSection />
        </div>

        {/* Section 2: Vision Section (Cinematic) */}
        <div id="vision" className="w-full">
          <VisionSection 
            onExploreVanguard={handleExploreVanguard}
            onExploreIntelligence={handleExploreIntelligence}
          />
        </div>

        {/* Section 3: Live Codex Ingestion Ticker */}
        <div id="ticker" className="w-full">
          <ProductTicker />
        </div>

        {/* Section 4: Anatomy Section (Cinematic) */}
        <div id="anatomy" className="w-full">
          <AnatomySection 
            onOpenLab={handleOpenLab}
            onMeetCollective={handleExploreVanguard}
          />
        </div>

        {/* Section 5: AI Research & Epistemic Synthesis Engine */}
        <div id="ai-synthesis" className="w-full">
          <AIBuilderSection />
        </div>

        {/* Section 6: Intelligence Section (Cinematic) */}
        <div id="intelligence" className="w-full">
          <IntelligenceSection 
            onAccessCore={() => router.push('/oracle')}
            onOpenUnitFeed={handleOpenLab}
          />
        </div>

        {/* Section 7: Domain & Civilization Index Explorer */}
        <div id="civilizations" className="w-full">
          <DomainSection />
        </div>

        {/* Section 8: Epistemic Matrix Section (Cinematic) */}
        <div id="epistemic" className="w-full">
          <EpistemicMatrixSection />
        </div>

        {/* Section 9: Value Propositions & Core Capabilities */}
        <div id="capabilities" className="w-full">
          <ValuePropositionsSection />
        </div>

        {/* Section 10: Meet the Vanguard (Cinematic) */}
        <div id="collective" className="w-full">
          <MeetTheVanguard />
        </div>

        {/* Section 11: Vanguard AI Guardians Showcase */}
        <div id="vanguards" className="w-full">
          <AlfSection />
        </div>

        {/* Section 12: Four-Step Epistemic Research Workflow */}
        <div id="workflow" className="w-full">
          <UnboxSection />
        </div>

        {/* Section 13: Research Product & Subscription Tiers */}
        <div id="tiers" className="w-full">
          <ProductTierSection />
        </div>

        {/* Section 14: Management & Observability Operations */}
        <div id="operations" className="w-full">
          <ManagementSection />
        </div>

        {/* Section 15: Security & 6-Tier Rigor Standards */}
        <div id="security" className="w-full">
          <SecuritySection />
        </div>

        {/* Section 16: Edge-Native Infrastructure & SLA */}
        <div id="infrastructure" className="w-full">
          <HostingSection />
        </div>

        {/* Section 17: Peer Endorsements & Scholar Testimonials */}
        <div id="testimonials" className="w-full">
          <TestimonialsSection />
        </div>

        {/* Section 18: HoloKai Interactive Product Launchpad */}
        <div id="launchpad" className="w-full">
          <LaunchpadSection />
        </div>

        {/* Section 19: Comprehensive Architectural FAQs */}
        <div id="faq" className="w-full allow-scroll">
          <FAQSection />
        </div>

        {/* Section 20: Civilization Memory Newsletter Digest */}
        <div id="newsletter" className="w-full">
          <NewsletterSection />
        </div>
      </FullPageScrollWrapper>

      {/* Floating AI Chat Assistant Launcher */}
      <AIChatLauncher />
    </main>
  );
}
