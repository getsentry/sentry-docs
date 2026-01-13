'use client';

import {useEffect, useState} from 'react';

/**
 * Loads Radix UI Themes CSS asynchronously to prevent render-blocking.
 *
 * The CSS is dynamically imported after initial hydration, which moves it
 * out of the critical rendering path. This eliminates the 26K-line CSS file
 * from blocking initial paint.
 *
 * Trade-off: Radix-styled components (Button, etc.) may flash unstyled briefly
 * on first page load, but the CSS is cached for subsequent navigations.
 *
 * Fixes: DOCS-7KN (Large Render Blocking Asset)
 */
export function RadixStyles() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import the CSS - this loads it after initial render
    import('@radix-ui/themes/styles.css')
      .then(() => setLoaded(true))
      .catch(err => {
        console.error('Failed to load Radix CSS:', err);
      });
  }, []);

  // Inline critical styles for Radix components while the full CSS loads
  // This prevents a complete flash of unstyled content
  if (!loaded) {
    return (
      <style>{`
        /* Minimal Radix button styles while full CSS loads */
        .rt-Button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0 1rem;
          height: 2.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.375rem;
          cursor: pointer;
          background: var(--accent-9, #6a5fc1);
          color: white;
          border: none;
        }
        .rt-Button:hover {
          background: var(--accent-10, #5b50a8);
        }
        /* Minimal theme wrapper styles */
        .radix-themes {
          font-family: var(--font-rubik), system-ui, sans-serif;
        }
      `}</style>
    );
  }

  return null;
}
