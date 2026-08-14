'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo
    });

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-6">
          <div className="max-w-md w-full">
            <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/5">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>

              <h2 className="text-2xl font-bold text-center text-white mb-4">
                Something went wrong
              </h2>

              <p className="text-zinc-400 text-center mb-6">
                We encountered an unexpected error. This has been logged and our team will investigate.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 p-4 rounded-lg bg-black/30 border border-white/10">
                  <summary className="cursor-pointer text-sm text-amber-400 font-medium mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-red-300 overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full py-3 px-6 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
