#!/bin/bash
# ═══════════════════════════════════════════════════
# VibeING Server Setup — настройка сервера
# Запустить ОДИН раз после первого деплоя:
#   curl -sL https://raw.githubusercontent.com/.../server-setup.sh | sudo bash
# ═══════════════════════════════════════════════════

set -e

echo "🚀 VibeING Server Setup"
echo "========================"
echo ""

# ── 1. Создаём структуру директорий ──
echo "[1/6] Creating directory structure..."

VIBEING_DIR="/opt/vibeing"
LOG_DIR="/var/log/vibeing"

mkdir -p "$VIBEING_DIR"
mkdir -p "$LOG_DIR"

# Порт для каждого проекта
declare -A PORTS=(
  [finflow]=3001
  [medicare]=3002
  [greenmarket]=3003
  [foodhub]=3004
  [luxstay]=3005
  [artisan]=3006
  [metrics-dashboard]=3099
)

# ── 2. Создаём systemd сервисы ──
echo "[2/6] Creating systemd services..."

for project in "${!PORTS[@]}"; do
  port="${PORTS[$project]}"
  service_file="/etc/systemd/system/vibeing-${project}.service"
  
  cat > "$service_file" << EOF
[Unit]
Description=VibeING $project (Port $port)
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=$VIBEING_DIR/$project
ExecStart=/usr/bin/npx next start -p $port
Restart=always
RestartSec=5
StandardOutput=append:$LOG_DIR/$project.log
StandardError=append:$LOG_DIR/$project.log

# Security
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=$VIBEING_DIR
PrivateTmp=true

# Environment
Environment=NODE_ENV=production
Environment=NODE_OPTIONS=--max-old-space-size=1024
Environment=DB_HOST=localhost
Environment=DB_NAME=vibeing_finflow

[Install]
WantedBy=multi-user.target
EOF
  
  echo "  ✓ Created service: vibeing-${project}.service"
done

# ── 3. Разрешаем firewall порты ──
echo "[3/6] Configuring firewall..."

for port in "${PORTS[@]}"; do
  if command -v ufw &> /dev/null; then
    ufw allow $port/tcp 2>/dev/null || true
  elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=$port/tcp 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
  fi
  echo "  ✓ Allowed port $port"
done

# ── 4. Устанавливаем Nginx reverse proxy ──
echo "[4/6] Configuring Nginx..."

nginx_conf="/etc/nginx/sites-available/vibeing"

cat > "$nginx_conf" << 'EOF'
upstream finflow { server 127.0.0.1:3001; }
upstream medicare { server 127.0.0.1:3002; }
upstream greenmarket { server 127.0.0.1:3003; }
upstream foodhub { server 127.0.0.1:3004; }
upstream luxstay { server 127.0.0.1:3005; }
upstream artisan { server 127.0.0.1:3006; }
upstream metrics { server 127.0.0.1:3099; }

server {
    listen 80;
    server_name _;

    # Health checks
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }

    # Project routes
    location /finflow {
        proxy_pass http://finflow;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /medicare {
        proxy_pass http://medicare;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /greenmarket {
        proxy_pass http://greenmarket;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /foodhub {
        proxy_pass http://foodhub;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /luxstay {
        proxy_pass http://luxstay;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /artisan {
        proxy_pass http://artisan;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /metrics {
        proxy_pass http://metrics;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Default — serve static files
    location / {
        root /opt/vibeing/;
        index index.html;
    }
}
EOF

ln -sf "$nginx_conf" /etc/nginx/sites-enabled/vibeing
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t && systemctl reload nginx 2>/dev/null || true
echo "  ✓ Nginx configured"

# ── 5. Включаем автозапуск ──
echo "[5/6] Enabling services..."

systemctl daemon-reload

for project in "${!PORTS[@]}"; do
  systemctl enable vibeing-${project}.service 2>/dev/null || true
  systemctl start vibeing-${project}.service 2>/dev/null || true
  echo "  ✓ vibeing-${project} enabled"
done

# ── 6. Вывод статуса ──
echo "[6/6] Status..."
echo ""
echo "✅ Server setup complete!"
echo ""
echo "Services:"
systemctl list-units --type=service --state=running | grep vibeing || true
echo ""
echo "Logs: tail -f /var/log/vibeing/*.log"
echo "Restart: systemctl restart vibeing-<project>"
echo "Check: curl http://localhost:3001/health"