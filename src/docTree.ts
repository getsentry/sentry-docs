import {getDevDocsFrontMatter, getDocsFrontMatter} from 'sentry-docs/mdx';

import {isDeveloperDocs} from './isDeveloperDocs';
import {platformsData} from './platformsData';
import {
  FrontMatter,
  Platform,
  PlatformConfig,
  PlatformGuide,
  PlatformIntegration,
} from './types';

export interface DocNode {
  children: DocNode[];
  frontmatter: FrontMatter & PlatformConfig & Pick<PlatformGuide, 'fallbackGuide'>;
  missing: boolean;
  path: string;
  slug: string;
  parent?: DocNode;
  sourcePath?: string;
}

function slugWithoutIndex(slug: string): string[] {
  const parts = slug.split('/');
  if (parts[parts.length - 1] === 'index') {
    parts.pop();
  }
  return parts;
}

let getDocsRootNodeCache: Promise<DocNode> | undefined;

export function getDocsRootNode(): Promise<DocNode> {
  if (getDocsRootNodeCache) {
    return getDocsRootNodeCache;
  }
  getDocsRootNodeCache = getDocsRootNodeUncached();
  return getDocsRootNodeCache;
}

async function getDocsRootNodeUncached(): Promise<DocNode> {
  return frontmatterToTree(
    isDeveloperDocs ? getDevDocsFrontMatter() : await getDocsFrontMatter()
  );
}

function frontmatterToTree(frontmatter: FrontMatter[]): DocNode {
  const sortedDocs = frontmatter.sort((a, b) => {
    const partDiff = slugWithoutIndex(a.slug).length - slugWithoutIndex(b.slug).length;
    if (partDiff !== 0) {
      return partDiff;
    }
    const orderDiff = (a.sidebar_order || 99999) - (b.sidebar_order || 99999);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return (a.title || '').localeCompare(b.title || '');
  });

  const rootNode: DocNode = {
    path: '/',
    slug: '',
    frontmatter: {
      title: 'Home',
      slug: 'home',
    },
    children: [],
    missing: false,
    sourcePath: isDeveloperDocs ? 'develop-docs/index.mdx' : '',
  };

  const slugMap: {[slug: string]: DocNode} = {};
  sortedDocs.forEach(doc => {
    const slugParts = slugWithoutIndex(doc.slug);
    const slug = slugParts.join('/');

    if (slugParts.length === 0) {
      rootNode.frontmatter = doc;
    } else if (slugParts.length === 1) {
      const node: DocNode = {
        path: slug,
        slug,
        frontmatter: doc,
        parent: rootNode,
        children: [],
        missing: false,
        sourcePath: doc.sourcePath,
      };
      rootNode.children.push(node);
      slugMap[slug] = node;
    } else {
      const parentSlug = slugParts.slice(0, slugParts.length - 1).join('/');
      let parent: DocNode | undefined = slugMap[parentSlug];
      if (!parent) {
        const grandparentSlug = slugParts.slice(0, slugParts.length - 2).join('/');
        const grandparent = slugMap[grandparentSlug];
        if (!grandparent) {
          throw new Error('missing parent and grandparent: ' + parentSlug);
        }
        parent = {
          path: parentSlug,
          slug: slugParts[slugParts.length - 2],
          frontmatter: {
            slug: slugParts[slugParts.length - 2],
            // not ideal
            title: '',
          },
          parent: grandparent,
          children: [],
          missing: true,
        };
        grandparent.children.push(parent);
        slugMap[parentSlug] = parent;
      }
      const node = {
        path: slug,
        slug: slugParts[slugParts.length - 1],
        frontmatter: doc,
        parent,
        children: [],
        missing: false,
        sourcePath: doc.sourcePath,
      };
      parent.children.push(node);
      slugMap[slug] = node;
    }
  });

  return rootNode;
}

export function nodeForPath(node: DocNode, path: string | string[]): DocNode | undefined {
  const stringPath = typeof path === 'string' ? path : path.join('/');
  const parts = slugWithoutIndex(stringPath);
  for (let i = 0; i < parts.length; i++) {
    const maybeChild = node.children.find(child => child.slug === parts[i]);
    if (maybeChild) {
      node = maybeChild;
    } else {
      return undefined;
    }
  }
  return node;
}

function nodeToPlatform(n: DocNode): Platform {
  const platformData = platformsData()[n.slug];
  const caseStyle = platformData?.case_style || n.frontmatter.caseStyle;
  const guides = extractGuides(n);
  const integrations = extractIntegrations(n);

  return {
    key: n.slug,
    name: n.slug,
    type: 'platform',
    url: '/' + n.path + '/',
    title: n.frontmatter.title,
    caseStyle,
    sdk: n.frontmatter.sdk,
    fallbackPlatform: n.frontmatter.fallbackPlatform,
    categories: n.frontmatter.categories,
    keywords: n.frontmatter.keywords,
    guides,
    integrations,
  };
}

function nodeToGuide(platform: string, n: DocNode): PlatformGuide {
  const key = `${platform}.${n.slug}`;
  return {
    key,
    name: n.slug,
    type: 'guide',
    url: '/' + n.path + '/',
    title: n.frontmatter.title,
    platform,
    sdk: n.frontmatter.sdk || `sentry.${key}`,
    categories: n.frontmatter.categories,
    fallbackGuide: n.frontmatter.fallbackGuide,
  };
}

export function getPlatform(rootNode: DocNode, name: string): Platform | undefined {
  const platformNode = nodeForPath(rootNode, ['platforms', name]);
  if (!platformNode) {
    return undefined;
  }
  return nodeToPlatform(platformNode);
}

export function getCurrentPlatform(
  rootNode: DocNode,
  path: string[]
): Platform | undefined {
  if (path.length < 2 || path[0] !== 'platforms') {
    return undefined;
  }
  return getPlatform(rootNode, path[1]);
}

export function getCurrentGuide(
  rootNode: DocNode,
  path: string[]
): PlatformGuide | undefined {
  if (path.length >= 4 && path[2] === 'guides') {
    return getGuide(rootNode, path[1], path[3]);
  }

  return undefined;
}

export function getCurrentPlatformOrGuide(
  rootNode: DocNode,
  path: string[]
): Platform | PlatformGuide | undefined {
  if (path.length < 2 || path[0] !== 'platforms') {
    return undefined;
  }

  if (path.length >= 4 && path[2] === 'guides') {
    return getGuide(rootNode, path[1], path[3]);
  }

  return getPlatform(rootNode, path[1]);
}

export function getGuide(
  rootNode: DocNode,
  platform: string,
  guide: string
): PlatformGuide | undefined {
  const guideNode = nodeForPath(rootNode, ['platforms', platform, 'guides', guide]);
  if (!guideNode) {
    return undefined;
  }
  return nodeToGuide(platform, guideNode);
}

export function extractPlatforms(rootNode: DocNode): Platform[] {
  const platformsNode = nodeForPath(rootNode, 'platforms');
  if (!platformsNode) {
    return [];
  }

  return platformsNode.children.map(nodeToPlatform);
}

function extractGuides(platformNode: DocNode): PlatformGuide[] {
  const guidesNode = nodeForPath(platformNode, 'guides');
  if (!guidesNode) {
    return [];
  }
  return guidesNode.children.map(n => nodeToGuide(platformNode.slug, n));
}

const extractIntegrations = (p: DocNode): PlatformIntegration[] => {
  if (!p.frontmatter.showIntegrationsInSearch) {
    return [];
  }
  const integrations = nodeForPath(p, 'integrations');
  return (
    integrations?.children.map(integ => {
      return {
        key: integ.slug,
        name: integ.frontmatter.title,
        icon: p.slug + '.' + integ.slug,
        url: ['', 'platforms', p.slug, 'integrations', integ.slug].join('/'),
        platform: p.slug,
        type: 'integration',
      };
    }) ?? []
  );
};
