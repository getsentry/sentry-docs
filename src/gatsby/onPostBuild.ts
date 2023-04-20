/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */
/* eslint-disable no-console */

import fs from 'fs';

import jsdom from 'jsdom';

import PlatformRegistry from '../shared/platformRegistry';

const rmDirSync = (dirPath: string) => {
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  files.forEach(file => {
    const filePath = dirPath + '/' + file;
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    } else {
      rmDirSync(filePath);
    }
  });
  fs.rmdirSync(dirPath);
};

export default async function onPostBuild({graphql}) {
  const source = 'wizard';
  const output = `${__dirname}/../../public/_platforms`;

  console.info(`Building wizard output from '${source}' source`);
  const results = await graphql(
    `
      query wizardFiles($source: String!) {
        allFile(filter: {sourceInstanceName: {eq: $source}}) {
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
      source,
    }
  );

  const platformRegistry = new PlatformRegistry();
  await platformRegistry.init();

  const nodes = results.data.allFile.edges.map(e => e.node.childMarkdownRemark);
  if (!nodes.length) {
    const msg = 'No platform data found for wizard!';
    if (process.env.JEKYLL_ENABLE_PLATFORM_API !== 'false') {
      throw new Error(msg);
    }
    // eslint-disable-next-line no-console
    console.warn(msg);
    return;
  }

  await writeJson(output, nodes, platformRegistry);
}

const parsePathSlug = (slug: string) => {
  if (
    slug.includes('/performance-onboarding/') ||
    slug.includes('/replay-onboarding/') ||
    slug.includes('/profiling-onboarding/')
  ) {
    const pathMatch = slug.match(
      /^\/(?<platform>[^/]+)\/(?<product>performance|replay|profiling)-onboarding\/(?<sub_platform>[^/]+)\/(?<step>[^/]+)\/$/
    );

    if (!pathMatch) {
      throw new Error(`Unable to parse onboarding path from slug: ${slug}`);
    }

    const {platform, product, sub_platform} = pathMatch.groups;
    const step = String(pathMatch.groups.step).replace(/\./g, '-');
    const sub =
      platform === sub_platform
        ? `${product}-onboarding-${step}`
        : `${sub_platform}-${product}-onboarding-${step}`;

    return {
      platform,
      sub,
    };
  }

  if (slug.match('^/javascript/([A-Za-z]+)/(.*?)/$')) {
    const pathMatch = slug.match(
      /^\/(?<platform>[^/]+)\/(?<sub_platform>[^/]+)\/(?<product>index|with-error-monitoring|with-error-monitoring-and-performance|with-error-monitoring-and-replay|with-error-monitoring-performance-and-replay)\/$/
    );

    if (!pathMatch) {
      throw new Error(`Unable to parse javascript doc paths from slug: ${slug}`);
    }

    const {platform, product, sub_platform} = pathMatch.groups;

    return {
      platform,
      sub: `${sub_platform}-${product}`,
    };
  }

  const pathMatch = slug.match(/^\/([^/]+)(?:\/([^/]+))?\/$/);

  if (!pathMatch) {
    throw new Error('cant identify language');
  }

  const [, main, sub] = pathMatch;

  return {
    platform: main,
    sub,
  };
};

const writeJson = (path: string, nodes, platformRegistry: PlatformRegistry) => {
  const platforms = [];
  const indexJson = {};
  nodes.forEach(node => {
    const {platform: main, sub} = parsePathSlug(node.fields.slug);

    if (!indexJson[main]) {
      indexJson[main] = {};
    }
    if (!node.frontmatter.doc_link) {
      // Skip invalid files
      return;
    }
    const key = sub ? `${main}.${sub}` : `${main}`;

    const data = {
      key,
      type: node.frontmatter.type,
      details: sub ? `${main}/${sub}.json` : `${main}.json`,
      doc_link: node.frontmatter.doc_link,
      wizard_setup: node.frontmatter.wizard_setup?.childMarkdownRemark?.html,
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

    if (sub) {
      indexJson[main][sub] = data;
    } else {
      indexJson[main]._self = data;
    }

    platforms.push({
      ...data,
      node,
    });
  });

  // remove files to ensure we're working correctly in prod
  rmDirSync(path);

  console.info(`Writing '_index.json'`);
  fs.mkdirSync(path, {recursive: true});
  fs.writeFileSync(`${path}/_index.json`, JSON.stringify({platforms: indexJson}));

  platforms.forEach(data => {
    console.info(`Writing '${data.details}'`);
    if (data.details.indexOf('/') !== -1) {
      fs.mkdirSync(`${path}/${data.details.split('/', 1)[0]}`, {
        recursive: true,
      });
    }

    writeNode(`${path}/${data.details}`, data);
  });
  console.log(`Wizard recorded ${nodes.length} platform snippets`);
};

const writeNode = (path: string, data) => {
  const dom = new jsdom.JSDOM(data.node.html);
  // remove anchor svgs
  dom.window.document.querySelectorAll('a.anchor svg').forEach(node => {
    node.parentNode.parentNode.removeChild(node.parentNode);
  });

  // force all urls to be absolute
  dom.window.document.querySelectorAll('a').forEach(node => {
    if (node.href.indexOf('/') === 0) {
      node.href = `https://docs.sentry.io${node.href}`;
    } else if (node.href.indexOf('https://') !== 0) {
      throw new Error(`Found invalid link in ${path}: ${node.href}`);
    }
  });

  // add highlight class
  dom.window.document.querySelectorAll('div.gatsby-highlight pre').forEach(node => {
    node.className += ' highlight';
    // TODO: Ideal, but not working
    // const div = node.parentChild;
    // div.parentChild.replaceChild(div, node);
  });

  const output = {
    ...Object.fromEntries(
      Object.entries(data).filter(([key]) => key !== 'node' && key !== 'details')
    ),
    body: dom.window.document.body.innerHTML,
  };

  fs.writeFileSync(path, JSON.stringify(output));
};
