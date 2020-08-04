const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "~src": path.join(path.resolve(__dirname, "src"))
      }
    }
  });
};

// TODO(dcramer): move frontmatter out of ApiDoc and into Frontmatter
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    `
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
    }

    type ApiParam {
      type: String!
      name: String!
      description: String
    }

    type ApiDoc implements Node {
      sidebar_order: Int
      title: String!

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
          type: "String!"
        },
        keywords: {
          type: "[String!]"
        },
        draft: {
          type: "Boolean"
        },
        sidebar_order: {
          type: "Int",
          resolve(source, args, context, info) {
            // For a more generic solution, you could pick the field value from
            // `source[info.fieldName]`
            return source[info.fieldName] !== null
              ? source[info.fieldName]
              : 10;
          }
        },

        // wizard fields
        // TODO(dcramer): move to a diff schema/type
        support_level: {
          type: "String"
        },
        type: {
          type: "String"
        },
        doc_link: {
          type: "String"
        },
        name: {
          type: "String"
        }
      }
    })
  ];
  createTypes(typeDefs);
};

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  createContentDigest,
  createNodeId
}) => {
  const { createNodeField, createNode } = actions;
  if (node.internal.type === "Mdx" || node.internal.type === "MarkdownRemark") {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: "slug",
      node,
      value
    });
  } else if (node.internal.type === "ApiDoc") {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: "slug",
      node,
      value: `/api${value}`
    });

    const markdownNode = {
      id: createNodeId(`${node.id} >>> MarkdownRemark`),
      children: [],
      parent: node.id,
      internal: {
        content: node.description,
        contentDigest: createContentDigest(node.description),
        mediaType: `text/markdown`,
        type: `ApiDocMarkdown`
      }
    };
    createNode(markdownNode);

    createNodeField({
      node,
      name: "description___NODE",
      value: markdownNode.id
    });
  }
};

exports.createPages = async function({ actions, graphql, reporter }) {
  const createApi = async () => {
    const { data, errors } = await graphql(`
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
    `);

    if (errors) {
      reporter.panicOnBuild('🚨  ERROR: Loading "createApi" query');
    }
    const component = require.resolve(`./src/components/pages/api.js`);
    data.allApiDoc.nodes.forEach(node => {
      actions.createPage({
        path: node.fields.slug,
        component,
        context: {
          id: node.id,
          title: node.title
        }
      });
    });
  };

  const createDocs = async () => {
    const { data, errors } = await graphql(`
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
    `);

    if (errors) {
      reporter.panicOnBuild('🚨  ERROR: Loading "createDocs" query');
    }
    const component = require.resolve(`./src/components/pages/doc.js`);
    data.allFile.nodes.forEach(node => {
      const child = node.childMarkdownRemark || node.childMdx;
      if (child && child.fields) {
        actions.createPage({
          path: child.fields.slug,
          component,
          context: {
            id: node.id,
            title: child.frontmatter.title
          }
        });
      }
    });
  };

  await createApi();
  await createDocs();
};
