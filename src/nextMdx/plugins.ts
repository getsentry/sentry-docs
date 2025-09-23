import type {PluggableList} from 'unified';

import type {TocNode} from '../remark-toc-headings';
import type {Platform} from '../types';

import {buildRemarkPlugins, buildRehypePlugins} from './preset';

export type PluginConfigArgs = {
  cwd: string;
  frontMatter: Platform;
  root: string;
  toc: TocNode[];
};

type PluginConfig = {
  rehypePlugins: PluggableList;
  remarkPlugins: PluggableList;
};

export function createPluginConfig({
  cwd,
  frontMatter,
  root,
  toc,
}: PluginConfigArgs): PluginConfig {
  const remarkPlugins = buildRemarkPlugins({cwd, frontMatter, root, toc});
  const rehypePlugins = buildRehypePlugins({root});

  return {
    rehypePlugins: rehypePlugins as PluggableList,
    remarkPlugins: remarkPlugins as PluggableList,
  };
}
