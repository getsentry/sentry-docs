import type * as Sentry from '@sentry/browser';

declare global {
  interface Window {
    Sentry: typeof Sentry;
    // Defined by the Plausible script that next-plausible loads.
    plausible?: (event: string, options?: {props?: Record<string, string>}) => void;
    Kapa?: {
      open: (options: {mode?: string; query?: string; submit?: boolean}) => void;
    };
  }
}
