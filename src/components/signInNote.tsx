'use client';

import React from 'react';

import {Note} from './note';
import {SignedInCheck} from './signedInCheck';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

export function SignInNote() {
  const pathname = usePathname();

  const url = 'https://sentry-docs-next.sentry.dev/' + pathname;

  return (
    <SignedInCheck isUserAuthenticated={false}>
      <Note>
        The following code sample will let you choose your personal config from the
        dropdown, once you're{' '}
        <Link href={`https://sentry.io/auth/login/?next=${url}`}>
          logged in
        </Link>
        .
      </Note>
    </SignedInCheck>
  );
}
