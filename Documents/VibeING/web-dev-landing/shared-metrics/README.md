# 📊 Shared Metrics Library — VibeING Ecosystem

Унифицированная библиотека метрик для всех проектов VibeING.

## 📦 Структура

```
shared-metrics/
├── lib/
│   ├── metrics-config.ts    # Определения событий для каждого проекта
│   └── metrics-client.ts    # Клиентская библиотека трекинга
├── api-template/
│   └── route.ts             # Шаблон API route для PostgreSQL
├── package.json             # (опционально — для npm publish)
└── README.md                # Этот файл
```

## 🚀 Интеграция в проект

### 1. Добавить API endpoint

Скопируйте шаблон в ваш проект:

```bash
# Для каждого проекта
cp shared-metrics/api-template/route.ts {project}/src/app/api/metrics/route.ts
```

Или используйте готовые файлы уже созданные в:
- `medicare/src/app/api/metrics/route.ts`
- `greenmarket/src/app/api/metrics/route.ts`
- `foodhub/src/app/api/metrics/route.ts`
- `luxstay/src/app/api/metrics/route.ts`
- `artisan/src/app/api/metrics/route.ts`

### 2. Инициализация в корне проекта

Добавьте в `layout.tsx` или `_app.tsx`:

```tsx
import { initMetrics } from '../../../../shared-metrics/lib/metrics-client';

// В компоненте Layout
useEffect(() => {
  initMetrics({
    projectId: 'medicare',        // Уникальный ID проекта
    endpoint: '/api/metrics',     // Ваш API endpoint
    debug: process.env.NODE_ENV === 'development',
  });
}, []);
```

### 3. Трекинг событий

```tsx
import { trackEvent, trackPageview } from '../../../../shared-metrics/lib/metrics-client';

// Автоматический pageview
trackPageview();

// Трекинг конкретных событий
trackEvent('doctor_booked', { doctorId: '123', specialty: 'cardio' });
trackEvent('product_added_to_cart', { productId: '456', price: 29.99 });
trackEvent('order_placed', { orderId: '789', total: 150.00 });
```

## 📋 Доступные события

| Проект | События | Основной стек |
|--------|---------|---------------|
| **FinFlow** | pageview, signup, signin, dashboard_view, transaction_added, goal_created и др. | Финансы |
| **MediCare** | consultation_requested, doctor_booked, prescription_viewed, video_call_started | Медицина |
| **GreenMarket** | product_viewed, product_added_to_cart, order_placed, payment_completed | E-commerce |
| **FoodHub** | restaurant_viewed, menu_item_added, order_placed, order_delivered | Доставка |
| **LuxStay** | hotel_viewed, room_selected, booking_confirmed, cancellation_requested | Отели |
| **Artisan** | gallery_viewed, project_detail_viewed, contact_form_submitted, quote_requested | Портфолио |

## 🗄️ База данных

PostgreSQL таблица `metrics_events`:

```sql
CREATE TABLE metrics_events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  project_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(100),
  session_id VARCHAR(200) NOT NULL,
  page VARCHAR(500) NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  props JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Индексы:
- `idx_metrics_events_name` — по имени события
- `idx_metrics_events_project` — по проекту
- `idx_metrics_events_session` — по сессии
- `idx_metrics_events_created` — по дате

## 📊 Dashboard

_metrics-dashboard (порт 3007)_ собирает данные из всех проектов и отображает:

- KPI карточки (общие + по проектам)
- Динамика событий во времени
- Распределение по категориям
- Статус проектов (онлайн/оффлайн)
- Воронки конверсий
- Детальная таблица по проектам
- Быстрые ссылки

## 🔧 Настройка

### Для каждой БД:

```bash
# Подключение к PostgreSQL
psql -h localhost -U vibeing -d vibeing_finflow
```

### Переменные окружения:

```bash
# metrics-dashboard/.env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## 🔄 Авто-обновление

- Health check каждые 30 секунд
- Metrics refresh каждые 60 секунд
- Ручное обновление кнопкой

## 📝 Roadmap

- [ ] Подключить все проекты к PostgreSQL
- [ ] Real-time WebSocket обновления
- [ ] Админ-панель для управления событиями
- [ ] Email отчеты по метрикам
- [ ] Alerting system
- [ ] A/B testing analytics