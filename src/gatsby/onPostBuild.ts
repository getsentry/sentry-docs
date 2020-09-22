import fs from "fs";
import jsdom from "jsdom";

import PlatformRegistry from "../shared/platformRegistry";

const rmDirSync = (dirPath: string) => {
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  files.forEach(file => {
    const filePath = dirPath + "/" + file;
    if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
    else rmDirSync(filePath);
  });
  fs.rmdirSync(dirPath);
};

export default async ({ graphql }) => {
  const source = "wizard";
  const output = `${__dirname}/../../public/_platforms`;

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

  const platformRegistry = new PlatformRegistry();
  await platformRegistry.init();

  const nodes = results.data.allFile.edges.map(e => e.node.childMarkdownRemark);
  if (!nodes.length) {
    const msg = "No platform data found for wizard!";
    if (process.env.JEKYLL_ENABLE_PLATFORM_API !== "false") {
      throw new Error(msg);
    }
    console.warn(msg);
    return;
  }

  await writeJson(output, nodes, platformRegistry);
};

const writeJson = async (
  path: string,
  nodes,
  platformRegistry: PlatformRegistry
) => {
  const platforms = [];
  const indexJson = {};
  nodes.forEach(node => {
    const pathMatch = node.fields.slug.match(/^\/([^/]+)(?:\/([^/]+))?\/$/);
    if (!pathMatch) throw new Error("cant identify language");
    // eslint-disable-next-line no-unused-vars
    const [, main, sub] = pathMatch;
    if (!indexJson[main]) indexJson[main] = {};
    if (!node.frontmatter.doc_link) {
      throw new Error(
        `Invalid wizard frontmatter found in ${node.fields.slug}`
      );
    }
    const key = sub ? `${main}.${sub}` : `${main}`;
    const data = {
      key,
      type: node.frontmatter.type,
      details: sub ? `${main}/${sub}.json` : `${main}.json`,
      doc_link: node.frontmatter.doc_link,
      name: node.frontmatter.name,
      aliases: [],
      categories: [],
    };

    const platform = platformRegistry.get(key);
    if (platform) {
      data.name = platform.title;
      data.aliases = platform.aliases || [];
      data.categories = platform.categories || [];
    }

    if (sub) indexJson[main][sub] = data;
    else indexJson[main]["_self"] = data;

    platforms.push({
      ...data,
      node,
    });
  });

  // remove files to ensure we're working correctly in prod
  rmDirSync(path);

  console.info(`Writing '_index.json'`);
  fs.mkdirSync(path, { recursive: true });
  fs.writeFileSync(`${path}/_index.json`, JSON.stringify({ platforms }));

  Promise.all(
    platforms.map(async data => {
      console.info(`Writing '${data.details}'`);
      if (data.details.indexOf("/") !== -1) {
        fs.mkdirSync(`${path}/${data.details.split("/", 1)[0]}`, {
          recursive: true,
        });
      }

      writeNode(`${path}/${data.details}`, data);
    })
  );
  console.log(`Wizard recorded ${nodes.length} platform snippets`);
};

const writeNode = (path: string, data) => {
  const dom = new jsdom.JSDOM(data.node.html, {
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

  const output = {
    ...Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => key !== "node" && key !== "details"
      )
    ),
    body: dom.window.document.body.innerHTML,
  };

  fs.writeFileSync(path, JSON.stringify(output));
};
