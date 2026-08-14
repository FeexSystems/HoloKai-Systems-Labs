import { EpistemicStance } from '@holokai/contracts';
import { EPISTEMIC_STANCE_TOKENS } from '@holokai/design-system';

export interface GeneratedUIComponentSpec {
  componentType: 'card' | 'banner' | 'matrix' | 'timelineNode';
  title: string;
  body: string;
  badgeLabel: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  containerClasses: string;
}

/**
 * AI-Generated UI Composition Engine
 * Generates dynamic component specifications at runtime matching epistemic stances and design tokens.
 */
export class AIUIComposer {
  public composeForStance(stance: EpistemicStance, text: string, title?: string): GeneratedUIComponentSpec {
    const token = EPISTEMIC_STANCE_TOKENS[stance] || EPISTEMIC_STANCE_TOKENS.ESTABLISHED;

    let containerClasses = 'rounded-2xl border p-6 space-y-3 backdrop-blur-md transition-all duration-300 ';
    if (stance === 'ESTABLISHED') {
      containerClasses += 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/5';
    } else if (stance === 'SCHOLARLY_DEBATE') {
      containerClasses += 'bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50 shadow-lg shadow-blue-500/5';
    } else if (stance === 'TRADITION') {
      containerClasses += 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50 shadow-lg shadow-amber-500/5';
    } else {
      containerClasses += 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50 shadow-lg shadow-purple-500/5';
    }

    return {
      componentType: 'card',
      title: title || `${token.label} RESEARCH NODE`,
      body: text,
      badgeLabel: token.label,
      badgeColor: token.color,
      badgeBg: token.bg,
      badgeBorder: token.border,
      containerClasses,
    };
  }
}

export const aiUIComposer = new AIUIComposer();
