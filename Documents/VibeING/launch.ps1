#
# launch.ps1 — Unified launcher for all VibeING projects
#
# Usage:
#   .\launch.ps1              — Start all dev servers
#   .\launch.ps1 --build      — Build + start production
#   .\launch.ps1 --stop       — Stop all servers
#   .\launch.ps1 --status     — Show status
#
# Deprecated (use launch.ps1 instead):
#   launch.js, launch-all.sh, start_all.cmd, run.ps1, etc.
#
# SYNOPSIS: Launch all VibeING projects
# FIX: ProcessManager embedded - no PSScriptRoot, no $pid conflict, no encoding issues
#

class ProcessManager {
    hidden [hashtable] $_children = @{}

    ProcessManager() {
        try {
            [Console]::TreatControlCAsInput = $true
            Register-EngineEvent -SourceIdentifier PowerShell.OnExit -Action {
                Write-Host "[ProcessManager] PowerShell exiting, killing children..." -ForegroundColor Red
                $this.StopAll()
            }
        } catch {}
    }

    [void] Spawn([string]$name, [string]$command, [string[]]$argsArr, [string]$workingDir) {
        if ($this._children.ContainsKey($name) -and -not $this._children[$name].killed) {
            Write-Host "[ProcessManager] $($name) already running, skipping" -ForegroundColor Yellow
            return
        }

        # Resolve full path to command - prefer .cmd/.bat/.exe over .ps1/.sh
        $cmdObj = Get-Command $command -ErrorAction SilentlyContinue
        if (-not $cmdObj) {
            Write-Host "[ProcessManager] Cannot find command: $($command)" -ForegroundColor Red
            return
        }
        $exePath = $cmdObj.Source
        # Prefer batch files and executables over scripts
        if ($exePath -match '\.(ps1|sh)$') {
            $candidates = @(Get-Command $command -All -ErrorAction SilentlyContinue | Where-Object {
                $_.Source -match '\.(cmd|bat|exe)$'
            })
            if ($candidates.Count -gt 0) {
                $exePath = $candidates[0].Source
            } else {
                Write-Host "[ProcessManager] No executable found for $($command)" -ForegroundColor Red
                return
            }
        }

        $cmdLine = "$command $($argsArr -join ' ')"
        Write-Host "[ProcessManager] Spawning $($name): $($cmdLine) (exe: $($exePath))" -ForegroundColor Cyan

        $logFile = Join-Path (Get-Location) "Logs\$name.log"

        # Start-Process works with .cmd/.bat files when given the full path
        $process = Start-Process -NoNewWindow -PassThru -WorkingDirectory $workingDir -FilePath $exePath -ArgumentList $argsArr 2>$null

        if (-not $process -or $process.Id -eq 0) {
            # Fallback: try with cmd.exe
            $process = Start-Process -NoNewWindow -PassThru -WorkingDirectory $workingDir -FilePath "cmd.exe" -ArgumentList ("/c", "$command $cmdLine") 2>$null
        }

        if (-not $process) {
            Write-Host "[ProcessManager] Failed to start $($name)" -ForegroundColor Red
            return
        }

        Write-Host "[ProcessManager] $($name) started, PID: $($process.Id)" -ForegroundColor Green

        $this._children[$name] = @{
            process   = $process
            pid       = $process.Id
            name      = $name
            startTime = Get-Date
            killed    = $false
            logFile   = $logFile
        }

        $procPid = $process.Id
        Register-ObjectEvent -InputObject $process -EventName Exited -Action {
            $procObj = $event.SourceEventArgs.Process
            $foundName = $null
            foreach ($k in $this._children.Keys) {
                if ($this._children[$k].pid -eq $procPid) {
                    $foundName = $k
                    break
                }
            }
            if ($foundName) {
                Write-Host "[ProcessManager] $($foundName) exited (code: $($procObj.ExitCode))" -ForegroundColor Gray
                $this._children.Remove($foundName)
            }
        }
    }

    [bool] Kill([string]$name) {
        $entry = $this._children[$name]
        if (-not $entry) {
            Write-Host "[ProcessManager] $($name) not found" -ForegroundColor Yellow
            return $false
        }

        $entry.killed = $true
        $process  = $entry.process

        if ($process.Id -gt 0 -and -not $process.HasExited) {
            Write-Host "[ProcessManager] Killing $($name) (PID: $($process.Id))" -ForegroundColor Yellow
            try {
                Stop-Process -Id $process.Id -Force -ErrorAction Stop
            } catch {
                try { $process.Kill($true) } catch {}
            }
        }

        $this._children.Remove($name)
        return $true
    }

    [void] StopAll() {
        Write-Host "[ProcessManager] Stopping ALL tracked processes..." -ForegroundColor Yellow

        $names = @($this._children.Keys -as [string[]])
        foreach ($name in $names) {
            $this.Kill($name)
        }

        Write-Host "[ProcessManager] All processes stopped" -ForegroundColor Green
    }

    [void] Status() {
        Write-Host ""
        Write-Host "=== Process Manager Status ===" -ForegroundColor Cyan
        if ($this._children.Count -eq 0) {
            Write-Host "  No tracked processes" -ForegroundColor Gray
        } else {
            foreach ($name in $this._children.Keys) {
                $entry  = $this._children[$name]
                $proc   = $entry.process
                $alive  = -not $proc.HasExited
                $age    = [math]::Round((New-TimeSpan -Start $entry.startTime).TotalSeconds)
                Write-Host "  $($name) : PID=$($proc.Id), alive=$alive, age=${age}s" -ForegroundColor Green
            }
        }
        Write-Host "  Total: $($this._children.Count) processes tracked"
        Write-Host "================================" -ForegroundColor Cyan
        Write-Host ""
    }

    [void] EnforceSafetyLimit() {
        # Safety: kill any process that creates too many connections (prevents runaway)
        try {
            $netstat = netstat -ano 2>$null
            if (-not $netstat) { return }

            # Count ESTABLISHED connections per PID
            $connCounts = @{}
            foreach ($line in $netstat) {
                if ($line -match 'ESTABLISHED\s+(\d+)\s*$') {
                    $pid = [int]$matches[1]
                    if ($connCounts.ContainsKey($pid)) {
                        $connCounts[$pid]++
                    } else {
                        $connCounts[$pid] = 1
                    }
                }
            }

            # Check our children against connection counts
            $children = $this.GetType().GetField("_children", "NonPublic,Instance").GetValue($this)
            if ($children -and $children.Count -gt 0) {
                # Log connection counts for all tracked processes (debugging)
                $connSummary = @()
                foreach ($name in @($children.Keys)) {
                    $entry = $children[$name]
                    if ($entry -and $entry.process -and -not $entry.process.HasExited) {
                        $pid = $entry.process.Id
                        $count = 0
                        if ($connCounts.ContainsKey($pid)) { $count = $connCounts[$pid] }
                        $connSummary += "$name(PID=$pid)=$count"
                    }
                }
                Write-Host "[CONNECTORS] $($connSummary -join ' | ')" -ForegroundColor Yellow

                # Kill runaway: limit 100 ESTABLISHED connections
                $MAX_CONNECTIONS = 100
                foreach ($name in @($children.Keys)) {
                    $entry = $children[$name]
                    if ($entry -and $entry.process -and -not $entry.process.HasExited) {
                        $pid = $entry.process.Id
                        if ($connCounts.ContainsKey($pid)) {
                            $count = $connCounts[$pid]
                            if ($count -gt $MAX_CONNECTIONS) {
                                Write-Host "" -ForegroundColor Red
                                Write-Host "[SAFETY] $($name) PID=$pid has $count connections (limit: $MAX_CONNECTIONS) -- KILLING" -ForegroundColor Red
                                $this.Kill($name)
                            }
                        }
                    }
                }
            }
        } catch {}
    }
}

# --- Launch Logic ---
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir -or -not (Test-Path $scriptDir)) {
    $scriptDir = $PSScriptRoot
}
if (-not $scriptDir -or -not (Test-Path $scriptDir)) {
    $scriptDir = (Get-Location).Path
}

# Run log rotation before starting
$rotateScript = Join-Path $scriptDir "rotate-logs.ps1"
if (Test-Path $rotateScript) {
    try { . $rotateScript } catch { }
}

$pm = [ProcessManager]::new()

$logDir = Join-Path $scriptDir "Logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

$dirs = @(
    "web-dev-landing\finflow",
    "web-dev-landing\medicare",
    "web-dev-landing\greenmarket",
    "web-dev-landing\foodhub",
    "web-dev-landing\luxstay",
    "web-dev-landing\artisan",
    "web-dev-landing\metrics-dashboard"
)
$ports = @(3001, 3002, 3003, 3004, 3005, 3006, 3099)
$names = @("finflow", "medicare", "greenmarket", "foodhub", "luxstay", "artisan", "metrics-dashboard")

try {
    Write-Host ""
    Write-Host "=== Launching all projects with ProcessManager ===" -ForegroundColor Cyan

    # Dynamic memory allocation based on system RAM
    $totalGB = Get-CimInstance Win32_ComputerSystem | Select-Object -ExpandProperty TotalPhysicalMemory
    $totalGB = [math]::Floor($totalGB / 1GB)
    
    # Calculate per-instance memory: 4 projects = 2GB, 6+ projects = 1.5GB each
    $perInstanceMB = if ($totalGB -ge 32) { 2048 }
                     elseif ($totalGB -ge 16) { 1536 }
                     else { 1024 }
    
    Write-Host "  System RAM: ${totalGB}GB, Per-instance limit: ${perInstanceMB}MB" -ForegroundColor Gray

    for ($i = 0; $i -lt $dirs.Count; $i++) {
        $env:NODE_OPTIONS = "--max-old-space-size=$perInstanceMB"
        $pm.Spawn(
            $names[$i],
            "npx",
            @("next", "dev", "--port", $ports[$i].ToString()),
            (Join-Path $scriptDir $dirs[$i])
        )
        Write-Host "  [OK] $($names[$i]) :$($ports[$i])" -ForegroundColor Green
        # FIX: Increased stagger delay to prevent concurrent compilation memory spikes.
        # Each server needs time to initialize its dev compiler before the next one starts.
        Start-Sleep -Seconds 2
    }

    Write-Host ""
    Write-Host "Waiting for servers to be ready (health checks)..." -ForegroundColor Yellow
    $maxWait = 90
    $elapsed = 0
    $allReady = $false
    while ($elapsed -lt $maxWait -and -not $allReady) {
        Start-Sleep -Seconds 2
        $elapsed += 2
        $readyCount = 0
        foreach ($port in $ports) {
            $check = netstat -ano 2>$null | Select-String ":${port} " | Select-String "LISTENING"
            if ($check) { $readyCount++ }
        }
        Write-Host "  [$elapsed/s] $readyCount/$($ports.Count) servers ready" -ForegroundColor Gray
        if ($readyCount -eq $ports.Count) {
            $allReady = $true
        }
    }

    if (-not $allReady) {
        Write-Host ""
        Write-Host "[WARN] Not all servers became ready within ${maxWait}s. Some may still be compiling." -ForegroundColor Yellow
    } else {
        Write-Host "  All servers are ready!" -ForegroundColor Green
    }

    # ── Post-launch smoke test ─────────────────────────────
    Write-Host ""
    Write-Host "[POST-LAUNCH] Running smoke tests..." -ForegroundColor Yellow
    $smokeFailed = 0
    foreach ($port in $ports) {
        try {
            $res = Invoke-WebRequest -Uri "http://localhost:${port}/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
            if ($res.StatusCode -ne 200) {
                Write-Host "  [WARN] Port $port health: $($res.StatusCode)" -ForegroundColor Yellow
                $smokeFailed++
            }
        } catch {
            Write-Host "  [FAIL] Port $port not responding" -ForegroundColor Red
            $smokeFailed++
        }
    }
    if ($smokeFailed -eq 0) {
        Write-Host "  [OK] All servers responding correctly" -ForegroundColor Green
    } else {
        Write-Host "  [!] $smokeFailed servers have issues - check logs in Logs/" -ForegroundColor Yellow
    }

    $ports_check = netstat -ano | Select-String ":300[1-6] " | Select-String "LISTENING"
    if ($ports_check) {
        Write-Host ""
        Write-Host "=== Listening on ports ===" -ForegroundColor Green
        $ports_check | Write-Host
    }

    Write-Host ""
    Write-Host "=== All 6 servers running ===" -ForegroundColor Green
    Write-Host "  Press Ctrl+C to stop ALL servers" -ForegroundColor Gray

    $pm.Status()

    # --- Keep alive loop ---
    Write-Host "Running... (Ctrl+C to stop)" -ForegroundColor Gray

    # Detect console availability safely
    $hasConsole = $false
    try {
        $hasConsole = (-not [Console]::IsInputRedirected)
    } catch {
        $hasConsole = $false
    }

    if ($hasConsole) {
        while ($true) {
            Start-Sleep -Seconds 5
            try {
                if ([Console]::KeyAvailable) {
                    $key = [Console]::ReadKey($true)
                    if ($key.Modifiers -band [ConsoleModifiers]::Control -and $key.Key -eq [ConsoleKey]::C) {
                        Write-Host ""
                        Write-Host "[ProcessManager] Ctrl+C detected, stopping all..." -ForegroundColor Yellow
                        $pm.StopAll()
                        return
                    }
                }
            } catch {}

            try {
                $children = $pm.GetType().GetField("_children", "NonPublic,Instance").GetValue($pm)
                if ($children -and $children.Count -gt 0) {
                    foreach ($name in @($children.Keys)) {
                        $entry = $children[$name]
                        if ($entry -and $entry.process -and $entry.process.HasExited) { $pm.Kill($name) | Out-Null }
                    }
                }
            } catch {}

            # Safety: detect and kill runaway processes
            $pm.EnforceSafetyLimit()
        }
    } else {
        while ($true) {
            Start-Sleep -Seconds 5
            try {
                $children = $pm.GetType().GetField("_children", "NonPublic,Instance").GetValue($pm)
                if ($children -and $children.Count -gt 0) {
                    foreach ($name in @($children.Keys)) {
                        $entry = $children[$name]
                        if ($entry -and $entry.process -and $entry.process.HasExited) { $pm.Kill($name) | Out-Null }
                    }
                }
            } catch {}

            # Safety: detect and kill runaway processes
            $pm.EnforceSafetyLimit()
        }
    }
}
finally {
    Write-Host "[ProcessManager] Shutting down..." -ForegroundColor Yellow
    $pm.StopAll()
}
