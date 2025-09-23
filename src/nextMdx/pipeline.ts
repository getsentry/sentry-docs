import matter from 'gray-matter';
import path from 'node:path';

import type {CompileOptions} from '@mdx-js/mdx';
import type {PluggableList} from 'unified';

import {createPluginConfig} from './plugins';
import type {
  NextMdxCompiledFile,
  NextMdxCompileOptions,
  NextMdxFrontMatter,
} from './types';

const rootDir = process.cwd();

async function loadCompiler(): Promise<(value: string, options?: CompileOptions) => Promise<any>> {
  const mod = await import('@mdx-js/mdx');
  const compile = (mod as any).compile ?? (mod as any).default;
  if (typeof compile !== 'function') {
    throw new Error('Failed to load @mdx-js/mdx compiler');
  }
  return compile as (value: string, options?: CompileOptions) => Promise<any>;
}

function buildMatter(
  source: string,
  slug: string,
  configFrontmatter?: NextMdxCompileOptions['configFrontmatter']
): {content: string; frontMatter: NextMdxFrontMatter; grayMatter: NextMdxCompiledFile['matter']} {
  const parsed = matter(source);
  const baseFrontMatter = (parsed.data as NextMdxFrontMatter | undefined) ?? ({} as NextMdxFrontMatter);
  const mergedFrontMatter = {
    ...baseFrontMatter,
    ...(configFrontmatter ?? {}),
    slug,
  } as NextMdxFrontMatter;

  const fullMatter: NextMdxCompiledFile['matter'] = {
    ...parsed,
    data: mergedFrontMatter,
  };

  return {
    content: parsed.content,
    frontMatter: mergedFrontMatter,
    grayMatter: fullMatter,
  };
}

export async function compileWithNextMdx(
  options: NextMdxCompileOptions
): Promise<NextMdxCompiledFile> {
  const {source, slug, sourcePath, configFrontmatter} = options;

  const {content, frontMatter, grayMatter} = buildMatter(source, slug, configFrontmatter);

  const toc: NextMdxCompiledFile['toc'] = [];

  const cwd = path.dirname(sourcePath);
  const {remarkPlugins, rehypePlugins} = await createPluginConfig({
    cwd,
    frontMatter,
    root: rootDir,
    toc,
  });

  const compile = await loadCompiler();
  const file = await compile(content, {
    remarkPlugins: remarkPlugins as PluggableList,
    rehypePlugins: rehypePlugins as PluggableList,
    development: process.env.NODE_ENV !== 'production',
    providerImportSource: '@mdx-js/react',
    outputFormat: 'function-body',
    jsx: true,
  } satisfies CompileOptions);

  const mdxSource = String(file.value ?? file);

  return {
    frontMatter,
    matter: grayMatter,
    mdxSource,
    toc,
  };
}
