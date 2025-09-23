import {beforeEach, describe, expect, it, vi} from 'vitest';

const {mockAppRegistry, mockPackageRegistry} = vi.hoisted(() => ({
  mockAppRegistry: vi.fn(),
  mockPackageRegistry: vi.fn(),
}));

vi.mock('../build/appRegistry', () => ({
  __esModule: true,
  default: mockAppRegistry,
}));

vi.mock('../build/packageRegistry', () => ({
  __esModule: true,
  default: mockPackageRegistry,
}));

import {compileWithNextMdx} from './pipeline';

describe('compileWithNextMdx', () => {
  beforeEach(() => {
    mockAppRegistry.mockResolvedValue([{slug: 'app'}]);
    mockPackageRegistry.mockResolvedValue({frontend: '1.2.3'});
  });

  it('merges frontmatter, builds toc, resolves template variables, and rewrites assets', async () => {
    const source = `---\ntitle: Example Doc\ndescription: Sample\n---\n
# Getting Started

Hello {{@inject packages.frontend }}!

![Issue breadcrumbs](./img/issue-breadcrumbs.png)`;

    const result = await compileWithNextMdx({
      slug: 'docs/product/issues/issue-details/example',
      source,
      sourcePath: 'docs/product/issues/issue-details/example.mdx',
      configFrontmatter: {
        supportLevel: 'production',
      },
    });

    expect(result.frontMatter.slug).toBe('docs/product/issues/issue-details/example');
    expect(result.frontMatter.title).toBe('Example Doc');
    expect(result.frontMatter.supportLevel).toBe('production');

    expect(result.matter.data.slug).toBe('docs/product/issues/issue-details/example');

    expect(result.toc).toEqual([
      expect.objectContaining({
        value: 'Getting Started',
        url: '#getting-started',
        depth: 1,
      }),
    ]);

    expect(result.mdxSource).toContain('Getting Started');
    expect(result.mdxSource).toContain('Hello 1.2.3!');
    expect(result.mdxSource).toContain(
      '/mdx-images/docs/product/issues/issue-details/img/issue-breadcrumbs.png#'
    );
  });
});
