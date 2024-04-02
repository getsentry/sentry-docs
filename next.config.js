const createMDX = require('@next/mdx');
const remarkPrism = require('remark-prism');
const { codecovWebpackPlugin } = require('@codecov/webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    bodySizeLimit: '1mb',
  },

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
}

    return config;
  }
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkPrism],
  },
});

module.exports = withMDX(nextConfig);

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'sentry',
    project: 'docs',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

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
  }
);
