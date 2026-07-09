@echo off
cd /d C:\Users\User\Documents\VibeING\web-dev-landing\artisan
set PORT=3000
set NEXT_TELEMETRY_DISABLED=1
echo Starting artisan on port 3000...
timeout /t 2 /nobreak > nul
echo Running npm run dev...
npm.cmd run dev 2> artisan_stderr.log
echo Exit code: %errorlevel%
echo.
echo --- Log contents: ---
type artisan_stderr.log 2>nul
