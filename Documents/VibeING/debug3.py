import subprocess, os, time, json, signal

# Kill any node on port 3000
import urllib.request
for port in [3000]:
    try:
        urllib.request.urlopen(f'http://localhost:{port}/health', timeout=1)
    except:
        pass

os.chdir(r'C:\Users\User\Documents\VibeING\web-dev-landing\artisan')
env = os.environ.copy()
env['PORT'] = '3000'
env['NEXT_TELEMETRY_DISABLED'] = '1'

print('Starting artisan...')

proc = subprocess.Popen(
    ['npm.cmd', 'run', 'dev'],
    shell=False,
    env=env,
    creationflags=0x08000000,  # CREATE_NO_WINDOW
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=0
)

# Wait 12 seconds for startup
time.sleep(12)

# Check status
if proc.poll() is not None:
    # Kill it
    proc.kill()
    stdout, _ = proc.communicate(timeout=3)
    print(f'CRASHED (exit {proc.returncode})')
    print(f'Output ({len(stdout)} bytes):')
    print(stdout[-2000:])
else:
    proc.kill()
    stdout, _ = proc.communicate(timeout=3)
    print(f'RUNNING before kill')
    print(f'Output ({len(stdout)} bytes):')
    print(stdout[-2000:])
