export type DedupeMode = 'unique-source' | 'expand-common' | 'all';

export type DedupeResult = {
  skippedCount: number;
  slugsToCheck: string[];
  mode: DedupeMode;
};

/**
 * Platform docs under a platform common/ tree are rendered once per guide.
 * PlatformSection / PlatformLink can change the HTML per render, so checking
 * only the first slug for a shared source misses guide-specific 404s.
 */
export function isPlatformCommonSource(sourcePath: string | null | undefined): boolean {
  if (!sourcePath) {
    return false;
  }
  // Normalize Windows separators just in case.
  const normalized = sourcePath.replace(/\\/g, '/');
  return (
    normalized.includes('/common/') ||
    normalized.startsWith('common/') ||
    // Some trees store paths relative to docs/platforms/<platform>/common/...
    /(^|\/)platforms\/[^/]+\/common\//.test(normalized)
  );
}

export function dedupeSlugsBySource(
  allSlugs: string[],
  sourceMap: Record<string, string | null>,
  mode: DedupeMode = 'expand-common'
): DedupeResult {
  if (mode === 'all') {
    return {skippedCount: 0, slugsToCheck: [...allSlugs], mode};
  }

  const checkedSources = new Set<string>();
  const slugsToCheck: string[] = [];
  let skippedCount = 0;

  for (const slug of allSlugs) {
    const normalizedSlug = slug.replace(/(^\/|\/$)/g, '');
    const sourcePath = sourceMap[normalizedSlug];

    // Always check API-generated pages (no source file).
    if (!sourcePath) {
      slugsToCheck.push(slug);
      continue;
    }

    // Shared platform common sources can render different links per guide.
    if (mode === 'expand-common' && isPlatformCommonSource(sourcePath)) {
      slugsToCheck.push(slug);
      continue;
    }

    if (checkedSources.has(sourcePath)) {
      skippedCount++;
      continue;
    }

    checkedSources.add(sourcePath);
    slugsToCheck.push(slug);
  }

  return {skippedCount, slugsToCheck, mode};
}

export function parseDedupeMode(argv: string[]): DedupeMode {
  if (argv.includes('--skip-deduplication') || argv.includes('--all-pages')) {
    return 'all';
  }
  if (argv.includes('--unique-source')) {
    return 'unique-source';
  }
  // Default (and --expand-common): keep every platform common multi-render.
  return 'expand-common';
}
