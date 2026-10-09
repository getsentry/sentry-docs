import {describe, expect, it} from 'vitest';

import {findIssuesInSource, isExempt} from './lint-code-link-literals';

const lint = (src: string) => findIssuesInSource(src, 'src/test.tsx');

describe('isExempt', () => {
  it('exempts paths that already have a trailing slash', () => {
    expect(isExempt('/product/issues/')).toBe(true);
  });

  it('does not exempt a normal page path', () => {
    expect(isExempt('/product/issues')).toBe(false);
  });

  it('exempts the REST API, Next internals and asset routes', () => {
    expect(isExempt('/api/0/projects')).toBe(true);
    expect(isExempt('/_next/static')).toBe(true);
    expect(isExempt('/og-images/platforms-php')).toBe(true);
  });

  it('exempts versioned pages, which invert the trailing-slash rule', () => {
    expect(isExempt('/platforms/javascript/install/npm__v9.x')).toBe(true);
  });

  it('exempts asset paths by extension', () => {
    expect(isExempt('/img/trace-preview.png')).toBe(true);
  });

  it('exempts single-segment paths, which are usually prefixes being built up', () => {
    expect(isExempt('/platforms')).toBe(true);
    expect(isExempt('/product')).toBe(true);
  });
});

describe('findIssuesInSource', () => {
  it('flags a slash-less path in a JSX attribute', () => {
    const issues = lint('<SmartLink to="/api/auth">auth</SmartLink>');
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({
      line: 1,
      linkPath: '/api/auth',
      suggested: '/api/auth/',
    });
  });

  it('flags a slash-less path in an object literal', () => {
    const issues = lint("  link: '/product/metrics',");
    expect(issues.map(i => i.linkPath)).toEqual(['/product/metrics']);
  });

  it('flags backtick-quoted paths', () => {
    expect(lint('const u = `/product/metrics`;')).toHaveLength(1);
  });

  it('ignores paths that already end in a slash', () => {
    expect(lint("link: '/product/metrics/',")).toHaveLength(0);
  });

  it('ignores external URLs', () => {
    expect(lint("const u = 'https://example.com/page';")).toHaveLength(0);
  });

  // Paths in comments are documentation, not rendered links. Reporting them
  // would invite someone to "fix" prose that is deliberately showing both forms.
  it('ignores paths inside line comments', () => {
    expect(lint('// see /product/logs for details')).toHaveLength(0);
    expect(lint('const a = 1; // "/one/two"')).toHaveLength(0);
  });

  it('ignores paths inside block and JSDoc comments', () => {
    const src = [
      '/**',
      ' * `/product/logs` and `/product/logs/` both become `/product/logs/`.',
      ' */',
      '/* also "/product/metrics" here */',
    ].join('\n');
    expect(lint(src)).toHaveLength(0);
  });

  // JSX comments are `{/* ... */}` and routinely span several lines, whose
  // inner lines look like ordinary code -- so block state has to be tracked
  // rather than matched per line.
  it('ignores paths inside a single-line JSX comment', () => {
    expect(lint('{/* was <Link to="/product/logs"> before */}')).toHaveLength(0);
  });

  it('ignores paths inside a multi-line JSX comment', () => {
    const src = ['{/*', '  <Link to="/product/metrics">metrics</Link>', '*/}'].join('\n');
    expect(lint(src)).toHaveLength(0);
  });

  it('resumes flagging after a block comment closes', () => {
    expect(lint('/* x */ const a = "/one/two";').map(i => i.linkPath)).toEqual([
      '/one/two',
    ]);
    const src = ['{/*', '  "/ignored/path"', '*/}', 'const a = "/one/two";'].join('\n');
    expect(lint(src).map(i => i.linkPath)).toEqual(['/one/two']);
  });

  it('flags code before a block comment opens on the same line', () => {
    expect(lint('const a = "/one/two"; /* "/three/four"').map(i => i.linkPath)).toEqual([
      '/one/two',
    ]);
  });

  it('does not mistake a URL scheme for a line comment', () => {
    expect(
      lint('const u = "https://x.com", p = "/one/two";').map(i => i.linkPath)
    ).toEqual(['/one/two']);
  });

  // `//` inside a string is not a comment delimiter. `config/images.ts` and
  // `imageLightbox/index.tsx` both test for protocol-relative URLs this way,
  // and truncating there would hide any path written later on the line.
  it('does not mistake a `//` inside a string for a line comment', () => {
    expect(
      lint('const u = src.startsWith("//") ? x : "/one/two";').map(i => i.linkPath)
    ).toEqual(['/one/two']);
    expect(lint(`const a = '//cdn', b = '/three/four';`).map(i => i.linkPath)).toEqual([
      '/three/four',
    ]);
  });

  it('does not mistake a `/*` inside a string for a block comment', () => {
    const src = ['const glob = "/*";', 'const a = "/one/two";'].join('\n');
    expect(lint(src).map(i => i.linkPath)).toEqual(['/one/two']);
  });

  it('handles an escaped quote inside a string literal', () => {
    expect(lint(`const a = 'it\\'s', b = '/one/two';`).map(i => i.linkPath)).toEqual([
      '/one/two',
    ]);
  });

  it('honors an inline ignore marker', () => {
    expect(lint("const x = '/product/logs'; // trailing-slash-ignore")).toHaveLength(0);
  });

  it('honors an ignore marker on the preceding line', () => {
    const src = ['// trailing-slash-ignore: compared, not linked', "x === '/a/b';"].join(
      '\n'
    );
    expect(lint(src)).toHaveLength(0);
  });

  it('only exempts the marked line and the one after it', () => {
    const src = [
      '// trailing-slash-ignore',
      "const a = '/one/two';",
      "const b = '/three/four';",
    ].join('\n');
    expect(lint(src).map(i => i.linkPath)).toEqual(['/three/four']);
  });

  it('reports accurate line numbers', () => {
    const src = ['const a = 1;', '', "const b = '/product/metrics';"].join('\n');
    expect(lint(src)[0].line).toBe(3);
  });

  it('finds multiple literals on one line', () => {
    const issues = lint("const a = '/one/two', b = '/three/four';");
    expect(issues.map(i => i.linkPath)).toEqual(['/one/two', '/three/four']);
  });
});
