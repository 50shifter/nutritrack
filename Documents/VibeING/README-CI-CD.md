# VibeING — CI/CD Pipeline

## Архитектура

```
push to main → GitHub Actions
  ├─ lint (TypeScript check)
  ├─ build (7 проектов параллельно)
  ├─ package (архив билдов)
  ├─ deploy (SSH → сервер)
  └─ health-check (проверка)
```

## Настройка Secrets

В **Settings → Secrets → Actions** добавить:

| Secret | Описание | Где взять |
|--------|----------|-----------|
| `DEPLOY_SERVER_IP` | IP сервера | Ваш VPS |
| `DEPLOY_SSH_KEY` | SSH приватный ключ | `cat ~/.ssh/id_ed25519` |
| `DEPLOY_SSH_USER` | Пользователь SSH | `root` |
| `DB_PASSWORD` | Пароль PostgreSQL | Из `.env` |
| `AUTH_SECRET` | NextAuth secret | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Если используется |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Если используется |

## Ручной запуск

```
Actions → VibeING Deploy → Run workflow
```

## Локальный деплой

```bash
# Windows
.\deploy.sh

# Linux/Mac
bash deploy.sh
```

## Сервер

1. Скачать `server-setup.sh` на сервер
2. Запустить: `sudo bash server-setup.sh`
3. Создаст systemd сервисы для всех 7 проектов

## Логирование

```bash
# Логи на сервере
tail -f /var/log/vibeing/finflow.log
tail -f /var/log/vibeing/medicare.log

# Проверка статусов
systemctl status vibeing-finflow
systemctl status vibeing-medicare
```

## Rollback

```bash
# На сервере — откат к предыдущей версии
cd /opt/vibeing
ls -lt  # посмотреть версии
# Остановить сервис
systemctl stop vibeing-finflow
# Переключить symlink на старую версию
ln -sfn /opt/vibeing/releases/v1.2.3 finflow
systemctl start vibeing-finflow
```

## Troubleshooting

**Проект не стартует:**
```bash
# Проверить логи
journalctl -u vibeing-finflow -f

# Перезапустить
systemctl restart vibeing-finflow

# Проверить порт
lsof -i :3001
```

**SSH не подключается:**
```bash
# Проверить ключ
ssh -i ~/.ssh/deploy_key root@SERVER_IP echo "OK"

# Проверить firewall
ufw status
```