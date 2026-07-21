/**
 * Shared Security — Barrel Export
 * Единая точка входа для всех security-модулей VibeING.
 * 
 * Использование:
 *   import { applySecurityHeaders } from '@shared/security-headers';
 *   import { authRateLimit } from '@shared/auth-rate-limit';
 *   import { TransactionCreateSchema } from '@shared/zod-schemas';
 */

// Re-export everything from sub-modules
export * from './lib/security-headers';
export * from './lib/auth-rate-limit';
export * from './lib/zod-schemas';

// Default export for convenience
export { applySecurityHeaders } from './lib/security-headers';
export { authRateLimit, getRateLimitKey, getClientIP } from './lib/auth-rate-limit';
export { TransactionCreateSchema, GoalCreateSchema, ContactFormSchema, validatePasswordStrength } from './lib/zod-schemas';