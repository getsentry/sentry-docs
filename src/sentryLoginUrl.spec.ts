import {describe, expect, it} from 'vitest';

import {sentryLoginUrl} from './sentryLoginUrl';

describe('sentryLoginUrl', () => {
  it('redirects back to the page on docs.sentry.io', () => {
    expect(sentryLoginUrl('/platforms/javascript/guides/nextjs/tracing/')).toBe(
      'https://sentry.io/auth/login/?next=https%3A%2F%2Fdocs.sentry.io%2Fplatforms%2Fjavascript%2Fguides%2Fnextjs%2Ftracing%2F'
    );
  });

  it('falls back to the docs root when there is no pathname', () => {
    expect(sentryLoginUrl(null)).toBe(
      'https://sentry.io/auth/login/?next=https%3A%2F%2Fdocs.sentry.io%2F'
    );
  });
});
