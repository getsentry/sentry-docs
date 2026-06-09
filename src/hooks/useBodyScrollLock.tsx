'use client';

import {useEffect, useLayoutEffect} from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

let lockCount = 0;

function lockBodyScroll() {
  if (lockCount === 0) {
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

function unlockBodyScroll() {
  if (lockCount === 0) {
    return;
  }
  lockCount -= 1;
  if (lockCount === 0) {
    // Clear, don't restore a captured value — it may be a third party's
    // transient lock (e.g. Kapa); re-applying it would strand the page.
    document.body.style.overflow = '';
  }
}

/**
 * Reference-counted body scroll lock; safe to use from several overlays at once.
 * Runs as a layout effect so the release happens synchronously on commit, before
 * any rAF that hands the lock off to a third-party modal.
 */
export function useBodyScrollLock(active: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!active) {
      return undefined;
    }
    lockBodyScroll();
    return unlockBodyScroll;
  }, [active]);
}
