'use client';

import {ReactNode} from 'react';
import {SessionProvider} from 'next-auth/react';

type sessionProps = {
  children: ReactNode;
};
function NextAuthSessionProvider({children}: sessionProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default NextAuthSessionProvider;
