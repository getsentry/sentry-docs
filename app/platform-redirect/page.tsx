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

  // Build a list of platforms or guides that have the content for the `next` path
  type PlatformOrGuide = {
    icon: string;
    key: string;
    title: string;
    url: string;
    isGuide?: boolean;
    parentPlatform?: string;
  };

  const platformOrGuideList: PlatformOrGuide[] = [];

  for (const platformEntry of extractPlatforms(rootNode)) {
    // Check if the main platform path has the content
    const mainPlatformNode = nodeForPath(rootNode, [
      'platforms',
      platformEntry.key,
      ...pathname.split('/').filter(Boolean),
    ]);

    // Extract title and description from the first valid node we find
    if (mainPlatformNode && title === defaultTitle && pathname.length > 0) {
      title = mainPlatformNode.frontmatter.title ?? title;
      description = mainPlatformNode.frontmatter.description || '';
    }

    // Check which guides have the content
    const supportedGuides: typeof platformEntry.guides = [];
    if (platformEntry.guides) {
      for (const guide of platformEntry.guides) {
        const guideNode = nodeForPath(rootNode, [
          'platforms',
          platformEntry.key,
          'guides',
          guide.name,
          ...pathname.split('/').filter(Boolean),
        ]);

        if (guideNode) {
          supportedGuides.push(guide);
          
          // Extract title and description if we haven't yet
          if (title === defaultTitle && pathname.length > 0) {
            title = guideNode.frontmatter.title ?? title;
            description = guideNode.frontmatter.description || '';
          }
        }
      }
    }

    // Check notSupported list to filter out unsupported guides (for platforms like JavaScript)
    let filteredGuides = supportedGuides;
    if (mainPlatformNode?.frontmatter.notSupported && supportedGuides.length > 0) {
      const notSupported = mainPlatformNode.frontmatter.notSupported;
      filteredGuides = supportedGuides.filter(
        guide => !notSupported.includes(`${platformEntry.key}.${guide.name}`)
      );
    }

    // Include platform if main path exists OR if any guides exist
    if (mainPlatformNode || filteredGuides.length > 0) {
      // Add the main platform entry only if it has content
      if (mainPlatformNode) {
        platformOrGuideList.push({
          key: platformEntry.key,
          title: platformEntry.title ?? platformEntry.key ?? '',
          url: platformEntry.url ?? '',
          icon: platformEntry.icon ?? platformEntry.key,
        });
      }

      // Add guide entries as nested items (only if main platform exists)
      // or as top-level items (if only guides have content)
      for (const guide of filteredGuides) {
        platformOrGuideList.push({
          key: `${platformEntry.key}.${guide.name}`,
          title: guide.title ?? guide.name ?? '',
          url: guide.url ?? '', // Always use the guide-specific URL
          icon: `${platformEntry.key}-${guide.name}`,
          isGuide: mainPlatformNode ? true : false, // Only nest if parent exists
          parentPlatform: platformEntry.key,
        });
      }
    }
  }

  if (platformOrGuideList.length === 0) {
    // try to redirect the user to the page directly, might result in 404
    return redirect(next);
  }

  const requestedPlatform = Array.isArray(platform) ? platform[0] : platform;
  if (requestedPlatform) {
    const validPlatform = platformOrGuideList.find(
      p => p.key === requestedPlatform?.toLowerCase()
    );
    if (validPlatform) {
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
        {platformOrGuideList.map(p => (
          <li key={p.key} style={{marginLeft: p.isGuide ? '20px' : '0'}}>
            <SmartLink to={`${p.url}${pathname}`}>
              <PlatformIcon
                size={16}
                platform={p.icon}
                style={{marginRight: '0.5rem'}}
                format="sm"
              />
              <h4 style={{display: 'inline-block'}}>{p.title}</h4>
            </SmartLink>
          </li>
        ))}
      </ul>
    </DocPage>
  );
}
