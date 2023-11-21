/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: 'https://docs.sentry.io/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
