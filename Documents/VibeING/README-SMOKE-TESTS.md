# Smoke Tests — VibeING

Проверка что сервера не просто возвращают HTTP 200, а реально рендерят контент.

## Что проверяет

### 1. Health endpoints
Каждый проект должен отвечать `GET /health` с `200 OK` и JSON `{ "status": "ok" }`.

### 2. Content rendering
- Страница `GET /` должна содержать >1KB HTML
- Должна содержать ключевые слова из названия проекта (например, "FinFlow", "dashboard")
- Не должна содержать индикаторов ошибок

### 3. API endpoints
FinFlow API: `/api/dashboard`, `/api/transactions`, `/api/categories`, `/api/metrics`

## Запуск

### PowerShell (Windows dev)
```powershell
.\smoke-tests.ps1
```

### Node.js (CI, Linux)
```bash
node smoke-tests.js
```

### Exit codes
| Code | Значение |
|------|----------|
| 0    | Все тесты прошли |
| 1    | Один или more тестов провалился |
| 2    | Критическая ошибка (Node не запущен) |

## Пример провала

```
❌ FinFlow: Empty shell: 120 bytes (need >1KB)
```

Это значит что Next.js вернул HTTP 200, но страница пустая (OOM, compile error, etc).