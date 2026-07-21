/**
 * Shared Metrics Configuration — VibeING Ecosystem
 * Common event types and project-specific event definitions
 */

// Base event types shared across all projects
export type BaseEventName =
  | 'pageview'
  | 'signup'
  | 'signin'
  | 'error'
  | 'click'
  | 'scroll';

// === FinFlow Events (Financial Dashboard) ===
export type FinFlowEventName = BaseEventName |
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

export const FinFlowEvents: Record<FinFlowEventName, { category: string; funnel: boolean; description: string }> = {
  pageview: { category: 'engagement', funnel: false, description: 'Page view' },
  signup: { category: 'auth', funnel: true, description: 'User registration' },
  signin: { category: 'auth', funnel: true, description: 'User login' },
  dashboard_view: { category: 'engagement', funnel: false, description: 'Dashboard opened' },
  transaction_added: { category: 'transactions', funnel: true, description: 'Transaction created' },
  transaction_edited: { category: 'transactions', funnel: false, description: 'Transaction edited' },
  transaction_deleted: { category: 'transactions', funnel: false, description: 'Transaction deleted' },
  goal_created: { category: 'goals', funnel: true, description: 'Financial goal created' },
  budget_alert: { category: 'goals', funnel: false, description: 'Budget limit alert' },
  chart_filtered: { category: 'engagement', funnel: false, description: 'Chart filter applied' },
  export_triggered: { category: 'other', funnel: false, description: 'Data exported' },
  category_viewed: { category: 'other', funnel: false, description: 'Category viewed' },
  settings_updated: { category: 'other', funnel: false, description: 'Settings changed' },
};

// === MediCare Events (Medical Portal) ===
export type MediCareEventName = BaseEventName |
  | 'consultation_requested'
  | 'doctor_booked'
  | 'prescription_viewed'
  | 'medical_record_accessed'
  | 'blog_post_read'
  | 'video_call_started'
  | 'pharmacy_order_placed';

export const MediCareEvents: Record<MediCareEventName, { category: string; funnel: boolean; description: string }> = {
  pageview: { category: 'engagement', funnel: false, description: 'Page view' },
  signup: { category: 'auth', funnel: true, description: 'Patient registration' },
  signin: { category: 'auth', funnel: true, description: 'Patient login' },
  consultation_requested: { category: 'medical', funnel: true, description: 'Consultation requested' },
  doctor_booked: { category: 'medical', funnel: true, description: 'Doctor appointment booked' },
  prescription_viewed: { category: 'medical', funnel: false, description: 'Prescription viewed' },
  medical_record_accessed: { category: 'medical', funnel: false, description: 'Medical record accessed' },
  blog_post_read: { category: 'content', funnel: false, description: 'Health blog post read' },
  video_call_started: { category: 'medical', funnel: true, description: 'Video consultation started' },
  pharmacy_order_placed: { category: 'pharmacy', funnel: true, description: 'Pharmacy order placed' },
};

// === GreenMarket Events (E-commerce) ===
export type GreenMarketEventName = BaseEventName |
  | 'product_viewed'
  | 'product_added_to_cart'
  | 'checkout_started'
  | 'order_placed'
  | 'payment_completed'
  | 'review_submitted'
  | 'coupon_applied'
  | 'wishlist_added'
  | 'search_performed';

export const GreenMarketEvents: Record<GreenMarketEventName, { category: string; funnel: boolean; description: string }> = {
  pageview: { category: 'engagement', funnel: false, description: 'Page view' },
  signup: { category: 'auth', funnel: true, description: 'User registration' },
  signin: { category: 'auth', funnel: true, description: 'User login' },
  product_viewed: { category: 'browsing', funnel: true, description: 'Product page viewed' },
  product_added_to_cart: { category: 'browsing', funnel: true, description: 'Product added to cart' },
  checkout_started: { category: 'purchase', funnel: true, description: 'Checkout initiated' },
  order_placed: { category: 'purchase', funnel: true, description: 'Order placed' },
  payment_completed: { category: 'purchase', funnel: true, description: 'Payment completed' },
  review_submitted: { category: 'engagement', funnel: false, description: 'Product review submitted' },
  coupon_applied: { category: 'purchase', funnel: false, description: 'Coupon code applied' },
  wishlist_added: { category: 'browsing', funnel: false, description: 'Product added to wishlist' },
  search_performed: { category: 'engagement', funnel: false, description: 'Product search performed' },
};

// === FoodHub Events (Food Delivery) ===
export type FoodHubEventName = BaseEventName |
  | 'restaurant_viewed'
  | 'menu_item_added'
  | 'cart_updated'
  | 'order_placed'
  | 'order_delivered'
  | 'rating_submitted'
  | 'promo_used'
  | 'search_performed'
  | 'checkout_abandoned';

export const FoodHubEvents: Record<FoodHubEventName, { category: string; funnel: boolean; description: string }> = {
  pageview: { category: 'engagement', funnel: false, description: 'Page view' },
  signup: { category: 'auth', funnel: true, description: 'User registration' },
  signin: { category: 'auth', funnel: true, description: 'User login' },
  restaurant_viewed: { category: 'browsing', funnel: true, description: 'Restaurant page viewed' },
  menu_item_added: { category: 'ordering', funnel: true, description: 'Menu item added to order' },
  cart_updated: { category: 'ordering', funnel: false, description: 'Cart updated' },
  order_placed: { category: 'ordering', funnel: true, description: 'Food order placed' },
  order_delivered: { category: 'ordering', funnel: true, description: 'Order delivered' },
  rating_submitted: { category: 'engagement', funnel: false, description: 'Rating/submission given' },
  promo_used: { category: 'ordering', funnel: false, description: 'Promo code used' },
  search_performed: { category: 'browsing', funnel: false, description: 'Food search performed' },
  checkout_abandoned: { category: 'ordering', funnel: false, description: 'Checkout abandoned' },
};

// === LuxStay Events (Hotel Booking) ===
export type LuxStayEventName = BaseEventName |
  | 'hotel_viewed'
  | 'room_selected'
  | 'booking_started'
  | 'booking_confirmed'
  | 'cancellation_requested'
  | 'experience_booked'
  | 'review_submitted'
  | 'search_performed';

export const LuxStayEvents: Record<LuxStayEventName, { category: string; funnel: boolean; description: string }> = {
  pageview: { category: 'engagement', funnel: false, description: 'Page view' },
  signup: { category: 'auth', funnel: true, description: 'User registration' },
  signin: { category: 'auth', funnel: true, description: 'User login' },
  hotel_viewed: { category: 'browsing', funnel: true, description: 'Hotel page viewed' },
  room_selected: { category: 'booking', funnel: true, description: 'Room selected' },
  booking_started: { category: 'booking', funnel: true, description: 'Booking initiated' },
  booking_confirmed: { category: 'booking', funnel: true, description: 'Booking confirmed' },
  cancellation_requested: { category: 'booking', funnel: false, description: 'Booking cancelled' },
  experience_booked: { category: 'booking', funnel: true, description: 'Experience booked' },
  review_submitted: { category: 'engagement', funnel: false, description: 'Hotel review submitted' },
  search_performed: { category: 'browsing', funnel: false, description: 'Hotel search performed' },
};

// === Artisan Events (Portfolio/Craftsman) ===
export type ArtisanEventName = BaseEventName |
  | 'gallery_viewed'
  | 'project_detail_viewed'
  | 'contact_form_submitted'
  | 'portfolio_download'
  | 'quote_requested'
  | 'testimonial_read'
  | 'calculator_used';

export const ArtisanEvents: Record<ArtisanEventName, { category: string; funnel: boolean; description: string }> = {
  pageview: { category: 'engagement', funnel: false, description: 'Page view' },
  signup: { category: 'auth', funnel: true, description: 'Registration (if applicable)' },
  signin: { category: 'auth', funnel: true, description: 'Login (if applicable)' },
  gallery_viewed: { category: 'browsing', funnel: false, description: 'Gallery viewed' },
  project_detail_viewed: { category: 'browsing', funnel: true, description: 'Project detail viewed' },
  contact_form_submitted: { category: 'leads', funnel: true, description: 'Contact form submitted' },
  portfolio_download: { category: 'engagement', funnel: false, description: 'Portfolio downloaded' },
  quote_requested: { category: 'leads', funnel: true, description: 'Price quote requested' },
  testimonial_read: { category: 'engagement', funnel: false, description: 'Testimonial read' },
  calculator_used: { category: 'engagement', funnel: false, description: 'Calculator tool used' },
};

// === Ecosystem-wide aggregate types ===
export type EcosystemEventName = 
  | FinFlowEventName 
  | MediCareEventName 
  | GreenMarketEventName 
  | FoodHubEventName 
  | LuxStayEventName 
  | ArtisanEventName;

// === Project configuration ===
export interface ProjectConfig {
  name: string;
  port: number;
  color: string;
  category: string;
  events: Record<string, { category: string; funnel: boolean; description: string }>;
  funnelSteps: string[];
}

export const PROJECT_CONFIGS: ProjectConfig[] = [
  {
    name: 'FinFlow',
    port: 3001,
    color: '#8b5cf6',
    category: 'Finance',
    events: FinFlowEvents,
    funnelSteps: ['pageview', 'signup', 'signin', 'dashboard_view', 'transaction_added', 'goal_created'],
  },
  {
    name: 'MediCare',
    port: 3002,
    color: '#f43f5e',
    category: 'Healthcare',
    events: MediCareEvents,
    funnelSteps: ['pageview', 'signup', 'consultation_requested', 'doctor_booked', 'video_call_started'],
  },
  {
    name: 'GreenMarket',
    port: 3003,
    color: '#10b981',
    category: 'E-commerce',
    events: GreenMarketEvents,
    funnelSteps: ['pageview', 'signup', 'product_viewed', 'product_added_to_cart', 'order_placed'],
  },
  {
    name: 'FoodHub',
    port: 3004,
    color: '#f59e0b',
    category: 'Food Delivery',
    events: FoodHubEvents,
    funnelSteps: ['pageview', 'signup', 'restaurant_viewed', 'menu_item_added', 'order_placed'],
  },
  {
    name: 'LuxStay',
    port: 3005,
    color: '#0ea5e9',
    category: 'Travel & Hotels',
    events: LuxStayEvents,
    funnelSteps: ['pageview', 'signup', 'hotel_viewed', 'room_selected', 'booking_confirmed'],
  },
  {
    name: 'Artisan',
    port: 3006,
    color: '#eab308',
    category: 'Portfolio/Crafts',
    events: ArtisanEvents,
    funnelSteps: ['pageview', 'project_detail_viewed', 'contact_form_submitted', 'quote_requested'],
  },
];

// === Health status types ===
export interface ProjectHealthStatus {
  name: string;
  port: number;
  color: string;
  online: boolean;
  lastChecked: string;
  avgResponseTime: number;
  errorRate: number;
}