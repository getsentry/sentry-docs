import matter from 'gray-matter';
import yaml from 'js-yaml';
import {opendir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {limitFunction} from 'p-limit';

import {apiCategories} from './build/resolveOpenAPI';
import getAllFilesRecursively from './files';
import {FrontMatter, PlatformConfig} from './types';
import {isNotNil} from './utils';
import {VERSION_INDICATOR} from './versioning';

const root = process.cwd();
// We need to limit this as we have code doing things like Promise.all(allFiles.map(...))
// where `allFiles` is in the order of thousands. This not only slows down the build but
// it also crashes the dynamic pages such as `/platform-redirect` as these run on Vercel
// Functions which looks like AWS Lambda and we get `EMFILE` errors when trying to open
// so many files at once.
const FILE_CONCURRENCY_LIMIT = 200;

const formatSlug = (slug: string): string => slug.replace(/\.(mdx|md)$/, '');

const isSupported = (
  frontmatter: FrontMatter,
  platformName: string,
  guideName?: string
): boolean => {
  const canonical = guideName ? `${platformName}.${guideName}` : platformName;
  if (frontmatter.supported && frontmatter.supported.length) {
    if (frontmatter.supported.includes(canonical)) {
      return true;
    }
    if (!frontmatter.supported.includes(platformName)) {
      return false;
    }
  }
  if (
    frontmatter.notSupported &&
    (frontmatter.notSupported.includes(canonical) ||
      frontmatter.notSupported.includes(platformName))
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

async function getDocsFrontMatterUncached(): Promise<FrontMatter[]> {
  const docsPath = path.join(root, 'docs');
  const files = await getAllFilesRecursively(docsPath);
  const allFrontMatter: FrontMatter[] = [];

  // Create a Set of existing file paths for fast lookups
  const existingFilesSet = new Set(files);

  // First, collect all non-common files
  await Promise.all(
    files.map(
      limitFunction(
        async file => {
          const fileName = file.slice(docsPath.length + 1);
          if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
            return;
          }

          if (fileName.includes('/common/')) {
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

  // Add API documentation pages (categories and endpoints)
  const categories = await apiCategories();
  categories.forEach(category => {
    allFrontMatter.push({
      title: category.name,
      slug: `api/${category.slug}`,
    });

    category.apis.forEach(api => {
      allFrontMatter.push({
        title: api.name,
        slug: `api/${category.slug}/${api.slug}`,
      });
    });
  });

  // Now process all common files for each platform and expand them into platform/guide pages
  const platformsPath = path.join(docsPath, 'platforms');

  // Collect all platform names upfront by fully consuming the async iterator
  const allPlatforms: string[] = [];
  for await (const platform of await opendir(platformsPath)) {
    if (!platform.isFile()) {
      allPlatforms.push(platform.name);
    }
  }

  // Filter to only platforms that have common directories (check against existingFilesSet)
  const platformNames = allPlatforms.filter(platformName => {
    const commonPath = path.join(platformsPath, platformName, 'common');
    // Check if any files in existingFilesSet start with this common path
    // Use path.sep to ensure we only match files inside the 'common' directory
    for (const filePath of existingFilesSet) {
      if (filePath.startsWith(commonPath + path.sep)) return true;
    }
    return false;
  });

  // Batch read all platform config files in parallel
  const platformConfigResults = await Promise.allSettled(
    platformNames.map(platformName => {
      const configPath = path.join(platformsPath, platformName, 'config.yml');
      return readFile(configPath, 'utf8').then(content => ({
        platformName,
        config: yaml.load(content) as PlatformConfig,
      }));
    })
  );

  // Create a map of platform configs
  const platformConfigs = new Map<string, PlatformConfig>();
  platformConfigResults.forEach((result, index) => {
    const platformName = platformNames[index];
    if (result.status === 'fulfilled') {
      platformConfigs.set(platformName, result.value.config);
    } else {
      // If the file doesn't exist, use empty config; for other errors, throw
      const err = result.reason;
      if (err.code !== 'ENOENT') {
        throw err;
      }
      platformConfigs.set(platformName, {});
    }
  });

  // Process each platform
  for (const platformName of platformNames) {
    const platformFrontmatter = platformConfigs.get(platformName) || {};
    const commonPath = path.join(platformsPath, platformName, 'common');

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

    // Add common files for the platform itself (no guide)
    await Promise.all(
      commonFiles.map(
        limitFunction(
          commonFile => {
            if (!isSupported(commonFile.frontmatter, platformName)) {
              return;
            }

            const subpath = commonFile.commonFileName.slice(commonPath.length + 1);
            const slug = commonFile.commonFileName
              .slice(docsPath.length + 1)
              .replace(/\/common\//, '/');
            // Check if the file exists using the pre-computed Set
            const noFrontMatter =
              !existingFilesSet.has(path.join(docsPath, slug)) &&
              !existingFilesSet.has(
                path.join(docsPath, slug.replace('/index.mdx', '.mdx'))
              );
            if (noFrontMatter) {
              let frontmatter = commonFile.frontmatter;
              if (subpath === 'index.mdx') {
                frontmatter = {...frontmatter, ...platformFrontmatter};
              }
              allFrontMatter.push({
                ...frontmatter,
                slug: formatSlug(slug),
                sourcePath:
                  'docs/' + commonFile.commonFileName.slice(docsPath.length + 1),
              });
            }
          },
          {concurrency: FILE_CONCURRENCY_LIMIT}
        )
      )
    );

    // Add common files for each guide under this platform
    const guidesPath = path.join(docsPath, 'platforms', platformName, 'guides');

    // Collect all guide names upfront by fully consuming the async iterator
    let guideNames: string[] = [];
    try {
      const guidesDir = await opendir(guidesPath);
      for await (const guide of guidesDir) {
        if (!guide.isFile()) {
          guideNames.push(guide.name);
        }
      }
    } catch (err) {
      // No guides directory for this platform, skip
      continue;
    }

    // Batch read all guide config files in parallel
    const guideConfigResults = await Promise.allSettled(
      guideNames.map(guideName => {
        const guideConfigPath = path.join(guidesPath, guideName, 'config.yml');
        return readFile(guideConfigPath, 'utf8').then(content => ({
          guideName,
          config: yaml.load(content) as FrontMatter,
        }));
      })
    );

    // Create a map of guide configs
    const guideConfigs = new Map<string, FrontMatter | null>();
    guideConfigResults.forEach((result, index) => {
      const guideName = guideNames[index];
      if (result.status === 'fulfilled') {
        guideConfigs.set(guideName, result.value.config);
      } else {
        // If the file doesn't exist, use null; for other errors, throw
        const err = result.reason;
        if (err.code !== 'ENOENT') {
          throw err;
        }
        guideConfigs.set(guideName, null);
      }
    });

    // Process each guide
    for (const guideName of guideNames) {
      const guideFrontmatter = guideConfigs.get(guideName) || null;

      await Promise.all(
        commonFiles.map(
          limitFunction(
            commonFile => {
              if (!isSupported(commonFile.frontmatter, platformName, guideName)) {
                return;
              }

              const subpath = commonFile.commonFileName.slice(commonPath.length + 1);
              const slug = path.join(
                'platforms',
                platformName,
                'guides',
                guideName,
                subpath
              );
              // Check if file exists using pre-computed Set
              if (existingFilesSet.has(path.join(docsPath, slug))) {
                return;
              }

              let frontmatter = commonFile.frontmatter;
              if (subpath === 'index.mdx') {
                frontmatter = {...frontmatter, ...guideFrontmatter};
              }
              allFrontMatter.push({
                ...frontmatter,
                slug: formatSlug(slug),
                sourcePath:
                  'docs/' + commonFile.commonFileName.slice(docsPath.length + 1),
              });
            },
            {concurrency: FILE_CONCURRENCY_LIMIT}
          )
        )
      );
    }
  }

  // Remove a trailing /index, since that is also removed from the path by Next.
  allFrontMatter.forEach(fm => {
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

  return allFrontMatter;
}

let getDevDocsFrontMatterCache: Promise<FrontMatter[]> | undefined;

export function getDevDocsFrontMatter(): Promise<FrontMatter[]> {
  if (!getDevDocsFrontMatterCache) {
    getDevDocsFrontMatterCache = getDevDocsFrontMatterUncached();
  }
  return getDevDocsFrontMatterCache;
}

async function getDevDocsFrontMatterUncached(): Promise<FrontMatter[]> {
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
