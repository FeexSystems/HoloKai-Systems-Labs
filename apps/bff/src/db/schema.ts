import { pgTable, text, timestamp, integer, uuid, decimal, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  name: text('name').notNull(),
  civilization: text('civilization').notNull(),
  role: text('role').notNull(),
  clearanceLevel: integer('clearance_level').notNull().default(1),
  lastActive: timestamp('last_active').defaultNow(),
}, (table) => ({
  civilizationIdx: index('civilization_idx').on(table.civilization),
  roleIdx: index('role_idx').on(table.role),
  lastActiveIdx: index('last_active_idx').on(table.lastActive),
}));

export const cartItems = pgTable('cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  productIdIdx: index('product_id_idx').on(table.productId),
  userIdProductIdIdx: index('user_product_idx').on(table.userId, table.productId),
}));

export const archives = pgTable('archives', {
  id: uuid('id').defaultRandom().primaryKey(),
  civilizationId: text('civilization_id').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(), // person, place, event, artifact, concept
  description: text('description').notNull(),
  era: text('era'),
  region: text('region'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  civilizationIdIdx: index('civilization_id_idx').on(table.civilizationId),
  categoryIdx: index('category_idx').on(table.category),
  eraIdx: index('era_idx').on(table.era),
  regionIdx: index('region_idx').on(table.region),
  titleIdx: index('title_idx').on(table.title),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
  categoryCivilizationIdx: index('category_civilization_idx').on(table.category, table.civilizationId),
}));

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  inventory: integer('inventory').notNull().default(0),
  imageUrl: text('image_url'),
  featured: integer('featured').default(0), // 0 or 1 for boolean representation
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('product_category_idx').on(table.category),
  featuredIdx: index('featured_idx').on(table.featured),
  priceIdx: index('price_idx').on(table.price),
  inventoryIdx: index('inventory_idx').on(table.inventory),
}));

export const useCases = pgTable('use_cases', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: text('product_id').references(() => products.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  industry: text('industry').notNull(),
  featured: integer('featured').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  productIdIdx: index('use_case_product_idx').on(table.productId),
  industryIdx: index('industry_idx').on(table.industry),
  featuredIdx: index('use_case_featured_idx').on(table.featured),
}));

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tier: text('tier').notNull(), // 'free', 'pro', 'enterprise'
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  billingPeriod: text('billing_period').notNull().default('month'),
  features: text('features').array(),
  popular: integer('popular').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  popularIdx: index('popular_idx').on(table.popular),
  priceIdx: index('subscription_price_idx').on(table.price),
  tierIdx: index('tier_idx').on(table.tier),
}));

export const researchLogs = pgTable('research_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  domain: text('domain').notNull(),
  era: text('era'),
  region: text('region'),
  text: text('text').notNull(),
  confidence: decimal('confidence', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  domainIdx: index('domain_idx').on(table.domain),
  eraIdx: index('research_era_idx').on(table.era),
  regionIdx: index('research_region_idx').on(table.region),
  titleIdx: index('research_title_idx').on(table.title),
  createdAtIdx: index('research_created_at_idx').on(table.createdAt),
  domainEraIdx: index('domain_era_idx').on(table.domain, table.era),
}));
