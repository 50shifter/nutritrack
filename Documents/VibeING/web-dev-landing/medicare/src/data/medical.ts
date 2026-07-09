export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  patients: number;
  image: string;
  available: boolean;
}

export interface MedicalRecord {
  id: number;
  date: string;
  doctor: string;
  type: string;
  notes: string;
  diagnosis: string;
}

export interface Prescription {
  id: number;
  date: string;
  doctor: string;
  medicine: string;
  dosage: string;
  duration: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
}

export const doctors: Doctor[] = [
  { id: 1, name: "Елена Смирнова", specialty: "Терапевт", experience: 12, rating: 4.9, patients: 2340, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop", available: true },
  { id: 2, name: "Дмитрий Козлов", specialty: "Кардиолог", experience: 15, rating: 4.8, patients: 3100, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop", available: true },
  { id: 3, name: "Анна Петрова", specialty: "Невролог", experience: 8, rating: 4.7, patients: 1560, image: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400&h=400&fit=crop", available: true },
  { id: 4, name: "Иван Сидоров", specialty: "Офтальмолог", experience: 20, rating: 4.9, patients: 4200, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop", available: false },
  { id: 5, name: "Мария Волкова", specialty: "Педиатр", experience: 10, rating: 4.8, patients: 2800, image: "https://images.unsplash.com/photo-1527613426441-4da17471b62d?w=400&h=400&fit=crop", available: true },
  { id: 6, name: "Алексей Новиков", specialty: "Хирург", experience: 18, rating: 4.9, patients: 3500, image: "https://images.unsplash.com/photo-1582750433449-24d330992bdc?w=400&h=400&fit=crop", available: true },
];

export const medicalRecords: MedicalRecord[] = [
  { id: 1, date: "20.06.2025", doctor: "Елена Смирнова", type: "Приём", notes: "Общий осмотр, анализы назначены", diagnosis: "Профилактический осмотр" },
  { id: 2, date: "15.05.2025", doctor: "Дмитрий Козлов", type: "Консультация", notes: "ЭКГ, корректировка лечения", diagnosis: "Гипертония 2 ст." },
  { id: 3, date: "02.04.2025", doctor: "Анна Петрова", type: "Приём", notes: "Контрольный приём", diagnosis: "Неврология - улучшение" },
];

export const prescriptions = [
  { id: 1, date: "20.06.2025", doctor: "Елена Смирнова", medicine: "Витамин D3", dosage: "2000 МЕ", duration: "3 месяца" },
  { id: 2, date: "15.05.2025", doctor: "Дмитрий Козлов", medicine: "Эналаприл", dosage: "10 мг", duration: "Постоянно" },
];

export const blogPosts: BlogPost[] = [
  { id: 1, title: "Как сохранить здоровье сердца", excerpt: "Практические советы кардиолога для поддержания здоровья сердечно-сосудистой системы.", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop", date: "18.06.2025", category: "Кардиология", readTime: "5 мин" },
  { id: 2, title: "Витамины: мифы и реальность", excerpt: "Развенчиваем популярные мифы о витаминах и supplements.", image: "https://images.unsplash.com/photo-1584308666744-642ee3057b10?w=600&h=400&fit=crop", date: "12.06.2025", category: "Общее", readTime: "7 мин" },
  { id: 3, title: "Здоровый сон: научный подход", excerpt: "Как сон влияет на здоровье и как наладить режим.", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b5b?w=600&h=400&fit=crop", date: "05.06.2025", category: "Неврология", readTime: "4 мин" },
  { id: 4, title: "Питание для иммунитета", excerpt: "Продукты, которые укрепляют иммунную систему.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop", date: "28.05.2025", category: "Нутрициология", readTime: "6 мин" },
  { id: 5, title: "Забота о глазах", excerpt: "Как снизить нагрузку на глаза при работе за компьютером.", image: "https://images.unsplash.com/photo-1576091160550-2173dba993ef?w=600&h=400&fit=crop", date: "20.05.2025", category: "Офтальмология", readTime: "3 мин" },
  { id: 6, title: "Спорт и здоровье суставов", excerpt: "Какие упражнения полезны для суставов и как предотвратить травмы.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop", date: "15.05.2025", category: "Реабилитация", readTime: "8 мин" },
];
