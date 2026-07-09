export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  organic: boolean;
  ecoRating: 'B+' | 'A' | 'A+';
  description: string;
  ingredients?: string;
  weight: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Review {
  id: number;
  productId: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  shippingAddress: string;
  deliveryMethod: 'courier' | 'pickup';
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: 'small' | 'medium' | 'large';
  frequency: 'weekly' | 'biweekly' | 'monthly';
  status: 'active' | 'paused' | 'cancelled';
  nextDelivery: string;
  deliveredBoxes: number;
  itemsInQueue: number;
  excludedItems: number[];
  wantedMore: number[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface SubscriptionPlan {
  id: 'small' | 'medium' | 'large';
  name: string;
  label: string;
  items: number;
  price: number;
  period: string;
  description: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryMethod: 'courier' | 'pickup';
  pickupPoint?: string;
}
