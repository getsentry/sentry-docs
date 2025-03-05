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
    const node = nodeForPath(rootNode, [
      'platforms',
      platform_.key,
      ...pathname.split('/').filter(Boolean),
    ]);

    // extract title and description for displaying it on page
    if (node && title === defaultTitle && pathname.length > 0) {
      title = node.frontmatter.title ?? title;
      description = node.frontmatter.description || '';
    }

    return !!node;
  });

  if (platformList.length === 0) {
    // try to redirect the user to the page directly, might result in 404
    return redirect(next);
  }

  const requestedPlatform = Array.isArray(platform) ? platform[0] : platform;
  if (requestedPlatform) {
    const isValidPlatform = platformList.some(
      p => p.key === requestedPlatform?.toLowerCase()
    );
    if (isValidPlatform) {
      return redirect(`/platforms/${requestedPlatform}${pathname}`);
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
        {platformList.map(p => (
          <li key={p.key}>
            <SmartLink to={`/platforms/${p.key}${pathname}`}>
              <PlatformIcon
                size={16}
                platform={p.icon ?? p.key}
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
