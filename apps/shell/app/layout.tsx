import React from 'react';
import { GlobalHeader, GlobalFooter, AIChatLauncher } from '@holokai/ui';
import { RuntimeProvider } from '@holokai/runtime';
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
        <RuntimeProvider>
          <GlobalHeader />
          <div className="flex-1">{children}</div>
          <AIChatLauncher />
          <GlobalFooter />
        </RuntimeProvider>
      </body>
    </html>
  );
}
