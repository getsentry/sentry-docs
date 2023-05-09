/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import fs from 'fs';

import * as matter from 'gray-matter';
import yaml from 'js-yaml';

const frontmatterConfig = new Set([
  'title',
  'caseStyle',
  'supportLevel',
  'sdk',
  'fallbackPlatform',
  'categories',
  'aliases',
]);

const shareableConfig = new Set(['caseStyle', 'supportLevel', 'sdk', 'categories']);

const DEFAULTS = {
  caseStyle: 'canonical',
  supportLevel: 'production',
};

type Config = {
  aliases?: string[];
  caseStyle?: string;
  categories?: string[];
  fallbackPlatform?: string;
  sdk?: string;
  supportLevel?: string;
  title?: string;
};

export type Platform = Config & {
  guides: Guide[];
  key: string;
  name: string;
  path: string;
  url: string;
};

export type Guide = Config & {
  fallbackPlatform: string;
  key: string;
  name: string;
  path: string;
  platform: string;
  url: string;
};

const parseConfigFrontmatter = (path: string) => {
  const {data: frontmatter} = matter.read(path);
  return Object.fromEntries(
    Object.entries(frontmatter).filter(([key]) => frontmatterConfig.has(key))
  );
};

const parseConfig = async (path: string): Promise<Config> => {
  let config = {};
  try {
    config = await parseConfigFrontmatter(`${path}/index.mdx`);
  } catch (err) {
    // Do nothing
  }

  try {
    const fp = fs.readFileSync(`${path}/config.yml`, 'utf8');
    Object.assign(config, yaml.safeLoad(fp));
  } catch (err) {
    // Do nothing
  }
  return config;
};

const fetchGuideList = async (
  platformName: string,
  defaultConfig: Config
): Promise<Guide[]> => {
  const path = `src/platforms/${platformName}/guides`;
  const results = [];
  let dir;
  try {
    dir = fs.opendirSync(path);
  } catch (err) {
    return results;
  }
  for await (const dirent of dir) {
    if (dirent.isDirectory() && dirent.name !== 'common') {
      results.push({
        fallbackPlatform: platformName,
        ...DEFAULTS,
        ...defaultConfig,
        ...(await parseConfig(`${path}/${dirent.name}`)),
        key: `${platformName}.${dirent.name}`,
        platform: platformName,
        name: dirent.name,
        path: `${path}/${dirent.name}`,
        url: `/platforms/${platformName}/guides/${dirent.name}/`,
      });
    }
  }
  return results;
};

const fetchPlatformList = async (path: string): Promise<Platform[]> => {
  const results: Platform[] = [];
  const dir = fs.opendirSync(path);
  for await (const dirent of dir) {
    if (dirent.isDirectory() && dirent.name !== 'common') {
      const config = await parseConfig(`${path}/${dirent.name}`);
      const defaultConfig = Object.fromEntries(
        Object.entries(config).filter(([key]) => shareableConfig.has(key))
      );
      results.push({
        ...DEFAULTS,
        ...config,
        key: dirent.name,
        name: dirent.name,
        path: `${path}/${dirent.name}`,
        url: `/platforms/${dirent.name}/`,
        guides: (await fetchGuideList(dirent.name, defaultConfig)).sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      });
    }
  }
  // fill in based on fallbackPlatform
  results.forEach(platform => {
    fillFallback(platform, results);
    platform.guides.forEach(guide => {
      fillFallback(guide, results);
    });
  });

  return results;
};

const fillFallback = (config: Platform | Guide, results: (Platform | Guide)[]) => {
  if (config.fallbackPlatform) {
    const fallback = results.find(p => p.name === config.fallbackPlatform);
    if (!fallback) {
      throw new Error(`Unable to find fallbackPlatform: ${config.fallbackPlatform}`);
    }
    const defaultConfig = Object.fromEntries(
      Object.entries(fallback).filter(([key]) => shareableConfig.has(key))
    );
    Object.assign(config, {...defaultConfig, ...config});
  }
};

export default class PlatformRegistry {
  platforms: Platform[];
  path: string;
  _keyMap: {[key: string]: Platform | Guide};

  constructor(path = 'src/platforms') {
    this.platforms = [];
    this.path = path;
    this._keyMap = {};
  }

  async init() {
    this.platforms = await fetchPlatformList(this.path);
    this.platforms.forEach(platform => {
      this._keyMap[platform.key] = platform;
      platform.guides.forEach(guide => {
        this._keyMap[guide.key] = guide;
      });
    });
  }

  get(key): Platform | Guide | null {
    return this._keyMap[key] || null;
  }
}
