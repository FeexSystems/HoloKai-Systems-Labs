'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CommandBar } from './CommandBar';
import { MegaMenu } from './MegaMenu';
import { AccountModal } from './AccountModal';

export interface GlobalHeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  cartCount?: number;
}

export function GlobalHeader({ currentPath = '/', onNavigate, cartCount: propCartCount }: GlobalHeaderProps) {
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [locale, setLocale] = useState('EN');
  const [cartCount, setCartCount] = useState(propCartCount ?? 0);

  useEffect(() => {
    if (propCartCount !== undefined) {
      setCartCount(propCartCount);
    }
  }, [propCartCount]);

  useEffect(() => {
    const handleCartEvent = (e: CustomEvent<{ count: number }>) => {
      if (e.detail?.count !== undefined) {
        setCartCount(e.detail.count);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('holokai_cart_change' as any, handleCartEvent as any);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('holokai_cart_change' as any, handleCartEvent as any);
      }
    };
  }, []);

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
      <div className="bg-gradient-to-r from-[var(--pui-forest-active)] via-[var(--pui-teal-bright)] to-[var(--pui-forest-deep)] text-black py-1.5 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 border-b border-[var(--color-border)]">
        <span className="font-mono bg-black text-[var(--color-brand)] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
          v14.0 Release
        </span>
        <span>HoloKai Spatial Research OS is Live · 16-Volume African Codex Digitized</span>
        <a href="/#v14" className="underline hover:text-white font-extrabold text-[11px] ml-2">
          Read Announcement →
        </a>
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[#05050a]/90 backdrop-blur-xl transition-all">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <a
            href="/"
            onClick={(e) => handleLinkClick('/', e)}
            className="flex items-center gap-3 group shrink-0"
          >
            <img
              src="/logos/holokai-logo-horizontal.jpg"
              alt="HoloKai Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </a>

          {/* Desktop Navigation & MegaMenu Trigger */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#12121a]/80 p-1.5 rounded-full border border-[var(--color-border)]">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                megaMenuOpen ? 'bg-[var(--color-brand)] text-black' : 'text-[var(--color-brand)] hover:bg-white/5'
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
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    active
                      ? 'text-black font-extrabold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)] shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Bar (Search, Locale, Cart, Account Setup) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Global Search Button */}
            <button
              onClick={() => setCommandBarOpen(true)}
              className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-[var(--color-border)] text-[var(--color-brand)] text-xs font-mono font-semibold flex items-center gap-2 transition-all hover:border-[var(--color-border-strong)]"
            >
              <span>🔍 Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-black/60 border border-[var(--color-border)]">
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
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[var(--color-brand)] text-black font-extrabold text-[10px] grid place-items-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Setup Trigger Button */}
            <button
              onClick={() => setAccountModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)] text-black text-xs font-extrabold shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <span>👤</span>
              <span>Account Setup</span>
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
        <AnimatePresence>
          {megaMenuOpen && <MegaMenu onClose={() => setMegaMenuOpen(false)} />}
        </AnimatePresence>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--color-border)] bg-[#0a0a0f] p-6 space-y-4 animate-in slide-in-from-top-2">
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
                className="flex-1 py-3 rounded-xl bg-white/5 border border-[var(--color-border)] text-[var(--color-brand)] text-xs font-mono font-bold text-center"
              >
                Search (⌘K)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAccountModalOpen(true);
                }}
                className="flex-1 py-3 rounded-xl bg-[var(--color-brand)] text-black font-extrabold text-xs text-center"
              >
                Account Setup
              </button>
            </div>
          </div>
        )}
      </header>

      {/* CommandBar Modal */}
      <CommandBar
        isOpen={commandBarOpen}
        onClose={() => setCommandBarOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Account & Auth Setup Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </>
  );
}
