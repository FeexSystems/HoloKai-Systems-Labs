export type Unit = {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  video?: string;
  specs: string[];
  detail: string;
  culturalResonance: string;
  civilizationalImpact: string;
  humanoidDesign: string;
  fullbodyImage: string;
  modelPath?: string;
  accent?: string;
};

export type VisionPillar = {
  id: string;
  title: string;
  kicker: string;
  body: string;
  metric: string;
  metricLabel: string;
};

export type AnatomySystem = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  specs: readonly string[];
  region: string;
};

export type IntelligenceAgent = {
  id: string;
  title: string;
  role: string;
  body: string;
  capabilities: readonly string[];
};

export type AnatomyStat = {
  label: string;
  value: string;
};

export type IntelligencePipelineStep = {
  step: string;
  title: string;
  body: string;
};
