/**
 * HoloKai Frontend Spec v14.0 — Product & Hero Type Contracts (§27–28)
 */

export type ProductCategory =
  | 'domains'
  | 'hosting'
  | 'email'
  | 'cloud'
  | 'security'
  | 'ai'
  | 'research'
  | 'civilization'
  | 'archive';

export type HoloKaiProduct = 'research-tier' | 'voice-services' | 'vision' | 'oracle' | 'archive';

export type PricingTier = 'free' | 'pro' | 'enterprise';

export interface Price {
  amount: number;
  currency: string;
  period?: 'month' | 'year' | 'once';
  displayString?: string; // e.g. "$12/mo"
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  idealFor: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  holoKaiProduct?: HoloKaiProduct;
  description: string;
  href: string;
  image?: string;
  badge?: string;
  price?: Price;
  featured?: boolean;
  icon?: string; // Lucide icon name
  useCases?: UseCase[];
  availableTiers?: PricingTier[];
}

export type CTAVariant = 'primary' | 'secondary' | 'ghost';

export interface CTA {
  label: string;
  href: string;
  variant: CTAVariant;
}

export interface HeroVisual {
  type: 'image' | 'video' | 'component' | '3d';
  src?: string;
  alt?: string;
  componentId?: string; // reference to a named component key
}

export interface HeroConfig {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: CTA;
  secondaryAction?: CTA;
  visual?: HeroVisual;
}

export interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  description?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  image?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PricingTierConfig {
  id: PricingTier;
  name: string;
  price: Price;
  description: string;
  features: Feature[];
  limits: Record<string, string | number>;
  popular?: boolean;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  availableIn: PricingTier[];
  icon?: string;
}

export interface FeatureComparison {
  features: Feature[];
  tiers: PricingTierConfig[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  quote: string;
  rating: number;
  product?: HoloKaiProduct;
  tier?: PricingTier;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  product: HoloKaiProduct;
  outcome: string;
  metrics: Record<string, string>;
}
