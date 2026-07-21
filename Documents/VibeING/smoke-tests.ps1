<#
.SYNOPSIS
    Smoke tests for VibeING — проверка рендера, не только HTTP 200
#>

$ErrorActionPreference = 'Stop'

$projects = @(
    @{ name="FinFlow";     port=3001; path="/";  mustContain=@("FinFlow","dashboard"); mustNotContain=@() }
    @{ name="MediCare";    port=3002; path="/";  mustContain=@("MediCare","doctors");  mustNotContain=@() }
    @{ name="GreenMarket"; port=3003; path="/";  mustContain=@("GreenMarket","catalog"); mustNotContain=@() }
    @{ name="FoodHub";     port=3004; path="/";  mustContain=@("FoodHub","restaurants"); mustNotContain=@() }
    @{ name="LuxStay";     port=3005; path="/";  mustContain=@("LuxStay","hotels"); mustNotContain=@() }
    @{ name="Artisan";     port=3006; path="/";  mustContain=@("Artisan","portfolio"); mustNotContain=@() }
    @{ name="Metrics";     port=3099; path="/";  mustContain=@("Ecosystem","Dashboard"); mustNotContain=@() }
)

$passed = 0
$failed = 0

function Test-Url {
    param([string]$url, [int]$timeoutSec = 8)
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec $timeoutSec -ErrorAction Stop
        return @{ ok = $true; status = $response.StatusCode; body = $response.Content }
    } catch {
        return @{ ok = $false; status = 0; body = ''; error = $_.Exception.Message }
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " VibeING Smoke Tests — Content Verification" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# Phase 1: Health checks
Write-Host "[1/3] Health endpoints..." -ForegroundColor Yellow
foreach ($p in $projects) {
    $r = Test-Url "http://localhost:$($p.port)/health"
    if ($r.ok -and $r.status -eq 200) {
        Write-Host "  [+] $($p.name) (:$($p.port)) healthy" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "  [-] $($p.name) (:$($p.port)) UNHEALTHY (status=$($r.status))" -ForegroundColor Red
        $failed++
    }
}

# Phase 2: Content rendering
Write-Host "`n[2/3] Content rendering..." -ForegroundColor Yellow
foreach ($p in $projects) {
    $r = Test-Url "http://localhost:$($p.port)$($p.path)"
    
    if (-not $r.ok) {
        Write-Host "  [-] $($p.name): HTTP $($r.status)" -ForegroundColor Red
        $failed += 2
        continue
    }
    
    $html = $r.body
    $errors = @()
    
    if ($html.Length -lt 1024) {
        $errors += "Empty shell: $($html.Length)B (need >1KB)"
    }
    
    foreach ($kw in $p.mustContain) {
        if ($html -notmatch [regex]::Escape($kw)) {
            $errors += "Missing keyword: `"$kw`""
        }
    }
    
    $title = $html | Select-String -Pattern '<title[^>]*>(.*?)</title>' -AllMatches
    $titleText = if ($title) { $title.Matches[0].Groups[1].Value } else { '(no title)' }
    
    $scripts = ([regex]::Matches($html, '<script')).Count
    
    if ($errors.Count -eq 0) {
        Write-Host "  [+] $($p.name): $($html.Length)B, title=`"$titleText`", $scripts scripts" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "  [-] $($p.name): $($errors -join '; ')" -ForegroundColor Red
        $failed++
    }
}

# Phase 3: API endpoints
Write-Host "`n[3/3] API endpoints..." -ForegroundColor Yellow
$apis = @(
    @{ name="Dashboard API";     url="/api/dashboard?userId=1" }
    @{ name="Transactions API";  url="/api/transactions?page=1&perPage=5" }
    @{ name="Categories API";    url="/api/categories" }
    @{ name="Health API";        url="/health" }
)

foreach ($api in $apis) {
    $r = Test-Url "http://localhost:3001$($api.url)"
    if ($r.ok) {
        Write-Host "  [+] $($api.name): $($r.body.Length)B" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "  [-] $($api.name): HTTP $($r.status)" -ForegroundColor Red
        $failed++
    }
}

# Summary
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " RESULTS: $passed passed, $failed failed" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host " ✅ ALL SMOKE TESTS PASSED" -ForegroundColor Green
    exit 0
} else {
    Write-Host " ❌ SMOKE TESTS FAILED — DO NOT DEPLOY" -ForegroundColor Red
    exit 1
}
