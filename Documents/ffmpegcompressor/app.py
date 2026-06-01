#!/usr/bin/env python3

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QLineEdit, QFileDialog, QGroupBox,
    QProgressBar, QMessageBox, QTextEdit, QComboBox, QCheckBox,
)
from PyQt5.QtCore import Qt, QThread, pyqtSignal, QSize, QTimer
from PyQt5.QtGui import QPixmap, QFont, QPalette, QColor


_SCRIPT_DIR = Path(__file__).resolve().parent


def _find_ffmpeg_bin() -> tuple[str, str] | None:
    for d in _SCRIPT_DIR.iterdir():
        if d.is_dir() and "ffmpeg" in d.name.lower():
            bin_dir = d / "bin"
            if (bin_dir / "ffmpeg.exe").exists() and (bin_dir / "ffprobe.exe").exists():
                return str(bin_dir / "ffmpeg.exe"), str(bin_dir / "ffprobe.exe")
    for name in ["ffmpeg", "ffprobe"]:
        p = _SCRIPT_DIR / f"{name}.exe"
        if not p.exists():
            return None
    return str(_SCRIPT_DIR / "ffmpeg.exe"), str(_SCRIPT_DIR / "ffprobe.exe")


def _get_ffmpeg_path() -> str | None:
    r = _find_ffmpeg_bin()
    return r[0] if r else None

class CompressWorker(QThread):

    finished = pyqtSignal(str)
    error = pyqtSignal(str)
    progress = pyqtSignal(int, str)

    def __init__(
        self,
        input_path: Path,
        output_dir: Path,
        target_kb: int,
        max_width: int,
        skip_mode: str,  # "none", "every2", "every3"
    ):
        super().__init__()
        self.input_path = input_path
        self.output_dir = output_dir
        self.target_kb = target_kb
        self.max_width = max_width
        self.skip_mode = skip_mode
        import time
        self._last_emit_time = 0.0
        self._pending_progress: tuple[int, str] | None = None
        self._time = time

    def _emit_pending(self):
        if not self._pending_progress:
            return
        now = self._time.time()
        if now - self._last_emit_time < 0.3:
            return
        self._last_emit_time = now
        pct, msg = self._pending_progress
        self.progress.emit(pct, msg)
        self._pending_progress = None

    def _ffprobe(self, path: Path) -> dict | None:
        probe_bin = self._get_ffprobe()
        if not probe_bin:
            return None
        try:
            out = subprocess.check_output(
                [
                    probe_bin, "-v", "error",
                    "-select_streams", "v:0",
                    "-count_frames",
                    "-show_entries",
                    "stream=width,height,nb_read_frames",
                    "-of", "csv=p=0:s=x",
                    str(path),
                ],
                stderr=subprocess.DEVNULL,
            ).decode().strip()
            parts = out.split("x")
            if len(parts) == 3:
                return {
                    "width": int(parts[0]),
                    "height": int(parts[1]),
                    "frames": int(parts[2]),
                }
        except Exception:
            pass
        return None

    def _get_ffmpeg(self) -> str | None:
        r = _find_ffmpeg_bin()
        if r:
            return r[0]
        try:
            subprocess.check_output(["ffmpeg", "-version"], stderr=subprocess.DEVNULL)
            return "ffmpeg"
        except FileNotFoundError:
            return None

    def _get_ffprobe(self) -> str | None:
        r = _find_ffmpeg_bin()
        if r:
            return r[1]
        try:
            subprocess.check_output(["ffprobe", "-version"], stderr=subprocess.DEVNULL)
            return "ffprobe"
        except FileNotFoundError:
            return None

    def _compress(self, in_path: Path, out_path: Path) -> bool:
        """Итеративное сжатие GIF до целевого размера файла."""
        ffmpeg_bin = self._get_ffmpeg()
        if not ffmpeg_bin:
            raise RuntimeError("ffmpeg не найден!")

        info = self._ffprobe(in_path)
        if not info:
            raise RuntimeError("Не удалось получить информацию о файле.")

        orig_w, orig_h, orig_frames = info["width"], info["height"], info["frames"]
        target_bytes = self.target_kb * 1024 - 256

        if orig_w > self.max_width:
            new_w = int(round(self.max_width / 2) * 2)
            new_h = max(2, int(round(orig_h * (new_w / orig_w) / 2) * 2))
        else:
            new_w, new_h = orig_w, orig_h


        if orig_frames > 120:
            fps = 8
        elif orig_frames > 60:
            fps = 10
        elif orig_frames > 30:
            fps = 15
        else:
            fps = min(24, max(8, orig_frames))

        skip_every = None
        if self.skip_mode == "every2":
            skip_every = 2
        elif self.skip_mode == "every3":
            skip_every = 3

        current_fps = fps
        max_colors = 256
        best_size = float("inf")
        best_fd, best_path = tempfile.mkstemp(suffix=".gif")
        os.close(best_fd)
        max_iter = 15

        for iteration in range(max_iter):
            pct = 5 + iteration * 6
            msg = f"Раунд {iteration+1}/{max_iter}..."
            self._pending_progress = (pct, msg)


            vf_parts = []
            if skip_every:
                vf_parts.append(rf"select=not(mod(n\\,{skip_every}))")

            iter_fd, iter_out = tempfile.mkstemp(suffix=".gif")
            os.close(iter_fd)

            remaining_frames = orig_frames
            if skip_every:
                remaining_frames = max(2, orig_frames // skip_every)
            effective_fps = min(current_fps, max(1, (remaining_frames - 1) * 3))

            # palettegen с ограничением цветов + paletteuse
            vf_filter = ",".join(vf_parts) + (
                f"fps={effective_fps},scale={new_w}:{new_h}:flags=lanczos,"
                f"split[s0][s1];[s0]palettegen=max_colors={max_colors}:stats_mode=diff[p];"
                f"[s1][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle"
            )

            result = subprocess.run(
                [
                    ffmpeg_bin, "-y", "-v", "error",
                    "-i", str(in_path),
                    "-vf", vf_filter,
                    "-loop", "0",
                    iter_out,
                ],
                capture_output=True,
            )

            actual_size = os.path.getsize(iter_out) if os.path.exists(iter_out) else 999_999


            diff = abs(actual_size - target_bytes)
            if diff < best_size:
                best_size = diff
                try:
                    os.remove(best_path)
                except OSError:
                    pass
                shutil.copy2(iter_out, best_path)


            ratio = abs(actual_size - target_bytes) / max(target_bytes, 1)
            if ratio < 0.05:
                self._pending_progress = (95, f"Размер достигнут: {actual_size // 1024} КБ")
                break

            if iteration > 5 and abs(actual_size - target_bytes) >= best_size * 0.98:
                self._pending_progress = (90, "Размер стабилизировался")
                break
            if actual_size > target_bytes + 256:
                current_fps = max(3, int(current_fps * 0.7))
                effective_fps = min(current_fps, max(1, (remaining_frames - 1) * 3))


                if orig_frames < 8 and max_colors > 16:
                    # Short animations - aggressively reduce colors
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
                    scale_factor = 0.75
                    new_w = max(32, int(orig_w * scale_factor) // 2 * 2)
                    new_h = max(2, int(round(orig_h * (new_w / orig_w) / 2) * 2))
                elif new_w > 128:
                    new_w -= 32
                    new_h = max(2, int(round(orig_h * (new_w / orig_w) / 2) * 2))

            elif actual_size < target_bytes - 512:
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

                if new_w < orig_w and orig_w <= self.max_width:
                    new_w = orig_w
                    new_h = orig_h

            try:
                os.remove(iter_out)
            except OSError:
                pass

        shutil.copy2(best_path, str(out_path))
        try:
            os.remove(best_path)
        except OSError:
            pass

        self._emit_pending()
        return True
    def run(self):
        import traceback
        try:
            self.output_dir.mkdir(parents=True, exist_ok=True)
            name = self.input_path.stem
            out_name = f"{name}_compressed_{self.target_kb}kb.gif"
            out_path = self.output_dir / out_name

            if not self._compress(self.input_path, out_path):
                raise RuntimeError("Сжатие не удалось.")

            self.progress.emit(100, "Готово!")
            self.finished.emit(str(out_path))
        except subprocess.CalledProcessError as e:
            stderr = e.stderr.decode(errors='replace').strip() if e.stderr else '(нет вывода)'
            self.error.emit(f"Ошибка ffmpeg (код {e.returncode}):\n{stderr}")
        except Exception as e:
            traceback_str = traceback.format_exc()
            error_lines = traceback_str.splitlines()
            brief = "\n".join(error_lines[-5:]) if len(error_lines) > 5 else traceback_str
            self.error.emit(brief)
            print(traceback_str)




DARK_STYLESHEET = """
QMainWindow {
    background-color: #1e1e1e;
}

QWidget {
    background-color: #2d2d30;
    color: #cccccc;
    font-family: "Segoe UI", Arial, sans-serif;
}

QGroupBox {
    background-color: #252526;
    border: 1px solid #3e3e42;
    border-radius: 6px;
    margin-top: 8px;
    padding-top: 12px;
    font-weight: bold;
}

QGroupBox::title {
    subcontrol-origin: margin;
    left: 10px;
    padding: 0 5px;
    color: #9cdcfe;
}

QPushButton {
    background-color: #3e3e42;
    border: 1px solid #555555;
    border-radius: 4px;
    padding: 6px 16px;
    color: #cccccc;
}

QPushButton:hover {
    background-color: #0e639c;
    border-color: #0e639c;
    color: white;
}

QPushButton:pressed {
    background-color: #1177bb;
}

QPushButton:disabled {
    background-color: #2d2d30;
    color: #666666;
    border-color: #3e3e42;
}

QComboBox {
    background-color: #3c3c3c;
    border: 1px solid #555555;
    border-radius: 3px;
    padding: 4px 8px;
    color: #cccccc;
    min-width: 60px;
}

QComboBox::drop-down {
    border: none;
}

QComboBox QAbstractItemView {
    background-color: #252526;
    selection-background-color: #0e639c;
    color: #cccccc;
    border: 1px solid #3e3e42;
}

QLineEdit {
    background-color: #3c3c3c;
    border: 1px solid #555555;
    border-radius: 3px;
    padding: 4px 8px;
    color: #cccccc;
}

QProgressBar {
    background-color: #3e3e42;
    border: 1px solid #555555;
    border-radius: 3px;
    text-align: center;
    height: 20px;
}

QProgressBar::chunk {
    background-color: #0e639c;
    border-radius: 2px;
}

QCheckBox {
    color: #cccccc;
    spacing: 6px;
}

QCheckBox::indicator {
    width: 16px;
    height: 16px;
    border: 1px solid #555555;
    border-radius: 3px;
    background-color: #3c3c3c;
}

QCheckBox::indicator:checked {
    background-color: #0e639c;
    border-color: #0e639c;
}

QTextEdit {
    background-color: #1e1e1e;
    border: 1px solid #3e3e42;
    color: #cccccc;
    selection-background-color: #264f78;
}

QLabel {
    color: #cccccc;
}

QScrollBar:vertical {
    background-color: #2d2d30;
    width: 12px;
    border-radius: 6px;
}

QScrollBar::handle:vertical {
    background-color: #555555;
    min-height: 24px;
    border-radius: 5px;
}

QScrollBar::handle:vertical:hover {
    background-color: #0e639c;
}

QScrollBar::add-line, QScrollBar::sub-line {
    height: 0px;
}

QScrollBar::add-page, QScrollBar::sub-page {
    background: none;
}
"""


# ============================================================
# Главное окно приложения
# ============================================================

class MainWindow(QMainWindow):

    WIDTH_LIMIT = 500

    def __init__(self):
        super().__init__()
        self.worker: CompressWorker | None = None
        self.input_path: Path | None = None
        self.output_dir: Path = Path.home() / "Documents" / "GIF_Compressed"

        # Буфер логов — все сообщения накапливаются в worker-е, применяются разом при завершении
        self._log_buffer: list[str] = []

        # Индикатор активности во время сжатия (без мерцания)
        self._compressing = False

        self._build_ui()
        self._load_settings()

    def _apply_dark_theme(self):
        QApplication.setStyle("Fusion")
        dark_palette = QPalette()
        base_color = "#1e1e1e"
        light_color = "#2d2d30"
        accent_color = "#0e639c"

        for role in [QPalette.Window, QPalette.Base]:
            dark_palette.setColor(role, QColor(base_color))
        for role in [QPalette.WindowText, QPalette.Text]:
            dark_palette.setColor(role, QColor("#cccccc"))
        for role in [QPalette.Button, QPalette.AlternateBase]:
            dark_palette.setColor(role, QColor(light_color))
        for role in [QPalette.Highlight, QPalette.Link]:
            dark_palette.setColor(role, QColor(accent_color))
        dark_palette.setColor(QPalette.HighlightedText, Qt.white)

        QApplication.setPalette(dark_palette)
        self.setStyleSheet(DARK_STYLESHEET)

    def _build_ui(self):
        self.setWindowTitle("GIF Compressor — сжатие через ffmpeg")
        self.setMinimumSize(720, 640)


        self._apply_dark_theme()

        central = QWidget()
        self.setCentralWidget(central)
        root = QVBoxLayout(central)
        root.setSpacing(12)

        grp_in = QGroupBox("Исходный GIF")
        lay_in = QHBoxLayout(grp_in)

        self.lbl_input = QLabel("Файл не выбран  ")
        self.lbl_input.setStyleSheet("color:#888; font-size:12px;")
        self.lbl_input.setWordWrap(True)
        lay_in.addWidget(self.lbl_input, stretch=1)

        btn_choose = QPushButton("Выбрать GIF")
        btn_choose.clicked.connect(self._choose_file)
        lay_in.addWidget(btn_choose)
        root.addWidget(grp_in)

        mid_hbox = QHBoxLayout()

        # Превью
        self.preview_label = QLabel("Превью")
        self.preview_label.setAlignment(Qt.AlignCenter)
        self.preview_label.setMinimumSize(200, 180)
        self.preview_label.setStyleSheet(
            "border: 2px dashed #555; border-radius: 8px;"
            "background: #1e1e1e; color: #666; font-size: 13px;"
        )
        mid_hbox.addWidget(self.preview_label, stretch=2)

        # Настройки
        grp_set = QGroupBox("Настройки сжатия")
        lay_set = QVBoxLayout(grp_set)
        lay_set.setSpacing(8)

        row1 = QHBoxLayout()
        row1.addWidget(QLabel("Целевой размер:"))
        self.cmb_target = QComboBox()
        for v in [256, 512]:
            self.cmb_target.addItem(f"{v} КБ")
        self.cmb_target.setCurrentText("256 КБ")
        row1.addWidget(self.cmb_target)
        lay_set.addLayout(row1)

        row2 = QHBoxLayout()
        row2.addWidget(QLabel("Макс. ширина (px):"))
        self.spn_width = QLineEdit(str(self.WIDTH_LIMIT))
        self.spn_width.setFixedWidth(80)
        row2.addWidget(self.spn_width)
        lay_set.addLayout(row2)

        # Комбо: режим пропуска кадров
        row3 = QHBoxLayout()
        row3.addWidget(QLabel("Пропуск кадров:"))
        self.cmb_skip = QComboBox()
        self.cmb_skip.addItem("Без пропуска", "none")
        self.cmb_skip.addItem("Каждый 2-й кадр (×0.5)", "every2")
        self.cmb_skip.addItem("Каждый 3-й кадр (×0.33)", "every3")
        row3.addWidget(self.cmb_skip, stretch=1)
        lay_set.addLayout(row3)

        mid_hbox.addWidget(grp_set, stretch=1)
        root.addLayout(mid_hbox)

        grp_out = QGroupBox("Папка сохранения")
        lay_out = QHBoxLayout(grp_out)
        self.le_output = QLineEdit(str(self.output_dir))
        self.le_output.setReadOnly(True)
        lay_out.addWidget(self.le_output, stretch=1)

        btn_outdir = QPushButton("Изменить папку")
        btn_outdir.clicked.connect(self._choose_output_dir)
        lay_out.addWidget(btn_outdir)
        root.addWidget(grp_out)

        self.btn_compress = QPushButton("Сжать GIF")
        self.btn_compress.setFixedHeight(50)
        self.btn_compress.setFont(QFont("Segoe UI", 12, QFont.Bold))
        self.btn_compress.setStyleSheet(
            "QPushButton { background: #0e639c; color: white;"
            "border-radius: 6px; }"
            "QPushButton:hover { background: #1177bb; }"
            "QPushButton:disabled { background: #555; }"
        )
        self.btn_compress.clicked.connect(self._compress)

        btn_row = QHBoxLayout()
        btn_row.addStretch()
        btn_row.addWidget(self.btn_compress)
        btn_row.addStretch()
        root.addLayout(btn_row)

        self.lbl_status = QLabel("")
        self.lbl_status.setAlignment(Qt.AlignCenter)
        self.lbl_status.setFont(QFont("Segoe UI", 10))
        root.addWidget(self.lbl_status)

        self.progress = QProgressBar()
        self.progress.setFixedHeight(22)
        root.addWidget(self.progress)

        grp_log = QGroupBox("Журнал работы")
        lay_log = QVBoxLayout(grp_log)
        self.txt_log = QTextEdit()
        self.txt_log.setReadOnly(True)
        self.txt_log.setMaximumHeight(150)
        self.txt_log.setFont(QFont("Consolas", 9))
        lay_log.addWidget(self.txt_log)
        root.addWidget(grp_log, stretch=1)

    def _choose_file(self):
        path, _ = QFileDialog.getOpenFileName(
            self, "Выберите GIF-файл", "", "GIF (*.gif)",
        )
        if not path:
            return
        p = Path(path)
        if p.suffix.lower() != ".gif":
            QMessageBox.warning(self, "Неверный формат", "Поддерживаются только .gif файлы.")
            return
        self.input_path = p
        text = str(p)
        if len(text) > 50:
            text = "…" + text[-47:]
        self.lbl_input.setText(text)

        # Превью — показываем первый кадр
        try:
            tmp_fd, tmp_gif = tempfile.mkstemp(suffix=".gif")
            os.close(tmp_fd)
            ffmpeg_bin = _get_ffmpeg_path()
            if not ffmpeg_bin:
                return
            subprocess.run(
                [ffmpeg_bin, "-y", "-v", "error", "-i", str(p),
                 "-frames:v", "1", "-vf", "scale=300:-2", tmp_gif],
                capture_output=True,
            )
            pix = QPixmap(tmp_gif)
            if not pix.isNull():
                scaled = pix.scaled(400, 300, Qt.KeepAspectRatio, Qt.SmoothTransformation)
                self.preview_label.setPixmap(scaled)
                self.preview_label.setStyleSheet(
                    "border: 2px solid #555; border-radius: 8px;"
                    "background: #1e1e1e;"
                )
            os.remove(tmp_gif)
        except Exception:
            pass

        self._log(f"Загружен: {p.name} ({self._human_size(p)})")

    def _choose_output_dir(self):
        d = QFileDialog.getExistingDirectory(self, "Выберите папку сохранения")
        if not d:
            return
        self.output_dir = Path(d)
        self.le_output.setText(str(self.output_dir))
        self._log(f"Папка сохранения изменена: {self.output_dir}")

    def _compress(self):
        if not self.input_path or not self.input_path.exists():
            QMessageBox.warning(self, "Нет файла", "Сначала выберите GIF-файл.")
            return

        try:
            max_w = int(self.spn_width.text())
            if max_w < 32:
                raise ValueError
        except ValueError:
            QMessageBox.warning(self, "Ошибка", "Максимальная ширина должна быть >= 32 px.")
            return

        target_idx = self.cmb_target.currentIndex()
        targets = [256, 512]
        target_kb = targets[target_idx]

        if not self._check_ffmpeg():
            return

        skip_mode = self.cmb_skip.currentData()

        self.btn_compress.setEnabled(False)
        self.progress.setValue(0)
        self.lbl_status.setText("Сжатие...")
        widgets_to_disable = [
            self.txt_log,
            self.preview_label,
            self.lbl_input,
            self.cmb_target,
            self.spn_width,
            self.cmb_skip,
            self.le_output,
        ]
        for w in widgets_to_disable:
            w.setUpdatesEnabled(False)

        self._log_buffer = []
        self.txt_log.append("\n═══ Начало сжатия ═══")
        self.txt_log.append(f"Входной:  {self.input_path.name} ({self._human_size(self.input_path)})")
        self.txt_log.append(f"Цель:     {target_kb} КБ | Ширина: {max_w}px\n")

        self.worker = CompressWorker(
            input_path=self.input_path,
            output_dir=self.output_dir,
            target_kb=target_kb,
            max_width=max_w,
            skip_mode=skip_mode,
        )
        self.worker.progress.connect(self._on_progress)
        self.worker.finished.connect(self._on_finished)
        self.worker.error.connect(self._on_error)
        self.worker.start()

    def _check_ffmpeg(self) -> bool:
        r = _find_ffmpeg_bin()
        if r:
            self._log(f"ffmpeg найден: {r[0]}")
            return True
        QMessageBox.critical(
            self, "ffmpeg не найден",
            "ffmpeg не обнаружен!\n\n"
            "Варианты:\n"
            "1. Положите распакованный ffmpeg в эту папку\n"
            "2. Добавьте ffmpeg в системный PATH\n"
            "3. Скачайте: https://www.gyan.dev/ffmpeg/builds/",
        )
        return False

    def _on_progress(self, pct: int, msg: str):
        if self._compressing:
            if msg not in self._log_buffer:
                self._log_buffer.append(msg)
        else:
            self.progress.setValue(pct)
            self.lbl_status.setText(f"{msg}")
            if msg not in self._log_buffer:
                self._log_buffer.append(msg)

    def _on_finished(self, out_path: str):
        self._compressing = False
        for line in self._log_buffer:
            self.txt_log.append(line)
        self._log_buffer.clear()
        self.btn_compress.setEnabled(True)
        self.progress.setValue(100)
        self.lbl_status.setText("Готово!")
        size_kb = os.path.getsize(out_path) / 1024
        target_idx = self.cmb_target.currentIndex()
        targets_list = [256, 512]
        target_bytes = targets_list[target_idx] * 1024
        within = abs(size_kb * 1024 - target_bytes) / max(target_bytes, 1) < 0.05
        self.txt_log.append(f"\nРезультат: {Path(out_path).name}")
        self.txt_log.append(f"Размер:    {size_kb:.1f} КБ (цель: {targets_list[target_idx]} КБ)")
        if not within:
            self.txt_log.append("ВНИМАНИЕ: Размер не уложился в цель")

    def _on_error(self, msg: str):
        self._compressing = False
        for line in self._log_buffer:
            self.txt_log.append(line)
        self._log_buffer.clear()
        self.btn_compress.setEnabled(True)
        self.progress.setValue(0)
        self.lbl_status.setText("Ошибка")
        self.txt_log.append(f"\nОШИБКА:\n{msg}")

    def _log(self, text: str):
        cursor = self.txt_log.textCursor()
        cursor.movePosition(cursor.End)
        cursor.insertText(text + "\n")
        self.txt_log.setTextCursor(cursor)

    def _human_size(path: Path) -> str:
        if not path.exists():
            return "?"
        s = path.stat().st_size
        for u in ("Б", "КБ", "МБ", "ГБ"):
            if s < 1024:
                return f"{s:.0f} {u}"
            s /= 1024
        return f"{s:.1f} ГБ"

    def _load_settings(self):
        cfg = Path(__file__).with_suffix(".cfg")
        if cfg.exists():
            try:
                lines = cfg.read_text(encoding="utf-8").strip().splitlines()
                if len(lines) >= 1 and Path(lines[0]).is_dir():
                    self.le_output.setText(lines[0])
                    self.output_dir = Path(lines[0])
            except Exception:
                pass

    def closeEvent(self, event):
        if self._log_buffer:
            for line in self._log_buffer:
                self.txt_log.append(line)
            self._log_buffer.clear()
        cfg = Path(__file__).with_suffix(".cfg")
        try:
            cfg.write_text(f"{self.le_output.text()}\n", encoding="utf-8")
        except Exception:
            pass
        super().closeEvent(event)




def main():
    app = QApplication(sys.argv)
    win = MainWindow()
    win.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
