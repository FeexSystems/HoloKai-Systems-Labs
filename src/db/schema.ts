import { relations } from 'drizzle-orm';
import { integer, json, pgTable, serial, text, timestamp, boolean, numeric } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const entries = pgTable('entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Wave 4A: Products and Pricing
export const pricingTiers = pgTable('pricing_tiers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // 'Free', 'Pro', 'Enterprise'
  slug: text('slug').notNull().unique(), // 'free', 'pro', 'enterprise'
  price: numeric('price').notNull(), // 0, 29, 199
  currency: text('currency').notNull().default('USD'),
  period: text('period').notNull().default('month'), // 'month', 'year'
  description: text('description').notNull(),
  popular: boolean('popular').default(false),
  limits: json('limits').$type<Record<string, string | number>>().notNull(),
  features: json('features').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'research', 'voice', 'vision', 'oracle', 'archive'
  holoKaiProduct: text('holo_kai_product').notNull(), // 'research-tier', 'voice-services', 'vision', 'oracle', 'archive'
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),
  icon: text('icon').notNull(), // Lucide icon name
  featured: boolean('featured').default(false),
  availableTiers: json('available_tiers').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const useCases = pgTable('use_cases', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  idealFor: json('ideal_for').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Wave 4B: Content
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  company: text('company'),
  avatar: text('avatar'),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull(), // 1-5
  product: text('product').notNull(), // HoloKaiProduct
  tier: text('tier').notNull(), // PricingTier
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const caseStudies = pgTable('case_studies', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail'),
  product: text('product').notNull(), // HoloKaiProduct
  outcome: text('outcome').notNull(),
  metrics: json('metrics').$type<Record<string, string>>().notNull(),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const researchArticles = pgTable('research_articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  author: text('author').notNull(),
  category: text('category').notNull(),
  tags: json('tags').$type<string[]>().notNull(),
  readTime: integer('read_time').notNull(), // minutes
  featured: boolean('featured').default(false),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  author: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  useCases: many(useCases),
}));

export const useCasesRelations = relations(useCases, ({ one }) => ({
  product: one(products, {
    fields: [useCases.productId],
    references: [products.id],
  }),
}));
