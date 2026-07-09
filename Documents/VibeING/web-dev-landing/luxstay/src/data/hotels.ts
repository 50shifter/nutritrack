export interface Hotel {
  id: number;
  name: string;
  city: string;
  country: string;
  rating: number;
  description: string;
  photo: string;
  rooms: Room[];
}

export interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  size: string;
  maxGuests: number;
  amenities: string[];
  photos: string[];
  available: boolean;
}

export interface Experience {
  id: number;
  title: string;
  hotel: string;
  city: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  rating: number;
}

export interface Review {
  id: number;
  name: string;
  hotel: string;
  rating: number;
  date: string;
  comment: string;
  photo?: string;
}

export const hotels: Hotel[] = [
  { id: 1, name: "The Grand Paris", city: "Париж", country: "Франция", rating: 4.9, description: "Роскошный бутик-отель в самом сердце Парижа, в нескольких шагах от Эйфелевой башни.", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=900&fit=crop", rooms: [
    { id: 101, name: "Стандарт Люкс", type: "люкс", price: 25000, maxGuests: 2, size: "35 м²", amenities: ["Кровать King", "Ванна", "Вид на город", "Мини-бар"], photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop"], available: true },
    { id: 102, name: "Делюкс с видом", type: "люкс", price: 45000, maxGuests: 3, size: "55 м²", amenities: ["Кровать King", "Джакузи", "Вид на Эйфелеву", "Гостиная"], photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop"], available: true },
    { id: 103, name: "Королевский номер", type: "премиум", price: 85000, maxGuests: 4, size: "120 м²", amenities: ["Две спальни", "Терраса", "Персональный батлер", "Сауна"], photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop"], available: true },
  ]},
  { id: 2, name: "Sakura Zen Retreat", city: "Киото", country: "Япония", rating: 4.8, description: "Традиционный японский отель с видом на сад камней.", photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=900&fit=crop", rooms: [
    { id: 201, name: "Стандарт Твин", type: "стандарт", price: 18000, maxGuests: 2, size: "28 м²", amenities: ["Две односпальные", "Онсен", "Вид на сад"], photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop"], available: true },
    { id: 202, name: "Суита с онсеном", type: "люкс", price: 55000, maxGuests: 2, size: "60 м²", amenities: ["Личный онсен", "Чайная церемония", "Вид на сад"], photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop"], available: true },
  ]},
  { id: 3, name: "Amalfi Coast Palace", city: "Амальфи", country: "Италия", rating: 4.9, description: "Исторический дворец на побережье Амальфи.", photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&h=900&fit=crop", rooms: [
    { id: 301, name: "Морской люкс", type: "люкс", price: 40000, maxGuests: 2, size: "45 м²", amenities: ["Балкон", "Морской вид", "Кровать King"], photos: ["https://images.unsplash.com/photo-1615458949603-f12435adb97e?w=600&h=400&fit=crop"], available: true },
    { id: 302, name: "Пентхаус", type: "премиум", price: 95000, maxGuests: 4, size: "150 м²", amenities: ["Частный бассейн", "Панорамный вид", "Шеф-повар"], photos: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"], available: true },
  ]},
  { id: 4, name: "Dubai Mirage Tower", city: "Дубай", country: "ОАЭ", rating: 4.7, description: "Современный небоскрёб-отель с видом на Персидский залив.", photo: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&h=900&fit=crop", rooms: [
    { id: 401, name: "Городской номер", type: "стандарт", price: 30000, maxGuests: 2, size: "40 м²", amenities: ["Вид на город", "Smart TV", "Мини-бар"], photos: ["https://images.unsplash.com/photo-1615458949603-f12435adb97e?w=600&h=400&fit=crop"], available: true },
    { id: 402, name: "Королевский люкс", type: "премиум", price: 120000, maxGuests: 6, size: "200 м²", amenities: ["Частный лифт", "Джакузи", "Персональный слуга"], photos: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"], available: true },
  ]},
];

// Helper: rooms by hotel name
export const roomsByHotel: Record<string, Room[]> = {};
for (const hotel of hotels) {
  roomsByHotel[hotel.name] = hotel.rooms;
}

export const experiences: Experience[] = [
  { id: 1, title: "Чайная церемония", hotel: "Sakura Zen Retreat", city: "Киото", description: "Традиционная японская чайная церемония с мастером.", duration: "2 часа", price: "от 8 000 ₽", image: "https://loremflickr.com/600/400/tea,ceremony?lock=1001", rating: 4.9 },
  { id: 2, title: "Урок итальянской кухни", hotel: "Amalfi Coast Palace", city: "Амальфи", description: "Приготовьте настоящее итальянское блюдо с шеф-поваром.", duration: "3 часа", price: "от 12 000 ₽", image: "https://loremflickr.com/600/400/cooking,italian?lock=1002", rating: 4.8 },
  { id: 3, title: "Винный тур по Провансу", hotel: "Provence Manor", city: "Авиньон", description: "Посетите лучшие виноградники региона.", duration: "Целый день", price: "от 15 000 ₽", image: "https://loremflickr.com/600/400/wine,provence?lock=1003", rating: 4.9 },
  { id: 4, title: "Полёт на воздушном шаре", hotel: "Desert Mirage", city: "Шарджа", description: "Рассмотрите пустыню с высоты птичьего полёта.", duration: "3 часа", price: "от 25 000 ₽", image: "https://loremflickr.com/600/400/balloon,desert?lock=1004", rating: 5.0 },
  { id: 5, title: "Мастер-класс по живописи", hotel: "The Grand Paris", city: "Париж", description: "Нарисуйте свой шедевр в атмосфере Монмартра.", duration: "2.5 часа", price: "от 10 000 ₽", image: "https://loremflickr.com/600/400/painting,art?lock=1005", rating: 4.7 },
  { id: 6, title: "Яхтенная прогулка", hotel: "Dubai Mirage Tower", city: "Дубай", description: "Прогулка на яхте по Персидскому заливу.", duration: "4 часа", price: "от 30 000 ₽", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", rating: 4.9 },
];

export const reviews: Review[] = [
  { id: 1, name: "Анна К.", hotel: "The Grand Paris", rating: 5, date: "15.05.2025", comment: "Невероятный отель! Персонал на высшем уровне, номер потрясающий." },
  { id: 2, name: "Михаил Д.", hotel: "Sakura Zen Retreat", rating: 5, date: "22.04.2025", comment: "Атмосфера дзена. Онсен — это что-то невероятное." },
  { id: 3, name: "Елена С.", hotel: "Amalfi Coast Palace", rating: 5, date: "10.06.2025", comment: "Лучший отпуск в моей жизни. Вид с балкона — сказка." },
  { id: 4, name: "Дмитрий В.", hotel: "Dubai Mirage Tower", rating: 4, date: "01.06.2025", comment: "Роскошь на каждом шагу. Рекомендую пентхаус!" },
];
