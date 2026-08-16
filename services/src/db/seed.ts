import { db } from './index';
import { pricingTiers, products, useCases, testimonials, caseStudies, researchArticles } from './schema';

async function seed() {
  console.log('🌱 Starting database seed...');

  // Seed Pricing Tiers
  console.log('Seeding pricing tiers...');
  await db.insert(pricingTiers).values([
    {
      name: 'Free',
      slug: 'free',
      price: '0',
      currency: 'USD',
      period: 'month',
      description: 'Perfect for exploring HoloKai capabilities',
      popular: false,
      limits: { queriesPerMonth: 50, documents: 5, voiceMinutes: 0, imageGenerations: 0 },
      features: ['Basic knowledge queries', '5 document uploads', 'Community support', 'Standard response time'],
    },
    {
      name: 'Pro',
      slug: 'pro',
      price: '29',
      currency: 'USD',
      period: 'month',
      description: 'For researchers and content creators',
      popular: true,
      limits: { queriesPerMonth: 1000, documents: 100, voiceMinutes: 120, imageGenerations: 50 },
      features: ['Unlimited knowledge queries', '100 document uploads', '120 voice synthesis minutes', '50 image generations', 'Priority support', 'Advanced analytics', 'API access'],
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      price: '199',
      currency: 'USD',
      period: 'month',
      description: 'For teams and organizations',
      popular: false,
      limits: { queriesPerMonth: 10000, documents: 1000, voiceMinutes: 1000, imageGenerations: 500 },
      features: ['Unlimited everything', '1000 document uploads', '1000 voice synthesis minutes', '500 image generations', 'Dedicated support', 'Custom integrations', 'Team collaboration', 'SLA guarantee', 'White-label options'],
    },
  ]);

  // Seed Products
  console.log('Seeding products...');
  const [researchProduct] = await db.insert(products).values([
    {
      slug: 'research-tier',
      name: 'HoloKai Research Tier',
      category: 'research',
      holoKaiProduct: 'research-tier',
      description: 'Access to comprehensive knowledge base with ancient texts, historical analysis, and research tools',
      shortDescription: 'Deep historical knowledge at your fingertips',
      icon: 'BookOpen',
      featured: true,
      availableTiers: ['free', 'pro', 'enterprise'],
    },
    {
      slug: 'voice-services',
      name: 'HoloKai Voice Services',
      category: 'voice',
      holoKaiProduct: 'voice-services',
      description: 'AI-powered voice synthesis in ancient languages with custom voice cloning capabilities',
      shortDescription: 'Bring history to life with ancient voices',
      icon: 'Mic',
      featured: true,
      availableTiers: ['pro', 'enterprise'],
    },
    {
      slug: 'vision',
      name: 'HoloKai Vision',
      category: 'vision',
      holoKaiProduct: 'vision',
      description: 'Generate and analyze ancient artifacts, manuscripts, and historical imagery with AI',
      shortDescription: 'Create and analyze historical artifacts',
      icon: 'Eye',
      featured: true,
      availableTiers: ['pro', 'enterprise'],
    },
    {
      slug: 'oracle',
      name: 'HoloKai Oracle',
      category: 'oracle',
      holoKaiProduct: 'oracle',
      description: 'Real-time knowledge queries with multi-step reasoning and context-aware responses',
      shortDescription: 'Your intelligent historical assistant',
      icon: 'Sparkles',
      featured: true,
      availableTiers: ['free', 'pro', 'enterprise'],
    },
    {
      slug: 'archive',
      name: 'HoloKai Archive',
      category: 'archive',
      holoKaiProduct: 'archive',
      description: 'Secure document storage with version control, semantic search, and tier-based access control',
      shortDescription: 'Organize and preserve your research',
      icon: 'Archive',
      featured: true,
      availableTiers: ['free', 'pro', 'enterprise'],
    },
  ]).returning();

  // Seed Use Cases
  console.log('Seeding use cases...');
  await db.insert(useCases).values([
    {
      productId: researchProduct.id,
      title: 'Academic Research',
      description: 'Comprehensive access to ancient texts and historical analysis for academic papers and theses',
      idealFor: ['Students', 'Researchers', 'Academics'],
    },
    {
      productId: researchProduct.id,
      title: 'Documentary Production',
      description: 'Quick fact-checking and historical context for documentary filmmakers',
      idealFor: ['Filmmakers', 'Writers', 'Producers'],
    },
    {
      productId: researchProduct.id,
      title: 'Genealogy Research',
      description: 'Trace family histories through historical records and ancient texts',
      idealFor: ['Genealogists', 'Family Historians', 'Archivists'],
    },
  ]);

  // Seed Testimonials
  console.log('Seeding testimonials...');
  await db.insert(testimonials).values([
    {
      name: 'Dr. Sarah Chen',
      role: 'Professor of Ancient History',
      company: 'Oxford University',
      quote: 'HoloKai Research Tier has revolutionized how my students access ancient texts. The semantic search is incredibly accurate.',
      rating: 5,
      product: 'research-tier',
      tier: 'pro',
      featured: true,
    },
    {
      name: 'Marcus Rivera',
      role: 'Documentary Filmmaker',
      company: 'History Channel Productions',
      quote: 'The voice synthesis capabilities are mind-blowing. We can now have ancient figures "speak" in our documentaries.',
      rating: 5,
      product: 'voice-services',
      tier: 'enterprise',
      featured: true,
    },
    {
      name: 'Elena Kowalski',
      role: 'Museum Curator',
      company: 'British Museum',
      quote: 'HoloKai Vision helps us generate artifact reconstructions that were previously impossible. It\'s transformed our exhibits.',
      rating: 5,
      product: 'vision',
      tier: 'pro',
      featured: true,
    },
    {
      name: 'James Okonkwo',
      role: 'Independent Researcher',
      quote: 'The Oracle feature is like having a brilliant historian available 24/7. It understands context and nuance.',
      rating: 5,
      product: 'oracle',
      tier: 'free',
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Archaeologist',
      company: 'Field Research Institute',
      quote: 'Archive keeps all my field notes organized and searchable. The version history has saved me multiple times.',
      rating: 4,
      product: 'archive',
      tier: 'pro',
    },
  ]);

  // Seed Case Studies
  console.log('Seeding case studies...');
  await db.insert(caseStudies).values([
    {
      title: 'Oxford University: Digitizing Ancient Manuscripts',
      description: 'How Oxford used HoloKai to digitize and analyze 10,000+ ancient manuscripts',
      product: 'research-tier',
      outcome: 'Reduced research time by 70%, discovered 3 previously unknown texts',
      metrics: { 'Manuscripts Processed': '10,000+', 'Research Time Saved': '70%', 'New Discoveries': '3' },
      featured: true,
    },
    {
      title: 'History Channel: Bringing Ancient Voices to Life',
      description: 'Creating authentic voiceovers for ancient figures in documentary series',
      product: 'voice-services',
      outcome: '50% increase in viewer engagement, Emmy nomination for sound design',
      metrics: { 'Episodes Produced': '24', 'Viewer Engagement': '+50%', 'Awards': 'Emmy Nomination' },
      featured: true,
    },
    {
      title: 'British Museum: Artifact Reconstruction',
      description: 'Using AI to reconstruct damaged artifacts for exhibition',
      product: 'vision',
      outcome: '15 artifacts restored, 200,000+ visitors to new exhibition',
      metrics: { 'Artifacts Restored': '15', 'Exhibition Visitors': '200,000+', 'Accuracy Rate': '94%' },
      featured: true,
    },
    {
      title: 'Field Research Institute: Managing Excavation Data',
      description: 'Organizing and searching thousands of excavation documents',
      product: 'archive',
      outcome: 'Instant document retrieval, improved collaboration across teams',
      metrics: { 'Documents Stored': '5,000+', 'Search Time': '<1s', 'Team Members': '50' },
      featured: false,
    },
    {
      title: 'Independent Scholar: Writing Historical Fiction',
      description: 'Using Oracle for fact-checking and historical context',
      product: 'oracle',
      outcome: 'Published bestselling novel, 98% historical accuracy',
      metrics: { 'Novels Published': '1', 'Sales': '50,000+', 'Accuracy': '98%' },
      featured: false,
    },
  ]);

  // Seed Research Articles
  console.log('Seeding research articles...');
  await db.insert(researchArticles).values([
    {
      slug: 'the-library-of-alexandria-reimagined',
      title: 'The Library of Alexandria Reimagined: What We Lost and What We\'ve Found',
      excerpt: 'Exploring the estimated 400,000 scrolls lost in the ancient world\'s greatest repository of knowledge',
      content: 'The Library of Alexandria was the ancient world\'s largest repository of knowledge...',
      author: 'Dr. Helena Vasquez',
      category: 'Ancient Civilizations',
      tags: ['Alexandria', 'Ancient Libraries', 'Lost Knowledge', 'Ptolemaic Egypt'],
      readTime: 12,
      featured: true,
    },
    {
      slug: 'decoding-the-rosetta-stone',
      title: 'Decoding the Rosetta Stone: The Key to Understanding Ancient Egypt',
      excerpt: 'How a single stone inscription unlocked the secrets of hieroglyphics and changed Egyptology forever',
      content: 'The Rosetta Stone, discovered in 1799, contained the same text in three scripts...',
      author: 'Prof. Michael Chang',
      category: 'Linguistics',
      tags: ['Rosetta Stone', 'Hieroglyphics', 'Egyptology', 'Decipherment'],
      readTime: 8,
      featured: true,
    },
    {
      slug: 'the-voice-of-ancient-rome',
      title: 'The Voice of Ancient Rome: Reconstructing Latin Pronunciation',
      excerpt: 'Modern techniques reveal how Latin actually sounded in the time of Cicero and Caesar',
      content: 'For centuries, scholars debated how Latin was pronounced in ancient Rome...',
      author: 'Dr. Marcus Aurelius (descendant)',
      category: 'Linguistics',
      tags: ['Latin', 'Pronunciation', 'Roman History', 'Phonetics'],
      readTime: 10,
      featured: true,
    },
    {
      slug: 'mesopotamian-mathematics',
      title: 'Mesopotamian Mathematics: The Birth of Algebra and Geometry',
      excerpt: 'Ancient Babylonian tablets reveal sophisticated mathematical concepts predating Greek discoveries',
      content: 'Clay tablets from ancient Mesopotamia show that Babylonian mathematicians...',
      author: 'Dr. Layla Hassan',
      category: 'Mathematics',
      tags: ['Babylon', 'Mathematics', 'Algebra', 'Geometry', 'Clay Tablets'],
      readTime: 15,
      featured: false,
    },
    {
      slug: 'the-silk-road-trade',
      title: 'The Silk Road: Economic Networks of the Ancient World',
      excerpt: 'How trade routes connected civilizations and spread ideas across continents',
      content: 'The Silk Road was not a single path but a network of trade routes...',
      author: 'Prof. Wei Chen',
      category: 'Economics',
      tags: ['Silk Road', 'Trade', 'Economics', 'Cultural Exchange'],
      readTime: 11,
      featured: false,
    },
    {
      slug: 'ancient-greek-democracy',
      title: 'Athenian Democracy: Origins and Evolution of Political Systems',
      excerpt: 'Examining the birthplace of democracy and its influence on modern governance',
      content: 'Athens in the 5th century BCE witnessed the emergence of radical democracy...',
      author: 'Dr. Sophia Papadopoulos',
      category: 'Political Science',
      tags: ['Athens', 'Democracy', 'Political Systems', 'Ancient Greece'],
      readTime: 14,
      featured: false,
    },
    {
      slug: 'the-indus-valley-civilization',
      title: 'The Indus Valley Civilization: Urban Planning Before Its Time',
      excerpt: 'Discoveries reveal sophisticated city planning in one of the world\'s earliest urban civilizations',
      content: 'The Indus Valley Civilization flourished from 3300-1300 BCE in what is now...',
      author: 'Dr. Rajesh Kumar',
      category: 'Urban Planning',
      tags: ['Indus Valley', 'Urban Planning', 'Ancient Cities', 'Mohenjo-daro'],
      readTime: 13,
      featured: false,
    },
    {
      slug: 'mayan-astronomy',
      title: 'Mayan Astronomy: Precision Without Telescopes',
      excerpt: 'How the Maya achieved astronomical accuracy using only naked-eye observations',
      content: 'The Maya civilization developed one of the most accurate astronomical systems...',
      author: 'Dr. Carlos Mendez',
      category: 'Astronomy',
      tags: ['Maya', 'Astronomy', 'Calendar', 'Observatories'],
      readTime: 12,
      featured: false,
    },
    {
      slug: 'the-terracotta-army',
      title: 'The Terracotta Army: Craftsmanship and Scale in Ancient China',
      excerpt: 'Analyzing the creation of 8,000 unique soldiers for Emperor Qin Shi Huang',
      content: 'Discovered in 1974, the Terracotta Army consists of over 8,000 life-sized figures...',
      author: 'Dr. Li Wei',
      category: 'Art History',
      tags: ['Terracotta Army', 'Qin Dynasty', 'Chinese Art', 'Emperor Qin Shi Huang'],
      readTime: 10,
      featured: false,
    },
    {
      slug: 'viking-navigation',
      title: 'Viking Navigation: Sailing the North Atlantic Without Compass',
      excerpt: 'How Norse sailors used sunstones, birds, and ocean currents to navigate vast distances',
      content: 'Viking explorers crossed the North Atlantic and reached North America 500 years before Columbus...',
      author: 'Dr. Erik Johansson',
      category: 'Navigation',
      tags: ['Vikings', 'Navigation', 'North Atlantic', 'Sunstones'],
      readTime: 9,
      featured: false,
    },
    {
      slug: 'ancient-egyptian-medicine',
      title: 'Ancient Egyptian Medicine: Healing Practices of the Nile',
      excerpt: 'Medical papyri reveal sophisticated surgical techniques and herbal remedies',
      content: 'Ancient Egyptian physicians developed advanced medical practices...',
      author: 'Dr. Amira Hassan',
      category: 'Medicine',
      tags: ['Egypt', 'Medicine', 'Surgery', 'Herbal Remedies'],
      readTime: 11,
      featured: false,
    },
    {
      slug: 'the-code-of-hammurabi',
      title: 'The Code of Hammurabi: One of the Earliest Legal Systems',
      excerpt: 'Examining the Babylonian law code that influenced legal systems for millennia',
      content: 'The Code of Hammurabi, created around 1754 BCE, is one of the oldest deciphered writings...',
      author: 'Dr. David Cohen',
      category: 'Law',
      tags: ['Hammurabi', 'Law Code', 'Babylon', 'Legal Systems'],
      readTime: 8,
      featured: false,
    },
  ]);

  console.log('✅ Database seed complete!');
}

seed().catch(console.error);
