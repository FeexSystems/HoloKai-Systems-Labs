'use client';

import React, { createContext, useContext, useState, useId } from 'react';

/* ── Context ─────────────────────────────────────────────── */
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs sub-components must be used inside <Tabs>');
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────── */
export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue = '', value, onValueChange, children, className = '' }: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultValue);
  const baseId = useId();

  const activeTab = value ?? internalActive;
  const setActiveTab = (id: string) => {
    setInternalActive(id);
    onValueChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={`flex flex-col ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ── Tab List ─────────────────────────────────────────────── */
export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={`flex gap-1 rounded-2xl bg-surface border border-white/10 p-1 ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Tab Trigger ──────────────────────────────────────────── */
export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({ value, children, disabled = false, className = '' }: TabsTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={isActive}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveTab(value)}
      className={[
        'relative flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-border/60',
        isActive
          ? 'bg-brand/15 text-brand-contrast border border-border'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-brand" aria-hidden="true" />
      )}
    </button>
  );
}

/* ── Tab Content ──────────────────────────────────────────── */
export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { activeTab, baseId } = useTabsContext();
  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={`outline-none animate-in fade-in duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
