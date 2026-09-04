import {readFile} from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import yaml from 'js-yaml';

import type {FrontMatter, PlatformConfig} from './types';

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
