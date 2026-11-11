import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

import {describe, expect, test} from 'vitest';

import {applyFixes, replaceLinkDestinations, validateFix} from './apply-fixes';

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

  test('does not replace link-shaped values in frontmatter', () => {
    const content = [
      '---',
      'title: "[Metadata](./old/)"',
      '---',
      '',
      '[Rendered](./old/)',
    ].join('\n');

    expect(replaceLinkDestinations(content, fix)).toBe(
      content.replace('[Rendered](./old/)', '[Rendered](/new/)')
    );
  });
});

describe('applyFixes', () => {
  test('atomically applies a valid replacement', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'lint-404-fixes-'));
    const docs = path.join(root, 'docs');
    const file = path.join(docs, 'example.mdx');

    try {
      await mkdir(docs);
      await writeFile(file, '[Link](/old/)\n');

      await applyFixes(
        {
          fixes: [{file: 'docs/example.mdx', oldUrl: '/old/', newUrl: '/new/'}],
        },
        root
      );

      expect(await readFile(file, 'utf8')).toBe('[Link](/new/)\n');
    } finally {
      await rm(root, {recursive: true, force: true});
    }
  });

  test('rejects chained replacements before modifying a file', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'lint-404-fixes-'));
    const docs = path.join(root, 'docs');
    const file = path.join(docs, 'example.mdx');
    const original = '[First](/a/)\n[Second](/b/)\n';

    try {
      await mkdir(docs);
      await writeFile(file, original);

      await expect(
        applyFixes(
          {
            fixes: [
              {file: 'docs/example.mdx', oldUrl: '/a/', newUrl: '/b/'},
              {file: 'docs/example.mdx', oldUrl: '/b/', newUrl: '/c/'},
            ],
          },
          root
        )
      ).rejects.toThrow('Chained link fixes are not allowed');
      expect(await readFile(file, 'utf8')).toBe(original);
    } finally {
      await rm(root, {recursive: true, force: true});
    }
  });
});
