import React from 'react';
import './global.css';

export const metadata = {
  title: 'Civilization Archive MFE Remote — HoloKai Systems',
  description: '16-volume historical knowledge corpus, manuscripts & 3D gallery.',
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#05050a] text-zinc-100 min-h-screen p-6">
        {children}
      </body>
    </html>
  );
}
