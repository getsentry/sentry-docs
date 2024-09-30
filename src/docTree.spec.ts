import {describe, expect, test} from 'vitest';

import {DocNode, nodeForPath} from './docTree';

const createRootNode = (): DocNode => ({
  children: [],
  frontmatter: {title: 'Home', slug: 'home'},
  missing: false,
  path: '/',
  slug: '',
  sourcePath: '',
});

describe('nodeForPath', () => {
  test('should find versioned index doc', () => {
    const rootNode = createRootNode();
    rootNode.children = [
      {
        children: [],
        frontmatter: {title: 'Guide', slug: 'guide'},
        missing: false,
        path: 'guide',
        slug: 'guide',
        sourcePath: 'docs/guide/index.mdx',
      },
      {
        children: [],
        frontmatter: {title: 'Guide v2', slug: 'guide__v2'},
        missing: false,
        path: 'guide__v2',
        slug: 'guide__v2',
        sourcePath: 'docs/guide/index__v2.mdx',
      },
    ];

    const node = nodeForPath(rootNode, 'guide__v2');
    expect(node?.sourcePath).toBe('docs/guide/index__v2.mdx');
  });
});
