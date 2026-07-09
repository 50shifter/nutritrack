@echo off
cd /d C:\Users\User\Documents\VibeING\web-dev-landing\finflow
set PORT=3001
set NEXT_TELEMETRY_DISABLED=1
echo Starting finflow on port 3001...
npm run dev > finflow_test.log 2>&1
