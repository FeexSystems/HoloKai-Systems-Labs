'use client';

import React from 'react';
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
import { AIChatLauncher } from '@holokai/ui';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#05050a] text-white selection:bg-[var(--color-brand)] selection:text-black">
      {/* 
        FullPageScrollWrapper orchestrates cinematic section snapping,
        staggered motion choreography, and viewport animations 
      */}
      <FullPageScrollWrapper scrollDelay={800}>
        {/* Section 1: Hero with 3D CivilizationGlobe & DomainSearch */}
        <div id="hero" className="w-full">
          <HeroSection />
        </div>

        {/* Section 2: Live Codex Ingestion Ticker */}
        <div id="ticker" className="w-full">
          <ProductTicker />
        </div>

        {/* Section 3: AI Research & Epistemic Synthesis Engine */}
        <div id="ai-synthesis" className="w-full">
          <AIBuilderSection />
        </div>

        {/* Section 4: Domain & Civilization Index Explorer */}
        <div id="civilizations" className="w-full">
          <DomainSection />
        </div>

        {/* Section 5: Value Propositions & Core Capabilities */}
        <div id="capabilities" className="w-full">
          <ValuePropositionsSection />
        </div>

        {/* Section 6: Vanguard AI Guardians Showcase */}
        <div id="vanguards" className="w-full">
          <AlfSection />
        </div>

        {/* Section 7: Four-Step Epistemic Research Workflow */}
        <div id="workflow" className="w-full">
          <UnboxSection />
        </div>

        {/* Section 8: Research Product & Subscription Tiers */}
        <div id="tiers" className="w-full">
          <ProductTierSection />
        </div>

        {/* Section 9: Management & Observability Operations */}
        <div id="operations" className="w-full">
          <ManagementSection />
        </div>

        {/* Section 10: Security & 6-Tier Rigor Standards */}
        <div id="security" className="w-full">
          <SecuritySection />
        </div>

        {/* Section 11: Edge-Native Infrastructure & SLA */}
        <div id="infrastructure" className="w-full">
          <HostingSection />
        </div>

        {/* Section 12: Peer Endorsements & Scholar Testimonials */}
        <div id="testimonials" className="w-full">
          <TestimonialsSection />
        </div>

        {/* Section 13: HoloKai Interactive Product Launchpad */}
        <div id="launchpad" className="w-full">
          <LaunchpadSection />
        </div>

        {/* Section 14: Comprehensive Architectural FAQs */}
        <div id="faq" className="w-full allow-scroll">
          <FAQSection />
        </div>

        {/* Section 15: Civilization Memory Newsletter Digest */}
        <div id="newsletter" className="w-full">
          <NewsletterSection />
        </div>
      </FullPageScrollWrapper>

      {/* Floating AI Chat Assistant Launcher */}
      <AIChatLauncher />
    </main>
  );
}
