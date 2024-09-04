const {redirects} = require('./redirects.js');

const {codecovWebpackPlugin} = require('@codecov/webpack-plugin');
const {withSentryConfig} = require('@sentry/nextjs');

const outputFileTracingExcludes = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? {}
  : {
      '/**/*': [
        './.git/**/*',
        './apps/**/*',
        'develop-docs/**/*',
        'node_modules/@esbuild/darwin-arm64',
      ],
      '/platform-redirect': [
        'docs/organization/integrations/**/*',
        'docs/product/**/*',
        'docs/concepts/**/*',
        'docs/api/**/*',
        'docs/pricing/**/*',
        'docs/account/**/*',
        '**/*.gif',
        'public/mdx-images/**/*',
        '*.pdf',
      ],
      '\\[\\[\\.\\.\\.path\\]\\]': [
        'docs/**/*',
        'node_modules/prettier/plugins',
        'node_modules/rollup/dist',
      ],
      'sitemap.xml': ['docs/**/*', 'public/mdx-images/**/*', '*.gif', '*.pdf', '*.png'],
    };

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  trailingSlash: true,

  experimental: {
    serverComponentsExternalPackages: ['rehype-preset-minify'],
    outputFileTracingExcludes,
  },

  webpack: (config, _options) => {
    config.plugins.push(
      codecovWebpackPlugin({
        enableBundleAnalysis: typeof process.env.CODECOV_TOKEN === 'string',
        bundleName: 'sentry-docs',
        uploadToken: process.env.CODECOV_TOKEN,
      })
    );

    return config;
  },
  env: {
    // This is used on middleware
    DEVELOPER_DOCS_: process.env.NEXT_PUBLIC_DEVELOPER_DOCS,
  },
  redirects,
};

module.exports = withSentryConfig(nextConfig, {
  org: 'sentry',
  project: 'docs',

  // Suppresses source map uploading logs during build
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

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
});
