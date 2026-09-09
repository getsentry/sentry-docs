import {describe, expect, test} from 'vitest';

import {replaceLinkDestinations, validateFix} from './apply-fixes';

describe('validateFix', () => {
  test('accepts internal URL replacements in documentation files', () => {
    expect(() =>
      validateFix({
        file: 'docs/example.mdx',
        oldUrl: './old/',
        newUrl: '/new/',
      })
    ).not.toThrow();
  });

  test.each([
    ['src/example.ts', './old/', '/new/'],
    ['docs/example.mdx', './old/', 'https://example.com/new/'],
    ['docs/example.mdx', './old/', ['java', 'script:alert(1)'].join('')],
    ['docs/example.mdx', './old/', '/new/{dangerous}'],
    ['docs/example.mdx', './old/', '/safe)![x](https://attacker.example/pixel'],
    ['docs/example.mdx', './old/', '//attacker.example/path'],
  ])('rejects an unsafe fix', (file, oldUrl, newUrl) => {
    expect(() => validateFix({file, oldUrl, newUrl})).toThrow();
  });
});

describe('replaceLinkDestinations', () => {
  const fix = {
    file: 'docs/example.mdx',
    oldUrl: './old/',
    newUrl: '/new/',
  };

  test('replaces only recognized Markdown and MDX link destinations', () => {
    const content = [
      '[Markdown](./old/)',
      '<PlatformLink to="./old/">MDX</PlatformLink>',
      'Plain text ./old/',
    ].join('\n');

    expect(replaceLinkDestinations(content, fix)).toBe(
      [
        '[Markdown](/new/)',
        '<PlatformLink to="/new/">MDX</PlatformLink>',
        'Plain text ./old/',
      ].join('\n')
    );
  });

  test('rejects URLs that are not link destinations', () => {
    expect(() => replaceLinkDestinations('Plain text ./old/', fix)).toThrow();
  });

  test('does not replace examples, comments, or images', () => {
    const content = [
      '`[inline](./old/)`',
      '```md',
      '[fenced](./old/)',
      '```',
      '{/* [comment](./old/) */}',
      '![image](./old/)',
      '<PlatformLink to="./old/">real link</PlatformLink>',
    ].join('\n');

    expect(replaceLinkDestinations(content, fix)).toBe(
      content.replace('to="./old/"', 'to="/new/"')
    );
  });
});
