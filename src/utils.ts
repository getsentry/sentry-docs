import {useEffect} from 'react';
import type {Transaction} from '@sentry/browser';
import qs from 'query-string';

type ClickOutsideCallback = (event: MouseEvent) => void;

interface UseClickOutsideOpts<E extends HTMLElement> {
  enabled: boolean;
  handler: ClickOutsideCallback;
  ref: React.RefObject<E>;
}

export function useOnClickOutside<E extends HTMLElement>({
  ref,
  enabled,
  handler,
}: UseClickOutsideOpts<E>) {
  useEffect(() => {
    const cb = (event: MouseEvent) => {
      if (!enabled) {
        return;
      }
      if (!(event.target instanceof Element)) {
        return;
      }
      if (!ref.current?.contains(event.target)) {
        handler(event);
      }
    };
    document.addEventListener('click', cb);
    return () => document.removeEventListener('click', cb);
  }, [enabled, handler, ref]);
}

export function sortBy<A>(arr: A[], comp: (v: A) => number): A[] {
  return arr.sort((a, b) => {
    const aComp = comp(a);
    const bComp = comp(b);
    if (aComp < bComp) {
      return -1;
    }
    if (aComp > bComp) {
      return 1;
    }
    return 0;
  });
}

type Page = {
  context: {
    sidebar_order?: number;
    sidebar_title?: string;
    title?: string;
  };
};

export const sortPages = (arr: any, extractor: (any) => Page = n => n): any[] => {
  return arr.sort((a, b) => {
    a = extractor(a);
    b = extractor(b);
    const aso = a.context.sidebar_order >= 0 ? a.context.sidebar_order : 10;
    const bso = b.context.sidebar_order >= 0 ? b.context.sidebar_order : 10;
    if (aso > bso) {
      return 1;
    }
    if (bso > aso) {
      return -1;
    }
    return (a.context.sidebar_title || a.context.title).localeCompare(
      b.context.sidebar_title || b.context.title
    );
  });
};

type URLQueryObject = {
  [key: string]: string;
};

const paramsToSync = [/utm_/i, /promo_/i, /gclid/i, /original_referrer/i];

export const marketingUrlParams = (): URLQueryObject => {
  const query = qs.parse(window.location.search);
  const marketingParams: Record<string, string> = Object.keys(query).reduce((a, k) => {
    const matcher = paramsToSync.find(m => m.test(k));
    return matcher ? {...a, [k]: query[k]} : a;
  }, {});

  // add in original_referrer
  if (document.referrer && !marketingParams.original_referrer) {
    marketingParams.original_referrer = document.referrer;
  }

  return marketingParams;
};

export function getCurrentTransaction(): Transaction | undefined {
  try {
    // getCurrentHub() can actually return undefined, as we are using the Loader Script
    // so we guard defensively against all of these existing.
    return window.Sentry.getCurrentHub().getScope().getTransaction();
  } catch {
    return undefined;
  }
}

export function captureException(exception: unknown): void {
  try {
    // Sentry may not be available, as we are using the Loader Script
    // so we guard defensively against all of these existing.
    window.Sentry.captureException(exception);
  } catch {
    // ignore
  }
}
