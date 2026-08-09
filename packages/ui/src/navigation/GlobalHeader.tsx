'use client';

import React, { useState } from 'react';
import { CommandBar } from './CommandBar';
import { MegaMenu } from './MegaMenu';

export interface GlobalHeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function GlobalHeader({ currentPath = '/', onNavigate }: GlobalHeaderProps) {
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [locale, setLocale] = useState('EN');

  const navItems = [
    { label: 'Civilization OS', path: '/' },
    { label: 'Oracle AI', path: '/oracle' },
    { label: 'Archive Codex', path: '/archive' },
    { label: 'Vanguards', path: '/vanguards' },
    { label: 'System Edge', path: '/system' },
  ];

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-black py-1.5 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 border-b border-amber-400/30">
        <span className="font-mono bg-black text-amber-300 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
          v14.0 Release
        </span>
        <span>HoloKai Spatial Research OS is Live · 16-Volume African Codex Digitized</span>
        <a href="/#v14" className="underline hover:text-white font-extrabold text-[11px] ml-2">
          Read Announcement →
        </a>
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#05050a]/90 backdrop-blur-xl transition-all">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <a
            href="/"
            onClick={(e) => handleLinkClick('/', e)}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#05050a] rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-lg font-mono">
                HK
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-none group-hover:text-amber-300 transition-colors">
                HoloKai
              </span>
              <span className="text-[9px] font-mono text-amber-400/90 tracking-widest uppercase block mt-1">
                Civilization OS
              </span>
            </div>
          </a>

          {/* Desktop Navigation & MegaMenu Trigger */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#12121a]/80 p-1.5 rounded-full border border-amber-500/20">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                megaMenuOpen ? 'bg-amber-500 text-black' : 'text-amber-300 hover:bg-white/5'
              }`}
            >
              <span>Domains & Products</span>
              <span className={`text-[10px] transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {navItems.map((item) => {
              const active = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleLinkClick(item.path, e)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-extrabold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Bar (Search, Locale, Cart, Account) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Global Search Button */}
            <button
              onClick={() => setCommandBarOpen(true)}
              className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold flex items-center gap-2 transition-all hover:border-amber-500/50"
            >
              <span>🔍 Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-black/60 border border-amber-500/30">
                ⌘K
              </kbd>
            </button>

            {/* Locale Selector */}
            <button
              onClick={() => setLocale(locale === 'EN' ? 'FR' : 'EN')}
              className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold transition-colors"
            >
              🌐 {locale}
            </button>

            {/* Cart Button */}
            <button className="relative px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold transition-colors">
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-amber-500 text-black font-extrabold text-[10px] grid place-items-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Button */}
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-extrabold shadow-md hover:brightness-110 transition-all">
              Account
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MegaMenu Drawer Panel */}
        {megaMenuOpen && <MegaMenu onClose={() => setMegaMenuOpen(false)} />}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-500/20 bg-[#0a0a0f] p-6 space-y-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleLinkClick(item.path, e);
                  }}
                  className="px-4 py-3 rounded-xl bg-[#12121a] border border-white/5 text-white font-bold text-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="pt-4 border-t border-white/5 flex gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCommandBarOpen(true);
                }}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold text-center"
              >
                Search (⌘K)
              </button>
              <button className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-extrabold text-xs text-center">
                Account
              </button>
            </div>
          </div>
        )}
      </header>

      <CommandBar
        isOpen={commandBarOpen}
        onClose={() => setCommandBarOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
