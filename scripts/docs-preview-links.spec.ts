import {describe, expect, it} from 'vitest';

import {
  buildSourcePathIndex,
  COMMENT_MARKER,
  createPreviewLinkGroups,
  flattenDocTree,
  getRelevantChangedFiles,
  normalizePreviewUrl,
  renderPreviewComment,
  upsertPreviewComment,
} from './docs-preview-links';

const previewUrl = 'https://sentry-docs-git-branch.vercel.app';

const commonPages = Array.from({length: 12}, (_, index) => ({
  children: [],
  frontmatter: {title: 'Capturing Errors'},
  path:
    index === 0
      ? 'platforms/javascript/usage'
      : `platforms/javascript/guides/guide-${index}/usage`,
  sourcePath: 'docs/platforms/javascript/common/usage/index.mdx',
}));

const docTree = {
  children: [
    {
      children: [
        {
          children: [],
          frontmatter: {title: 'Next.js'},
          path: 'platforms/javascript/guides/nextjs',
          sourcePath: 'docs/platforms/javascript/guides/nextjs/index.mdx',
        },
        ...commonPages,
      ],
      frontmatter: {title: 'JavaScript'},
      path: 'platforms/javascript',
      sourcePath: 'docs/platforms/javascript/index.mdx',
    },
  ],
  frontmatter: {title: 'Home'},
  path: '/',
  sourcePath: '',
};

describe('normalizePreviewUrl', () => {
  it('adds https and removes trailing slashes', () => {
    expect(normalizePreviewUrl('sentry-docs-git-branch.vercel.app/')).toBe(
      'https://sentry-docs-git-branch.vercel.app'
    );
  });
});

describe('createPreviewLinkGroups', () => {
  const sourcePathIndex = buildSourcePathIndex(flattenDocTree(docTree));

  it('maps a direct docs file to its preview URL', () => {
    const groups = createPreviewLinkGroups(
      [
        {
          filename: 'docs/platforms/javascript/guides/nextjs/index.mdx',
          status: 'modified',
        },
      ],
      sourcePathIndex,
      previewUrl
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].pages).toEqual([
      {
        path: 'platforms/javascript/guides/nextjs',
        title: 'Next.js',
        url: `${previewUrl}/platforms/javascript/guides/nextjs/`,
      },
    ]);
  });

  it('maps shared common content to many pages and caps rendered links', () => {
    const groups = createPreviewLinkGroups(
      [
        {
          filename: 'docs/platforms/javascript/common/usage/index.mdx',
          status: 'modified',
        },
      ],
      sourcePathIndex,
      previewUrl
    );
    const comment = renderPreviewComment({
      deploymentSha: 'abcdef1234567890',
      groups,
      previewUrl,
    });

    expect(groups[0].affectedPageCount).toBe(12);
    expect(comment).toContain('affects 12 pages');
    expect(comment).toContain('...and 4 more.');
  });

  it('ignores deleted and non-MDX files', () => {
    expect(
      getRelevantChangedFiles([
        {
          filename: 'docs/platforms/javascript/guides/nextjs/index.mdx',
          status: 'removed',
        },
        {filename: 'src/components/example.tsx', status: 'modified'},
        {filename: 'public/image.png', status: 'modified'},
      ])
    ).toEqual([]);
  });

  it('keeps docs include files but reports no direct preview URL', () => {
    const groups = createPreviewLinkGroups(
      [{filename: 'includes/feature-stage-beta.mdx', status: 'modified'}],
      sourcePathIndex,
      previewUrl
    );
    const comment = renderPreviewComment({
      deploymentSha: 'abcdef1234567890',
      groups,
      previewUrl,
    });

    expect(groups[0].pages).toEqual([]);
    expect(comment).toContain('### No Direct Preview URL Found');
    expect(comment).toContain('`includes/feature-stage-beta.mdx`');
  });
});

describe('upsertPreviewComment', () => {
  it('updates an existing marker comment instead of creating a duplicate', async () => {
    const calls: string[] = [];
    const client = {
      createIssueComment() {
        calls.push('create');
        return Promise.resolve();
      },
      listIssueComments() {
        return Promise.resolve([
          {
            body: `${COMMENT_MARKER}\nold body`,
            id: 123,
            user: {type: 'Bot'},
          },
        ]);
      },
      listPullRequestFiles() {
        return Promise.resolve([]);
      },
      listPullRequestsForCommit() {
        return Promise.resolve([]);
      },
      updateIssueComment(commentId: number, body: string) {
        calls.push(`update:${commentId}:${body}`);
        return Promise.resolve();
      },
    };

    const result = await upsertPreviewComment(client, 42, `${COMMENT_MARKER}\nnew body`);

    expect(result).toBe('updated');
    expect(calls).toEqual([`update:123:${COMMENT_MARKER}\nnew body`]);
  });
});
