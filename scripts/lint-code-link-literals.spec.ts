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
  });

  it('ignores paths inside block and JSDoc comments', () => {
    const src = [
      '/**',
      ' * `/product/logs` and `/product/logs/` both become `/product/logs/`.',
      ' */',
      '/* also /product/metrics here */',
    ].join('\n');
    expect(lint(src)).toHaveLength(0);
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
