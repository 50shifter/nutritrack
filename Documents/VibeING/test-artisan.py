import subprocess, os, time

base = r'C:\Users\User\Documents\VibeING\web-dev-landing\artisan'
os.chdir(base)

env = os.environ.copy()
env['PORT'] = '3000'
env['NEXT_TELEMETRY_DISABLED'] = '1'

startup = subprocess.STARTUPINFO()
startup.dwFlags |= subprocess.STARTF_USESHOWWINDOW

proc = subprocess.Popen(
    ['npm', 'run', 'dev'],
    shell=True,
    env=env,
    startupinfo=startup,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT
)

print(f'Started PID {proc.pid}')
time.sleep(10)

# Check if running
if proc.poll() is None:
    print('Still running')
else:
    print(f'Crashed: exit {proc.returncode}')

proc.wait()
output = proc.stdout.read().decode('utf-8', errors='replace')
print(f'Output ({len(output)} bytes):')
print(output[-1000:])
