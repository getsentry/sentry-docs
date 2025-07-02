import matter from 'gray-matter';
import {s} from 'hastscript';
import yaml from 'js-yaml';
import {bundleMDX} from 'mdx-bundler';
import {BinaryLike, createHash} from 'node:crypto';
import {createReadStream, createWriteStream, mkdirSync} from 'node:fs';
import {access, cp, mkdir, opendir, readFile} from 'node:fs/promises';
import path from 'node:path';
// @ts-expect-error ts(2305) -- For some reason "compose" is not recognized in the types
import {compose, Readable} from 'node:stream';
import {json} from 'node:stream/consumers';
import {pipeline} from 'node:stream/promises';
import {
  constants as zlibConstants,
  createBrotliCompress,
  createBrotliDecompress,
} from 'node:zlib';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismDiff from 'rehype-prism-diff';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';
import remarkMdxImages from 'remark-mdx-images';

import getAppRegistry from './build/appRegistry';
import getPackageRegistry from './build/packageRegistry';
import {apiCategories} from './build/resolveOpenAPI';
import getAllFilesRecursively, {limitFunction} from './files';
import remarkDefList from './mdx-deflist';
import rehypeOnboardingLines from './rehype-onboarding-lines';
import rehypeSlug from './rehype-slug.js';
import remarkCodeTabs from './remark-code-tabs';
import remarkCodeTitles from './remark-code-title';
import remarkComponentSpacing from './remark-component-spacing';
import remarkDsnComments from './remark-dsn-comments';
import remarkExtractFrontmatter from './remark-extract-frontmatter';
import remarkFormatCodeBlocks from './remark-format-code';
import remarkImageSize from './remark-image-size';
import remarkTocHeadings, {TocNode} from './remark-toc-headings';
import remarkVariables from './remark-variables';
import {FrontMatter, Platform, PlatformConfig} from './types';
import {isNotNil} from './utils';
import {isVersioned, VERSION_INDICATOR} from './versioning';

type SlugFile = {
  frontMatter: Platform & {slug: string};
  matter: Omit<matter.GrayMatterFile<string>, 'data'> & {
    data: Platform;
  };
  mdxSource: string;
  toc: TocNode[];
};

const root = process.cwd();
// We need to limit this as we have code doing things like Promise.all(allFiles.map(...))
// where `allFiles` is in the order of thousands. This not only slows down the build but
// it also crashes the dynamic pages such as `/platform-redirect` as these run on Vercel
// Functions which looks like AWS Lambda and we get `EMFILE` errors when trying to open
// so many files at once.
const FILE_CONCURRENCY_LIMIT = 200;
const CACHE_COMPRESS_LEVEL = 4;
const CACHE_DIR = path.join(root, '.next', 'cache', 'mdx-bundler');
mkdirSync(CACHE_DIR, {recursive: true});

const md5 = (data: BinaryLike) => createHash('md5').update(data).digest('hex');

async function readCacheFile<T>(file: string): Promise<T> {
  const reader = createReadStream(file);
  const decompressor = createBrotliDecompress();

  return (await json(compose(reader, decompressor))) as T;
}

async function writeCacheFile(file: string, data: string) {
  const bufferData = Buffer.from(data);
  await pipeline(
    Readable.from(bufferData),
    createBrotliCompress({
      chunkSize: 32 * 1024,
      params: {
        [zlibConstants.BROTLI_PARAM_MODE]: zlibConstants.BROTLI_MODE_TEXT,
        [zlibConstants.BROTLI_PARAM_QUALITY]: CACHE_COMPRESS_LEVEL,
        [zlibConstants.BROTLI_PARAM_SIZE_HINT]: bufferData.length,
      },
    }),
    createWriteStream(file)
  );
}

function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, '');
}
const isSupported = (
  frontmatter: FrontMatter,
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

let getDocsFrontMatterCache: Promise<FrontMatter[]> | undefined;

export function getDocsFrontMatter(): Promise<FrontMatter[]> {
  if (!getDocsFrontMatterCache) {
    getDocsFrontMatterCache = getDocsFrontMatterUncached();
  }
  return getDocsFrontMatterCache;
}

/**
 * collect all available versions for a given document path
 */
export const getVersionsFromDoc = (frontMatter: FrontMatter[], docPath: string) => {
  const versions = frontMatter
    .filter(({slug}) => {
      return (
        slug.includes(VERSION_INDICATOR) &&
        slug.split(VERSION_INDICATOR)[0] === docPath.split(VERSION_INDICATOR)[0]
      );
    })
    .map(({slug}) => {
      const segments = slug.split(VERSION_INDICATOR);
      return segments[segments.length - 1];
    });

  // remove duplicates
  return [...new Set(versions)];
};

async function getDocsFrontMatterUncached(): Promise<FrontMatter[]> {
  const frontMatter = await getAllFilesFrontMatter();

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

  // Remove a trailing /index, since that is also removed from the path by Next.
  frontMatter.forEach(fm => {
    const trailingIndex = '/index';
    if (fm.slug.endsWith(trailingIndex)) {
      fm.slug = fm.slug.slice(0, fm.slug.length - trailingIndex.length);
    }

    //  versioned index files get appended to the path (e.g. /path/index__v1 becomes /path__v1)
    const versionedIndexFileIndicator = `${trailingIndex}${VERSION_INDICATOR}`;
    if (fm.slug.includes(versionedIndexFileIndicator)) {
      const segments = fm.slug.split(versionedIndexFileIndicator);
      fm.slug = `${segments[0]}${VERSION_INDICATOR}${segments[1]}`;
    }
  });

  return frontMatter;
}

export async function getDevDocsFrontMatterUncached(): Promise<FrontMatter[]> {
  const folder = 'develop-docs';
  const docsPath = path.join(root, folder);
  const files = await getAllFilesRecursively(docsPath);
  const frontMatters = (
    await Promise.all(
      files.map(
        limitFunction(
          async file => {
            const fileName = file.slice(docsPath.length + 1);
            if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
              return undefined;
            }

            const source = await readFile(file, 'utf8');
            const {data: frontmatter} = matter(source);
            return {
              ...(frontmatter as FrontMatter),
              slug: fileName.replace(/\/index.mdx?$/, '').replace(/\.mdx?$/, ''),
              sourcePath: path.join(folder, fileName),
            };
          },
          {concurrency: FILE_CONCURRENCY_LIMIT}
        )
      )
    )
  ).filter(isNotNil);
  return frontMatters;
}

let getDevDocsFrontMatterCache: Promise<FrontMatter[]> | undefined;

export function getDevDocsFrontMatter(): Promise<FrontMatter[]> {
  if (!getDevDocsFrontMatterCache) {
    getDevDocsFrontMatterCache = getDevDocsFrontMatterUncached();
  }
  return getDevDocsFrontMatterCache;
}

async function getAllFilesFrontMatter(): Promise<FrontMatter[]> {
  const docsPath = path.join(root, 'docs');
  const files = await getAllFilesRecursively(docsPath);
  const allFrontMatter: FrontMatter[] = [];

  await Promise.all(
    files.map(
      limitFunction(
        async file => {
          const fileName = file.slice(docsPath.length + 1);
          if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
            return;
          }

          if (fileName.indexOf('/common/') !== -1) {
            return;
          }

          const source = await readFile(file, 'utf8');
          const {data: frontmatter} = matter(source);
          allFrontMatter.push({
            ...(frontmatter as FrontMatter),
            slug: formatSlug(fileName),
            sourcePath: path.join('docs', fileName),
          });
        },
        {concurrency: FILE_CONCURRENCY_LIMIT}
      )
    )
  );

  // Add all `common` files in the right place.
  const platformsPath = path.join(docsPath, 'platforms');
  for await (const platform of await opendir(platformsPath)) {
    if (platform.isFile()) {
      continue;
    }
    const platformName = platform.name;

    let platformFrontmatter: PlatformConfig = {};
    const configPath = path.join(platformsPath, platformName, 'config.yml');
    try {
      platformFrontmatter = yaml.load(
        await readFile(configPath, 'utf8')
      ) as PlatformConfig;
    } catch (err) {
      // the file may not exist and that's fine, for anything else we throw
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    const commonPath = path.join(platformsPath, platformName, 'common');
    try {
      await access(commonPath);
    } catch (err) {
      continue;
    }

    const commonFileNames: string[] = (await getAllFilesRecursively(commonPath)).filter(
      p => path.extname(p) === '.mdx'
    );

    const commonFiles = await Promise.all(
      commonFileNames.map(
        limitFunction(
          async commonFileName => {
            const source = await readFile(commonFileName, 'utf8');
            const {data: frontmatter} = matter(source);
            return {commonFileName, frontmatter: frontmatter as FrontMatter};
          },
          {concurrency: FILE_CONCURRENCY_LIMIT}
        )
      )
    );

    await Promise.all(
      commonFiles.map(
        limitFunction(
          async f => {
            if (!isSupported(f.frontmatter, platformName)) {
              return;
            }

            const subpath = f.commonFileName.slice(commonPath.length + 1);
            const slug = f.commonFileName
              .slice(docsPath.length + 1)
              .replace(/\/common\//, '/');
            const noFrontMatter = (
              await Promise.allSettled([
                access(path.join(docsPath, slug)),
                access(path.join(docsPath, slug.replace('/index.mdx', '.mdx'))),
              ])
            ).every(r => r.status === 'rejected');
            if (noFrontMatter) {
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
          },
          {concurrency: FILE_CONCURRENCY_LIMIT}
        )
      )
    );

    const guidesPath = path.join(docsPath, 'platforms', platformName, 'guides');
    try {
      await access(guidesPath);
    } catch (err) {
      continue;
    }

    for await (const guide of await opendir(guidesPath)) {
      if (guide.isFile()) {
        continue;
      }
      const guideName = guide.name;

      let guideFrontmatter: FrontMatter | null = null;
      const guideConfigPath = path.join(guidesPath, guideName, 'config.yml');
      try {
        guideFrontmatter = yaml.load(
          await readFile(guideConfigPath, 'utf8')
        ) as FrontMatter;
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }

      await Promise.all(
        commonFiles.map(
          limitFunction(
            async f => {
              if (!isSupported(f.frontmatter, platformName, guideName)) {
                return;
              }

              const subpath = f.commonFileName.slice(commonPath.length + 1);
              const slug = path.join(
                'platforms',
                platformName,
                'guides',
                guideName,
                subpath
              );
              try {
                await access(path.join(docsPath, slug));
                return;
              } catch {
                // pass
              }

              let frontmatter = f.frontmatter;
              if (subpath === 'index.mdx') {
                frontmatter = {...frontmatter, ...guideFrontmatter};
              }
              allFrontMatter.push({
                ...frontmatter,
                slug: formatSlug(slug),
                sourcePath: 'docs/' + f.commonFileName.slice(docsPath.length + 1),
              });
            },
            {concurrency: FILE_CONCURRENCY_LIMIT}
          )
        )
      );
    }
  }
  return allFrontMatter;
}

/**
 *  Generate a file path for versioned content, or return an invalid one if the slug is not versioned
 */
export const getVersionedIndexPath = (
  pathRoot: string,
  slug: string,
  fileExtension: string
) => {
  let versionedSlug = 'does/not/exist.mdx';
  const segments = slug.split(VERSION_INDICATOR);
  if (segments.length === 2) {
    if (segments[1].includes('common')) {
      const segmentWithoutCommon = segments[1].split('/common')[0];
      versionedSlug = `${segments[0]}/common/index${VERSION_INDICATOR}${segmentWithoutCommon}${fileExtension}`;
    } else {
      versionedSlug = `${segments[0]}/index${VERSION_INDICATOR}${segments[1]}${fileExtension}`;
    }
  }

  return path.join(pathRoot, versionedSlug);
};

export const addVersionToFilePath = (filePath: string, version: string) => {
  const parts = filePath.split('.');
  if (parts.length > 1) {
    const extension = parts.pop();
    return `${parts.join('.')}__v${version}.${extension}`;
  }

  // file has no extension
  return `${filePath}__v${version}`;
};

export async function getFileBySlug(slug: string): Promise<SlugFile> {
  // no versioning on a config file
  const configPath = path.join(root, slug.split(VERSION_INDICATOR)[0], 'config.yml');

  let configFrontmatter: PlatformConfig | undefined;
  try {
    configFrontmatter = yaml.load(await readFile(configPath, 'utf8')) as PlatformConfig;
  } catch (err) {
    // If the config file does not exist, we can ignore it.
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  let mdxPath = path.join(root, `${slug}.mdx`);
  let mdxIndexPath = path.join(root, slug, 'index.mdx');
  let versionedMdxIndexPath = getVersionedIndexPath(root, slug, '.mdx');
  let mdPath = path.join(root, `${slug}.md`);
  let mdIndexPath = path.join(root, slug, 'index.md');

  if (
    slug.startsWith('docs/platforms/') &&
    (
      await Promise.allSettled(
        [mdxPath, mdxIndexPath, mdPath, mdIndexPath, versionedMdxIndexPath].map(p =>
          access(p)
        )
      )
    ).every(r => r.status === 'rejected')
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
      versionedMdxIndexPath = getVersionedIndexPath(root, commonFilePath, '.mdx');
    }
    if (commonFilePath) {
      try {
        await access(commonPath);
        mdxPath = path.join(root, `${commonFilePath}.mdx`);
        mdxIndexPath = path.join(root, commonFilePath, 'index.mdx');
        mdPath = path.join(root, `${commonFilePath}.md`);
        mdIndexPath = path.join(root, commonFilePath, 'index.md');
        versionedMdxIndexPath = getVersionedIndexPath(root, commonFilePath, '.mdx');
      } catch (err) {
        // If the common folder does not exist, we can ignore it.
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }
  }

  // check if a versioned index file exists
  if (isVersioned(slug)) {
    try {
      await access(mdxIndexPath);
      mdxIndexPath = addVersionToFilePath(mdxIndexPath, slug.split(VERSION_INDICATOR)[1]);
    } catch (err) {
      // pass, the file does not exist
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  let source: string | undefined = undefined;
  let sourcePath: string | undefined = undefined;
  const sourcePaths = [mdxPath, mdxIndexPath, mdPath, versionedMdxIndexPath, mdIndexPath];
  const errors: Error[] = [];
  for (const p of sourcePaths) {
    try {
      source = await readFile(p, 'utf8');
      sourcePath = p;
      break;
    } catch (e) {
      errors.push(e);
    }
  }
  if (source === undefined || sourcePath === undefined) {
    throw new Error(
      `Failed to find a valid source file for slug "${slug}". Tried:\n${sourcePaths.join('\n')}\nErrors:\n${errors.map(e => e.message).join('\n')}`
    );
  }

  let cacheKey: string | null = null;
  let cacheFile: string | null = null;
  let assetsCacheDir: string | null = null;
  const outdir = path.join(root, 'public', 'mdx-images');
  await mkdir(outdir, {recursive: true});

  if (process.env.CI) {
    cacheKey = md5(source);
    cacheFile = path.join(CACHE_DIR, `${cacheKey}.br`);
    assetsCacheDir = path.join(CACHE_DIR, cacheKey);

    try {
      const [cached, _] = await Promise.all([
        readCacheFile<SlugFile>(cacheFile),
        cp(assetsCacheDir, outdir, {recursive: true}),
      ]);
      return cached;
    } catch (err) {
      if (
        err.code !== 'ENOENT' &&
        err.code !== 'ABORT_ERR' &&
        err.code !== 'Z_BUF_ERROR'
      ) {
        // If cache is corrupted, ignore and proceed
        // eslint-disable-next-line no-console
        console.warn(`Failed to read MDX cache: ${cacheFile}`, err);
      }
    }
  }

  process.env.ESBUILD_BINARY_PATH = path.join(
    root,
    'node_modules',
    'esbuild',
    'bin',
    'esbuild'
  );

  const toc: TocNode[] = [];

  // cwd is how mdx-bundler knows how to resolve relative paths
  const cwd = path.dirname(sourcePath);

  const result = await bundleMDX<Platform>({
    source,
    cwd,
    mdxOptions(options) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, {exportRef: toc}],
        remarkGfm,
        remarkDefList,
        remarkDsnComments,
        remarkFormatCodeBlocks,
        [remarkImageSize, {sourceFolder: cwd, publicFolder: path.join(root, 'public')}],
        remarkMdxImages,
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
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
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
                  d: 'M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z',
                })
              ),
            ],
          },
        ],
        [rehypePrismPlus, {ignoreMissing: true}] as any,
        rehypeOnboardingLines,
        [rehypePrismDiff, {remove: true}] as any,
        rehypePresetMinify,
      ];
      return options;
    },
    esbuildOptions: options => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
        '.png': 'file',
        '.gif': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        // inline svgs
        '.svg': 'dataurl',
      };
      // Set the `outdir` to a public location for this bundle.
      // this is where these images will be copied
      // the reason we use the cache folder when it's
      // enabled is because mdx-images is a dumping ground
      // for all images, so we cannot filter it out only
      // for this specific slug easily
      options.outdir = assetsCacheDir || outdir;

      // Set write to true so that esbuild will output the files.
      options.write = true;

      return options;
    },
  }).catch(e => {
    // eslint-disable-next-line no-console
    console.error('Error occurred during MDX compilation:', e.errors);
    throw e;
  });

  const {code, frontmatter} = result;

  let mergedFrontmatter = frontmatter;
  if (configFrontmatter) {
    mergedFrontmatter = {...frontmatter, ...configFrontmatter};
  }

  const resultObj: SlugFile = {
    matter: result.matter,
    mdxSource: code,
    toc,
    frontMatter: {
      ...mergedFrontmatter,
      slug,
    },
  };

  if (assetsCacheDir && cacheFile) {
    await cp(assetsCacheDir, outdir, {recursive: true});
    writeCacheFile(cacheFile, JSON.stringify(resultObj)).catch(e => {
      // eslint-disable-next-line no-console
      console.warn(`Failed to write MDX cache: ${cacheFile}`, e);
    });
  }

  return resultObj;
}

const fileBySlugCache = new Map<string, Promise<SlugFile>>();

/**
 * Cache the result of {@link getFileBySlug}.
 *
 * This is useful for performance when rendering the same file multiple times.
 */
export function getFileBySlugWithCache(slug: string): Promise<SlugFile> {
  let cached = fileBySlugCache.get(slug);
  if (!cached) {
    cached = getFileBySlug(slug);
    fileBySlugCache.set(slug, cached);
  }

  return cached;
}
