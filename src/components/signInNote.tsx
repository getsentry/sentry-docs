'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {Note} from './alert';
import {SignedInCheck} from './signedInCheck';

export function SignInNote() {
  const pathname = usePathname();

  const url = 'https://sentry-docs-next.sentry.dev/' + pathname;

  return (
    <SignedInCheck isUserAuthenticated={false}>
      <Note>
        The following code sample will let you choose your personal config from the
        dropdown, once you're{' '}
        <Link href={`https://sentry.io/auth/login/?next=${url}`}>logged in</Link>.
      </Note>
    </SignedInCheck>
  );
}
