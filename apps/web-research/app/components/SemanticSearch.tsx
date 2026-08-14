'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, TrendingUp } from 'lucide-react';

interface SemanticSearchProps {
  articles: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    readTime: number;
  }>;
  onResultClick: (slug: string) => void;
}

export function SemanticSearch({ articles, onResultClick }: SemanticSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof articles>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setIsSearching(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const filtered = articles.filter((article) => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = article.title.toLowerCase().includes(searchLower);
        const excerptMatch = article.excerpt.toLowerCase().includes(searchLower);
        const contentMatch = article.content.toLowerCase().includes(searchLower);
        const tagsMatch = article.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        const authorMatch = article.author.toLowerCase().includes(searchLower);
        const categoryMatch = article.category.toLowerCase().includes(searchLower);

        return titleMatch || excerptMatch || contentMatch || tagsMatch || authorMatch || categoryMatch;
      });

      setResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Semantic Search</h2>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by topic, title, author, or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
      </div>

      {/* Search Status */}
      {isSearching && (
        <div className="flex items-center gap-2 text-zinc-400 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Searching...</span>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <AnimatePresence>
          {results.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onResultClick(article.slug)}
            >
              <div className="p-3 text-sm text-zinc-400 mb-1">
                {article.category}
              </div>
              <h3 className="font-medium text-white mb-2 hover:text-amber-400 transition-colors cursor-pointer">
                {article.title}
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.readTime} min read</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isSearching && results.length === 0 && query && (
          <div className="text-center py-8 text-zinc-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No results found for "{query}"</p>
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span className="font-medium">Search Tips</span>
        </div>
        <ul className="text-xs text-zinc-400 space-y-1">
          <li>• Try specific terms like "Nile Valley", "Meroë", "Kemet"</li>
          <li>• Search by author names or historical figures</li>
          <li>• Use keywords like "mathematics", "astronomy", "linguistics"</li>
          <li>• Filter by category using the main search bar</li>
        </ul>
      </div>
    </div>
  );
}
