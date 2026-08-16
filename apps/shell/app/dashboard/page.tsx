import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your HoloKai learning and exploration hub.',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <header className="border-b border-white/10 pb-6">
          <h1 className="text-4xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            Welcome Explorer
          </h1>
          <p className="text-zinc-400 font-inter mt-2">
            Your personal archive of discovered knowledge, saved artifacts, and learning progress.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <h2 className="text-xl font-cinzel font-semibold text-zinc-200 mb-4">Recent Discoveries</h2>
              <div className="h-48 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-500">
                Integration pending: Epistemic Matrix Sync
              </div>
            </section>
            
            <section className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <h2 className="text-xl font-cinzel font-semibold text-zinc-200 mb-4">Saved Artifacts</h2>
              <div className="h-48 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-500">
                Integration pending: 3D Artifact Collection
              </div>
            </section>
          </div>
          
          <div className="space-y-6">
            <section className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <h2 className="text-xl font-cinzel font-semibold text-zinc-200 mb-4">Your Profile</h2>
              <div className="h-48 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-500">
                Integration pending: Clerk User Profile Details
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
