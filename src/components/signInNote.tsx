'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {sentryLoginUrl} from 'sentry-docs/docsOrigin';

import {Alert} from './alert';
import {SignedInCheck} from './signedInCheck';

export function SignInNote() {
  const pathname = usePathname();

  return (
    <SignedInCheck isUserAuthenticated={false}>
      <Alert>
        The following code sample will let you choose your personal config from the
        dropdown, once you're <Link href={sentryLoginUrl(pathname)}>logged in</Link>.
      </Alert>
    </SignedInCheck>
  );
}
