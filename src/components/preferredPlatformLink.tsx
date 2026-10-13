'use client';

import Link from 'next/link';
import {ComponentProps, useEffect, useState} from 'react';
import {isLocalStorageAvailable} from 'sentry-docs/utils';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  to: string;
  /** Platform to use when the user hasn't picked one yet, e.g. `javascript.node`. */
  defaultPlatform?: string;
};

function getRedirectHref(to: string, platform?: string) {
  const params = new URLSearchParams({next: to});
  if (platform) {
    params.set('platform', platform);
  }
  return `/platform-redirect/?${params.toString()}`;
}

export function PreferredPlatformLink({to, defaultPlatform, ...props}: Props) {
  const [href, setHref] = useState(() => getRedirectHref(to, defaultPlatform));

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      return;
    }

    const platform = localStorage.getItem('active-platform');
    if (platform) {
      setHref(getRedirectHref(to, platform));
    }
  }, [to]);

  return <Link href={href} {...props} />;
}
