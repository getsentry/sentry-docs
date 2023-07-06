import {GatsbyNode, Node} from 'gatsby';
import {createFilePath} from 'gatsby-source-filesystem';

const onCreateNode: GatsbyNode['onCreateNode'] = ({
  node,
  actions: {createNodeField, createNode},
  getNode,
  createContentDigest,
  createNodeId,
}) => {
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

    return;
  }

  if (node.internal.type === 'ApiEndpoint') {
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

    // TODO(epurkhiser): We need to adctually correctly type the ApiEndpoint
    // node types and discriminate the type to correctly represent fields like
    // description on the node (otherwise it falls into the Record<string,
    // unknown> type)
    const description = node.description as string;

    const markdownNode: Node = {
      id: createNodeId(`${node.id} >>> MarkdownRemark`),
      children: [],
      parent: node.id,
      internal: {
        owner: 'internal',
        content: description,
        contentDigest: createContentDigest(description),
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

    return;
  }
};

export default onCreateNode;
