import {PlatformCategory} from './types';

/**
 * Category predicates shared across components.
 *
 * A platform or guide can carry several categories at once. Meta-frameworks
 * (e.g. Next.js, Remix) run in both the browser and on a server, so they carry
 * both `browser` and `server`. The `browser-only` / `server-only` categories
 * mark platforms that run *exclusively* on one side (something the `browser` /
 * `server` tags alone cannot express) and are primarily consumed from MDX via
 * `<PlatformCategorySection>`.
 */

/** Whether the categories include a server-side runtime (`server` or `serverless`). */
export function hasServerCategory(
  categories?: PlatformCategory[] | null
): boolean {
  return !!categories?.some(c => c === 'server' || c === 'serverless');
}

/** Whether the categories include the browser runtime. */
export function hasBrowserCategory(
  categories?: PlatformCategory[] | null
): boolean {
  return !!categories?.includes('browser');
}
