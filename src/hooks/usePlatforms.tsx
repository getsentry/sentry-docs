'use client';

import {useEffect, useState} from 'react';
import {Platform} from 'sentry-docs/types';

const PLATFORMS_URL = '/platforms.json';

let platformsPromise: Promise<Platform[]> | undefined;

/**
 * Loads the list of all platforms and guides. The request is only made once per
 * page load; a failed request is retried on the next call.
 */
export function loadPlatforms(): Promise<Platform[]> {
  if (!platformsPromise) {
    platformsPromise = fetch(PLATFORMS_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load ${PLATFORMS_URL}: ${res.status}`);
        }
        return res.json() as Promise<Platform[]>;
      })
      .catch(err => {
        platformsPromise = undefined;
        throw err;
      });
  }
  return platformsPromise;
}

/**
 * Returns the list of all platforms and guides, or `undefined` while it is loading.
 *
 * The list is loaded in the background once the browser is idle, so it is usually
 * available by the time someone opens a platform picker.
 */
export function usePlatforms(): Platform[] | undefined {
  const [platforms, setPlatforms] = useState<Platform[]>();

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      loadPlatforms()
        .then(result => {
          if (!cancelled) {
            setPlatforms(result);
          }
        })
        .catch(() => {
          // Leave the list empty; consumers fall back to their defaults.
        });
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, {timeout: 2000});
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const id = setTimeout(load, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  return platforms;
}
