import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import yaml from 'js-yaml';

import type {FrontMatter, PlatformConfig} from './types';
import {isVersioned} from './versioning';

type GuideConfig = Partial<FrontMatter> & PlatformConfig;

async function readIndexFrontmatter(guidePath: string): Promise<GuideConfig> {
  try {
    const source = await readFile(path.join(guidePath, 'index.mdx'), 'utf8');
    return matter(source).data as GuideConfig;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    return {};
  }
}

async function readYamlConfig(guidePath: string): Promise<GuideConfig> {
  try {
    return yaml.load(
      await readFile(path.join(guidePath, 'config.yml'), 'utf8')
    ) as GuideConfig;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    return {};
  }
}

/** Read and merge guide configuration, with config.yml taking precedence. */
export async function readGuideConfig(guidePath: string): Promise<GuideConfig> {
  const [indexFrontmatter, yamlConfig] = await Promise.all([
    readIndexFrontmatter(guidePath),
    readYamlConfig(guidePath),
  ]);
  return {...indexFrontmatter, ...yamlConfig};
}

/** Whether a guide should inherit pages from the parent platform's common tree. */
export function shouldInheritCommonContent(
  config: Pick<PlatformConfig, 'inheritCommonContent'> | null | undefined
): boolean {
  return config?.inheritCommonContent !== false;
}

export type GuideEntry = {
  config: GuideConfig;
  /** The guide folder relative to `guides/`, for example `node` or `node/nextjs`. */
  dir: string;
  /** The guide name in keys and `supported` lists, for example `nextjs`. */
  name: string;
};

async function listDirectories(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath, {withFileTypes: true});
  return entries.filter(entry => !entry.isFile()).map(entry => entry.name);
}

/**
 * List the guides in a `guides/` folder, including the guides nested one level
 * deep (folders whose `index.mdx` sets `nestedGuide: true`).
 */
export async function listGuides(guidesPath: string): Promise<GuideEntry[]> {
  const guideNames = await listDirectories(guidesPath);
  const entries = await Promise.all(
    guideNames.map(async name => {
      const guidePath = path.join(guidesPath, name);
      const [config, childNames] = await Promise.all([
        readGuideConfig(guidePath),
        listDirectories(guidePath),
      ]);
      const children = await Promise.all(
        childNames.map(async childName => ({
          config: await readGuideConfig(path.join(guidePath, childName)),
          dir: `${name}/${childName}`,
          name: childName,
        }))
      );
      return [{config, dir: name, name}, ...children.filter(c => c.config.nestedGuide)];
    })
  );
  return entries.flat();
}

/**
 * The pages a guide renders from the guide in its `inheritPagesFrom` folder, as
 * pairs of the source file and the target file path. Pages that the guide has as
 * its own file and versioned pages are left out.
 */
export function getInheritedGuidePages(
  existingFiles: Set<string>,
  guidesPath: string,
  guide: GuideEntry
): Array<{sourceFile: string; targetFile: string}> {
  if (!guide.config.inheritPagesFrom) {
    return [];
  }
  const sourceDir = path.join(guidesPath, guide.config.inheritPagesFrom) + path.sep;
  const targetDir = path.join(guidesPath, guide.dir);
  const pages: Array<{sourceFile: string; targetFile: string}> = [];
  for (const sourceFile of existingFiles) {
    if (!sourceFile.startsWith(sourceDir) || !/\.mdx?$/.test(sourceFile)) {
      continue;
    }
    const subpath = sourceFile.slice(sourceDir.length);
    const targetFile = path.join(targetDir, subpath);
    if (!isVersioned(subpath) && !existingFiles.has(targetFile)) {
      pages.push({sourceFile, targetFile});
    }
  }
  return pages;
}
