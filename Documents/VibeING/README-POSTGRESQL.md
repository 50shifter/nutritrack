# 🐘 PostgreSQL — VibeING

## Конфигурация

**Версия:** PostgreSQL 18.3  
**Тип аутентификации:** scram-sha-256

### Подключение к БД FinFlow

| Параметр | Значение |
|----------|----------|
| Хост | `localhost` |
| Порт | `5432` |
| База данных | `vibeing_finflow` |
| Пользователь | `vibeing` |
| Пароль | `vibeing123` |

### Подключение как postgres (администратор)

| Параметр | Значение |
|----------|----------|
| Хост | `localhost` |
| Порт | `5432` |
| База данных | `vibeing_finflow` |
| Пользователь | `postgres` |
| Пароль | `postgres` |

## Таблицы

### profiles
Пользователи системы
```sql
id SERIAL PRIMARY KEY
email TEXT UNIQUE NOT NULL
name TEXT
created_at TIMESTAMP
```

### transactions
Финансовые транзакции
```sql
id SERIAL PRIMARY KEY
user_id INTEGER NOT NULL
amount DECIMAL(12,2) NOT NULL
type TEXT CHECK (type IN ('income', 'expense'))
category TEXT
description TEXT
date DATE NOT NULL
created_at TIMESTAMP
```

### goals
Финансовые цели
```sql
id SERIAL PRIMARY KEY
user_id INTEGER NOT NULL
name TEXT NOT NULL
target_amount DECIMAL(12,2) NOT NULL
current_amount DECIMAL(12,2) DEFAULT 0
deadline DATE
created_at TIMESTAMP
```

### categories
Категории доходов/расходов
```sql
id SERIAL PRIMARY KEY
user_id INTEGER
name TEXT NOT NULL
type TEXT CHECK (type IN ('income', 'expense'))
color TEXT
limit_amount DECIMAL(12,2)
created_at TIMESTAMP
```

**По умолчанию:** 9 категорий (Продукты, Транспорт, Развлечения, Здоровье, Образование, Жильё, Зарплата, Фриланс, Инвестиции)

### metrics_events
События для аналитики
```sql
id SERIAL PRIMARY KEY
name TEXT NOT NULL
session_id TEXT NOT NULL
user_id INTEGER
page TEXT NOT NULL
referrer TEXT
properties TEXT DEFAULT '{}'
created_at TIMESTAMP
```

## Индексы

- `idx_transactions_user` — быстрый поиск по пользователю
- `idx_transactions_date` — фильтрация по дате
- `idx_transactions_type` — фильтрация по типу
- `idx_goals_user` — поиск целей пользователя
- `idx_metrics_name` — группировка по типу события
- `idx_metrics_created` — сортировка по времени
- `idx_metrics_session` — трекинг сессий

## Подключение в коде

### Node.js
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'vibeing_finflow',
  user: process.env.DB_USER || 'vibeing',
  password: process.env.DB_PASSWORD || 'vibeing123',
});
```

### TypeScript
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'vibeing_finflow',
  user: process.env.DB_USER || 'vibeing',
  password: process.env.DB_PASSWORD || 'vibeing123',
});
```

## Управление

### Перезапуск PostgreSQL (если нужно)

Через Services:
1. Откройте `services.msc`
2. Найдите `postgresql-x64-18`
3. Нажмите Restart

Через PowerShell (admin):
```powershell
Restart-Service postgresql-x64-18
```

### Подключение через psql
```bash
psql -h localhost -U vibeing -d vibeing_finflow
```

### Резервное копирование
```bash
pg_dump -h localhost -U vibeing vibeing_finflow > backup.sql
```

### Восстановление
```bash
psql -h localhost -U vibeing vibeing_finflow < backup.sql
```

## Безопасность

- Аутентификация: `scram-sha-256`
- Пароли хешируются
- pg_hba.conf настроен на локальное подключение (127.0.0.1/32)
- Внешние подключения отключены

## Troubleshooting

### Ошибка: "password authentication failed"
1. Проверьте пароль в `.env.local`
2. Убедитесь, что PostgreSQL запущен
3. Проверьте файл `pg_hba.conf`

### Ошибка: "could not connect to server"
1. Проверьте, запущен ли PostgreSQL
2. Проверьте порт (по умолчанию 5432)
3. Убедитесь, что нет брандмауэра

### Сброс пароля postgres
```sql
-- Подключитесь как postgres через trust auth (временно)
ALTER USER postgres WITH PASSWORD 'новый_пароль';
```