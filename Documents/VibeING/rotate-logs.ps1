# rotate-logs.ps1 — Rotate all VibeING logs
# Runs before starting servers to prevent log bloat

$base = "$PSScriptRoot"
$logs = @(
    "$base\web-dev-landing\logs\*.log",
    "$base\Logs\*.log"
)

$maxSizeKB = 1024 # 1MB per log file

foreach ($pattern in $logs) {
    Get-ChildItem $pattern -ErrorAction SilentlyContinue | ForEach-Object {
        if ($_.Length -gt $maxSizeKB * 1024) {
            $backup = "$($_.FullName).$(Get-Date -Format 'yyyyMMdd-HHmmss').bak"
            Copy-Item $_.FullName $backup -ErrorAction SilentlyContinue
            Set-Content $_.FullName "" -ErrorAction SilentlyContinue
            Write-Host "Rotated: $($_.FullName) -> $backup"
        }
    }
}
