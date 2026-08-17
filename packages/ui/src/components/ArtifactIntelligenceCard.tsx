'use client';

import React from 'react';
import { Database, Eye, Compass, BookOpen, ShieldCheck, AlertTriangle, Layers, MapPin } from 'lucide-react';
import { EpistemicStance, ArtifactIntelligenceObservation } from '@holokai/contracts';
import { StanceBadge } from './StanceBadge';
import { Badge } from './Badge';

export interface ArtifactIntelligenceCardProps {
  observation?: ArtifactIntelligenceObservation;
  className?: string;
}

export function ArtifactIntelligenceCard({
  observation,
  className = '',
}: ArtifactIntelligenceCardProps) {
  if (!observation) {
    return (
      <div className={`p-6 rounded-3xl border border-white/10 bg-[#0a0a0f]/90 text-zinc-400 text-center ${className}`}>
        <p className="font-mono text-sm">No active physical artifact observation loaded.</p>
      </div>
    );
  }

  const { perception, identity, evidence = [], scores = {}, provenance, epistemic } = observation;

  const statusVariant =
    identity.status === 'RESOLVED'
      ? 'success'
      : identity.status === 'AMBIGUOUS'
      ? 'warning'
      : 'default';

  const vectorScore = scores.vector ?? 0.0;
  const graphScore = scores.graph ?? 0.0;
  const metadataScore = scores.metadata ?? 0.0;
  const provenanceScore = scores.provenance ?? 0.0;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-amber-500/20 bg-[#0d0d14]/95 p-6 md:p-8 text-zinc-100 backdrop-blur-2xl shadow-2xl space-y-6 ${className}`}
    >
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 blur-[90px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Database className="w-3.5 h-3.5" />
            <span>Artifact Intelligence v2.2</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-orange-400">
            {identity.name || 'Unresolved Physical Entity'}
          </h2>
          {identity.civilization && (
            <p className="text-sm font-sans text-zinc-400">
              Civilization: <span className="text-amber-200 font-semibold">{identity.civilization}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant={statusVariant} size="md">
            {identity.status}
          </Badge>
          <div className="text-right font-mono text-xs text-zinc-400">
            Match: <span className="font-bold text-amber-400">{(identity.matchScore * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Primary Perception & 6DoF Grounding Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detection Panel */}
        <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Eye className="w-4 h-4" /> Perception
            </span>
            <span>{perception.detector || 'RT-DETR'}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Detector Confidence:</span>
              <span className="font-bold text-zinc-200">{(perception.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, perception.confidence * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Spatial Pose Panel */}
        <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Compass className="w-4 h-4" /> 6DoF Spatial Pose
            </span>
            <span className={perception.spatialStatus === 'GROUNDED' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {perception.spatialStatus}
            </span>
          </div>
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-zinc-500" /> Frame ID:</span>
            <span className="text-zinc-200 font-bold">{perception.frameId || 'map'}</span>
          </div>
        </div>
      </div>

      {/* 4-Channel Multimodal Evidence Fusion Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Multi-Channel Evidence Fusion
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">Weight: 0.35 Vec | 0.25 Grp | 0.25 Meta | 0.15 Prov</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {/* Vector Channel */}
          <div className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase">PGVector</span>
            <span className="text-lg font-extrabold text-blue-400">
              {(vectorScore * 100).toFixed(0)}%
            </span>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-blue-400 h-full" style={{ width: `${vectorScore * 100}%` }} />
            </div>
          </div>

          {/* Graph Channel */}
          <div className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase">Neo4j Graph</span>
            <span className="text-lg font-extrabold text-emerald-400">
              {(graphScore * 100).toFixed(0)}%
            </span>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${graphScore * 100}%` }} />
            </div>
          </div>

          {/* Metadata Channel */}
          <div className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase">Metadata Lexical</span>
            <span className="text-lg font-extrabold text-amber-400">
              {(metadataScore * 100).toFixed(0)}%
            </span>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: `${metadataScore * 100}%` }} />
            </div>
          </div>

          {/* Provenance Channel */}
          <div className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-between space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase">Provenance</span>
            <span className="text-lg font-extrabold text-purple-400">
              {(provenanceScore * 100).toFixed(0)}%
            </span>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-purple-400 h-full" style={{ width: `${provenanceScore * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Epistemic Stance & Provenance Footer */}
      <div className="p-4 rounded-2xl border border-white/5 bg-black/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Epistemic Stance</span>
            <StanceBadge stance={epistemic?.stance || 'ESTABLISHED'} />
          </div>
        </div>

        <div className="text-left sm:text-right text-xs font-mono text-zinc-500">
          <div>Resolver: <span className="text-zinc-300">{provenance?.resolver || 'v2.2'}</span></div>
          <div>Observed: <span className="text-zinc-400">{new Date(observation.timestamp).toLocaleTimeString()}</span></div>
        </div>
      </div>
    </div>
  );
}
