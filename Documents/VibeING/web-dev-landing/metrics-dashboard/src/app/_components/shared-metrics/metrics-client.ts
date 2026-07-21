/**
 * Shared Metrics Client — Universal tracking library for VibeING ecosystem
 * Drop this into any project to enable metrics collection
 */

import type { EcosystemEventName } from './metrics-config';

// --- Types ---
export interface MetricsEvent {
  name: EcosystemEventName;
  timestamp: string;
  projectId: string;
  userId?: string;
  sessionId: string;
  page: string;
  referrer?: string;
  props?: Record<string, string | number | boolean | null>;
}

export interface MetricsConfig {
  projectId: string;
  endpoint?: string;  // e.g., '/api/metrics'
  flushInterval?: number;  // ms, default 5000
  debug?: boolean;
}

// --- Default Config ---
const DEFAULT_CONFIG: MetricsConfig = {
  projectId: 'unknown',
  endpoint: '/api/metrics',
  flushInterval: 5000,
  debug: false,
};

let config: MetricsConfig = { ...DEFAULT_CONFIG };

// --- Session Management ---
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server-side';
  
  const key = `vibeing_session_${config.projectId}`;
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

// --- Event Queue ---
const EVENT_QUEUE: MetricsEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let isFlushing = false;

// --- Logging ---
function debugLog(...args: unknown[]): void {
  if (config.debug && typeof console !== 'undefined') {
    console.log(`[Metrics:${config.projectId}]`, ...args);
  }
}

// --- Queue Management ---
export function flushEvents(): void {
  if (isFlushing || EVENT_QUEUE.length === 0) return;
  
  isFlushing = true;
  const batch = EVENT_QUEUE.splice(0, 50); // Max 50 per batch
  
  debugLog(`Flushing ${batch.length} events`);
  
  sendBatch(batch).finally(() => {
    isFlushing = false;
    // Continue flushing if more events arrived
    if (EVENT_QUEUE.length > 0) {
      flushEvents();
    }
  });
}

function startFlushTimer(): void {
  if (flushTimer) return;
  flushTimer = setInterval(flushEvents, config.flushInterval || 5000);
}

function stopFlushTimer(): void {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

// --- Network Send ---
async function sendBatch(events: MetricsEvent[]): Promise<boolean> {
  try {
    const response = await fetch(config.endpoint || '/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      keepalive: true,
    });
    
    if (!response.ok) {
      debugLog(`Failed to send events: ${response.status}`);
      return false;
    }
    
    debugLog(`Sent ${events.length} events successfully`);
    return true;
  } catch (error) {
    debugLog(`Network error sending events:`, error);
    // Re-queue failed events
    EVENT_QUEUE.unshift(...events);
    return false;
  }
}

// --- Public API ---
export function initMetrics(cfg: Partial<MetricsConfig>): void {
  config = { ...DEFAULT_CONFIG, ...cfg };
  startFlushTimer();
  debugLog(`Metrics initialized for ${config.projectId}`);
}

export function trackEvent(
  name: EcosystemEventName,
  props: Record<string, string | number | boolean | null> = {}
): void {
  const event: MetricsEvent = {
    name,
    timestamp: new Date().toISOString(),
    projectId: config.projectId,
    sessionId: getSessionId(),
    page: typeof window !== 'undefined' ? window.location.pathname : 'server',
    referrer: typeof window !== 'undefined' ? document.referrer || undefined : undefined,
    props,
  };
  
  EVENT_QUEUE.push(event);
  
  // Flush immediately for important events
  const immediateEvents = ['signup', 'signin', 'order_placed', 'booking_confirmed', 
                          'consultation_requested', 'contact_form_submitted', 'quote_requested'];
  
  if (immediateEvents.includes(name)) {
    flushEvents();
  } else if (!flushTimer) {
    startFlushTimer();
  }
}

export function trackPageview(page?: string): void {
  trackEvent('pageview', { page: page || window.location.pathname });
}

// --- Utility ---
export function destroyMetrics(): void {
  stopFlushTimer();
  flushEvents(); // Flush remaining events
  debugLog('Metrics destroyed');
}