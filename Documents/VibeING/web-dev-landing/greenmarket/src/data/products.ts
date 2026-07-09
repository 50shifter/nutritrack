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
  ecoRating: "B+" | "A" | "A+";
  description: string;
  ingredients?: string;
  weight: string;
  stock: number;
}

export const categories = ["Все", "Фрукты", "Овощи", "Молочные", "Бакалея", "Напитки"];

export const products: Product[] = [
  { id: 1, slug: "avocado-hass", name: "Авокадо Хасс", price: 189, oldPrice: 249, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop", category: "Фрукты", rating: 4.8, reviews: 124, badge: "-24%", organic: true, ecoRating: "A+", description: "Спелый авокадо Хасс из Мексики. Идеален для тостов и салатов.", ingredients: "Авокадо 100%", weight: "200-300г", stock: 45 },
  { id: 2, slug: "organic-strawberry", name: "Клубника органик", price: 349, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop", category: "Фрукты", rating: 4.9, reviews: 89, organic: true, ecoRating: "A+", description: "Свежая клубника с экофермы.", ingredients: "Клубника", weight: "300г", stock: 30 },
  { id: 3, slug: "broccoli", name: "Брокколи", price: 89, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop", category: "Овощи", rating: 4.5, reviews: 56, organic: true, ecoRating: "A", description: "Свежая органическая брокколи.", ingredients: "Брокколи", weight: "400г", stock: 60 },
  { id: 4, slug: "almond-milk", name: "Миндальное молоко", price: 199, oldPrice: 259, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop", category: "Молочные", rating: 4.6, reviews: 73, badge: "-23%", organic: false, ecoRating: "A", description: "Растительное молоко без сахара.", ingredients: "Миндаль, вода", weight: "1л", stock: 25 },
  { id: 5, slug: "white-quinoa", name: "Киноа белая", price: 289, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop", category: "Бакалея", rating: 4.7, reviews: 41, organic: true, ecoRating: "A+", description: "Зерновая киноа премиум качества.", ingredients: "Киноа", weight: "500г", stock: 40 },
  { id: 6, slug: "cherry-tomatoes", name: "Томаты черри", price: 159, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop", category: "Овощи", rating: 4.4, reviews: 97, organic: true, ecoRating: "A", description: "Сладкие томаты черри.", ingredients: "Томаты черри", weight: "350г", stock: 55 },
  { id: 7, slug: "matcha-tea", name: "Зелёный чай матча", price: 449, image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop", category: "Напитки", rating: 4.9, reviews: 156, badge: "ХИТ", organic: true, ecoRating: "A+", description: "Японская матча церемониального качества.", ingredients: "Матча зелёная", weight: "50г", stock: 35 },
  { id: 8, slug: "bananas", name: "Бананы", price: 79, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop", category: "Фрукты", rating: 4.3, reviews: 201, organic: false, ecoRating: "B+", description: "Спелые бананы Эквадор.", ingredients: "Бананы", weight: "1 кг", stock: 80 },
  { id: 9, slug: "greek-yogurt", name: "Йогурт греческий", price: 129, image: "https://images.unsplash.com/photo-1488477181946-6a2881ed8005?w=400&h=400&fit=crop", category: "Молочные", rating: 4.6, reviews: 68, organic: false, ecoRating: "A", description: "Натуральный греческий йогурт.", ingredients: "Молоко, закваска", weight: "200г", stock: 50 },
  { id: 10, slug: "fresh-cucumbers", name: "Огурцы свежие", price: 99, image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop", category: "Овощи", rating: 4.2, reviews: 34, organic: true, ecoRating: "A", description: "Хрустящие тепличные огурцы.", ingredients: "Огурцы", weight: "500г", stock: 70 },
  { id: 11, slug: "olive-oil", name: "Оливковое масло", price: 599, oldPrice: 749, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop", category: "Бакалея", rating: 4.8, reviews: 112, badge: "-20%", organic: true, ecoRating: "A+", description: "Extra Virgin из Греции.", ingredients: "Оливковое масло", weight: "500мл", stock: 20 },
  { id: 12, slug: "green-smoothie", name: "Смузи зелёный", price: 249, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=400&fit=crop", category: "Напитки", rating: 4.7, reviews: 45, organic: true, ecoRating: "A", description: "Шпинат, яблоко, сельдерей, имбирь.", ingredients: "Шпинат, яблоко, сельдерей, имбирь", weight: "330мл", stock: 40 },
];
