import {s} from 'hastscript';
import path from 'node:path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismDiff from 'rehype-prism-diff';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';
import remarkMdxImages from 'remark-mdx-images';
import type {PluggableList} from 'unified';

import getAppRegistry from '../build/appRegistry';
import getPackageRegistry from '../build/packageRegistry';
import remarkDefList from '../mdx-deflist';
import rehypeOnboardingLines from '../rehype-onboarding-lines';
import rehypeSlug from '../rehype-slug.js';
import remarkCodeTabs from '../remark-code-tabs';
import remarkCodeTitles from '../remark-code-title';
import remarkComponentSpacing from '../remark-component-spacing';
import remarkFormatCodeBlocks from '../remark-format-code';
import remarkImageSize from '../remark-image-size';
import remarkTocHeadings, {type TocNode} from '../remark-toc-headings';
import remarkVariables from '../remark-variables';
import type {Platform} from '../types';

const attachFrontmatter = (frontMatter?: Platform) => {
  if (!frontMatter) {
    return null;
  }
  return () => {
    return (_tree: unknown, file: any) => {
      file.data = file.data ?? {};
      file.data.frontmatter = frontMatter;
    };
  };
};

export type BuildRemarkPluginArgs = {
  cwd: string;
  frontMatter?: Platform;
  root: string;
  toc: TocNode[];
};

export type BuildRehypePluginArgs = {
  root: string;
};

export async function resolveScopeData() {
  const [apps, packages] = await Promise.all([getAppRegistry(), getPackageRegistry()]);
  return {apps, packages};
}

export function buildRemarkPlugins({
  cwd,
  frontMatter,
  root,
  toc,
}: BuildRemarkPluginArgs): PluggableList {
  const docDir = path.relative(root, cwd).split(path.sep).join('/');

  const plugins: PluggableList = [
    [remarkTocHeadings, {exportRef: toc}],
    remarkGfm,
    remarkDefList,
    remarkFormatCodeBlocks,
    [
      remarkImageSize,
      {
        docDir,
        publicFolder: path.join(root, 'public'),
        root,
        sourceFolder: cwd,
      },
    ],
    remarkMdxImages,
    remarkCodeTitles,
    remarkCodeTabs,
    remarkComponentSpacing,
    [
      remarkVariables,
      {
        resolveScopeData,
      },
    ],
  ];

  const frontmatterPlugin = attachFrontmatter(frontMatter);
  if (frontmatterPlugin) {
    plugins.unshift(frontmatterPlugin);
  }

  return plugins;
}

export function buildRehypePlugins({root}: BuildRehypePluginArgs): PluggableList {
  return [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'wrap',
        properties: {
          ariaHidden: true,
          tabIndex: -1,
          className: 'autolink-heading',
        },
        content: [
          s(
            'svg.anchorlink.before',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: 16,
              height: 16,
              fill: 'currentColor',
              viewBox: '0 0 24 24',
            },
            s('path', {
              d: 'M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563 1 1 0 0 0 1.602-1.198z',
            })
          ),
        ],
      },
    ],
    [rehypePrismPlus, {ignoreMissing: true}],
    rehypeOnboardingLines,
    [rehypePrismDiff, {remove: true}],
    rehypePresetMinify,
  ];
}
