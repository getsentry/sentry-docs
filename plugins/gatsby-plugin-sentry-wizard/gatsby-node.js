const fs = require("fs");
const jsdom = require("jsdom");

const rmDirSync = function(dirPath) {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + "/" + files[i];
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDirSync(filePath);
    }
  fs.rmdirSync(dirPath);
};

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

  const nodes = results.data.allFile.edges.map(e => e.node.childMarkdownRemark);
  if (!nodes.length) {
    const msg = "No platform data found for wizard!";
    if (process.env.JEKYLL_ENABLE_PLATFORM_API !== "false") {
      throw new Error(msg);
    }
    console.warn(msg);
    return;
  }

  await writeJson(output, nodes);
};

const writeJson = async (path, nodes) => {
  const platforms = {};
  nodes.forEach(n => {
    const pathMatch = n.fields.slug.match(/^\/([^/]+)(?:\/([^/]+))?\/$/);
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

  // remove files to ensure we're working correctly in prod
  rmDirSync(path);

  console.info(`Writing '_index.json'`);
  fs.mkdirSync(path, { recursive: true });
  fs.writeFileSync(`${path}/_index.json`, JSON.stringify({ platforms }));

  Promise.all(
    nodes.map(async node => {
      const pathMatch = node.fields.slug.match(/^\/([^/]+)(?:\/([^/]+))?\/$/);
      const [_, main, sub] = pathMatch;

      console.info(`Writing '${sub ? `${main}/${sub}.json` : `${main}.json`}'`);
      if (sub) {
        fs.mkdirSync(`${path}/${main}`, { recursive: true });
      }

      writeNode(
        sub ? `${path}/${main}/${sub}.json` : `${path}/${main}.json`,
        node
      );
    })
  );
  console.log(`Wizard recorded ${nodes.length} platform snippets`);
};

const writeNode = (path, node) => {
  const dom = new jsdom.JSDOM(node.html, {
    url: "https://docs.sentry.io/",
  });
  // remove anchor svgs
  dom.window.document.querySelectorAll("a.anchor svg").forEach(node => {
    node.parentNode.parentNode.removeChild(node.parentNode);
  });

  // add highlight class
  dom.window.document
    .querySelectorAll("div.gatsby-highlight pre")
    .forEach(node => {
      node.className += " highlight";
      // TODO: Ideal, but not working
      // const div = node.parentChild;
      // div.parentChild.replaceChild(div, node);
    });

  fs.writeFileSync(
    path,
    JSON.stringify({
      type: node.frontmatter.type,
      support_level: node.frontmatter.support_level,
      doc_link: node.frontmatter.doc_link,
      name: node.frontmatter.name,
      body: dom.window.document.body.innerHTML,
    })
  );
};
