export const mockProducts = [
  {
    id: "prod_research",
    name: "Research Tier",
    description: "Advanced AI-powered research capabilities with cross-dimensional knowledge integration. Access historical archives, conduct deep analysis, and generate comprehensive reports.",
    price: 0,
    category: "Research",
    inventory: 999999,
    imageUrl: "/images/products/research-tier.png",
    rating: 4.9,
    isSubscription: false,
    featured: true
  },
  {
    id: "prod_voice",
    name: "Voice Services",
    description: "High-fidelity voice synthesis and transcription services. Convert text to natural speech, transcribe audio with AI accuracy, and enable voice-activated interactions.",
    price: 0,
    category: "Voice",
    inventory: 999999,
    imageUrl: "/images/products/voice-services.png",
    rating: 4.8,
    isSubscription: false,
    featured: true
  },
  {
    id: "prod_vision",
    name: "Vision",
    description: "Computer vision capabilities for image analysis, object detection, and visual understanding. Extract insights from visual data with advanced AI models.",
    price: 0,
    category: "Vision",
    inventory: 999999,
    imageUrl: "/images/products/vision.png",
    rating: 4.7,
    isSubscription: false,
    featured: true
  },
  {
    id: "prod_oracle",
    name: "Oracle",
    description: "The HoloKai Oracle - an AI-powered question-answering system with access to vast knowledge bases. Get accurate, contextual answers to complex queries.",
    price: 0,
    category: "Oracle",
    inventory: 999999,
    imageUrl: "/images/products/oracle.png",
    rating: 5.0,
    isSubscription: false,
    featured: true
  },
  {
    id: "prod_archive",
    name: "Archive",
    description: "Comprehensive digital archive system for storing, organizing, and retrieving historical data. Maintain knowledge across civilizations and eras.",
    price: 0,
    category: "Archive",
    inventory: 999999,
    imageUrl: "/images/products/archive.png",
    rating: 4.9,
    isSubscription: false,
    featured: true
  }
];

export const mockSubscriptions = [
  {
    id: "sub_free",
    name: "Free",
    tier: "free",
    description: "Essential access to HoloKai's core capabilities. Perfect for exploration and basic use cases.",
    price: 0,
    billingPeriod: "monthly",
    features: [
      "Basic Research Access",
      "Limited Voice Synthesis (100 chars/month)",
      "Standard Oracle Queries (50/month)",
      "Community Support",
      "Public Archive Access"
    ],
    popular: false
  },
  {
    id: "sub_pro",
    name: "Pro",
    tier: "pro",
    description: "Enhanced capabilities for power users and professionals. Unlock advanced features and higher limits.",
    price: 29,
    billingPeriod: "monthly",
    features: [
      "Unlimited Research Access",
      "Unlimited Voice Synthesis",
      "Unlimited Oracle Queries",
      "Priority Support",
      "Private Archive Storage",
      "Advanced Vision Analysis",
      "API Access (10,000 calls/month)"
    ],
    popular: true
  },
  {
    id: "sub_enterprise",
    name: "Enterprise",
    tier: "enterprise",
    description: "Full-scale access for organizations building on HoloKai. Dedicated resources and custom integrations.",
    price: 199,
    billingPeriod: "monthly",
    features: [
      "Everything in Pro",
      "Unlimited API Access",
      "Dedicated Support Channel",
      "Custom Model Training",
      "White-label Solutions",
      "SLA Guarantee (99.9%)",
      "Team Collaboration Tools",
      "Advanced Analytics Dashboard"
    ],
    popular: false
  }
];
