import { getChild, getDataOrPanic } from "../helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        allFile(filter: { sourceInstanceName: { eq: "wizard" } }) {
          nodes {
            id
            relativePath
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
    component: require.resolve(`../../templates/wizardDebugIndex.tsx`),
    context: {
      noindex: true,
      title: "Wizard Previews",
    },
  });

  const component = require.resolve(`../../templates/wizardDebug.tsx`);
  data.allFile.nodes.map((node: any) => {
    const child = getChild(node);
    if (!child) {
      throw new Error(
        `Wziard cannot find child for ${node.id} = ${node.relativePath}`
      );
    }
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
