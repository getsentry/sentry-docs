import { codecovNextJSWebpackPlugin } from '@codecov/nextjs-webpack-plugin';
import { withSentryConfig } from '@sentry/nextjs';

import { redirects } from './redirects.js';

const outputFileTracingExcludes = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? {
    '/**/*': [
      './.git/**/*',
      './apps/**/*',
      'docs/**/*',
      // Add image exclusions for dev docs too
      'public/mdx-images/**/*',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.gif',
      '**/*.svg',
      '**/*.webp',
      '**/*.pdf'
    ],
  }
  : {
    '/**/*': [
      './.git/**/*',
      './apps/**/*',
      'develop-docs/**/*',
      'node_modules/@esbuild/darwin-arm64',
      // CRITICAL: Add comprehensive image exclusions globally
      'public/mdx-images/**/*',
      'public/**/*.png',
      'public/**/*.jpg',
      'public/**/*.jpeg',
      'public/**/*.gif',
      'public/**/*.svg',
      'public/**/*.webp',
      'public/**/*.pdf',
      // Exclude large dependencies that shouldn't be in functions
      'node_modules/@google-cloud/**/*',
      'node_modules/@aws-sdk/**/*',
      'node_modules/sharp/**/*',
      'node_modules/mermaid/**/*',
    ],
    '/platform-redirect': ['**/*.gif', 'public/mdx-images/**/*', '*.pdf'],
    '/[[...path]]': [
      'docs/**/*',
      'node_modules/prettier/plugins',
      'node_modules/rollup/dist',
      // CRITICAL: Add image exclusions for main docs route
      'public/mdx-images/**/*',
      '**/*.gif',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.pdf',
      '**/*.svg',
      '**/*.webp',
      // Exclude heavy deps from main route
      'node_modules/@google-cloud/**/*',
      'node_modules/@aws-sdk/**/*',
      'node_modules/sharp/**/*',
      'node_modules/mermaid/**/*',
    ],
    // Fallback pattern in case Next.js uses different internal naming
    '[[...path]]': [
      'docs/**/*',
      'public/mdx-images/**/*',
      '**/*.gif',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.pdf',
      '**/*.svg',
      '**/*.webp',
      'node_modules/prettier/plugins',
      'node_modules/rollup/dist',
      'node_modules/@google-cloud/**/*',
      'node_modules/@aws-sdk/**/*',
      'node_modules/sharp/**/*',
      'node_modules/mermaid/**/*',
    ],
    'sitemap.xml': ['docs/**/*', 'public/mdx-images/**/*', '*.gif', '*.pdf', '*.png', '**/*.jpg', '**/*.jpeg'],
  };

if (
  process.env.NODE_ENV !== 'development' &&
  (!process.env.NEXT_PUBLIC_SENTRY_DSN || !process.env.SENTRY_DSN)
) {
  throw new Error(
    'Missing required environment variables: NEXT_PUBLIC_SENTRY_DSN and SENTRY_DSN must be set in production'
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', 'mdx'],
  trailingSlash: true,
  serverExternalPackages: ['rehype-preset-minify'],
  outputFileTracingExcludes,
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
  rewrites: async () => [
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
