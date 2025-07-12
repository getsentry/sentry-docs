import {codecovNextJSWebpackPlugin} from '@codecov/nextjs-webpack-plugin';
import {withSentryConfig} from '@sentry/nextjs';

import {redirects} from './redirects.js';

const outputFileTracingExcludes = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? {
      '/**/*': [
        '**/*.map',
        './.git/**/*',
        './apps/**/*',
        './.next/cache/mdx-bundler/**/*',
        './.next/cache/md-exports/**/*',
        'docs/**/*',
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
        'node_modules/@esbuild/*',
      ],
      '/platform-redirect': ['**/*.gif', 'public/mdx-images/**/*', '**/*.pdf'],
      '\\[\\[\\.\\.\\.path\\]\\]': [
        'docs/**/*',
        'node_modules/prettier/plugins',
        'node_modules/rollup/dist',
      ],
      'sitemap.xml': [
        'docs/**/*',
        'public/mdx-images/**/*',
        '**/*.gif',
        '**/*.pdf',
        '**/*.png',
      ],
    };

if (
  process.env.NODE_ENV !== 'development' &&
  (!process.env.NEXT_PUBLIC_SENTRY_DSN || !process.env.SENTRY_DSN)
) {
  // When building for previews or local CI environments where real Sentry DSNs
  // are not available, fall back to a dummy value so the build can proceed.
  // Real production deployments must supply valid DSNs via env vars.
  // eslint-disable-next-line no-console
  console.warn('SENTRY DSN env vars missing; using dummy values for preview build');
  process.env.NEXT_PUBLIC_SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? 'https://examplePublicKey@o0.ingest.sentry.io/0';
  process.env.SENTRY_DSN = process.env.SENTRY_DSN ?? 'https://examplePublicKey@o0.ingest.sentry.io/0';
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
