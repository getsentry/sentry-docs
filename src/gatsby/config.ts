/* eslint-disable no-console */
/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import queries from './utils/algolia';
import getAppRegistry from './utils/appRegistry';
import getPackageRegistry from './utils/packageRegistry';
import resolveOpenAPI from './utils/resolveOpenAPI';

const root = `${__dirname}/../..`;

process.env.DISABLE_THUMBNAILS = process.env.DISABLE_THUMBNAILS || '0';
if (process.env.DISABLE_THUMBNAILS === '1') {
  console.log('🐇 Thumbnail generation is disabled.');
  console.log(
    'WARN: DISABLE_THUMBNAILS should no longer yield significant build time boosts with `yarn develop`. Let @markus know if it does.'
  );
}

const getPlugins = () => {
  const remarkPlugins = [
    {
      resolve: require.resolve('./plugins/gatsby-remark-terms'),
    },
    {
      resolve: require.resolve('./plugins/gatsby-remark-variables'),
      options: {
        resolveScopeData: async function () {
          const [apps, packages] = await Promise.all([
            getAppRegistry,
            getPackageRegistry,
          ]);

          return {apps, packages};
        },
        excludeExpr: ['default', 'secrets.SENTRY_AUTH_TOKEN'],
      },
    },
    {
      resolve: `gatsby-remark-copy-linked-files`,
    },
    {
      resolve: `gatsby-remark-autolink-headers`,
      options: {
        className: 'anchor',
        icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.879 6.05L15 1.93A5.001 5.001 0 0 1 22.071 9l-4.121 4.121a1 1 0 0 1-1.414-1.414l4.12-4.121a3 3 0 1 0-4.242-4.243l-4.121 4.121a1 1 0 1 1-1.414-1.414zm2.242 11.9L9 22.07A5 5 0 1 1 1.929 15l4.121-4.121a1 1 0 0 1 1.414 1.414l-4.12 4.121a3 3 0 1 0 4.242 4.243l4.121-4.121a1 1 0 1 1 1.414 1.414zm-8.364-.122l13.071-13.07a1 1 0 0 1 1.415 1.414L6.172 19.242a1 1 0 1 1-1.415-1.414z" fill="currentColor"></path></svg>`,
        enableCustomId: true,
      },
    },
    process.env.DISABLE_THUMBNAILS === '0' && {
      resolve: `gatsby-remark-images`,
      options: {
        maxWidth: 1200,
        linkImagesToOriginal: true,
        wrapperStyle: `margin-bottom: 1.5rem`,
      },
    },
    {
      resolve: 'gatsby-remark-prismjs',
      options: {
        noInlineHighlight: true,
        languageExtensions: [
          {
            language: 'discover',
            definition: {
              comment: /#.*/,
              string: {
                // Node js, we don't need to worry about safari
                // eslint-disable-next-line no-lookahead-lookbehind-regexp/no-lookahead-lookbehind-regexp
                pattern: /("[^"]*"|(?<=:)\S+)/,
                greedy: true,
              },
              boolean: /\b(?:true|false|yes|no)\b/,
              variable: /\{\{.*?\}\}/,
              keyword: /\b([^:\s]*?)(?=:)\b/,
              number:
                /[+-]?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b0x[\dA-Fa-f]+\b|\b0xK[\dA-Fa-f]{20}\b|\b0x[ML][\dA-Fa-f]{32}\b|\b0xH[\dA-Fa-f]{4}\b/,
              punctuation: /[{}[\];(),.!*=<>]/,
            },
          },
        ],
      },
    },
    // {
    //   resolve: `gatsby-remark-check-links`
    // }
  ].filter(Boolean);

  const plugins = [
    'gatsby-plugin-sharp',
    'gatsby-plugin-sass',
    'gatsby-plugin-zeit-now',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          'UA-30327640-1', // Sentry
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: remarkPlugins,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        remarkPlugins: [require('remark-deflist')],
        gatsbyRemarkPlugins: [
          {
            resolve: require.resolve('./plugins/gatsby-plugin-code-tabs'),
          },
          {
            resolve: require.resolve('./plugins/gatsby-plugin-include'),
          },
          ...remarkPlugins,
        ],
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: ({node}) => {
          if (node.sourceInstanceName === 'api') {
            return 'ApiEndpoint';
          }
          return 'value';
        },
      },
    },
    `gatsby-transformer-javascript-frontmatter`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${root}/src/docs`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `platforms`,
        path: `${root}/src/platforms`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `api`,
        path: `${root}/src/api`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `platform-includes`,
        path: `${root}/src/platform-includes`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `includes`,
        path: `${root}/src/includes`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `wizard`,
        path: `${root}/src/wizard`,
        ignore: [`**/README.md`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${root}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'data',
        path: `${root}/src/data`,
      },
    },
    {resolve: `./src/gatsby/plugins/gatsby-redirects`},
    {
      resolve: `./src/gatsby/plugins/gatsby-plugin-openapi`,
      options: {
        name: 'openapi',
        // resolve: required, function which returns a Promise resolving OpenAPI JSON
        resolve: resolveOpenAPI,
      },
    },
    // used to generate clident-side redirects for markdown redirect_from
    `gatsby-plugin-meta-redirect`,
    process.env.ALGOLIA_INDEX === '1' && {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries,
        chunkSize: 10000, // default: 1000
        enablePartialUpdates: true,
        matchFields: ['text', 'section', 'title', 'url', 'legacy', 'keywords'],
      } as any,
    },
  ].filter(Boolean);

  return plugins;
};

const config = {
  // pathPrefix: `/develop`,
  siteMetadata: {
    title: 'Sentry Documentation',
    homeUrl: 'https://docs.sentry.io',
    siteUrl: 'https://docs.sentry.io',
    sitePath: 'docs.sentry.io',
    description: 'Product documentation for Sentry.io and its SDKs',
    author: '@getsentry',
  },
  plugins: getPlugins(),
};

export default config;
