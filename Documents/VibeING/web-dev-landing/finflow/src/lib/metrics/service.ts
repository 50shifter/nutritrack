import type { MetricEvent, MetricEventName } from './config';
import { METRICS_API_ENDPOINT, generateSessionId } from './config';

// Session management
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = localStorage.getItem('finflow_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('finflow_session_id', sessionId);
  }
  return sessionId;
}

function getSessionStart(): string {
  let start = localStorage.getItem('finflow_session_start');
  if (!start) {
    start = new Date().toISOString();
    localStorage.setItem('finflow_session_start', start);
  }
  return start;
}

// Flush queue periodically
const EVENT_QUEUE: MetricEvent[] = [];
const QUEUE_FLUSH_INTERVAL = 5000; // 5 seconds
let flushTimer: ReturnType<typeof setInterval> | null = null;

function flushQueue(): void {
  if (EVENT_QUEUE.length === 0) return;

  const batch = EVENT_QUEUE.splice(0, 50); // Max 50 events per batch
  sendEvents(batch);
}

function startQueueFlush(): void {
  if (flushTimer) return;
  flushTimer = setInterval(() => {
    flushQueue();
  }, QUEUE_FLUSH_INTERVAL);
}

async function sendEvents(events: MetricEvent[]): Promise<void> {
  try {
    await fetch(METRICS_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      // Keep-alive for background requests
      keepalive: true,
    });
  } catch (error) {
    console.warn('[Metrics] Failed to send events:', error);
    // Keep events in queue if send failed
    EVENT_QUEUE.unshift(...events);
  }
}

export async function trackEvent(
  name: MetricEventName,
  props: Record<string, string | number | boolean | null> = {}
): Promise<void> {
  const event: MetricEvent = {
    name,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    page: typeof window !== 'undefined' ? window.location.pathname : 'server',
    referrer: typeof window !== 'undefined' ? document.referrer || undefined : undefined,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    props,
  };

  // Add to queue
  EVENT_QUEUE.push(event);

  // Flush immediately for important events
  if (['signup', 'signin', 'transaction_added', 'goal_created'].includes(name)) {
    sendEvents([event]);
  } else {
    // Start queue flush timer for less critical events
    if (!flushTimer) {
      startQueueFlush();
    }
  }
}

// Pageview tracking
export function trackPageview(page: string = window.location.pathname): void {
  trackEvent('pageview', { page });
}

// User tracking
export function trackSignup(userId: string): void {
  trackEvent('signup', { userId });
}

export function trackSignin(userId: string): void {
  trackEvent('signin', { userId });
}

// Dashboard tracking
export function trackDashboardView(): void {
  trackEvent('dashboard_view');
}

export function trackChartFilter(filterType: string, range: string): void {
  trackEvent('chart_filtered', { filterType, range });
}

// Transaction tracking
export function trackTransactionAdded(id: string, amount: number, category: string): void {
  trackEvent('transaction_added', { id, amount, category });
}

export function trackTransactionEdited(id: string, changes: string[]): void {
  trackEvent('transaction_edited', { id, changes: changes.join(',') });
}

export function trackTransactionDeleted(id: string): void {
  trackEvent('transaction_deleted', { id });
}

// Goal tracking
export function trackGoalCreated(id: string, target: number): void {
  trackEvent('goal_created', { id, target });
}

export function trackBudgetAlert(category: string, limit: number, actual: number): void {
  trackEvent('budget_alert', { category, limit, actual });
}

// Other tracking
export function trackExport(format: string): void {
  trackEvent('export_triggered', { format });
}

export function trackCategoryView(categoryId: string): void {
  trackEvent('category_viewed', { categoryId });
}

export function trackSettingsUpdated(setting: string): void {
  trackEvent('settings_updated', { setting });
}