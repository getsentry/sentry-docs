import {afterEach, describe, expect, test, vi} from 'vitest';

import {fetchIssueContext, sanitizeIssueSearchQuery} from './github';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('sanitizeIssueSearchQuery', () => {
  test('removes GitHub qualifiers and boolean operators', () => {
    expect(
      sanitizeIssueSearchQuery('tracing label:bug repo:another/repo OR state:open docs')
    ).toBe('tracing docs');
  });

  test('preserves URLs, error codes, and colon-bearing error text', () => {
    expect(
      sanitizeIssueSearchQuery(
        'https://docs.sentry.io/product/logs/ error:401 TypeError:undefined'
      )
    ).toBe('https://docs.sentry.io/product/logs/ error:401 TypeError:undefined');
  });

  test('returns an empty string when the query contains only qualifiers', () => {
    expect(
      sanitizeIssueSearchQuery(
        'label:bug repo:another/repo state:open no:assignee -repo:getsentry/sentry-docs'
      )
    ).toBe('');
  });
});

describe('fetchIssueContext', () => {
  test('uses authoritative closing PRs and deduplicates cross-references', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: string | URL | Request, init?: RequestInit): Promise<Response> => {
        const url = String(input);
        if (url.endsWith('/graphql')) {
          expect(String(init?.body)).toContain('closedByPullRequestsReferences');
          return Promise.resolve(
            Response.json({
              data: {
                repository: {
                  issue: {
                    closedByPullRequestsReferences: {
                      nodes: [
                        {
                          number: 10,
                          title: 'Fix the issue',
                          state: 'OPEN',
                          merged: false,
                          updatedAt: '2026-01-03T00:00:00.000Z',
                          url: 'https://github.com/getsentry/sentry-docs/pull/10',
                          baseRepository: {nameWithOwner: 'getsentry/sentry-docs'},
                        },
                      ],
                    },
                  },
                },
              },
            })
          );
        }
        if (url.includes('/issues/123/comments')) {
          return Promise.resolve(Response.json([]));
        }
        if (url.includes('/issues/123/timeline')) {
          return Promise.resolve(
            Response.json([
              {
                event: 'cross-referenced',
                source: {
                  issue: {
                    pull_request: {
                      url: 'https://api.github.com/repos/getsentry/sentry-docs/pulls/10',
                    },
                  },
                },
              },
            ])
          );
        }
        if (url.endsWith('/pulls/10')) {
          return Promise.resolve(
            Response.json({
              number: 10,
              title: 'Fix the issue',
              state: 'open',
              merged: false,
              updated_at: '2026-01-03T00:00:00.000Z',
              html_url: 'https://github.com/getsentry/sentry-docs/pull/10',
              base: {repo: {full_name: 'getsentry/sentry-docs'}},
            })
          );
        }
        if (url.endsWith('/issues/123')) {
          return Promise.resolve(
            Response.json({
              number: 123,
              title: 'Example issue',
              body: '### Description\n\nExample',
              labels: [{name: 'Docs'}],
              user: {login: 'reporter', type: 'User'},
              author_association: 'NONE',
              state: 'open',
              created_at: '2026-01-01T00:00:00.000Z',
              updated_at: '2026-01-02T00:00:00.000Z',
              html_url: 'https://github.com/getsentry/sentry-docs/issues/123',
            })
          );
        }
        return Promise.reject(new Error(`Unexpected request: ${url}`));
      })
    );

    const context = await fetchIssueContext(123, 'test-token');

    expect(context.linkedPullRequests).toEqual([
      {
        repository: 'getsentry/sentry-docs',
        number: 10,
        title: 'Fix the issue',
        state: 'open',
        merged: false,
        relationship: 'closing',
        updatedAt: '2026-01-03T00:00:00.000Z',
        url: 'https://github.com/getsentry/sentry-docs/pull/10',
      },
    ]);
  });
});
