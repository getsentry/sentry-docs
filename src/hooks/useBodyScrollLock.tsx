'use client';

import {useEffect} from 'react';

// Restore the prior value (not ''), so we don't clobber a lock a third party
// (e.g. the Kapa modal) set after us.
let lockCount = 0;
let previousOverflow = '';

function lockBodyScroll() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
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
    document.body.style.overflow = previousOverflow;
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
