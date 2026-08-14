'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mic, Eye, Sparkles, Archive, Zap, Shield, Globe } from 'lucide-react';

const propositions = [
  {
    icon: 'BookOpen',
    title: 'Deep Historical Knowledge',
    description: 'Access comprehensive knowledge base with ancient texts, historical analysis, and research tools spanning millennia of human civilization.',
    product: 'Research Tier',
    color: 'amber',
  },
  {
    icon: 'Mic',
    title: 'Ancient Voice Synthesis',
    description: 'Bring history to life with AI-powered voice synthesis in ancient languages including Latin, Sanskrit, Ancient Egyptian, and more.',
    product: 'Voice Services',
    color: 'blue',
  },
  {
    icon: 'Eye',
    title: 'Artifact Generation',
    description: 'Generate and analyze ancient artifacts, manuscripts, and historical imagery with cutting-edge AI vision technology.',
    product: 'Vision',
    color: 'purple',
  },
  {
    icon: 'Sparkles',
    title: 'Intelligent Oracle',
    description: 'Your AI-powered historical assistant with multi-step reasoning, context-aware responses, and natural conversation flow.',
    product: 'Oracle',
    color: 'emerald',
  },
  {
    icon: 'Archive',
    title: 'Secure Document Archive',
    description: 'Organize and preserve your research with version control, semantic search, and tier-based access control.',
    product: 'Archive',
    color: 'rose',
  },
  {
    icon: 'Zap',
    title: 'Lightning Fast Responses',
    description: 'Get instant answers to historical queries with sub-second response times and streaming AI responses.',
    product: 'All Products',
    color: 'yellow',
  },
  {
    icon: 'Shield',
    title: 'Enterprise Security',
    description: 'Bank-grade security with encryption, access controls, and compliance with data protection regulations.',
    product: 'Enterprise',
    color: 'cyan',
  },
  {
    icon: 'Globe',
    title: 'Global Collaboration',
    description: 'Work together with teams worldwide using shared workspaces, real-time collaboration, and multi-language support.',
    product: 'Enterprise',
    color: 'indigo',
  },
];

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Mic,
  Eye,
  Sparkles,
  Archive,
  Zap,
  Shield,
  Globe,
};

const colorMap: Record<string, string> = {
  amber: 'from-amber-500/10 to-amber-600/10 border-amber-500/30 text-amber-400',
  blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400',
  purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/30 text-purple-400',
  emerald: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  rose: 'from-rose-500/10 to-rose-600/10 border-rose-500/30 text-rose-400',
  yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
  cyan: 'from-cyan-500/10 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
  indigo: 'from-indigo-500/10 to-indigo-600/10 border-indigo-500/30 text-indigo-400',
};

export function ValuePropositions() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Why Choose HoloKai?
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Powerful features designed for researchers, historians, and content creators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {propositions.map((prop, index) => {
          const Icon = iconMap[prop.icon] || BookOpen;
          const colors = colorMap[prop.color] || colorMap.amber;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div
                className={`p-6 rounded-2xl border bg-gradient-to-br ${colors} transition-all duration-300 hover:scale-105`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{prop.title}</h3>
                <p className="text-sm text-zinc-300 mb-4 line-clamp-3">{prop.description}</p>
                <span className="text-xs font-medium opacity-75">{prop.product}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
