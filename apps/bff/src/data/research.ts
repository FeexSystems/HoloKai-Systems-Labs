export interface KnowledgeEntry {
  text: string;
  metadata: {
    domain: string;
    source: string;
    title: string;
    era?: string;
    region?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  testimonial?: string;
  publishedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  featured: boolean;
}

export const mockArticles: Article[] = [
  {
    id: "art_1",
    title: "Unlocking Cross-Dimensional Knowledge with HoloKai Research",
    slug: "unlocking-cross-dimensional-knowledge",
    excerpt: "Discover how HoloKai's Research Tier enables seamless integration of knowledge across civilizations and eras, revolutionizing how we understand history.",
    content: "The HoloKai Research Tier represents a paradigm shift in how we access and integrate historical knowledge. By leveraging advanced AI models, researchers can now query across multiple civilizations simultaneously, drawing connections that were previously impossible to discern...",
    author: "Dr. Amara Okafor",
    publishedAt: "2024-01-15",
    category: "Research",
    tags: ["AI", "Research", "Cross-Dimensional", "Knowledge Integration"],
    readTime: 8
  },
  {
    id: "art_2",
    title: "Voice Services: Transforming Text into Natural Speech",
    slug: "voice-services-transforming-text",
    excerpt: "Explore HoloKai's Voice Services and how high-fidelity synthesis is changing accessibility and user experience across applications.",
    content: "Voice Services from HoloKai utilize state-of-the-art neural synthesis to produce human-like speech with remarkable accuracy. The technology supports multiple languages, emotional tones, and speaking styles...",
    author: "Marcus Chen",
    publishedAt: "2024-01-20",
    category: "Voice",
    tags: ["Voice", "Synthesis", "Accessibility", "AI"],
    readTime: 6
  },
  {
    id: "art_3",
    title: "Vision Capabilities: Seeing the World Through AI",
    slug: "vision-capabilities-seeing-world",
    excerpt: "Learn about HoloKai's Vision module and its applications in image analysis, object detection, and visual understanding.",
    content: "The Vision module empowers applications with computer vision capabilities that were once the domain of specialized research labs. From medical imaging to autonomous systems, the use cases are vast...",
    author: "Sarah Williams",
    publishedAt: "2024-01-25",
    category: "Vision",
    tags: ["Vision", "Computer Vision", "AI", "Image Analysis"],
    readTime: 7
  },
  {
    id: "art_4",
    title: "The Oracle: AI-Powered Question Answering at Scale",
    slug: "oracle-ai-powered-qa",
    excerpt: "Deep dive into the HoloKai Oracle system and how it provides accurate, contextual answers to complex queries across vast knowledge bases.",
    content: "The Oracle represents the culmination of years of research in question-answering systems. By combining retrieval-augmented generation with advanced reasoning capabilities, it can handle queries that require multi-step reasoning...",
    author: "Dr. James Park",
    publishedAt: "2024-02-01",
    category: "Oracle",
    tags: ["Oracle", "QA", "AI", "Knowledge Base"],
    readTime: 10
  },
  {
    id: "art_5",
    title: "Archive: Preserving Knowledge for Future Generations",
    slug: "archive-preserving-knowledge",
    excerpt: "How HoloKai's Archive system ensures the longevity and accessibility of historical data across civilizations and eras.",
    content: "The Archive is more than storage—it's a living knowledge system that evolves with new discoveries while preserving the integrity of historical records. Advanced indexing and semantic search make retrieval intuitive...",
    author: "Elena Rodriguez",
    publishedAt: "2024-02-05",
    category: "Archive",
    tags: ["Archive", "Knowledge Preservation", "Search", "Database"],
    readTime: 9
  },
  {
    id: "art_6",
    title: "Building with HoloKai: A Developer's Guide",
    slug: "building-with-holokai-developer-guide",
    excerpt: "Comprehensive guide for developers integrating HoloKai capabilities into their applications with practical examples and best practices.",
    content: "Getting started with HoloKai is straightforward, but mastering its full potential requires understanding the interplay between different modules. This guide covers authentication, API design patterns, and optimization strategies...",
    author: "Alex Thompson",
    publishedAt: "2024-02-10",
    category: "Development",
    tags: ["Development", "API", "Integration", "Tutorial"],
    readTime: 15
  },
  {
    id: "art_7",
    title: "Security First: Protecting Data in the HoloKai Ecosystem",
    slug: "security-first-holokai",
    excerpt: "Understanding the security architecture and best practices for protecting sensitive data within the HoloKai platform.",
    content: "Security is foundational to HoloKai's design. From encryption at rest to secure API communication, every layer is built with defense-in-depth principles. This article explores the security model...",
    author: "Nina Patel",
    publishedAt: "2024-02-15",
    category: "Security",
    tags: ["Security", "Encryption", "Privacy", "Best Practices"],
    readTime: 12
  },
  {
    id: "art_8",
    title: "Scaling HoloKai: From Prototype to Production",
    slug: "scaling-holokai-production",
    excerpt: "Lessons learned from scaling HoloKai services to handle millions of requests while maintaining performance and reliability.",
    content: "Scaling AI services presents unique challenges. This article shares real-world experiences from the HoloKai team on load balancing, caching strategies, and graceful degradation...",
    author: "David Kim",
    publishedAt: "2024-02-20",
    category: "Infrastructure",
    tags: ["Scaling", "Performance", "Infrastructure", "Production"],
    readTime: 11
  },
  {
    id: "art_9",
    title: "The Future of Knowledge: HoloKai Roadmap 2024",
    slug: "future-knowledge-holokai-roadmap",
    excerpt: "A look at the upcoming features and innovations planned for HoloKai in 2024, including new modules and enhanced capabilities.",
    content: "2024 promises to be an exciting year for HoloKai. We're planning major releases across all modules, including real-time collaboration features, enhanced multilingual support, and new AI models...",
    author: "HoloKai Team",
    publishedAt: "2024-02-25",
    category: "Product",
    tags: ["Roadmap", "Future", "Features", "Innovation"],
    readTime: 8
  },
  {
    id: "art_10",
    title: "Case Study: Educational Institutions Transform Learning",
    slug: "case-study-education-transform",
    excerpt: "How universities and schools are leveraging HoloKai to transform research and education through AI-powered knowledge access.",
    content: "Educational institutions are at the forefront of adopting HoloKai. This case study explores how universities are using the Research Tier to enable students to explore historical connections in entirely new ways...",
    author: "Prof. Lisa Anderson",
    publishedAt: "2024-03-01",
    category: "Education",
    tags: ["Education", "Research", "Case Study", "AI in Education"],
    readTime: 13
  }
];

export const mockCaseStudies: CaseStudy[] = [
  {
    id: "cs_1",
    title: "Global Research Institute Accelerates Discovery",
    slug: "global-research-institute",
    company: "Global Research Institute",
    industry: "Academic Research",
    challenge: "Researchers needed to access and correlate historical data across multiple civilizations and time periods, but existing tools were siloed and inefficient.",
    solution: "Implemented HoloKai Research Tier with custom integrations for their existing databases. Used cross-dimensional queries to identify previously unknown historical patterns.",
    results: [
      "Research time reduced by 60%",
      "Published 3 new papers based on discovered patterns",
      "Increased collaboration between departments"
    ],
    metrics: [
      { label: "Time Saved", value: "60%" },
      { label: "New Publications", value: "3" },
      { label: "User Satisfaction", value: "4.8/5" }
    ],
    testimonial: "HoloKai transformed how our researchers work. What used to take weeks now takes hours.",
    publishedAt: "2024-01-10"
  },
  {
    id: "cs_2",
    title: "Media Company Enhances Content Accessibility",
    slug: "media-company-accessibility",
    company: "StreamLine Media",
    industry: "Media & Entertainment",
    challenge: "Needed to provide audio descriptions and multilingual voiceovers for video content at scale, with consistent quality and fast turnaround.",
    solution: "Deployed HoloKai Voice Services with custom voice profiles for different content types. Integrated with their content management system for automated processing.",
    results: [
      "Reduced voiceover production time by 75%",
      "Expanded to 15 languages",
      "Improved accessibility compliance to 100%"
    ],
    metrics: [
      { label: "Time Reduction", value: "75%" },
      { label: "Languages", value: "15" },
      { label: "Compliance", value: "100%" }
    ],
    testimonial: "The quality and consistency of HoloKai's voice synthesis exceeded our expectations.",
    publishedAt: "2024-01-15"
  },
  {
    id: "cs_3",
    title: "Healthcare Startup Improves Diagnostics",
    slug: "healthcare-diagnostics",
    company: "MedVision AI",
    industry: "Healthcare",
    challenge: "Required accurate image analysis for medical diagnostics with high precision and low false-positive rates.",
    solution: "Integrated HoloKai Vision with custom training on medical imaging datasets. Implemented specialized models for different diagnostic use cases.",
    results: [
      "Improved diagnostic accuracy by 25%",
      "Reduced false positives by 40%",
      "Faster diagnosis turnaround"
    ],
    metrics: [
      { label: "Accuracy Improvement", value: "25%" },
      { label: "False Positive Reduction", value: "40%" },
      { label: "Turnaround Time", value: "-50%" }
    ],
    testimonial: "HoloKai Vision has become an essential tool in our diagnostic pipeline.",
    publishedAt: "2024-01-20"
  },
  {
    id: "cs_4",
    title: "Enterprise Knowledge Management Transformation",
    slug: "enterprise-knowledge-management",
    company: "TechCorp Global",
    industry: "Enterprise Software",
    challenge: "Employees struggled to find information across disparate systems, leading to duplicated work and lost productivity.",
    solution: "Implemented HoloKai Oracle as a unified knowledge query interface. Connected to internal documentation, wikis, and project management systems.",
    results: [
      "Search time reduced by 80%",
      "Knowledge reuse increased by 45%",
      "Employee satisfaction improved significantly"
    ],
    metrics: [
      { label: "Search Time Reduction", value: "80%" },
      { label: "Knowledge Reuse", value: "+45%" },
      { label: "Satisfaction Score", value: "4.7/5" }
    ],
    testimonial: "Our employees can now find answers in seconds instead of hours.",
    publishedAt: "2024-01-25"
  },
  {
    id: "cs_5",
    title: "Museum Digital Archive Modernization",
    slug: "museum-digital-archive",
    company: "National Heritage Museum",
    industry: "Museums & Culture",
    challenge: "Needed to digitize and make accessible millions of historical artifacts and documents while preserving their context and relationships.",
    solution: "Deployed HoloKai Archive with custom metadata schemas and semantic search. Implemented cross-referencing between artifacts, documents, and historical events.",
    results: [
      "Digitized 500,000+ artifacts",
      "Online access increased by 300%",
      "Research requests handled 5x faster"
    ],
    metrics: [
      { label: "Artifacts Digitized", value: "500K+" },
      { label: "Access Increase", value: "300%" },
      { label: "Request Speed", value: "5x faster" }
    ],
    testimonial: "HoloKai Archive has made our collection accessible to the world in ways we never imagined.",
    publishedAt: "2024-01-30"
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "test_1",
    name: "Dr. Amara Okafor",
    role: "Director of Research",
    company: "Global Research Institute",
    avatar: "/images/testimonials/amara.jpg",
    content: "HoloKai has fundamentally changed how we approach historical research. The ability to query across civilizations has opened doors we didn't even know existed.",
    rating: 5,
    featured: true
  },
  {
    id: "test_2",
    name: "Marcus Chen",
    role: "CTO",
    company: "StreamLine Media",
    avatar: "/images/testimonials/marcus.jpg",
    content: "The voice synthesis quality is indistinguishable from human narration. Our production costs have dropped while quality has improved.",
    rating: 5,
    featured: true
  },
  {
    id: "test_3",
    name: "Dr. Sarah Williams",
    role: "Chief Medical Officer",
    company: "MedVision AI",
    avatar: "/images/testimonials/sarah.jpg",
    content: "Accuracy in medical imaging is non-negotiable. HoloKai Vision delivers the precision we need for critical diagnostics.",
    rating: 5,
    featured: true
  },
  {
    id: "test_4",
    name: "David Kim",
    role: "VP of Engineering",
    company: "TechCorp Global",
    avatar: "/images/testimonials/david.jpg",
    content: "The Oracle's ability to understand context and provide nuanced answers has transformed our internal knowledge sharing.",
    rating: 5,
    featured: false
  },
  {
    id: "test_5",
    name: "Elena Rodriguez",
    role: "Head of Digital Collections",
    company: "National Heritage Museum",
    avatar: "/images/testimonials/elena.jpg",
    content: "Preserving history while making it accessible is a delicate balance. HoloKai Archive achieves both beautifully.",
    rating: 5,
    featured: true
  }
];

export const mockResearchData: KnowledgeEntry[] = [
  {
    text: "The Nile Valley Nexus encompasses Kemet (Ancient Egypt) and Nubia/Kush/Kerma, the cradle of complex societies. Unification occurred around 3100 BCE under the first pharaohs. This region produced pyramids, advanced mathematics documented in the Rhind Papyrus, geometry for land surveying after annual floods, and astronomy including the Nabta Playa stone circle alignments predating Stonehenge by millennia.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Nile Valley Nexus", era: "Pre-3000 BCE", region: "Northeast Africa" }
  },
  {
    text: "Maat was the foundational principle of Kemet — representing cosmic order, truth, justice, balance, and harmony. Maat governed ethics, governance, art, and daily life. The concept influenced later philosophical traditions and remains central to Afrofuturist ethics of balance and sustainability.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Maat — Cosmic Order Principle" }
  },
  {
    text: "Kerma (c. 2500–1500 BCE) was the earliest major Nubian kingdom, centered in present-day Sudan. Its Deffufa mud-brick temples are among the oldest standing structures in sub-Saharan Africa. Kerma demonstrated sophisticated urban planning, gold mining, and cattle-based wealth systems.",
    metadata: { domain: "archaeology", source: "HoloKai Knowledge Base", title: "Kingdom of Kerma" }
  },
  {
    text: "Dhar Tichitt (c. 2000–500 BCE) in present-day Mauritania is one of the earliest known complex societies in West Africa. Stone-walled settlements, granaries, and evidence of sorghum cultivation demonstrate early agricultural sophistication and social stratification in the Sahel region.",
    metadata: { domain: "archaeology", source: "HoloKai Knowledge Base", title: "Dhar Tichitt — West African Foundations" }
  },
  {
    text: "The Nok culture (c. 1500 BCE – 500 CE) in central Nigeria produced some of the earliest known terracotta sculptures in sub-Saharan Africa and was among the first regions to develop iron smelting technology. Nok terracottas depict human figures with elaborate hairstyles and jewelry, indicating complex social hierarchies.",
    metadata: { domain: "archaeology", source: "HoloKai Knowledge Base", title: "Nok Culture — Terracotta and Iron" }
  },
  {
    text: "Kemet (Ancient Egypt) spanned the Old, Middle, and New Kingdoms (c. 3100–332 BCE). Engineering marvels include the Great Pyramid of Giza (2560 BCE), built with 2.3 million limestone blocks averaging 2.5 tons each. The workforce was composed of skilled laborers, not slaves, organized into rotating crews.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Kemet — Engineering Marvels" }
  },
  {
    text: "Ancient Egyptian mathematics included the Rhind Mathematical Papyrus (c. 1650 BCE) demonstrating fractions, algebra, and geometry. The Moscow Mathematical Papyrus contains problems involving volume calculations. Egyptian geometry was practical — used for land surveying after annual Nile floods erased field boundaries.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Kemet — Mathematics" }
  },
  {
    text: "The Kingdom of Kush flourished through three phases: Kerma (c. 2500–1500 BCE), Napata (c. 750–300 BCE), and Meroë (c. 300 BCE – 350 CE). The 25th Dynasty of Egypt was Nubian — Kushite pharaohs like Piye and Taharqa unified the Nile Valley and revitalized Egyptian art and architecture.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Kingdom of Kush — Three Phases" }
  },
  {
    text: "Meroë (c. 300 BCE – 350 CE) was a major iron-producing center, earning the nickname 'Birmingham of Africa.' The city featured over 200 pyramids — more than Egypt — and an astronomical observatory. Meroitic script remains only partially decoded, representing one of Africa's great unsolved linguistic puzzles.",
    metadata: { domain: "archaeology", source: "HoloKai Knowledge Base", title: "Meroë — Iron and Astronomy" }
  },
  {
    text: "The Aksumite Empire (c. 100–940 CE) in present-day Ethiopia and Eritrea was a major trade powerhouse connecting Rome and India via the Red Sea. Aksum produced massive stone stelae (obelisks) — the tallest erect stela (Stela 3) stood 24 meters. Aksum was one of the earliest states to adopt Christianity (4th century CE).",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Aksum — Trade and Obelisks" }
  },
  {
    text: "The Ghana Empire (c. 300–1200 CE), centered in present-day southeastern Mauritania and western Mali, controlled trans-Saharan gold and salt trade. The Soninke people built a empire where the king's court was described by Arab geographers as dazzling — golden throne, leather screens hung with gold plates. At its height, the empire commanded 200,000 soldiers.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Ghana Empire — Gold and Salt" }
  },
  {
    text: "The Mali Empire (c. 1235–1600 CE) was founded by Sundiata Keita after the Battle of Kirina (1235 CE). The Manden Charter (Kouroukan Fouga), declared around 1236 CE, is considered one of the earliest declarations of human rights — establishing rules for social organization, abolition of slavery, and environmental stewardship.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Mali Empire — Founding and Manden Charter" }
  },
  {
    text: "Mansa Musa (r. 1312–1337) transformed the Mali Empire into one of the wealthiest states in world history. His 1324–25 pilgrimage to Mecca with 60,000 men and 12,000 slaves, each carrying 4 pounds of gold, temporarily crashed gold prices in Cairo. He commissioned the Djinguereber Mosque in Timbuktu and established Sankore University.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Mansa Musa — Wealth and Pilgrimage" }
  },
  {
    text: "Timbuktu's Sankore University (c. 14th–16th century) housed 700,000+ manuscripts covering law, theology, astronomy, medicine, mathematics, and chemistry. Scholars like Ahmed Baba produced over 40 works. The manuscripts represent one of humanity's greatest knowledge repositories, preserved through a tradition of collective scholarship.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Sankore University — Timbuktu Manuscripts" }
  },
  {
    text: "The Songhai Empire (c. 1430–1591 CE) became the largest empire in African history, stretching from the Atlantic to present-day Nigeria. Under Askia Muhammad I (r. 1493–1528), Timbuktu and Djenné became centers of Islamic scholarship. The empire's bureaucratic structure included provincial governors, tax collectors, and a standing army of 100,000.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Songhai Empire — Largest African Empire" }
  },
  {
    text: "Great Zimbabwe (c. 1100–1450 CE) was the capital of the Kingdom of Zimbabwe. Its Great Enclosure features a outer wall 250 meters long and 11 meters high — the largest ancient stone structure in sub-Saharan Africa. Built without mortar, the stones were precisely fitted. The city was home to 18,000 people and controlled gold trade with the Swahili Coast.",
    metadata: { domain: "archaeology", source: "HoloKai Knowledge Base", title: "Great Zimbabwe — Stone Architecture" }
  },
  {
    text: "Ife (c. 300–1700 CE) was the spiritual heart of Yoruba civilization, renowned for naturalistic bronze and terracotta heads created using the lost-wax casting technique. These works demonstrate extraordinary artistic sophistication. Benin City (in the Kingdom of Benin) featured broad avenues, palatial complexes, and a population larger than most contemporary European cities.",
    metadata: { domain: "historian", source: "HoloKai Knowledge Base", title: "Ife and Benin — Yoruba Art and Urbanism" }
  },
  {
    text: "The Ifa divination system, recognized by UNESCO as Intangible Cultural Heritage, uses a corpus of 256 odu (chapters) containing thousands of verses. Ifa encodes Yoruba cosmology, history, medicine, and philosophy. The system uses binary logic (8 basic figures of single/double marks) — a mathematical structure that predates Leibniz's binary system by centuries.",
    metadata: { domain: "anthropology", source: "HoloKai Knowledge Base", title: "Ifa Divination — Binary Logic" }
  }
];
