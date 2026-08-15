import React from 'react';
import { HK_CONFIDENCE } from '@/lib/tokens';

export default function ConfidenceIndicator({ score = 0.90, showDetails = true, className = '' }) {
  let category = HK_CONFIDENCE.veryStrong;
  if (score >= 0.90) category = HK_CONFIDENCE.veryStrong;
  else if (score >= 0.75) category = HK_CONFIDENCE.strong;
  else if (score >= 0.60) category = HK_CONFIDENCE.moderate;
  else if (score >= 0.40) category = HK_CONFIDENCE.uncertain;
  else if (score >= 0.20) category = HK_CONFIDENCE.weak;
  else category = HK_CONFIDENCE.speculative;

  const percentage = Math.round(score * 100);

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      title={`Confidence score ${score.toFixed(2)} (${category.label}). Internal evidence-rating heuristic based on primary sources & computational verification.`}
    >
      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: category.color,
          }}
        />
      </div>
      {showDetails && (
        <span
          className="text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border"
          style={{
            color: category.color,
            backgroundColor: category.bg,
            borderColor: category.border,
          }}
        >
          {percentage}% {category.label}
        </span>
      )}
    </div>
  );
}
