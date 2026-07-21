# 📊 VibeING — Бизнес-метрики и База данных

## 🐘 PostgreSQL

**Статус:** ✅ Работает  
**Версия:** 18.3  
**Аутентификация:** scram-sha-256

### Подключение

```
Хост: localhost:5432
База: vibeing_finflow
Пользователь: vibeing
Пароль: vibeing123
```

### Таблицы

| Таблица | Описание | Записей |
|---------|----------|---------|
| `profiles` | Пользователи | — |
| `transactions` | Транзакции | — |
| `goals` | Финансовые цели | — |
| `categories` | Категории | 9 |
| `metrics_events` | События метрик | >0 |

### Документы

- [README-POSTGRESQL.md](./README-POSTGRESQL.md) — полная документация
- [PROJECT.md](./PROJECT.md) — общая информация о проектах

---

## 📈 Бизнес-метрики

### Реализовано для FinFlow (3001)

#### Система сбора метрик
```
finflow/src/lib/metrics/
├── config.ts           # Типы событий и категории
├── service.ts          # Клиентский сервис трекинга
├── hooks.ts            # React hook для pageviews
```

#### API Endpoint
```
finflow/src/app/api/metrics/route.ts
POST /api/metrics — отправить события
GET /api/metrics — получить статистику
```

#### Events (бизнес-метрики)
| Событие | Когда отправляется |
|---------|-------------------|
| `pageview` | Каждая страница |
| `signup` | Регистрация |
| `signin` | Вход в систему |
| `dashboard_view` | Открытие дашборда |
| `transaction_added` | Добавление транзакции |
| `transaction_edited` | Редактирование |
| `goal_created` | Новая финансовая цель |
| `chart_filtered` | Фильтрация графика |
| `export_triggered` | Экспорт CSV/PDF |

#### Воронка конверсий
```
Просмотр → Регистрация → Вход → Дашборд → Транзакция → Цель
```

### Metrics Dashboard (3099)

#### Функционал
- KPI карточки (события, сессии, пользователи)
- Area Chart — динамика событий
- Bar Chart — типы событий
- Funnel Chart — воронка конверсий
- Top Pages — самые посещаемые
- Projects Grid — ссылки на все проекты
- Авто-обновление каждые 60 секунд

#### Mock данные
- Работает без реальной БД для тестирования
- Реальные данные из PostgreSQL при подключении

---

## 🗺️ Roadmap

### ✅ Сделано
- [x] PostgreSQL 18 локально
- [x] БД vibeing_finflow создана
- [x] Таблицы и индексы
- [x] 9 категорий по умолчанию
- [x] Система метрик в FinFlow
- [x] API для сбора метрик
- [x] Metrics Dashboard (mock)
- [x] Документы обновлены

### 🔄 В процессе
- [ ] Интеграция БД с UI FinFlow (замена localStorage)
- [ ] Metrics Dashboard подключен к PostgreSQL
- [ ] Добавление метрик в MediCare

### 📋 План
- [ ] GreenMarket (e-commerce метрики)
- [ ] FoodHub (доставка метрики)
- [ ] LuxStay (бронирования метрики)
- [ ] Artisan (портфолио метрики)
- [ ] Админ-панель для управления дашбордами

---

## 🚀 Быстрый старт

### Запуск проекта
```bash
cd C:/Users/User/Documents/VibeING
.\launch.ps1
```

### Проверка БД
```bash
cd C:/Users/User/Documents/VibeING/web-dev-landing/finflow
node -e "
const { query } = require('./src/lib/db');
query('SELECT COUNT(*) FROM categories')
  .then(r => console.log('Категорий:', r.rows[0].count))
  .then(() => process.exit(0));
"
```

### Подключение к БД
```bash
psql -h localhost -U vibeing -d vibeing_finflow
```