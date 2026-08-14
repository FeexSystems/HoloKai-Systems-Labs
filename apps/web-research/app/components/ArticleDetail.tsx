'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, User, Tag, Share2, BookOpen, ArrowLeft } from 'lucide-react';

interface ArticleDetailProps {
  article: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    readTime: number;
    publishedAt: string;
  };
  relatedArticles?: Array<{
    slug: string;
    title: string;
    excerpt: string;
    author: string;
  }>;
}

export function ArticleDetail({ article, relatedArticles = [] }: ArticleDetailProps) {
  return (
    <article className="px-6 py-24 max-w-4xl mx-auto">
      {/* Back Button */}
      <a
        href="/research"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Articles
      </a>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.publishedAt}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {article.title}
        </h1>

        <p className="text-lg text-zinc-400 mb-6">{article.excerpt}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{article.readTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{article.publishedAt}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-sm"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Share */}
        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <Share2 className="w-4 h-4" />
          Share Article
        </button>
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-invert prose-lg max-w-none"
      >
        <div className="text-zinc-300 leading-relaxed space-y-6">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </motion.div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-16 border-t border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            Related Articles
          </h2>

          <div className="space-y-4">
            {relatedArticles.map((related) => (
              <a
                key={related.slug}
                href={`/research/${related.slug}`}
                className="block p-4 rounded-xl border border-white/10 bg-[#12121a] hover:border-amber-500/30 transition-all"
              >
                <h3 className="font-bold text-white mb-2 hover:text-amber-400 transition-colors">
                  {related.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-2 line-clamp-2">{related.excerpt}</p>
                <span className="text-xs text-zinc-500">{related.author}</span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </article>
  );
}
