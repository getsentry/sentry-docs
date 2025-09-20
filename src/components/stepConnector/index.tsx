"use client";

/**
 * Component: StepConnector / StepComponent
 *
 * Visually connects sequential headings with a vertical rail and circles.
 * Supports optional numbering and a user‑checkable “completed” state.
 *
 * Props overview
 * - startAt: number — first step number (default 1)
 * - selector: string — heading selector (default 'h2')
 * - showNumbers: boolean — show numbers inside circles (default true)
 * - checkable: boolean — allow toggling completion (default false)
 * - persistence: 'session' | 'none' — completion storage (default 'session')
 * - showReset: boolean — show a small “Reset steps” action (default true)
 *
 * Usage
 * <StepConnector checkable />
 * <StepConnector showNumbers={false} checkable persistence="none" />
 *
 * Accessibility
 * - Each circle becomes a button when `checkable` is enabled (keyboard + aria‑pressed).
 * - When `showNumbers` is false, a subtle dot is shown; numbering remains implicit
 *   via the DOM order, and buttons include descriptive aria‑labels.
 *
 * Theming / CSS variables (in style.module.scss)
 * - --rail-x, --circle, --gap control rail position and circle size/spacing.
 */

import {useEffect, useMemo, useRef, useState} from "react";
import styles from "./style.module.scss";

type Persistence = "session" | "none";

type Props = {
  children: React.ReactNode;
  /** Start numbering from this value. @defaultValue 1 */
  startAt?: number;
  /** Which heading level to connect (CSS selector). @defaultValue 'h2' */
  selector?: string;
  /** Show numeric labels inside circles. Set false for blank circles. @defaultValue true */
  showNumbers?: boolean;
  /** Allow users to check off steps (circle becomes a button). @defaultValue false */
  checkable?: boolean;
  /** Completion storage: 'session' | 'none'. @defaultValue 'session' */
  persistence?: Persistence;
  /** Show a small "Reset steps" action when checkable. @defaultValue true */
  showReset?: boolean;
};

export function StepComponent({
  children,
  startAt = 1,
  selector = "h2",
  showNumbers = true,
  checkable = false,
  persistence = "session",
  showReset = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const storageKey = useMemo(() => {
    if (typeof window === "undefined" || persistence !== "session") return null;
    try {
      const path = window.location?.pathname ?? "";
      return `stepConnector:${path}:${selector}:${startAt}`;
    } catch {
      return null;
    }
  }, [persistence, selector, startAt]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      // Return empty cleanup function for consistent return
      return () => {};
    }

    const headings = Array.from(
      container.querySelectorAll<HTMLElement>(`:scope ${selector}`)
    );

    headings.forEach(h => {
      h.classList.remove(styles.stepHeading);
      h.removeAttribute("data-step");
      h.removeAttribute("data-completed");
      const existingToggle = h.querySelector(`.${styles.stepToggle}`);
      if (existingToggle) existingToggle.remove();
    });

    headings.forEach((h, idx) => {
      const stepNumber = startAt + idx;
      h.setAttribute("data-step", String(stepNumber));
      h.classList.add(styles.stepHeading);

      if (checkable) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = styles.stepToggle;
        btn.setAttribute("aria-label", `Toggle completion for step ${stepNumber}`);
        btn.setAttribute("aria-pressed", completed.has(h.id) ? "true" : "false");
        btn.addEventListener("click", () => {
          setCompleted(prev => {
            const next = new Set(prev);
            if (next.has(h.id)) next.delete(h.id);
            else next.add(h.id);
            return next;
          });
        });
        h.insertBefore(btn, h.firstChild);
      }
    });

    // Cleanup function
    return () => {
      headings.forEach(h => {
        h.classList.remove(styles.stepHeading);
        h.removeAttribute("data-step");
        h.removeAttribute("data-completed");
        const existingToggle = h.querySelector(`.${styles.stepToggle}`);
        if (existingToggle) existingToggle.remove();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAt, selector, checkable]);

  useEffect(() => {
    if (!storageKey || !checkable) return;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]));
    } catch {
      // Ignore storage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, checkable]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const headings = Array.from(
      container.querySelectorAll<HTMLElement>(`:scope ${selector}`)
    );
    headings.forEach(h => {
      const isDone = completed.has(h.id);
      if (isDone) h.setAttribute("data-completed", "true");
      else h.removeAttribute("data-completed");
      const btn = h.querySelector(`.${styles.stepToggle}`) as HTMLButtonElement | null;
      if (btn) btn.setAttribute("aria-pressed", isDone ? "true" : "false");
    });

    if (storageKey && checkable) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(Array.from(completed)));
      } catch {
        // Ignore storage errors
      }
    }
  }, [completed, selector, storageKey, checkable]);

  const handleReset = () => {
    setCompleted(new Set());
    if (storageKey) {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // Ignore storage errors
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.stepContainer}
      data-shownumbers={showNumbers ? "true" : "false"}
    >
      {checkable && showReset && (
        <div className={styles.resetRow}>
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            Reset steps
          </button>
        </div>
      )}
      {children}
    </div>
  );
}

// Alias to match usage <StepConnector>...</StepConnector>
export function StepConnector(props: Props) {
  return <StepComponent {...props} />;
}

