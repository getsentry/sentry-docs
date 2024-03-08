import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import {s} from 'hastscript';
import yaml from 'js-yaml';
import {serialize} from 'next-mdx-remote/serialize';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismDiff from 'rehype-prism-diff';
import rehypePrismPlus from 'rehype-prism-plus';
// Rehype packages
import rehypeSlug from 'rehype-slug';
// Remark packages
import remarkGfm from 'remark-gfm';

import getAppRegistry from './build/appRegistry';
import getPackageRegistry from './build/packageRegistry';
import {apiCategories} from './build/resolveOpenAPI';
import getAllFilesRecursively from './files';
import {remarkCodeTabs} from './remark-code-tabs.mjs';
import {remarkCodeTitles} from './remark-code-title.mjs';
import remarkComponentSpacing from './remark-component-spacing';
import {remarkExtractFrontmatter} from './remark-extract-frontmatter.mjs';
import remarkTocHeadings from './remark-toc-headings';
import remarkVariables from './remark-variables';

const root = process.cwd();

function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, '');
}
const isSupported = (
  frontmatter: any,
  platformName: string,
  guideName?: string
): boolean => {
  const canonical = guideName ? `${platformName}.${guideName}` : platformName;
  if (frontmatter.supported && frontmatter.supported.length) {
    if (frontmatter.supported.indexOf(canonical) !== -1) {
      return true;
    }
    if (frontmatter.supported.indexOf(platformName) === -1) {
      return false;
    }
  }
  if (
    frontmatter.notSupported &&
    (frontmatter.notSupported.indexOf(canonical) !== -1 ||
      frontmatter.notSupported.indexOf(platformName) !== -1)
  ) {
    return false;
  }
  return true;
};

export type FrontMatter = {[key: string]: any};

let getDocsFrontMatterCache: Promise<FrontMatter[]> | undefined;

export function getDocsFrontMatter(): Promise<FrontMatter[]> {
  if (getDocsFrontMatterCache) {
    return getDocsFrontMatterCache;
  }
  getDocsFrontMatterCache = getDocsFrontMatterUncached();
  return getDocsFrontMatterCache;
}

async function getDocsFrontMatterUncached(): Promise<FrontMatter[]> {
  const frontMatter = getAllFilesFrontMatter();

  const categories = await apiCategories();
  categories.forEach(category => {
    frontMatter.push({
      title: category.name,
      slug: `api/${category.slug}`,
    });

    category.apis.forEach(api => {
      frontMatter.push({
        title: api.name,
        slug: `api/${category.slug}/${api.slug}`,
      });
    });
  });

  return frontMatter;
}

export function getAllFilesFrontMatter(folder: string = 'docs'): FrontMatter[] {
  const docsPath = path.join(root, folder);
  const files = getAllFilesRecursively(docsPath);
  const allFrontMatter: FrontMatter[] = [];
  files.forEach(file => {
    const fileName = file.slice(docsPath.length + 1);
    if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
      return;
    }

    if (fileName.indexOf('/common/') !== -1) {
      return;
    }

    const source = fs.readFileSync(file, 'utf8');
    const {data: frontmatter} = matter(source);
    allFrontMatter.push({
      ...frontmatter,
      slug: formatSlug(fileName),
      sourcePath: path.join(folder, fileName),
    });
  });

  if (folder !== 'docs') {
    // We exit early if we're not in the docs folder. We use this for the changelog.
    return allFrontMatter;
  }

  // Add all `common` files in the right place.
  const platformsPath = path.join(docsPath, 'platforms');
  const platformNames = fs
    .readdirSync(platformsPath)
    .filter(p => !fs.statSync(path.join(platformsPath, p)).isFile());
  platformNames.forEach(platformName => {
    let platformFrontmatter: FrontMatter = {};
    const configPath = path.join(platformsPath, platformName, 'config.yml');
    if (fs.existsSync(configPath)) {
      // @ts-ignore
      platformFrontmatter = yaml.load(fs.readFileSync(configPath, 'utf8'));
    }

    const commonPath = path.join(platformsPath, platformName, 'common');
    if (!fs.existsSync(commonPath)) {
      return;
    }

    const commonFileNames = getAllFilesRecursively(commonPath).filter(
      p => path.extname(p) === '.mdx'
    );
    const commonFiles = commonFileNames.map(commonFileName => {
      const source = fs.readFileSync(commonFileName, 'utf8');
      const {data: frontmatter} = matter(source);
      return {commonFileName, frontmatter};
    });

    commonFiles.forEach(f => {
      if (!isSupported(f.frontmatter, platformName)) {
        return;
      }

      const subpath = f.commonFileName.slice(commonPath.length + 1);
      const slug = f.commonFileName.slice(docsPath.length + 1).replace(/\/common\//, '/');
      if (
        !fs.existsSync(path.join(docsPath, slug)) &&
        !fs.existsSync(path.join(docsPath, slug.replace('/index.mdx', '.mdx')))
      ) {
        let frontmatter = f.frontmatter;
        if (subpath === 'index.mdx') {
          frontmatter = {...frontmatter, ...platformFrontmatter};
        }
        allFrontMatter.push({
          ...frontmatter,
          slug: formatSlug(slug),
          sourcePath: 'docs/' + f.commonFileName.slice(docsPath.length + 1),
        });
      }
    });

    const guidesPath = path.join(docsPath, 'platforms', platformName, 'guides');
    let guideNames: string[] = [];
    if (!fs.existsSync(guidesPath)) {
      return;
    }
    guideNames = fs
      .readdirSync(guidesPath)
      .filter(g => !fs.statSync(path.join(guidesPath, g)).isFile());
    guideNames.forEach(guideName => {
      let guideFrontmatter: FrontMatter = {};
      const guideConfigPath = path.join(guidesPath, guideName, 'config.yml');
      if (fs.existsSync(guideConfigPath)) {
        // @ts-ignore
        guideFrontmatter = yaml.load(fs.readFileSync(guideConfigPath, 'utf8'));
      }

      commonFiles.forEach(f => {
        if (!isSupported(f.frontmatter, platformName, guideName)) {
          return;
        }

        const subpath = f.commonFileName.slice(commonPath.length + 1);
        const slug = path.join('platforms', platformName, 'guides', guideName, subpath);
        if (!fs.existsSync(path.join(docsPath, slug))) {
          let frontmatter = f.frontmatter;
          if (subpath === 'index.mdx') {
            frontmatter = {...frontmatter, ...guideFrontmatter};
          }
          allFrontMatter.push({
            ...frontmatter,
            slug: formatSlug(slug),
            sourcePath: 'docs/' + f.commonFileName.slice(docsPath.length + 1),
          });
        }
      });
    });
  });

  return allFrontMatter;
}

export async function getFileBySlug(slug: string) {
  const configPath = path.join(root, slug, 'config.yml');
  let configFrontmatter: {[key: string]: any} | undefined;
  if (fs.existsSync(configPath)) {
    // @ts-ignore
    configFrontmatter = yaml.load(fs.readFileSync(configPath, 'utf8'));
  }

  let mdxPath = path.join(root, `${slug}.mdx`);
  let mdxIndexPath = path.join(root, slug, 'index.mdx');
  let mdPath = path.join(root, `${slug}.md`);
  let mdIndexPath = path.join(root, slug, 'index.md');

  if (
    slug.indexOf('docs/platforms/') === 0 &&
    [mdxPath, mdxIndexPath, mdPath, mdIndexPath].filter(p => fs.existsSync(p)).length ===
      0
  ) {
    // Try the common folder.
    const slugParts = slug.split('/');
    const commonPath = path.join(slugParts.slice(0, 3).join('/'), 'common');
    let commonFilePath: string | undefined;
    if (
      slugParts.length >= 5 &&
      slugParts[1] === 'platforms' &&
      slugParts[3] === 'guides'
    ) {
      commonFilePath = path.join(commonPath, slugParts.slice(5).join('/'));
    } else if (slugParts.length >= 3 && slugParts[1] === 'platforms') {
      commonFilePath = path.join(commonPath, slugParts.slice(3).join('/'));
    }
    if (commonFilePath && fs.existsSync(commonPath)) {
      mdxPath = path.join(root, `${commonFilePath}.mdx`);
      mdxIndexPath = path.join(root, commonFilePath, 'index.mdx');
      mdPath = path.join(root, `${commonFilePath}.md`);
      mdIndexPath = path.join(root, commonFilePath, 'index.md');
    }
  }

  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.existsSync(mdxIndexPath)
      ? fs.readFileSync(mdxIndexPath, 'utf8')
      : fs.existsSync(mdPath)
        ? fs.readFileSync(mdPath, 'utf8')
        : fs.readFileSync(mdIndexPath, 'utf8');

  process.env.ESBUILD_BINARY_PATH = path.join(
    root,
    'node_modules',
    'esbuild',
    'bin',
    'esbuild'
  );

  const toc = [];

  const mdxOptions = {
    remarkPlugins: [
      remarkExtractFrontmatter,
      [remarkTocHeadings, {exportRef: toc}],
      remarkGfm,
      remarkCodeTitles,
      remarkCodeTabs,
      remarkComponentSpacing,
      [
        remarkVariables,
        {
          resolveScopeData: async () => {
            const [apps, packages] = await Promise.all([
              getAppRegistry(),
              getPackageRegistry(),
            ]);

            return {apps, packages};
          },
        },
      ],
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
      // rehypePresetMinify,
    ],
  };

  const mdxSource = await serialize(source, {
    // @ts-expect-error
    mdxOptions,
  });

  let mergedFrontmatter = mdxSource.frontmatter;
  if (configFrontmatter) {
    mergedFrontmatter = {...mdxSource.frontmatter, ...configFrontmatter};
  }

  return {
    source,
    mdxOptions,
    mdxSource,
    toc,
    frontMatter: {
      ...mergedFrontmatter,
      slug,
    },
  };
}
