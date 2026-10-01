/**
 * Safe localStorage helpers that gracefully handle environments where
 * localStorage is unavailable (e.g. Safari Private Browsing, where accessing
 * the global throws a ReferenceError rather than a SecurityError).
 */

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently ignore — localStorage unavailable (e.g. Safari Private Browsing)
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently ignore — localStorage unavailable
    }
  },
};
