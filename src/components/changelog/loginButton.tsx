'use client';
import {Fragment} from 'react';
import {signIn, signOut, useSession} from 'next-auth/react';

export default function Component() {
  const {data: session} = useSession();
  if (session) {
    return (
      <Fragment>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </Fragment>
    );
  }
  return (
    <Fragment>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </Fragment>
  );
}
