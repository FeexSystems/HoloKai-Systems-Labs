import React from 'react';
import { Header, Footer, MetaTags } from '@holokai/branding';
import './global.css';

export const metadata = {
  title: 'HoloKai · Where Civilizations Remember',
  description: 'Civilization-scale spatial research OS. Query 5,000 years of Pan-African epigraphy, astronomy, and oral tradition through AI synthesis with epistemic confidence scoring.',
  openGraph: {
    title: 'HoloKai · Where Civilizations Remember',
    description: 'Pan-African epigraphy, astronomy & AI synthesis engine. Multi-agent research with epistemic classification.',
    images: [{ url: '/logos/holokai-logo-3d.jpg', width: 1200, height: 630 }],
  },
};

export default function OracleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#05050a] text-zinc-100 min-h-screen flex flex-col">
        <MetaTags 
          title="HoloKai · Where Civilizations Remember"
          description="Civilization-scale spatial research OS. Query 5,000 years of Pan-African epigraphy, astronomy, and oral tradition through AI synthesis with epistemic confidence scoring."
          imageUrl="/logos/holokai-logo-3d.jpg"
        />
        <Header logoVariant="auto" showBrand={true} />
        <main className="flex-1">{children}</main>
        <Footer showCopyright={true} />
      </body>
    </html>
  );
}
