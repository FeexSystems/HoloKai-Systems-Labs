import React from 'react';
import { GlobalHeader } from '@holokai/ui';
import './global.css';

export const metadata = {
  title: 'HoloKai · Where Civilizations Remember',
  description: 'Civilization-scale spatial research operating system and Pan-African epigraphy, astronomy & AI synthesis engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <body className="antialiased bg-[#05050a] text-zinc-100 min-h-screen flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
        <GlobalHeader />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-amber-500/20 bg-[#0a0a0f] px-6 py-12 text-center text-xs text-zinc-400 space-y-3">
          <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest text-amber-400 uppercase font-bold">
            <span>HoloKai Systems Labs</span>
            <span>•</span>
            <span>Where Civilizations Remember</span>
          </div>
          <p>© 2026 HoloKai Systems Labs — Planetary-Scale Edge-Native Spatial Operating System.</p>
        </footer>
      </body>
    </html>
  );
}
