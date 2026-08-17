/**
 * HoloKai Robotics & Artifact Intelligence Contracts
 */

export interface SpatialPose3D {
  position?: { x: number; y: number; z: number };
  orientation?: { x: number; y: number; z: number; w: number };
  frameId?: string;
  spatialStatus?: 'GROUNDED' | 'UNGROUNDED';
}

export interface ArtifactDetectorInfo {
  name?: string;
  confidence?: number;
  model?: string;
  sensor?: { camera?: string; depth?: string };
}

export interface ArtifactDetectionData {
  label?: string;
  confidence?: number;
  bbox?: { x: number; y: number; width: number; height: number };
}

export interface ArtifactVisualProperties {
  shape?: string;
  material?: string;
  color?: string;
  texture?: string;
  geometry?: string;
  visualDescriptors?: string[];
}

export interface ArtifactIdentityResolution {
  status: 'RESOLVED' | 'AMBIGUOUS' | 'UNRESOLVED';
  entityId?: string | null;
  matchScore?: number;
  conflicts?: Array<{ type: string; details?: string }>;
  scores?: {
    perception?: number;
    vector?: number;
    graph?: number;
    metadata?: number;
    provenance?: number;
  };
  evidence?: Array<{
    candidateId?: string;
    source?: string;
    score?: number;
    status?: string;
  }>;
}

export interface ArtifactProvenanceRecord {
  institution?: string;
  provenance_id?: string;
  provenance_type?: string;
  period?: string;
  dating?: string;
  epistemicStance?: string;
  source?: string;
  academicCitations?: Array<{ authors?: string; title?: string; year?: number; publication?: string }>;
  [key: string]: any;
}

export interface ArtifactIntelligenceObservation {
  observationId: string;
  timestamp: string;
  detector?: ArtifactDetectorInfo;
  detection?: ArtifactDetectionData;
  visualProperties?: ArtifactVisualProperties;
  pose?: SpatialPose3D;
  identity: ArtifactIdentityResolution;
  provenance?: ArtifactProvenanceRecord;
  [key: string]: any;
}
