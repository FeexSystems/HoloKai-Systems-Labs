'use client';

import { useEffect, useState } from 'react';

type WorldState = {
  schemaVersion?: string;
  observedAt?: string;
  frame?: string;
  entityCount?: number;
  robot?: {
    frame?: string;
    pose?: {
      position?: { x?: number; y?: number; z?: number };
      orientation?: { x?: number; y?: number; z?: number; w?: number };
    } | null;
  };
  entities?: Array<{
    entityId?: string;
    semanticType?: string;
    civilization?: string;
    epistemicStance?: string;
    confidence?: number;
    lastObservedAt?: string;
  }>;
};

export interface HoloKaiWorldStatePanelProps {
  endpoint?: string;
  refreshMs?: number;
}

export function HoloKaiWorldStatePanel({
  endpoint = '/api/robotics/world',
  refreshMs = 500,
}: HoloKaiWorldStatePanelProps) {
  const [state, setState] = useState<WorldState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetch(endpoint, { cache: 'no-store' });
        if (!response.ok) throw new Error(`World gateway returned ${response.status}`);
        const next = (await response.json()) as WorldState;
        if (!cancelled) {
          setState(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'World state unavailable');
      }
    };

    poll();
    const timer = window.setInterval(poll, refreshMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [endpoint, refreshMs]);

  const position = state?.robot?.pose?.position;

  return (
    <section aria-label="HoloKai live world state" data-testid="holokai-world-state">
      <header>
        <div>
          <strong>HoloKai World Model</strong>
          <span>{state ? 'LIVE' : 'CONNECTING'}</span>
        </div>
        <small>{state?.observedAt ?? 'Waiting for ROS 2 world state…'}</small>
      </header>

      {error ? <p role="status">{error}</p> : null}

      <dl>
        <div><dt>Frame</dt><dd>{state?.frame ?? '—'}</dd></div>
        <div><dt>Entities</dt><dd>{state?.entityCount ?? 0}</dd></div>
        <div><dt>Robot X</dt><dd>{position?.x?.toFixed(3) ?? '—'}</dd></div>
        <div><dt>Robot Y</dt><dd>{position?.y?.toFixed(3) ?? '—'}</dd></div>
        <div><dt>Robot Z</dt><dd>{position?.z?.toFixed(3) ?? '—'}</dd></div>
      </dl>

      <ul>
        {(state?.entities ?? []).slice(0, 12).map((entity) => (
          <li key={entity.entityId}>
            <span>{entity.entityId}</span>
            <small>{entity.semanticType ?? 'entity'} · {entity.epistemicStance ?? 'UNCLASSIFIED'}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
