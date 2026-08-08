import React from 'react';
import './global.css';

export const metadata = {
  title: 'HoloKai Planetary Operating System',
  description: 'Edge-native, AI-augmented planetary frontend platform for HoloKai Systems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#05050a] text-zinc-100 min-h-screen">
        <header className="border-b border-amber-500/20 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-red-600 flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-amber-500/20">
              HK
            </div>
            <span className="font-bold tracking-wider text-amber-400">HOLOKAI PLANETARY OS</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-zinc-400">
            <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="/oracle" className="hover:text-amber-400 transition-colors">Oracle AI</a>
            <a href="/archive" className="hover:text-amber-400 transition-colors">Archive</a>
            <a href="/research" className="hover:text-amber-400 transition-colors">Research</a>
          </nav>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
