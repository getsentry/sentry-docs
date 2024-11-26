import {describe, expect, test, vi} from 'vitest';

import {
  DocNode,
  getCurrentPlatformOrGuide,
  getNextNode,
  getPreviousNode,
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
      const platforms = createNode('platforms', 'Platforms');
      const js = createNode('platforms/javascript', 'JavaScript');
      const python = createNode('platforms/python', 'Python');
      platforms.children = [js, python];
      platforms.children.forEach(child => {
        child.parent = platforms;
      });

      const nextjs = createNode('platforms/javascript/guides/nextjs', 'Next.js');
      const angular = createNode('platforms/javascript/guides/angular', 'Angular');
      js.children = [nextjs, angular];
      js.children.forEach(child => {
        child.parent = js;
      });

      expect(getNextNode(js)).toBeUndefined();
      expect(getNextNode(nextjs)).toBeUndefined();
      expect(getNextNode(angular)).toBeUndefined();
    });
  });

  describe('getPreviousNode', () => {
    const root = createRootNode();

    const a = createNode('a', 'A');
    const a1 = createNode('a1', 'A1');
    const a2 = createNode('a2', 'A2');
    a.children = [a1, a2];
    a.children.forEach(child => {
      child.parent = a;
    });

    const b = createNode('b', 'B');
    const c = createNode('c', 'C');
    root.children = [a, b, c];
    root.children.forEach(child => {
      child.parent = root;
    });

    test('should return previous child of parent', () => {
      expect(getPreviousNode(c)).toBe(b);
    });

    test('should return previous sibling if previous sibling has children', () => {
      expect(getPreviousNode(b)).toBe(a);
    });

    test('should return undefined if no children or siblings', () => {
      expect(getPreviousNode(createNode('d', 'D'))).toBeUndefined();
    });

    test('should return parent for first child', () => {
      expect(getPreviousNode(a1)).toBe(a);
    });

    test('should respect sidebar order for sorting', () => {
      const xRoot = createRootNode();
      const xA = createNode('a', 'A', {sidebar_order: 2} as FrontMatter);
      const xB = createNode('b', 'B', {sidebar_order: 1} as FrontMatter);
      xRoot.children = [xA, xB];
      xRoot.children.forEach(child => {
        child.parent = xRoot;
      });

      expect(getPreviousNode(xA)).toBe(xB);
    });

    test('should return root as previous page for root platform or guide paths', () => {
      const platforms = createNode('platforms', 'Platforms');
      const js = createNode('platforms/javascript', 'JavaScript');
      const python = createNode('platforms/python', 'Python');
      platforms.children = [js, python];
      platforms.children.forEach(child => {
        child.parent = platforms;
      });

      const nextjs = createNode('platforms/javascript/guides/nextjs', 'Next.js');
      const angular = createNode('platforms/javascript/guides/angular', 'Angular');
      js.children = [nextjs, angular];
      js.children.forEach(child => {
        child.parent = js;
      });

      expect(getPreviousNode(js)).toBe('root');
      expect(getPreviousNode(python)).toBe('root');
      expect(getPreviousNode(nextjs)).toBe('root');
      expect(getPreviousNode(angular)).toBe('root');
    });

    test('should not return /platforms as previous page', () => {
      const docs = createNode('', 'Docs');
      const platforms = createNode('platforms', 'Platforms');
      const accounts = createNode('accounts', 'Accounts');
      docs.children = [platforms, accounts];
      docs.children.forEach(child => {
        child.parent = docs;
      });

      expect(getPreviousNode(accounts)).toBe(undefined);
    });

    test('should return undefined for getting-started page in developer docs', () => {
      vi.mock('./isDeveloperDocs', () => ({
        isDeveloperDocs: true,
      }));

      const home = createNode('', 'Home');
      const gettingStarted = createNode('getting-started', 'Getting Started');
      home.children = [gettingStarted];
      gettingStarted.parent = home;

      expect(getPreviousNode(gettingStarted)).toBeUndefined();
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
