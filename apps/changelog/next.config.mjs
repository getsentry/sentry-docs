import {withSentryConfig} from '@sentry/nextjs';
import WebpackHookPlugin from 'webpack-hook-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['next-mdx-remote'],
  webpack: (config, {dev, nextRuntime}) => {
    if (dev && nextRuntime === 'nodejs') {
      config.plugins.push(
        new WebpackHookPlugin({
          onBuildStart: ['npx @spotlightjs/spotlight'],
        })
      );
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/changelog',
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: 'sentry',
  project: 'changelog',

  // Suppresses source map uploading logs during build
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: process.env.NODE_ENV === 'production',

  reactComponentAnnotation: {
    enabled: true,
  },

  unstable_sentryWebpackPluginOptions: {
    applicationKey: 'sentry-changelog',
  },

  automaticVercelMonitors: true,
});
