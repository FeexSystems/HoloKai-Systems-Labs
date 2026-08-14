/**
 * HoloKai Unified Design System Tokens
 * Source of Truth for Visual Design Taxonomy, Spatial Computing, and Epistemic Stances.
 */
export declare const COLOR_TOKENS: {
    readonly bgAbyss: "#05050a";
    readonly bgObsidian: "#0a0a0a";
    readonly bgPanel: "#12121a";
    readonly bgElevated: "#1a1a26";
    readonly bgCard: "#1f1f2e";
    readonly bgHeader: "#090a0f";
    readonly oracleGold: "#c8952a";
    readonly oracleGoldLight: "#e8b84b";
    readonly oracleGoldBright: "#ffd27a";
    readonly heritageOrange: "#ff9100";
    readonly heritageRed: "#dd2c00";
    readonly heritageYellow: "#ffc400";
    readonly heritageTerracotta: "#d97706";
    readonly heritageBronze: "#b45309";
    readonly heritageOchre: "#78350f";
    readonly success: "#10b981";
    readonly warning: "#f59e0b";
    readonly error: "#ef4444";
    readonly info: "#3b82f6";
    readonly textPrimary: "#ffffff";
    readonly textSecondary: "rgba(255, 255, 255, 0.75)";
    readonly textMuted: "rgba(255, 255, 255, 0.45)";
    readonly textDisabled: "rgba(255, 255, 255, 0.25)";
};
export declare const GRADIENT_TOKENS: {
    readonly oracleGold: "linear-gradient(135deg, #ffc400 0%, #ff9100 50%, #dd2c00 100%)";
    readonly heritageSun: "linear-gradient(135deg, #e8b84b 0%, #c8952a 100%)";
    readonly obsidianGlass: "linear-gradient(180deg, rgba(26, 26, 38, 0.9) 0%, rgba(10, 10, 14, 0.95) 100%)";
    readonly glowRadial: "radial-gradient(circle, rgba(200, 149, 42, 0.18) 0%, transparent 70%)";
};
export interface EpistemicDefinition {
    label: string;
    color: string;
    bg: string;
    border: string;
    description: string;
}
export declare const EPISTEMIC_STANCE_TOKENS: Record<string, EpistemicDefinition>;
export declare const GLASS_TOKENS: {
    readonly panel: {
        readonly background: "rgba(10, 10, 14, 0.88)";
        readonly backdropFilter: "blur(16px)";
        readonly border: "1px solid rgba(200, 149, 42, 0.12)";
        readonly boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)";
    };
    readonly cardHover: {
        readonly borderColor: "rgba(200, 149, 42, 0.35)";
        readonly boxShadow: "0 10px 30px -10px rgba(200, 149, 42, 0.15)";
    };
};
export declare const MOTION_TOKENS: {
    readonly durationFast: "150ms";
    readonly durationNormal: "300ms";
    readonly durationSlow: "600ms";
    readonly easeSpring: "cubic-bezier(0.16, 1, 0.3, 1)";
};
//# sourceMappingURL=tokens.d.ts.map