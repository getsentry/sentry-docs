import path from "path";
import { Node } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";

import PlatformRegistry, {
  Platform,
  Guide,
} from "../../shared/platformRegistry";
import { getChild, getDataOrPanic } from "../helpers";

type FileNode = Node & {
  relativePath: string;
};

type PlatformPages = {
  platforms: {
    [key: string]: {
      node: FileNode;
      children: FileNode[];
      guides: {
        [name: string]: {
          node: FileNode;
          children: FileNode[];
        };
      };
      common: FileNode[];
    };
  };
  common: FileNode[];
};

type PageContext = {
  [key: string]: any;
};

type PageData = [FileNode, string, PageContext];

const getPlatfromFromNode = (node: FileNode): string | null => {
  const match = node.relativePath.match(/^([^\/]+)\//);
  return match ? match[1] : null;
};

const getGuideFromNode = (node: FileNode): string | null => {
  const match = node.relativePath.match(/^[^\/]+\/guides\/([^\/]+)\//);
  return match ? match[1] : null;
};

const isCommonNode = (node: FileNode): boolean => {
  return !!node.relativePath.match(/^[^\/]+\/common\//);
};

const isRootNode = (node: FileNode): boolean => {
  return !!node.relativePath.match(/^([^\/]+)\/index\.mdx?$/);
};

const isGuideRoot = (node: FileNode): boolean => {
  return !!node.relativePath.match(/^([^\/]+)\/guides\/([^\/]+)\/index\.mdx?$/);
};

/**
 * Used to test if a parent page exists for a child. This is used to avoid creation
 * of children when a parent is hidden.
 *
 * e.g. /performance/ is notSupported, so theres no need to mark /performance/sampling/
 * as notSupported.
 */
const hasIndex = (pathRoot: string, pages: PageData[], pagePath: string) => {
  if (pathRoot === pagePath) return true;
  const prefix = path.dirname(pagePath) + "/";
  return prefix === pathRoot || !!pages.find(p => p[1] === prefix);
};

const buildPlatformPages = (nodes: FileNode[]) => {
  const data: PlatformPages = {
    platforms: {},
    common: nodes.filter(node => getPlatfromFromNode(node) === "common"),
  };
  const platforms = data.platforms;

  // build up `platforms` data
  nodes.forEach((node: FileNode) => {
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
  node: FileNode,
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
  }: {
    allFile: {
      nodes: FileNode[];
    };
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
              sidebar_title
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
              sidebar_title
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
    nodes.filter((n: FileNode) => getChild(n))
  );

  // begin creating pages from `platforms`
  const component = require.resolve(`../../templates/platform.tsx`);

  const createPlatformPage = (
    node: FileNode,
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
    sharedCommon: FileNode[]
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

    const pages: PageData[] = [];

    // duplicate global common
    sharedCommon.forEach(node => {
      if (!canInclude(node, platform.name)) return;
      const path = `/platforms${createFilePath({ node, getNode }).replace(
        /^\/common\//,
        `/${platform.name}/`
      )}`;
      reporter.verbose(`${platform.key}: Creating global common - ${path}`);
      pages.push([
        node,
        path,
        {
          ...platformPageContext,
          title: path === pathRoot ? platform.title : undefined,
        },
      ]);
    });

    // duplicate platform common
    platformData.common.forEach(node => {
      if (!canInclude(node, platform.name)) return;
      const path = `/platforms${createFilePath({ node, getNode }).replace(
        /^\/[^\/]+\/common\//,
        `/${platform.name}/`
      )}`;
      reporter.verbose(`${platform.key}: Creating platform common - ${path}`);
      pages.push([
        node,
        path,
        {
          ...platformPageContext,
          title: path === pathRoot ? platform.title : undefined,
        },
      ]);
    });

    // create all direct children
    platformData.children.forEach(node => {
      const path = `/platforms${createFilePath({ node, getNode })}`;
      reporter.verbose(`${platform.key}: Creating child - ${path}`);
      pages.push([node, path, platformPageContext]);
    });

    // create platform root
    // TODO(dcramer): we'd like to create keywords based on aliases for the index page
    if (platformData.node) {
      reporter.verbose(`${platform.key}: Creating root - ${pathRoot}`);
      pages.push([
        platformData.node,
        pathRoot,
        {
          ...platformPageContext,
          title: platform.title,
        },
      ]);
    }

    pages.sort((a, b) => a[1].localeCompare(b[1]));

    pages.forEach(([node, path, context]) => {
      if (!hasIndex(pathRoot, pages, path)) {
        reporter.verbose(
          `${platform.key}: Hiding child due to missing parent - ${path}`
        );
        return;
      }
      createPlatformPage(node, path, context);
    });

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
    sharedCommon: FileNode[],
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

    const pages: PageData[] = [];

    // duplicate global common
    sharedCommon.forEach(node => {
      if (!canInclude(node, platform.name, guide.name)) return;
      const path = `${createFilePath({ node, getNode }).replace(
        /^\/common\//,
        pathRoot
      )}`;
      reporter.verbose(`${guide.key}: Creating global common - ${path}`);
      // XXX: we dont index or add redirects for guide-common pages
      pages.push([
        node,
        path,
        {
          ...guidePageContext,
          title: path === pathRoot ? guide.title : undefined,
          noindex: true,
          redirect_from: [],
        },
      ]);
    });

    // duplicate platform common
    platformData.common.forEach(node => {
      if (!canInclude(node, platform.name, guide.name)) return;
      const path = `${createFilePath({ node, getNode }).replace(
        /^\/[^\/]+\/common\//,
        pathRoot
      )}`;
      reporter.verbose(`${guide.key}: Creating common - ${path}`);
      // XXX: we dont index or add redirects for guide-common pages
      pages.push([
        node,
        path,
        {
          ...guidePageContext,
          title: path === pathRoot ? guide.title : undefined,
          noindex: true,
          redirect_from: [],
        },
      ]);
    });

    // create all direct children
    if (guideData) {
      guideData.children.forEach(node => {
        const path = `/platforms${createFilePath({ node, getNode })}`;
        reporter.verbose(`${guide.key}: Creating child - ${path}`);
        pages.push([node, path, guidePageContext]);
      });
    }

    // create guide root
    // TODO(dcramer): we'd like to create keywords based on aliases for the index page
    if (guideData && guideData.node) {
      reporter.verbose(`${guide.key}: Creating platform root - ${pathRoot}`);
      pages.push([
        guideData.node,
        pathRoot,
        {
          ...guidePageContext,
          title: guide.title,
        },
      ]);
    }

    pages.sort((a, b) => a[1].localeCompare(b[1]));

    pages.forEach(([node, path, context]) => {
      if (!hasIndex(pathRoot, pages, path)) {
        reporter.verbose(
          `${guide.key}: Hiding child due to missing parent - ${path}`
        );
        return;
      }
      createPlatformPage(node, path, context);
    });
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
