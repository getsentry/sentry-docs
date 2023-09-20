import React, {useEffect} from 'react';
import {useLocation} from '@reach/router';
import {navigate} from 'gatsby';
import {PlatformIcon} from 'platformicons';
import {parse} from 'query-string';

import {usePlatformList} from 'sentry-docs/components/hooks/usePlatform';
import {Layout} from 'sentry-docs/components/layout';
import {SmartLink} from 'sentry-docs/components/smartLink';

type Props = {
  path?: string;
};

function BasePlatformRedirect({path = '/'}: Props) {
  const platformList = usePlatformList();

  return (
    <Layout>
      <h1>Platform Specific Content</h1>
      <p>
        The page you are looking for is customized for each platform. Select your platform
        below and we&apos;ll direct you to the most specific documentation on it.
      </p>

      <ul>
        {platformList.map(platform => (
          <li key={platform.key}>
            <SmartLink to={`/platforms/${platform.key}${path}`}>
              <PlatformIcon
                size={16}
                platform={platform.icon ?? platform.key}
                style={{marginRight: '0.5rem'}}
                format="sm"
              />
              <h4 style={{display: 'inline-block'}}>{platform.title}</h4>
            </SmartLink>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export default function PlatformRedirect() {
  const platformList = usePlatformList();

  const location = useLocation();

  const queryString = parse(location.search, {arrayFormat: 'none'});
  const path = (queryString.next as string | null) || '';
  const requestedPlatform = queryString.platform as string | null;

  const isValidPlatform = platformList.some(
    p => p.key === requestedPlatform?.toLowerCase()
  );

  const shouldRedirect = isValidPlatform && requestedPlatform;

  useEffect(() => {
    if (shouldRedirect) {
      navigate(`/platforms/${requestedPlatform}${path}`);
    }
  }, [path, requestedPlatform, shouldRedirect]);

  if (shouldRedirect) {
    return null;
  }

  return <BasePlatformRedirect path={path || ''} />;
}
