import * as Sentry from '@sentry/browser';

declare global {
  interface Window {
    Sentry: typeof Sentry;
  }
}
