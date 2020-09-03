const axios = require("axios");

require("ts-node").register({
  files: true, // to that TS node hooks have access to local typings too
});

const activeEnv =
  process.env.GATSBY_ENV || process.env.NODE_ENV || "development";

console.log(`Using environment config: '${activeEnv}'`);

require("dotenv").config({
  path: `.env.${activeEnv}`,
});

if (
  process.env.VERCEL_GITHUB_COMMIT_REF === "master" &&
  process.env.ALGOLIA_ADMIN_KEY
) {
  process.env.ALGOLIA_INDEX = "1";
}

const queries = require("./src/utils/algolia");
const packages = new (require("./src/utils/packageRegistry"))();

const getPlugins = () => {
  const remarkPlugins = [
    {
      resolve: require.resolve("./plugins/gatsby-remark-variables"),
      options: {
        scope: {
          packages,
        },
        excludeExpr: ["default"],
      },
    },
    {
      resolve: `gatsby-remark-copy-linked-files`,
    },
    {
      resolve: `gatsby-remark-autolink-headers`,
      options: {
        className: "anchor",
        icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.879 6.05L15 1.93A5.001 5.001 0 0 1 22.071 9l-4.121 4.121a1 1 0 0 1-1.414-1.414l4.12-4.121a3 3 0 1 0-4.242-4.243l-4.121 4.121a1 1 0 1 1-1.414-1.414zm2.242 11.9L9 22.07A5 5 0 1 1 1.929 15l4.121-4.121a1 1 0 0 1 1.414 1.414l-4.12 4.121a3 3 0 1 0 4.242 4.243l4.121-4.121a1 1 0 1 1 1.414 1.414zm-8.364-.122l13.071-13.07a1 1 0 0 1 1.415 1.414L6.172 19.242a1 1 0 1 1-1.415-1.414z" fill="currentColor"></path></svg>`,
        enableCustomId: true,
      },
    },
    {
      resolve: `gatsby-remark-images`,
      options: {
        maxWidth: 1200,
        linkImagesToOriginal: true,
      },
    },
    {
      resolve: "gatsby-remark-prismjs",
      options: {
        noInlineHighlight: true,
      },
    },
    // {
    //   resolve: `gatsby-remark-check-links`
    // }
  ];

  const plugins = [
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: process.env.SENTRY_DSN,
        release: process.env.SENTRY_RELEASE,
        tracesSampleRate: activeEnv === "development" ? 0 : 1,
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-plugin-sass",
    "gatsby-plugin-zeit-now",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: remarkPlugins,
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        remarkPlugins: [require("remark-deflist")],
        gatsbyRemarkPlugins: [
          {
            resolve: require.resolve("./plugins/gatsby-plugin-code-tabs"),
          },
          {
            resolve: require.resolve("./plugins/gatsby-plugin-include"),
          },
          ...remarkPlugins,
        ],
      },
    },
    "gatsby-plugin-react-helmet",
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: ({ node }) => {
          if (node.sourceInstanceName === "api") {
            return "ApiEndpoint";
          }
          return null;
        },
      },
    },
    `gatsby-transformer-javascript-frontmatter`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/src/docs`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `platforms`,
        path: `${__dirname}/src/platforms`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `api`,
        path: `${__dirname}/src/api`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `includes`,
        path: `${__dirname}/src/includes`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `wizard`,
        path: `${__dirname}/src/wizard`,
        ignore: [`**/README.md`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "data",
        path: `${__dirname}/src/data`,
      },
    },
    {
      resolve: "./plugins/gatsby-plugin-sentry-wizard",
      options: {
        source: "wizard",
        output: `${__dirname}/public/_platforms`,
      },
    },
    {
      resolve: "./plugins/gatsby-redirects",
      options: {
        inputConfigFile: `${__dirname}/nginx.conf`,
        outputConfigFile: `${__dirname}/nginx.out.conf`,
      },
    },
    {
      resolve: "./plugins/gatsby-plugin-openapi",
      options: {
        name: "openapi",
        resolve: async () => {
          const response = await axios.get(
            "https://raw.githubusercontent.com/getsentry/sentry-api-schema/68bb79acfbbee062bd8d2f71ee3a07d43dc934c9/openapi-derefed.json"
          );
          return response.data;
        },
        // required, function which returns a Promise resolving Swagger JSON
      },
    },
    // generate normal redirects so when you're running without nginx
    // you receive similar behavior
    `gatsby-plugin-meta-redirect`,
  ];
  if (process.env.ALGOLIA_INDEX === "1") {
    plugins.push({
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries,
        chunkSize: 10000, // default: 1000
      },
    });
  }
  return plugins;
};

module.exports = {
  // pathPrefix: `/develop`,
  siteMetadata: {
    title: "Sentry Documentation",
    homeUrl: "https://docs.sentry.io",
    sitePath: "docs.sentry.io",
    description: "",
    author: "@getsentry",
  },
  plugins: getPlugins(),
};
