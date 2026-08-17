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

export type EmbodiedIntent =
  | 'observe'
  | 'inspect'
  | 'navigate'
  | 'approach'
  | 'pick'
  | 'place'
  | 'follow'
  | 'return_home'
  | 'stop';

export interface EmbodiedPose {
  x: number;
  y: number;
  z: number;
  qx?: number;
  qy?: number;
  qz?: number;
  qw?: number;
}

export interface EmbodiedActionConstraints {
  maxLinearVelocity: number;
  maxAngularVelocity: number;
  humanProximityMeters: number;
  allowManipulation: boolean;
  allowedWorkspace?: string;
}

export interface EmbodiedProvenance {
  source: string;
  epistemicStance: EpistemicStance;
  confidence: number;
  evidenceIds: string[];
}

export interface EmbodiedAction {
  taskId: string;
  intent: EmbodiedIntent;
  createdAt: string;
  target: {
    entityId: string;
    semanticType: string;
    locationFrame?: string;
    pose?: EmbodiedPose;
  };
  constraints: EmbodiedActionConstraints;
  requiredCapabilities: string[];
  provenance: EmbodiedProvenance;
  metadata?: Record<string, unknown>;
}

export interface RobotState {
  robotId: string;
  mode: 'disabled' | 'simulation' | 'isaac' | 'physical';
  connected: boolean;
  safetyState: 'unknown' | 'safe' | 'blocked' | 'estop';
  batteryPercent?: number;
  currentTaskId?: string;
  pose?: EmbodiedPose;
  capabilities: string[];
  updatedAt: string;
}

export interface WorldObservation {
  observedAt: string;
  source: 'ros2' | 'isaac_sim' | 'physical_robot';
  frame: string;
  entities: Array<{
    entityId: string;
    semanticType: string;
    confidence: number;
    pose?: EmbodiedPose;
  }>;
  robot?: RobotState;
  sensorMetadata?: Record<string, unknown>;
  provenance?: EmbodiedProvenance;
}
