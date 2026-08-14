'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainSearch } from '@holokai/ui';
import GalacticBackground from '../../../components/GalacticBackground';

interface RealmResult {
  domain: string;
  available: boolean;
  tier: string;
  price: string;
}

export default function RealmSearchPage() {
  const [results, setResults] = useState<RealmResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [registeredRealms, setRegisteredRealms] = useState<string[]>([]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const handleRealmSearch = async (query: string) => {
    if (!query) return;
    setIsSearching(true);

    // Simulate network query to BFF Registry
    setTimeout(() => {
      const formatted = query.toLowerCase().replace(/\s+/g, '-');
      setResults([
        { domain: `${formatted}.os`, available: true, tier: 'Standard Realm', price: '$12/yr' },
        { domain: `${formatted}.citadel`, available: true, tier: 'Citadel Core', price: '$49/yr' },
        { domain: `${formatted}.vanguard`, available: false, tier: 'Vanguard Reserved', price: 'N/A' },
      ]);
      setIsSearching(false);
    }, 600);
  };

  const handleRegisterRealm = (domainName: string) => {
    setRegisteredRealms((prev) => [...prev, domainName]);
    setToastMessage(`✓ Realm Secured: ${domainName}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <main className="max-w-7xl mx-auto space-y-10 p-6 md:p-12 min-h-screen bg-[#05050a] text-white relative overflow-hidden">
      <GalacticBackground />
      
      <div className="relative z-10 space-y-10">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-[var(--color-brand)] text-black font-mono text-xs font-extrabold shadow-2xl border border-[var(--color-border)]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-[var(--color-border)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[var(--color-brand)] uppercase font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--color-brand)] animate-pulse" />
            Galactic Namespace Registry
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Realm Discovery</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            Search, verify, and reserve official namespace domains for your sovereign civilizational network.
          </p>
        </div>
      </header>

      <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-brand/20 max-w-3xl">
        <DomainSearch onSearch={handleRealmSearch} />
      </div>

      {isSearching && (
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-brand)] animate-pulse">
          <span className="size-3 rounded-full border-2 border-t-transparent border-[var(--color-brand)] animate-spin" />
          Querying Galactic Registry...
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[var(--color-border)] bg-[#0a0a0f] overflow-hidden max-w-3xl"
        >
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold text-[var(--color-brand)] uppercase tracking-wider">
                <th className="py-4 px-6">Domain</th>
                <th className="py-4 px-6">Tier</th>
                <th className="py-4 px-6">Availability</th>
                <th className="py-4 px-6 text-right">Price</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <motion.tbody 
              className="divide-y divide-white/5"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {results.map((r) => {
                const isRegistered = registeredRealms.includes(r.domain);
                
                return (
                <motion.tr 
                  key={r.domain} 
                  variants={item}
                  className={`hover:bg-white/[0.02] transition-colors relative ${isRegistered ? 'bg-[var(--color-brand)]/5' : ''}`}
                >
                  {isRegistered && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-light/20 to-transparent z-0 pointer-events-none"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  )}
                  <td className="py-4 px-6 font-bold text-white relative z-10">{r.domain}</td>
                  <td className="py-4 px-6 text-zinc-400 relative z-10">{r.tier}</td>
                  <td className="py-4 px-6 relative z-10">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      r.available && !isRegistered
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}>
                      {r.available && !isRegistered ? 'AVAILABLE' : 'LOCKED'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-white relative z-10">{r.price}</td>
                  <td className="py-4 px-6 text-right relative z-10">
                    {r.available && !isRegistered ? (
                      <button
                        onClick={() => handleRegisterRealm(r.domain)}
                        className="px-3 py-1.5 rounded-lg bg-brand text-black font-extrabold text-[10px] hover:bg-brand-light transition-all shadow-[0_0_15px_rgba(200,149,42,0.3)] hover:shadow-[0_0_25px_rgba(200,149,42,0.6)]"
                      >
                        Reserve
                      </button>
                    ) : (
                      <span className="text-[var(--color-brand)]/60 font-extrabold tracking-widest text-[10px] uppercase shadow-[var(--color-brand)]">Secured</span>
                    )}
                  </td>
                </motion.tr>
              )})}
            </motion.tbody>
          </table>
        </motion.div>
      )}
      </div>
    </main>
  );
}
