'use client';

import React from 'react';
import { FeatureSection } from '@holokai/ui';

export function HostingSection() {
  const visual = (
    <div className="w-full max-w-xs mx-auto flex flex-col gap-3">
      {[
        { label: 'Oracle Engine', status: 'ACTIVE', latency: '12ms' },
        { label: 'Archive CDN', status: 'ACTIVE', latency: '4ms' },
        { label: 'Vanguard AI', status: 'STANDBY', latency: '28ms' },
        { label: 'Memory Graph', status: 'ACTIVE', latency: '7ms' },
      ].map((service) => (
        <div
          key={service.label}
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-[#0a0a14] font-mono"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`size-2 rounded-full ${service.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-brand-light'}`}
              aria-hidden="true"
            />
            <span className="text-xs text-zinc-300">{service.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold ${service.status === 'ACTIVE' ? 'text-emerald-400' : 'text-brand-light'}`}>
              {service.status}
            </span>
            <span className="text-[10px] text-zinc-600">{service.latency}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <FeatureSection
      eyebrow="Platform Architecture"
      heading="Edge-native infrastructure built for scale"
      description="Every research query routes through an AI edge layer — geo-aware, latency-optimized, and self-healing. The knowledge graph stays always-on."
      cta={{ label: 'View system status', href: '/system' }}
      visual={visual}
      reverse
      className="bg-[#06060c]"
    />
  );
}
