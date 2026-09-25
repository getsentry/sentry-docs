import type {PlatformCategory} from './types';

export type SupportConfig = {
  notSupported?: string[] | null;
  notSupportedCategories?: PlatformCategory[] | null;
  supported?: string[] | null;
  supportedCategories?: PlatformCategory[] | null;
};

/** Resolve support rules from the most specific guide to its fallbacks. */
export function isPlatformSupported(
  platformKeys: string[],
  supportConfig: SupportConfig,
  categories: PlatformCategory[] = []
): boolean {
  const supported = supportConfig.supported ?? [];
  const notSupported = supportConfig.notSupported ?? [];
  const supportedCategories = supportConfig.supportedCategories ?? [];
  const notSupportedCategories = supportConfig.notSupportedCategories ?? [];

  const [currentPlatformKey, ...fallbackKeys] = platformKeys;
  if (currentPlatformKey && supported.includes(currentPlatformKey)) {
    return true;
  }
  if (currentPlatformKey && notSupported.includes(currentPlatformKey)) {
    return false;
  }

  if (notSupportedCategories.some(category => categories.includes(category))) {
    return false;
  }

  for (const platformKey of fallbackKeys) {
    if (supported.includes(platformKey)) {
      return true;
    }
    if (notSupported.includes(platformKey)) {
      return false;
    }
  }

  if (supportedCategories.some(category => categories.includes(category))) {
    return true;
  }

  return supported.length === 0 && supportedCategories.length === 0;
}

/** Page expansion only has guide configs for the current platform. */
export function getFallbackGuideName(platform: string, fallbackGuide: string): string {
  const [fallbackPlatform, ...guideParts] = fallbackGuide.split('.');
  if (fallbackPlatform !== platform) {
    throw new Error(
      `Invalid fallbackGuide "${fallbackGuide}": expected a guide on platform "${platform}".`
    );
  }
  return guideParts.join('.');
}

/** Return support keys for a guide while common pages are being expanded. */
export function getGuideSupportKeys(
  platform: string,
  guide: string,
  guideConfigs: Map<string, {fallbackGuide?: string}>
): string[] {
  const result: string[] = [];
  const visited = new Set<string>();
  let currentGuide: string | undefined = guide;

  while (currentGuide) {
    const key = `${platform}.${currentGuide}`;
    if (visited.has(key)) {
      break;
    }

    result.push(key);
    visited.add(key);

    const fallbackGuide = guideConfigs.get(currentGuide)?.fallbackGuide;
    if (!fallbackGuide || visited.has(fallbackGuide)) {
      break;
    }

    currentGuide = getFallbackGuideName(platform, fallbackGuide);
  }

  return [...result, platform];
}
