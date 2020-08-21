import { Node } from "gatsby";

import { createFilePath } from "gatsby-source-filesystem";

const getChild = (node: any) => {
  return node.childMarkdownRemark || node.childMdx;
};

const getDataOrPanic = async (query, graphql, reporter) => {
  const { data, errors } = await graphql(query);
  if (errors) {
    reporter.panicOnBuild(`🚨  ERROR: ${errors}`);
  }
  return data;
};

type PlatformData = {
  platforms: {
    [key: string]: {
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
  };
  common: Node[];
};

const getPlatfromFromNode = (node: any): string | null => {
  const match = node.relativePath.match(/^([^\/]+)\//);
  return match ? match[1] : null;
};

const getGuideFromNode = (node: any): string | null => {
  const match = node.relativePath.match(/^[^\/]+\/guides\/([^\/]+)\//);
  return match ? match[1] : null;
};

const isCommonNode = (node: any): boolean => {
  return !!node.relativePath.match(/^[^\/]+\/common\//);
};

const isRootNode = (node: any): boolean => {
  return !!node.relativePath.match(/^([^\/]+)\/index\.mdx?$/);
};

const isGuideRoot = (node: any): boolean => {
  return !!node.relativePath.match(/^([^\/]+)\/guides\/([^\/]+)\/index\.mdx?$/);
};

const buildPlatformData = (nodes: any[]) => {
  const data: PlatformData = {
    platforms: {},
    common: nodes.filter(node => {
      getPlatfromFromNode(node) === "common";
    }),
  };
  const platforms = data.platforms;

  // build up `platforms` data
  nodes.forEach((node: any) => {
    if (node.relativePath === "index.mdx" || node.relativePath === "index.md") {
      return;
    }

    const platformName = getPlatfromFromNode(node);
    if (platformName === "common") {
      return;
    }
    const guideName = getGuideFromNode(node);
    const isCommon = !guideName && isCommonNode(node);
    const isRoot = !guideName && !isCommon && isRootNode(node);
    const isIntegrationRoot = guideName && isGuideRoot(node);

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
  return data;
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
      data.allApiDoc.nodes.map(async (node: any) => {
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
                draft
                noindex
                sidebar_order
                redirect_from
              }
              fields {
                slug
                legacy
              }
              excerpt(pruneLength: 5000)
            }
            childMdx {
              frontmatter {
                title
                draft
                noindex
                sidebar_order
                redirect_from
              }
              fields {
                slug
                legacy
              }
              excerpt(pruneLength: 5000)
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
      data.allFile.nodes.map(async (node: any) => {
        const child = getChild(node);
        if (child && child.fields) {
          actions.createPage({
            path: child.fields.slug,
            component,
            context: {
              excerpt: child.excerpt,
              ...child.frontmatter,
              id: node.id,
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
                  draft
                  noindex
                  sidebar_order
                  redirect_from
                }
                fields {
                  slug
                }
                excerpt(pruneLength: 5000)
              }
              childMdx {
                frontmatter {
                  title
                  draft
                  noindex
                  sidebar_order
                  redirect_from
                }
                fields {
                  slug
                }
                excerpt(pruneLength: 5000)
              }
            }
          }
        }
      `,
      graphql,
      reporter
    );

    // filter out nodes with no markdown content
    const { common, platforms } = buildPlatformData(
      nodes.filter((n: any) => getChild(n))
    );

    // begin creating pages from `platforms`
    const component = require.resolve(`../components/pages/platform.js`);

    const createPlatformPage = (
      node: any,
      path: string,
      context: { [key: string]: any }
    ) => {
      const child = getChild(node);
      actions.createPage({
        path: path,
        component,
        context: {
          excerpt: child.excerpt,
          ...child.frontmatter,
          ...context,
          id: node.id,
        },
      });
    };

    const createPlatformPages = (
      platformName: string,
      platformData,
      sharedCommon
    ) => {
      if (!platformData.node) {
        throw new Error(`No node identified as root for ${platformName}`);
      }
      const platformPageContext = {
        platform: {
          name: platformName,
          title: getChild(platformData.node).frontmatter.title,
        },
      };

      const path = `/platforms${createFilePath({
        node: platformData.node,
        getNode,
      })}`;
      console.info(`Creating platform root for ${platformName}: ${path}`);
      createPlatformPage(platformData.node, path, platformPageContext);

      // duplicate global common
      sharedCommon.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode }).replace(
          /^\/common\//,
          `/${platformName}/`
        )}`;
        console.info(`Creating global common for ${platformName}: ${path}`);
        createPlatformPage(node, path, platformPageContext);
      });

      // duplicate platform common
      platformData.common.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode }).replace(
          /^\/[^\/]+\/common\//,
          `/${platformName}/`
        )}`;
        console.info(`Creating platform common for ${platformName}: ${path}`);
        createPlatformPage(node, path, platformPageContext);
      });

      // LAST (to allow overrides) create all direct children
      platformData.children.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode })}`;
        console.info(`Creating platform child for ${platformName}: ${path}`);
        createPlatformPage(node, path, platformPageContext);
      });

      // create guide roots
      Object.keys(platformData.guides).forEach(guideName => {
        createPlatformGuidePages(
          platformName,
          platformData,
          guideName,
          platformData.guides[guideName],
          sharedCommon,
          platformPageContext
        );
      });
    };

    const createPlatformGuidePages = (
      platformName: string,
      platformData,
      guideName: string,
      guideData,
      sharedCommon: any[],
      sharedContext
    ) => {
      if (!guideData.node) {
        throw new Error(
          `No node identified as root for ${platformName} -> ${guideName}`
        );
      }

      const guidePageContext = {
        guide: {
          name: guideName,
          title: getChild(guideData.node).frontmatter.title,
        },
        ...sharedContext,
      };

      const pathRoot = `/platforms${createFilePath({
        node: guideData.node,
        getNode,
      })}`;
      console.info(
        `Creating platform root for ${platformName} -> ${guideName}: ${pathRoot}`
      );
      createPlatformPage(guideData.node, pathRoot, guidePageContext);

      // duplicate global common
      sharedCommon.forEach(node => {
        const path = `${createFilePath({ node, getNode }).replace(
          /^\/common\//,
          pathRoot
        )}`;
        console.info(`Creating global common for ${platformName}: ${path}`);
        // XXX: we dont index or add redirects for guide-common pages
        createPlatformPage(node, path, {
          ...guidePageContext,
          noindex: true,
          redirect_from: [],
        });
      });

      // duplicate platform common
      platformData.common.forEach(node => {
        const path = `${createFilePath({ node, getNode }).replace(
          /^\/[^\/]+\/common\//,
          pathRoot
        )}`;
        console.info(
          `Creating platform common for ${platformName} -> ${guideName}: ${path}`
        );
        // XXX: we dont index or add redirects for guide-common pages
        createPlatformPage(node, path, {
          ...guidePageContext,
          noindex: true,
          redirect_from: [],
        });
      });

      // LAST (to allow overrides) create all direct children
      guideData.children.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode })}`;
        console.info(
          `Creating platform child for ${platformName} -> ${guideName}: ${path}`
        );
        createPlatformPage(node, path, guidePageContext);
      });
    };

    Object.keys(platforms).forEach(platformName => {
      createPlatformPages(platformName, platforms[platformName], common);
    });
  };

  await Promise.all([createApi(), createDocs(), createPlatformDocs()]);
}
