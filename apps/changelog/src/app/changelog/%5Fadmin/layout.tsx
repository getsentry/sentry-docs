import {type ReactNode, Suspense} from 'react';
import type {Metadata} from 'next';
import {getServerSession} from 'next-auth/next';

import LoginButton from '@/client/components/loginButton';
import {NextAuthSessionProvider} from '@/client/components/nextAuthSessionProvider';
import {authOptions} from '@/server/authOptions';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default async function Layout({children}: {children: ReactNode}) {
  const session = await getServerSession(authOptions);

  let content = (
    <div className="relative min-h-[calc(100vh-8rem)] w-full mx-auto bg-gray-200 pt-16">
      {children}
      <div className="fixed top-3 right-4 z-50">
        <Suspense fallback={null}>
          <LoginButton />
        </Suspense>
      </div>
    </div>
  );
  if (!session) {
    content = (
      <div className="relative min-h-[calc(100vh-8rem)] w-full mx-auto bg-gray-200 pt-16 flex items-center justify-center">
        <LoginButton />
      </div>
    );
  }
  return <NextAuthSessionProvider>{content}</NextAuthSessionProvider>;
}
