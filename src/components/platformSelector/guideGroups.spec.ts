import {describe, expect, it} from 'vitest';

import {guideGroupTitle, sortRuntimesFirst} from './guideGroups';

const guides = (...keys: string[]) => keys.map(key => ({key}));
const keys = (list: Array<{key: string}>) => list.map(g => g.key);

describe('sortRuntimesFirst', () => {
  it('lists the runtime guides first, in their configured order', () => {
    const sorted = sortRuntimesFirst(
      'javascript',
      guides(
        'javascript',
        'javascript.angular',
        'javascript.bun',
        'javascript.cloudflare',
        'javascript.deno',
        'javascript.nextjs',
        'javascript.node'
      )
    );
    expect(keys(sorted)).toEqual([
      'javascript',
      'javascript.node',
      'javascript.bun',
      'javascript.deno',
      'javascript.cloudflare',
      'javascript.angular',
      'javascript.nextjs',
    ]);
  });

  it('skips runtime guides that are not in the list', () => {
    const sorted = sortRuntimesFirst(
      'javascript',
      guides('javascript.angular', 'javascript.bun')
    );
    expect(keys(sorted)).toEqual(['javascript.bun', 'javascript.angular']);
  });

  it('keeps the order of platforms without runtime guides', () => {
    const list = guides('python.django', 'python.aiohttp');
    expect(sortRuntimesFirst('python', list)).toBe(list);
  });
});

describe('guideGroupTitle', () => {
  const sorted = guides('javascript', 'javascript.node', 'javascript.angular');

  it('returns "Runtimes" for the first runtime guide', () => {
    expect(guideGroupTitle('javascript', sorted, 0)).toBe('Runtimes');
    expect(guideGroupTitle('javascript', sorted, 1)).toBeUndefined();
  });

  it('returns "Frameworks and more" for the first guide after the runtimes', () => {
    expect(guideGroupTitle('javascript', sorted, 2)).toBe('Frameworks and more');
  });

  it('returns no titles for platforms without runtime guides', () => {
    const list = guides('python.django', 'python.aiohttp');
    expect(guideGroupTitle('python', list, 0)).toBeUndefined();
    expect(guideGroupTitle('python', list, 1)).toBeUndefined();
  });

  it('returns no title for a list that only has other guides', () => {
    expect(
      guideGroupTitle('javascript', guides('javascript.angular'), 0)
    ).toBeUndefined();
  });
});
