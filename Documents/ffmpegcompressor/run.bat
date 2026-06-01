@echo off
cd /d "%~dp0"

:: Добавляем локальный ffmpeg в PATH
if exist "ffmpeg-2026-full_build\bin\ffmpeg.exe" (
    set "PATH=ffmpeg-2026-full_build\bin;%PATH%"
) else if exist "ffmpeg-bin\bin\ffmpeg.exe" (
    set "PATH=ffmpeg-bin\bin;%PATH%"
)

:: Запуск без консольного окна (pythonw)
start "" pythonw app.py %*
