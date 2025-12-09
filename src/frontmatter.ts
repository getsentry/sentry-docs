import matter from 'gray-matter';
import yaml from 'js-yaml';
import {access, opendir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {limitFunction} from 'p-limit';

import {apiCategories} from './build/resolveOpenAPI';
import getAllFilesRecursively from './files';
import {FrontMatter, PlatformConfig} from './types';
import {isNotNil} from './utils';

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

async function getDocsFrontMatterUncached(): Promise<FrontMatter[]> {
  const docsPath = path.join(root, 'docs');
  const files = await getAllFilesRecursively(docsPath);
  const allFrontMatter: FrontMatter[] = [];

  // First, collect all non-common files
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

    // Add common files for the platform itself (no guide)
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

    // Add common files for each guide under this platform
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

  // Remove a trailing /index, since that is also removed from the path by Next.
  allFrontMatter.forEach(fm => {
    const trailingIndex = '/index';
    if (fm.slug.endsWith(trailingIndex)) {
      fm.slug = fm.slug.slice(0, fm.slug.length - trailingIndex.length);
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
