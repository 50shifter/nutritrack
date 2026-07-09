import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начало seed...");

  // 1. Демо-пользователь (пациент)
  console.log("  → Создаю демо-пользователя...");
  const hashedPassword = await bcrypt.hash("demo123", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@medicare.ru" },
    update: {},
    create: {
      name: "Иван Петров",
      email: "demo@medicare.ru",
      password: hashedPassword,
      phone: "+7 (999) 123-45-67",
      dob: "1990-01-01",
      insurance: "7340123456789012",
      role: "PATIENT",
    },
  });
  console.log(`  ✅ Создан пользователь: ${demoUser.email}`);

  // 2. Врачи
  console.log("  → Создаю врачей...");
  const doctorImages = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1527613426441-4da17471b62d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1582750433449-24d330992bdc?w=400&h=400&fit=crop",
  ];

  const doctorData = [
    { id: "1", name: "Елена Смирнова", specialty: "Терапевт", experience: 12, rating: 4.9, patients: 2340, bio: "Высококвалифицированный терапевт с 12-летним опытом. Специализируется на профилактической медицине и диагностике." },
    { id: "2", name: "Дмитрий Козлов", specialty: "Кардиолог", experience: 15, rating: 4.8, patients: 3100, bio: "Кардиолог с 15-летним опытом. Эксперт в области профилактики и лечения сердечно-сосудистых заболеваний." },
    { id: "3", name: "Анна Петрова", specialty: "Невролог", experience: 8, rating: 4.7, patients: 1560, bio: "Молодой перспективный невролог. Специализируется на лечении головных болей и нарушений сна." },
    { id: "4", name: "Иван Сидоров", specialty: "Офтальмолог", experience: 20, rating: 4.9, patients: 4200, bio: "Ведущий офтальмолог с 20-летним стажем. Проводит все виды диагностических и лечебных процедур." },
    { id: "5", name: "Мария Волкова", specialty: "Педиатр", experience: 10, rating: 4.8, patients: 2800, bio: "Заботливый педиатр, работающий с детьми любого возраста. Специализируется на вакцинации." },
    { id: "6", name: "Алексей Новиков", specialty: "Хирург", experience: 18, rating: 4.9, patients: 3500, bio: "Опытный хирург. Проводит малоинвазивные операции и лапароскопические вмешательства." },
  ];

  for (const d of doctorData) {
    const email = d.name.toLowerCase().replace(/\s/g, ".") + "@medicare.ru";
    await prisma.doctor.upsert({
      where: { id: d.id },
      update: { ...d, image: doctorImages[parseInt(d.id) - 1] },
      create: {
        ...d,
        email,
        image: doctorImages[parseInt(d.id) - 1],
        education: ["Первый МГМУ им. И.М. Сеченова", "Интернатура по специальности"],
        certifications: ["Сертификат специалиста", "Повышение квалификации 2024"],
        available: true,
        schedule: {
          create: {
            mondayStart: "09:00", mondayEnd: "18:00",
            tuesdayStart: "09:00", tuesdayEnd: "18:00",
            wednesdayStart: "10:00", wednesdayEnd: "17:00",
            thursdayStart: "09:00", thursdayEnd: "18:00",
            fridayStart: "09:00", fridayEnd: "16:00",
            saturdayStart: "10:00", saturdayEnd: "14:00",
          },
        },
      },
    });
    console.log(`  ✅ Врач: ${d.name} (${d.specialty})`);
  }

  // 3. Лекарства
  console.log("  → Создаю лекарства...");
  const meds = [
    { name: "Витамин D3", price: 450, category: "Витамины", description: "Поддержка иммунитета и костной ткани. 60 капсул.", dosage: "1 таблетка в день", stock: 200, isPrescription: false },
    { name: "Омега-3", price: 780, category: "Витамины", description: "Полезные жирные кислоты. 90 капсул.", dosage: "2 капсулы в день", stock: 150, isPrescription: false },
    { name: "Эналаприл", price: 120, category: "Рецептурные", description: "Антигипертензивное средство. 20 таблеток.", dosage: "По назначению врача", stock: 300, isPrescription: true },
    { name: "Ибупрофен", price: 85, category: "Обезболивающие", description: "Противовоспалительное. 30 таблеток.", dosage: "По необходимости", stock: 500, isPrescription: false },
    { name: "Мультивитамины A-Z", price: 920, category: "Витамины", description: "Комплекс витаминов. 60 таблеток.", dosage: "1 таблетка в день", stock: 180, isPrescription: false },
    { name: "Магний B6", price: 380, category: "Витамины", description: "Поддержка нервной системы. 30 таблеток.", dosage: "1 таблетка 2 раза в день", stock: 250, isPrescription: false },
  ];

  for (const m of meds) {
    const medId = m.name.toLowerCase().replace(/[^a-zа-яё0-9]/gi, "-");
    await prisma.medication.upsert({
      where: { id: medId },
      update: { ...m, image: "https://images.unsplash.com/photo-1584308666744-642ee3057b10?w=300&h=300&fit=crop" },
      create: { id: medId, ...m, image: "https://images.unsplash.com/photo-1584308666744-642ee3057b10?w=300&h=300&fit=crop" },
    });
    console.log(`  ✅ Лекарство: ${m.name}`);
  }

  // 4. Статьи блога
  console.log("  → Создаю статьи блога...");
  const posts = [
    { title: "Как сохранить здоровье сердца", slug: "health-heart", category: "Кардиология", excerpt: "Практические советы кардиолога для поддержания здоровья сердечно-сосудистой системы.", content: "## Практические советы кардиолога\n\n### 1. Контролируйте давление\nРегулярно измеряйте артериальное давление. Норма — до 120/80.\n\n### 2. Следите за холестерином\nАнализы крови на липидный профиль — раз в год.\n\n### 3. Двигайтесь\nМинимум 150 минут аэробной нагрузки в неделю.\n\n### 4. Откажитесь от курения\nКурение — главный фактор риска сердечных заболеваний." },
    { title: "Витамины: мифы и реальность", slug: "vitamins-myths", category: "Общее", excerpt: "Развенчиваем популярные мифы о витаминах и добавках.", content: "## Миф 1: Чем больше витаминов, тем лучше\n\nРеальность: Избыток витаминов A, D, E, K может быть токсичен.\n\n## Миф 2: Витамины заменяют еду\n\nРеальность: Пища содержит тысячи полезных соединений, которых нет в добавках.\n\n## Миф 3: Все витамины одинаковы\n\nРеальность: Качество зависит от производителя, формы и биодоступности." },
    { title: "Здоровый сон: научный подход", slug: "healthy-sleep", category: "Неврология", excerpt: "Как сон влияет на здоровье и как наладить режим.", content: "## Почему сон важен?\n\nВо время сна организм восстанавливается:\n- Укрепляется иммунитет\n- Восстанавливаются ткани мозга\n- Регулируются гормоны\n\n## Правила здорового сна\n\n1. Ложитесь в одно время\n2. Избегайте экранов за час до сна\n3. Комната: 18-20°C, темнота\n4. Кофеин после 14:00 — нельзя" },
    { title: "Питание для иммунитета", slug: "nutrition-immunity", category: "Нутрициология", excerpt: "Продукты, которые укрепляют иммунную систему.", content: "## Топ продуктов для иммунитета\n\n### Цитрусовые\nВитамин C — мощнейший антиоксидант.\n\n### Чеснок\nАнтибактериальные свойства, аллицин.\n\n### Имбирь\nПротивовоспалительный эффект.\n\n### Орехи\nВитамин E, цинк, селен.\n\n### Йогурт\nПробиотики для микробиома." },
    { title: "Забота о глазах", slug: "eye-care", category: "Офтальмология", excerpt: "Как снизить нагрузку на глаза при работе за компьютером.", content: "## Правило 20-20-20\n\nКаждые 20 минут смотрите на объект в 20 футах (6 метров) в течение 20 секунд.\n\n## Другие советы\n\n- Используйте искусственные слезы\n- Регулярно проверяйте зрение\n- Носите защитные очки на солнце\n- Правильная освещённость рабочего места" },
    { title: "Спорт и здоровье суставов", slug: "sport-joints", category: "Реабилитация", excerpt: "Какие упражнения полезны для суставов и как предотвратить травмы.", content: "## Лучшие виды спорта для суставов\n\n### Плавание\nНаименьшая нагрузка на суставы, полная тренировка мышц.\n\n### Йога\nГибкость, баланс, снижение стресса.\n\n### Велосипед\nУкрепление ног без ударной нагрузки.\n\n## Важно\n\n- Всегда разминайтесь\n- Не перегружайтесь\n- Слушайте своё тело\n- При боли — обратитесь к врачу" },
  ];

  for (const p of posts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, author: "Редакция MediCare", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop", views: Math.floor(Math.random() * 500) + 50 },
    });
    console.log(`  ✅ Статья: ${p.title}`);
  }

  // 5. Медицинские записи
  console.log("  → Создаю медицинские записи...");
  const recordData = [
    { userId: demoUser.id, doctorId: "1", date: new Date("2025-06-20"), type: "Приём", diagnosis: "Профилактический осмотр", notes: "Общий осмотр, анализы назначены.", followUp: "Через 3 месяца" },
    { userId: demoUser.id, doctorId: "2", date: new Date("2025-05-15"), type: "Консультация", diagnosis: "Гипертония 2 ст.", notes: "ЭКГ, корректировка лечения. Контроль давления.", followUp: "Через месяц" },
    { userId: demoUser.id, doctorId: "3", date: new Date("2025-04-02"), type: "Приём", diagnosis: "Неврология - улучшение", notes: "Контрольный приём. Состояние улучшилось.", followUp: "Через 2 месяца" },
  ];
  for (const r of recordData) {
    try { await prisma.medicalRecord.create({ data: r }); } catch {} // skip if exists
  }
  console.log("  ✅ Медицинские записи");

  // 6. Рецепты
  console.log("  → Создаю рецепты...");
  const prescriptionData = [
    { userId: demoUser.id, doctorId: "1", medicine: "Витамин D3", dosage: "2000 МЕ", duration: "3 месяца", date: new Date("2025-06-20"), status: "ACTIVE" as const },
    { userId: demoUser.id, doctorId: "2", medicine: "Эналаприл", dosage: "10 мг", duration: "Постоянно", date: new Date("2025-05-15"), status: "ACTIVE" as const },
  ];
  for (const p of prescriptionData) {
    try { await prisma.prescription.create({ data: p }); } catch {} // skip if exists
  }
  console.log("  ✅ Рецепты");

  // 7. Записи на приём
  console.log("  → Создаю записи на приём...");
  const appointmentData = [
    { userId: demoUser.id, doctorId: "1", date: new Date("2025-06-25T10:00:00Z"), timeSlot: "10:00", status: "CONFIRMED" as const, type: "CONSULTATION" as const, notes: "Профилактический приём" },
    { userId: demoUser.id, doctorId: "2", date: new Date("2025-06-30T14:30:00Z"), timeSlot: "14:30", status: "PENDING" as const, type: "FOLLOW_UP" as const, notes: "Контроль давления" },
  ];
  for (const a of appointmentData) {
    try { await prisma.appointment.create({ data: a }); } catch {} // skip if exists
  }
  console.log("  ✅ Записи на приём");

  console.log("\n✅ Seed завершён успешно! 🎉");
  console.log("   Демо-аккаунт: demo@medicare.ru / demo123");
}

main()
  .catch(e => { console.error("❌ Ошибка seed:", e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
