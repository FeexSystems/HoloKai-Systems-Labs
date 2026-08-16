'use client';

import React, { useState } from 'react';

export interface AccordionItemData {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className = '' }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-border bg-surface overflow-hidden transition-colors"
          >
            <button
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full px-6 py-5 text-left text-base md:text-lg font-bold text-white hover:text-brand flex items-center justify-between gap-4 transition-colors"
            >
              <span>{item.question}</span>
              <span
                className={`text-brand font-mono text-xl transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                ↓
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-sm text-zinc-300 leading-relaxed border-t border-white/5 pt-4 animate-in fade-in duration-200">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
