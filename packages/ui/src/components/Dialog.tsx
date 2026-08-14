'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className = '',
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <dialog
        ref={dialogRef}
        open
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
        tabIndex={-1}
        className={[
          'relative z-10 w-full rounded-3xl border border-[var(--color-border)]',
          'bg-gradient-to-b from-[#181826] to-[#0a0a0f]',
          'shadow-2xl p-6 md:p-8 outline-none',
          'animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200',
          sizeStyles[size],
          className,
        ].join(' ')}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {title && (
          <h2
            id="dialog-title"
            className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-2"
          >
            {title}
          </h2>
        )}
        {description && (
          <p id="dialog-description" className="text-sm text-zinc-400 mb-6 leading-relaxed">
            {description}
          </p>
        )}

        <div className={title || description ? 'mt-4' : ''}>{children}</div>
      </dialog>
    </div>
  );
}

Dialog.displayName = 'Dialog';
