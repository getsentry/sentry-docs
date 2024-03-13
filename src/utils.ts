import type {Transaction} from '@sentry/browser';
import qs from 'query-string';

/**
 * This function is used to filter out any elements that are not truthy and plays nice with TypeScript.
 * @param x - The value to check for truthiness.
 * @example
 * ```typeScript
 * let numbers: number[] = [1, undefined, 3, null, 5].filter(isTruthy);
 * ```
 */
export const isTruthy = <T>(x?: T): x is Exclude<T, null | undefined> => {
  return x !== null && x !== undefined;
};

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

export const capitilize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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

    const aBase = a.context.sidebar_order ?? 10;
    const bBase = b.context.sidebar_order ?? 10;
    const aso = aBase >= 0 ? aBase : 10;
    const bso = bBase >= 0 ? bBase : 10;

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
    // getCurrentScope() may not be defined yet, as we are using the Loader Script
    // so we guard defensively against all of these existing.
    return window.Sentry.getCurrentScope().getTransaction();
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
