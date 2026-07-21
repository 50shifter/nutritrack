/**
 * Metrics Configuration
 * Определение всех поддерживаемых событий и их свойств
 */

export type MetricEventName =
  | 'pageview'
  | 'signup'
  | 'signin'
  | 'dashboard_view'
  | 'transaction_added'
  | 'transaction_edited'
  | 'transaction_deleted'
  | 'goal_created'
  | 'budget_alert'
  | 'chart_filtered'
  | 'export_triggered'
  | 'category_viewed'
  | 'settings_updated';

export interface MetricEvent {
  name: MetricEventName;
  timestamp: string;
  userId?: string;
  sessionId: string;
  page: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  props?: Record<string, string | number | boolean | null>;
}

export interface MetricCategory {
  name: string;
  description: string;
  events: MetricEventName[];
  dashboard: boolean; // Показывать в дашборде
  funnel: boolean; // Участвовать в воронке
}

export const METRIC_CATEGORIES: Record<string, MetricCategory> = {
  engagement: {
    name: 'Вовлечённость',
    description: 'Просмотры страниц и сессии',
    events: ['pageview'],
    dashboard: true,
    funnel: false,
  },
  auth: {
    name: 'Авторизация',
    description: 'Регистрации и входы',
    events: ['signup', 'signin'],
    dashboard: true,
    funnel: true,
  },
  dashboard: {
    name: 'Дашборд',
    description: 'Использование дашборда',
    events: ['dashboard_view', 'chart_filtered'],
    dashboard: true,
    funnel: false,
  },
  transactions: {
    name: 'Транзакции',
    description: 'Управление транзакциями',
    events: ['transaction_added', 'transaction_edited', 'transaction_deleted'],
    dashboard: true,
    funnel: true,
  },
  goals: {
    name: 'Цели',
    description: 'Финансовые цели и бюджеты',
    events: ['goal_created', 'budget_alert'],
    dashboard: true,
    funnel: true,
  },
  other: {
    name: 'Другое',
    description: 'Дополнительные действия',
    events: ['export_triggered', 'category_viewed', 'settings_updated'],
    dashboard: true,
    funnel: false,
  },
};

export const FUNNEL_STEPS = ['pageview', 'signup', 'signin', 'dashboard_view', 'transaction_added', 'goal_created'] as const;

export const METRICS_API_ENDPOINT = '/api/metrics';

// Generate unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}