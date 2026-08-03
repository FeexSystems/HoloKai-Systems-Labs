import { ChevronDown, ChevronRight, Cpu } from 'lucide-react';
import { useState } from 'react';
import EpistemicBadge from '@/components/oracle/EpistemicBadge';
import ConfidenceIndicator from '@/components/oracle/ConfidenceIndicator';

function StatusBadge({ status }) {
  if (status === 'supported') {
    return <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">supported</span>;
  }
  return <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-200">insufficient</span>;
}

export default function ClaimCitations({ grounded, onOpenCitation }) {
  const [open, setOpen] = useState({});

  const claims = grounded?.claims || [];
  if (!claims.length) return null;

  return (
    <section className="mt-4 space-y-2 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 font-mono">
          Claim-level Citations & Epistemic Matrix
        </h3>
        <span className="text-[10px] font-mono text-amber-400/80">
          Provenance Active
        </span>
      </div>

      {claims.map((claim) => {
        const expanded = Boolean(open[claim.claim_id]);
        const epistemicLevel = claim.epistemic_level || (claim.evidence_status === 'supported' ? 'ESTABLISHED' : 'SCHOLARLY_DEBATE');
        const confidenceScore = claim.confidence_score ?? (claim.evidence_status === 'supported' ? 0.92 : 0.65);

        return (
          <article key={claim.claim_id} className="rounded-xl border border-white/10 bg-zinc-950/80 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen((prev) => ({ ...prev, [claim.claim_id]: !prev[claim.claim_id] }))}
              className="flex w-full items-start justify-between gap-2 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-expanded={expanded}
            >
              <div className="flex-1 space-y-2">
                <p className="text-xs leading-relaxed text-zinc-100 font-medium">{claim.text}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={claim.evidence_status} />
                  <EpistemicBadge level={epistemicLevel} />
                  <ConfidenceIndicator score={confidenceScore} showDetails={false} />
                  {claim.wolfram_verified && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      <Cpu className="w-2.5 h-2.5" /> Wolfram Verified
                    </span>
                  )}
                </div>
              </div>
              {expanded ? <ChevronDown className="mt-0.5 h-4 w-4 text-zinc-400 shrink-0" /> : <ChevronRight className="mt-0.5 h-4 w-4 text-zinc-400 shrink-0" />}
            </button>

            {expanded && (
              <div className="space-y-2 border-t border-white/10 px-3 py-3 bg-zinc-900/50">
                {(claim.citations || []).length === 0 ? (
                  <p className="text-[11px] font-mono text-amber-200/80">No reviewed citation attached to this claim yet.</p>
                ) : (
                  claim.citations.map((citation) => (
                    <button
                      type="button"
                      key={citation.citation_id}
                      onClick={() => onOpenCitation?.(citation)}
                      className="w-full rounded-lg border border-white/10 bg-zinc-950/80 p-2.5 text-left hover:border-amber-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                    >
                      <p className="text-[11px] font-semibold text-zinc-100">{citation.source_title}</p>
                      <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-zinc-300 font-sans">{citation.passage}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-white/5 pt-1">
                        <span>{citation.citation_id} · {citation.evidence_type}</span>
                        <span className="text-amber-400 hover:underline">Inspect Evidence →</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
