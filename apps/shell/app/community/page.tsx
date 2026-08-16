import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Connect with fellow explorers and contribute to the Alkebulan Archive.',
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <header className="border-b border-white/10 pb-6 text-center md:text-left">
          <h1 className="text-4xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            HoloKai Vanguard Community
          </h1>
          <p className="text-zinc-400 font-inter mt-2 max-w-2xl">
            Join researchers, historians, and technologists in preserving and exploring African civilizations. Share insights, collaborate on artifacts, and expand the matrix.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <section className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-colors cursor-pointer group">
            <h2 className="text-xl font-cinzel font-semibold text-amber-400 mb-2 group-hover:text-amber-300">Forums & Discussions</h2>
            <p className="text-zinc-400 text-sm mb-4">Engage in deep conversations about specific eras, artifacts, and historical narratives.</p>
            <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-500 bg-black/20">
              Coming Soon
            </div>
          </section>
          
          <section className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-colors cursor-pointer group">
            <h2 className="text-xl font-cinzel font-semibold text-amber-400 mb-2 group-hover:text-amber-300">Contribute Artifacts</h2>
            <p className="text-zinc-400 text-sm mb-4">Help grow the archive by submitting 3D models, historical accounts, or glossary terms.</p>
            <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-500 bg-black/20">
              Coming Soon
            </div>
          </section>
          
          <section className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-colors cursor-pointer group">
            <h2 className="text-xl font-cinzel font-semibold text-amber-400 mb-2 group-hover:text-amber-300">Live Events</h2>
            <p className="text-zinc-400 text-sm mb-4">Participate in virtual tours of the Epistemic Matrix and live Q&A sessions with historians.</p>
            <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-500 bg-black/20">
              Coming Soon
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
