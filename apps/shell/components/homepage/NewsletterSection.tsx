'use client';

import React, { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    // Simulate async subscription
    await new Promise((r) => setTimeout(r, 800));
    setStatus('done');
  };

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#07070d] to-[#05050a]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">

        <div className="relative overflow-hidden rounded-[40px] border border-brand/25 bg-gradient-to-br from-[#181826] via-[#0e0e16] to-[#06060c] p-10 md:p-16 text-center">

          {/* Ambient radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(200,149,42,0.10) 0%, transparent 60%)',
            }}
          />

          <div className="relative z-10">
            <span className="text-[10px] font-mono text-brand-light uppercase tracking-[0.2em] block mb-4">
              Stay Connected
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Get research updates
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
              New civilizations added, Oracle upgrades, and archive expansions — direct to your inbox.
              No spam, unsubscribe anytime.
            </p>

            {status === 'done' ? (
              <div className="flex items-center justify-center gap-3 text-emerald-400 font-semibold">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 10l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>You're subscribed! Welcome to the knowledge network.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                aria-label="Newsletter subscription form"
              >
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 h-12 rounded-full bg-[#12121a] border border-brand/25 px-5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/60 transition-all"
                  aria-required="true"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  data-track-el="newsletter-subscribe"
                  data-track-ec="newsletter"
                  data-track-ea="submit"
                  className="h-12 rounded-full px-6 text-sm font-extrabold text-black bg-gradient-to-r from-brand to-brand-dark hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg shadow-brand/25 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
