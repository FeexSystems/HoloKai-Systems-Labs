'use client';

import React, { useEffect, useRef } from 'react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right' | 'bottom';
  children?: React.ReactNode;
  className?: string;
}

const sideConfig = {
  left: {
    wrapper: 'items-stretch justify-start',
    panel: 'h-full max-w-sm w-full rounded-r-3xl',
    enter: 'data-[state=open]:animate-in data-[state=open]:slide-in-from-left duration-300',
    exit: 'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left duration-200',
  },
  right: {
    wrapper: 'items-stretch justify-end',
    panel: 'h-full max-w-sm w-full rounded-l-3xl',
    enter: 'animate-in slide-in-from-right duration-300',
    exit: '',
  },
  bottom: {
    wrapper: 'items-end justify-stretch',
    panel: 'w-full max-h-[80vh] rounded-t-3xl',
    enter: 'animate-in slide-in-from-bottom duration-300',
    exit: '',
  },
};

export function Drawer({
  isOpen,
  onClose,
  title,
  side = 'right',
  children,
  className = '',
}: DrawerProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const config = sideConfig[side];

  return (
    <div className={`fixed inset-0 z-50 flex ${config.wrapper}`} role="presentation">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Drawer'}
        className={[
          'relative z-10 flex flex-col',
          'bg-[#0e0e18] border border-[var(--color-border)] shadow-2xl overflow-y-auto',
          config.panel,
          config.enter,
          className,
        ].join(' ')}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          {title && (
            <h2 className="text-lg font-extrabold text-white tracking-tight">{title}</h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="ml-auto grid size-8 place-items-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 p-5">{children}</div>
      </div>
    </div>
  );
}

Drawer.displayName = 'Drawer';
