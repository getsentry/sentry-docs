// const path = require("path");
const activeEnv =
  process.env.GATSBY_ENV || process.env.NODE_ENV || "development";

console.log(`Using environment config: '${activeEnv}'`);

require("dotenv").config({
  path: `.env.${activeEnv}`
});

// see 00-algolia.sh
const BUILD_CONF = process.env.BUILD_CONF
  ? JSON.parse(process.env.BUILD_CONF)
  : {};
if (process.env.BRANCH_NAME === "master" && BUILD_CONF.algolia_api_key) {
  process.env.ALGOLIA_ADMIN_KEY = BUILD_CONF.algolia_api_key;
  process.env.ALGOLIA_INDEX = "1";
}

const queries = require("./src/utils/algolia");

const getPlugins = () => {
  const remarkPlugins = [
    {
      resolve: `gatsby-remark-copy-linked-files`
    },
    {
      resolve: `gatsby-remark-autolink-headers`,
      options: {
        className: "anchor",
        icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.879 6.05L15 1.93A5.001 5.001 0 0 1 22.071 9l-4.121 4.121a1 1 0 0 1-1.414-1.414l4.12-4.121a3 3 0 1 0-4.242-4.243l-4.121 4.121a1 1 0 1 1-1.414-1.414zm2.242 11.9L9 22.07A5 5 0 1 1 1.929 15l4.121-4.121a1 1 0 0 1 1.414 1.414l-4.12 4.121a3 3 0 1 0 4.242 4.243l4.121-4.121a1 1 0 1 1 1.414 1.414zm-8.364-.122l13.071-13.07a1 1 0 0 1 1.415 1.414L6.172 19.242a1 1 0 1 1-1.415-1.414z" fill="currentColor"></path></svg>`,
        enableCustomId: true
      }
    },
    {
      resolve: `gatsby-remark-images`,
      options: {
        maxWidth: 1200,
        linkImagesToOriginal: true
      }
    },
    {
      resolve: require.resolve("./plugins/gatsby-plugin-code-tabs")
    },
    {
      resolve: require.resolve("./plugins/gatsby-plugin-include")
    },
    {
      resolve: "gatsby-remark-prismjs",
      options: {
        noInlineHighlight: true
      }
    }
    // {
    //   resolve: `gatsby-remark-check-links`
    // }
  ];

  const plugins = [
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: activeEnv === "development" ? 0 : 1
      }
    },
    "gatsby-plugin-sass",
    "gatsby-plugin-sharp",
    "gatsby-plugin-zeit-now",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: remarkPlugins
      }
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        remarkPlugins: [require("remark-deflist")],
        gatsbyRemarkPlugins: remarkPlugins
      }
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/../src/collections/_documentation`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs-gatsby`,
        path: `${__dirname}/src/docs`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `includes`,
        path: `${__dirname}/src/includes`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "data",
        path: `${__dirname}/../src/_data`
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ];
  if (process.env.ALGOLIA_INDEX === "1") {
    plugins.push({
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries,
        chunkSize: 10000 // default: 1000
      }
    });
  }
  return plugins;
};

module.exports = {
  // pathPrefix: `/develop`,
  siteMetadata: {
    title: "Sentry Documentation",
    homeUrl: "https://sentry.io",
    sitePath: "docs.sentry.io",
    description: "",
    author: "@getsentry"
  },
  plugins: getPlugins()
};
