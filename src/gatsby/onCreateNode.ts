/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import {createFilePath} from 'gatsby-source-filesystem';

export default function onCreateNode({
  node,
  actions,
  getNode,
  createContentDigest,
  createNodeId,
}) {
  const {createNodeField, createNode} = actions;
  if (
    (node.internal.type === 'Mdx' || node.internal.type === 'MarkdownRemark') &&
    node.fileAbsolutePath
  ) {
    const value = createFilePath({node, getNode});
    createNodeField({
      name: 'slug',
      node,
      value,
    });
    createNodeField({
      name: 'legacy',
      node,
      value: value.indexOf('/clients/') === 0,
    });
  } else if (node.internal.type === 'ApiEndpoint') {
    const value = createFilePath({node, getNode});
    createNodeField({
      name: 'slug',
      node,
      value: `/api${value}`,
    });
    createNodeField({
      name: 'legacy',
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
        type: `ApiEndpointMarkdown`,
      },
    };
    createNode(markdownNode);

    createNodeField({
      node,
      name: 'description___NODE',
      value: markdownNode.id,
    });
  }
}
