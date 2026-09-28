import fs from 'fs';
import os from 'os';
import path from 'path';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {
  findIssuesInContent,
  isExempt,
  lintTrailingSlashes,
  maskInlineCode,
} from './lint-trailing-slashes';

const lint = (content: string) => findIssuesInContent(content, 'docs/test.mdx');

describe('isExempt', () => {
  it('exempts paths that already have a trailing slash', () => {
    expect(isExempt('/product/issues/')).toBe(true);
  });

  it('does not exempt a normal page path', () => {
    expect(isExempt('/product/issues')).toBe(false);
  });

  it('exempts asset paths by file extension', () => {
    expect(isExempt('/pdfs/2026_W9.pdf')).toBe(true);
    expect(isExempt('/og-images/platforms-php.png')).toBe(true);
  });

  it('exempts versioned pages, which invert the trailing-slash rule', () => {
    // These serve 200 without a slash and 308 with one.
    expect(isExempt('/manual-setup__v10.7.0')).toBe(true);
    expect(isExempt('/platforms/javascript/guides/aws-lambda/install/npm__v9.x')).toBe(
      true
    );
  });

  it('exempts non-page routes', () => {
    expect(isExempt('/api/0/projects')).toBe(true);
    expect(isExempt('/_next/static')).toBe(true);
  });
});

describe('maskInlineCode', () => {
  it('blanks inline code while preserving length', () => {
    const line = 'set `path=/foo` here';
    const masked = maskInlineCode(line);
    expect(masked).toHaveLength(line.length);
    expect(masked).not.toContain('/foo');
  });
});

describe('findIssuesInContent', () => {
  it('flags and fixes a markdown link', () => {
    const {issues, fixed} = lint('See [Issues](/product/issues).');
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      line: 1,
      linkPath: '/product/issues',
      suggested: '/product/issues/',
    });
    expect(fixed).toBe('See [Issues](/product/issues/).');
  });

  it('preserves anchors, inserting the slash before the fragment', () => {
    const {issues, fixed} = lint('[CLI](/cli/configuration#configuration-file)');
    expect(issues[0].suggested).toBe('/cli/configuration/#configuration-file');
    expect(fixed).toBe('[CLI](/cli/configuration/#configuration-file)');
  });

  it('preserves markdown link titles', () => {
    const {fixed} = lint('[CLI](/cli/installation "Install")');
    expect(fixed).toBe('[CLI](/cli/installation/ "Install")');
  });

  it('fixes href, to and url attributes', () => {
    const {issues, fixed} = lint(
      '<Link href="/a/b" /><PlatformLink to="/c/d" /><LinkWithPlatformIcon url="/e/f" />'
    );
    expect(issues).toHaveLength(3);
    expect(fixed).toBe(
      '<Link href="/a/b/" /><PlatformLink to="/c/d/" /><LinkWithPlatformIcon url="/e/f/" />'
    );
  });

  it('handles single-quoted attributes', () => {
    const {fixed} = lint("<Link href='/a/b' />");
    expect(fixed).toBe("<Link href='/a/b/' />");
  });

  it('leaves attributes that hold filesystem paths or config values alone', () => {
    const content =
      '<Include includePath="/foo/bar" /><Config path="/etc/thing" endpoint="/v1/x" />';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('ignores links inside fenced code blocks', () => {
    const content = ['```js', 'fetch("/api/thing");', '```'].join('\n');
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('resumes linting after a fenced block closes', () => {
    const content = ['```', 'href="/in/code"', '```', '[Real](/real/link)'].join('\n');
    const {issues} = lint(content);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({line: 4, linkPath: '/real/link'});
  });

  it('ignores links inside inline code spans', () => {
    const content = 'Use `[x](/not/a/link)` literally.';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('leaves a path that already ends in a slash alone when a query follows', () => {
    // Regression: the slash belongs on the path, not the query. Appending one
    // to the end of the whole string corrupts the query value.
    const content = '[x](/platform-redirect/?next=%2Ftracing%2F)';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('inserts the slash before the query string', () => {
    const {issues, fixed} = lint('[x](/platform-redirect?next=/tracing/)');
    expect(issues[0].suggested).toBe('/platform-redirect/?next=/tracing/');
    expect(fixed).toBe('[x](/platform-redirect/?next=/tracing/)');
  });

  it('handles a query and a fragment together', () => {
    const {fixed} = lint('[x](/a/b?c=1#d)');
    expect(fixed).toBe('[x](/a/b/?c=1#d)');
  });

  it('handles query strings in attributes', () => {
    const content = '<Link href="/platform-redirect/?next=%2Fx%2F" />';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('honors an inline ignore marker on the same line', () => {
    const content = 'See [x](/foo) {/* trailing-slash-ignore */}';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('honors an ignore marker on the preceding line', () => {
    const content = ['{/* trailing-slash-ignore */}', 'See [x](/foo).'].join('\n');
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('only exempts the marked line and the one after it', () => {
    const content = [
      '{/* trailing-slash-ignore */}',
      '[a](/one)',
      '[b](/two)',
      '[c](/three)',
    ].join('\n');
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(2);
    expect(issues.map(i => i.linkPath)).toEqual(['/two', '/three']);
    // The exempted link is preserved exactly.
    expect(fixed.split('\n')[1]).toBe('[a](/one)');
  });

  it('honors the marker in an HTML comment too', () => {
    const content = ['<!-- trailing-slash-ignore -->', '[a](/one)'].join('\n');
    expect(lint(content).issues).toHaveLength(0);
  });

  it('leaves external links untouched', () => {
    const content = [
      '[Docs](https://example.com/page)',
      '[Insecure](http://example.com/page)',
      '[Mail](mailto:someone@example.com)',
      '[Proto](//cdn.example.com/lib)',
      '[Anchor](#section)',
    ].join('\n');
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  // Relative links resolve in the browser against the current page, so a
  // missing slash is still a 308 -- they matter as much as absolute ones.
  it('fixes parent-relative links', () => {
    const {issues, fixed} = lint('[use tags](../tags) instead.');
    expect(issues[0]).toMatchObject({linkPath: '../tags', suggested: '../tags/'});
    expect(fixed).toBe('[use tags](../tags/) instead.');
  });

  it('fixes deeper parent-relative links with anchors', () => {
    const {fixed} = lint('[x](../integrations/event-loop-block#setup)');
    expect(fixed).toBe('[x](../integrations/event-loop-block/#setup)');
  });

  it('fixes same-directory relative links', () => {
    const {fixed} = lint('[x](./sibling)');
    expect(fixed).toBe('[x](./sibling/)');
  });

  it('fixes bare relative links', () => {
    const {fixed} = lint('[x](troubleshooting)');
    expect(fixed).toBe('[x](troubleshooting/)');
  });

  it('fixes relative links in attributes', () => {
    const {fixed} = lint('<PlatformLink to="../tags">Tags</PlatformLink>');
    expect(fixed).toBe('<PlatformLink to="../tags/">Tags</PlatformLink>');
  });

  it('leaves relative links that already end in a slash alone', () => {
    const content = '[a](../tags/) [b](./sibling/) [c](bare/)';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('leaves relative asset and versioned paths alone', () => {
    const content = '[img](../img/x.png) [ver](../manual-setup__v10.7.0)';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('leaves angle-bracket autolinks containing parentheses alone', () => {
    // Regression: a bare-relative match used to swallow `<https://...main(`
    // and appending a slash corrupted the URL.
    const content =
      '[`main()`](<https://developer.apple.com/documentation/swiftui/app/main(_:)>)';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('leaves angle-bracket destinations alone generally', () => {
    const content = '[glob](<https://en.wikipedia.org/wiki/Glob_(programming)>)';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('leaves an empty link target alone', () => {
    const content = '[x]()';
    const {issues, fixed} = lint(content);
    expect(issues).toHaveLength(0);
    expect(fixed).toBe(content);
  });

  it('fixes multiple links on one line without corrupting offsets', () => {
    const {issues, fixed} = lint('[a](/one) then [b](/two) then [c](/three)');
    expect(issues).toHaveLength(3);
    expect(fixed).toBe('[a](/one/) then [b](/two/) then [c](/three/)');
  });

  it('is idempotent', () => {
    const once = lint('[a](/one) [b](/two)').fixed;
    const twice = lint(once);
    expect(twice.issues).toHaveLength(0);
    expect(twice.fixed).toBe(once);
  });

  it('reports accurate line numbers', () => {
    const {issues} = lint(['# Title', '', 'See [x](/a/b).'].join('\n'));
    expect(issues[0].line).toBe(3);
  });
});

describe('lintTrailingSlashes with explicit files', () => {
  // pre-commit passes staged filenames as arguments, so the file list has to
  // be honored (and filtered) rather than always walking the whole repo.
  let tmpRoot: string;
  let cwd: string;

  beforeEach(() => {
    cwd = process.cwd();
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'trailing-slash-'));
    fs.mkdirSync(path.join(tmpRoot, 'docs'), {recursive: true});
    fs.mkdirSync(path.join(tmpRoot, 'src'), {recursive: true});
    process.chdir(tmpRoot);
  });

  afterEach(() => {
    process.chdir(cwd);
    fs.rmSync(tmpRoot, {recursive: true, force: true});
  });

  it('only scans the files it is given', () => {
    fs.writeFileSync('docs/a.mdx', '[a](/one)');
    fs.writeFileSync('docs/b.mdx', '[b](/two)');

    const {issues} = lintTrailingSlashes(false, ['docs/a.mdx']);
    expect(issues).toHaveLength(1);
    expect(issues[0].filePath).toBe('docs/a.mdx');
  });

  it('rewrites files in place when fixing', () => {
    fs.writeFileSync('docs/a.mdx', '[a](/one)');

    lintTrailingSlashes(true, ['docs/a.mdx']);
    expect(fs.readFileSync('docs/a.mdx', 'utf8')).toBe('[a](/one/)');
  });

  it('ignores files outside the content directories', () => {
    fs.writeFileSync('src/a.mdx', '[a](/one)');

    const {issues} = lintTrailingSlashes(false, ['src/a.mdx']);
    expect(issues).toHaveLength(0);
  });

  it('ignores non-markdown files and paths that no longer exist', () => {
    fs.writeFileSync('docs/a.ts', 'const x = "/one";');

    const {issues} = lintTrailingSlashes(false, ['docs/a.ts', 'docs/deleted.mdx']);
    expect(issues).toHaveLength(0);
  });
});
