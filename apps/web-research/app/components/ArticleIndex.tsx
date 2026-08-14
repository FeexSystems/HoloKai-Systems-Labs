'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Tag, BookOpen } from 'lucide-react';

const articles = [
  {
    id: '1',
    slug: 'the-library-of-alexandria-reimagined',
    title: 'The Library of Alexandria Reimagined: What We Lost and What We\'ve Found',
    excerpt: 'Exploring the estimated 400,000 scrolls lost in the ancient world\'s greatest repository of knowledge',
    author: 'Dr. Helena Vasquez',
    category: 'Ancient Civilizations',
    tags: ['Alexandria', 'Ancient Libraries', 'Lost Knowledge'],
    readTime: 12,
    publishedAt: '2024-01-15',
    featured: true,
  },
  {
    id: '2',
    slug: 'decoding-the-rosetta-stone',
    title: 'Decoding the Rosetta Stone: The Key to Understanding Ancient Egypt',
    excerpt: 'How a single stone inscription unlocked the secrets of hieroglyphics and changed Egyptology forever',
    author: 'Prof. Michael Chang',
    category: 'Linguistics',
    tags: ['Rosetta Stone', 'Hieroglyphics', 'Egyptology'],
    readTime: 8,
    publishedAt: '2024-01-10',
    featured: true,
  },
  {
    id: '3',
    slug: 'the-voice-of-ancient-rome',
    title: 'The Voice of Ancient Rome: Reconstructing Latin Pronunciation',
    excerpt: 'Modern techniques reveal how Latin actually sounded in the time of Cicero and Caesar',
    author: 'Dr. Marcus Aurelius',
    category: 'Linguistics',
    tags: ['Latin', 'Pronunciation', 'Roman History'],
    readTime: 10,
    publishedAt: '2024-01-08',
    featured: false,
  },
  {
    id: '4',
    slug: 'mesopotamian-mathematics',
    title: 'Mesopotamian Mathematics: The Birth of Algebra and Geometry',
    excerpt: 'Ancient Babylonian tablets reveal sophisticated mathematical concepts predating Greek discoveries',
    author: 'Dr. Layla Hassan',
    category: 'Mathematics',
    tags: ['Babylon', 'Mathematics', 'Algebra'],
    readTime: 15,
    publishedAt: '2024-01-05',
    featured: false,
  },
  {
    id: '5',
    slug: 'the-silk-road-trade',
    title: 'The Silk Road: Economic Networks of the Ancient World',
    excerpt: 'How trade routes connected civilizations and spread ideas across continents',
    author: 'Prof. Wei Chen',
    category: 'Economics',
    tags: ['Silk Road', 'Trade', 'Economics'],
    readTime: 11,
    publishedAt: '2024-01-03',
    featured: false,
  },
  {
    id: '6',
    slug: 'ancient-greek-democracy',
    title: 'Athenian Democracy: Origins and Evolution of Political Systems',
    excerpt: 'Examining the birthplace of democracy and its influence on modern governance',
    author: 'Dr. Sophia Papadopoulos',
    category: 'Political Science',
    tags: ['Athens', 'Democracy', 'Political Systems'],
    readTime: 14,
    publishedAt: '2024-01-01',
    featured: false,
  },
];

const categories = ['All', 'Ancient Civilizations', 'Linguistics', 'Mathematics', 'Economics', 'Political Science'];

export function ArticleIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;

    const matchesTag = !selectedTag || article.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags)));

  return (
    <div className="px-6 py-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Research Articles</h1>
        <p className="text-zinc-400 max-w-2xl">
          Explore comprehensive research on ancient civilizations, linguistics, mathematics, and more
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Filter className="w-5 h-5 text-zinc-500 mr-2" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/10 text-zinc-400 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tag Filter */}
        {selectedCategory !== 'All' && (
          <div className="flex flex-wrap gap-2">
            <Tag className="w-5 h-5 text-zinc-500 mr-2" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-zinc-400 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-zinc-400">
        Showing {filteredArticles.length} of {articles.length} articles
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <a
              href={`/research/${article.slug}`}
              className="block p-6 rounded-2xl border border-white/10 bg-[#12121a] hover:border-amber-500/30 transition-all"
            >
              {article.featured && (
                <div className="inline-block px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium mb-4">
                  Featured
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                <span>{article.category}</span>
                <span>•</span>
                <span>{article.publishedAt}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                {article.title}
              </h3>

              <p className="text-sm text-zinc-400 mb-4 line-clamp-3">{article.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-400">{article.readTime} min read</span>
                </div>
                <span className="text-xs text-zinc-500">{article.author}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-white/10 text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </motion.article>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
          <p className="text-zinc-400">No articles found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
