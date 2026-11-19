'use client';

import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'sentry-docs/types';

const PLATFORMS_URL = '/platforms.json';

let platformsPromise: Promise<Platform[]> | undefined;
// Kept so components mounted after the list has loaded (e.g. after client-side
// navigation) can use it right away.
let loadedPlatforms: Platform[] | undefined;

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
      .then(platforms => {
        loadedPlatforms = platforms;
        return platforms;
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
  const [platforms, setPlatforms] = useState(loadedPlatforms);
  const [status, setStatus] = useState<PlatformsState['status']>(
    loadedPlatforms ? 'loaded' : 'loading'
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Another instance may have loaded the list since this one mounted, e.g. when
    // retrying after this instance's load failed
    if (loadedPlatforms) {
      setPlatforms(loadedPlatforms);
      setStatus('loaded');
      return undefined;
    }
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

    // The initial load waits until the browser is idle. Retries, and loads that
    // another component already started, don't need to wait.
    if (attempt > 0 || platformsPromise) {
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
