const createMDX = require('@next/mdx');
const remarkPrism = require('remark-prism');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*/',
          destination: 'https://docs.sentry.io/:path*/',
        },
        {
          source: '/:path*',
          destination: 'https://docs.sentry.io/:path*',
        },
      ],
    };
  },
  
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  trailingSlash: true,
  
  experimental: {
    serverComponentsExternalPackages: ['rehype-preset-minify']
  }
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkPrism],
    }
});

module.exports = withMDX(nextConfig);
