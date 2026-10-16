import {describe, expect, it} from 'vitest';

import {resolveElement, showSigninNote} from './codeTabs';

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

describe('resolveElement', () => {
  const element = {type: 'div', props: {language: 'fsharp'}};
  const lazy = (init: () => unknown) => ({_payload: {}, _init: init});

  it('returns plain elements as they are', () => {
    expect(resolveElement(element)).toBe(element);
  });

  it('resolves loaded lazy elements', () => {
    expect(resolveElement(lazy(() => element))).toBe(element);
  });

  it('rethrows the thenable of lazy elements that have not loaded yet', () => {
    const pending = Promise.resolve();
    let thrown: unknown;
    try {
      resolveElement(
        lazy(() => {
          throw pending;
        })
      );
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBe(pending);
  });

  it('drops lazy elements that failed to load', () => {
    expect(
      resolveElement(
        lazy(() => {
          throw new Error('failed');
        })
      )
    ).toBeNull();
  });

  it('drops non-elements', () => {
    expect(resolveElement(null)).toBeNull();
    expect(resolveElement('text')).toBeNull();
  });
});
