import {describe, expect, it} from 'vitest';

import {showSigninNote} from './codeTabs';

describe('showSigninNote', () => {
  it('shows the sign-in note for project config placeholders', () => {
    expect(showSigninNote('dsn: "___PUBLIC_DSN___"')).toBe(true);
  });

  it('shows the sign-in note for auth token placeholders', () => {
    expect(showSigninNote('SENTRY_AUTH_TOKEN=___ORG_AUTH_TOKEN___')).toBe(true);
  });

  it('does not show the sign-in note for onboarding option markers', () => {
    expect(
      showSigninNote(`
        // ___PRODUCT_OPTION_START___ performance
        Sentry.browserTracingIntegration(),
        // ___PRODUCT_OPTION_END___ performance
      `)
    ).toBe(false);
  });
});
