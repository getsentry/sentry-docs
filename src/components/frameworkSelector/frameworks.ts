export type Framework = {
  /** Guide slug, e.g. `express` for `/platforms/javascript/guides/express/`. */
  key: string;
  title: string;
};

/** Frameworks selectable on the Node.js getting started page. */
export const NODE_FRAMEWORKS: Framework[] = [
  {key: 'express', title: 'Express'},
  {key: 'fastify', title: 'Fastify'},
  {key: 'koa', title: 'Koa'},
  {key: 'hapi', title: 'Hapi'},
];

/**
 * `<PlatformContent switchable />` include paths on the Node.js getting started page.
 * Each one is pre-built per framework as a static JSON file that the page loads on demand.
 */
export const SWITCHABLE_INCLUDE_PATHS = [
  'getting-started-prerequisites',
  'getting-started-install',
  'getting-started-config',
  'getting-started-capture-errors',
  'getting-started-sourcemaps-short-version',
  'getting-started-data-collection',
  'getting-started-verify',
];

export const FRAMEWORK_QUERY_PARAM = 'framework';

/** The serialized form of a `<PlatformContent>` include, served by the platform-content API route. */
export type PlatformContentPayload = {
  /** Compiled MDX of the resolved include, or `null` if the guide has no content for it. */
  code: string | null;
  /** Compiled MDX of nested `<Include name="...">` files, keyed by name. */
  includes: Record<string, string>;
  /** Compiled MDX of nested `<PlatformContent includePath="...">` files, keyed by include path. */
  platformContents: Record<string, string | null>;
};

export function platformContentUrl(platform: string, guide: string, includePath: string) {
  return `/api/platform-content/${platform}/${guide}/${includePath}/`;
}
