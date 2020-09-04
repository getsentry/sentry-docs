import { Node } from "gatsby";

const DEFAULT_CASE_STYLE = "canonical";

const DEFAULT_SUPPORT_LEVEL = "production";

type Frontmatter = {
  title?: string;
  caseStyle?: string;
  supportLevel?: string;
  sdk?: string;
  fallbackPlatform?: string;
  categories?: string[];
};

type PlatformMdx = {
  frontmatter: Frontmatter;
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
  node: PlatformNode;
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

export const sourcePlatformNodes = async ({
  actions,
  getNode,
  getNodesByType,
  reporter,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  const nodes: PlatformNode[] = getNodesByType("File")
    .filter((n: any) => n.sourceInstanceName === "platforms")
    .map((node: PlatformNode) => {
      const newNode = {
        ...node,
      };
      node.children.forEach((childId: string) => {
        const child = getNode(childId);
        newNode[`child${child.internal.type}`] = child;
      });
      return newNode;
    });

  const { platforms } = buildPlatformData(
    nodes
      .map((node: PlatformNode) => {
        const newNode = {
          ...node,
        };
        node.children.forEach((childId: string) => {
          const child = getNode(childId);
          newNode[`child${child.internal.type}`] = child;
        });
        return newNode;
      })
      .filter((n: PlatformNode) => !!n.childMdx)
  );

  Object.keys(platforms).forEach(platformName => {
    reporter.info(`Registering platform ${platformName}`);
    const platformData = platforms[platformName];
    const frontmatter = platformData.node.childMdx.frontmatter;
    if (!frontmatter.categories) {
      reporter.warn(`${platformName}: Missing categories`);
    }
    if (!frontmatter.caseStyle) {
      reporter.warn(`${platformName}: Missing caseStyle`);
    }
    if (!frontmatter.supportLevel) {
      reporter.warn(`${platformName}: Missing supportLevel`);
    }
    if (!frontmatter.title) {
      reporter.warn(`${platformName}: Missing title`);
    }

    const data = {
      key: platformName,
      name: platformName,
      title: frontmatter.title || toTitleCase(platformName),
      sdk: frontmatter.sdk,
      caseStyle: frontmatter.caseStyle || DEFAULT_CASE_STYLE,
      supportLevel: frontmatter.supportLevel || DEFAULT_SUPPORT_LEVEL,
      fallbackPlatform: frontmatter.fallbackPlatform,
      categories: frontmatter.categories || [],
      url: `/platforms/${platformName}/`,
      guides: Object.entries(platformData.guides)
        .map(([guideName, guide]) => {
          const guideFrontmatter = guide.node.childMdx.frontmatter;
          return {
            key: `${platformName}.${guideName}`,
            name: guideName,
            title: guideFrontmatter.title || toTitleCase(guideName),
            sdk: guideFrontmatter.sdk || frontmatter.sdk,
            caseStyle:
              guideFrontmatter.caseStyle ||
              frontmatter.caseStyle ||
              DEFAULT_CASE_STYLE,
            supportLevel:
              guideFrontmatter.supportLevel ||
              frontmatter.supportLevel ||
              DEFAULT_SUPPORT_LEVEL,
            fallbackPlatform:
              guideFrontmatter.fallbackPlatform ||
              frontmatter.fallbackPlatform ||
              platformName,
            categories:
              guideFrontmatter.categories || frontmatter.categories || [],
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
        // mediaType: `text/html`,
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
