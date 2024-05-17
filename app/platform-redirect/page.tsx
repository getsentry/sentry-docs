import {redirect} from 'next/navigation';

import {DocPage} from 'sentry-docs/components/docPage';
import {PlatformIcon} from 'sentry-docs/components/platformIcon';
import {SmartLink} from 'sentry-docs/components/smartLink';
import {extractPlatforms, getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';
import {setServerContext} from 'sentry-docs/serverContext';

export default async function Page({
  searchParams: {next = '', platform},
}: {
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  if (Array.isArray(next)) {
    next = next[0];
  }
  const rootNode = await getDocsRootNode();
  // get rid of irrelevant platforms for the `next` path
  const platformList = extractPlatforms(rootNode).filter(platform_ => {
    return !!nodeForPath(rootNode, [
      'platforms',
      platform_.key,
      ...next.split('/').filter(Boolean),
    ]);
  });

  const requestedPlatform = Array.isArray(platform) ? platform[0] : platform;
  if (requestedPlatform) {
    const isValidPlatform = platformList.some(
      p => p.key === requestedPlatform?.toLowerCase()
    );
    if (isValidPlatform) {
      return redirect(`/platforms/${requestedPlatform}${next}`);
    }
  }

  const frontMatter = {
    title: 'Platform Specific Content',
  };

  // make the Sidebar aware of the current path
  setServerContext({rootNode, path: ['platform-redirect']});

  return (
    <DocPage frontMatter={frontMatter}>
      <p>
        The page you are looking for is customized for each platform. Select your platform
        below and we&apos;ll direct you to the most specific documentation on it.
      </p>

      <ul>
        {platformList.map(p => (
          <li key={p.key}>
            <SmartLink to={`/platforms/${p.key}${next}`}>
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
