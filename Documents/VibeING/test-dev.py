import subprocess, os, time

base = r'C:\Users\User\Documents\VibeING\web-dev-landing'
projects = [
    ('artisan', 3000),
    ('finflow', 3001),
]

for name, port in projects:
    os.chdir(os.path.join(base, name))
    env = os.environ.copy()
    env['PORT'] = str(port)
    env['NEXT_TELEMETRY_DISABLED'] = '1'
    log_file = os.path.join(base, name, f'{name}_run.log')
    
    print(f'Starting {name}:{port}...')
    proc = subprocess.Popen(
        ['npm', 'run', 'dev'],
        shell=True,
        env=env,
        stdout=open(log_file, 'w', encoding='utf-8'),
        stderr=subprocess.STDOUT
    )
    
    time.sleep(8)
    
    if proc.poll() is not None:
        print(f'  {name}: CRASHED exit={proc.returncode}')
    else:
        print(f'  {name}: RUNNING pid={proc.pid}')

time.sleep(3)

# Test the /health endpoint
print('\n=== Health ===')
import urllib.request
for name, port in projects:
    try:
        r = urllib.request.urlopen(f'http://localhost:{port}/health', timeout=3)
        print(f'  {name}: OK')
    except Exception as e:
        print(f'  {name}: FAIL - {e}')

# Test the / endpoint  
print('\n=== HTML ===')
for name, port in projects:
    try:
        r = urllib.request.urlopen(f'http://localhost:{port}/', timeout=5)
        html = r.read().decode('utf-8', errors='replace')
        print(f'  {name}: status={r.status} size={len(html)}')
        if len(html) > 100:
            print(f'  First 500: {html[:500]}...')
    except Exception as e:
        print(f'  {name}: FAIL - {type(e).__name__}: {e}')

# Read logs
print('\n=== Logs ===')
for name, port in projects:
    log_file = os.path.join(base, name, f'{name}_run.log')
    if os.path.exists(log_file):
        with open(log_file, 'r', encoding='utf-8') as f:
            content = f.read()
            print(f'{name}_run.log: {len(content)} bytes')
            if content:
                print('  Last 30 lines:')
                for line in content.strip().split('\n')[-30:]:
                    print(f'    {line}')
    else:
        print(f'{name}_run.log: NOT FOUND')
