'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

import {KEY_ACTIVE_PLATFORM} from 'sentry-docs/constants/localStorage';

interface Props {
  children: React.ReactNode;
  className?: string;
}
const DEFAULT_LINK = '/platforms';

export function LinkToActivePlatform({className, children}: Props) {
  const [href, setHref] = useState(DEFAULT_LINK);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    let activePlatform = localStorage.getItem(KEY_ACTIVE_PLATFORM);
    if (activePlatform) {
      const segments = activePlatform.split('.');
      if (segments.length === 2) {
        activePlatform = `${segments[0]}/guides/${segments[1]}`;
      } else {
        activePlatform = `${segments[0]}`;
      }
      setHref(`${DEFAULT_LINK}/${activePlatform}`);
    }
  }, []);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
