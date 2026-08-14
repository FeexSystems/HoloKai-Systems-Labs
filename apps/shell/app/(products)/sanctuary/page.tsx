'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: string[];
  popular?: boolean;
}

export default function SanctuaryPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetch('/api/bff/commerce/subscriptions')
      .then((res) => {
        if (!res.ok) throw new Error('BFF Offline');
        return res.json();
      })
      .then((data) => {
        setSubscriptions(data);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback in case BFF server is still starting up
        setSubscriptions([
          {
            id: 'sub_1',
            name: 'Initiate Access',
            description: 'Basic entry into the Planetary UI matrix. Includes standard data feeds and limited AI consultations.',
            price: 9.99,
            billingPeriod: 'monthly',
            features: ['Standard Data Feeds', '3 AI Consults/month', 'Community Access'],
            popular: false,
          },
          {
            id: 'sub_2',
            name: 'Vanguard Elite',
            description: 'Unrestricted access to the HoloKai Oracle, unlimited real-time telemetry, and priority edge computing resources.',
            price: 49.99,
            billingPeriod: 'monthly',
            features: ['Unlimited AI Oracle', 'Real-time Edge Telemetry', 'Priority Bandwidth', 'Exclusive Artifact Drops'],
            popular: true,
          },
          {
            id: 'sub_3',
            name: 'Civilization Architect',
            description: 'Enterprise-grade access for building sub-realms within the HoloKai network. Includes dedicated quantum processing.',
            price: 499.00,
            billingPeriod: 'yearly',
            features: ['Sub-realm Creation', 'Dedicated Quantum Core', 'White-label API', 'Direct Council Support'],
            popular: false,
          },
        ]);
        setIsLoading(false);
      });
  }, []);

  const handleSelectSubscription = (subName: string) => {
    setToastMessage(`✓ Sanctuary Request Initiated: ${subName}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <main className="max-w-7xl mx-auto space-y-10 p-6 md:p-12 min-h-screen bg-[#05050a] text-white">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-brand text-black font-mono text-xs font-extrabold shadow-2xl border border-brand-light"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-brand/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-brand uppercase font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-light animate-pulse" />
            Planetary Sanctuary & Node Hosting
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Sanctuary Hosting Plans</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            Deploy secure, edge-native, decentralized environments to shield historical and computational artifacts.
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl border p-8 space-y-6 flex flex-col justify-between relative bg-gradient-to-b from-[#12121a] to-[#0a0a0f] ${
                sub.popular ? 'border-brand shadow-xl shadow-brand/10' : 'border-white/10'
              }`}
            >
              {sub.popular && (
                <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-brand text-black text-[9px] font-mono font-black uppercase">
                  RECOMMENDED
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 font-light min-h-[32px]">{sub.description}</p>
                </div>

                <div className="text-3xl font-extrabold text-brand-light">
                  ${sub.price}
                  <span className="text-xs text-zinc-500 font-mono font-normal"> / {sub.billingPeriod}</span>
                </div>

                <ul className="space-y-2 border-t border-white/5 pt-4 text-xs font-mono text-zinc-300">
                  {sub.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectSubscription(sub.name)}
                className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all mt-4 ${
                  sub.popular ? 'bg-brand text-black hover:bg-brand-light shadow-md' : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                Deploy Sanctuary
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
