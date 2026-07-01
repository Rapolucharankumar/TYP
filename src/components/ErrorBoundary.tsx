'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col paper-pattern bg-background text-foreground">
          <div className="flex-grow flex items-center justify-center px-4">
            <div className="border border-card-border bg-card-bg rounded-[32px] p-10 max-w-md text-center shadow-lg space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-4xl font-serif font-black text-accent">!</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Something went wrong</h1>
              <p className="text-xs text-muted leading-relaxed">
                An unexpected error occurred. Please try refreshing the page or return to the homepage.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center space-x-2 bg-accent text-background px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-accent/90 shadow-md cursor-pointer"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Refresh Page</span>
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center space-x-2 bg-card-bg border border-card-border px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-card-border/20 shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Go Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}