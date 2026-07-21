# =========================================
# NutriTrack — Dockerfile
# Сборка production-образа
# =========================================

# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем только package.json для кэша слоёв
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --no-audit --no-fund 2>/dev/null || npm install --no-audit --no-fund

# Копируем весь исходный код
COPY . .

# Запускаем сборку (если есть скрипт build)
RUN npm run build 2>/dev/null || echo "Build script not found, skipping"

# --- Stage 2: Production ---
FROM nginx:alpine

# Копируем собранные файлы из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Если сборка не нужна — копируем исходники
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/css /usr/share/nginx/html/css/
COPY --from=builder /app/js /usr/share/nginx/html/js/
COPY --from=builder /app/manifest.json /usr/share/nginx/html/
COPY --from=builder /app/sw.js /usr/share/nginx/html/

# Копируем nginx конфиг
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Создаём пользователя nginx
RUN addgroup -g 1001 -S nutrix && \
    adduser -S nutrixuser -u 1001 -G nutrix && \
    chown -R nutrixuser:nutrix /usr/share/nginx/html && \
    chown -R nutrixuser:nutrix /var/cache/nginx && \
    chown -R nutrixuser:nutrix /var/log/nginx && \
    chown -R nutrixuser:nutrix /etc/nginx/conf.d

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]