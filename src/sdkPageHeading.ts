import {DocNode, nodeForPath} from './docTree';
import {FrontMatter} from './types';
import {getVersion, stripVersion} from './versioning';

type HeadingIndex = {
  guideFamilies: Map<string, Set<string>>;
  topicPaths: Map<string, Set<string>>;
};

const headingIndexes = new WeakMap<DocNode, HeadingIndex>();

function contextPath(path: string): string | undefined {
  const parts = path.split('/');
  if (parts[0] !== 'platforms' || parts.length < 2) {
    return undefined;
  }
  return parts[2] === 'guides' && parts.length >= 4
    ? parts.slice(0, 4).join('/')
    : parts.slice(0, 2).join('/');
}

function contextName(node: DocNode): string {
  return (
    node.frontmatter.title?.trim() ||
    node.frontmatter.sidebar_title?.trim() ||
    node.slug.replace(/[-_]/g, ' ').replace(/\b\w/g, character => character.toUpperCase())
  );
}

function headingIndex(root: DocNode): HeadingIndex {
  const cached = headingIndexes.get(root);
  if (cached) {
    return cached;
  }

  const index: HeadingIndex = {
    guideFamilies: new Map(),
    topicPaths: new Map(),
  };
  function visit(node: DocNode) {
    const context = contextPath(node.path);
    if (context && !node.path.includes('__v')) {
      const title = node.frontmatter.title;
      if (node.path === context && node.path.split('/')[2] === 'guides') {
        const guideName = contextName(node);
        const families = index.guideFamilies.get(guideName) ?? new Set<string>();
        families.add(node.path.split('/')[1]);
        index.guideFamilies.set(guideName, families);
      } else if (!node.missing && title && node.path !== context) {
        const key = `${context}\0${title}`;
        const paths = index.topicPaths.get(key) ?? new Set<string>();
        paths.add(node.path);
        index.topicPaths.set(key, paths);
      }
    }
    node.children.forEach(visit);
  }
  visit(root);
  headingIndexes.set(root, index);
  return index;
}

function sectionTitle(node: DocNode | undefined, context: string): string | undefined {
  for (
    let parent = node?.parent;
    parent && parent.path !== context;
    parent = parent.parent
  ) {
    const title = parent.frontmatter.title?.replace(/^Set Up /, '');
    if (title && !parent.missing) {
      return title;
    }
  }
  return undefined;
}

/** Compute the visible H1 without changing short titles in the sidebar or breadcrumbs. */
export function getSdkPageHeading(
  root: DocNode,
  path: string[],
  frontMatter: Pick<FrontMatter, 'title' | 'h1_title'>
): string {
  const pathname = path.join('/');
  const context = contextPath(stripVersion(pathname));
  if (!context) {
    return frontMatter.title;
  }

  const contextNode = nodeForPath(root, context);
  const platformNode = nodeForPath(root, context.split('/').slice(0, 2));
  if (!contextNode || !platformNode) {
    return frontMatter.title;
  }

  const guide = context.split('/')[2] === 'guides';
  const index = headingIndex(root);
  const contextTitle = contextName(contextNode);
  const platformTitle =
    platformNode.frontmatter.platformTitle?.trim() || contextName(platformNode);
  const baseNode = nodeForPath(root, stripVersion(pathname));
  const baseFrontMatter = getVersion(pathname)
    ? (baseNode?.frontmatter ?? frontMatter)
    : frontMatter;
  const family =
    guide && (index.guideFamilies.get(contextTitle)?.size ?? 0) > 1
      ? ` (${platformTitle})`
      : '';

  let heading: string;
  if (baseFrontMatter.h1_title) {
    heading = baseFrontMatter.h1_title;
  } else if (stripVersion(pathname) === context) {
    heading = `Sentry for ${contextTitle}${family}`;
  } else {
    const node = baseNode ?? nodeForPath(root, pathname);
    let topic = baseFrontMatter.title;
    if ((index.topicPaths.get(`${context}\0${topic}`)?.size ?? 0) > 1) {
      const section = sectionTitle(node, context);
      if (section) {
        topic = section.endsWith(topic) ? section : `${section} ${topic}`;
      }
    }
    heading = `${topic} for ${contextTitle}${family}`;
  }

  const version = getVersion(pathname);
  return version ? `${heading} (SDK v${version})` : heading;
}
