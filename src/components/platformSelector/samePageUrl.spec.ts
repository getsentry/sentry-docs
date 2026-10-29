import {describe, expect, it} from 'vitest';

import {getSamePageCandidates} from './samePageUrl';

const platform = {
  key: 'python',
  name: 'python',
  type: 'platform' as const,
  url: '/platforms/python/',
  guides: [],
  integrations: [],
};

const guide = {
  key: 'ruby.rails',
  name: 'rails',
  type: 'guide' as const,
  url: '/platforms/ruby/guides/rails/',
  platform: 'ruby',
};

const integration = {
  key: 'python.django',
  name: 'django',
  type: 'integration' as const,
  url: '/platforms/python/integrations/django/',
  platform: 'python',
  icon: 'python-django',
};

describe('getSamePageCandidates', () => {
  it('tries the same page and then its parent for platforms', () => {
    expect(
      getSamePageCandidates(
        platform,
        '/platforms/javascript/guides/express/configuration/options/'
      )
    ).toEqual([
      '/platforms/python/configuration/options/',
      '/platforms/python/configuration/',
    ]);
  });

  it('only tries the same page for guides', () => {
    expect(
      getSamePageCandidates(guide, '/platforms/javascript/configuration/options/')
    ).toEqual(['/platforms/ruby/guides/rails/configuration/options/']);
  });

  it('does not try the parent page when it is the platform root', () => {
    expect(getSamePageCandidates(platform, '/platforms/javascript/usage/')).toEqual([
      '/platforms/python/usage/',
    ]);
  });

  it('uses the unversioned page for versioned pages', () => {
    expect(
      getSamePageCandidates(
        platform,
        '/platforms/javascript/guides/sveltekit/configuration/options__v8.x/'
      )
    ).toEqual([
      '/platforms/python/configuration/options/',
      '/platforms/python/configuration/',
    ]);
    expect(
      getSamePageCandidates(guide, '/platforms/javascript__v7.x/configuration/options/')
    ).toEqual([]);
  });

  it('returns nothing on platform and guide root pages', () => {
    expect(getSamePageCandidates(platform, '/platforms/javascript/')).toEqual([]);
    expect(
      getSamePageCandidates(platform, '/platforms/javascript/guides/express/')
    ).toEqual([]);
  });

  it('returns nothing outside of platform pages', () => {
    expect(getSamePageCandidates(platform, '/product/issues/')).toEqual([]);
  });

  it('returns nothing for integrations', () => {
    expect(
      getSamePageCandidates(integration, '/platforms/javascript/configuration/options/')
    ).toEqual([]);
  });
});
