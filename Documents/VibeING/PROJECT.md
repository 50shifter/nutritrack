# VibeING — Экосистема веб-приложений

## Проекты

| Проект | Порт | Описание | Стек |
|--------|------|----------|------|
| FinFlow | 3001 | Финансовый дашборд | Next.js + Supabase |
| MediCare | 3002 | Медицинский портал | Next.js + Prisma + MongoDB |
| GreenMarket | 3003 | E-commerce платформа | Next.js |
| FoodHub | 3004 | Доставка еды | Next.js |
| LuxStay | 3005 | Бронирование отелей | Next.js |
| Artisan | 3006 | Портфолио мастера | Next.js |

## Команды

```bash
# Windows (PowerShell)
.\launch.ps1              # Запуск dev (6 серверов)
.\build-and-launch.ps1    # Build + production запуск
.\stop-all.ps1            # Остановка всех серверов
.\deploy.sh               # Деплой на сервер
```

## Архитектура

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind v4
- **Backend:** Supabase (FinFlow), MongoDB + Prisma (MediCare), Mock (остальные)
- **Deploy:** SSH → Nginx reverse proxy → Next.js production
- **Auth:** NextAuth.js v5 (credentials provider)

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
│   ├── finflow/            # :3001 - Finances
│   ├── foodhub/            # :3004 - Food delivery
│   ├── greenmarket/        # :3003 - E-commerce
│   ├── luxstay/            # :3005 - Hotel booking
│   ├── medicare/           # :3002 - Telemedicine
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
# ... etc
```
