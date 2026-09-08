import {describe, expect, it} from 'vitest';

import {replaceCurrentUrlTokens} from './codeKeywords';

describe('replaceCurrentUrlTokens', () => {
  it('replaces the current URL placeholder without query parameters or fragments', () => {
    const result = replaceCurrentUrlTokens(
      'Follow ___CURRENT_URL___ to continue.',
      'https://docs.sentry.io/platforms/javascript/?source=agent#setup'
    );

    expect(result).toBe(
      'Follow https://docs.sentry.io/platforms/javascript/ to continue.'
    );
  });
});
