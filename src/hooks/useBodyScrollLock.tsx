'use client';

import {useEffect} from 'react';

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
    // Clear our inline lock rather than restoring a captured value: a captured
    // value could be a third party's transient 'hidden' (e.g. Kapa), which we'd
    // wrongly re-apply on release and leave the page unscrollable.
    document.body.style.overflow = '';
  }
}

/** Reference-counted body scroll lock; safe to use from several overlays at once. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    lockBodyScroll();
    return unlockBodyScroll;
  }, [active]);
}
