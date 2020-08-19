import { createFilePath } from "gatsby-source-filesystem";

export default ({
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
