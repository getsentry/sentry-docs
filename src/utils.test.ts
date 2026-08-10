import {describe, expect, it} from 'vitest';

import {ensureTrailingSlash} from './utils';

describe('ensureTrailingSlash', () => {
  it('adds a trailing slash to a plain path', () => {
    expect(ensureTrailingSlash('/platforms/java/migration/7.x-to-8.0')).toBe(
      '/platforms/java/migration/7.x-to-8.0/'
    );
  });

  it('does not double-slash a path that already has one', () => {
    expect(ensureTrailingSlash('/platforms/java/migration/7.x-to-8.0/')).toBe(
      '/platforms/java/migration/7.x-to-8.0/'
    );
  });

  it('leaves the root path unchanged', () => {
    expect(ensureTrailingSlash('/')).toBe('/');
  });

  it('preserves a hash fragment', () => {
    expect(
      ensureTrailingSlash('/platforms/java/configuration/options#sendClientReports')
    ).toBe('/platforms/java/configuration/options/#sendClientReports');
  });

  it('preserves a hash fragment on a path that already has a trailing slash', () => {
    expect(
      ensureTrailingSlash('/platforms/java/configuration/options/#sendClientReports')
    ).toBe('/platforms/java/configuration/options/#sendClientReports');
  });

  it('preserves a query string', () => {
    expect(ensureTrailingSlash('/search?q=hello')).toBe('/search/?q=hello');
  });

  it('preserves both query string and hash', () => {
    expect(ensureTrailingSlash('/search?q=hello#results')).toBe(
      '/search/?q=hello#results'
    );
  });

  it('handles a hash before a query string', () => {
    expect(ensureTrailingSlash('/page#section?unexpected=true')).toBe(
      '/page/#section?unexpected=true'
    );
  });

  it('handles an empty string', () => {
    expect(ensureTrailingSlash('')).toBe('');
  });

  it('handles a single segment without leading slash', () => {
    expect(ensureTrailingSlash('page')).toBe('page/');
  });
});
