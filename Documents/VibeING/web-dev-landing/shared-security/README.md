# 🔒 Shared Security — VibeING

Единый модуль безопасности для всех 6 проектов VibeING.

## 📁 Структура

```
shared-security/
├── README.md              # Этот файл
└── lib/
    ├── security-headers.ts   # CSP, HSTS, X-* заголовки
    ├── auth-rate-limit.ts    # Brute-force защита с экспоненциальным backoff
    └── zod-schemas.ts        # Валидация входных данных (SQL/XSS protection)
```

## 🚀 Установка в каждый проект

### 1. Установить зависимости (если ещё не установлены):

```bash
npm install zod
# Zod нужен для валидации input data
```

### 2. Скопировать middleware.ts:

Каждый проект уже получил свой `middleware.ts`:
- **FinFlow** (`finflow/src/middleware.ts`) — с rate limiting auth endpoints
- **MediCare** (`medicare/src/middleware.ts`) — с CSRF и rate limiting
- **FoodHub** (`foodhub/src/middleware.ts`) — security headers only
- **GreenMarket** (`greenmarket/src/middleware.ts`) — security headers only
- **LuxStay** (`luxstay/src/middleware.ts`) — security headers only
- **Artisan** (`artisan/src/middleware.ts`) — security headers only

### 3. Подключить shared-security как symlink (рекомендуется):

```powershell
# В каждом проекте:
cd C:/Users/User/Documents/VibeING/web-dev-landing/PROJECT_NAME
New-Item -ItemType Junction -Path "shared-security" -Target "..\..\shared-security"
```

Или через `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/../shared-security/*": ["../../shared-security/*"]
    }
  }
}
```

## 📋 Что защищает каждый модуль

### security-headers.ts

| Уязвимость | Защита |
|------------|--------|
| XSS | CSP (Content Security Policy) с nonce |
| Clickjacking | X-Frame-Options: DENY |
| MIME sniffing | X-Content-Type-Options: nosniff |
| Referrer leaks | Referrer-Policy: strict-origin-when-cross-origin |
| Browser feature abuse | Permissions-Policy |
| HTTPS downgrade (prod) | HSTS: max-age=31536000; includeSubDomains |

### auth-rate-limit.ts

| Уязвимость | Защита |
|------------|--------|
| Brute Force login | 5 попыток → блокировка на 15 мин |
| Brute Force signup | 10 попыток → блокировка на 10 мин |
| Password reset abuse | 3 попытки → блокировка на 1 час |
| API write spam | 20 попыток/мин → burst protection |

### zod-schemas.ts

| Уязвимость | Защита |
|------------|--------|
| SQL Injection | Schema validation всех input параметров |
| NoSQL Injection | Type-safe queries через Prisma/MongoDB driver |
| XSS | Валидация длины и формата пользовательских данных |
| Oversized payloads | max() лимиты на все строковые поля |

## 🔧 Кастомизация

### Настройка CSP доменов:

```typescript
// В middleware.ts каждого проекта:
applySecurityHeaders(request, {
  allowedScriptDomains: ['fonts.googleapis.com', 'cdn.jsdelivr.net'],
  allowedStyleDomains: ['fonts.googleapis.com'],
  allowedImageDomains: ['images.unsplash.com'],
  allowedApiDomains: ['supabase.company.com'], // Supabase для FinFlow
});
```

### Настройка rate limiting:

```typescript
// В auth-rate-limit.ts измените DEFAULT_CONFIGS:
const DEFAULT_CONFIGS = {
  login: { maxAttempts: 5, lockDurationMs: 15 * 60 * 1000 },
  // ...
};
```

## 📊 Приоритеты внедрения

| Приоритет | Проект | Действие |
|-----------|--------|----------|
| 🔴 P0 | Все | Добавить middleware.ts (уже сделано) |
| 🔴 P0 | FinFlow, MediCare | Установить `zod` и подключить schemas |
| 🟠 P1 | FinFlow, MediCare | Настроить демо-пароли через bcrypt hash в env |
| 🟡 P2 | Все при деплое | Обновить Nginx конфиг (уже обновлён) |
| 🟢 P3 | Финансы/Медицина | Добавить 2FA/MFA |

## ⚠️ Важно

1. **AUTH_SECRET** — должен быть установлен в каждом `.env.local`:
   ```bash
   AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   ```

2. **Демо-пароли** — никогда не коммитьте `demo123` в prod:
   ```bash
   # Сгенерируйте bcrypt хеш для демо пароля:
   npx bcryptjs demo123 10
   # И сохраните в: DEMO_PASSWORD_HASH=хеш_из_команды
   ```

3. **SSL сертификаты** — в продакшене обязательно используйте HTTPS:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```
