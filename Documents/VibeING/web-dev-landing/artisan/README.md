# Artisan — Фотография

Лендинг для фотографа с галереей, калькулятором стоимости услуг и формой обратной связи.

## Запуск

```bash
cd web-dev-landing/artisan
npm install
npm run dev
```

Откройте http://localhost:3000

## Технологии

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, GSAP, Lucide React, Zod, Resend.

## Структура

```
artisan/
├── src/app/          # маршруты, layout, globals.css
├── src/components/   # секции: Hero, Gallery, Calculator, About и др.
├── src/data/         # данные фото и этапов работы
└── src/lib/          # resend (email)
```

## Переменные окружения

| Переменная | Обязательна | Описание |
|------------|-------------|----------|
| `NEXT_PUBLIC_BASE_URL` | Да | URL для SEO мета-тегов |
| `RESEND_API_KEY` | Нет | API ключ для Resend (email) |
