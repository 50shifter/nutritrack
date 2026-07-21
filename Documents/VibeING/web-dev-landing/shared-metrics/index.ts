/**
 * Shared Metrics — Barrel Export
 * Единая точка входа для всех метрик VibeING.
 * 
 * Использование:
 *   import { initMetrics, trackEvent, PROJECT_CONFIGS } from '@shared-metrics';
 */

export * from './lib/metrics-client';
export * from './lib/metrics-config';

// Default convenience exports
export { initMetrics, trackEvent, trackPageview, destroyMetrics } from './lib/metrics-client';
export { PROJECT_CONFIGS } from './lib/metrics-config';