/**
 * Guide keys per platform that the platform selector and the platform grid list first,
 * in this order, under the "Runtimes" title. The other guides of the platform follow under "Frameworks and more".
 */
export const RUNTIME_GUIDE_KEYS: Record<string, string[]> = {
  javascript: [
    'javascript',
    'javascript.node',
    'javascript.bun',
    'javascript.deno',
    'javascript.cloudflare',
  ],
};

const isRuntimeGuide = (platformKey: string, guideKey: string) =>
  RUNTIME_GUIDE_KEYS[platformKey]?.includes(guideKey) ?? false;

/**
 * Returns the guides with the platform's runtime guides first, in the order of
 * `RUNTIME_GUIDE_KEYS`, followed by the other guides in their original order.
 */
export function sortRuntimesFirst<T extends {key: string}>(
  platformKey: string,
  guides: T[]
): T[] {
  const runtimeKeys = RUNTIME_GUIDE_KEYS[platformKey];
  if (!runtimeKeys) {
    return guides;
  }
  const runtimes = runtimeKeys.flatMap(key => guides.filter(g => g.key === key));
  return [...runtimes, ...guides.filter(g => !runtimeKeys.includes(g.key))];
}

/**
 * Returns the group title to show above `guides[index]`, or `undefined` if the guide
 * doesn't start a group. Expects the guides in the order of `sortRuntimesFirst`.
 */
export function guideGroupTitle(
  platformKey: string,
  guides: Array<{key: string}>,
  index: number
): string | undefined {
  const isRuntime = isRuntimeGuide(platformKey, guides[index].key);
  if (index === 0) {
    return isRuntime ? 'Runtimes' : undefined;
  }
  const followsRuntime = isRuntimeGuide(platformKey, guides[index - 1].key);
  return !isRuntime && followsRuntime ? 'Frameworks and more' : undefined;
}
