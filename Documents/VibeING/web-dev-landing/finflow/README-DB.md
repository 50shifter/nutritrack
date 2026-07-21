# 🐘 PostgreSQL Setup для VibeING

## Вариант 1: Docker (рекомендуется)

```bash
cd C:/Users/User/Documents/VibeING/web-dev-landing/finflow
docker-compose up -d
```

## Вариант 2: Ручная установка PostgreSQL

### Windows (через установщик)

1. Скачайте PostgreSQL 16: https://www.postgresql.org/download/windows/
2. Запустите установщик, запомните пароль для `postgres`
3. Откройте pgAdmin или командную строку PostgreSQL

### Создание пользователя и БД

```sql
-- Откройте psql или pgAdmin и выполните:

-- Создаём пользователя
CREATE USER vibeing WITH PASSWORD 'vibeing123';

-- Создаём базу данных
CREATE DATABASE vibeing_finflow OWNER vibeing;

-- Даем права
GRANT ALL PRIVILEGES ON DATABASE vibeing_finflow TO vibeing;

-- Подключаемся к БД
\c vibeing_finflow

-- Применяем schema
\i C:\Users\User\Documents\VibeING\web-dev-landing\finflow\database\schema.sql
```

## Вариант 3: PostgreSQL через winget

```powershell
winget install PostgreSQL.PostgreSQL.16
```

## Проверка подключения

```bash
cd C:/Users/User/Documents/VibeING/web-dev-landing/finflow
npm run db:setup
```

## Структура БД

```
vibeing_finflow
├── profiles              # Пользователи
├── transactions          # Финансовые транзакции
├── goals                # Финансовые цели
├── categories           # Категории (доходы/расходы)
└── metrics_events       # Метрики для аналитики
```

## Индексы

- `idx_transactions_user` - быстрый поиск по user
- `idx_transactions_date` - фильтрация по дате
- `idx_transactions_type` - фильтрация по типу
- `idx_metrics_name` - группировка по типу событий
- `idx_metrics_created` - сортировка по времени