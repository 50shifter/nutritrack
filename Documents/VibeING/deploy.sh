@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

:: ── Server Configuration (override with env vars or .deploy-env) ──
set "DEPLOY_SERVER_IP=%DEPLOY_SERVER_IP: =%"
set "DEPLOY_SSH_USER=%DEPLOY_SSH_USER: =%"
set "DEPLOY_SSH_KEY=%DEPLOY_SSH_KEY: =%"

if "!DEPLOY_SERVER_IP!"=="" set "DEPLOY_SERVER_IP=155.212.231.220"
if "!DEPLOY_SSH_USER!"=="" set "DEPLOY_SSH_USER=root"
if "!DEPLOY_SSH_KEY!"=="" set "DEPLOY_SSH_KEY=~/.ssh/id_ed25519_155.212.231.220"

:: Load .deploy-env if exists (skip export prefix)
if exist ".deploy-env" (
    for /f "usebackq tokens=1,2 delims==" %%A in (".deploy-env") do (
        set "_key=%%A"
        set "_val=%%B"
        if "!_key:~-7!"=="_IP" set "DEPLOY_SERVER_IP=!_val:~1,-1!"
        if "!_key:~-4!"=="USER" set "DEPLOY_SSH_USER=!_val:~1,-1!"
        if "!_key:~-3!"=="KEY" set "DEPLOY_SSH_KEY=!_val:~1,-1!"
    )
)

:: ═══════════════════════════════════════
:: VibeING Unified Deploy Script v2
:: Deploy all sites to server
:: Resume: raw HTML (inline CSS, no tree-shaking)
:: Landing: Next.js static export
:: ═══════════════════════════════════════

echo.
echo ====================================================
echo   VibeING — Unified Deploy v2
echo   Server: %DEPLOY_SSH_USER%@%DEPLOY_SERVER_IP%
echo ====================================================
echo.

cd /d "%~dp0"

:: ── 1. Deploy siteresume (RAW HTML) ─────────────
echo [1/4] Deploy resume-site (raw HTML)...
if exist dist\index.html (
    echo   -> Cleaning server directory...
    ssh %DEPLOY_SSH_USER%@%DEPLOY_SERVER_IP% "rm -rf /opt/resume-site/*" 2>nul
) else (
    echo   [!] dist/ not found! Run manually:
    echo       cd siteresume && npx astro build
    goto :error
)
scp -r dist\* %DEPLOY_SSH_USER%@%DEPLOY_SERVER_IP%:/opt/resume-site/ >nul 2>&1
echo   -> Resume deployed to http://%DEPLOY_SERVER_IP%:2525

:: ── 2. Deploy web-dev-landing (NEXT.JS) ───────
echo.
echo [2/4] Deploy VibeING landing...
cd /d "%~dp0web-dev-landing"
if exist out (
    echo   -> Cleaning server directory...
    ssh %DEPLOY_SSH_USER%@%DEPLOY_SERVER_IP% "rm -rf /var/www/vibe-ing/out/*; mkdir -p /var/www/vibe-ing/out" 2>nul
) else (
    echo   -> Building Next.js...
    call npx next build >nul 2>&1
    if errorlevel 1 (
        echo   [!] Build error! Running in console...
        call npx next build
    )
    ssh %DEPLOY_SSH_USER%@%DEPLOY_SERVER_IP% "rm -rf /var/www/vibe-ing/out/*; mkdir -p /var/www/vibe-ing/out" 2>nul
)
scp -r out\* %DEPLOY_SSH_USER%@%DEPLOY_SERVER_IP%:/var/www/vibe-ing/out/ >nul 2>&1
echo   -> Landing deployed to http://%DEPLOY_SERVER_IP%:8080

:: ── 3. Update nginx ──────────────────────────
echo.
echo [3/4] Checking nginx...
ssh %DEPLOY_SSH_USER%@%DEPLOY_SERVER_IP% "nginx -t 2>&1" >nul 2>&1

:: ── 4. Final check ────────────────────────
echo.
echo [4/4] Checking server...
ssh %DEPLOY_SSH_USER%@%DEPLOY_SERVER_IP% "curl -sI http://localhost:8080/ ^| head -1; curl -sI http://localhost:2525/ ^| head -1" 2>nul

echo.
echo ====================================================
echo   Done! Check:
echo     Resume (raw HTML):    http://%DEPLOY_SERVER_IP%:2525
echo     Landing (Next.js):   http://%DEPLOY_SERVER_IP%:8080
echo     FinFlow:             http://%DEPLOY_SERVER_IP%:3001
echo     MediCare:            http://%DEPLOY_SERVER_IP%:3002
echo     GreenMarket:         http://%DEPLOY_SERVER_IP%:3003
echo     FoodHub:             http://%DEPLOY_SERVER_IP%:3004
echo     LuxStay:             http://%DEPLOY_SERVER_IP%:3005
echo     Artisan:             http://%DEPLOY_SERVER_IP%:3006
echo ====================================================
echo.
goto :eof

:error
echo.
echo [!] Error! Check logs and try again.
echo.
