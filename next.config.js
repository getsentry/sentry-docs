const createMDX = require('@next/mdx');
const remarkPrism = require('remark-prism');
const {codecovWebpackPlugin} = require('@codecov/webpack-plugin');
const {withSentryConfig} = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  trailingSlash: true,

  experimental: {
    serverComponentsExternalPackages: ['rehype-preset-minify'],
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
    DEVELOPER_DOCS_: process.env.DEVELOPER_DOCS,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkPrism],
  },
});

module.exports = withMDX(nextConfig);

module.exports = withSentryConfig(module.exports, {
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

  // Enables automatic instrumentation of Vercel Cron Monitors.
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
