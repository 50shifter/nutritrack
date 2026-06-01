# install_ffmpeg.ps1 - Downloads ffmpeg and ffprobe for GIF Compressor
# Run: powershell -ExecutionPolicy Bypass -File install_ffmpeg.ps1

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$zipPath   = Join-Path $env:TEMP "ffmpeg-download.zip"
$outDir    = Join-Path $scriptDir "ffmpeg"

Write-Host "[1/4] Downloading ffmpeg..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $ffmpegUrl -OutFile $zipPath -UseBasicParsing

Write-Host "[2/4] Extracting..." -ForegroundColor Cyan
if (Test-Path $outDir) { Remove-Item $outDir -Recurse -Force }
Expand-Archive -Path $zipPath -DestinationPath $scriptDir -Force

# Move contents from ffmpeg-*-full_build to ffmpeg/
$extracted = Get-ChildItem -Directory -Path $scriptDir | Where-Object { $_.Name -match "^ffmpeg-" } | Select-Object -First 1
if ($extracted) {
    Move-Item "$($extracted.FullName)\bin" $outDir -Force
    Remove-Item $extracted.FullName -Recurse -Force
}

Write-Host "[3/4] Verifying..." -ForegroundColor Cyan
$ffmpegExe = Join-Path $outDir "ffmpeg.exe"
$ffprobeExe = Join-Path $outDir "ffprobe.exe"

if ((Test-Path $ffmpegExe) -and (Test-Path $ffprobeExe)) {
    & $ffmpegExe -version | Select-Object -First 1
    Write-Host ""
    Write-Host "[4/4] Done! ffmpeg installed at: $outDir" -ForegroundColor Green
} else {
    Write-Host "[!] Error: files not found" -ForegroundColor Red
    exit 1
}

# Clean up archive
Remove-Item $zipPath -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Ready. Run 'python app.py' to start." -ForegroundColor Green
