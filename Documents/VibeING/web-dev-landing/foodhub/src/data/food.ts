export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  image: string;
  tags: string[];
  menu: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
}

export const restaurants: Restaurant[] = [
  { id: 1, name: "Бургер & Co.", cuisine: "Бургеры", rating: 4.7, deliveryTime: "25-35", deliveryFee: 199, minOrder: 500, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop", tags: ["🔥 Популярное", "🚀 Быстро"], menu: [
    { id: 101, name: "Классический бургер", desc: "Говядина, салат, томат, соус", price: 349, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop", category: "Бургеры", popular: true },
    { id: 102, name: "Двойной чизбургер", desc: "Двойная говядина, двойной сыр", price: 499, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop", category: "Бургеры", popular: true },
    { id: 103, name: "Картофель фри", desc: "Хрустящий картофель", price: 149, image: "https://images.unsplash.com/photo-1570340481716-cb7705d89184?w=200&h=200&fit=crop", category: "Гарниры", popular: false },
  ]},
  { id: 2, name: "Суши Мастер", cuisine: "Японская", rating: 4.8, deliveryTime: "30-45", deliveryFee: 299, minOrder: 800, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop", tags: ["⭐ Топ", "🍣 Свежее"], menu: [
    { id: 201, name: "Филадельфия", desc: "Лосось, сливочный сыр, авокадо", price: 490, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop", category: "Роллы", popular: true },
    { id: 202, name: "Калифорния", desc: "Краб, авокадо, огурец", price: 420, image: "https://images.unsplash.com/photo-1617196034796-73dfaefe4882?w=200&h=200&fit=crop", category: "Роллы", popular: true },
    { id: 203, name: "Мисо суп", desc: "Традиционный японский суп", price: 190, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=200&fit=crop", category: "Супы", popular: false },
  ]},
  { id: 3, name: "Пицца Джузеппе", cuisine: "Итальянская", rating: 4.6, deliveryTime: "35-50", deliveryFee: 149, minOrder: 600, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop", tags: ["🍕 Традиция", "❤️ Любимое"], menu: [
    { id: 301, name: "Маргарита", desc: "Томатный соус, моцарелла, базилик", price: 449, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop", category: "Пицца", popular: true },
    { id: 302, name: "Пепперони", desc: "Пепперони, моцарелла, соус", price: 549, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop", category: "Пицца", popular: true },
  ]},
  { id: 4, name: "Шаурма Экспресс", cuisine: "Шаурма", rating: 4.5, deliveryTime: "15-25", deliveryFee: 99, minOrder: 300, image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=400&fit=crop", tags: ["⚡ Быстро", "💰 Выгодно"], menu: [
    { id: 401, name: "Классическая шаурма", desc: "Курица, овощи, соус", price: 249, image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop", category: "Шаурма", popular: true },
    { id: 402, name: "Шаурма с говядиной", desc: "Говядина, овощи, чесночный соус", price: 349, image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop", category: "Шаурма", popular: false },
  ]},
];

export const foodCategories = ["🍔 Бургеры", "🍣 Японская", "🍕 Пицца", "🌯 Шаурма", "🥗 Салаты", "🍰 Десерты"];
