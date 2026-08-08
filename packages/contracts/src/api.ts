/**
 * HoloKai Shared Platform API Contracts & Schemas
 */

export type EpistemicStance =
  | 'ESTABLISHED'
  | 'SCHOLARLY_DEBATE'
  | 'TRADITION'
  | 'ESOTERIC'
  | 'SPECULATIVE'
  | 'FICTIONAL';

export interface EvidenceSpan {
  id: string;
  sourceTitle: string;
  author?: string;
  year?: number;
  textSnippet: string;
  pageOrFolio?: string;
  epistemicStance: EpistemicStance;
  confidenceScore: number; // 0.0 - 1.0
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
