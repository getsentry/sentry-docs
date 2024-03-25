import 'prism-sentry/index.css';

import {ReactNode} from 'react';
import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import NextTopLoader from 'nextjs-toploader';

import {Navbar} from 'sentry-docs/components/changelog/navbar';

export const metadata: Metadata = {
  title: {template: '%s | Sentry Changelog', default: 'Changelog'},
  metadataBase: new URL('https://sentry.io/changelog/'),
};

export default function ChangelogLayout({children}: {children: ReactNode}) {
  return (
    <Theme accentColor="violet" grayColor="sand" radius="large" scaling="95%">
      <NextTopLoader color="#8d5494" />
      <div id="changelogcontent" className={`tw-app`}>
        <Navbar />
        <div className="bg-gray-100">{children}</div>
        <div className="w-full mx-auto h-16 relative bg-darkPurple">
          <div className="footer-top-right-down-slope absolute w-full -top-1 h-10 bg-gray-200" />
        </div>
      </div>
    </Theme>
  );
}
