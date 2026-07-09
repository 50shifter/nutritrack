/**
 * Process Manager — безопасный менеджер процессов для всего проекта VibeING
 * 
 * Фиксит проблему зомби-процессов через:
 * - Отслеживание всех child PIDs
 * - Автоматическую очистку при exit креш родителя
 * - Безопасное завершение с таймаутом
 * - Предотвращение дублирования процессов
 * - Graceful shutdown (SIGTERM/SIGINT)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, 'Logs');

// Ensure logs dir exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

class ProcessManager {
  constructor() {
    this.children = new Map(); // name -> { process, startTime, logFile }
    this.killed = false;
    this.shuttingDown = false;

    // Global cleanup hooks
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
    process.on('exit', () => this.onProcessExit());
    process.on('uncaughtException', (err) => {
      console.error('[ProcessManager] Uncaught exception:', err.message);
    });

    console.log('[ProcessManager] Initialized — tracking all child processes');
  }

  /**
   * Safe spawn with full tracking
   */
  spawn(name, command, args, options = {}) {
    const {
      logFile = null,
      timeout = 30000,
      retry = 0,
      retryDelay = 2000,
      ...spawnOptions
    } = options;

    const logPath = logFile || path.join(LOGS_DIR, `${name}.log`);
    let retriesLeft = retry;

    const logStream = fs.createWriteStream(logPath, { flags: 'a' });
    const errStream = fs.createWriteStream(path.join(LOGS_DIR, `${name}_err.log`), { flags: 'a' });

    const startProcess = () => {
      // Check if already running with this name
      if (this.children.has(name) && !this.children.get(name).killed) {
        console.log(`[ProcessManager] "${name}" is already running, skipping`);
        return null;
      }

      console.log(`[ProcessManager] Spawning "${name}": ${command} ${args.join(' ')}`);

      const child = spawn(command, args, {
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false,
        ...spawnOptions,
      });

      // Pipe stdout/stderr to log files
      if (child.stdout) child.stdout.pipe(logStream);
      if (child.stderr) child.stderr.pipe(errStream);

      this.children.set(name, {
        process: child,
        startTime: Date.now(),
        logFile: logPath,
        killed: false,
      });

      child.on('spawn', () => {
        console.log(`[ProcessManager] "${name}" spawned, PID: ${child.pid}`);
      });

      child.on('error', (err) => {
        console.error(`[ProcessManager] "${name}" error: ${err.message}`);
        this.remove(name);
      });

      child.on('exit', (code, signal) => {
        console.log(`[ProcessManager] "${name}" exited (code=${code}, signal=${signal})`);
        this.remove(name);

        // Auto-restart if it exited unexpectedly and retries remain
        if (code !== 0 && retriesLeft > 0 && !this.killed) {
          console.log(`[ProcessManager] "${name}" restarting (attempt ${retry - retriesLeft + 1}/${retry})...`);
          setTimeout(startProcess, retryDelay);
        }
      });

      return child;
    };

    startProcess();
  }

  /**
   * Remove a tracked child
   */
  remove(name) {
    const entry = this.children.get(name);
    if (entry) {
      entry.killed = true;
      this.children.delete(name);
    }
  }

  /**
   * Kill a specific process by name
   */
  kill(name) {
    const entry = this.children.get(name);
    if (!entry) {
      console.log(`[ProcessManager] "${name}" not found`);
      return false;
    }

    const { process } = entry;
    entry.killed = true;

    if (process.pid && !process.killed) {
      console.log(`[ProcessManager] Killing "${name}" (PID: ${process.pid})`);

      // Graceful first, then force
      process.once('exit', () => {
        console.log(`[ProcessManager] "${name}" terminated`);
        this.remove(name);
      });

      process.kill('SIGTERM');

      // Force kill after timeout
      setTimeout(() => {
        if (!process.killed) {
          console.log(`[ProcessManager] Force killing "${name}"`);
          try {
            process.kill('SIGKILL');
          } catch (e) {
            // Already dead
          }
        }
        this.remove(name);
      }, 5000);
    } else {
      this.remove(name);
    }

    return true;
  }

  /**
   * Kill all tracked processes
   */
  killAll() {
    if (this.shuttingDown) return;
    this.shuttingDown = true;
    this.killed = true;

    console.log('[ProcessManager] Shutting down all processes...');

    const entries = Array.from(this.children.entries());
    const timeout = setTimeout(() => {
      // Force kill anything still alive
      for (const [name, entry] of entries) {
        if (!entry.killed && entry.process.pid && !entry.process.killed) {
          console.log(`[ProcessManager] Force killing "${name}"`);
          try { entry.process.kill('SIGKILL'); } catch (e) {}
        }
        this.remove(name);
      }
    }, 10000);

    timeout.unref();

    let remaining = entries.length;
    if (remaining === 0) {
      console.log('[ProcessManager] No processes to kill');
      return;
    }

    for (const [name, entry] of entries) {
      entry.killed = true;
      if (entry.process.pid && !entry.process.killed) {
        entry.process.once('exit', () => {
          remaining--;
          if (remaining === 0) {
            console.log('[ProcessManager] All processes terminated');
          }
        });
        try {
          entry.process.kill('SIGTERM');
        } catch (e) {
          remaining--;
        }
      } else {
        this.remove(name);
        remaining--;
      }
    }

    // If some didn't exit in time, force kill them
    setTimeout(() => {
      for (const [name, entry] of entries) {
        if (entry.process.pid && !entry.process.killed) {
          console.log(`[ProcessManager] Force killing "${name}"`);
          try { entry.process.kill('SIGKILL'); } catch (e) {}
          this.remove(name);
        }
      }
    }, 8000);
  }

  /**
   * Graceful shutdown handler
   */
  gracefulShutdown(signal) {
    console.log(`\n[ProcessManager] Received ${signal}, shutting down...`);
    this.killAll();
  }

  /**
   * Cleanup on process exit (safety net)
   */
  onProcessExit() {
    // Force kill everything on exit
    for (const [name, entry] of this.children.entries()) {
      if (entry.process.pid && !entry.process.killed) {
        try {
          process.kill(entry.process.pid, 'SIGKILL');
        } catch (e) {}
      }
    }
  }

  /**
   * Get status of all tracked processes
   */
  status() {
    console.log('\n=== Process Manager Status ===');
    for (const [name, entry] of this.children.entries()) {
      const age = Math.round((Date.now() - entry.startTime) / 1000);
      console.log(`  ${name}: PID=${entry.process.pid || 'unknown'}, alive=${!entry.process.killed}, age=${age}s`);
    }
    console.log(`  Total: ${this.children.size} processes tracked`);
    console.log('==============================\n');
  }
}

// Export singleton
module.exports = new ProcessManager();
