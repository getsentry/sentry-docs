import {describe, expect, test} from 'vitest';

import {DocNode, getCurrentPlatformOrGuide, nodeForPath} from './docTree';

const createRootNode = (): DocNode => ({
  children: [],
  frontmatter: {title: 'Home', slug: 'home'},
  missing: false,
  path: '/',
  slug: '',
  sourcePath: '',
});

const nextjsRoot = createRootNode();
nextjsRoot.children = [
  {
    path: 'platforms',
    slug: 'platforms',
    frontmatter: {title: 'Platforms', slug: 'platforms'},
    children: [
      {
        path: 'javascript',
        slug: 'javascript',
        frontmatter: {title: 'JavaScript', slug: 'javascript'},
        children: [
          {
            path: 'platforms/javascript/guides',
            slug: 'guides',
            frontmatter: {title: 'Guide', slug: 'guide'},
            children: [
              {
                path: 'platforms/javascript/guides/nextjs',
                slug: 'nextjs',
                frontmatter: {title: 'Next.js', slug: 'nextjs'},
                children: [],
                missing: false,
                sourcePath: 'docs/platforms/javascript/guides/nextjs/index.mdx',
              },
            ],
            missing: false,
            sourcePath: 'docs/platforms/javascript/guide/index.mdx',
          },
        ],
        missing: false,
        sourcePath: 'docs/platforms/javascript/index.mdx',
      },
    ],
    missing: false,
    sourcePath: 'docs/platforms/index.mdx',
  },
];

describe('docTree', () => {
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

  describe('getCurrentPlatformOrGuide', () => {
    test('should return undefined if no platform or guide', () => {
      const rootNode = nextjsRoot;
      const node = getCurrentPlatformOrGuide(rootNode, ['/']);
      expect(node).toBeUndefined();
    });

    test('should find current platform', () => {
      const rootNode = nextjsRoot;
      const node = getCurrentPlatformOrGuide(rootNode, ['platforms', 'javascript']);
      expect(node?.name).toBe('javascript');
    });

    test('should find current guide', () => {
      const rootNode = nextjsRoot;
      const node = getCurrentPlatformOrGuide(rootNode, [
        'platforms',
        'javascript',
        'guides',
        'nextjs',
      ]);
      expect(node?.name).toBe('nextjs');
    });

    test('should find current guide from versioned path', () => {
      const rootNode = nextjsRoot;
      const node = getCurrentPlatformOrGuide(rootNode, [
        'platforms',
        'javascript',
        'guides',
        'nextjs__v2',
      ]);
      expect(node?.name).toBe('nextjs');
    });

    test('should find current platform from versioned path', () => {
      const rootNode = nextjsRoot;
      const node = getCurrentPlatformOrGuide(rootNode, ['platforms', 'javascript__v2']);
      expect(node?.name).toBe('javascript');
    });
  });
});
