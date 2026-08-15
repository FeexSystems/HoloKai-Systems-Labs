import React, { useState } from 'react';
import { BookOpen, ExternalLink, FileText, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ClaimCitations
 * Renders citation cards, epistemic classifications, and primary manuscript references.
 */
export default function ClaimCitations({ citations = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const sampleCitations = citations.length > 0 ? citations : [
    {
      id: "cit-1",
      title: "Mathematical Foundations of Akan Textile Patterns",
      author: "Dr. K. Addo",
      year: "2018",
      publisher: "African Journal of Ethnomathematics",
      url: "https://example.org/akan-math",
      confidence: "High (0.95)",
      type: "Peer-Reviewed Journal",
      quote: "The geometric recurrences in Adinkra printing exhibit formal fractal dimension properties prior to European mathematical formulation."
    },
    {
      id: "cit-2",
      title: "Chronicles of Timbuktu Manuscripts (Vol. IV)",
      author: "Ahmed Baba Institute",
      year: "1592",
      publisher: "Timbuktu Archives",
      confidence: "Verified Historical Document",
      type: "Primary Manuscript",
      quote: "Calculations of planetary positions observed from Sankore University observatory."
    }
  ];

  return (
    <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
      <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-amber-400" />
        Primary Sources & Evidence Provenance ({sampleCitations.length})
      </h4>

      <div className="space-y-2">
        {sampleCitations.map(cit => {
          const isExpanded = expandedId === cit.id;
          return (
            <div key={cit.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/30 transition">
              <div 
                onClick={() => setExpandedId(isExpanded ? null : cit.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <h5 className="text-xs font-medium text-slate-200">{cit.title}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {cit.author} ({cit.year}) — {cit.publisher}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {cit.type}
                  </span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-2 animate-fade-in font-mono">
                  <div className="p-2 rounded bg-amber-950/20 border border-amber-500/20 italic text-amber-200 text-[11px]">
                    "{cit.quote}"
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Confidence Score: <strong className="text-emerald-400">{cit.confidence}</strong></span>
                    {cit.url && (
                      <a 
                        href={cit.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-amber-400 hover:underline"
                      >
                        View Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
