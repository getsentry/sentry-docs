import {describe, expect, it} from 'vitest';

import {replaceCurrentUrlTokens} from './markdown-keywords.mjs';

describe('replaceCurrentUrlTokens', () => {
  it('replaces the current URL placeholder without query parameters or fragments', () => {
    expect(
      replaceCurrentUrlTokens(
        'Follow ___CURRENT_URL___ to continue.',
        'https://docs.sentry.io/platforms/javascript/?source=agent#setup'
      )
    ).toBe('Follow https://docs.sentry.io/platforms/javascript/ to continue.');
  });

  it('leaves the placeholder unchanged without a canonical URL', () => {
    expect(replaceCurrentUrlTokens('Follow ___CURRENT_URL___.')).toBe(
      'Follow ___CURRENT_URL___.'
    );
  });
});
