export type Framework = {
  /** Guide slug, e.g. `express` for `/platforms/javascript/guides/express/`. */
  key: string;
  title: string;
};

const EXPRESS: Framework = {key: 'express', title: 'Express'};
const FASTIFY: Framework = {key: 'fastify', title: 'Fastify'};
const KOA: Framework = {key: 'koa', title: 'Koa'};
const HAPI: Framework = {key: 'hapi', title: 'Hapi'};

/** A framework with its own Sentry SDK. The selector opens its guide instead of swapping snippets. */
export type FrameworkGuide = {
  /** Platform icon key, e.g. `javascript-astro`. */
  icon: string;
  title: string;
  url: string;
};

/**
 * `slug` is the page path below `/platforms/javascript/guides/`. The icon defaults to the
 * one of the guide in the first segment of `slug`.
 */
const guide = (
  title: string,
  slug: string,
  icon = `javascript-${slug.split('/')[0]}`
): FrameworkGuide => ({
  icon,
  title,
  url: `/platforms/javascript/guides/${slug}/`,
});

export type Runtime = {
  /** Frameworks selectable on the runtime's getting started page. */
  frameworks: Framework[];
  /** Frameworks with their own Sentry SDK that the selector links to. */
  frameworkGuides?: FrameworkGuide[];
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
    frameworkGuides: [
      guide('Astro', 'astro'),
      guide('Hono', 'hono'),
      guide('NestJS', 'nestjs'),
      guide('Next.js', 'nextjs'),
      guide('Nitro', 'nitro'),
      guide('Nuxt', 'nuxt'),
      guide('React Router', 'react-router'),
      guide('Remix', 'remix'),
      guide('SolidStart', 'solidstart'),
      guide('SvelteKit', 'sveltekit'),
      guide('TanStack Start', 'tanstackstart-react'),
    ],
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
    frameworkGuides: [guide('Elysia', 'elysia'), guide('Hono', 'hono')],
    includePaths: ['getting-started-verify-issues-tracing'],
  },
  deno: {
    title: 'Deno',
    frameworks: [EXPRESS, FASTIFY, KOA, HAPI],
    frameworkGuides: [guide('Hono', 'hono')],
    includePaths: ['getting-started-verify-issues-tracing'],
  },
  cloudflare: {
    title: 'Cloudflare Workers',
    frameworks: [],
    frameworkGuides: [
      guide('Astro', 'astro/cloudflare'),
      guide('Hono', 'hono/cloudflare'),
      guide(
        'Hydrogen',
        'cloudflare/frameworks/hydrogen-react-router',
        'javascript-hydrogen'
      ),
      guide('Next.js', 'nextjs/cloudflare'),
      guide('Nuxt', 'nuxt/cloudflare'),
      guide('Remix', 'remix/cloudflare'),
      guide('SvelteKit', 'sveltekit/cloudflare'),
      guide('TanStack Start', 'tanstackstart-react/cloudflare'),
    ],
    includePaths: [],
  },
};

export const FRAMEWORK_QUERY_PARAM = 'framework';

/** The serialized form of a `<PlatformContent>` include, served by the platform-content API route. */
export type PlatformContentPayload = {
  /** Whether the content differs from what the runtime's page shows without a framework. */
  changed: boolean;
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
