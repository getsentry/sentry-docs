const { createFilePath } = require('gatsby-source-filesystem');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
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
      jekyllOnly: Boolean
      gatsbyOnly: Boolean
    }
    
    type Frontmatter {
      title: String!
      keywords: [String!]
      sidebar_order: Int
    }
  `;
  createTypes(typeDefs);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'Mdx' || node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value
    });
    createNodeField({
      name: 'jekyllOnly',
      node,
      value: !!(
        node.rawMarkdownBody && node.rawMarkdownBody.indexOf('{%') !== -1
      )
    });
    createNodeField({
      name: 'gatsbyOnly',
      node,
      value: node.fileAbsolutePath.indexOf('/src/docs') !== -1
    });
  }
};

exports.createPages = async function({ actions, graphql, reporter }) {
  // TODO(dcramer): query needs rewritten when mdx is back
  const { data, errors } = await graphql(`
    query {
      allFile {
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
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query');
  }
  const component = require.resolve(`./src/components/layout.js`);
  data.allFile.nodes.forEach(node => {
    if (node.childMarkdownRemark && node.childMarkdownRemark.fields) {
      actions.createPage({
        path: node.childMarkdownRemark.fields.slug,
        component,
        context: {
          id: node.id,
          title: node.childMarkdownRemark.frontmatter.title
        }
      });
    } else if (node.childMdx && node.childMdx.fields) {
      actions.createPage({
        path: node.childMdx.fields.slug,
        component,
        context: { id: node.id, title: node.childMdx.frontmatter.title }
      });
    }
  });
};
