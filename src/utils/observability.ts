/**
 * Uyaphi Sentry-like Observability & Telemetry Framework
 */

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "fatal";
  category: "auth" | "api" | "database" | "ui" | "network";
  message: string;
  context?: Record<string, any>;
}

class UyaphiSentryTracker {
  private events: TelemetryEvent[] = [];
  private maxLogs = 50;

  constructor() {
    if (typeof window !== "undefined") {
      // Auto-catch global uncaught errors
      window.addEventListener("error", (event) => {
        this.logError("fatal", "ui", `Uncaught global error: ${event.message}`, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });

      // Auto-catch unhandled promise rejections
      window.addEventListener("unhandledrejection", (event) => {
        this.logError("error", "network", `Unhandled Promise rejection: ${event.reason?.message || event.reason}`, {
          reason: event.reason
        });
      });

      // Seed mock telemetry data for visualization in the telemetry panel
      this.seedInitialLogs();
    }
  }

  private seedInitialLogs() {
    this.events = [
      {
        id: "evt_001",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        level: "info",
        category: "database",
        message: "Applied relational read-replica optimizations for high-traffic driver query lookups (Index matching 'licensePlate_idx' active).",
      },
      {
        id: "evt_002",
        timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
        level: "info",
        category: "auth",
        message: "Clerk Auth Provider initialised with Role-Based Access Control parameters (Active permissions: ADMIN, MODERATOR, COMMUTER).",
      },
      {
        id: "evt_003",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        level: "warn",
        category: "network",
        message: "CORS policy blocked preflight header from rogue sandbox domains. Restricting requests strictly to internal Uyaphi zone.",
      },
      {
        id: "evt_004",
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        level: "info",
        category: "api",
        message: "Rate limiting system initialized: 60 requests per minute maximum budget allocated per UUID sector.",
      },
    ];
  }

  public logInfo(category: TelemetryEvent["category"], message: string, context?: Record<string, any>) {
    this.addEvent("info", category, message, context);
  }

  public logWarn(category: TelemetryEvent["category"], message: string, context?: Record<string, any>) {
    this.addEvent("warn", category, message, context);
  }

  public logError(level: "error" | "fatal", category: TelemetryEvent["category"], message: string, context?: Record<string, any>) {
    this.addEvent(level, category, message, context);
  }

  private addEvent(level: TelemetryEvent["level"], category: TelemetryEvent["category"], message: string, context?: Record<string, any>) {
    const event: TelemetryEvent = {
      id: `evt_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      context
    };

    console.log(`[Uyaphi-Sentry] [${level.toUpperCase()}] [${category}] ${message}`, context || "");

    // Push local
    this.events.unshift(event);
    if (this.events.length > this.maxLogs) {
      this.events.pop();
    }

    // Persist to storage
    try {
      localStorage.setItem("uyaphi_sentry_logs", JSON.stringify(this.events));
    } catch (e) {
      // Storage full or sandboxed
    }

    // Forward to Server API for active central monitoring
    if (typeof window !== "undefined") {
      fetch("/api/observe/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)
      }).catch((err) => {
        // Suppress failure of log reporter loop
      });
    }
  }

  public getEvents(): TelemetryEvent[] {
    try {
      const saved = localStorage.getItem("uyaphi_sentry_logs");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return this.events;
  }

  public clearLogs() {
    this.events = [];
    try {
      localStorage.removeItem("uyaphi_sentry_logs");
    } catch (e) {}
  }
}

export const Sentry = new UyaphiSentryTracker();
