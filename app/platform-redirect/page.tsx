import {Metadata} from 'next';
import {redirect} from 'next/navigation';

import {Alert} from 'sentry-docs/components/alert';
import {DocPage} from 'sentry-docs/components/docPage';
import {PlatformIcon} from 'sentry-docs/components/platformIcon';
import {SmartLink} from 'sentry-docs/components/smartLink';
import {extractPlatforms, getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';
import {setServerContext} from 'sentry-docs/serverContext';

import {sanitizeNext} from './utils';

export const metadata: Metadata = {
  robots: 'noindex',
  title: 'Platform Specific Content',
  description:
    'The page you are looking for is customized for each platform. Select your platform below and we’ll direct you to the most specific documentation on it.',
};

export default async function Page(props: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}) {
  const searchParams = await props.searchParams;

  let next = searchParams.next || '';
  const platform = searchParams.platform;

  if (Array.isArray(next)) {
    next = next[0];
  }

  const pathname = sanitizeNext(next);
  const rootNode = await getDocsRootNode();
  const defaultTitle = 'Platform Specific Content';
  let description = '';
  const platformInfo =
    "The page you are looking for is customized for each platform. Select your platform below and we'll direct you to the most specific documentation on it.";
  let title = defaultTitle;

  // get rid of irrelevant platforms for the `next` path
  const platformList = extractPlatforms(rootNode).filter(platform_ => {
    // First check the main platform path
    let node = nodeForPath(rootNode, [
      'platforms',
      platform_.key,
      ...pathname.split('/').filter(Boolean),
    ]);

    // If not found, check if it's a guide (like dart/guides/flutter)
    if (!node && platform_.guides) {
      for (const guide of platform_.guides) {
        node = nodeForPath(rootNode, [
          'platforms',
          platform_.key,
          'guides',
          guide.name,
          ...pathname.split('/').filter(Boolean),
        ]);
        if (node) {
          // Create a copy of the platform with the guide URL to avoid mutating the original
          const platformCopy = {...platform_, url: guide.url};
          // Update the platform reference to use the copy
          Object.assign(platform_, platformCopy);
          break;
        }
      }
    }

    // extract title and description for displaying it on page
    if (node && title === defaultTitle && pathname.length > 0) {
      title = node.frontmatter.title ?? title;
      description = node.frontmatter.description || '';
    }

    return !!node;
  });

  // For JavaScript platforms, also include individual frameworks that support the content
  const expandedPlatformList = [...platformList];

  // Find JavaScript platform and add its supported frameworks
  // Only use JavaScript platform if it's already in the filtered list (has relevant content)
  const javascriptPlatform = platformList.find(p => p.key === 'javascript');

  if (
    javascriptPlatform &&
    (pathname.startsWith('/session-replay/') ||
      pathname.startsWith('/tracing/') ||
      pathname.startsWith('/profiling/') ||
      pathname.startsWith('/logs/'))
  ) {
    // Get the JavaScript page to check which frameworks are supported
    const jsPageNode = nodeForPath(rootNode, [
      'platforms',
      'javascript',
      ...pathname.split('/').filter(Boolean),
    ]);

    if (jsPageNode && jsPageNode.frontmatter.notSupported) {
      const notSupported = jsPageNode.frontmatter.notSupported;

      // Remove JavaScript from the main list temporarily
      const otherPlatforms = expandedPlatformList.filter(p => p.key !== 'javascript');

      // Add supported JavaScript frameworks as separate entries
      const jsFrameworks: typeof platformList = [];
      javascriptPlatform.guides?.forEach(guide => {
        const guideKey = `javascript.${guide.name}`;
        if (!notSupported.includes(guideKey)) {
          jsFrameworks.push({
            key: guideKey,
            name: guide.name,
            type: 'platform' as const,
            url: javascriptPlatform.url,
            title: guide.title,
            caseStyle: guide.caseStyle,
            sdk: guide.sdk,
            fallbackPlatform: guide.fallbackPlatform,
            language: guide.language,
            categories: guide.categories,
            keywords: guide.keywords,
            guides: [],
            integrations: [],
            icon: `javascript-${guide.name}`,
          });
        }
      });

      // Rebuild the list with JavaScript and its frameworks at the end
      expandedPlatformList.length = 0; // Clear the array
      expandedPlatformList.push(...otherPlatforms); // Add other platforms first
      expandedPlatformList.push(javascriptPlatform); // Add JavaScript platform
      expandedPlatformList.push(...jsFrameworks); // Add JavaScript frameworks last
    }
  }

  if (expandedPlatformList.length === 0) {
    // try to redirect the user to the page directly, might result in 404
    return redirect(next);
  }

  const requestedPlatform = Array.isArray(platform) ? platform[0] : platform;
  if (requestedPlatform) {
    const validPlatform = expandedPlatformList.find(
      p => p.key === requestedPlatform?.toLowerCase()
    );
    if (validPlatform) {
      // Use the platform's URL (which may have been updated to point to a guide)
      return redirect(`${validPlatform.url}${pathname}`);
    }
  }

  const frontMatter = {
    title,
    description,
  };

  // make the Sidebar aware of the current path
  setServerContext({rootNode, path: ['platform-redirect']});

  return (
    <DocPage frontMatter={frontMatter}>
      <Alert>{platformInfo}</Alert>

      <ul>
        {expandedPlatformList.map(p => {
          // Check if this is a JavaScript framework (has javascript. prefix)
          const isJSFramework = p.key.startsWith('javascript.');

          return (
            <li key={p.key} style={{marginLeft: isJSFramework ? '20px' : '0'}}>
              <SmartLink to={`${p.url}${pathname}`}>
                <PlatformIcon
                  size={16}
                  platform={p.icon ?? p.key}
                  style={{marginRight: '0.5rem'}}
                  format="sm"
                />
                <h4 style={{display: 'inline-block'}}>{p.title}</h4>
              </SmartLink>
            </li>
          );
        })}
      </ul>
    </DocPage>
  );
}
