@echo off
rem ═══════════════════════════════════════
rem VibeING — SSH Reverse Tunnel + Local Dev (FIXED)
rem FIX: Используем PowerShell ProcessManager
rem ═══════════════════════════════════════

echo =========================================
echo   SSH Tunnel + Dev Servers (ProcessManager)
echo =========================================
echo.

cd /d "%~dp0"

echo [INFO] Launching all via PowerShell ProcessManager...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch.ps1"

echo.
echo =========================================
echo   Setup Complete!
echo =========================================
echo.
echo Sites accessible via server reverse proxy:
echo   http://155.212.220:3001  (finflow)
echo   http://155.212.220:3002  (medicare)
echo   http://155.212.220:3003  (greenmarket)
echo   http://155.212.220:3004  (foodhub)
echo   http://155.212.220:3005  (luxstay)
echo   http://155.212.220:3006  (artisan)
echo.
echo To stop: close the window or run: stop-all.bat
echo.
pause
