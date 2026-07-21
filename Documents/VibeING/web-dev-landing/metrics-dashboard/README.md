# Metrics Dashboard — VibeING Ecosystem

Централизованный дашборд для сбора и визуализации бизнес-метрик всех проектов VibeING.

## 📊 Что отслеживается

### FinFlow (3001)
- Просмотры страниц (pageview)
- Регистрации (signup)
- Входы в систему (signin)
- Просмотры дашборда (dashboard_view)
- Добавление/редактирование транзакций
- Создание финансовых целей
- Фильтры графиков
- Экспорт данных

### Воронка конверсий
```
Просмотр лендинга → Регистрация → Вход → Дашборд → Транзакция → Цель
```

### Ключевые метрики
- Total Events — общее количество событий
- Unique Sessions — уникальные сессии
- Unique Users — уникальные пользователи
- Events per Day — среднее количество событий в день
- Conversion Rate — конверсия по воронке

## 🚀 Быстрый старт

### 1. Создать Supabase проект
Если ещё нет — создайте проект на [supabase.com](https://supabase.com)

### 2. Выполнить SQL schema
Откройте SQL Editor в Supabase и выполните:
```
finflow/supabase-metrics-schema.sql
```

### 3. Настроить окружение
```bash
cd web-dev-landing/metrics-dashboard
cp .env.local.example .env.local
# Заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 4. Установить зависимости и запустить
```bash
npm install
npm run dev
```

Или просто:
```bash
cd C:/Users/User/Documents/VibeING
.\launch.ps1
```

Дашборд откроется на **http://localhost:3007**

## 📁 Структура

```
metrics-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Главная страница дашборда
│   │   └── globals.css         # Стили
│   ├── components/
│   │   └── DashboardContent.tsx # Основной контент
│   └── lib/
│       └── supabase.ts         # Supabase client
├── .env.local.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 🔌 API Events

FinFlow отправляет события на `/api/metrics`:

```typescript
POST /api/metrics
{
  "events": [
    {
      "name": "pageview",
      "timestamp": "2025-01-20T10:00:00Z",
      "sessionId": "session_xxx",
      "page": "/dashboard",
      "props": { "duration": 45 }
    }
  ]
}
```

## 📈 Визуализации

- **KPI Cards** — ключевые метрики сверху
- **Area Chart** — динамика событий за период
- **Bar Chart** — типы событий
- **Funnel Chart** — воронка конверсий
- **Top Pages** — самые посещаемые страницы
- **Projects Grid** — карточки всех проектов

## 🔄 Авто-обновление

Дашборд автоматически обновляет данные каждые 60 секунд.

## 📝 Добавление метрик в другие проекты

Повторите шаги для каждого проекта:

1. Скопируйте `src/lib/metrics/` из FinFlow
2. Добавьте `useMetrics()` в layout
3. Добавьте tracking в key actions
4. Создайте API endpoint `/api/metrics`