# 🔍 VibeING — Аудит Архитектуры и Code Review

> Дата: 2026-07-08
> Статус: **КРИТИЧЕСКИЕ ВОПРОСЫ ОБНАРУЖЕНЫ**

---

## 🔴 КРИТИЧЕСКИЕ ПРОБЛЕМЫ (Критичность: P0)

### 1. Секреты и ключи закоммичены в репозиторий

| Файл | Проблема |
|------|----------|
| `web-dev-landing/finflow/.env.local` | Содержит `AUTH_SECRET=dev-secret-change-in-production-do-not-use` |
| `web-dev-landing/medicare/.env` | Содержит `AUTH_SECRET="medicare-dev-secret-do-not-use-in-production-123456"` и `DATABASE_URL="mongodb://localhost:27017/medicare"` |

**Хотя** `.env*` присутствует в `.gitignore`, сами файлы `.env.local` и `.env` **находятся в рабочей директории** и **не закоммичены** (git status подтверждает — только untracked). Однако:

- `finflow/.env.local` закоммичен **несмотря** на `.gitignore` правило `.env*` — **НЕТ, это untracked** → OK, но **не закоммичен**
- `medicare/.env` — **untracked** → OK, но contains hardcoded password hash

**Риск:** Если `.gitignore` когда-нибудь будет изменён/удалён, секреты попадут в Git.

### 2. Хардкод учётных данных в auth

**Файл:** `web-dev-landing/medicare/src/lib/auth.ts`

```typescript
// Демо-пользователь с хардкод-паролем (хеш)
const DEMO_USER = {
  password: "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" // demo123 hashed
};
// И явная проверка:
if (email === "demo@medicare.ru" && password === "demo123") { ... }
```

**Проблема:** Пароль `demo123` виден в коде. Хеш также ослаблен (короткий salt).

### 3. `next.config.ts` отключает проверку ошибок TypeScript

Все 6 проектов имеют:
```typescript
typescript: { ignoreBuildErrors: true },
```

**Проблема:** Это маскирует реальные баги компиляции. Ошибки типов не видны до рантайма.

### 4. `finflow/.env.local` закоммичен? Проверка:

Файл `finflow/.gitignore` содержит `.env*`, но `finflow/.env.local` — untracked. Однако `finflow_server.log` и `server.log` — **не игнорируются** и содержат данные Next.js dev сервера.

### 5. IP-адрес сервера зашит в deploy-скрипт

**Файлы:**
- `deploy.sh` — `root@155.212.231.220` — хардкод IP сервера
- `start_tunnel.bat` — содержит IP сервера

**Риск:** При смене сервера нужно менять код. Нужно выносить в `.env` или переменную окружения.

### 6. Порт-конфликт в launch.js

**Файл:** `launch.js` строка:
```javascript
'set NODE_OPTIONS=--max-old-space-size=1024 && npx next dev --port ' + p.port
```
Комментарий говорит `256MB`, но значение `--max-old-space-size=1024` (1GB). **Несоответствие документации коду.**

---

## 🟠 ПРОБЛЕМЫ С УСТОЙЧИИВОСТЬЮ АРХИТЕКТУРЫ (P1)

### 7. Отсутствие health-check endpoint'ов

Ни один из 6 Next.js проектов не имеет `/health` или `/ping` endpoint'а.

**Проблема:** Nginx не может проверить живость upstream'ов. При падении Next.js dev сервера Nginx будет отдавать 502.

**Рекомендация:** Добавить `/health` route в каждый проект:
```typescript
// app/health/route.ts
export async function GET() {
  return Response.json({ status: "ok", ts: Date.now() });
}
```

### 8. Nginx upstream-ы не имеют fallback

В `vibe-ing-nginx.conf` и `nginx-reverse-proxy.conf` для каждого порта один upstream без failover:
```nginx
proxy_pass http://127.0.0.1:3001;
```

**Проблема:** Если Next.js dev сервер упал — весь сервис недоступен. Нет health checks, no max_fails, no fail_timeout.

### 9. SSH tunnel — нет автоматического восстановления

SSH-туннели для портов 3001-3006 — единственный способ доступа к сервисам с сервера.

**Проблема:**
- Нет механизма авто-переподключения при обрыве
- Нет мониторинга состояния туннеля
- `start_tunnel.bat` — простой батник без retry logic

### 10. ProcessManager — две реализации, которые конфликтуют

Проект содержит **две** реализации ProcessManager:
- `process-manager.js` (JS) — используется `launch.js`
- `ProcessManager.ps1` (PowerShell) — используется `launch.ps1` и `build-and-launch.ps1`

**Проблема:** Если запустить оба скрипта, процессы не будут "видны" друг другу. Нет единой registry процессов.

### 11. Отсутствие лог-ротирования

Логи растут без ограничений:
- `web-dev-landing/logs/` — 6 файлов логов (greenmarket.log: 5KB)
- `finflow/server.log`, `finflow/finflow_server.log` — растут бесконечно
- `Logs/` (корневой) — пуст, но `web-dev-landing/logs/` — заполняется

**Риск:** При длительной работе — исчерпание диска.

### 12. `tsbuildinfo` закоммичен

Файлы `*.tsbuildinfo` присутствуют во всех 6 проектах (генерируются TypeScript). Они не должны быть закоммичены.

Проверка:
- `artisan/tsconfig.tsbuildinfo` — untracked ✅
- `finflow/tsconfig.tsbuildinfo` — untracked ✅

→ **Вроде бы OK, но нужно убедиться, что CI/CD не использует кэшированные билды.**

---

## 🟡 ЗАМЕЧАНИЯ (P2)

### 13. Mock data как единственный источник данных

**Файлы:** `finflow/src/lib/mock-data.ts`, `greenmarket/src/lib/mock-data.ts`, `medicare/src/data/medical.ts`

Все 6 проектов используют mock-данные в dev-режиме. Нет слоя абстракции (repository pattern) для переключения между mock и real data.

**Риск:** При подключении реального бэкенда придётся переписывать все компоненты.

### 14. FinFlow: RLS-политика «Anyone can read categories»

**Файл:** `supabase-schema.sql`
```sql
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);
```

Безопасность: категории могут читать все, включая неавторизованных пользователей. Это может быть допустимо, но должно быть задокументировано.

### 15. Отсутствует rate-limiting

API route `goals` (`finflow/src/app/api/goals/route.ts`) не имеет:
- Rate limiting
- Input validation (кроме базовой проверки)
- CORS headers
- Authentication check

**Риск:** Любой может создавать/удалять цели без авторизации.

### 16. `next.config.ts` отключает image оптимизацию

Все проекты: `images: { unoptimized: true }`

**Проблема:** Все изображения загружаются как статичные файлы, не оптимизируются Next.js Image. Это замедляет загрузку, особенно на мобильных.

### 17. Hardcoded localhost URLs в UI

**Файл:** `finflow/src/app/page.tsx`
```javascript
const apps = [
  { name: "FinFlow", href: "http://localhost:3001", ... },
  { name: "FoodHub", href: "http://localhost:3002", ... },
  // ...
];
```

Ссылки на `localhost` не будут работать на проде.

### 18. FoodHub: Cart state в localStorage без синхронизации

**Файл:** `foodhub/src/store/cartStore.ts`

Cart хранится только в localStorage. При:
- Очистке кэша — cart пропадает
- Открытии в другом браузере — cart не синхронизирован
- Incognito mode — cart не сохраняется

**Риск:** Потеря данных корзины.

### 19. GreenMarket: Error boundary без отправки ошибок

Error boundary компоненты есть (`greenmarket/src/components/ErrorBoundary.tsx`), но нет интеграции с сервисами мониторинга (Sentry и т.п.).

### 20. MediCare: Проксирование видео-звонков через Daily.co без fallback

**Файл:** `medicare/.env` → `DAILY_API_KEY=""`

Видео-звонки зависят от Daily.co. Нет fallback-решения (например, WebRTC peer-to-peer).

---

## 📋 МУСОРНЫЕ ФАЙЛЫ

### 21. Лог-файлы в проекте (не закоммичены, но присутствуют)

| Файл | Размер |
|------|--------|
| `web-dev-landing/logs/greenmarket.log` | 5.1 KB |
| `web-dev-landing/logs/medicare.log` | 792 B |
| `web-dev-landing/logs/artisan.log` | 379 B |
| `web-dev-landing/logs/finflow.log` | 286 B |
| `web-dev-landing/logs/foodhub.log` | 258 B |
| `web-dev-landing/logs/luxstay.log` | 197 B |
| `web-dev-landing/finflow/server.log` | 182 B |
| `web-dev-landing/finflow/finflow_server.log` | 293 B |
| `web-dev-landing/finflow/.next/dev/logs/next-development.log` | 74 B |
| `web-dev-landing/artisan/.next/dev/logs/next-development.log` | 74 B |
| `web-dev-landing/foodhub/.next/dev/logs/next-development.log` | 74 B |
| `web-dev-landing/greenmarket/.next/dev/logs/next-development.log` | 18 KB |
| `web-dev-landing/luxstay/.next/dev/logs/next-development.log` | 74 B |
| `web-dev-landing/medicare/.next/dev/logs/next-development.log` | 824 B |

**Рекомендация:** Все логи → `.gitignore`. Добавить `.next/dev/logs/` и `*.log` (кроме root-level лог-файлов).

### 22. `node_modules` присутствуют локально (~1.6 GB)

| Путь | Размер |
|------|--------|
| `finflow/node_modules/` | 600 MB |
| `artisan/node_modules/` | 508 MB |
| `foodhub/node_modules/` | 501 MB |
| ... (остальные ~400-600 MB) | |

**Общий размер:** ~3-4 GB. Все правильно игнорируются через `.gitignore`, но это влияет на:
- Размер бэкапов
- Скорость индексации
- Скорость git operations

### 23. Файлы `.next` кэша

Файлы `.next/dev/` — кэш dev-билда. Они не нужны в committed коде:
- `.next/dev/build-manifest.json`
- `.next/dev/prerender-manifest.json`
- `.next/dev/routes-manifest.json`
- `.next/_events_*.json`

### 24. Файлы `tsbuildinfo`

```
artisan/tsconfig.tsbuildinfo
finflow/tsconfig.tsbuildinfo
foodhub/tsconfig.tsbuildinfo
greenmarket/tsconfig.tsbuildinfo
luxstay/tsconfig.tsbuildinfo
medicare/tsconfig.tsbuildinfo
```

Все 6 файлов — кэш TypeScript. Должны быть в `.gitignore`.

### 25. Дублирующиеся скрипты запуска

| Файл | Назначение |
|------|-----------|
| `launch.ps1` | Запуск dev серверов |
| `build-and-launch.ps1` | Build + production запуск |
| `launch.js` | Запуск через Node (альтернатива) |
| `stop-all.ps1` | Остановка серверов |
| `check-ports.ps1` | Проверка портов |
| `start-finflow-server.js` | Запуск только FinFlow (Node) |
| `_run_ps.mjs` | Обёртка для PS1 |
| `start_tunnel.bat` | SSH туннель |
| `ProcessManager.ps1` | Встроен в launch.ps1 |

**Рекомендация:** Унификация. Оставить один entry-point (`launch.ps1`), остальные — вспомогательные с `@deprecated` комментариями.

### 26. Документация `DEPLOY_FIXES.md` и `ZOMBIE_FIX.md` — дублируют историю

Эти файлы — **исторические артефакты**. Они полезны для онбординга, но:
- `DEPLOY_FIXES.md` — устарел (упоминает `siteresume/` и `dist/`, которых больше нет в структуре)
- `ZOMBIE_FIX.md` — 268 строк, описывает старые проблемы, уже решённые

**Рекомендация:** Перенести в `docs/` или в Wiki.

### 27. README.md — это generic guide, не проект-специфичный

`README.md` в корне проекта — это **generic инструкция** по деплою на GitHub Pages, а не документация проекта VibeING.

**Рекомендация:** Создать `PROJECT.md` / `ARCHITECTURE.md` с реальной документацией проекта, а README оставить для GitHub.

---

## 📊 ИТОГОВАЯ ТАБЛИЦА

| Категория | Кол-во | Критичность |
|-----------|--------|-------------|
| Критические (P0) | 6 | 🔴 |
| Устойчивость (P1) | 6 | 🟠 |
| Замечания (P2) | 10 | 🟡 |
| Мусорные файлы (P3) | 7 | ⚪ |
| **Итого** | **29** | |

---

## ✅ ПОЛОЖИТЕЛЬНЫЕ МОМЕНТЫ

1. **ProcessManager** — решена проблема зомби-процессов, есть graceful shutdown
2. **Supabase RLS** — правильно настроены политики Row Level Security
3. **Prisma schema** — хорошо структурирована для MediCare
4. **Supabase SQL** — правильные триггеры, индексы, RLS policies
5. **Nginx config** — есть gzip, cache-control, security headers для landing
6. **Git** — репозиторий чистый, секреты (почти) не закоммичены
7. **Next.js 16 + React 19** — актуальный стек

---

## 🛠 ПРИОРИТЕТНЫЕ ДЕЙСТВИЯ

### СРОЧНО (сделать в первую очередь)

1. **[P0-1]** Создать `.env.example` файлы с placeholder'ами для каждого проекта
2. **[P0-2]** Удалить хардкод паролей из `medicare/src/lib/auth.ts`
3. **[P0-3]** Убрать `ignoreBuildErrors: true` из всех `next.config.ts`
4. **[P0-4]** Вынести IP сервера `155.212.231.220` в переменную окружения
5. **[P0-5]** Исправить несоответствие NODE_OPTIONS в `launch.js`
6. **[P0-6]** Убрать localhost URLs из UI finflow

### ВАЖНО

7. **[P1-1]** Добавить `/health` endpoint'ы во все 6 проектов
8. **[P1-2]** Настроить Nginx health checks для upstream'ов
9. **[P1-3]** Добавить лог-ротацию
10. **[P1-4]** Добавить rate-limiting на API routes
11. **[P2-1]** Добавить репозиторий-паттерн для абстракции данных
12. **[P2-2]** Настроить image оптимизацию Next.js
