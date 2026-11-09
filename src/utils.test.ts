import {afterEach, describe, expect, it} from 'vitest';

import {isLocalStorageAvailable} from './utils';

/**
 * `localStorage` does not merely go missing in restricted contexts -- it fails
 * in three distinct ways, and each has been seen in production:
 *
 *   - `null`, in Android WebView with storage disabled (DOCS-BA0)
 *   - a throwing getter, in sandboxed iframes or with site data blocked
 *   - a working object whose `setItem` throws, on private-mode quota limits
 *
 * A bare `if (!localStorage)` check catches only the first, which is why
 * callers go through this helper rather than testing the global directly.
 */

const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

function stubLocalStorage(descriptor: PropertyDescriptor) {
  Object.defineProperty(globalThis, 'localStorage', {configurable: true, ...descriptor});
}

/** Minimal in-memory stand-in for a Storage that works. */
function workingStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

afterEach(() => {
  if (originalDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

describe('isLocalStorageAvailable', () => {
  it('returns false when localStorage is undefined', () => {
    stubLocalStorage({value: undefined, writable: true});
    expect(isLocalStorageAvailable()).toBe(false);
  });

  it('returns false when localStorage is null, as in Android WebView', () => {
    stubLocalStorage({value: null, writable: true});
    expect(isLocalStorageAvailable()).toBe(false);
  });

  it('returns false when reading the global throws, as in a sandboxed iframe', () => {
    stubLocalStorage({
      get() {
        throw new Error('SecurityError: access to storage is denied');
      },
    });
    expect(isLocalStorageAvailable()).toBe(false);
  });

  it('returns false when writing throws, as on a private-mode quota limit', () => {
    stubLocalStorage({
      value: {
        ...workingStorage(),
        setItem: () => {
          throw new Error('QuotaExceededError');
        },
      },
      writable: true,
    });
    expect(isLocalStorageAvailable()).toBe(false);
  });

  it('returns true and leaves no probe key behind when storage works', () => {
    const storage = workingStorage();
    stubLocalStorage({value: storage, writable: true});

    expect(isLocalStorageAvailable()).toBe(true);
    expect(storage.getItem('__sentry_ls_test__')).toBeNull();
  });
});
