const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

const getChild = node => {
  return node.childMarkdownRemark || node.childMdx;
};

const getDataOrPanic = async (query, graphql, reporter) => {
  const { data, errors } = await graphql(query);
  if (errors) {
    reporter.panicOnBuild(`🚨  ERROR: ${errors}`);
  }
  return data;
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "~src": path.join(path.resolve(__dirname, "src")),
      },
    },
  });
};

// TODO(dcramer): move frontmatter out of ApiDoc and into Frontmatter
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    `
    type PageContext {
      title: String
      sidebar_order: Int
      draft: Boolean
    }

    type SitePage implements Node {
      context: PageContext
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Mdx implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Fields {
      slug: String!
      legacy: Boolean
    }

    type ApiParam {
      type: String!
      name: String!
      description: String
    }

    type ApiDoc implements Node {
      sidebar_order: Int
      title: String!
      fields: Fields

      api_path: String!
      authentication:  String
      description: String
      example_request: String
      example_response: String
      method: String!
      parameters: [ApiParam]
      path_parameters: [ApiParam]
      query_parameters: [ApiParam]
      warning: String
    }
  `,
    schema.buildObjectType({
      name: "Frontmatter",
      fields: {
        title: {
          type: "String!",
        },
        keywords: {
          type: "[String!]",
        },
        draft: {
          type: "Boolean",
        },
        redirect_from: {
          type: "[String!]",
        },
        noindex: {
          type: "Boolean",
        },
        sidebar_order: {
          type: "Int",
          resolve(source, args, context, info) {
            // For a more generic solution, you could pick the field value from
            // `source[info.fieldName]`
            return source[info.fieldName] !== null
              ? source[info.fieldName]
              : 10;
          },
        },

        // wizard fields
        // TODO(dcramer): move to a diff schema/type
        support_level: {
          type: "String",
        },
        type: {
          type: "String",
        },
        doc_link: {
          type: "String",
        },
        name: {
          type: "String",
        },
      },
    }),
  ];
  createTypes(typeDefs);
};

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  createContentDigest,
  createNodeId,
}) => {
  const { createNodeField, createNode } = actions;
  if (node.internal.type === "Mdx" || node.internal.type === "MarkdownRemark") {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: "slug",
      node,
      value,
    });
    createNodeField({
      name: "legacy",
      node,
      value: value.indexOf("/clients/") === 0,
    });
  } else if (node.internal.type === "ApiDoc") {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: "slug",
      node,
      value: `/api${value}`,
    });
    createNodeField({
      name: "legacy",
      node,
      value: false,
    });

    const markdownNode = {
      id: createNodeId(`${node.id} >>> MarkdownRemark`),
      children: [],
      parent: node.id,
      internal: {
        content: node.description,
        contentDigest: createContentDigest(node.description),
        mediaType: `text/markdown`,
        type: `ApiDocMarkdown`,
      },
    };
    createNode(markdownNode);

    createNodeField({
      node,
      name: "description___NODE",
      value: markdownNode.id,
    });
  }
};

exports.createPages = async function({ actions, getNode, graphql, reporter }) {
  const createApi = async () => {
    const data = await getDataOrPanic(
      `
      query {
        allApiDoc {
          nodes {
            id
            title
            fields {
              slug
            }
          }
        }
      }
    `,
      graphql,
      reporter
    );

    const component = require.resolve(`./src/components/pages/api.js`);
    await Promise.all(
      data.allApiDoc.nodes.map(async node => {
        actions.createPage({
          path: node.fields.slug,
          component,
          context: {
            id: node.id,
            title: node.title,
          },
        });
      })
    );
  };

  const createDocs = async () => {
    const data = await getDataOrPanic(
      `
      query {
        allFile(filter: { sourceInstanceName: { eq: "docs" } }) {
          nodes {
            id
            childMarkdownRemark {
              frontmatter {
                title
              }
              fields {
                slug
              }
            }
            childMdx {
              frontmatter {
                title
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `,
      graphql,
      reporter
    );

    const component = require.resolve(`./src/components/pages/doc.js`);
    await Promise.all(
      data.allFile.nodes.map(async node => {
        const child = getChild(node);
        if (child && child.fields) {
          actions.createPage({
            path: child.fields.slug,
            component,
            context: {
              id: node.id,
              title: child.frontmatter.title,
              sidebar_order: child.frontmatter.sidebar_order,
              draft: child.frontmatter.draft,
            },
          });
        }
      })
    );
  };

  const createPlatformDocs = async () => {
    const {
      allFile: { nodes },
    } = await getDataOrPanic(
      `
        query {
          allFile(filter: { sourceInstanceName: { eq: "platforms" } }) {
            nodes {
              id
              relativePath
              internal {
                type
              }
              childMarkdownRemark {
                frontmatter {
                  title
                }
                fields {
                  slug
                }
              }
              childMdx {
                frontmatter {
                  title
                }
                fields {
                  slug
                }
              }
            }
          }
        }
      `,
      graphql,
      reporter
    );

    const platforms = {
      // {
      //   node: Node,
      //   children: Node[],
      //   integrations: [{
      //     node: Node,
      //     children: Node[],
      //   }],
      //   common: Node[],
      // }
    };

    // build up `platforms` data
    nodes.forEach(node => {
      if (
        node.relativePath === "index.mdx" ||
        node.relativePath === "index.md"
      ) {
        return;
      }

      let match;

      const platformName = node.relativePath.match(/^([^\/]+)\//)[1];
      const integrationName = (match = node.relativePath.match(
        /^[^\/]+\/integrations\/([^\/]+)\//
      ))
        ? match[1]
        : null;
      const isCommon =
        !integrationName && !!node.relativePath.match(/^[^\/]+\/common\//);
      const isRoot =
        !integrationName &&
        !isCommon &&
        node.relativePath.match(/^([^\/]+)\/index\.mdx?$/);
      const isIntegrationRoot =
        integrationName &&
        node.relativePath.match(
          /^([^\/]+)\/integrations\/([^\/]+)\/index\.mdx?$/
        );

      if (!platforms[platformName]) {
        platforms[platformName] = {
          node: null,
          children: [],
          integrations: {},
          common: [],
        };
      }
      const pData = platforms[platformName];
      if (isRoot) {
        pData.node = node;
      } else if (isCommon) {
        pData.common.push(node);
      } else if (integrationName) {
        if (!pData.integrations[integrationName]) {
          pData.integrations[integrationName] = {
            node: null,
            children: [],
          };
        }
        iData = pData.integrations[integrationName];
        if (isIntegrationRoot) {
          iData.node = node;
        } else {
          iData.children.push(node);
        }
      } else {
        pData.children.push(node);
      }
    });

    // begin creating pages from `platforms`
    const component = require.resolve(`./src/components/pages/platform.js`);

    Object.keys(platforms).forEach(platformName => {
      const pData = platforms[platformName];
      if (!pData.node) {
        throw new Error(`No node identified as root for ${platformName}`);
      }
      const staticPageContext = {
        platformName,
        integrations: Object.keys(pData.integrations).map(integrationName => {
          const iData = pData.integrations[integrationName];
          return {
            name: integrationName,
            title: getChild(iData.node).frontmatter.title,
          };
        }),
      };

      console.info(`Creating platform pages for ${platformName}`);

      // create the root page for the platform
      actions.createPage({
        path: `/platforms${createFilePath({ node: pData.node, getNode })}`,
        component,
        context: {
          id: pData.node.id,
          title: getChild(pData.node).frontmatter.title,
          sidebar_order: getChild(pData.node).frontmatter.sidebar_order,
          ...staticPageContext,
        },
      });

      // create all direct children (similar behavior to integration children)
      pData.children.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode })}`;
        console.info(`Creating platform child for ${platformName}: ${path}`);
        actions.createPage({
          path,
          component,
          context: {
            id: node.id,
            title: getChild(node).frontmatter.title,
            sidebar_order: getChild(node).frontmatter.sidebar_order,
            ...staticPageContext,
          },
        });
      });

      // duplicate common for platform (similar behavior to integration common)
      pData.common.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode }).replace(
          /^\/[^\/]+\/common\//,
          `/${platformName}/`
        )}`;
        console.info(`Creating platform common for ${platformName}: ${path}`);
        actions.createPage({
          path,
          component,
          context: {
            id: node.id,
            title: getChild(node).frontmatter.title,
            sidebar_order: getChild(node).frontmatter.sidebar_order,
            ...staticPageContext,
          },
        });
      });

      // create integration roots
      Object.keys(pData.integrations).forEach(integrationName => {
        const iData = pData.integrations[integrationName];
        if (!iData.node) {
          throw new Error(
            `No node identified as root for ${platformName} -> ${integrationName}`
          );
        }

        console.info(
          `Creating platform pages for ${platformName} -> ${integrationName}`
        );
        actions.createPage({
          path: `/platforms${createFilePath({ node: iData.node, getNode })}`,
          component,
          context: {
            id: iData.node.id,
            title: getChild(iData.node).frontmatter.title,
            sidebar_order: getChild(iData.node).frontmatter.sidebar_order,
            integrationName,
            ...staticPageContext,
          },
        });

        // create integration children
        iData.children.forEach(node => {
          const path = `/platforms${createFilePath({ node, getNode })}`;
          console.info(
            `Creating platform child for ${platformName} -> ${integrationName}: ${path}`
          );
          actions.createPage({
            path,
            component,
            context: {
              id: node.id,
              title: getChild(node).frontmatter.title,
              sidebar_order: getChild(node).frontmatter.sidebar_order,
              integrationName,
              ...staticPageContext,
            },
          });
        });

        // duplicate common for integration
        pData.common.forEach(node => {
          const path = `/platforms${createFilePath({ node, getNode }).replace(
            /^\/[^\/]+\/common\//,
            `/${platformName}/integrations/${integrationName}/`
          )}`;
          console.info(
            `Creating platform common for ${platformName} -> ${integrationName}: ${path}`
          );
          actions.createPage({
            path,
            component,
            context: {
              id: node.id,
              title: getChild(node).frontmatter.title,
              integrationName,
              ...staticPageContext,
            },
          });
        });
      });
    });
  };

  await Promise.all([createApi(), createDocs(), createPlatformDocs()]);
};
