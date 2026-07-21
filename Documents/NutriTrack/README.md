# 🥗 NutriTrack

> Умный трекер питания — SPA на чистом JavaScript (Vanilla JS, ES Modules)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](#-быстрый-запуск)
[![GitHub Pages](https://img.shields.io/badge/github-pages-lightgray.svg)](https://github.com/50shifter/nutritrack)

## ✨ Возможности

| Раздел | Что делает |
|--------|------------|
| 📊 **Дашборд** | Сводка БЖУ за день, прогресс-бары |
| 🧮 **Калькулятор** | Расчёт BMR/TDEE/ИМТ по формуле Mifflin-St Jeor |
| 🍽 **Дневник питания** | Добавление продуктов на завтраки/обеды/ужины/перекусы |
| ⚖️ **ИМТ** | Расчёт индекса массы тела с рекомендациями |
| 💡 **Рекомендации** | Режим питания, гидратация, советы по тренировкам |
| 📚 **О нутриентах** | Справочник 12 витаминов/минералов с нормами |
| 👤 **Профиль** | Настройки пользователя, сброс данных |

## 🚀 Быстрый запуск

### Local Dev

```bash
npm install
npm start          # http://localhost:3000
```

### Docker (Production)

```bash
# Собрать и запустить
docker-compose up -d

# Открыть
open http://localhost:8080
```

### Docker (Build Only)

```bash
docker build -t nutritrack .
docker run -p 8080:80 nutritrack
```

### GitHub Actions

Проект настроен для автодеплоя на GitHub Pages при пуше в `main`.

## 📁 Структура проекта

```
NutriTrack/
├── index.html                  # Главная страница (SPA)
├── css/
│   ├── main.css                # Основные стили + CSS Variables
│   └── responsive.css          # Адаптив (breakpoints: 480/768/1024/1280)
├── js/
│   ├── app.js                  # Главный модуль (роутинг, навигация, тосты)
│   ├── constants/
│   │   └── macros.js           # Единый источник: MACRO_RATIOS, GOAL_MULTIPLIERS, ACTIVITY_MODES
│   ├── db/
│   │   ├── products-db.js      # База из 278 продуктов (13 категорий)
│   │   └── product-aliases.js  # Алиасы для поиска (static map)
│   ├── modules/
│   │   ├── storage.js          # IndexedDB + localStorage
│   │   ├── bmi-calculator.js   # BMR / TDEE / ИМТ
│   │   ├── calorie-builder.js  # Расчёт калорий по цели
│   │   ├── nutrition-facts.js  # Справочник нутриентов
│   │   └── recommendations.js  # Режим питания, гидратация, советы
│   └── utils/
│       └── helpers.js          # Утилиты: форматирование, clamp, parseNumber
├── sw.js                       # Service Worker (Cache-First / Network-First)
├── manifest.json               # PWA манифест
├── nginx/
│   └── default.conf            # Nginx конфиг для продакшена
├── Dockerfile                  # Docker build
├── docker-compose.yml          # docker-compose setup
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions CI/CD
├── server.js                   # Dev-сервер (port 3000)
├── clean-dist.js               # Очистка dist/
├── copy-assets.js              # Копирование в dist/
└── package.json
```

## 🛠 Технологии

| Компонент | Решение |
|-----------|---------|
| **Frontend** | Vanilla JS ES Modules (без фреймворков) |
| **Стили** | CSS Variables + Grid/Flexbox + Responsive |
| **Хранение** | IndexedDB (записи) + localStorage (профиль/тема) |
| **PWA** | Service Worker + Web App Manifest |
| **Иконки** | Font Awesome 6 (CDN) |
| **Деплой** | GitHub Pages / Docker / Nginx |
| **CI/CD** | GitHub Actions |

## 🐛 Исправления из Code Review

| # | Критичность | Что исправлено |
|---|-------------|----------------|
| **C1** | 🔴 Critical | Удалены дубликаты продуктов (Сёмга, Сыр, Камамбер и др.) |
| **C2** | 🔴 Critical | `cleanupOldRecords()` — group-by `date + type` вместо `timestamp` |
| **C3** | 🔴 Critical | Убраны `window.navigate`, `window.openProductModal` |
| **C4** | 🔴 Critical | Cookie banner: `padding-bottom: env(safe-area-inset-bottom)` |
| **M1** | 🟡 Medium | Удалены мёртвые экспорты (`formatCalories`, `createMealTab`...) |
| **M3** | 🟡 Medium | Единый `MACRO_RATIOS` в `js/constants/macros.js` |
| **M4** | 🟡 Medium | Статический `aliases` map вместо dynamic import |

## 🔒 Приватность

Все данные хранятся **локально** в IndexedDB / localStorage браузера. **Нет** сетевых запросов к внешним API.

## 📱 PWA

Проект зарегистрирован как PWA — можно добавить на экран «Домой»:

1. Откройте сайт в мобильном браузере
2. «Поделиться» → «На экран "Домой"»
3. Приложение установится и будет работать офлайн

## 📄 Лицензия

MIT