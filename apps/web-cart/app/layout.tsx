import React from 'react';
import './global.css';
import { Header, Footer } from '@holokai/branding';

export const metadata = {
  title: 'HoloKai Cart · Subscription & Access',
  description: 'Choose your HoloKai research tier. Free, Pro, and Enterprise plans with varying access to Oracle AI, Archive Codex, and Vanguards.',
  openGraph: {
    title: 'HoloKai Cart · Subscription & Access',
    description: 'Choose your HoloKai research tier with varying access to Oracle AI, Archive Codex, and Vanguards.',
    images: [{ url: '/logos/holokai-logo-3d.jpg', width: 1200, height: 630 }],
  },
};

import Providers from './providers';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#05050a] text-zinc-100 min-h-screen p-6">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header logoVariant="auto">
              <nav className="flex items-center gap-6">
                <a href="/" className="text-zinc-300 hover:text-white transition-colors">Home</a>
                <a href="/archive" className="text-zinc-300 hover:text-white transition-colors">Archive</a>
                <a href="/research" className="text-zinc-300 hover:text-white transition-colors">Research</a>
                <a href="/cart" className="text-zinc-300 hover:text-white transition-colors">Cart</a>
              </nav>
            </Header>
            <main className="flex-1">
              {children}
            </main>
            <Footer showCopyright={true} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
