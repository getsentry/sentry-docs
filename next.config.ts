import {codecovNextJSWebpackPlugin} from '@codecov/nextjs-webpack-plugin';
import {withSentryConfig} from '@sentry/nextjs';

import {REMOTE_IMAGE_PATTERNS} from './src/config/images';
import {redirects} from './redirects.js';

// Exclude build-time-only dependencies from serverless function bundles to stay under
// Vercel's 250MB limit. These packages (esbuild, mdx-bundler, sharp, etc.) are only
// needed during the build process to compile MDX and optimize assets. The compiled
// output is used at runtime, so bundling these ~150-200MB of dependencies would bloat
// functions unnecessarily and cause deployment failures.
const outputFileTracingExcludes = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? {
      '/**/*': [
        '**/*.map',
        './.git/**/*',
        './apps/**/*',
        './.next/cache/mdx-bundler/**/*',
        './.next/cache/md-exports/**/*',
        'docs/**/*',
        // Exclude heavy build dependencies
        'node_modules/@esbuild/**/*',
        'node_modules/esbuild/**/*',
        'node_modules/@aws-sdk/**/*',
        'node_modules/@google-cloud/**/*',
        'node_modules/prettier/**/*',
        'node_modules/@prettier/**/*',
        'node_modules/sharp/**/*',
        'node_modules/mermaid/**/*',
        // Exclude MDX processing dependencies
        'node_modules/mdx-bundler/**/*',
        'node_modules/rehype-preset-minify/**/*',
        'node_modules/rehype-prism-plus/**/*',
        'node_modules/rehype-prism-diff/**/*',
        'node_modules/remark-gfm/**/*',
        'node_modules/remark-mdx-images/**/*',
        'node_modules/unified/**/*',
        'node_modules/rollup/**/*',
      ],
    }
  : {
      '/**/*': [
        '**/*.map',
        './.git/**/*',
        './.next/cache/mdx-bundler/**/*',
        './.next/cache/md-exports/**/*',
        './apps/**/*',
        'develop-docs/**/*',
        // Exclude heavy build dependencies
        'node_modules/@esbuild/**/*',
        'node_modules/esbuild/**/*',
        'node_modules/@aws-sdk/**/*',
        'node_modules/@google-cloud/**/*',
        'node_modules/prettier/**/*',
        'node_modules/@prettier/**/*',
        'node_modules/sharp/**/*',
        'node_modules/mermaid/**/*',
        // Exclude MDX processing dependencies
        'node_modules/mdx-bundler/**/*',
        'node_modules/rehype-preset-minify/**/*',
        'node_modules/rehype-prism-plus/**/*',
        'node_modules/rehype-prism-diff/**/*',
        'node_modules/remark-gfm/**/*',
        'node_modules/remark-mdx-images/**/*',
        'node_modules/unified/**/*',
        'node_modules/rollup/**/*',
      ],
      '/platform-redirect': [
        '**/*.gif',
        'public/mdx-images/**/*',
        'public/og-images/**/*',
        '**/*.pdf',
      ],
      '\\[\\[\\.\\.\\.path\\]\\]': [
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
    'mdx-bundler',
    'sharp',
    '@aws-sdk/client-s3',
    '@google-cloud/storage',
    'prettier',
    '@prettier/plugin-xml',
    'mermaid',
  ],
  outputFileTracingExcludes,
  images: {
    contentDispositionType: 'inline', // "open image in new tab" instead of downloading
    remotePatterns: REMOTE_IMAGE_PATTERNS,
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
    // This is used on middleware
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
