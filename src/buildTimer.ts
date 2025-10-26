/**
 * Build timing utility for tracking performance of build operations
 */

const PREFIX = '[BUILD_TIMER]';

// Global tracking for build summary
const buildPhases: {duration: number; name: string}[] = [];

/**
 * Format duration in seconds with 1 decimal place
 */
function formatDuration(ms: number): string {
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
}

/**
 * Simple timer class for tracking operation duration
 */
export class BuildTimer {
  private startTime: number;
  private name: string;

  constructor(name: string, autoStart = true) {
    this.name = name;
    this.startTime = 0;
    if (autoStart) {
      this.start();
    }
  }

  start(): void {
    this.startTime = Date.now();
    // eslint-disable-next-line no-console
    console.log(`${PREFIX} 🕐 Starting: ${this.name}`);
  }

  end(silent = false): number {
    const duration = Date.now() - this.startTime;
    if (!silent) {
      // eslint-disable-next-line no-console
      console.log(
        `${PREFIX} ✓ Completed: ${this.name} (took ${formatDuration(duration)})`
      );
    }
    // Track for summary
    buildPhases.push({name: this.name, duration});
    return duration;
  }

  /**
   * Get elapsed time without ending the timer
   */
  elapsed(): number {
    return Date.now() - this.startTime;
  }
}

/**
 * Log a simple message with the BUILD_TIMER prefix
 */
export function logBuildInfo(message: string): void {
  // eslint-disable-next-line no-console
  console.log(`${PREFIX} ${message}`);
}

/**
 * Log a warning about a slow operation
 */
export function logSlowOperation(name: string, duration: number): void {
  // eslint-disable-next-line no-console
  console.log(`${PREFIX} ⚠️ Slow operation: ${name} (took ${formatDuration(duration)})`);
}

/**
 * Log progress with statistics
 */
export function logProgress(message: string): void {
  // eslint-disable-next-line no-console
  console.log(`${PREFIX} 📊 ${message}`);
}

/**
 * Aggregator for tracking multiple operations of the same type
 */
export class OperationAggregator {
  private count = 0;
  private totalDuration = 0;
  private name: string;
  private slowThreshold: number;
  private progressInterval: number;
  private lastProgressLog = 0;

  constructor(
    name: string,
    options: {progressInterval?: number; slowThreshold?: number} = {}
  ) {
    this.name = name;
    this.slowThreshold = options.slowThreshold ?? 2000; // 2 seconds default
    this.progressInterval = options.progressInterval ?? 100; // log every 100 operations
  }

  /**
   * Track a single operation
   */
  track(operationName: string, duration: number): void {
    this.count++;
    this.totalDuration += duration;

    // Log slow operations
    if (duration > this.slowThreshold) {
      logSlowOperation(operationName, duration);
    }

    // Log progress at intervals
    if (this.count - this.lastProgressLog >= this.progressInterval) {
      this.logStats();
      this.lastProgressLog = this.count;
    }
  }

  /**
   * Log current statistics
   */
  logStats(final = false): void {
    const avg = this.count > 0 ? this.totalDuration / this.count : 0;
    if (final) {
      // Final summary - more detailed
      logProgress(
        `${this.name}: ${this.count} operations (avg ${formatDuration(avg)}/op, total ${formatDuration(this.totalDuration)})`
      );
    } else {
      // Progress update - more concise
      logProgress(`${this.name}: ${this.count} ops (${formatDuration(avg)}/op avg)`);
    }
  }

  /**
   * Get current statistics
   */
  getStats(): {average: number; count: number; total: number} {
    return {
      average: this.count > 0 ? this.totalDuration / this.count : 0,
      count: this.count,
      total: this.totalDuration,
    };
  }

  /**
   * Log final summary
   */
  logFinalSummary(): void {
    this.logStats(true);
  }
}

/**
 * Print a summary of all build phases
 */
export function logBuildSummary(): void {
  if (buildPhases.length === 0) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`\n${PREFIX} ═══════════════════════════════════════════════════════`);
  // eslint-disable-next-line no-console
  console.log(`${PREFIX} 📊 BUILD TIMING SUMMARY`);
  // eslint-disable-next-line no-console
  console.log(`${PREFIX} ═══════════════════════════════════════════════════════`);

  // Sort by duration descending
  const sorted = [...buildPhases].sort((a, b) => b.duration - a.duration);

  const totalTime = sorted.reduce((sum, phase) => sum + phase.duration, 0);

  sorted.forEach(phase => {
    const percentage = ((phase.duration / totalTime) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor((phase.duration / totalTime) * 30));
    // eslint-disable-next-line no-console
    console.log(
      `${PREFIX} ${formatDuration(phase.duration).padStart(8)} ${percentage.padStart(5)}% ${bar.padEnd(30)} ${phase.name}`
    );
  });

  // eslint-disable-next-line no-console
  console.log(`${PREFIX} ───────────────────────────────────────────────────────`);
  // eslint-disable-next-line no-console
  console.log(`${PREFIX} Total tracked: ${formatDuration(totalTime)}`);
  // eslint-disable-next-line no-console
  console.log(`${PREFIX} ═══════════════════════════════════════════════════════\n`);
}

// Automatically log build summary when the process exits
// This ensures the summary is shown even if the build script doesn't explicitly call it
if (typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    logBuildSummary();
  });
}
