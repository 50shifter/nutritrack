export type BaseEventName = 'pageview' | 'signup' | 'signin' | 'error' | 'click' | 'scroll';
export type FinFlowEventName = BaseEventName | 'dashboard_view' | 'transaction_added' | 'transaction_edited' | 'transaction_deleted' | 'goal_created' | 'budget_alert' | 'chart_filtered' | 'export_triggered' | 'category_viewed' | 'settings_updated';
export type MediCareEventName = BaseEventName | 'consultation_requested' | 'doctor_booked' | 'prescription_viewed' | 'medical_record_accessed' | 'blog_post_read' | 'video_call_started' | 'pharmacy_order_placed';
export type GreenMarketEventName = BaseEventName | 'product_viewed' | 'product_added_to_cart' | 'checkout_started' | 'order_placed' | 'payment_completed' | 'review_submitted' | 'coupon_applied' | 'wishlist_added' | 'search_performed';
export type FoodHubEventName = BaseEventName | 'restaurant_viewed' | 'menu_item_added' | 'cart_updated' | 'order_placed' | 'order_delivered' | 'rating_submitted' | 'promo_used' | 'search_performed' | 'checkout_abandoned';
export type LuxStayEventName = BaseEventName | 'hotel_viewed' | 'room_selected' | 'booking_started' | 'booking_confirmed' | 'cancellation_requested' | 'experience_booked' | 'review_submitted' | 'search_performed';
export type ArtisanEventName = BaseEventName | 'gallery_viewed' | 'project_detail_viewed' | 'contact_form_submitted' | 'portfolio_download' | 'quote_requested' | 'testimonial_read' | 'calculator_used';
export type EcosystemEventName = FinFlowEventName | MediCareEventName | GreenMarketEventName | FoodHubEventName | LuxStayEventName | ArtisanEventName;

export interface ProjectConfig {
  events?: Record<string, { category: string; funnel: boolean; description: string }>;
  name: string;
  port: number;
  color: string;
  category: string;
  funnelSteps: string[];
}

export const PROJECT_CONFIGS: ProjectConfig[] = [
  { name: 'FinFlow', port: 3001, color: '#8b5cf6', category: 'Finance', funnelSteps: ['pageview', 'signup', 'signin', 'dashboard_view', 'transaction_added', 'goal_created'] },
  { name: 'MediCare', port: 3002, color: '#f43f5e', category: 'Healthcare', funnelSteps: ['pageview', 'signup', 'consultation_requested', 'doctor_booked', 'video_call_started'] },
  { name: 'GreenMarket', port: 3003, color: '#10b981', category: 'E-commerce', funnelSteps: ['pageview', 'signup', 'product_viewed', 'product_added_to_cart', 'order_placed'] },
  { name: 'FoodHub', port: 3004, color: '#f59e0b', category: 'Food Delivery', funnelSteps: ['pageview', 'signup', 'restaurant_viewed', 'menu_item_added', 'order_placed'] },
  { name: 'LuxStay', port: 3005, color: '#0ea5e9', category: 'Travel & Hotels', funnelSteps: ['pageview', 'signup', 'hotel_viewed', 'room_selected', 'booking_confirmed'] },
  { name: 'Artisan', port: 3006, color: '#eab308', category: 'Portfolio', funnelSteps: ['pageview', 'project_detail_viewed', 'contact_form_submitted', 'quote_requested'] },
];

export interface ProjectHealthStatus {
  name: string;
  port: number;
  color: string;
  online: boolean;
  lastChecked: string;
  avgResponseTime: number;
  errorRate: number;
}