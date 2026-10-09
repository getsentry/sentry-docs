import {describe, expect, it} from 'vitest';

import {
  buildReviewerPlan,
  collectSpecialistReviewers,
  matchesCodeownerPattern,
  parseCommentedCodeowners,
} from './pr-reviewer-assignment.mjs';

const CODEOWNERS = `
# A documentation comment without reviewers
**/vercel.json @getsentry/security
# /docs/platforms/android/ @getsentry/team-mobile-core
# /docs/platforms/native/ @getsentry/product-owners-sdks-native
# /docs/product/explore/session-replay/web @getsentry/replay-sdk-web @getsentry/replay-frontend
# /includes/session-replay-web-report-bug.mdx @getsentry/replay-sdk-web
# /docs/product/sentry-toolbar/ @ryan953
`;

describe('parseCommentedCodeowners', () => {
  it('parses only commented patterns with user or team reviewers', () => {
    expect(parseCommentedCodeowners(CODEOWNERS)).toEqual([
      {
        pattern: '/docs/platforms/android/',
        reviewers: [{type: 'team', organization: 'getsentry', slug: 'team-mobile-core'}],
      },
      {
        pattern: '/docs/platforms/native/',
        reviewers: [
          {
            type: 'team',
            organization: 'getsentry',
            slug: 'product-owners-sdks-native',
          },
        ],
      },
      {
        pattern: '/docs/product/explore/session-replay/web',
        reviewers: [
          {type: 'team', organization: 'getsentry', slug: 'replay-sdk-web'},
          {type: 'team', organization: 'getsentry', slug: 'replay-frontend'},
        ],
      },
      {
        pattern: '/includes/session-replay-web-report-bug.mdx',
        reviewers: [{type: 'team', organization: 'getsentry', slug: 'replay-sdk-web'}],
      },
      {
        pattern: '/docs/product/sentry-toolbar/',
        reviewers: [{type: 'user', login: 'ryan953'}],
      },
    ]);
  });
});

describe('matchesCodeownerPattern', () => {
  it.each([
    ['/docs/platforms/android/', 'docs/platforms/android/index.mdx'],
    [
      '/docs/product/explore/session-replay/web',
      'docs/product/explore/session-replay/web/index.mdx',
    ],
    ['**/README.md', 'docs/platforms/python/README.md'],
    ['README.md', 'docs/README.md'],
    ['apps/', 'deep/apps/file.js'],
    ['**/logs', 'deep/logs/file.txt'],
    ['/docs/*/', 'docs/product/index.mdx'],
    ['docs/*', 'docs/page.mdx'],
    ['*.mdx', 'docs/page.mdx'],
    ['/.github/labels.yml', '.github/labels.yml'],
  ])('matches %s against %s', (pattern, path) => {
    expect(matchesCodeownerPattern(pattern, path)).toBe(true);
  });

  it.each([
    ['/docs/platforms/android/', 'docs/platforms/apple/index.mdx'],
    ['/includes/example.mdx', 'includes/example.mdx.bak'],
    ['docs/*', 'deep/docs/page.mdx'],
    ['foo/bar', 'deep/foo/bar'],
    ['*.mdx', 'docs/page.md'],
    ['/.github/labels.yml', '.github/labels.yaml'],
  ])('does not match %s against %s', (pattern, path) => {
    expect(matchesCodeownerPattern(pattern, path)).toBe(false);
  });
});

describe('collectSpecialistReviewers', () => {
  it('deduplicates reviewers and records matched rules', () => {
    const result = collectSpecialistReviewers(
      CODEOWNERS,
      [
        'docs/product/explore/session-replay/web/index.mdx',
        'includes/session-replay-web-report-bug.mdx',
      ],
      'getsentry'
    );

    expect(result.users).toEqual([]);
    expect(result.teams).toEqual(['replay-frontend', 'replay-sdk-web']);
    expect(result.matchedRules).toHaveLength(2);
  });

  it('matches both sides of renamed files', () => {
    const result = collectSpecialistReviewers(
      CODEOWNERS,
      [
        {
          filename: 'archive/android.mdx',
          previous_filename: 'docs/platforms/android/index.mdx',
        },
      ],
      'getsentry'
    );

    expect(result.teams).toEqual(['team-mobile-core']);
  });

  it('ignores teams from another organization', () => {
    const result = collectSpecialistReviewers(
      '# /docs/ @another-org/docs',
      ['docs/index.mdx'],
      'getsentry'
    );

    expect(result.teams).toEqual([]);
  });
});

describe('buildReviewerPlan', () => {
  it('adds Docs without making it an active CODEOWNERS rule', () => {
    const result = buildReviewerPlan({
      codeowners: CODEOWNERS,
      files: ['docs/platforms/android/index.mdx'],
      repositoryOwner: 'getsentry',
      requestDocsReview: true,
    });

    expect(result.teams).toEqual(['docs', 'team-mobile-core']);
  });

  it('skips existing requests and the pull request author', () => {
    const result = buildReviewerPlan({
      codeowners: CODEOWNERS,
      files: [
        'docs/product/sentry-toolbar/index.mdx',
        'docs/platforms/android/index.mdx',
      ],
      repositoryOwner: 'getsentry',
      requestedTeams: [{slug: 'team-mobile-core'}],
      excludedUsers: ['ryan953'],
      requestDocsReview: true,
    });

    expect(result.users).toEqual([]);
    expect(result.teams).toEqual(['docs']);
  });

  it('can evaluate a body edit without re-requesting specialists', () => {
    const result = buildReviewerPlan({
      codeowners: CODEOWNERS,
      files: ['docs/platforms/android/index.mdx'],
      repositoryOwner: 'getsentry',
      includeSpecialists: false,
      requestDocsReview: true,
    });

    expect(result.teams).toEqual(['docs']);
    expect(result.matchedRules).toEqual([]);
  });
});
