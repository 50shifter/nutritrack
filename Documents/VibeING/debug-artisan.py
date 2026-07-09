import subprocess, os, time, sys

base = r'C:\Users\User\Documents\VibeING\web-dev-landing'

os.chdir(os.path.join(base, 'artisan'))
env = os.environ.copy()
env['PORT'] = '3000'
env['NEXT_TELEMETRY_DISABLED'] = '1'

log = 'artisan_dev.txt'
log_fh = open(log, 'w', encoding='utf-8')

proc = subprocess.Popen(
    ['npm', 'run', 'dev'],
    shell=True,
    env=env,
    stdout=log_fh,
    stderr=subprocess.STDOUT,
    creationflags=subprocess.CREATE_NO_WINDOW
)

print('Waiting 10s...')
time.sleep(10)

log_fh.close()

if proc.poll() is not None:
    with open(log, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    print(f'CRASHED exit={proc.returncode}')
    print(f'Log ({len(content)} bytes):')
    print(content)
else:
    print(f'RUNNING pid={proc.pid}')
