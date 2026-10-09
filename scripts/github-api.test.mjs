import {describe, expect, it, vi} from 'vitest';

import {createGitHubClient, getGitHubRuntime} from './github-api.mjs';

describe('getGitHubRuntime', () => {
  it('normalizes the shared GitHub runtime configuration', () => {
    expect(
      getGitHubRuntime({
        GH_TOKEN: 'token',
        REPOSITORY: 'getsentry/sentry-docs',
        PR_NUMBER: '123',
      })
    ).toEqual({
      token: 'token',
      repository: 'getsentry/sentry-docs',
      pullRequestNumber: 123,
      apiBase: 'https://api.github.com',
    });
  });

  it.each([
    [{REPOSITORY: 'getsentry/sentry-docs', PR_NUMBER: '1'}, 'GH_TOKEN is required'],
    [
      {GH_TOKEN: 'token', REPOSITORY: 'invalid', PR_NUMBER: '1'},
      'REPOSITORY must use the owner/name format',
    ],
    [
      {GH_TOKEN: 'token', REPOSITORY: 'getsentry/sentry-docs', PR_NUMBER: '0'},
      'PR_NUMBER must be a positive integer',
    ],
  ])('rejects invalid runtime configuration', (environment, message) => {
    expect(() => getGitHubRuntime(environment)).toThrow(message);
  });
});

describe('createGitHubClient', () => {
  it('adds authentication headers and returns JSON', async () => {
    const fetchImplementation = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ok: true}), {status: 200}))
    );
    const {request} = createGitHubClient({
      token: 'secret',
      apiBase: 'https://api.github.test',
      fetchImplementation,
    });

    await expect(request('/resource')).resolves.toEqual({ok: true});
    expect(fetchImplementation).toHaveBeenCalledWith(
      'https://api.github.test/resource',
      expect.objectContaining({
        headers: expect.objectContaining({Authorization: 'Bearer secret'}),
      })
    );
  });

  it('paginates until GitHub returns fewer than 100 items', async () => {
    const fetchImplementation = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(Array.from({length: 100}, (_, index) => index)), {
          status: 200,
        })
      )
      .mockResolvedValueOnce(new Response(JSON.stringify([100]), {status: 200}));
    const {paginate} = createGitHubClient({
      token: 'secret',
      apiBase: 'https://api.github.test',
      fetchImplementation,
    });

    await expect(paginate('/resource')).resolves.toHaveLength(101);
    expect(fetchImplementation).toHaveBeenCalledTimes(2);
  });

  it('exposes the HTTP status on API errors', async () => {
    const {request} = createGitHubClient({
      token: 'secret',
      apiBase: 'https://api.github.test',
      fetchImplementation: () =>
        Promise.resolve(
          new Response(JSON.stringify({message: 'Not Found'}), {status: 404})
        ),
    });

    await expect(request('/missing')).rejects.toMatchObject({status: 404});
  });

  it('includes GitHub validation details in API errors', async () => {
    const {request} = createGitHubClient({
      token: 'secret',
      apiBase: 'https://api.github.test',
      fetchImplementation: () =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              message: 'Validation Failed',
              errors: [{resource: 'PullRequest', code: 'unprocessable'}],
            }),
            {status: 422}
          )
        ),
    });

    await expect(request('/invalid')).rejects.toThrow('PullRequest');
  });
});
