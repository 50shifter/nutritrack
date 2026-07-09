<#
.SYNOPSIS
    Stop tracked VibeING servers only (by port, NOT by process name).
    Safe: does NOT kill all node processes (protects ACP agent).
#>

Write-Host "`n=== Stopping tracked servers (ports 3001-3006) ===" -ForegroundColor Red

$stopped = 0
$ports = @(3001, 3002, 3003, 3004, 3005, 3006)

foreach ($port in $ports) {
    $tcp = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($conn in $tcp) {
        Write-Host "  Killing PID $($conn.OwningProcess) on port $port" -ForegroundColor Yellow
        try {
            Stop-Process -Id $conn.OwningProcess -Force
            $stopped++
        } catch {
            Write-Host "    Failed to kill" -ForegroundColor DarkRed
        }
    }
}

if ($stopped -eq 0) {
    Write-Host "  No tracked servers found" -ForegroundColor Green
} else {
    Write-Host "  Stopped $stopped tracked servers" -ForegroundColor Green
}

Write-Host "`n=== Done ===" -ForegroundColor Green
