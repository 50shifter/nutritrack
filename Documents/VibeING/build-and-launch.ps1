<#
SYNOPSIS: Build all 6 projects, then launch in PRODUCTION mode.
Resource usage: hundreds of MB vs 32GB with next dev.
#>

$ErrorActionPreference = 'Continue'

#region PM
class Pm {
    hidden [hashtable] $_c = @{}

    [void] Spawn([string]$name, [string]$exe, [string[]]$args, [string]$wd, [hashtable]$env) {
        if ($this._c.ContainsKey($name) -and -not $this._c[$name].killed) {
            Write-Host "[PM] $name already running" -ForegroundColor Yellow
            return
        }
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = $exe
        $psi.Arguments = ($args -join ' ')
        $psi.WorkingDirectory = $wd
        $psi.UseShellExecute = $false
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        if ($env) { foreach ($k in $env.Keys) { $psi.EnvironmentVariables[$k] = $env[$k] } }

        $p = New-Object System.Diagnostics.Process
        $p.StartInfo = $psi
        if (-not $p.Start()) {
            Write-Host "[PM] FAILED: $name" -ForegroundColor Red
            return
        }
        Write-Host "[PM] $name -> PID $($p.Id)" -ForegroundColor Green
        $this._c[$name] = @{ process=$p; pid=$p.Id; startTime=Get-Date; killed=$false }
    }

    [bool] Kill([string]$name) {
        $e = $this._c[$name]
        if (-not $e) { return $false }
        $e.killed = $true
        if ($e.process.Id -gt 0 -and -not $e.process.HasExited) { try { $e.process.Kill() } catch {} }
        $this._c.Remove($name) | Out-Null
        return $true
    }

    [void] StopAll() {
        foreach ($n in @($this._c.Keys -as [string[]])) { $this.Kill($n) }
    }

    [void] Status() {
        Write-Host ""
        Write-Host "=== Processes ===" -ForegroundColor Cyan
        foreach ($n in $this._c.Keys) {
            $e = $this._c[$n]
            $ok = -not $e.process.HasExited
            $age = [math]::Round((New-TimeSpan -Start $e.startTime).TotalSeconds)
            Write-Host "  $($n) PID=$($e.process.Id) alive=$ok age=${age}s" -ForegroundColor Green
        }
        Write-Host "Total: $($this._c.Count)"
        Write-Host "=================" -ForegroundColor Cyan
        Write-Host ""
    }
}
#endregion

$scriptDir = (Get-Location).Path

# Run log rotation before starting
$rotateScript = Join-Path $scriptDir "rotate-logs.ps1"
if (Test-Path $rotateScript) {
    try { . $rotateScript } catch { }
}

$baseDir   = Join-Path $scriptDir "web-dev-landing"

$projects = @(
    @{ name="finflow";     dir="finflow";     port=3001 }
    @{ name="medicare";    dir="medicare";    port=3002 }
    @{ name="greenmarket"; dir="greenmarket"; port=3003 }
    @{ name="foodhub";     dir="foodhub";     port=3004 }
    @{ name="luxstay";     dir="luxstay";     port=3005 }
    @{ name="artisan";     dir="artisan";     port=3006 }
)

$pm = [Pm]::new()

# Kill leftover
Write-Host ""
Write-Host "=== Cleaning old processes ===" -ForegroundColor Red
# Kill only processes on our target ports (NOT all node)
Function Get-PidByPort {
  param($Port)
  Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique
}
foreach ($port in 3001,3002,3003,3004,3005,3006) {
  $pids = Get-PidByPort -Port $port
  foreach ($pid in $pids) {
    Write-Host "  [CLEAN] Killing PID $pid on port $port" -ForegroundColor Red
    try { Stop-Process -Id $pid -Force } catch {}
  }
}
Start-Sleep -Milliseconds 1000

# Phase 1: Build
Write-Host ""
Write-Host "=== Phase 1: Building all projects ===" -ForegroundColor Cyan

$buildStart = Get-Date
foreach ($p in $projects) {
    $dir = Join-Path $baseDir $p.dir
    Write-Host "  [$($p.name)]..." -ForegroundColor Cyan

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "npm"
    $psi.Arguments = "--prefix `"${dir}`" run build"
    $psi.UseShellExecute = $false

    $proc = [System.Diagnostics.Process]::Start($psi)

    while (-not $proc.HasExited) {
        $line = $proc.StandardOutput.ReadLine()
        if ($line -and ($line -match "Compiled|Built|error|Error|ready")) {
            Write-Host "    $($line.Substring(0, [Math]::Min(80, $line.Length)))"
        }
        $proc.StandardError.ReadToEnd() | Out-Null
        Start-Sleep -Milliseconds 200
    }

    if ($proc.ExitCode -eq 0) {
        Write-Host "  [OK] $($p.name) built" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] $($p.name) exit=$($proc.ExitCode)" -ForegroundColor Yellow
    }
}

$buildTime = [math]::Round((New-TimeSpan -Start $buildStart).TotalSeconds)
Write-Host ""
Write-Host "Build done in ${buildTime}s" -ForegroundColor Green

# Phase 2: Start production servers
Write-Host ""
Write-Host "=== Phase 2: Starting production servers ===" -ForegroundColor Cyan
Write-Host "  Mode: next start prodcution" -ForegroundColor Yellow
Write-Host "  RAM limit: 512MB per server" -ForegroundColor Yellow

# FIX: Increased NODE_OPTIONS from 512MB to 2048MB for production.
# 512MB was causing rendering failures — Next.js needs at least 1-2GB
# of heap space per instance to handle concurrent requests properly.
$envH = @{ "NODE_OPTIONS" = "--max-old-space-size=2048" }

foreach ($p in $projects) {
    $dir = Join-Path $baseDir $p.dir
    Start-Sleep -Milliseconds 200
    $pm.Spawn($p.name, "npx", @("next", "start", "--port", "$($p.port)"), $dir, $envH)
}

Write-Host ""
Write-Host "Waiting for ports..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

foreach ($p in $projects) {
    $port = $p.port
    $ok = netstat -ano 2>$null | Select-String ":${port}\b" | Select-String "LISTENING"
    if ($ok) {
        Write-Host "  [OK] http://localhost:${port} -> $($p.name)" -ForegroundColor Green
    } else {
        Write-Host "  [??] http://localhost:${port} -> $($p.name) waiting..." -ForegroundColor Yellow
    }
}

$pm.Status()
Write-Host "Type S for status. Ctrl+C to stop." -ForegroundColor Gray

$hasConsole = $false
try { $hasConsole = (-not [Console]::IsInputRedirected) } catch {}

if ($hasConsole) {
    while ($true) {
        Start-Sleep -Milliseconds 2000
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            if ($key.Key -eq [ConsoleKey]::C -and $key.Modifiers -band [ConsoleModifiers]::Control) {
                $pm.StopAll()
                Write-Host "All stopped." -ForegroundColor Yellow
                return
            }
            if ($key.Key -eq [ConsoleKey]::S) { $pm.Status() }
        }
        foreach ($e in @($pm._c.GetEnumerator())) {
            if ($e.Value.process.HasExited) {
                Write-Host "[PM] $($e.Value.name) died (exit=$($e.Value.process.ExitCode))" -ForegroundColor Yellow
                $pm.Kill($e.Value.name) | Out-Null
            }
        }
    }
} else {
    while ($true) { Start-Sleep -Seconds 5 }
}
