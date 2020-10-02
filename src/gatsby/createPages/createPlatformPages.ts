import { Node } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";

import PlatformRegistry, {
  Platform,
  Guide,
} from "../../shared/platformRegistry";
import { getChild, getDataOrPanic } from "../helpers";

type PlatformPages = {
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

const buildPlatformPages = (nodes: any[]) => {
  const data: PlatformPages = {
    platforms: {},
    common: nodes.filter(node => getPlatfromFromNode(node) === "common"),
  };
  const platforms = data.platforms;

  // build up `platforms` data
  nodes.forEach((node: any) => {
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

    if (
      !isCommon &&
      (node.relativePath === "index.mdx" || node.relativePath === "index.md")
    ) {
      return;
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

const canInclude = (
  node: Node,
  platformName: string,
  guideName?: string
): boolean => {
  const canonical = guideName ? `${platformName}.${guideName}` : platformName;
  const { frontmatter } = getChild(node);
  if (frontmatter.supported && frontmatter.supported.length) {
    if (frontmatter.supported.indexOf(canonical) !== -1) return true;
    if (frontmatter.supported.indexOf(platformName) === -1) return false;
  }
  if (
    frontmatter.notSupported &&
    (frontmatter.notSupported.indexOf(canonical) !== -1 ||
      frontmatter.notSupported.indexOf(platformName) !== -1)
  ) {
    return false;
  }
  return true;
};

export default async ({ actions, graphql, reporter, getNode }) => {
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
              description
              draft
              noindex
              notoc
              sidebar_order
              redirect_from
              supported
              notSupported
              keywords
            }
            excerpt(pruneLength: 5000)
          }
          childMdx {
            frontmatter {
              title
              description
              draft
              noindex
              notoc
              sidebar_order
              redirect_from
              supported
              notSupported
              keywords
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

  const platformRegistry = new PlatformRegistry();
  await platformRegistry.init();

  // filter out nodes with no markdown content
  const { common, platforms } = buildPlatformPages(
    nodes.filter((n: any) => getChild(n))
  );

  // begin creating pages from `platforms`
  const component = require.resolve(`../../templates/platform.tsx`);

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
        ...Object.fromEntries(
          Object.entries(child.frontmatter).filter(
            ([, value]) => value !== undefined && value
          )
        ),
        ...Object.fromEntries(
          Object.entries(context).filter(
            ([, value]) => value !== undefined && value
          )
        ),
        id: node.id,
      },
    });
  };

  const createPlatformPages = (
    platform: Platform,
    platformData,
    sharedCommon: Node[]
  ) => {
    if (!platformData) {
      throw new Error(`No data for ${platform.key}`);
    }

    const platformPageContext = {
      platform: {
        name: platform.name,
        title: platform.title,
      },
    };
    const pathRoot = platform.url;

    // duplicate global common
    sharedCommon.forEach((node: Node) => {
      if (!canInclude(node, platform.name)) return;
      const path = `/platforms${createFilePath({ node, getNode }).replace(
        /^\/common\//,
        `/${platform.name}/`
      )}`;
      reporter.verbose(`Creating global common for ${platform.key}: ${path}`);
      createPlatformPage(node, path, {
        ...platformPageContext,
        title: path === pathRoot ? platform.title : undefined,
        // TODO(dcramer): toc is broken for hidden sections
        notoc: true,
      });
    });

    // duplicate platform common
    platformData.common.forEach((node: Node) => {
      if (!canInclude(node, platform.name)) return;
      const path = `/platforms${createFilePath({ node, getNode }).replace(
        /^\/[^\/]+\/common\//,
        `/${platform.name}/`
      )}`;
      reporter.verbose(
        `Creating platform common for ${platform.name}: ${path}`
      );
      createPlatformPage(node, path, {
        ...platformPageContext,
        title: path === pathRoot ? platform.title : undefined,
        // TODO(dcramer): toc is broken for hidden sections
        notoc: true,
      });
    });

    // create all direct children
    platformData.children.forEach((node: Node) => {
      const path = `/platforms${createFilePath({ node, getNode })}`;
      reporter.verbose(`Creating child for ${platform.key}: ${path}`);
      createPlatformPage(node, path, platformPageContext);
    });

    // create platform root
    // TODO(dcramer): we'd like to create keywords based on aliases for the index page
    if (platformData.node) {
      reporter.verbose(`Creating root for ${platform.key}: ${pathRoot}`);
      createPlatformPage(platformData.node, pathRoot, {
        ...platformPageContext,
        title: platform.title,
      });
    }

    // create guide roots
    platform.guides.forEach(guide => {
      createPlatformGuidePages(
        platform,
        platformData,
        guide,
        platformData.guides[guide.name],
        sharedCommon,
        platformPageContext
      );
    });
  };

  const createPlatformGuidePages = (
    platform: Platform,
    platformData,
    guide: Guide,
    guideData,
    sharedCommon: Node[],
    sharedContext: { [key: string]: any }
  ) => {
    const guidePageContext = {
      ...sharedContext,
      guide: {
        name: guide.name,
        title: guide.title,
      },
    };

    const pathRoot = guide.url;

    // duplicate global common
    sharedCommon.forEach((node: Node) => {
      if (!canInclude(node, platform.name, guide.name)) return;
      const path = `${createFilePath({ node, getNode }).replace(
        /^\/common\//,
        pathRoot
      )}`;
      reporter.verbose(`Creating global common for ${guide.key}: ${path}`);
      // XXX: we dont index or add redirects for guide-common pages
      createPlatformPage(node, path, {
        ...guidePageContext,
        title: path === pathRoot ? guide.title : undefined,
        noindex: true,
        // TODO(dcramer): toc is broken for hidden sections
        notoc: true,
        redirect_from: [],
      });
    });

    // duplicate platform common
    platformData.common.forEach((node: Node) => {
      if (!canInclude(node, platform.name, guide.name)) return;
      const path = `${createFilePath({ node, getNode }).replace(
        /^\/[^\/]+\/common\//,
        pathRoot
      )}`;
      reporter.verbose(`Creating common for ${guide.key}: ${path}`);
      // XXX: we dont index or add redirects for guide-common pages
      createPlatformPage(node, path, {
        ...guidePageContext,
        title: path === pathRoot ? guide.title : undefined,
        noindex: true,
        // TODO(dcramer): toc is broken for hidden sections
        notoc: true,
        redirect_from: [],
      });
    });

    // create all direct children
    if (guideData) {
      guideData.children.forEach((node: Node) => {
        const path = `/platforms${createFilePath({ node, getNode })}`;
        reporter.verbose(`Creating child for ${guide.key}: ${path}`);
        createPlatformPage(node, path, guidePageContext);
      });
    }

    // create guide root
    // TODO(dcramer): we'd like to create keywords based on aliases for the index page
    if (guideData && guideData.node) {
      reporter.verbose(`Creating platform root for ${guide.key}: ${pathRoot}`);
      createPlatformPage(guideData.node, pathRoot, {
        ...guidePageContext,
        title: guide.title,
      });
    }
  };

  platformRegistry.platforms.forEach(platform => {
    createPlatformPages(platform, platforms[platform.name], common);
  });

  const indexPage = nodes.find(n => n.relativePath === "index.mdx");
  if (indexPage) {
    actions.createPage({
      path: "/platforms/",
      component: require.resolve(`../../templates/doc.tsx`),
      context: {
        title: "Platforms",
        ...getChild(indexPage).frontmatter,
        id: indexPage.id,
      },
    });
  }
};
