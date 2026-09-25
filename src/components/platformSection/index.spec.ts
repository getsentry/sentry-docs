import {describe, expect, it, vi} from 'vitest';

import {DocNode, getGuide, getPlatform} from '../../docTree';
import {isPlatformSupported} from '.';

vi.mock('sentry-docs/serverContext', () => ({serverContext: vi.fn()}));

function node(
  slug: string,
  children: DocNode[] = [],
  frontmatter: Partial<DocNode['frontmatter']> = {}
): DocNode {
  return {
    slug,
    path: slug,
    children,
    missing: false,
    frontmatter: {title: slug, slug, ...frontmatter},
  };
}

function tree(fallbackGuide?: string, nodeFallbackGuide?: string) {
  return node('', [
    node('platforms', [
      node('javascript', [
        node('guides', [
          node('express', [], {fallbackGuide}),
          node('node', [], {fallbackGuide: nodeFallbackGuide}),
        ]),
      ]),
      node('python', [node('guides', [node('django')])]),
    ]),
  ]);
}

describe('PlatformSection support', () => {
  it.each(['python.django', 'python.missing'])(
    'rejects cross-platform fallback %s whether the target exists or not',
    fallbackGuide => {
      const root = tree(fallbackGuide);
      const guide = getGuide(root, 'javascript', 'express')!;

      expect(() => isPlatformSupported(root, guide, ['javascript'])).toThrow(
        `Invalid fallbackGuide "${fallbackGuide}": expected a guide on platform "javascript".`
      );
    }
  );

  it('rejects a cross-platform fallback deeper in the chain', () => {
    const root = tree('javascript.node', 'python.django');
    const guide = getGuide(root, 'javascript', 'express')!;

    expect(() => isPlatformSupported(root, guide, ['javascript'])).toThrow(
      'Invalid fallbackGuide "python.django": expected a guide on platform "javascript".'
    );
  });

  it.each([undefined, 'javascript.node', 'javascript.missing'])(
    'keeps base-platform sections separate from guides with fallback %s',
    fallbackGuide => {
      const root = tree(fallbackGuide);
      const platform = getPlatform(root, 'javascript')!;
      const guide = getGuide(root, 'javascript', 'express')!;

      // Used as a complementary pair by getting-started and Replay prerequisites.
      expect(isPlatformSupported(root, platform, ['javascript'])).toBe(true);
      expect(isPlatformSupported(root, platform, [], ['javascript'])).toBe(false);
      expect(isPlatformSupported(root, guide, ['javascript'])).toBe(false);
      expect(isPlatformSupported(root, guide, [], ['javascript'])).toBe(true);
    }
  );

  it('inherits explicit platform fallbacks for platforms', () => {
    const root = tree();
    root.children[0].children.push(
      node('electron', [], {fallbackPlatform: 'javascript'})
    );
    const platform = getPlatform(root, 'electron')!;

    expect(isPlatformSupported(root, platform, ['javascript'])).toBe(true);
    expect(isPlatformSupported(root, platform, [], ['javascript'])).toBe(false);
    expect(isPlatformSupported(root, platform, ['electron'], ['javascript'])).toBe(true);
  });

  it('follows recursive guide fallbacks without adding the parent platform', () => {
    const root = tree('javascript.node', 'javascript.runtime');
    const guides = root.children[0].children[0].children[0];
    guides.children.push(node('runtime'));
    const guide = getGuide(root, 'javascript', 'express')!;

    expect(isPlatformSupported(root, guide, ['javascript.runtime'])).toBe(true);
    expect(isPlatformSupported(root, guide, [], ['javascript.runtime'])).toBe(false);
    expect(isPlatformSupported(root, guide, ['javascript'])).toBe(false);
    expect(isPlatformSupported(root, guide, [], ['javascript'])).toBe(true);
  });

  it('stops cyclic guide fallbacks without adding the parent platform', () => {
    const root = tree('javascript.node', 'javascript.express');
    const guide = getGuide(root, 'javascript', 'express')!;

    expect(isPlatformSupported(root, guide, ['javascript.node'])).toBe(true);
    expect(isPlatformSupported(root, guide, ['javascript'])).toBe(false);
    expect(isPlatformSupported(root, guide, [], ['javascript'])).toBe(true);
  });

  it('retains guide overrides for same-platform fallbacks', () => {
    const root = tree('javascript.node');
    const guide = getGuide(root, 'javascript', 'express')!;

    expect(isPlatformSupported(root, guide, ['javascript.node'])).toBe(true);
    expect(isPlatformSupported(root, guide, [], ['javascript.node'])).toBe(false);
    expect(
      isPlatformSupported(root, guide, ['javascript.express'], ['javascript.node'])
    ).toBe(true);
  });
});
