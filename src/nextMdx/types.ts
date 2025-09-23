import type matter from 'gray-matter';

import type {TocNode} from '../remark-toc-headings';
import type {Platform, PlatformConfig} from '../types';

export type NextMdxFrontMatter = Platform & {slug: string};

export type NextMdxCompiledFile = {
  frontMatter: NextMdxFrontMatter;
  matter: Omit<matter.GrayMatterFile<string>, 'data'> & {
    data: Platform;
  };
  mdxSource: string;
  toc: TocNode[];
};

export type NextMdxCompileOptions = {
  slug: string;
  source: string;
  sourcePath: string;
  configFrontmatter?: PlatformConfig;
};
