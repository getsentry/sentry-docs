const fs = require("fs");

exports.onPostBuild = async ({ graphql }, { source, output }) => {
  console.info(`Building wizard output from '${source}' source`);
  const results = await graphql(
    `
      query wizardFiles($source: String!) {
        allFile(filter: { sourceInstanceName: { eq: $source } }) {
          edges {
            node {
              childMarkdownRemark {
                html
                fields {
                  slug
                }
                frontmatter {
                  name
                  doc_link
                  support_level
                  type
                }
              }
            }
          }
        }
      }
    `,
    {
      source: source,
    }
  );

  const nodes = results.data.allFile.edges.map(
    (e) => e.node.childMarkdownRemark
  );
  if (!nodes.length) {
    console.warn("No platform data found for wizard!");
    return;
  }

  await writeJson(output, nodes);
};

const writeJson = async (path, nodes) => {
  const platforms = {};
  nodes.forEach((n) => {
    const pathMatch = n.fields.slug.match(/^\/([^\/]+)(?:\/([^\/]+))?\/$/);
    if (!pathMatch) throw new Error("cant identify language");
    const [_, main, sub] = pathMatch;
    if (!platforms[main]) platforms[main] = {};
    if (!n.frontmatter.doc_link) {
      throw new Error(`Invalid wizard frontmatter found in ${n.fields.slug}`);
    }
    const data = {
      type: n.frontmatter.type,
      details: sub ? `${main}/${sub}.json` : `${main}.json`,
      doc_link: n.frontmatter.doc_link,
      name: n.frontmatter.name,
    };
    if (sub) platforms[main][sub] = data;
    else platforms[main]["_self"] = data;
  });

  console.info(`Writing '_index.json'`);
  await fs.mkdir(path, { recursive: true }, (err) => {
    if (err) throw err;
  });
  await fs.writeFile(
    `${path}/_index.json`,
    JSON.stringify({ platforms }),
    (err) => {
      if (err) throw err;
    }
  );

  nodes.forEach(async (node) => {
    const pathMatch = node.fields.slug.match(/^\/([^\/]+)(?:\/([^\/]+))?\/$/);
    const [_, main, sub] = pathMatch;

    console.info(`Writing '${sub ? `${main}/${sub}.json` : `${main}.json`}'`);
    if (sub) {
      await fs.mkdir(`${path}/${main}`, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }

    await writeNode(
      sub ? `${path}/${main}/${sub}.json` : `${path}/${main}.json`,
      node
    );
  });
  console.log(`Wizard recorded ${nodes.length} platform snippets`);
};

const writeNode = async (path, node) => {
  await fs.writeFile(
    path,
    JSON.stringify({
      type: node.frontmatter.type,
      support_level: node.frontmatter.support_level,
      doc_link: node.frontmatter.doc_link,
      name: node.frontmatter.name,
      body: node.html,
    }),
    (err) => {
      if (err) throw err;
    }
  );
};
