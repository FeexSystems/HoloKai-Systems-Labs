'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, X, Save, Sparkles, AlertCircle } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  category: string;
}

interface MetadataTaggerProps {
  documentId: string;
  existingTags?: Tag[];
  suggestedTags?: Tag[];
  onSave: (tags: Tag[]) => void;
  onCancel?: () => void;
}

const tagCategories = [
  { id: 'topic', name: 'Topic', color: 'bg-amber-500/20 text-amber-400' },
  { id: 'civilization', name: 'Civilization', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'period', name: 'Period', color: 'bg-emerald-500/20 text-emerald-400' },
  { id: 'language', name: 'Language', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'custom', name: 'Custom', color: 'bg-zinc-500/20 text-zinc-400' },
];

const suggestedTags: Tag[] = [
  { id: '1', name: 'Kemet', category: 'civilization' },
  { id: '2', name: 'Nile Valley', category: 'topic' },
  { id: '3', name: 'Ancient Egypt', category: 'period' },
  { id: '4', name: 'Latin', category: 'language' },
  { id: '5', name: 'Mathematics', category: 'topic' },
  { id: '6', name: 'Astronomy', category: 'topic' },
  { id: '7', name: 'Meroë', category: 'civilization' },
  { id: '8', name: 'Medieval', category: 'period' },
  { id: '9', name: 'Sanskrit', category: 'language' },
  { id: '10', name: 'Philosophy', category: 'topic' },
];

export function MetadataTagger({ documentId, existingTags = [], suggestedTags = suggestedTags, onSave, onCancel }: MetadataTaggerProps) {
  const [tags, setTags] = useState<Tag[]>(existingTags);
  const [newTag, setNewTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('custom');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = (tag: Tag) => {
    if (tags.some((t) => t.id === tag.id)) {
      setError('Tag already exists');
      return;
    }
    setTags([...tags, tag]);
    setError(null);
  };

  const removeTag = (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId));
    setError(null);
  };

  const createNewTag = () => {
    if (!newTag.trim()) {
      setError('Tag name cannot be empty');
      return;
    }

    const newTagObj: Tag = {
      id: Date.now().toString(),
      name: newTag.trim(),
      category: selectedCategory,
    };

    addTag(newTagObj);
    setNewTag('');
  };

  const handleSave = () => {
    onSave(tags);
  };

  const getCategoryColor = (category: string) => {
    return tagCategories.find((c) => c.id === category)?.color || 'bg-zinc-500/20 text-zinc-400';
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Metadata Tags</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">Current Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getCategoryColor(tag.category)}`}
            >
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">{tag.name}</span>
              <button
                onClick={() => removeTag(tag.id)}
                className="ml-1 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-zinc-500 italic">No tags added yet</p>
          )}
        </div>
      </div>

      {/* Add New Tag */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">Add New Tag</label>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            {tagCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter tag name..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                createNewTag();
              }
            }}
          />
          <button
            onClick={createNewTag}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Tags */}
      <div className="mb-6">
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
        </button>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              {suggestedTags
                .filter((tag) => !tags.some((t) => t.id === tag.id))
                .map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => addTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left`}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-white">{tag.name}</span>
                      <span className="text-xs text-zinc-500 ml-auto">{tag.category}</span>
                    </div>
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        Save Changes
      </button>
    </div>
  );
}
