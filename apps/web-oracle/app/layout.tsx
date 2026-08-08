import React from 'react';
import './global.css';

export const metadata = {
  title: 'Oracle AI MFE Remote — HoloKai Systems',
  description: 'Oracle AI research synthesis, epigraphy & reasoning engine.',
};

export default function OracleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#05050a] text-zinc-100 min-h-screen p-6">
        {children}
      </body>
    </html>
  );
}
