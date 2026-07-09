import subprocess, os, time

os.chdir(r'C:\Users\User\Documents\VibeING\web-dev-landing\artisan')
env = os.environ.copy()
env['PORT'] = '3000'
env['NEXT_TELEMETRY_DISABLED'] = '1'

print('Starting artisan...')

proc = subprocess.Popen(
    ['npm', 'run', 'dev'],
    shell=True,
    env=env,
    creationflags=0x08000000,  # CREATE_NO_WINDOW
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=False  # binary mode
)

time.sleep(12)

if proc.poll() is not None:
    stdout, _ = proc.communicate(timeout=3)
    print(f'CRASHED (exit {proc.returncode})')
    try:
        output = stdout.decode('utf-8', errors='replace')
    except:
        output = str(stdout)
    print(f'Output ({len(output)} bytes):')
    print(output[-2000:])
else:
    stdout, _ = proc.communicate(timeout=3)
    print(f'RUNNING before kill')
    try:
        output = stdout.decode('utf-8', errors='replace')
    except:
        output = str(stdout)
    print(f'Output ({len(output)} bytes):')
    print(output[-2000:])
