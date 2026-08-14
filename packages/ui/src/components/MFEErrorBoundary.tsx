'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  zoneName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MFEErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[MFE Error Boundary: ${this.props.zoneName || 'Unknown Zone'}]`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-12 w-full min-h-[400px] bg-[#05050a] border border-red-500/20 rounded-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Zone Synchronization Failure</h2>
          <p className="text-zinc-400 max-w-md mb-6">
            The {this.props.zoneName || 'MFE'} zone encountered a critical error during rendering or data fetching.
          </p>
          <div className="bg-red-500/5 border border-red-500/20 rounded p-4 text-left w-full max-w-xl overflow-x-auto">
            <code className="text-xs text-red-400 font-mono">
              {this.state.error?.message || 'Unknown Error'}
            </code>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Attempt Re-sync
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
