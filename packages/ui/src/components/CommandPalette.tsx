'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [department, setDepartment] = useState<'engineering' | 'product' | 'marketing'>('engineering');
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Also listen for custom event in case it's triggered elsewhere
  useEffect(() => {
    const handleCustomOpen = () => setIsOpen(true);
    document.addEventListener('open-command-palette', handleCustomOpen);
    return () => document.removeEventListener('open-command-palette', handleCustomOpen);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/engine/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, context: { department } }),
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data.response || 'Synthesis complete.');
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      setResponse(`Execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { id: 'engineering', label: 'Engineering' },
    { id: 'product', label: 'Product' },
    { id: 'marketing', label: 'Marketing' }
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <span className="text-brand font-mono">/</span>
              <form onSubmit={handleSubmit} className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask HoloKai Agents (e.g. 'Audit the frontend performance')"
                  className="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-lg font-light"
                />
              </form>
            </div>
            
            <div className="p-4 bg-surface">
              <div className="flex gap-2 mb-4">
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => setDepartment(dept.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      department === dept.id 
                        ? 'bg-brand/20 text-brand border border-brand/50' 
                        : 'bg-surface-hover text-muted-foreground hover:text-foreground border border-transparent'
                    }`}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="py-8 text-center text-brand/60 font-mono text-sm animate-pulse">
                  Agent {department} is processing...
                </div>
              )}

              {response && !loading && (
                <div className="p-4 bg-surface-elevated rounded-xl border border-border text-foreground/80 font-light text-sm whitespace-pre-wrap max-h-60 overflow-y-auto scrollbar-thin">
                  {response}
                </div>
              )}

              {!response && !loading && (
                <div className="py-6 text-center text-muted-foreground text-xs font-mono">
                  Press Return to Execute · Esc to Cancel
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
