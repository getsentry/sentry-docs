import {BinaryLike, createHash, randomUUID} from 'node:crypto';
import {createReadStream, createWriteStream, mkdirSync} from 'node:fs';
import {access, cp, mkdir, readFile, rename, unlink} from 'node:fs/promises';
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

import matter from 'gray-matter';
import {s} from 'hastscript';
import yaml from 'js-yaml';
import {bundleMDX} from 'mdx-bundler';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypePrismDiff from 'rehype-prism-diff';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';
import remarkMdxImages from 'remark-mdx-images';

import getAppRegistry from './build/appRegistry';
import getPackageRegistry from './build/packageRegistry';
import remarkDefList from './mdx-deflist';
import {DocMetrics} from './metrics';
import rehypeOnboardingLines from './rehype-onboarding-lines';
import rehypeSlug from './rehype-slug.js';
import remarkCodeTabs from './remark-code-tabs';
import remarkCodeTitles from './remark-code-title';
import remarkComponentSpacing from './remark-component-spacing';
import remarkExtractFrontmatter from './remark-extract-frontmatter';
import remarkFormatCodeBlocks from './remark-format-code';
import remarkImageProcessing from './remark-image-processing';
import remarkImageResize from './remark-image-resize';
import remarkTocHeadings, {TocNode} from './remark-toc-headings';
import remarkVariables from './remark-variables';
import {Platform, PlatformConfig} from './types';
import {isVersioned, VERSION_INDICATOR} from './versioning';

type SlugFile = {
  frontMatter: Platform & {slug: string};
  matter: Omit<matter.GrayMatterFile<string>, 'data'> & {
    data: Platform;
  };
  mdxSource: string;
  toc: TocNode[];
  firstImage?: string;
};

const root = process.cwd();
const CACHE_COMPRESS_LEVEL = 4;
const CACHE_DIR = path.join(root, '.next', 'cache', 'mdx-bundler');
const SHOULD_CACHE_MDX_BUNDLES =
  !!process.env.CI || (process.env.NODE_ENV === 'production' && !process.env.VERCEL);
if (SHOULD_CACHE_MDX_BUNDLES) {
  mkdirSync(CACHE_DIR, {recursive: true});
}

const md5 = (data: BinaryLike) => createHash('md5').update(data).digest('hex');

// Worker-level registry cache to avoid fetching multiple times per worker
let cachedRegistryHash: Promise<string> | null = null;

/**
 * Fetch registry data and compute its hash, with retry logic and exponential backoff.
 * Retries up to maxRetries times with exponential backoff starting at initialDelayMs.
 */
async function getRegistryHashWithRetry(
  maxRetries = 3,
  initialDelayMs = 1000
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const [apps, packages] = await Promise.all([
        getAppRegistry(),
        getPackageRegistry(),
      ]);
      return md5(JSON.stringify({apps, packages}));
    } catch (err) {
      lastError = err as Error;

      if (attempt < maxRetries) {
        const delay = initialDelayMs * Math.pow(2, attempt);

        console.warn(
          `Failed to fetch registry (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`,
          err
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to fetch registry after all retries');
}

/**
 * Get the registry hash, using cached value if available.
 * This ensures we only fetch the registry once per worker process.
 * If the fetch fails, the error is cached so subsequent calls fail fast.
 */
function getRegistryHash(): Promise<string> {
  if (!cachedRegistryHash) {
    console.info('Fetching registry hash for the first time in this worker');
    cachedRegistryHash = getRegistryHashWithRetry();
  }
  return cachedRegistryHash;
}

async function readCacheFile<T>(file: string): Promise<T> {
  const reader = createReadStream(file);
  const decompressor = createBrotliDecompress();

  return (await json(compose(reader, decompressor))) as T;
}

async function writeCacheFile(file: string, data: string) {
  const tempFile = `${file}.${process.pid}.${randomUUID()}.tmp`;
  const bufferData = Buffer.from(data);

  try {
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
      createWriteStream(tempFile)
    );
    await rename(tempFile, file);
  } catch (err) {
    await unlink(tempFile).catch(() => {});
    throw err;
  }
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
  // Block MDX compilation at Vercel runtime.
  // MDX should only be compiled during CI builds - all pages are statically generated.
  // If this code path is hit at runtime, it means:
  // 1. A 404 page is being accessed (Next.js tries to render before showing not-found)
  // 2. Some edge case in routing is bypassing static generation
  //
  // Without this check, runtime MDX compilation would:
  // - Fetch from release-registry.services.sentry.io (hammering the registry)
  // - Fail with "read-only file system" errors from esbuild
  //
  // See: DOCS-915, DOCS-9H5, DOCS-9N0, DOCS-9HB
  const isVercelRuntime =
    process.env.VERCEL && !process.env.CI && process.env.NODE_ENV !== 'development';

  if (isVercelRuntime) {
    const error = new Error(
      `[MDX Runtime Error] Attempted to compile MDX at Vercel runtime for slug "${slug}". ` +
        `This should not happen - all pages should be pre-built during CI. ` +
        `If you're seeing this error, the requested path may not exist or was not included in generateStaticParams().`
    ) as Error & {code: string};
    error.code = 'MDX_RUNTIME_ERROR';
    throw error;
  }

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
    // Check if we have any non-ENOENT errors (permission, file system errors, etc.)
    const nonEnoentError = errors.find(
      err => err && typeof err === 'object' && 'code' in err && err.code !== 'ENOENT'
    );

    // If there's a non-ENOENT error, throw it directly to preserve the original error
    if (nonEnoentError) {
      throw nonEnoentError;
    }

    // Otherwise, all errors are ENOENT (file not found), so we can safely report as such
    const error = new Error(
      `Failed to find a valid source file for slug "${slug}". Tried:\n${sourcePaths.join('\n')}\nErrors:\n${errors.map(e => e.message).join('\n')}`
    ) as Error & {code: string};
    error.code = 'ENOENT';
    throw error;
  }

  let cacheKey: string | null = null;
  let cacheFile: string | null = null;
  let assetsCacheDir: string | null = null;

  // Always use public/mdx-images during build
  // During runtime (Lambda), this directory is read-only but images are already there from build
  const outdir = path.join(root, 'public', 'mdx-images');

  try {
    await mkdir(outdir, {recursive: true});
  } catch {
    // If we can't create the directory (e.g., read-only filesystem),
    // continue anyway - images should already exist from build time
  }

  // Detect if file contains content that depends on the Release Registry
  // If it does, we include the registry hash in the cache key so the cache
  // is invalidated when the registry changes.
  const dependsOnRegistry =
    source.includes('@inject') ||
    source.includes('<PlatformSDKPackageName') ||
    source.includes('<LambdaLayerDetail') ||
    source.includes('<GradleUploadInstructions');

  // Check cache in CI and local production builds.
  if (SHOULD_CACHE_MDX_BUNDLES) {
    const sourceHash = md5(source);

    // Include registry hash in cache key for registry-dependent files
    if (dependsOnRegistry) {
      try {
        const registryHash = await getRegistryHash();
        cacheKey = `${sourceHash}-${registryHash}`;

        console.info(
          `Using registry-aware cache for ${sourcePath} (registry hash: ${registryHash.slice(0, 8)}...)`
        );
      } catch (err) {
        // If we can't get registry hash, skip cache for this file

        console.warn(
          `Failed to get registry hash for ${sourcePath}, skipping cache:`,
          err
        );
        cacheKey = null;
      }
    } else {
      cacheKey = sourceHash;
    }

    if (cacheKey) {
      cacheFile = path.join(CACHE_DIR, `${cacheKey}.br`);
      assetsCacheDir = path.join(CACHE_DIR, cacheKey);

      try {
        // Time only the cache read operation, not the asset copy
        const cacheStartTime = Date.now();
        const cached = await readCacheFile<SlugFile>(cacheFile);
        const cacheReadDuration = Date.now() - cacheStartTime;

        // Track cache hit metrics immediately after cache read
        if (typeof window === 'undefined') {
          const fileSizeKb = Buffer.byteLength(source, 'utf8') / 1024;
          const hasImages =
            source.includes('.png') ||
            source.includes('.jpg') ||
            source.includes('.jpeg') ||
            source.includes('.svg') ||
            source.includes('.gif');

          DocMetrics.mdxCompile(cacheReadDuration, {
            cached: true,
            file_size_kb: Math.round(fileSizeKb),
            has_images: hasImages,
            slug_prefix: slug.split('/')[0],
          });
        }

        // Copy assets (wait for completion before returning)
        await cp(assetsCacheDir, outdir, {recursive: true});

        return cached;
      } catch (err) {
        if (
          err.code !== 'ENOENT' &&
          err.code !== 'ABORT_ERR' &&
          err.code !== 'Z_BUF_ERROR'
        ) {
          // If cache is corrupted, ignore and proceed

          console.warn(`Failed to read MDX cache: ${cacheFile}`, err);
        }
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

  // Track MDX compilation timing
  const compilationStart = Date.now();

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
        remarkFormatCodeBlocks,
        [
          remarkImageProcessing,
          {sourceFolder: cwd, publicFolder: path.join(root, 'public')},
        ],
        remarkMdxImages,
        remarkImageResize,
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

      // Set write to false to prevent esbuild from writing files automatically.
      // We'll handle writing manually to gracefully handle read-only filesystems (e.g., Lambda runtime)
      // In local dev, we need write=true to avoid images being embedded as binary data
      options.write =
        process.env.NODE_ENV === 'development' || !!process.env.CI || !process.env.VERCEL;

      return options;
    },
  }).catch(e => {
    console.error('Error occurred during MDX compilation:', e.errors);
    throw e;
  });

  // Track MDX compilation metrics for cache miss (server-side only)
  const compilationDuration = Date.now() - compilationStart;
  if (typeof window === 'undefined') {
    const fileSizeKb = Buffer.byteLength(source, 'utf8') / 1024;
    const hasImages =
      source.includes('.png') ||
      source.includes('.jpg') ||
      source.includes('.jpeg') ||
      source.includes('.svg') ||
      source.includes('.gif');

    DocMetrics.mdxCompile(compilationDuration, {
      cached: false, // This path only reached on cache miss
      file_size_kb: Math.round(fileSizeKb),
      has_images: hasImages,
      slug_prefix: slug.split('/')[0], // First path segment for grouping
    });
  }

  // Manually write output files from esbuild when available
  // This only happens during build time (when filesystem is writable)
  // At runtime (Lambda), files already exist from build time

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

  if (assetsCacheDir && cacheFile && cacheKey) {
    try {
      await cp(assetsCacheDir, outdir, {recursive: true});
    } catch {
      // If copy fails (e.g., on read-only filesystem), continue anyway
      // Images should already exist from build time
    }
    writeCacheFile(cacheFile, JSON.stringify(resultObj)).catch(e => {
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
export const getFileBySlugWithCache: (slug: string) => Promise<SlugFile> =
  process.env.NODE_ENV === 'development'
    ? getFileBySlug
    : (slug: string) => {
        let cached = fileBySlugCache.get(slug);
        if (!cached) {
          cached = getFileBySlug(slug);
          fileBySlugCache.set(slug, cached);
        }
        return cached;
      };
