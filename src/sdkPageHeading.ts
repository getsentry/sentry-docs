import {DocNode, nodeForPath} from './docTree';
import {FrontMatter} from './types';
import {getVersion, stripVersion} from './versioning';

// These guide names are shared across SDK families; always qualify them, even if
// another SDK's guide is removed or temporarily not published.
const CROSS_PLATFORM_GUIDES = new Set([
  'AWS Lambda',
  'Azure Functions',
  'Google Cloud Functions',
]);

// These topic names need their parent section to convey what the page covers.
// Keep the rule stable regardless of how many other pages share the same title.
const SECTION_CONTEXT_TITLES = new Set([
  'Configuration',
  'OpenTelemetry Support',
  'Ionic',
  'Wrangler',
  'Breadcrumbs',
  'Source Maps',
  'Integrations',
]);

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

function includesName(title: string, name: string): boolean {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match a full framework name, not substrings such as "React" in "ReactNative"
  // or "Java" in the dotted package name "java.util.logging".
  return new RegExp(
    `(?:^|[^\\p{L}\\p{N}.])${escapedName}(?=$|[^\\p{L}\\p{N}.])`,
    'iu'
  ).test(title);
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
  const contextTitle = contextName(contextNode);
  const platformTitle =
    platformNode.frontmatter.platformTitle?.trim() || contextName(platformNode);
  const baseNode = nodeForPath(root, stripVersion(pathname));
  const version = getVersion(pathname);
  const baseFrontMatter =
    version && baseNode && !baseNode.missing ? baseNode.frontmatter : frontMatter;
  const family =
    guide && CROSS_PLATFORM_GUIDES.has(contextTitle) ? ` (${platformTitle})` : '';
  const overrideTitle = frontMatter.h1_title ?? baseFrontMatter.h1_title;

  let heading: string;
  if (overrideTitle) {
    heading = overrideTitle;
  } else if (stripVersion(pathname) === context) {
    heading = `Sentry for ${contextTitle}${family}`;
  } else {
    const node = baseNode && !baseNode.missing ? baseNode : nodeForPath(root, pathname);
    let topic = baseFrontMatter.title;
    if (SECTION_CONTEXT_TITLES.has(topic)) {
      const section = sectionTitle(node, context);
      if (section && !(topic === 'Breadcrumbs' && section === 'Enriching Events')) {
        topic = section.endsWith(topic) ? section : `${section} ${topic}`;
      }
    }
    const contextSuffix = includesName(topic, contextTitle) ? '' : ` for ${contextTitle}`;
    const familySuffix = includesName(topic, platformTitle) ? '' : family;
    heading = `${topic}${contextSuffix}${familySuffix}`;
  }

  return version ? `${heading} (SDK v${version})` : heading;
}
