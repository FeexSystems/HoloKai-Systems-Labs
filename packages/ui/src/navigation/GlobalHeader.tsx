'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandBar } from './CommandBar';
import { MegaMenu } from './MegaMenu';
import { AccountModal } from './AccountModal';

export interface GlobalHeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  cartCount?: number;
}

interface CartItem {
  name: string;
}

export function GlobalHeader({ onNavigate, cartCount: propCartCount }: GlobalHeaderProps) {
  const pathname = usePathname();
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [locale, setLocale] = useState('EN');
  const [cartCount, setCartCount] = useState(propCartCount ?? 0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (propCartCount !== undefined) setCartCount(propCartCount);
  }, [propCartCount]);

  useEffect(() => {
    const handleCartEvent = (e: CustomEvent<{ count: number; name?: string }>) => {
      if (e.detail?.count !== undefined) {
        setCartCount((prev) => prev + e.detail.count);
      }
      if (e.detail?.name) {
        setCartItems((prev) => [...prev, { name: e.detail.name! }]);
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

  // Global keyboard shortcut: Ctrl+K / Cmd+K opens CommandBar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandBarOpen(true);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  // Detect OS for shortcut display
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);
  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

  const navItems = [
    { label: 'Civilization OS', path: '/' },
    { label: 'Civilizations', path: '/civilizations' },
    { label: 'Oracle AI', path: '/oracle' },
    { label: 'Voice Oracle', path: '/oracle/voice' },
    { label: 'Archive Codex', path: '/archive' },
    { label: 'Vanguards', path: '/vanguards' },
    { label: '3D Lab', path: '/lab' },
    { label: 'System Edge', path: '/system' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[var(--pui-forest-active)] via-[var(--pui-teal-bright)] to-[var(--pui-forest-deep)] text-black py-1.5 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 border-b border-[var(--color-border)]">
        <span className="font-mono bg-black text-[var(--color-brand)] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
          v14.0 Release
        </span>
        <span>HoloKai Spatial Research OS is Live · 16-Volume African Codex Digitized</span>
        <Link href="/#v14" className="underline hover:text-white font-extrabold text-[11px] ml-2">
          Read Announcement →
        </Link>
      </div>

      {/* Main Header Bar */}
      <header className="relative z-40 w-full border-b border-[var(--color-border)] bg-[#05050a]/90 backdrop-blur-xl transition-all">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center h-full py-2 group select-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 mr-4 flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-[spin_12s_linear_infinite]" />
              <div className="absolute inset-1 border border-dashed border-teal-400/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <div className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_12px_4px_rgba(52,211,153,0.6)]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl md:text-3xl font-extrabold tracking-[0.25em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] leading-none">
                Holo<span className="font-light text-cyan-100 opacity-90">Kai</span>
              </span>
              <span className="text-[0.6rem] md:text-[0.7rem] text-emerald-400/80 tracking-[0.35em] uppercase font-medium mt-1">
                Research OS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#12121a]/80 p-1.5 rounded-full border border-[var(--color-border)]">
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                megaMenuOpen ? 'bg-[var(--color-brand)] text-black' : 'text-[var(--color-brand)] hover:bg-white/5'
              }`}
            >
              <span>Domains &amp; Products</span>
              <span className={`text-[10px] transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {navItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
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
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setCommandBarOpen(true)}
              className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-[var(--color-border)] text-[var(--color-brand)] text-xs font-mono font-semibold flex items-center gap-2 transition-all hover:border-[var(--color-border-strong)]"
            >
              <span>🔍 Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-black/60 border border-[var(--color-border)]">
                {shortcutLabel}
              </kbd>
            </button>

            {/* Locale */}
            <button
              onClick={() => setLocale(locale === 'EN' ? 'FR' : 'EN')}
              className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold transition-colors"
            >
              🌐 {locale}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold transition-colors"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[var(--color-brand)] text-black font-extrabold text-[10px] grid place-items-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => setAccountModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)] text-black text-xs font-extrabold shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <span>👤</span>
              <span>Account</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MegaMenu */}
        <AnimatePresence>
          {megaMenuOpen && <MegaMenu onClose={() => setMegaMenuOpen(false)} />}
        </AnimatePresence>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-[var(--color-border)] bg-[#0a0a0f] overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl border text-sm font-bold transition-colors ${
                        pathname === item.path
                          ? 'bg-[var(--color-brand)] text-black border-transparent'
                          : 'bg-[#12121a] border-white/5 text-white hover:border-[var(--color-brand)]/30'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="pt-4 border-t border-white/5 flex gap-3">
                  <button
                    onClick={() => { setMobileMenuOpen(false); setCommandBarOpen(true); }}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-[var(--color-border)] text-[var(--color-brand)] text-xs font-mono font-bold text-center"
                  >
                    Search ({shortcutLabel})
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAccountModalOpen(true); }}
                    className="flex-1 py-3 rounded-xl bg-[var(--color-brand)] text-black font-extrabold text-xs text-center"
                  >
                    Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer Modal */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 35 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0a0a0f] border-l border-[var(--color-border)] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                <div>
                  <h2 className="text-lg font-bold text-white">Requisition Roster</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{cartCount} unit{cartCount !== 1 ? 's' : ''} selected</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                  aria-label="Close cart"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="text-5xl">🛒</div>
                    <p className="text-zinc-500 text-sm">No Vanguard units selected yet.</p>
                    <Link
                      href="/vanguards"
                      onClick={() => setCartOpen(false)}
                      className="inline-block px-5 py-2.5 rounded-xl bg-[var(--color-brand)] text-black text-xs font-extrabold hover:brightness-110 transition-all"
                    >
                      Browse Vanguard Roster →
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[#12121a]"
                    >
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-xs text-zinc-400 font-mono">Vanguard Unit · Active</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[var(--color-border)] space-y-3">
                  <button className="w-full py-3 rounded-xl bg-[var(--color-brand)] text-black font-extrabold text-sm hover:brightness-110 transition-all">
                    Deploy Vanguard Roster
                  </button>
                  <button
                    onClick={() => { setCartItems([]); setCartCount(0); }}
                    className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono hover:text-white transition-colors"
                  >
                    Clear Roster
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CommandBar Modal */}
      <CommandBar
        isOpen={commandBarOpen}
        onClose={() => setCommandBarOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Account Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </>
  );
}
