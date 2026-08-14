'use client';

import React, { useEffect, useState, useCallback } from 'react';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

const variantStyles: Record<ToastVariant, { wrapper: string; icon: React.ReactNode }> = {
  default: {
    wrapper: 'border-white/15 bg-[#1a1a26]',
    icon: (
      <svg className="text-zinc-400" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  success: {
    wrapper: 'border-emerald-500/30 bg-[#0a1a12]',
    icon: (
      <svg className="text-emerald-400" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 8l2.5 2.5L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  warning: {
    wrapper: 'border-[var(--color-border)]/30 bg-[#1a1204]',
    icon: (
      <svg className="text-[var(--color-brand)]" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2L15 14H1L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 7v3M8 12v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  danger: {
    wrapper: 'border-red-500/30 bg-[#1a0808]',
    icon: (
      <svg className="text-red-400" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  info: {
    wrapper: 'border-sky-500/30 bg-[#060e1a]',
    icon: (
      <svg className="text-sky-400" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

/* ── Single Toast ─────────────────────────────────────────── */
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const variant = toast.variant ?? 'default';
  const styles = variantStyles[variant];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl',
        'animate-in slide-in-from-right-4 fade-in duration-200 min-w-[280px] max-w-sm',
        styles.wrapper,
      ].join(' ')}
    >
      <span className="mt-0.5 shrink-0">{styles.icon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.message}</p>
        {toast.description && (
          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.description}</p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 mt-0.5 text-zinc-500 hover:text-white transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

/* ── Toast Container ──────────────────────────────────────── */
export interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

const positionStyles = {
  'top-right':    'top-4 right-4 items-end',
  'top-center':   'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-center':'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

export function ToastContainer({ toasts, onDismiss, position = 'bottom-right' }: ToastContainerProps) {
  return (
    <div
      aria-label="Notifications"
      className={`fixed z-[100] flex flex-col gap-2 ${positionStyles[position]}`}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* ── useToast hook ────────────────────────────────────────── */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...item, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
