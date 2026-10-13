'use client';

import {useCallback, useEffect, useState} from 'react';
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

type PlatformsState = {
  /** `undefined` until the list has loaded. */
  platforms: Platform[] | undefined;
  /** Retries loading the list after it failed. */
  retry: () => void;
  status: 'loading' | 'loaded' | 'error';
};

/**
 * Returns the list of all platforms and guides.
 *
 * The list is loaded in the background once the browser is idle, so it is usually
 * available by the time someone opens a platform picker.
 */
export function usePlatforms(): PlatformsState {
  const [platforms, setPlatforms] = useState<Platform[]>();
  const [status, setStatus] = useState<PlatformsState['status']>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      loadPlatforms()
        .then(result => {
          if (!cancelled) {
            setPlatforms(result);
            setStatus('loaded');
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStatus('error');
          }
        });
    };

    // Retries load right away; the initial load waits until the browser is idle.
    if (attempt > 0) {
      load();
      return () => {
        cancelled = true;
      };
    }
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
  }, [attempt]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt(a => a + 1);
  }, []);

  return {platforms, status, retry};
}
