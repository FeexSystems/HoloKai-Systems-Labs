'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Users, BarChart3, ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    id: '1',
    title: 'Oxford University: Digitizing Ancient Manuscripts',
    description: 'How Oxford used HoloKai to digitize and analyze 10,000+ ancient manuscripts',
    product: 'Research Tier',
    outcome: 'Reduced research time by 70%, discovered 3 previously unknown texts',
    metrics: { 'Manuscripts Processed': '10,000+', 'Research Time Saved': '70%', 'New Discoveries': '3' },
    thumbnail: '/images/case-studies/oxford.jpg',
    featured: true,
  },
  {
    id: '2',
    title: 'History Channel: Bringing Ancient Voices to Life',
    description: 'Creating authentic voiceovers for ancient figures in documentary series',
    product: 'Voice Services',
    outcome: '50% increase in viewer engagement, Emmy nomination for sound design',
    metrics: { 'Episodes Produced': '24', 'Viewer Engagement': '+50%', 'Awards': 'Emmy Nomination' },
    thumbnail: '/images/case-studies/history-channel.jpg',
    featured: true,
  },
  {
    id: '3',
    title: 'British Museum: Artifact Reconstruction',
    description: 'Using AI to reconstruct damaged artifacts for exhibition',
    product: 'Vision',
    outcome: '15 artifacts restored, 200,000+ visitors to new exhibition',
    metrics: { 'Artifacts Restored': '15', 'Exhibition Visitors': '200,000+', 'Accuracy Rate': '94%' },
    thumbnail: '/images/case-studies/british-museum.jpg',
    featured: true,
  },
  {
    id: '4',
    title: 'Field Research Institute: Managing Excavation Data',
    description: 'Organizing and searching thousands of excavation documents',
    product: 'Archive',
    outcome: 'Instant document retrieval, improved collaboration across teams',
    metrics: { 'Documents Stored': '5,000+', 'Search Time': '<1s', 'Team Members': '50' },
    thumbnail: '/images/case-studies/field-research.jpg',
    featured: false,
  },
  {
    id: '5',
    title: 'Independent Scholar: Writing Historical Fiction',
    description: 'Using Oracle for fact-checking and historical context',
    product: 'Oracle',
    outcome: 'Published bestselling novel, 98% historical accuracy',
    metrics: { 'Novels Published': '1', 'Sales': '50,000+', 'Accuracy': '98%' },
    thumbnail: '/images/case-studies/independent-scholar.jpg',
    featured: false,
  },
];

export function CaseStudies() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto bg-[#0a0a0f] border-t border-white/5">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Case Studies
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          See how organizations use HoloKai to achieve remarkable results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((study, index) => (
          <motion.article
            key={study.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="h-full p-6 rounded-2xl border border-white/10 bg-[#12121a] hover:border-amber-500/30 transition-all flex flex-col">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 mb-4 flex items-center justify-center">
                <Award className="w-12 h-12 text-amber-400/50" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium mb-3">
                {study.product}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {study.title}
              </h3>

              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{study.description}</p>

              <div className="mb-4">
                <div className="text-xs text-zinc-500 mb-2">Outcome</div>
                <p className="text-sm text-white">{study.outcome}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(study.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold text-amber-400">{value}</div>
                      <div className="text-xs text-zinc-500">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`/research/case-studies/${study.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                Read Full Case Study
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all"
        >
          Share Your Success Story
          <TrendingUp className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
