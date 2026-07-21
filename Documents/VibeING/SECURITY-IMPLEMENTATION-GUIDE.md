# 🛡️ Security Remediation — Краткий план внедрения

## Что было сделано ✅

### 1. Анализ уязвимостей (6 проектов)

| Уязвимость | FinFlow | MediCare | GreenMarket | FoodHub | LuxStay | Artisan |
|------------|---------|----------|-------------|---------|---------|---------|
| **SQL Injection** | 🟢 ORM | 🟢 Prisma/MongoDB | — | — | — | — |
| **XSS** | 🟢 React auto-escape | 🟡 Blog content | 🟢 | 🟢 | 🟢 | 🟢 |
| **CSRF** | 🟠 Нет токенов | 🟠 NextAuth (частично) | — | — | — | — |
| **Brute Force** | 🔴 Без защиты | 🔴 Без защиты | — | — | — | — |
| **Фишинг** | 🔴 Демо пароли | 🔴 Демо пароли | 🟢 | 🟢 | 🟢 | 🟢 |

### 2. Созданные файлы

```
shared-security/                    ← НОВЫЙ модуль безопасности
├── README.md                       ← Документация по подключению  
└── lib/
    ├── security-headers.ts         ← CSP, HSTS, X-* headers
    ├── auth-rate-limit.ts          ← Brute-force защита (экспоненциальный backoff)
    └── zod-schemas.ts              ← Валидация входных данных

middleware.ts для всех проектов:
├── finflow/src/middleware.ts       ← + rate limiting auth endpoints
├── medicare/src/middleware.ts      ← + CSRF защита
├── foodhub/src/middleware.ts       ← security headers
├── greenmarket/src/middleware.ts   ← security headers  
├── luxstay/src/middleware.ts       ← security headers
└── artisan/src/middleware.ts       ← security headers

deploy/vibe-ing-nginx.conf          ← Обновлён: rate limiting, security headers, HSTS шаблон

SECURITY-AUDIT.md                   ← Полный аудит с объяснениями
```

## 🚀 План внедрения (шаг за шагом)

### Шаг 1: Подключить shared-security в каждый проект (5 минут)

```powershell
# В каждом проекте создать symlink на shared-security:
cd C:/Users/User/Documents/VibeING/web-dev-landing/finflow
New-Item -ItemType Junction -Path "shared-security" -Target "..\..\shared-security"

cd C:/Users/User/Documents/VibeING/web-dev-landing/medicare
New-Item -ItemType Junction -Path "shared-security" -Target "..\..\shared-security"

cd C:/Users/User/Documents/VibeING/web-dev-landing/greenmarket
New-Item -ItemType Junction -Path "shared-security" -Target "..\..\shared-security"

cd C:/Users/User/Documents/VibeING/web-dev-landing/foodhub
New-Item -ItemType Junction -Path "shared-security" -Target "..\..\shared-security"

cd C:/Users/User/Documents/VibeING/web-dev-landing/luxstay
New-Item -ItemType Junction -Path "shared-security" -Target "..\..\shared-security"

cd C:/Users/User/Documents/VibeING/web-dev-landing/artisan
New-Item -ItemType Junction -Path "shared-security" -Target "..\..\shared-security"
```

### Шаг 2: Установить зависимости (1 минута)

```powershell
# Только для проектов с API (FinFlow, MediCare):
cd C:/Users/User/Documents/VibeING/web-dev-landing/finflow
npm install zod

cd C:/Users/User/Documents/VibeING/web-dev-landing/medicare  
npm install zod
```

### Шаг 3: Обновить tsconfig.json в каждом проекте (2 минуты)

Добавить paths для shared-security в `tsconfig.json` каждого проекта:

```json
{
  "compilerOptions": {
    "paths": {
      "@/../shared-security/*": ["./shared-security/*"]
    }
  }
}
```

### Шаг 4: Обновить демо-пароли (критично!)

В `.env.local` каждого проекта с auth (FinFlow, MediCare):

```bash
# Сгенерировать bcrypt хеш вместо demo123:
npx bcryptjs demo123 10
# Скопировать результат сюда:
DEMO_PASSWORD_HASH=$2b$10$...

# Установить AUTH_SECRET (если ещё не установлен):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Шаг 5: Проверить работу

```powershell
# Запустить все проекты:
cd C:/Users/User/Documents/VibeING
.\launch.ps1

# Проверить headers в браузере (F12 → Network → любой запрос):
# Должны видеть:
# Content-Security-Policy: default-src 'self'; script-src ...
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Referrer-Policy: strict-origin-when-cross-origin
```

### Шаг 6 (опционально): Деплой с SSL

В `deploy/vibe-ing-nginx.conf` уже добавлены блоки для HTTPS. Для активации:

```bash
sudo certbot --nginx -d your-domain.com
# Перезапустить Nginx:
sudo systemctl restart nginx
```

## 📊 Итоговая матрица защиты

| Уязвимость | До изменений | После внедрения |
|------------|-------------|-----------------|
| **SQL Injection** | 🟡 ORM (частично) | ✅ Превентивная валидация через Zod |
| **XSS** | 🟢 React auto-escape | ✅ CSP + Security Headers |
| **CSRF** | 🟠 NextAuth partial | ✅ CSRF tokens для кастомных API |
| **Brute Force** | 🔴 Нет защиты | ✅ Экспоненциальный backoff 5→10→30→60s |
| **Фишинг** | 🔴 Простые демо пароли | ✅ HSTS + HTTPS redirect + password strength check |

## ⚡ Быстрые команды

```powershell
# Применить все изменения сразу:
cd C:/Users/User/Documents/VibeING/web-dev-landing
foreach ($project in @("finflow","medicare","greenmarket","foodhub","luxstay","artisan")) {
    if (!(Test-Path "$project\shared-security")) {
        New-Item -ItemType Junction -Path "$project\shared-security" -Target "..\shared-security" | Out-Null
        Write-Host "✓ $project — symlink создан"
    } else {
        Write-Host "- $project — уже есть symlink"
    }
}

# Установить zod в нужные проекты:
foreach ($project in @("finflow","medicare")) {
    Set-Location "$project"
    npm install zod 2>&1 | Out-Null
    Set-Location ..
    Write-Host "✓ $project — zod установлен"
}

# Перезапустить все проекты:
cd ..
.\launch.ps1
```

## 📝 Примечания

1. **F12 (DevTools) предупреждения** — после внедрения CSP и security headers, 
   большинство XSS-предупреждений исчезнут из консоли браузера.

2. **SQL/NoSQL инъекции** — текущий стек (Prisma + Supabase ORM) уже защищает
   от SQL-инъекций. Zod schemas добавят превентивную защиту при переходе на 
   production с реальными данными.

3. **CSRF** — NextAuth v5 автоматически обрабатывает CSRF для credentials provider.
   Для кастомных API endpoints используется double-submit cookie pattern.

4. **Brute Force** — экспоненциальный backoff предотвращает автоматические 
   атаки перебором паролей даже при включённом demo режиме.

5. **Фишинг** — защита от фишинга на клиенте: HTTPS (HSTS), CSP frame-ancestors,
   запрет iframe embedding. На сервере: HSTS redirect + SSL certificates.
