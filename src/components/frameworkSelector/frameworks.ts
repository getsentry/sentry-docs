export type Framework = {
  /** Guide slug, e.g. `express` for `/platforms/javascript/guides/express/`. */
  key: string;
  title: string;
};

const EXPRESS: Framework = {key: 'express', title: 'Express'};
const FASTIFY: Framework = {key: 'fastify', title: 'Fastify'};
const KOA: Framework = {key: 'koa', title: 'Koa'};
const HAPI: Framework = {key: 'hapi', title: 'Hapi'};

export type Runtime = {
  /** Frameworks selectable on the runtime's getting started page. */
  frameworks: Framework[];
  /**
   * `<PlatformContent switchable />` include paths on the runtime's getting started page.
   * Each one is pre-built per framework as a static JSON file that the page loads on demand.
   */
  includePaths: string[];
  title: string;
};

/** Runtime guides (keyed by guide slug) that have a framework selector on their getting started page. */
export const RUNTIMES: Record<string, Runtime> = {
  node: {
    title: 'Node.js',
    frameworks: [EXPRESS, FASTIFY, KOA, HAPI],
    includePaths: [
      'getting-started-prerequisites',
      'getting-started-install',
      'getting-started-config',
      'getting-started-capture-errors',
      'getting-started-sourcemaps-short-version',
      'getting-started-data-collection',
      'getting-started-verify',
    ],
  },
  bun: {
    title: 'Bun',
    frameworks: [EXPRESS, FASTIFY, KOA, HAPI],
    includePaths: ['getting-started-verify-issues-tracing'],
  },
  deno: {
    title: 'Deno',
    frameworks: [EXPRESS, FASTIFY, KOA, HAPI],
    includePaths: ['getting-started-verify-issues-tracing'],
  },
  cloudflare: {
    title: 'Cloudflare',
    // Fastify isn't auto-instrumented on Cloudflare Workers
    frameworks: [EXPRESS, KOA, HAPI],
    includePaths: ['getting-started-verify-issues-tracing'],
  },
};

export const FRAMEWORK_QUERY_PARAM = 'framework';

/** The serialized form of a `<PlatformContent>` include, served by the platform-content API route. */
export type PlatformContentPayload = {
  /** Compiled MDX of the resolved include, or `null` if there is no content for it. */
  code: string | null;
  /** Compiled MDX of nested `<Include name="...">` files, keyed by name. */
  includes: Record<string, string>;
  /** Compiled MDX of nested `<PlatformContent includePath="...">` files, keyed by include path. */
  platformContents: Record<string, string | null>;
};

export function platformContentUrl(
  platform: string,
  runtime: string,
  framework: string,
  includePath: string
) {
  return `/api/platform-content/${platform}/${runtime}/${framework}/${includePath}/`;
}
