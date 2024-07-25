'use client';

import {ReactNode} from 'react';
import {SessionProvider} from 'next-auth/react';

type sessionProps = {
  children: ReactNode;
};

export function NextAuthSessionProvider({children}: sessionProps) {
  return <SessionProvider basePath={'/changelog'}>{children}</SessionProvider>;
}
