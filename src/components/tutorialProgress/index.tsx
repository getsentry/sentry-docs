import styles from './style.module.scss';

interface TutorialProgressProps {
  /** The current step number (1-based). */
  step: number;
  /** Total number of steps. @defaultValue 5 */
  total?: number;
}

/** The bug that rides the tip of the fill. */
function Bug() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#2b2240" strokeWidth="2.2" strokeLinecap="round">
        {/* antennae */}
        <path d="M10 4 L8 1.6" />
        <path d="M14 4 L16 1.6" />
        {/* legs */}
        <path d="M6.6 10 L2 8" />
        <path d="M6 13.5 L1.5 13.5" />
        <path d="M6.6 17 L2.6 19.6" />
        <path d="M17.4 10 L22 8" />
        <path d="M18 13.5 L22.5 13.5" />
        <path d="M17.4 17 L21.4 19.6" />
      </g>
      {/* head + body */}
      <circle cx="12" cy="5.4" r="2.6" fill="currentColor" stroke="#2b2240" strokeWidth="1.6" />
      <ellipse
        cx="12"
        cy="13.5"
        rx="6.2"
        ry="7.8"
        fill="currentColor"
        stroke="#2b2240"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * A slim progress bar for multi-page tutorials. Fills with Sentry purple in
 * proportion to `step / total`, with a bug riding the tip of the fill.
 */
export function TutorialProgress({step, total = 5}: TutorialProgressProps) {
  const clamped = Math.max(0, Math.min(step, total));
  const pct = total > 0 ? (clamped / total) * 100 : 0;

  return (
    <div
      className={styles.wrap}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Step ${clamped} of ${total}`}
    >
      <div className={styles.track}>
        <div className={styles.fill} style={{width: `${pct}%`}}>
          <span className={styles.marker} aria-hidden="true">
            <Bug />
          </span>
        </div>
      </div>
    </div>
  );
}
