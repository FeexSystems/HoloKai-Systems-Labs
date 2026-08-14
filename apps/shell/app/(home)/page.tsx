/**
 * HoloKai Homepage — v14.0 Spec Composition (§38)
 * Server Component — SSR first per §1 architectural principle
 */

import React from 'react';
import type { Metadata } from 'next';
import { FullPageScrollWrapper } from '../../components/homepage/FullPageScrollWrapper';
import { HeroSection }              from '../../components/homepage/HeroSection';
import { ValuePropositionsSection } from '../../components/homepage/ValuePropositionsSection';
import { ProductTierSection }       from '../../components/homepage/ProductTierSection';
import { ProductTicker }            from '../../components/homepage/ProductTicker';
import { AIBuilderSection }    from '../../components/homepage/AIBuilderSection';
import { DomainSection }       from '../../components/homepage/DomainSection';
import { HostingSection }      from '../../components/homepage/HostingSection';
import { UnboxSection }        from '../../components/homepage/UnboxSection';
import { AlfSection }          from '../../components/homepage/AlfSection';
import { LaunchpadSection }    from '../../components/homepage/LaunchpadSection';
import { SecuritySection }     from '../../components/homepage/SecuritySection';
import { ManagementSection }   from '../../components/homepage/ManagementSection';
import { TestimonialsSection } from '../../components/homepage/TestimonialsSection';
import { FAQSection }          from '../../components/homepage/FAQSection';
import { NewsletterSection }   from '../../components/homepage/NewsletterSection';

export const metadata: Metadata = {
  title: 'HoloKai · Where Civilizations Remember',
  description:
    'Civilization-scale spatial research OS. Query 5,000 years of Pan-African epigraphy, astronomy, and oral tradition through AI synthesis with epistemic confidence scoring.',
  openGraph: {
    title: 'HoloKai · Where Civilizations Remember',
    description:
      'Pan-African epigraphy, astronomy & AI synthesis engine. Query civilizational knowledge through the Oracle Research Engine.',
    type: 'website',
    siteName: 'HoloKai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoloKai · Where Civilizations Remember',
    description:
      'Pan-African epigraphy, astronomy & AI synthesis engine.',
  },
};

export default function HomePage() {
  return (
    <main id="main-content" className="w-full">
      <FullPageScrollWrapper>
        {/* §13 Hero — massive headline, domain search CTA */}
        <HeroSection />

        {/* Value propositions — 5 key HoloKai benefits */}
        <ValuePropositionsSection />

        {/* Product tier overview — Free / Pro / Enterprise */}
        <ProductTierSection />

        {/* §2 ProductTicker — civilization index scroll */}
        <ProductTicker />

        {/* §2 AIBuilderSection — Oracle feature */}
        <AIBuilderSection />

        {/* §16 DomainSection — civilization browser grid */}
        <DomainSection />

        {/* §17 HostingSection — infrastructure feature (reverse) */}
        <HostingSection />

        {/* §18 UnboxSection — research workflow steps */}
        <UnboxSection />

        {/* §2 AlfSection — Vanguard AI guardians */}
        <AlfSection />

        {/* §29 LaunchpadSection — searchable platform launcher */}
        <LaunchpadSection />

        {/* §2 SecuritySection — epistemic integrity */}
        <SecuritySection />

        {/* §2 ManagementSection — 6-tile platform overview */}
        <ManagementSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* §19 FAQSection — asymmetric accordion layout */}
        <FAQSection />

        {/* §2 NewsletterSection — editorial CTA card */}
        <NewsletterSection />
      </FullPageScrollWrapper>
    </main>
  );
}
