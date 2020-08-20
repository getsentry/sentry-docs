import { Node } from "gatsby";

import { createFilePath } from "gatsby-source-filesystem";

const getChild = node => {
  return node.childMarkdownRemark || node.childMdx;
};

const getDataOrPanic = async (query, graphql, reporter) => {
  const { data, errors } = await graphql(query);
  if (errors) {
    reporter.panicOnBuild(`🚨  ERROR: ${errors}`);
  }
  return data;
};

const buildPlatformData = nodes => {
  const platforms: { [key: string]: PlatformData } = {};

  // build up `platforms` data
  nodes.forEach((node: any) => {
    if (node.relativePath === "index.mdx" || node.relativePath === "index.md") {
      return;
    }

    let match;

    const platformName = node.relativePath.match(/^([^\/]+)\//)[1];
    const guideName = (match = node.relativePath.match(
      /^[^\/]+\/guides\/([^\/]+)\//
    ))
      ? match[1]
      : null;
    const isCommon =
      !guideName && !!node.relativePath.match(/^[^\/]+\/common\//);
    const isRoot =
      !guideName &&
      !isCommon &&
      node.relativePath.match(/^([^\/]+)\/index\.mdx?$/);
    const isIntegrationRoot =
      guideName &&
      node.relativePath.match(/^([^\/]+)\/guides\/([^\/]+)\/index\.mdx?$/);

    if (!platforms[platformName]) {
      platforms[platformName] = {
        node: null,
        children: [],
        guides: {},
        common: [],
      };
    }
    const pData = platforms[platformName];
    if (isRoot) {
      pData.node = node;
    } else if (isCommon) {
      pData.common.push(node);
    } else if (guideName) {
      if (!pData.guides[guideName]) {
        pData.guides[guideName] = {
          node: null,
          children: [],
        };
      }
      const iData = pData.guides[guideName];
      if (isIntegrationRoot) {
        iData.node = node;
      } else {
        iData.children.push(node);
      }
    } else {
      pData.children.push(node);
    }
  });
  return platforms;
};

type PlatformData = {
  node: Node;
  children: Node[];
  guides: {
    [name: string]: {
      node: Node;
      children: Node[];
    };
  };
  common: Node[];
};

export default async function({ actions, getNode, graphql, reporter }) {
  const createApi = async () => {
    const data = await getDataOrPanic(
      `
      query {
        allApiDoc {
          nodes {
            id
            title
            fields {
              slug
            }
          }
        }
      }
    `,
      graphql,
      reporter
    );

    const component = require.resolve(`../components/pages/api.js`);
    await Promise.all(
      data.allApiDoc.nodes.map(async node => {
        actions.createPage({
          path: node.fields.slug,
          component,
          context: {
            id: node.id,
            title: node.title,
          },
        });
      })
    );
  };

  const createDocs = async () => {
    const data = await getDataOrPanic(
      `
      query {
        allFile(filter: { sourceInstanceName: { eq: "docs" } }) {
          nodes {
            id
            childMarkdownRemark {
              frontmatter {
                title
              }
              fields {
                slug
              }
            }
            childMdx {
              frontmatter {
                title
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

    const component = require.resolve(`../components/pages/doc.js`);
    await Promise.all(
      data.allFile.nodes.map(async node => {
        const child = getChild(node);
        if (child && child.fields) {
          actions.createPage({
            path: child.fields.slug,
            component,
            context: {
              id: node.id,
              title: child.frontmatter.title,
              sidebar_order: child.frontmatter.sidebar_order,
              draft: child.frontmatter.draft,
            },
          });
        }
      })
    );
  };

  const createPlatformDocs = async () => {
    const {
      allFile: { nodes },
    } = await getDataOrPanic(
      `
        query {
          allFile(filter: { sourceInstanceName: { eq: "platforms" } }) {
            nodes {
              id
              relativePath
              internal {
                type
              }
              childMarkdownRemark {
                frontmatter {
                  title
                }
                fields {
                  slug
                }
              }
              childMdx {
                frontmatter {
                  title
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

    // filter out nodes with no markdown content
    const platforms = buildPlatformData(nodes.filter(n => getChild(n)));

    // begin creating pages from `platforms`
    const component = require.resolve(`../components/pages/platform.js`);

    Object.keys(platforms).forEach(platformName => {
      const pData = platforms[platformName];
      if (!pData.node) {
        throw new Error(`No node identified as root for ${platformName}`);
      }
      const platformPageContext = {
        platform: {
          name: platformName,
          title: getChild(pData.node).frontmatter.title,
        },
      };

      console.info(`Creating platform pages for ${platformName}`);

      // create the root page for the platform
      actions.createPage({
        path: `/platforms${createFilePath({ node: pData.node, getNode })}`,
        component,
        context: {
          id: pData.node.id,
          title: getChild(pData.node).frontmatter.title,
          sidebar_order: getChild(pData.node).frontmatter.sidebar_order,
          ...platformPageContext,
        },
      });

      // duplicate common for platform (similar behavior to guide common)
      pData.common.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode }).replace(
          /^\/[^\/]+\/common\//,
          `/${platformName}/`
        )}`;
        console.info(`Creating platform common for ${platformName}: ${path}`);
        actions.createPage({
          path,
          component,
          context: {
            id: node.id,
            title: getChild(node).frontmatter.title,
            sidebar_order: getChild(node).frontmatter.sidebar_order,
            ...platformPageContext,
          },
        });
      });

      // LAST (to allow overrides) create all direct children (similar behavior to guide children)
      pData.children.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode })}`;
        console.info(`Creating platform child for ${platformName}: ${path}`);
        actions.createPage({
          path,
          component,
          context: {
            id: node.id,
            title: getChild(node).frontmatter.title,
            sidebar_order: getChild(node).frontmatter.sidebar_order,
            ...platformPageContext,
          },
        });
      });

      // create guide roots
      Object.keys(pData.guides).forEach(guideName => {
        const iData = pData.guides[guideName];
        if (!iData.node) {
          throw new Error(
            `No node identified as root for ${platformName} -> ${guideName}`
          );
        }

        const guidePageContext = {
          guide: {
            name: guideName,
            title: getChild(iData.node).frontmatter.title,
          },
          ...platformPageContext,
        };

        console.info(
          `Creating platform pages for ${platformName} -> ${guideName}`
        );
        actions.createPage({
          path: `/platforms${createFilePath({ node: iData.node, getNode })}`,
          component,
          context: {
            id: iData.node.id,
            title: getChild(iData.node).frontmatter.title,
            sidebar_order: getChild(iData.node).frontmatter.sidebar_order,
            ...guidePageContext,
          },
        });

        // duplicate common for guide
        pData.common.forEach(node => {
          const path = `/platforms${createFilePath({ node, getNode }).replace(
            /^\/[^\/]+\/common\//,
            `/${platformName}/guides/${guideName}/`
          )}`;
          console.info(
            `Creating platform common for ${platformName} -> ${guideName}: ${path}`
          );
          actions.createPage({
            path,
            component,
            context: {
              id: node.id,
              title: getChild(node).frontmatter.title,
              ...guidePageContext,
            },
          });
        });

        // LAST (to allow overrides) create guide children
        iData.children.forEach(node => {
          const path = `/platforms${createFilePath({ node, getNode })}`;
          console.info(
            `Creating platform child for ${platformName} -> ${guideName}: ${path}`
          );
          actions.createPage({
            path,
            component,
            context: {
              id: node.id,
              title: getChild(node).frontmatter.title,
              sidebar_order: getChild(node).frontmatter.sidebar_order,
              ...guidePageContext,
            },
          });
        });
      });
    });
  };

  await Promise.all([createApi(), createDocs(), createPlatformDocs()]);
}
