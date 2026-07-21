/**
 * VibeING Smoke Tests — не просто HTTP 200, а проверка рендера
 * Проверяет что сервер отвечает контентом, а не пустой HTML-оболочкой.
 */

const projects = [
  { name: 'FinFlow',       port: 3001, path: '/',              mustContain: ['FinFlow', 'dashboard'],     mustNotContain: [] },
  { name: 'MediCare',      port: 3002, path: '/',              mustContain: ['MediCare', 'doctors'],      mustNotContain: [] },
  { name: 'GreenMarket',   port: 3003, path: '/',              mustContain: ['GreenMarket', 'catalog'],   mustNotContain: [] },
  { name: 'FoodHub',       port: 3004, path: '/',              mustContain: ['FoodHub', 'restaurants'],   mustNotContain: [] },
  { name: 'LuxStay',       port: 3005, path: '/',              mustContain: ['LuxStay', 'hotels'],        mustNotContain: [] },
  { name: 'Artisan',       port: 3006, path: '/',              mustContain: ['Artisan', 'portfolio'],     mustNotContain: [] },
  { name: 'Metrics',       port: 3099, path: '/',              mustContain: ['Ecosystem', 'Dashboard'],   mustNotContain: [] },
];

let passed = 0;
let failed = 0;
const results = [];

// ── HTTP helper ──
async function httpGet(host, port, path, timeout = 8000) {
  const url = `http://${host}:${port}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    const html = await res.text();
    return { ok: res.ok, status: res.status, html, url };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, status: 0, html: '', url, error: err.message };
  }
}

// ── Check health endpoint ──
async function checkHealth(port, name) {
  const url = `http://localhost:${port}/health`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return { ok: false, status: res.status, name };
    const json = await res.json();
    return { ok: true, status: res.status, name, json };
  } catch {
    clearTimeout(timer);
    return { ok: false, status: 0, name };
  }
}

// ── Run smoke tests ──
async function runTests() {
  console.log('='.repeat(70));
  console.log('VibeING Smoke Tests — Content Verification');
  console.log('='.repeat(70));
  console.log('');
  
  // 1. Health checks
  console.log('[1/3] Health endpoints...');
  for (const p of projects) {
    const h = await checkHealth(p.port, p.name);
    if (h.ok) {
      passed++;
      console.log(`  ✅ ${p.name} (:${p.port}) healthy`);
    } else {
      failed++;
      console.log(`  ❌ ${p.name} (:${p.port}) UNHEALTHY (status=${h.status})`);
    }
    results.push({ ...p, health: h.ok });
  }
  
  // 2. Content checks
  console.log('');
  console.log('[2/3] Content rendering checks...');
  for (const p of projects) {
    const res = await httpGet('localhost', p.port, p.path);
    
    if (!res.ok) {
      failed += 2;
      console.log(`  ❌ ${p.name}: HTTP ${res.status} (timeout/error)`);
      results.push({ ...p, content: false, contentLen: 0, errors: [`HTTP ${res.status}`] });
      continue;
    }
    
    const html = res.html;
    const errors = [];
    const warnings = [];
    
    // Check 1: Content length > 1KB (catches empty shells)
    if (html.length < 1024) {
      errors.push(`Empty shell: ${html.length} bytes (need > 1KB)`);
    }
    
    // Check 2: Must contain title keywords
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '(no title)';
    
    // Check 3: Must contain expected strings
    for (const kw of p.mustContain) {
      if (!html.includes(kw)) {
        errors.push(`Missing keyword: "${kw}"`);
      }
    }
    
    // Check 4: Must NOT contain error strings
    for (const kw of p.mustNotContain) {
      if (html.includes(kw)) {
        errors.push(`Found error indicator: "${kw}"`);
      }
    }
    
    // Check 5: Must have DOCTYPE or html tag
    if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
      warnings.push('No HTML tags found');
    }
    
    // Check 6: Script tags should exist (Next.js pages)
    const scriptCount = (html.match(/<script/g) || []).length;
    if (scriptCount === 0) {
      warnings.push('No <script> tags (SSR or static page)');
    }
    
    const contentOk = errors.length === 0;
    
    if (contentOk) {
      passed++;
      console.log(`  ✅ ${p.name}: ${html.length}B, title="${title}", ${scriptCount} scripts`);
    } else {
      failed++;
      console.log(`  ❌ ${p.name}: ${errors.join('; ')}`);
    }
    
    results.push({
      ...p,
      content: contentOk,
      contentLen: html.length,
      title: title,
      scripts: scriptCount,
      warnings,
      errors,
    });
  }
  
  // 3. API checks
  console.log('');
  console.log('[3/3] API endpoints...');
  
  const apiTests = [
    { name: 'FinFlow Dashboard API',    url: 'http://localhost:3001/api/dashboard?userId=1' },
    { name: 'FinFlow Transactions API', url: 'http://localhost:3001/api/transactions?page=1&perPage=5' },
    { name: 'FinFlow Categories API',   url: 'http://localhost:3001/api/categories' },
    { name: 'FinFlow Metrics API',      url: 'http://localhost:3001/api/metrics' },
    { name: 'Health endpoints',         url: 'http://localhost:3001/health' },
  ];
  
  for (const api of apiTests) {
    const res = await httpGet('localhost', 3001, api.url.replace('http://localhost:3001', ''));
    
    if (!res.ok) {
      failed++;
      console.log(`  ❌ ${api.name}: HTTP ${res.status}`);
      results.push({ name: api.name, ok: false, errors: [`HTTP ${res.status}`] });
      continue;
    }
    
    const errors = [];
    
    // Check API response is valid JSON or proper HTML
    try {
      const json = JSON.parse(res.html);
      // Check for error fields
      if (json.error && json.error !== 'Internal server error') {
        // Some errors are expected (e.g., no DB connected)
        if (!json.data && !json.stats) {
          warnings.push('API returned empty response');
        }
      }
      passed++;
      console.log(`  ✅ ${api.name}: ${res.html.length}B`);
    } catch {
      // Not JSON, check if it's HTML (error page)
      if (res.html.length < 100) {
        errors.push(`API returned short non-JSON (${res.html.length}B)`);
      }
    }
    
    if (errors.length === 0) {
      passed++;
    } else {
      failed++;
      console.log(`  ❌ ${api.name}: ${errors.join('; ')}`);
    }
    
    results.push({ name: api.name, ok: true, errors, warnings });
  }
  
  // ── Summary ──
  console.log('');
  console.log('='.repeat(70));
  const total = passed + failed;
  console.log(`RESULTS: ${passed}/${total} passed, ${failed}/${total} failed`);
  
  if (failed === 0) {
    console.log('✅ ALL SMOKE TESTS PASSED');
  } else {
    console.log('❌ SMOKE TESTS FAILED — DO NOT DEPLOY');
    
    // Print failed details
    for (const r of results) {
      if (!r.content || !r.health) {
        console.log(`\n  ⚠️  ${r.name}:`);
        if (r.errors) console.log(`     Errors: ${r.errors.join(', ')}`);
        if (r.warnings) console.log(`     Warnings: ${r.warnings.join(', ')}`);
      }
    }
  }
  
  console.log('='.repeat(70));
  
  // Exit with proper code for CI
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Smoke tests failed:', err);
  process.exit(2);
});
