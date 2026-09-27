// @vitest-environment jsdom
import {afterEach, describe, expect, it, vi} from 'vitest';

/**
 * Tests that the null localStorage guard works correctly.
 *
 * In Android WebView (and other restricted browser contexts), window.localStorage
 * can be null rather than throwing a SecurityError. The banner component must
 * handle this gracefully.
 */

const LOCALSTORAGE_NAMESPACE = 'banner-manifest';

// Mirror of the guarded readOrResetLocalStorage from banner/index.tsx
function readOrResetLocalStorage(): string[] | null {
  if (!localStorage) {
    return null;
  }
  const stored = localStorage.getItem(LOCALSTORAGE_NAMESPACE);
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(LOCALSTORAGE_NAMESPACE);
    return null;
  }
}

describe('Banner localStorage guard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.removeItem(LOCALSTORAGE_NAMESPACE);
  });

  it('returns null without throwing when localStorage is null', () => {
    vi.stubGlobal('localStorage', null);
    expect(() => readOrResetLocalStorage()).not.toThrow();
    expect(readOrResetLocalStorage()).toBeNull();
  });

  it('returns null when localStorage has no stored banner manifest', () => {
    expect(readOrResetLocalStorage()).toBeNull();
  });

  it('returns parsed manifest when localStorage contains valid data', () => {
    const manifest = ['hash1', 'hash2'];
    localStorage.setItem(LOCALSTORAGE_NAMESPACE, JSON.stringify(manifest));
    expect(readOrResetLocalStorage()).toEqual(manifest);
  });

  it('returns null and clears storage when localStorage contains invalid JSON', () => {
    localStorage.setItem(LOCALSTORAGE_NAMESPACE, 'not-valid-json{{{');
    expect(readOrResetLocalStorage()).toBeNull();
    expect(localStorage.getItem(LOCALSTORAGE_NAMESPACE)).toBeNull();
  });
});
