# install_ffmpeg.ps1 — скачивает ffmpeg и ffprobe для GIF Compressor
# Запуск: powershell -ExecutionPolicy Bypass -File install_ffmpeg.ps1

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$zipPath   = Join-Path $env:TEMP "ffmpeg-release..zip"
$outDir    = Join-Path $scriptDir "ffmpeg"

Write-Host "[1/4] Скачивание ffmpeg..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $ffmpegUrl -OutFile $zipPath -UseBasicParsing

Write-Host "[2/4] Распаковка..." -ForegroundColor Cyan
if (Test-Path $outDir) { Remove-Item $outDir -Recurse -Force }
Expand-Archive -Path $zipPath -DestinationPath $scriptDir -Force

# Перемещаем содержимое ffmpeg-*-full_build в ffmpeg/
$extracted = Get-ChildItem -Directory -Path $scriptDir | Where-Object { $_.Name -match "^ffmpeg-" } | Select-Object -First 1
if ($extracted) {
    Move-Item "$($extracted.FullName)\bin" $outDir -Force
    Remove-Item $extracted.FullName -Recurse -Force
}

Write-Host "[3/4] Проверка..." -ForegroundColor Cyan
$ffmpegExe = Join-Path $outDir "ffmpeg.exe"
$ffprobeExe = Join-Path $outDir "ffprobe.exe"

if ((Test-Path $ffmpegExe) -and (Test-Path $ffprobeExe)) {
    & $ffmpegExe -version | Select-Object -First 1
    Write-Host "`n[4/4] Готово! ffmpeg установлен в: $outDir" -ForegroundColor Green
} else {
    Write-Host "[!] Ошибка: файлы не найдены" -ForegroundColor Red
    exit 1
}

# Чистим архив
Remove-Item $zipPath -ErrorAction SilentlyContinue
Write-Host "`nГотово. Можно запускать app.py." -ForegroundColor Green
