import {describe, expect, test} from 'vitest';

import {
  DocNode,
  getCurrentPlatformOrGuide,
  getNextNode,
  isRootGuidePath,
  isRootPlatformPath,
  nodeForPath,
} from './docTree';
import {FrontMatter} from './types';

const createRootNode = (): DocNode => ({
  children: [],
  frontmatter: {title: 'Home', slug: 'home'},
  missing: false,
  path: '/',
  slug: '',
  sourcePath: '',
});

const createNode = (path: string, title: string, frontmatter?: FrontMatter): DocNode => ({
  children: [],
  frontmatter: {
    title,
    slug: path,
    ...frontmatter,
  },
  missing: false,
  path,
  slug: path,
  sourcePath: 'sourcepath',
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

  describe('getNextNode', () => {
    const rootNode = createRootNode();

    const nodeWithChildren = createNode('a', 'A');
    nodeWithChildren.children = [createNode('a1', 'A1'), createNode('a2', 'A2')];
    nodeWithChildren.children.forEach(child => {
      child.parent = nodeWithChildren;
    });

    rootNode.children = [nodeWithChildren, createNode('b', 'B'), createNode('c', 'C')];
    rootNode.children.forEach(child => {
      child.parent = rootNode;
    });

    test('should return first child for root node', () => {
      const nextNode = getNextNode(rootNode);
      expect(nextNode?.slug).toBe('a');
    });

    test('should return first child for node with children', () => {
      const nextNode = getNextNode(nodeWithChildren);
      expect(nextNode?.slug).toBe('a1');
    });

    test('should return next sibling', () => {
      const nextNode = getNextNode(nodeWithChildren.children[0]);
      expect(nextNode?.slug).toBe('a2');
    });

    test('should return sibling of parent if no siblings available', () => {
      const nextNode = getNextNode(nodeWithChildren.children[1]);
      expect(nextNode?.slug).toBe('b');
    });

    test('should return undefined if no children or siblings', () => {
      const nextNode = getNextNode(createNode('d', 'D'));
      expect(nextNode).toBeUndefined();
    });

    test('should respect sidebar order for sorting', () => {
      const root = createRootNode();
      const a = createNode('a', 'A', {sidebar_order: 2} as FrontMatter);
      const b = createNode('b', 'B', {sidebar_order: 1} as FrontMatter);
      root.children = [a, b];
      root.children.forEach(child => {
        child.parent = root;
      });

      const a1 = createNode('a1', 'A1', {sidebar_order: 2} as FrontMatter);
      const a2 = createNode('a2', 'A2', {sidebar_order: 1} as FrontMatter);
      a.children = [a1, a2];
      a.children.forEach(child => {
        child.parent = a;
      });

      expect(getNextNode(a)?.slug).toBe('a2');
      expect(getNextNode(b)?.slug).toBe('a');
      expect(getNextNode(a1)?.slug).toBeUndefined();
    });

    test('should not return siblings for root platform or guide paths', () => {
      expect(
        getNextNode(createNode('platforms/javascript', 'JavaScript'))
      ).toBeUndefined();
      expect(
        getNextNode(createNode('platforms/javascript/guides/nextjs', 'Next.js'))
      ).toBeUndefined();
    });
  });

  describe('isRootPlatformPath', () => {
    test('should return true for root platform path', () => {
      expect(isRootPlatformPath('platforms/javascript')).toBe(true);
      expect(isRootPlatformPath('platforms/python')).toBe(true);
    });

    test('should return false for non-root platform path', () => {
      expect(isRootPlatformPath('platforms/javascript/guides/nextjs')).toBe(false);
      expect(isRootPlatformPath('platforms/javascript/troubleshooting')).toBe(false);
    });
  });

  describe('isRootGuidePath', () => {
    test('should return true for root guide path', () => {
      expect(isRootGuidePath('platforms/javascript/guides/nextjs')).toBe(true);
      expect(isRootGuidePath('platforms/python/guides/django')).toBe(true);
    });

    test('should return false for non-root guide path', () => {
      expect(isRootGuidePath('platforms/javascript')).toBe(false);
      expect(isRootGuidePath('platforms/javascript/troubleshooting/get-started')).toBe(
        false
      );
      expect(isRootGuidePath('platforms/python/guides/django/installation')).toBe(false);
    });
  });
});
