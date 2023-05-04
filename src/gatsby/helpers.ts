export const getChild = (node: any) => {
  return node.childMarkdownRemark || node.childMdx;
};

export const getDataOrPanic = async (query, graphql, reporter) => {
  const {data, errors} = await graphql(query);
  if (errors) {
    reporter.panicOnBuild(`🚨  ERROR: ${errors}`);
  }
  return data;
};
