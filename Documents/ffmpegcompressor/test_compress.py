import sys, os, tempfile, subprocess, shutil
sys.path.insert(0, '.')
from pathlib import Path
from app import _find_ffmpeg_bin

ffmpeg_path, probe_path = _find_ffmpeg_bin()
test_file = Path('testing.gif')
target_bytes = 256 * 1024 - 256

info_out = subprocess.check_output([
    probe_path, '-v', 'error',
    '-select_streams', 'v:0', '-count_frames',
    '-show_entries', 'stream=width,height,nb_read_frames',
    '-of', 'csv=p=0:s=x', str(test_file)
], stderr=subprocess.DEVNULL).decode().strip()

parts = info_out.split('x')
orig_w, orig_h, orig_frames = int(parts[0]), int(parts[1]), int(parts[2])

if orig_w > 500:
    new_w = int(round(500 / 2) * 2)
    new_h = max(2, int(round(orig_h * (new_w / orig_w) / 2) * 2))
else:
    new_w, new_h = orig_w, orig_h

if orig_frames > 120: fps = 8
elif orig_frames > 60: fps = 10
elif orig_frames > 30: fps = 15
else: fps = min(24, max(8, orig_frames))

skip_every = None
max_colors = 256
current_fps = fps
best_size = float('inf')
best_fd, best_path = tempfile.mkstemp(suffix='.gif')
os.close(best_fd)

print('Target: {}x{} frames:{} target={}B ({:.0f}KB)\n'.format(
    orig_w, orig_h, orig_frames, target_bytes, target_bytes/1024))

for iteration in range(20):
    vf_parts = []
    if skip_every:
        vf_parts.append(rf"select=not(mod(n\\,{skip_every}))")

    iter_fd, iter_out = tempfile.mkstemp(suffix='.gif')
    os.close(iter_fd)

    remaining_frames = orig_frames
    if skip_every:
        remaining_frames = max(2, orig_frames // skip_every)
    effective_fps = min(current_fps, max(1, (remaining_frames - 1) * 3))

    vf_filter = ','.join(vf_parts) + (
        f'fps={effective_fps},scale={new_w}:{new_h}:flags=lanczos,'
        f'split[s0][s1];[s0]palettegen=max_colors={max_colors}:stats_mode=diff[p];'
        f'[s1][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle'
    )

    result = subprocess.run([
        ffmpeg_path, '-y', '-v', 'error',
        '-i', str(test_file),
        '-vf', vf_filter,
        '-loop', '0', iter_out
    ], capture_output=True)

    actual_size = os.path.getsize(iter_out) if os.path.exists(iter_out) else 999999

    diff = abs(actual_size - target_bytes)
    if diff < best_size:
        best_size = diff
        try:
            os.remove(best_path)
        except OSError:
            pass
        shutil.copy2(iter_out, best_path)

    ratio = abs(actual_size - target_bytes) / max(target_bytes, 1)
    print('Round {}: {} B ({} KB) | fps={} eff_fps={} skip={} colors={} scale={}:{}'.format(
        iteration+1, actual_size, actual_size//1024 if actual_size > 0 else 0,
        current_fps, effective_fps, skip_every, max_colors, new_w, new_h))

    if ratio < 0.05:
        print('DONE! Within 5% of target')
        break

    if iteration > 5 and abs(actual_size - target_bytes) >= best_size * 0.98:
        print('Converged at round {}'.format(iteration+1))
        break

    if actual_size > target_bytes + 256 and actual_size > 100:
        current_fps = max(3, int(current_fps * 0.7))

        if orig_frames < 8 and max_colors > 16:
            if max_colors == 256:
                max_colors = 100
            elif max_colors == 100:
                max_colors = 64
            elif max_colors > 32:
                max_colors -= 16
            else:
                max_colors = 16
        elif new_w > orig_w or (new_w == orig_w and iteration < 4):
            if new_w > 128:
                new_w = max(64, int(new_w * 0.85) // 2 * 2)
                new_h = max(2, int(round(orig_h * (new_w / orig_w) / 2) * 2))
        elif skip_every is None and orig_frames >= 5:
            if orig_frames >= 10:
                skip_every = 2
            elif orig_frames >= 6:
                skip_every = 3

    elif actual_size < target_bytes - 512 and actual_size > 0:
        current_fps = min(30, int(current_fps * 1.4))
        if skip_every and skip_every > 1:
            skip_every -= 1
        elif max_colors < 256:
            if max_colors == 16:
                max_colors = 32
            elif max_colors == 32:
                max_colors = 64
            else:
                max_colors = min(256, max_colors * 2)

    try:
        os.remove(iter_out)
    except OSError:
        pass

print()
final_sz = os.path.getsize(best_path)
ratio_final = abs(final_sz - target_bytes) / max(target_bytes, 1)
print('BEST: {} B ({} KB) | target was {:.0f} KB | diff={:.1f}%'.format(
    final_sz, final_sz/1024, target_bytes/1024, ratio_final*100))

result = subprocess.run([probe_path, '-v', 'error', '-select_streams', 'v:0',
    '-count_frames', '-show_entries', 'stream=width,height,nb_read_frames',
    '-of', 'csv=p=0:s=x', str(best_path)], capture_output=True)
if result.returncode == 0:
    info = result.stdout.decode().strip()
    print('Output valid:', info)

os.remove(best_path)
