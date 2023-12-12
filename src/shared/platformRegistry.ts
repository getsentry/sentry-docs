/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import fs from 'fs';

import matter from 'gray-matter';
import yaml from 'js-yaml';

import {
  Platform,
  PlatformCaseStyle,
  PlatformConfig,
  PlatformGuide,
  PlatformSupportLevel,
} from '../types';

/**
 * Common default values that all platform configs will receive (but may be
 * overridden by the actual config)
 */
const CONFIG_DEFAULTS = {
  caseStyle: PlatformCaseStyle.CANONICAL,
  supportLevel: PlatformSupportLevel.PRODUCTION,
};

/**
 * The expected keys to be present within the frontmatter. Keys outside of this
 * list will not be extracted from the frontmatter into the platform config
 * object.
 */
const expectedFrontmatterConfig: Set<string> = new Set([
  'title',
  'caseStyle',
  'supportLevel',
  'sdk',
  'fallbackPlatform',
  'categories',
  'aliases',
]) satisfies Set<keyof PlatformConfig>;

/**
 * The PlatformConfig keys which will be automatically propagated. Used in a
 * few propagation scenarios.
 *
 * Platform -> Guides
 * fallbackPlatform -> Platform
 * fallbackPlatform -> PlatformGuide
 *
 */
const propagatedConfig: Set<string> = new Set([
  'caseStyle',
  'supportLevel',
  'sdk',
  'categories',
]) satisfies Set<keyof PlatformConfig>;

/**
 * Extracts the frontmatter config object of a platform's index.mdx into an
 * object guaranteed to only contain the keys defined in
 * `expectedFrontmatterConfig`.
 */
function parseConfigFrontmatter(path: string) {
  const frontmatter = matter.read(`${path}/index.mdx`).data;

  const parsed = Object.fromEntries(
    Object.entries(frontmatter).filter(([key]) => expectedFrontmatterConfig.has(key))
  );

  return parsed;
}

/**
 * Extracts the config.yml variant of the Platform object.
 *
 * [!!]: Does NOT do validation on the expected keys!
 */
function parseConfigYml(path: string) {
  return yaml.safeLoad(fs.readFileSync(`${path}/config.yml`, 'utf8')) as object;
}

/**
 * Parses and merges the config.yml and index.mdx frontmatter of a platform
 */
function parseConfig(path: string): PlatformConfig | null {
  let config: Record<string, any> = {};

  // Try to load config from frontmatter
  try {
    const frontmatterConfig = parseConfigFrontmatter(path);
    config = {...frontmatterConfig, ...config};
  } catch (err) {
    // Do nothing
  }

  // Try to load config from config.yml
  try {
    const ymlConfig = parseConfigYml(path);
    config = {...ymlConfig, ...config};
  } catch (err) {
    // Do nothing
  }

  // Failed to load config from either source, return null
  if (Object.keys(config).length === 0) {
    return null;
  }

  return config;
}

/**
 * Walks the platform guides directory and produces a list of
 * {@link PlatformGuide}'s
 */
async function loadGuides(path: string, platform: string, defaults: PlatformConfig) {
  const guides: PlatformGuide[] = [];

  const guidePath = `${path}/${platform}/guides`;

  let dirStream: fs.Dir;
  try {
    dirStream = fs.opendirSync(guidePath);
  } catch (err) {
    // No guides for this platform
    return guides;
  }

  for await (const entry of dirStream) {
    if (!entry.isDirectory() || entry.name === 'common') {
      continue;
    }

    const guideConfig = parseConfig(`${guidePath}/${entry.name}`);

    if (guideConfig === null) {
      continue;
    }

    const guide: PlatformGuide = {
      fallbackPlatform: platform,
      ...CONFIG_DEFAULTS,
      ...defaults,
      ...guideConfig,
      key: `${platform}.${entry.name}`,
      platform,
      name: entry.name,
      url: `/platforms/${platform}/guides/${entry.name}/`,
      type: 'guide',
    };

    guides.push(guide);
  }

  return guides;
}

/**
 * Walks the platforms directory and produces a list of {@link Platform}'s
 */
async function loadPlatforms(path: string) {
  const platforms: Platform[] = [];

  const dirStream = fs.opendirSync(path);

  for await (const entry of dirStream) {
    if (!entry.isDirectory() || entry.name === 'common') {
      continue;
    }

    const platformConfig = parseConfig(`${path}/${entry.name}`);

    if (platformConfig === null) {
      continue;
    }

    // Extract the defaults from this PlatformConfig that will be passed down
    // to the each Guide.
    const guideDefaults = Object.fromEntries(
      Object.entries(platformConfig).filter(([key]) => propagatedConfig.has(key))
    );

    const guides = await loadGuides(path, entry.name, guideDefaults);
    const sortedGuides = guides.sort((a, b) => a.name.localeCompare(b.name));

    const platform: Platform = {
      ...CONFIG_DEFAULTS,
      ...platformConfig,
      key: entry.name,
      name: entry.name,
      url: `/platforms/${entry.name}/`,
      guides: sortedGuides,
      type: 'platform',
    };

    platforms.push(platform);
  }

  for (const platform of platforms) {
    // Inherit fallback platform values for this platform
    fillFallback(platform, platforms);

    // Inherit fallback platform values for each guide
    platform.guides.forEach(guide => fillFallback(guide, platforms));
  }

  return platforms;
}

/**
 * When the given config object has a fallbackPlatform, this will ensure the
 * `propagatedConfig` keys are present with their values from the
 * fallbackPlatform.
 *
 * Mutates the provided config object.
 */
function fillFallback(config: Platform | PlatformGuide, platforms: Platform[]) {
  if (!config.fallbackPlatform) {
    return;
  }

  const fallback = platforms.find(p => p.name === config.fallbackPlatform);
  if (!fallback) {
    throw new Error(`Unable to find fallbackPlatform: ${config.fallbackPlatform}`);
  }

  const defaultConfig = Object.fromEntries(
    Object.entries(fallback).filter(([key]) => propagatedConfig.has(key))
  );

  Object.assign(config, {...defaultConfig, ...config});
}

interface BuilderOpts {
  /**
   * The folder containing the platform directory structure.
   *
   * Each folder within the platform directory should contain either a
   * `index.mdx` or a `config.yml`, if both exist the `config.yml` values will
   * take precedence over the `index.mdx`'s frontmatter.
   *
   * Each platform directory may also contain a `guides/` folder, which should
   * have a similar structure to the platforms directory (index.mdx, config.yml)
   */
  path?: string;
}

export interface PlatformRegistry {
  /**
   * A mapping of platform and platform guide keys to their associated Platform
   * and PlatformGuide objects.
   */
  platformGuideMapping: Record<string, Platform | PlatformGuide>;
  /**
   * The list of all available platforms. Platform guides are children of
   * platforms which have them
   */
  platforms: Platform[];
}

/**
 * Constructs the platform registry mapping object.
 */
export async function buildPlatformRegistry({path = 'src/platforms'}: BuilderOpts = {}) {
  const platforms = await loadPlatforms(path);
  const platformGuideMapping: Record<string, Platform | PlatformGuide> = {};

  for (const platform of platforms) {
    platformGuideMapping[platform.key] = platform;

    for (const guide of platform.guides) {
      platformGuideMapping[guide.key] = guide;
    }
  }

  const registry: PlatformRegistry = {
    platforms,
    platformGuideMapping,
  };

  return registry;
}
