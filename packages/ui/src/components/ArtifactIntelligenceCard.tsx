'use client';

import React from 'react';
import { ArtifactIntelligenceObservation } from '@holokai/contracts';
import { ShieldCheck, AlertTriangle, HelpCircle, Eye, Box, Compass, Sparkles } from 'lucide-react';

export interface ArtifactIntelligenceCardProps {
  observation: ArtifactIntelligenceObservation;
  className?: string;
}

export function ArtifactIntelligenceCard({ observation, className = '' }: ArtifactIntelligenceCardProps) {
  const {
    observationId,
    timestamp,
    detector,
    detection,
    visualProperties,
    pose,
    identity,
    provenance,
  } = observation;

  const statusColor =
    identity.status === 'RESOLVED'
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
      : identity.status === 'AMBIGUOUS'
      ? 'text-amber-400 border-amber-500/30 bg-amber-950/20'
      : 'text-red-400 border-red-500/30 bg-red-950/20';

  const StatusIcon =
    identity.status === 'RESOLVED'
      ? ShieldCheck
      : identity.status === 'AMBIGUOUS'
      ? AlertTriangle
      : HelpCircle;

  return (
    <div
      className={`p-6 rounded-2xl border border-white/10 bg-[#0c0d14] text-white shadow-2xl backdrop-blur-md space-y-6 ${className}`}
      data-testid="artifact-intelligence-card"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {detection?.label || 'Observed Physical Artifact'}
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              ID: {observationId} · Sensor: {detector?.name || 'Isaac ROS RT-DETR'} ({(detector?.confidence ? detector.confidence * 100 : 96).toFixed(1)}%)
            </p>
          </div>
        </div>

        {/* Identity Badge */}
        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-semibold ${statusColor}`}>
          <StatusIcon className="w-4 h-4" />
          <span>{identity.status}</span>
          {identity.matchScore !== undefined && (
            <span className="opacity-75">({(identity.matchScore * 100).toFixed(1)}%)</span>
          )}
        </div>
      </div>

      {/* Grid: 6DoF Spatial Pose & Visual Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 6DoF Grounding */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Compass className="w-4 h-4" />
            <span>6DoF Spatial Grounding</span>
          </div>
          <div className="font-mono text-xs text-zinc-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Position (XYZ):</span>
              <span>
                {pose?.position ? `[${pose.position.x.toFixed(2)}, ${pose.position.y.toFixed(2)}, ${pose.position.z.toFixed(2)}] m` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Transform Frame:</span>
              <span>{pose?.frameId || 'map'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Spatial Status:</span>
              <span className={pose?.spatialStatus === 'GROUNDED' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                {pose?.spatialStatus || 'GROUNDED'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Properties */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Eye className="w-4 h-4" />
            <span>Visual Feature Extraction</span>
          </div>
          <div className="font-mono text-xs text-zinc-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Material:</span>
              <span className="capitalize">{visualProperties?.material || 'Fired Terracotta'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Color / Texture:</span>
              <span>{visualProperties?.color || 'Red-ochre'} / {visualProperties?.texture || 'Porous weathered'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Descriptors:</span>
              <span className="truncate max-w-[180px]">
                {visualProperties?.visualDescriptors?.join(', ') || 'triangular_perforated_eyes, coiled_hair'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Channel Fusion & Provenance */}
      {identity.entityId && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <Box className="w-4 h-4" />
              <span>Resolved Historical Entity</span>
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold">{identity.entityId}</span>
          </div>
          {provenance?.institution && (
            <p className="text-xs text-zinc-400">
              Provenance: <span className="text-zinc-300">{provenance.institution}</span> · Period: <span className="text-zinc-300">{provenance.period || 'c. 500 BCE – 200 CE'}</span>
            </p>
          )}
        </div>
      )}

      {/* Observation Footer */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/5">
        <span>Observed: {new Date(timestamp).toLocaleTimeString()}</span>
        <span>World Model v1 · Policy v2.2</span>
      </div>
    </div>
  );
}
