import subprocess, os, time, urllib.request, signal

base = r'C:\Users\User\Documents\VibeING\web-dev-landing'
projects = [
    ('artisan', 3000),
    ('finflow', 3001),
    ('foodhub', 3002),
    ('greenmarket', 3003),
    ('luxstay', 3004),
    ('medicare', 3005),
]

print('Killing old dev servers...')
for p, port in projects:
    os.chdir(os.path.join(base, p))
    env = os.environ.copy()
    env['PORT'] = str(port)
    
    proc = subprocess.Popen(
        ['npm', 'run', 'dev'],
        shell=True,
        env=env,
        creationflags=0x08000000,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    
    time.sleep(5)
    print(f'  {p}:{port} started PID={proc.pid}')

print('\nWaiting 10s for all to compile...')
time.sleep(10)

print('\n=== Checking all ===')
for p, port in projects:
    try:
        r = urllib.request.urlopen(f'http://localhost:{port}/health', timeout=3)
        health = r.read().decode()[:50]
        print(f'  {p}:{port} health OK')
    except Exception as e:
        print(f'  {p}:{port} health FAIL: {type(e).__name__}')
        continue
    
    try:
        r = urllib.request.urlopen(f'http://localhost:{port}/', timeout=8)
        html = r.read().decode('utf-8', errors='replace')
        has_h1 = '<h1' in html[3000:] if len(html) > 3000 else '<h1' in html[:2000]
        has_error = 'Invalid src prop' in html or 'Error:' in html[:2000]
        status = 'OK' if not has_error else 'ERROR'
        print(f'  {p}:{port} PAGE {r.status} {len(html)}b {status} h1={has_h1} error={has_error}')
    except Exception as e:
        print(f'  {p}:{port} PAGE FAIL: {type(e).__name__}: {e}')
