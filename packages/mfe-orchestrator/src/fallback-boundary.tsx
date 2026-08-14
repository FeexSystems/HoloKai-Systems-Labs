'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  remoteName: string;
  fallback?: ReactNode;
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Self-Healing MFE Error Boundary
 * Prevents sub-tree remote container failures from white-screening the host application.
 */
export class MFEErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Self-Healing MFE Boundary] Caught error in remote "${this.props.remoteName}":`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-xl border border-amber-500/20 bg-zinc-950/80 p-6 space-y-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Self-Healing Recovery Active — {this.props.remoteName}
          </div>
          <p className="text-sm text-zinc-300">
            The remote component experienced a transient load failure. Main shell state preserved.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-white hover:bg-zinc-700 transition-colors"
          >
            Retry Remote Container
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
