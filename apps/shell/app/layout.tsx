import React from 'react';
import Link from 'next/link';
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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-red-600 flex items-center justify-center text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
              HK
            </div>
            <span className="font-extrabold tracking-wider text-amber-400 text-sm">HOLOKAI PLANETARY OS</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <Link href="/oracle" className="hover:text-amber-400 transition-colors">Oracle AI</Link>
            <Link href="/archive" className="hover:text-amber-400 transition-colors">Archive</Link>
            <Link href="/research" className="hover:text-amber-400 transition-colors">Research</Link>
            <Link href="/lab" className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-500/20 transition-colors">
              Orbital Lab 3D
            </Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
