export default async ({ actions, graphql, reporter }) => {
  const component = require.resolve(
    `../../templates/developmentApiReference.js`
  );
  await actions.createPage({
    path: `/development-api/`,
    component,
    context: {
      title: "API Reference"
    },
  });
};
