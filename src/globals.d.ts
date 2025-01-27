import type * as Sentry from '@sentry/browser';

declare global {
  interface Window {
    Sentry: typeof Sentry;
    Kapa?: {
      open: (options: {mode?: string; query?: string; submit?: boolean}) => void;
    };
  }
}
