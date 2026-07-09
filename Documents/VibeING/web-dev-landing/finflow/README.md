# FinFlow — Финансовый Dashboard

Панель управления личными финансами: аналитика, графики, категории, планирование целей. Работает с Supabase и в демо-режиме без БД.

## Запуск (демо)

```bash
cd web-dev-landing/finflow
npm install
npm run dev
```

Откройте http://localhost:3001. Демо-вход: demo@finflow.com / demo123

## Подключение Supabase

1. Создайте проект на [supabase.com](https://supabase.com/dashboard)
2. Выполните SQL из `supabase-schema.sql` в SQL Editor
3. Скопируйте ключи (Settings → API) и добавьте в `.env.local`:

| Переменная | Описание |
|------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Анонимный ключ |
| `NEXT_PUBLIC_BASE_URL` | URL приложения |

## Технологии

Next.js 16, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL + Auth), Recharts, Framer Motion, Zod.
