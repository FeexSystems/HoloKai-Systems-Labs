/**
 * HoloKai Shared Platform API Contracts & Schemas
 */
export type EpistemicStance = 'ESTABLISHED' | 'SCHOLARLY_DEBATE' | 'TRADITION' | 'ESOTERIC' | 'SPECULATIVE' | 'FICTIONAL';
export interface EvidenceSpan {
    id: string;
    sourceTitle: string;
    author?: string;
    year?: number;
    textSnippet: string;
    pageOrFolio?: string;
    epistemicStance: EpistemicStance;
    confidenceScore: number;
}
export interface OracleQueryRequest {
    prompt: string;
    civilizationFocus?: string;
    eraFocus?: string;
    enableSearch?: boolean;
    enableMaps?: boolean;
    thinkingLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}
export interface OracleQueryResponse {
    queryId: string;
    text: string;
    epistemicStance: EpistemicStance;
    confidenceScore: number;
    evidence: EvidenceSpan[];
    citations: string[];
    groundingMetadata?: Record<string, unknown>;
    modelUsed: string;
}
export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    role: 'ADMIN' | 'RESEARCHER' | 'GUARDIAN' | 'VISITOR';
    betaAccess: boolean;
    createdAt: string;
}
export interface VanguardUnit {
    id: string;
    name: string;
    title: string;
    subtitle: string;
    accent: string;
    secondaryAccent: string;
    origin: string;
    description: string;
    modelUrl: string;
    image: string;
    fullBodyImage: string;
    capabilities: string[];
    stats: Record<string, number>;
}
export interface CivilizationEntry {
    id: string;
    name: string;
    region: string;
    era: string;
    centuryRange: string;
    description: string;
    achievements: string[];
    keyFigures: string[];
    vectorDistance?: number;
}
export interface DrizzleUser {
    id: number;
    uid: string;
    email: string;
    createdAt: Date | null;
}
export interface DrizzleEntry {
    id: number;
    userId: number;
    content: string;
    date: string;
    createdAt: Date | null;
}
export interface GenkitSynthesisResult {
    answer: string;
    epistemicClassification: EpistemicStance;
    confidence: number;
}
//# sourceMappingURL=api.d.ts.map