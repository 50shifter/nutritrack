# GIF Compressor

Сжатие GIF-файлов до заданного размера через ffmpeg (PyQt5 GUI).

## Установка

### 1. Скачайте ffmpeg

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File install_ffmpeg.ps1
```

Или вручную: https://www.gyan.dev/ffmpeg/builds/ → `ffmpeg-release-essentials.zip`

**Linux:**
```bash
sudo apt install ffmpeg   # Debian/Ubuntu
sudo dnf install ffmpeg   # Fedora
```

### 2. Запуск

```bash
python app.py
```

## Возможности

- Выбор целевого размера (256 / 512 КБ)
- Ограничение максимальной ширины
- Пропуск кадров для уменьшения размера
- Автоматический подбор параметров сжатия
- Тёмная тема интерфейса
- Логирование процесса сжатия
