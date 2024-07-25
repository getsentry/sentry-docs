import {withSentryConfig} from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['next-mdx-remote'],
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

export default withSentryConfig(nextConfig);
