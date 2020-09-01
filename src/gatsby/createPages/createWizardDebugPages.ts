import { getChild, getDataOrPanic } from "./helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        allFile(filter: { sourceInstanceName: { eq: "wizard" } }) {
          nodes {
            id
            childMarkdownRemark {
              frontmatter {
                title
                name
                draft
                noindex
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

  actions.createPage({
    path: `/_debug/wizard/`,
    component: require.resolve(`../../templates/wizardDebugIndex.js`),
    context: {
      noindex: true,
      title: "Wizard Previews",
    },
  });

  const component = require.resolve(`../../templates/wizardDebug.js`);
  data.allFile.nodes.map((node: any) => {
    const child = getChild(node);
    actions.createPage({
      path: `/_debug/wizard${child.fields.slug}`,
      component,
      context: {
        title: child.frontmatter.name,
        ...child.frontmatter,
        noindex: true,
        id: node.id,
      },
    });
  });
};
