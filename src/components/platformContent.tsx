import {s} from 'hastscript';
import {MDXRemote} from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismDiff from 'rehype-prism-diff';
import rehypePrismPlus from 'rehype-prism-plus';
// Rehype packages
import rehypeSlug from 'rehype-slug';

// Remark packages
import {getDocsRootNode, getPlatform} from 'sentry-docs/docTree';
import {getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {remarkCodeTabs} from 'sentry-docs/remark-code-tabs.mjs';
import {remarkCodeTitles} from 'sentry-docs/remark-code-title.mjs';
import remarkComponentSpacing from 'sentry-docs/remark-component-spacing';
import {remarkExtractFrontmatter} from 'sentry-docs/remark-extract-frontmatter.mjs';
import remarkTocHeadings from 'sentry-docs/remark-toc-headings';
import {serverContext} from 'sentry-docs/serverContext';

import {Include} from './include';

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  noGuides?: boolean;
  platform?: string;
};

export async function PlatformContent({includePath, platform, noGuides}: Props) {
  const {path} = serverContext();

  if (!platform) {
    if (path.length < 2 || path[0] !== 'platforms') {
      return null;
    }
    platform = path[1];
  }

  let guide: string | undefined;
  if (!noGuides && path.length >= 4 && path[2] === 'guides') {
    guide = `${platform}.${path[3]}`;
  }

  let doc: Awaited<ReturnType<typeof getFileBySlug>> | null = null;
  if (guide) {
    try {
      doc = await getFileBySlug(`platform-includes/${includePath}/${guide}`);
    } catch (e) {
      // It's fine - keep looking.
    }
  }

  if (!doc) {
    try {
      doc = await getFileBySlug(`platform-includes/${includePath}/${platform}`);
    } catch (e) {
      // It's fine - keep looking.
    }
  }

  if (!doc) {
    const rootNode = await getDocsRootNode();
    const platformObject = rootNode && getPlatform(rootNode, platform);
    if (platformObject?.fallbackPlatform) {
      try {
        doc = await getFileBySlug(
          `platform-includes/${includePath}/${platformObject.fallbackPlatform}`
        );
      } catch (e) {
        // It's fine - keep looking.
      }
    }
  }

  if (!doc) {
    try {
      doc = await getFileBySlug(`platform-includes/${includePath}/_default`);
    } catch (e) {
      // Couldn't find anything.
      return null;
    }
  }

  const mdxOptions = {
    remarkPlugins: [
      remarkExtractFrontmatter,
      [remarkTocHeadings, {exportRef: []}],
      // remarkGfm,
      // remarkCodeTitles,
      // remarkCodeTabs,
      remarkComponentSpacing,
      // [
      //   remarkVariables,
      //   {
      //     resolveScopeData: async () => {
      //       const [apps, packages] = await Promise.all([
      //         getAppRegistry(),
      //         getPackageRegistry(),
      //       ]);

      //       return {apps, packages};
      //     },
      //   },
      // ],
    ],
    rehypePlugins: [
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
              'svg.anchor.before',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                width: 16,
                height: 16,
                fill: 'currentColor',
                viewBox: '0 0 24 24',
              },
              s('path', {
                d: 'M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z',
              })
            ),
          ],
        },
      ],
      [rehypePrismPlus, {ignoreMissing: true}],
      [rehypePrismDiff, {remove: true}],
      rehypePresetMinify,
    ],
  };

  return (
    <MDXRemote
      source={doc.source}
      options={{mdxOptions, parseFrontmatter: true}}
      components={mdxComponentsWithWrapper}
    />
  );
}

const mdxComponentsWithWrapper = mdxComponents({Include, PlatformContent});
