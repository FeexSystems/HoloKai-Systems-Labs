export interface Unit {
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

export const units: Unit[] = [
  {
    id: "oluwa-core",
    name: "OLUWA-CORE",
    title: "Supreme Synthesis Vessel",
    subtitle: "Yoruba High Consciousness Vector",
    accent: "#f59e0b",
    secondaryAccent: "#d97706",
    origin: "Ife / Oyo Empire Epistemic Vaults",
    description: "Primary synthesis vessel channeling high-dimensional consensus across divine mathematical order and oral lineage vectors.",
    modelUrl: "/models/scene.splinecode",
    image: "/images/vanguard/oluwa-core.png",
    fullBodyImage: "/images/vanguard/oluwa-core-fullbody.png",
    capabilities: ["Ifa Binary Knowledge Synthesis", "Multi-Dimensional Vector Alignment", "Supreme Ethical Governance"],
    stats: { "Resilience": 99, "Cognition": 98, "Harmony": 97 }
  },
  {
    id: "naja-7",
    name: "NAJA-7",
    title: "Tactical Recon Guardian",
    subtitle: "Nubian Archival Vanguard",
    accent: "#3b82f6",
    secondaryAccent: "#1d4ed8",
    origin: "Kerma / Meroë Archival Core",
    description: "Fast tactical reconnaissance unit executing deep structural retrieval across Nile Valley civilizational strata.",
    modelUrl: "/models/scene.splinecode",
    image: "/images/vanguard/naja-7.png",
    fullBodyImage: "/images/vanguard/naja-7-fullbody.png",
    capabilities: ["Red Sea Latency Routing", "Meroitic Script Decipherment", "High-Velocity Spatial Traversal"],
    stats: { "Velocity": 97, "Accuracy": 96, "Stealth": 94 }
  }
];
