'use client';

import React from 'react';

export function GlobalFooter() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[#05050a] text-white py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logos/holokai-logo-horizontal.jpg"
                alt="HoloKai Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-light">
              Civilization-Scale Spatial Research Operating System. Preserving Pan-African codices, epigraphy, and oral tradition with multi-agent intelligence.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-brand)]">
              <span className="inline-block size-2 rounded-full bg-emerald-400" />
              <span>v14.0 Systemic OS · 100% Operational</span>
            </div>
          </div>

          {/* Product Columns */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[var(--color-brand)] uppercase tracking-widest">
              Research OS
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400 font-medium">
              <li><a href="/#oracle" className="hover:text-white transition-colors">Oracle Chamber</a></li>
              <li><a href="/#evidence" className="hover:text-white transition-colors">Evidence Matrix</a></li>
              <li><a href="/#civilizations" className="hover:text-white transition-colors">Kingdom Codices</a></li>
              <li><a href="/#library" className="hover:text-white transition-colors">16-Volume Library</a></li>
              <li><a href="/system" className="hover:text-white transition-colors">System Telemetry</a></li>
            </ul>
          </div>

          {/* Company Columns */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[var(--color-brand)] uppercase tracking-widest">
              Institution
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400 font-medium">
              <li><a href="/vanguards" className="hover:text-white transition-colors">Digital Vanguards</a></li>
              <li><a href="/#about" className="hover:text-white transition-colors">Manifesto</a></li>
              <li><a href="/#scholars" className="hover:text-white transition-colors">Scholarship Board</a></li>
              <li><a href="/#publications" className="hover:text-white transition-colors">Publications</a></li>
            </ul>
          </div>

          {/* Legal & Locale */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[var(--color-brand)] uppercase tracking-widest">
              Governance
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400 font-medium">
              <li><a href="/#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/#ethics" className="hover:text-white transition-colors">AI Ethics Protocol</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} HoloKai Systems Labs. Where Civilizations Remember.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[var(--color-brand)] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[var(--color-brand)] transition-colors">ArXiv Papers</a>
            <a href="#" className="hover:text-[var(--color-brand)] transition-colors">Dataset Index</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
