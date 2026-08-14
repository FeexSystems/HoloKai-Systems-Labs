'use client';

import React, { useEffect, useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';

export type LoginStatus = 'Anonymous' | 'HalfLogin' | 'FullLogin';

export interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SCHOLAR_ROLES = [
  'Senior Epigrapher & Archaeoastronomer',
  'Timbuktu Manuscript Scholar',
  'Great Zimbabwe Architectural Surveyor',
  'Ifá Binary Algorithm Researcher',
  'Metallurgy Guild Historian',
  'Student Scholar & Researcher',
];

export function AccountModal({ isOpen, onClose, className = '' }: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'register'>('profile');
  const { user, isLoaded, isSignedIn } = useUser();
  const [role, setRole] = useState(SCHOLAR_ROLES[0]);
  const [organization, setOrganization] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('holokai_scholar_role');
      const savedOrg = localStorage.getItem('holokai_scholar_org');
      if (savedRole) setRole(savedRole);
      if (savedOrg) setOrganization(savedOrg);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('holokai_scholar_role', role);
      localStorage.setItem('holokai_scholar_org', organization);
    }
    setSuccessMsg('✓ Account settings updated.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl rounded-[32px] border border-[var(--color-border)] bg-gradient-to-b from-[#12121e] via-[#0a0a0f] to-[#05050a]	p-6 sm:p-8 text-white shadow-2xl space-y-6 ${className}`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-contrast)] p-0.5 shadow-lg shadow-glow-brand">
              <div className="w-full h-full bg-[#05050a] rounded-[10px] flex items-center justify-center font-bold text-[var(--color-brand)] font-mono text-sm">
                HK
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">HoloKai Account & Auth Setup</h2>
              <span className="text-xs font-mono text-[var(--color-brand)] font-bold uppercase tracking-wider block">
                {isSignedIn ? 'AUTHENTICATED SCHOLAR' : 'CLERK AUTH ACTIVE'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Account Modal"
            className="size-9 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white font-mono text-sm flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold text-center animate-in fade-in">
            {successMsg}
          </div>
        )}

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'profile' ? 'bg-[var(--color-brand)] text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Scholar Profile
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'login' ? 'bg-[var(--color-brand)] text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Account Setup
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'register' ? 'bg-[var(--color-brand)] text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Access Tiers
          </button>
        </div>

        {/* TAB 1: SCHOLAR PROFILE & CURRENT STATUS */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            {isSignedIn && user ? (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Active Scholar</span>
                    <h3 className="text-xl font-bold text-white">{user.fullName || user.username || 'Scholar'}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold">
                    ✓ SIGNED IN
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">EMAIL ADDRESS</span>
                    <span className="text-[var(--color-brand)] font-bold">{user.primaryEmailAddress?.emailAddress}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">SCHOLAR ROLE</span>
                    <span className="text-white font-bold">{role}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-500 block text-[10px]">ORGANIZATION</span>
                    <span className="text-zinc-300 font-bold">{organization || 'HoloKai Research Network'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                <span className="text-4xl block">🔑</span>
                <h3 className="text-lg font-bold text-white">Clerk Identity Unified</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-light">
                  Use the header authentication controls to sign in or register your HoloKai Scholar identity via Clerk.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACCOUNT SETUP FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleSaveSetup} className="space-y-4">
            {!isSignedIn && (
              <div className="p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] mb-4">
                <p className="text-[var(--color-brand)] text-xs mb-3 font-bold">You are not signed in. Sign in to link these preferences to your account.</p>
                <div className="flex justify-center">
                  <SignInButton mode="modal">
                    <button type="button" className="px-4 py-2 bg-[var(--color-brand)] text-black text-xs font-bold rounded-xl hover:brightness-110 transition-colors">
                      Sign in with Clerk
                    </button>
                  </SignInButton>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="scholar-role-select" className="block text-xs font-mono font-bold text-[var(--color-brand)] uppercase mb-1">
                Scholar Research Role *
              </label>
              <select
                id="scholar-role-select"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white text-xs outline-none focus:border-[var(--color-brand)]"
              >
                {SCHOLAR_ROLES.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="scholar-org-input" className="block text-xs font-mono font-bold text-[var(--color-brand)] uppercase mb-1">
                Institution / Organization
              </label>
              <input
                id="scholar-org-input"
                name="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="HoloKai Pan-African Research Council"
                autoComplete="organization"
                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs outline-none focus:border-[var(--color-brand)]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-contrast)] text-black font-extrabold text-xs hover:brightness-110 shadow-lg shadow-glow-brand transition-all pt-1"
            >
              Save Profile Preferences →
            </button>
          </form>
        )}

        {/* TAB 3: ACCESS TIERS MATRIX */}
        {activeTab === 'register' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] space-y-2">
              <span className="text-[var(--color-brand)] font-bold uppercase text-[10px] block">TIER 1 · FULL SCHOLAR ACCESS</span>
              <p className="text-zinc-300 font-sans text-xs">
                Full access to Oracle AI Reasoning Chamber, 16-Volume African Codex, System Telemetry, and Vanguard Guardian controls.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-zinc-400 font-bold uppercase text-[10px] block">TIER 2 · GUEST SCHOLAR ACCESS</span>
              <p className="text-zinc-400 font-sans text-xs">
                Read-only access to digitized civilization dossiers and epigraphic search indices.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
