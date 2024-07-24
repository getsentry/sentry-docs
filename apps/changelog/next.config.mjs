import {withSentryConfig} from '@sentry/nextjs';

const nextConfig = {
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['next-mdx-remote'],
};

export default withSentryConfig(nextConfig);
