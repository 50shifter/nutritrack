export interface Photo {
  id: number;
  title: string;
  category: string;
  src: string;
  width: string;
  height: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface Service {
  id: number;
  title: string;
  desc: string;
  icon: string;
  price: string;
}

export const categories = ["Все", "Портреты", "Природа", "Свадьбы", "Street"];

export const photos: Photo[] = [
  { id: 1, title: "Рассвет в горах", category: "Природа", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop", width: "600", height: "800" },
  { id: 2, title: "Портрет в студии", category: "Портреты", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop", width: "600", height: "750" },
  { id: 3, title: "Первая прогулка", category: "Свадьбы", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop", width: "600", height: "400" },
  { id: 4, title: "Дождевой город", category: "Street", src: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=900&fit=crop", width: "600", height: "900" },
  { id: 5, title: "Голова ангела", category: "Портреты", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop", width: "600", height: "600" },
  { id: 6, title: "Северное сияние", category: "Природа", src: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=700&fit=crop", width: "600", height: "700" },
  { id: 7, title: "Обмен кольцами", category: "Свадьбы", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=850&fit=crop", width: "600", height: "850" },
  { id: 8, title: "Токийские огни", category: "Street", src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=500&fit=crop", width: "600", height: "500" },
  { id: 9, title: "Летний портрет", category: "Портреты", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=750&fit=crop", width: "600", height: "750" },
  { id: 10, title: "Туманный лес", category: "Природа", src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop", width: "600", height: "600" },
  { id: 11, title: "Свадебный танец", category: "Свадьбы", src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=450&fit=crop", width: "600", height: "450" },
  { id: 12, title: "Ночные дороги", category: "Street", src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=800&fit=crop", width: "600", height: "800" },
];

export const testimonials: Testimonial[] = [
  { id: 1, name: "Анна Иванова", role: "Невеста", quote: "Артём поймал каждый момент нашей свадьбы. Фотографии — это настоящая магия.", rating: 5 },
  { id: 2, name: "Михаил Петров", role: "Предприниматель", quote: "Бизнес-портреты превзошли ожидания. Профессионализм на высшем уровне.", rating: 5 },
  { id: 3, name: "Елена Козлова", role: "Фотограф", quote: "Его взгляд на природу и свет — невероятен. Каждый кадр как произведение искусства.", rating: 5 },
  { id: 4, name: "Дмитрий Сидоров", role: "Street Photographer", quote: "Потрясающая способность видеть красоту в хаосе города.", rating: 5 },
  { id: 5, name: "Ольга Белова", role: "Дизайнер", quote: "Фотосессия для бренда прошла идеально. Быстро, комфортно, результат — огонь.", rating: 5 },
  { id: 6, name: "Сергей Кузнецов", role: "Ресторатор", quote: "Съёмка меню для ресторана — всё как я хотел. Даже лучше.", rating: 5 },
  { id: 7, name: "Мария Новикова", role: "Мама в декрете", quote: "Семейная фотосессия с двумя детьми — это был вызов, но Артём справился блестяще!", rating: 5 },
  { id: 8, name: "Алексей Громов", role: "Спортсмен", quote: "Атлетический портрет получился именно таким, каким я его представлял.", rating: 5 },
];

export const services: Service[] = [
  { id: 1, title: "Портретная съёмка", desc: "Студийная и натурная фотосессия. Профессиональный ретушь и обработка.", icon: "📸", price: "от 15 000 ₽" },
  { id: 2, title: "Свадебная фотография", desc: "Полный день съёмки, 500+ обработанных фото, фотокнига.", icon: "💍", price: "от 50 000 ₽" },
  { id: 3, title: "Лейфстайл", desc: "Документальная съёмка событий, путешествий, повседневной жизни.", icon: "🎞️", price: "от 20 000 ₽" },
  { id: 4, title: "Коммерческая съёмка", desc: "Продукты, каталоги, рекламные кампании, контент для брендов.", icon: "💼", price: "от 30 000 ₽" },
];
