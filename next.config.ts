import {codecovNextJSWebpackPlugin} from '@codecov/nextjs-webpack-plugin';
import {withSentryConfig} from '@sentry/nextjs';

import {REMOTE_IMAGE_PATTERNS} from './src/config/images';
import {redirects} from './redirects.js';

// Exclude build-time-only dependencies from serverless function bundles to stay under
// Vercel's 250MB limit. These packages are only needed during build to compile MDX and
// optimize assets. We use a local getMDXComponent (src/getMDXComponent.ts) instead of
// mdx-bundler/client to avoid CJS/ESM compatibility issues at runtime.
const sharedExcludes = [
  '**/*.map',
  './.git/**/*',
  './apps/**/*',
  './.next/cache/mdx-bundler/**/*',
  './.next/cache/md-exports/**/*',
  // Heavy build dependencies
  'node_modules/@esbuild/**/*',
  'node_modules/esbuild/**/*',
  'node_modules/@aws-sdk/**/*',
  'node_modules/@google-cloud/**/*',
  'node_modules/prettier/**/*',
  'node_modules/@prettier/**/*',
  'node_modules/sharp/**/*',
  'node_modules/mermaid/**/*',
  // MDX processing dependencies (local getMDXComponent replaces mdx-bundler/client)
  'node_modules/mdx-bundler/**/*',
  'node_modules/rehype-preset-minify/**/*',
  'node_modules/rehype-prism-plus/**/*',
  'node_modules/rehype-prism-diff/**/*',
  'node_modules/remark-gfm/**/*',
  'node_modules/remark-mdx-images/**/*',
  'node_modules/unified/**/*',
  'node_modules/rollup/**/*',
  // ESLint/TypeScript - build-time only
  'node_modules/eslint/**/*',
  'node_modules/eslint-*/**/*',
  'node_modules/@eslint/**/*',
  'node_modules/@typescript-eslint/**/*',
  'node_modules/typescript/**/*',
  // Mermaid dependencies (build-time diagram generation)
  'node_modules/cytoscape/**/*',
  'node_modules/cytoscape-*/**/*',
  // Development/test tools
  'node_modules/vitest/**/*',
  'node_modules/vite/**/*',
  'node_modules/@vitest/**/*',
  // Platform-specific SWC binaries (Vercel uses linux-x64)
  'node_modules/@next/swc-darwin-*/**/*',
  'node_modules/@next/swc-win32-*/**/*',
  'node_modules/@next/swc-linux-arm*/**/*',
];

const outputFileTracingExcludes = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? {'/**/*': [...sharedExcludes, 'docs/**/*']}
  : {
      '/**/*': [...sharedExcludes, 'develop-docs/**/*'],
      '/platform-redirect': [
        '**/*.gif',
        'public/mdx-images/**/*',
        'public/og-images/**/*',
        '**/*.pdf',
      ],
      '\\[\\[\\.\\.\\.path\\]\\]': [
        // Exclude docs to save ~156MB, allow specific files via outputFileTracingIncludes
        'docs/**/*',
        'node_modules/prettier/plugins',
        'node_modules/rollup/dist',
        'public/og-images/**/*',
      ],
      'sitemap.xml': [
        'public/mdx-images/**/*',
        'public/og-images/**/*',
        '**/*.gif',
        '**/*.pdf',
        '**/*.png',
      ],
    };

// Explicitly include the pre-computed doc tree files for routes that need them at runtime.
// Both platform-redirect and [[...path]] need the doctree at runtime:
// - platform-redirect: dynamic route with searchParams
// - [[...path]]: calls getDocsRootNode() during prerendering (even though force-static)
// - sitemap.xml: uses getDocsRootNode() to extract all page paths
//
// Additionally, include specific doc files that may be accessed at runtime due to:
// - Error page rendering (when a static page fails to load)
// - Cold start edge cases during deployment
// - On-demand revalidation requests
// These are whitelisted individually to avoid including the entire docs/ directory.
const outputFileTracingIncludes = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? {
      '/platform-redirect': ['public/doctree-dev.json'],
      '\\[\\[\\.\\.\\.path\\]\\]': ['public/doctree-dev.json'],
      'sitemap.xml': ['public/doctree-dev.json'],
    }
  : {
      '/platform-redirect': ['public/doctree.json'],
      '\\[\\[\\.\\.\\.path\\]\\]': [
        'public/doctree.json',
        'docs/changelog.mdx',
        'docs/platforms/index.mdx',
      ],
      'sitemap.xml': ['public/doctree.json'],
    };

if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_SENTRY_DSN must be set in production'
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', 'mdx'],
  trailingSlash: true,
  serverExternalPackages: [
    'rehype-preset-minify',
    'esbuild',
    '@esbuild/darwin-arm64',
    '@esbuild/darwin-x64',
    '@esbuild/linux-arm64',
    '@esbuild/linux-x64',
    '@esbuild/win32-x64',
    // mdx-bundler fully excluded via outputFileTracingExcludes
    'sharp',
    '@aws-sdk/client-s3',
    '@google-cloud/storage',
    'prettier',
    '@prettier/plugin-xml',
    'mermaid',
  ],
  outputFileTracingExcludes,
  outputFileTracingIncludes,
  images: {
    contentDispositionType: 'inline', // "open image in new tab" instead of downloading
    remotePatterns: REMOTE_IMAGE_PATTERNS,
    // Next.js 16 requires localPatterns for images with query strings
    // Omitting 'search' allows any query string (used for cache busting)
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
  },
  webpack: (config, options) => {
    config.plugins.push(
      codecovNextJSWebpackPlugin({
        enableBundleAnalysis: typeof process.env.CODECOV_TOKEN === 'string',
        bundleName: 'sentry-docs',
        uploadToken: process.env.CODECOV_TOKEN,
        webpack: options.webpack,
      })
    );

    return config;
  },
  env: {
    // This is used on proxy
    DEVELOPER_DOCS_: process.env.NEXT_PUBLIC_DEVELOPER_DOCS,
  },
  redirects,
  rewrites: () => [
    {
      source: '/:path*.md',
      destination: '/md-exports/:path*.md',
    },
  ],
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: 'sentry',
  project: process.env.NEXT_PUBLIC_DEVELOPER_DOCS ? 'develop-docs' : 'docs',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppresses source map uploading logs during build
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,

  reactComponentAnnotation: {
    enabled: true,
  },

  unstable_sentryWebpackPluginOptions: {
    applicationKey: 'sentry-docs',
  },

  _experimental: {
    thirdPartyOriginStackFrames: true,
  },
});
