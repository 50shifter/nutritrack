import subprocess, os, time, urllib.request

base = r'C:\Users\User\Documents\VibeING\web-dev-landing'
projects = [
    ('artisan', 3000),
    ('finflow', 3001),
    ('foodhub', 3002),
    ('greenmarket', 3003),
    ('luxstay', 3004),
    ('medicare', 3005),
]

for name, port in projects:
    os.chdir(os.path.join(base, name))
    env = os.environ.copy()
    env['PORT'] = str(port)
    env['NEXT_TELEMETRY_DISABLED'] = '1'
    
    proc = subprocess.Popen(
        ['npm', 'run', 'dev'],
        shell=True,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        bufsize=1
    )
    print(f'{name}:{port} started (PID {proc.pid})')

print('Waiting 10 seconds...')
time.sleep(10)

print('\n=== Health ===')
for name, port in projects:
    try:
        r = urllib.request.urlopen(f'http://localhost:{port}/health', timeout=5)
        print(f'  {name}:{port} OK')
    except Exception as e:
        print(f'  {name}:{port} FAIL - {e}')

print('\n=== HTML ===')
for name, port in projects:
    try:
        r = urllib.request.urlopen(f'http://localhost:{port}/', timeout=10)
        html = r.read().decode('utf-8', errors='replace')
        print(f'  {name}:{port} status={r.status} size={len(html)}')
        print(f'  First 600 chars: {html[:600]}')
    except Exception as e:
        print(f'  {name}:{port} FAIL - {type(e).__name__}: {e}')
