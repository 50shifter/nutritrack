#<#
.SYNOPSIS
    Auto-cleanup script for VibeING project
    Удаляет мусор, кэш, старые скрипты и исторические артефакты
.DESCRIPTION
    Фазы:
    0.1 - Удалить дублирующиеся скрипты запуска
    0.2 - Удалить исторические артефакты
    0.3 - Удалить .next/dev кэш и tsbuildinfo
    0.4 - Очистить логи
    0.5 - Убедиться что .gitignore корректен
#>

$ErrorActionPreference = 'Continue'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$landingRoot = Join-Path $projectRoot "web-dev-landing"

Write-Host "`n=== VibeING Auto-Cleanup ===" -ForegroundColor Cyan
Write-Host "Root: $projectRoot`n" -ForegroundColor Gray

$countDeleted = 0
$countCleared = 0
$errors = @()

# --- Phase 0.1: Удалить дублирующие скрипты ---
Write-Host "[0.1] Удаляем дублирующие скрипты..." -ForegroundColor Yellow

$deleteFiles = @(
    # Корневые
    "launch.js",
    "start-finflow-server.js",
    "_run_ps.mjs",
    "check-ports.ps1",
    "test-assets.js",
    "test-finflow.js",
    "ProcessManager.ps1",
    "lib\build-helper.js",
    
    # FinFlow
    "web-dev-landing\finflow\kill-all.ps1",
    "web-dev-landing\finflow\kill-node.ps1",
    "web-dev-landing\finflow\launch-bg.bat",
    "web-dev-landing\finflow\run-dev.ps1",
    "web-dev-landing\finflow\start-dev.ps1",
    
    # Корень landing
    "web-dev-landing\launch-all.sh"
)

foreach ($f in $deleteFiles) {
    $path = Join-Path $projectRoot $f
    if (Test-Path $path) {
        try {
            Remove-Item $path -Force -ErrorAction Stop
            Write-Host "  [OK] Deleted: $f" -ForegroundColor Green
            $countDeleted++
        } catch {
            Write-Host "  [FAIL] Cannot delete: $f — $_" -ForegroundColor Red
            $errors += "Delete failed: $f"
        }
    }
}

# --- Phase 0.2: Удалить исторические артефакты ---
Write-Host "`n[0.2] Удаляем исторические артефакты..." -ForegroundColor Yellow

$historyFiles = @(
    "DEPLOY_FIXES.md",
    "ZOMBIE_FIX.md",
    "VIDEO_PORTFOLIO_SCRIPTS.md"
)

foreach ($f in $historyFiles) {
    $path = Join-Path $projectRoot $f
    if (Test-Path $path) {
        try {
            Remove-Item $path -Force -ErrorAction Stop
            Write-Host "  [OK] Deleted: $f" -ForegroundColor Green
            $countDeleted++
        } catch {
            Write-Host "  [FAIL] Cannot delete: $f — $_" -ForegroundColor Red
            $errors += "Delete failed: $f"
        }
    }
}

# --- Phase 0.3: Удалить .next/dev кэш и tsbuildinfo ---
Write-Host "`n[0.3] Удаляем .next/dev кэш и tsbuildinfo..." -ForegroundColor Yellow

$projects = @("finflow", "medicare", "greenmarket", "foodhub", "luxstay", "artisan")

foreach ($proj in $projects) {
    # .next/dev/*
    $nextDev = Join-Path $landingRoot "$proj\.next\dev"
    if (Test-Path $nextDev) {
        try {
            Remove-Item "$nextDev\*" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  [OK] Cleared .next/dev: $proj" -ForegroundColor Green
            $countCleared++
        } catch {
            Write-Host "  [WARN] .next/dev cleanup: $proj — $_" -ForegroundColor Yellow
        }
    }
    
    # tsbuildinfo
    $tsbuildinfo = Join-Path $landingRoot "$proj\tsconfig.tsbuildinfo"
    if (Test-Path $tsbuildinfo) {
        try {
            Remove-Item $tsbuildinfo -Force -ErrorAction Stop
            Write-Host "  [OK] Deleted tsbuildinfo: $proj" -ForegroundColor Green
            $countDeleted++
        } catch {
            Write-Host "  [WARN] tsbuildinfo cleanup: $proj — $_" -ForegroundColor Yellow
        }
    }
}

# --- Phase 0.4: Очистить логи ---
Write-Host "`n[0.4] Очищаем логи..." -ForegroundColor Yellow

$logDirs = @(
    (Join-Path $landingRoot "logs"),
    (Join-Path $projectRoot "Logs")
)

foreach ($logDir in $logDirs) {
    if (Test-Path $logDir) {
        $logFiles = Get-ChildItem $logDir -Filter "*.log" -ErrorAction SilentlyContinue
        foreach ($lf in $logFiles) {
            try {
                Set-Content $lf.FullName "" -ErrorAction Stop
                Write-Host "  [OK] Cleared: $(Split-Path $lf.FullName -Leaf)" -ForegroundColor Green
                $countCleared++
            } catch {
                Write-Host "  [WARN] Log clear: $lf — $_" -ForegroundColor Yellow
            }
        }
    }
}

# --- Phase 0.5: Проверить .gitignore ---
Write-Host "`n[0.5] Проверяем .gitignore..." -ForegroundColor Yellow

$rootGitignore = Join-Path $projectRoot ".gitignore"
$expectedPatterns = @(
    ".next/dev/",
    "*.tsbuildinfo",
    "*.log",
    "logs/"
)

if (Test-Path $rootGitignore) {
    $content = Get-Content $rootGitignore -Raw
    $missing = @()
    foreach ($p in $expectedPatterns) {
        if ($content -notmatch [regex]::Escape($p)) {
            $missing += $p
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Host "  [WARN] .gitignore missing patterns: $($missing -join ', ')" -ForegroundColor Yellow
        Write-Host "  Add these to .gitignore manually." -ForegroundColor Gray
    } else {
        Write-Host "  [OK] .gitignore looks good" -ForegroundColor Green
    }
} else {
    Write-Host "  [WARN] .gitignore not found in root" -ForegroundColor Yellow
}

# --- Summary ---
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "  Files deleted: $countDeleted" -ForegroundColor White
Write-Host "  Files cleared: $countCleared" -ForegroundColor White
Write-Host "  Errors:        $($errors.Count)" -ForegroundColor $(if ($errors.Count -gt 0) { 'Red' } else { 'Green' })

if ($errors.Count -gt 0) {
    Write-Host "`nErrors:" -ForegroundColor Red
    foreach ($e in $errors) { Write-Host "  - $e" -ForegroundColor Red }
}

Write-Host "`n=== Cleanup Complete ===" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. git status          — проверить что удалено"
Write-Host "  2. git commit -m 'cleanup: remove garbage files'"
Write-Host "  3. npm run build        — проверить что билдится без ошибок"
Write-Host "  4. См. strategy-prompt.md для остальных фаз" -ForegroundColor Gray
