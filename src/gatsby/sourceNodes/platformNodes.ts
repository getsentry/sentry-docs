import { Node } from "gatsby";

const DEFAULT_CASE_STYLE = "canonical";

const DEFAULT_SUPPORT_LEVEL = "production";

type PlatformFrontmatter = {
  title?: string;
  caseStyle?: string;
  supportLevel?: string;
};

type PlatformMdx = {
  frontmatter: PlatformFrontmatter;
};

type PlatformNode = {
  childMdx: PlatformMdx;
  [key: string]: any;
};

type Guide = {
  node: PlatformNode;
  children: Node[];
};

type Platform = {
  node: PlatformMdx;
  children: Node[];
  guides: {
    [name: string]: Guide;
  };
  common: Node[];
};

type PlatformData = {
  platforms: {
    [key: string]: Platform;
  };
  common: Node[];
};

const toTitleCase = (value: string): string => {
  return value
    .toLowerCase()
    .split(" ")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");
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
    common: nodes.filter(node => getPlatfromFromNode(node) === "common"),
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

// const canInclude = (
//   node: Node,
//   platformName: string,
//   guideName?: string
// ): boolean => {
//   const canonical = guideName ? `${platformName}.${guideName}` : platformName;
//   const { frontmatter } = getChild(node);
//   if (
//     frontmatter.supported &&
//     frontmatter.supported.length &&
//     frontmatter.supported.indexOf(canonical) === -1 &&
//     frontmatter.supported.indexOf(platformName) === -1
//   ) {
//     return false;
//   } else if (
//     frontmatter.unsupported &&
//     (frontmatter.unsupported.indexOf(canonical) !== -1 ||
//       frontmatter.unsupported.indexOf(platformName))
//   ) {
//     return false;
//   }
//   return true;
// };

// const query = `
// query {
//   allFile(filter: { sourceInstanceName: { eq: "platforms" } }) {
//     nodes {
//       id
//       relativePath
//       childMdx {
//         frontmatter {
//           title
//           draft

//           type
//           supportLevel
//           caseStyle

//           supported
//           notSupported
//         }
//       }
//     }
//   }
// }
// `;

export const sourcePlatformNodes = async ({
  actions,
  getNode,
  getNodesByType,
  reporter,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  const nodes: PlatformNode[] = getNodesByType("File").filter(
    (n: any) => n.sourceInstanceName === "platforms"
  );

  const { platforms } = buildPlatformData(
    nodes.filter((n: PlatformNode) =>
      // Find our nodes with MDX children
      n.children.map(c => getNode(c)).find(c => c.internal.type === "Mdx")
    )
  );

  Object.keys(platforms).forEach(platformName => {
    reporter.info(`Registering platform ${platformName}`);
    const platformData = platforms[platformName];
    const { frontmatter = {} } = platformData.node;
    const data = {
      name: platformName,
      title: frontmatter.title || toTitleCase(platformName),
      caseStyle: frontmatter.caseStyle || DEFAULT_CASE_STYLE,
      supportLevel: frontmatter.supportLevel || DEFAULT_SUPPORT_LEVEL,
      url: `/platforms/${platformName}/`,
      guides: Object.entries(platformData.guides)
        .map(([guideName, guide]) => {
          const { frontmatter: guideFrontmatter = {} } = guide.node;
          return {
            name: guideName,
            title: guideFrontmatter.title || toTitleCase(guideName),
            caseStyle:
              guideFrontmatter.caseStyle ||
              frontmatter.caseStyle ||
              DEFAULT_CASE_STYLE,
            supportLevel:
              guideFrontmatter.supportLevel ||
              frontmatter.supportLevel ||
              DEFAULT_SUPPORT_LEVEL,
            fallbackPlatform: guideFrontmatter.fallbackPlatform || platformName,
            url: `/platforms/${platformName}/guides/${guideName}/`,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
    const content = JSON.stringify(data);
    const nodeMeta = {
      id: createNodeId(`platform-${platformName}`),
      parent: null,
      children: [],
      internal: {
        type: `Platform`,
        mediaType: `text/html`,
        content,
        contentDigest: createContentDigest(data),
      },
    };

    createNode({
      ...data,
      ...nodeMeta,
    });
  });
};
