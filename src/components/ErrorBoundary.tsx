import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, ShieldAlert, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  // Override typings for local environment compatibility
  props!: Props;
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };
  setState!: (state: Partial<State> | ((prevState: State) => Partial<State>)) => void;

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ error, errorInfo });
    
    // In-memory or localStorage error log for our Sentry-like observability
    try {
      const logs = JSON.parse(localStorage.getItem("uyaphi_crash_logs") || "[]");
      logs.push({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
      localStorage.setItem("uyaphi_crash_logs", JSON.stringify(logs.slice(-20))); // Keep last 20 logs
    } catch (e) {
      console.error("Failed to save error to local crash logs:", e);
    }
  }

  private handleReset = () => {
    // Clear potentially corrupted local state
    try {
      localStorage.removeItem("saferide_logged_in");
      localStorage.removeItem("saferide_user_role");
      // Keep name/email so form data persistence isn't totally wiped unless they want to
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    // Hard refresh back to homepage
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0F1F] text-white p-6 relative overflow-hidden font-sans">
          {/* Neon background blur */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-red-500/10 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />

          <div className="w-full max-w-xl bg-zinc-950/80 border-2 border-red-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl relative backdrop-blur-md text-center space-y-6">
            
            {/* Security Indicator */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                SYSTEM EXCEPTION (404 / CRASH)
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
                Uyaphi Security Interrupt
              </h1>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                The transit safety dashboard has encountered an unexpected operational anomaly or the requested path was not resolved.
              </p>
            </div>

            {/* Error logs */}
            {this.state.error && (
              <div className="bg-zinc-950/90 border border-zinc-900 rounded-2xl p-4 text-left font-mono text-xs text-red-400 space-y-2 overflow-auto max-h-40 max-w-full">
                <p className="font-bold text-zinc-300">Diagnostics Log:</p>
                <p className="text-[11px] leading-relaxed break-all whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p className="text-[10px] text-zinc-500 leading-relaxed max-w-full whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <RotateCcw className="w-4 h-4" />
                Reset & Clear Session
              </button>
              
              <button
                onClick={() => { window.location.href = "/"; }}
                className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 border border-zinc-800 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>

            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest pt-2 border-t border-zinc-900">
              Observability Provider: Internal Uyaphi Sentry Core
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
