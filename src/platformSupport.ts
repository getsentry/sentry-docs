export type SupportConfig = {
  notSupported?: string[] | null;
  supported?: string[] | null;
};

/** Resolve support rules from the most specific guide to its fallbacks. */
export function isPlatformSupported(
  platformKeys: string[],
  supportConfig: SupportConfig
): boolean {
  const supported = supportConfig.supported ?? [];
  const notSupported = supportConfig.notSupported ?? [];

  for (const platformKey of platformKeys) {
    if (supported.includes(platformKey)) {
      return true;
    }
    if (notSupported.includes(platformKey)) {
      return false;
    }
  }

  return supported.length === 0;
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

    const [fallbackPlatform, ...fallbackGuideParts] = fallbackGuide.split('.');
    if (fallbackPlatform !== platform) {
      return [...result, fallbackGuide, fallbackPlatform];
    }
    currentGuide = fallbackGuideParts.join('.');
  }

  return [...result, platform];
}
