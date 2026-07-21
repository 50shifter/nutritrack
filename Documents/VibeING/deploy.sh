#!/bin/bash
# ═══════════════════════════════════════════════════
# VibeING Local Deploy — локальный деплой на VPS
# ═══════════════════════════════════════════════════

set -e

SERVER="${DEPLOY_SERVER_IP:-155.215.231.220}"
USER="${DEPLOY_SSH_USER:-root}"
KEY="${DEPLOY_SSH_KEY:-~/.ssh/id_ed25519_155.212.231.220}"
VIBEING_DIR="/opt/vibeing"

echo "🚀 VibeING Deploy to $USER@$SERVER"
echo "===================================="
echo ""

# ── Pre-flight checks ──
echo "[1/4] Pre-flight checks..."

if [ ! -d "web-dev-landing" ]; then
  echo "❌ web-dev-landing/ not found!"
  exit 1
fi

if [ ! -f "$KEY" ]; then
  echo "❌ SSH key not found: $KEY"
  exit 1
fi

echo "  ✅ Server: $SERVER"
echo "  ✅ SSH key: $KEY"
echo ""

# ── Build all projects ──
echo "[2/4] Building projects..."

declare -A PORTS=(
  [finflow]=3001 [medicare]=3002 [greenmarket]=3003
  [foodhub]=3004 [luxstay]=3005 [artisan]=3006
  [metrics-dashboard]=3099
)

for project in "${!PORTS[@]}"; do
  port="${PORTS[$project]}"
  echo "  Building $project (:$port)..."
  cd "web-dev-landing/$project"
  npm run build 2>&1 | tail -5
  cd ../../
done

echo "  ✅ All projects built"
echo ""

# ── Deploy ──
echo "[3/4] Deploying..."

ssh -i "$KEY" -o StrictHostKeyChecking=no "$USER@$SERVER" \
  "mkdir -p $VIBEING_DIR"

for project in "${!PORTS[@]}"; do
  port="${PORTS[$project]}"
  echo "  → $project (:$port)"
  scp -i "$KEY" -o StrictHostKeyChecking=no \
    -r "web-dev-landing/$project/.next" \
    "$USER@$SERVER:$VIBEING_DIR/$project/"
done

echo "  ✅ Upload complete"
echo ""

# ── Restart on server ──
echo "[4/4] Restarting services on server..."

ssh -i "$KEY" -o StrictHostKeyChecking=no "$USER@$SERVER" << 'EOFSCRIPT'
  set -e
  VIBEING="/opt/vibeing"
  
  for dir in finflow medicare greenmarket foodhub luxstay artisan metrics-dashboard; do
    if [ -d "$VIBEING/$dir/.next" ]; then
      echo "  🔄 Restarting $dir..."
      
      # Kill old process
      PID=$(lsof -ti :$((3000 + ${dir:0:1})) 2>/dev/null || true)
      [ -n "$PID" ] && kill $PID 2>/dev/null || true
      sleep 1
      
      # Start new
      cd "$VIBEING/$dir"
      npx next start &
    fi
  done
  
  echo "✅ Restart complete"
EOFSCRIPT

echo ""
echo "===================================="
echo "✅ Deploy complete!"
echo "Check: http://$SERVER"