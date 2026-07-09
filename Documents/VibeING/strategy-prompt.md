# 🛠 VibeING — Стратегия Исправления (Master Prompt)

> Создано: 2026-07-08
> Цель: Исправить все 29 проблем из status.md → чистый, надёжный проект

---

## 📋 ФАЗА 0: УБОРКА МУСОРА (Execute First)

### 0.1 Удалить дублирующиеся/устаревшие скрипты запуска

**УДАЛИТЬ:**
```
web-dev-landing/finflow/kill-all.ps1
web-dev-landing/finflow/kill-node.ps1
web-dev-landing/finflow/launch-bg.bat
web-dev-landing/finflow/run-dev.ps1
web-dev-landing/finflow/start-dev.ps1
web-dev-landing/launch.js          ← заменить на build-and-launch.ps1
start-finflow-server.js            ← заменить на launch.ps1
_run_ps.mjs                        ← заменить на launch.ps1
check-ports.ps1                    ← заменить на stop-all.ps1
test-assets.js                     ← test файл, удалить
test-finflow.js                    ← test файл, удалить
start_tunnel.bat                   ← перенести в docs/
launch-all.sh                      ← Windows-проект, удалить
ProcessManager.ps1                 ← встроен в launch.ps1
lib/build-helper.js                ← встроен в build-and-launch.ps1
```

**ОСТАВИТЬ (единственный entry-point):**
```
launch.ps1         — запуск dev (6 серверов)
build-and-launch.ps1 — build + production запуск
stop-all.ps1       — остановка
deploy.sh          — деплой на сервер
```

### 0.2 Удалить исторические артефакты

**УДАЛИТЬ:**
```
DEPLOY_FIXES.md        ← устарел, упоминаний siteresume больше нет
ZOMBIE_FIX.md          ← проблема решена, история не нужна
VIDEO_PORTFOLIO_SCRIPTS.md  ← не относится к текущему проекту
```

### 0.3 Удалить .next/dev кэш и tsbuildinfo

**УДАЛИТЬ:**
```
artisan/.next/dev/*
finflow/.next/dev/*
foodhub/.next/dev/*
greenmarket/.next/dev/*
luxstay/.next/dev/*
medicare/.next/dev/*

artisan/tsconfig.tsbuildinfo
finflow/tsconfig.tsbuildinfo
foodhub/tsconfig.tsbuildinfo
greenmarket/tsconfig.tsbuildinfo
luxstay/tsconfig.tsbuildinfo
medicare/tsconfig.tsbuildinfo
```

### 0.4 Очистить логи

**УДАЛИТЬ содержимое:**
```
web-dev-landing/logs/*.log    ← очистить файлы
Logs/                          ← пустая, но оставить директорию для будущего
```

### 0.5 Обновить .gitignore

**Добавить в root `.gitignore`:**
```
# Next.js dev cache
.next/dev/

# TypeScript build cache
*.tsbuildinfo

# Logs (all)
*.log
logs/

# OS
Thumbs.db
desktop.ini
```

**Убедиться что в `.gitignore` каждого проекта есть:**
```
.env.local
.env.local.*
.env.*.local
*.tsbuildinfo
.next/dev/
*.log
logs/
```

---

## 📋 ФАЗА 1: БЕЗОПАСНОСТЬ (P0 — Security)

### 1.1 Исправить .env.local файлы

**finflow/.env.local** → переписать:
```env
# FinFlow — Development Environment
# ⚠️ НИКОГДА не коммитьте этот файл!

# Supabase — получить на https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# NextAuth — сгенерировать: openssl rand -base64 32
AUTH_SECRET=change-me-in-production
```

**medicare/.env** → переписать:
```env
# MediCare — Development Environment
# ⚠️ НИКОГДА не коммитьте этот файл!

# MongoDB Atlas — https://cloud.mongodb.com
DATABASE_URL=mongodb://localhost:27017/medicare

# NextAuth — сгенерировать: openssl rand -base64 32
AUTH_SECRET=change-me-in-production

# Daily.co API key — https://dashboard.daily.co
DAILY_API_KEY=

# Демо-режим активен: при пустом DATABASE_URL используются mock-данные
```

### 1.2 Удалить хардкод пароля из auth.ts

**Файл:** `web-dev-landing/medicare/src/lib/auth.ts`

**Заменить:**
```typescript
// УДАЛИТЬ полностью:
const DEMO_USER = {
  id: "demo-user-id",
  name: "Демо Пользователь",
  email: "demo@medicare.ru",
  password: "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
};

// И заменить проверку:
if (email === "demo@medicare.ru" && password === "demo123") {
```

**На:**
```typescript
// Проверка демо-режима через переменную окружения
if (process.env.ALLOW_DEMO_LOGIN === "true" &&
    email === "demo@medicare.ru" &&
    password === "demo123") {
  return {
    id: crypto.randomUUID(),
    name: "Демо Пользователь",
    email: "demo@medicare.ru",
  };
}
```

И добавить в `.env` каждого проекта:
```env
# Разрешить демо-логин (false по умолчанию)
ALLOW_DEMO_LOGIN=false
```

### 1.3 Убрать `ignoreBuildErrors: true` из next.config.ts

**Каждый из 6 проектов:** `web-dev-landing/*/next.config.ts`

**БЫЛО:**
```typescript
const nextConfig: NextConfig = {
  devIndicators: false,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },  // ← УДАЛИТЬ ЭТУ СТРОКУ
};
```

**СТАЛО:**
```typescript
const nextConfig: NextConfig = {
  devIndicators: false,
  // images: оптимизация включена по умолчанию (убрать строку ниже)
};
```

> **Примечание:** После удаления — запустить `npm run build` и исправить все ошибки TS.

### 1.4 Вынести IP сервера в переменную

**Файл:** `deploy.sh`

**БЫЛО:**
```bash
ssh root@155.212.231.220 "..."
scp ... root@155.212.231.220:/...
```

**СТАЛО:**
```bash
SERVER_IP="${DEPLOY_SERVER_IP:-155.212.231.220}"
SSH_USER="${DEPLOY_SSH_USER:-root}"
SSH_KEY="${DEPLOY_SSH_KEY:-~/.ssh/id_ed25519_155.212.231.220}"

ssh "${SSH_USER}@${SERVER_IP}" "..."
scp ... "${SSH_USER}@${SERVER_IP}":/...
```

**И добавить в root `.gitignore`:**
```
# Server configuration (local only)
.deploy-env
```

Создать `.deploy-env.example`:
```bash
# Сервер деплоя (не коммитьте!)
export DEPLOY_SERVER_IP="155.212.231.220"
export DEPLOY_SSH_USER="root"
export DEPLOY_SSH_KEY="~/.ssh/id_ed25519_155.212.231.220"
```

---

## 📋 ФАЗА 2: УСТОЙЧИВОСТЬ (P1 — Resilience)

### 2.1 Добавить `/health` endpoint во все 6 проектов

**Создать:** `web-dev-landing/*/src/app/health/route.ts`

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: process.env.SERVICE_NAME || "unknown",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

**Добавить в `layout.tsx` каждого проекта:**
```typescript
export const metadata: Metadata = {
  // ...existing...
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'),
};
```

### 2.2 Обновить Nginx конфиги для health-check

**Файл:** `deploy/vibe-ing-nginx.conf`

**Каждый server block обновить:**
```nginx
server {
    listen 3001;
    server_name _;

    location /health {
        proxy_pass http://127.0.0.1:3001/health;
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_connect_timeout 10s;

        # Health check: 3 fails = down, 1 success = up
        health_check interval=30 fails=3 passes=1 uri=/health;
    }
}
```

**Уменьшить timeouts с 86400s до 60s** (24 часа — это risk для DoS).

### 2.3 Добавить rate-limiting на API routes

**Создать утилиту:** `web-dev-landing/finflow/src/lib/rate-limit.ts`

```typescript
import { NextResponse } from "next/server";

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 100; // requests per window
const WINDOW_MS = 60_000; // 1 minute

export function rateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}
```

**Использовать в API routes:**
```typescript
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed, remaining } = rateLimit(`goals:${ip}`);

  if (!allowed) {
    return NextResponse.json(
      { error: "Слишком много запросов" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  // ... rest of handler
}
```

### 2.4 Настроить лог-ротацию

**Создать скрипт:** `rotate-logs.ps1`

```powershell
#rotate-logs.ps1 — Rotate all VibeING logs

$logs = @(
    "C:\Users\User\Documents\VibeING\web-dev-landing\logs\*.log",
    "C:\Users\User\Documents\VibeING\Logs\*.log"
)

$maxSizeKB = 1024 # 1MB per log file

foreach ($pattern in $logs) {
    Get-ChildItem $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        if ($_.Length -gt $maxSizeKB * 1024) {
            $backup = "$($_.FullName).$(Get-Date -Format 'yyyyMMdd-HHmmss').bak"
            Copy-Item $_.FullName $backup -ErrorAction SilentlyContinue
            Set-Content $_.FullName "" -ErrorAction SilentlyContinue
            Write-Host "Rotted: $($_.FullName) -> $backup"
        }
    }
}
```

**Добавить в `launch.ps1` / `build-and-launch.ps1`:**
```powershell
# Run log rotation before starting
if (Test-Path ".\rotate-logs.ps1") { . .\rotate-logs.ps1 }
```

### 2.5 Унифицировать ProcessManager

**Создать единый entry-point:** `launch.ps1` (основной)

Добавить в `launch.ps1` совместимость:
```powershell
# launch.ps1 — Unified launcher for all VibeING projects
#
# Usage:
#   .\launch.ps1              — Start all dev servers
#   .\launch.ps1 --build      — Build + start production
#   .\launch.ps1 --stop       — Stop all servers
#   .\launch.ps1 --status     — Show status
#
# Deprecated (use launch.ps1 instead):
#   launch.js, launch-all.sh, start_all.cmd, run.ps1, etc.
```

---

## 📋 ФАЗА 3: УЛУЧШЕНИЯ КОДА (P2 — Code Quality)

### 3.1 Убрать localhost URLs из UI

**Файл:** `web-dev-landing/finflow/src/app/page.tsx`

**БЫЛО:**
```javascript
const apps = [
  { name: "FinFlow", href: "http://localhost:3001", ... },
  { name: "FoodHub", href: "http://localhost:3002", ... },
  // ...
];
```

**СТАЛО:**
```javascript
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
const PORTS = { finflow: 3001, foodhub: 3004, greenmarket: 3003, luxstay: 3005, medicare: 3002, artisan: 3006 };

const apps = [
  { name: "FinFlow", href: `${BASE_URL.replace(/:\d+$/, `:${PORTS.finflow}`)}`, ... },
  // ...
];
```

### 3.2 Отключить image оптимизацию (убрать unoptimized: true)

**Каждый `next.config.ts`:**
```typescript
// УДАЛИТЬ строку:
// images: { unoptimized: true },
// Next.js будет автоматически оптимизировать изображения
```

### 3.3 Добавить repository pattern для данных

**Создать шаблон:** `web-dev-landing/finflow/src/lib/repositories/transaction-repo.ts`

```typescript
// Repository pattern — abstracts mock ↔ real data
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

interface TransactionRepository {
  list(userId: string, opts?: { page?: number; perPage?: number }): Promise<{ data: any; total: number }>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<boolean>;
}

class MockTransactionRepository implements TransactionRepository {
  async list(userId, opts) { /* ... */ }
  async create(data) { /* ... */ }
  async update(id, data) { /* ... */ }
  async delete(id) { /* ... */ }
}

// In production, swap to:
class SupabaseTransactionRepository implements TransactionRepository { /* ... */ }

// Factory — swap based on env
export function getTransactionRepo(): TransactionRepository {
  if (process.env.USE_MOCK_DATA === "true") {
    return new MockTransactionRepository();
  }
  return new SupabaseTransactionRepository(); // throws if no config
}
```

### 3.4 Синхронизация cart для FoodHub

**Улучшить:** `web-dev-landing/foodhub/src/store/cartStore.ts`

```typescript
// Добавить session support
const CART_KEY = "foodhub-cart";

function getStorage() {
  // Use sessionStorage for tab-scoped, localStorage for cross-tab
  return typeof window !== "undefined" ? localStorage : null;
}

// Listen for storage events (cross-tab sync)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY && e.newValue) {
      // Cart changed in another tab — update
    }
  });
}
```

---

## 📋 ФАЗА 4: ДОКУМЕНТАЦИЯ

### 4.1 Создать PROJECT.md

**Создать:** `PROJECT.md` — замена README.md для root

```markdown
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
.\launch.ps1              # Запуск dev
.\build-and-launch.ps1    # Build + production
.\stop-all.ps1            # Остановка
.\deploy.sh               # Деплой на сервер
```

## Архитектура
- Frontend: Next.js 16, React 19, TypeScript, Tailwind v4
- Backend: Supabase (FinFlow), MongoDB (MediCare), Mock (others)
- Deploy: SSH → Nginx reverse proxy → Next.js production
```

### 4.2 Обновить root README.md

**Сделать:** минимальный README для GitHub

```markdown
# VibeING Studio

Portfolio of 6 web applications built with Next.js 16 ecosystem.

## Quick Start
```bash
# Windows (PowerShell)
.\launch.ps1              # Start all dev servers
.\build-and-launch.ps1    # Build + production

# Deploy
.\deploy.sh               # Deploy to server
```

## Services
| App | URL (dev) |
|-----|-----------|
| FinFlow | http://localhost:3001 |
| MediCare | http://localhost:3002 |
| ... | ... |
```

---

## 📋 ФАЗА 5: ПРОВЕРКА

### 5.1 Проверочный чеклист

```powershell
# 1. Проверить что нет .env.* в committed
git ls-files | Select-String "\.env"
# Ожидаемо: только *.example файлы

# 2. Проверить что нет tsbuildinfo
git ls-files | Select-String "tsbuildinfo"
# Ожидаемо: пустой вывод

# 3. Проверить что нет .next/dev
git ls-files | Select-String "\.next/dev"
# Ожидаемо: пустой вывод

# 4. Проверить что нет hardcoded passwords
Select-String -Path "web-dev-landing\*\src\*" -Pattern "demo123" | Where-Object { $_.Line -notmatch "process\.env" }
# Ожидаемо: пустой вывод

# 5. Проверить что нет ignoreBuildErrors
Select-String -Path "web-dev-landing\*\next.config.ts" -Pattern "ignoreBuildErrors"
# Ожидаемо: пустой вывод

# 6. Проверить что health endpoint существует
Test-Path "web-dev-landing/finflow/src/app/health/route.ts"
# Ожидаемо: True (для всех 6 проектов)
```

### 5.2 Финальная проверка

```bash
# 1. build всех проектов
cd web-dev-landing/finflow && npm run build
cd ../medicare && npm run build
cd ../greenmarket && npm run build
cd ../foodhub && npm run build
cd ../luxstay && npm run build
cd ../artisan && npm run build

# 2. Проверить что все логи пустые
dir web-dev-landing\logs\
# Ожидаемо: файлы есть, но пустые или только .gitkeep

# 3. Проверить git diff — только изменения, не мусор
git diff --stat
git status
```

---

## 📊 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ

| Метрика | До | После |
|---------|----|-------|
| Файлов в репозитории | ~260+ (с node_modules) | ~120 (чистый код) |
| .env файлов | 2 (секреты) | 0 (только .example) |
| Hardcoded паролей | 2 | 0 |
| ignoreBuildErrors | 6 файлов | 0 |
| localhost URLs в UI | 6 | 0 |
| Health endpoints | 0 | 6 |
| Rate limiting | 0 | 6 API |
| Лог-файлов в проекте | ~14 | 0 (пустые) |
| tsbuildinfo | 6 | 0 |
| Дублирующих entry-points | 4 | 2 (launch, build) |
| node_modules | ~3.8 GB | не в репозитории ✅ |

---

## ⚡ ПОРЯДОК ВЫПОЛНЕНИЯ (пошагово)

```
STEP 1: cleanup-garbage     — удалить мусор (Фаза 0)
STEP 2: fix-security        — безопасность (Фаза 1)
STEP 3: fix-resilience      — устойчивость (Фаза 2)
STEP 4: improve-code        — качество кода (Фаза 3)
STEP 5: update-docs         — документация (Фаза 4)
STEP 6: verify              — проверка (Фаза 5)
```

**Каждый step — одна задача AI-агенту. Не прыгать между steps.**
