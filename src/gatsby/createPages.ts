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
    const frameworkName = (match = node.relativePath.match(
      /^[^\/]+\/frameworks\/([^\/]+)\//
    ))
      ? match[1]
      : null;
    const isCommon =
      !frameworkName && !!node.relativePath.match(/^[^\/]+\/common\//);
    const isRoot =
      !frameworkName &&
      !isCommon &&
      node.relativePath.match(/^([^\/]+)\/index\.mdx?$/);
    const isIntegrationRoot =
      frameworkName &&
      node.relativePath.match(/^([^\/]+)\/frameworks\/([^\/]+)\/index\.mdx?$/);

    if (!platforms[platformName]) {
      platforms[platformName] = {
        node: null,
        children: [],
        frameworks: {},
        common: [],
      };
    }
    const pData = platforms[platformName];
    if (isRoot) {
      pData.node = node;
    } else if (isCommon) {
      pData.common.push(node);
    } else if (frameworkName) {
      if (!pData.frameworks[frameworkName]) {
        pData.frameworks[frameworkName] = {
          node: null,
          children: [],
        };
      }
      const iData = pData.frameworks[frameworkName];
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
  frameworks: {
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

    const platforms = buildPlatformData(nodes);

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

      // create all direct children (similar behavior to framework children)
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

      // duplicate common for platform (similar behavior to framework common)
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

      // create framework roots
      Object.keys(pData.frameworks).forEach(frameworkName => {
        const iData = pData.frameworks[frameworkName];
        if (!iData.node) {
          throw new Error(
            `No node identified as root for ${platformName} -> ${frameworkName}`
          );
        }

        const frameworkPageContext = {
          framework: {
            name: frameworkName,
            title: getChild(iData.node).frontmatter.title,
          },
          ...platformPageContext,
        };

        console.info(
          `Creating platform pages for ${platformName} -> ${frameworkName}`
        );
        actions.createPage({
          path: `/platforms${createFilePath({ node: iData.node, getNode })}`,
          component,
          context: {
            id: iData.node.id,
            title: getChild(iData.node).frontmatter.title,
            sidebar_order: getChild(iData.node).frontmatter.sidebar_order,
            ...frameworkPageContext,
          },
        });

        // create framework children
        iData.children.forEach(node => {
          const path = `/platforms${createFilePath({ node, getNode })}`;
          console.info(
            `Creating platform child for ${platformName} -> ${frameworkName}: ${path}`
          );
          actions.createPage({
            path,
            component,
            context: {
              id: node.id,
              title: getChild(node).frontmatter.title,
              sidebar_order: getChild(node).frontmatter.sidebar_order,
              ...frameworkPageContext,
            },
          });
        });

        // duplicate common for framework
        pData.common.forEach(node => {
          const path = `/platforms${createFilePath({ node, getNode }).replace(
            /^\/[^\/]+\/common\//,
            `/${platformName}/frameworks/${frameworkName}/`
          )}`;
          console.info(
            `Creating platform common for ${platformName} -> ${frameworkName}: ${path}`
          );
          actions.createPage({
            path,
            component,
            context: {
              id: node.id,
              title: getChild(node).frontmatter.title,
              ...frameworkPageContext,
            },
          });
        });
      });
    });
  };

  await Promise.all([createApi(), createDocs(), createPlatformDocs()]);
}
