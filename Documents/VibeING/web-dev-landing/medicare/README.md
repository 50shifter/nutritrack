# MediCare — Телемедицина

Портал телемедицины: видеозвонки через WebRTC, запись к врачам, история болезни, аптека, блог.

## Запуск (демо)

```bash
cd web-dev-landing/medicare
npm install
npm run dev
```

Откройте http://localhost:3002. Демо-вход: demo@medicare.ru / demo123

## Подключение MongoDB Atlas

1. Создайте кластер на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (M0 Free)
2. Создайте пользователя БД и добавьте IP в белый список (Network Access)
3. Скопируйте connection string
4. Настройте переменные:

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | MongoDB connection string |
| `AUTH_SECRET` | Секрет NextAuth (сгенерируйте через `npx auth secret`) |
| `NEXT_PUBLIC_BASE_URL` | URL приложения |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Опционально, Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Опционально, GitHub OAuth |

5. Инициализация БД:

```bash
npm run db:generate   # генерация Prisma клиента
npm run db:push       # применить схему
npm run db:seed       # заполнить демо-данными
```

## Технологии

Next.js 16, TypeScript, Tailwind CSS v4, MongoDB + Prisma, NextAuth 5, WebRTC (PeerJS), Framer Motion.
