# VibeING — Экосистема веб-приложений

## Проекты

| Проект | Порт | Описание | Стек |
|--------|------|----------|------|
| FinFlow | 3001 | Финансовый дашборд | Next.js + PostgreSQL |
| MediCare | 3002 | Медицинский портал | Next.js + Prisma + MongoDB |
| GreenMarket | 3003 | E-commerce платформа | Next.js |
| FoodHub | 3004 | Доставка еды | Next.js |
| LuxStay | 3005 | Бронирование отелей | Next.js |
| Artisan | 3006 | Портфолио мастера | Next.js |
| Metrics Dashboard | 3007 | Централизованные метрики | Next.js + Supabase |

## Команды

```bash
# Windows (PowerShell)
.\launch.ps1              # Запуск dev (7 серверов)
.\build-and-launch.ps1    # Build + production запуск
.\stop-all.ps1            # Остановка всех серверов
.\deploy.sh               # Деплой на сервер
.\smoke-tests.ps1         # Smoke-тесты (проверка рендера)
.\smoke-tests.js          # Smoke-тесты (Node.js / CI)
```

## Smoke Tests

`smoke-tests.ps1` / `smoke-tests.js` проверяет не только HTTP 200, но и:
- ✅ Health endpoint возвращает 200 OK
- ✅ Страница содержит >1KB контента (ловит пустые HTML-оболочки)
- ✅ Содержит обязательные ключевые слова (заголовок, навигация)
- ✅ НЕ содержит ошибок в HTML
- ✅ API endpoints возвращают JSON

Запуск: `.\smoke-tests.ps1` (exit code 0 = OK, 1 = FAILED)
В CI: `node smoke-tests.js`

## CI/CD

**GitHub Actions** (`.github/workflows/deploy.yml`):
```
push to main → lint → build (7 parallel) → SSH deploy → health-check
```

**Секреты** (Settings → Secrets → Actions):
- `DEPLOY_SERVER_IP`, `DEPLOY_SSH_KEY`, `DEPLOY_SSH_USER`
- `DB_PASSWORD`, `AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_*`

Серверная настройка: `server-setup.sh` (systemd сервисы + Nginx)
Подробно: [README-CI-CD.md](README-CI-CD.md)

## Архитектура

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind v4
- **Backend:** PostgreSQL (FinFlow), MongoDB + Prisma (MediCare), Mock (остальные)
- **Deploy:** SSH → Nginx reverse proxy → Next.js production
- **Auth:** NextAuth.js v5 (credentials provider)

## PostgreSQL

**Локальный сервер PostgreSQL 18**

| Параметр | Значение |
|----------|----------|
| Хост | localhost:5432 |
| База данных | vibeing_finflow |
| Пользователь | vibeing |
| Пароль | vibeing123 |
| Аутентификация | scram-sha-256 |

**Таблицы в vibeing_finflow:**
- `profiles` — пользователи
- `transactions` — финансовые транзакции
- `goals` — финансовые цели
- `categories` — категории доходов/расходов (9 по умолчанию)
- `metrics_events` — события для аналитики

**Подключение:**
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'vibeing_finflow',
  user: 'vibeing',
  password: 'vibeing123',
});
```

**Переменные окружения (.env.local):**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vibeing_finflow
DB_USER=vibeing
DB_PASSWORD=vibeing123
```

## Структура

```
VibeING/
├── launch.ps1              # Unified dev launcher
├── build-and-launch.ps1    # Build + production
├── stop-all.ps1            # Stop all servers
├── deploy.sh               # Server deploy script
├── rotate-logs.ps1         # Log rotation utility
├── .gitignore              # Root ignore rules
├── .deploy-env.example     # Deploy server config template
├── deploy/
│   └── vibe-ing-nginx.conf # Nginx reverse proxy config
├── web-dev-landing/
│   ├── artisan/            # :3006 - Portfolio
│   ├── finflow/            # :3001 - Finances + PostgreSQL + Metrics
│   ├── foodhub/            # :3004 - Food delivery
│   ├── greenmarket/        # :3003 - E-commerce
│   ├── luxstay/            # :3005 - Hotel booking
│   ├── medicare/           # :3002 - Telemedicine
│   ├── metrics-dashboard/  # :3007 - Metrics Aggregator
│   └── logs/               # Server logs
└── logs/                   # Global logs
```

## Environment Variables

Каждый проект использует `.env.local` (не коммитится):

| Переменная | Описание |
|------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (FinFlow) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (FinFlow) |
| `DATABASE_URL` | MongoDB connection string (MediCare) |
| `AUTH_SECRET` | NextAuth secret (all projects) |
| `NEXT_PUBLIC_BASE_URL` | Base URL for metadata (all projects) |
| `ALLOW_DEMO_LOGIN` | Enable demo login (`false` by default) |
| `USE_MOCK_DATA` | Use mock data instead of real DB (`true`/`false`) |

## Security Checklist

- ✅ No hardcoded passwords in source code
- ✅ `.env.local` files excluded from git
- ✅ `ignoreBuildErrors` removed from all configs
- ✅ Image optimization enabled (removed `unoptimized: true`)
- ✅ Server IP extracted to variables in deploy script
- ✅ Demo login requires `ALLOW_DEMO_LOGIN=true`

## Health Endpoints

All projects expose `/health` endpoint:

```bash
curl http://localhost:3001/health  # FinFlow
curl http://localhost:3002/health  # MediCare
curl http://localhost:3007/health  # Metrics Dashboard
# ... etc
```
