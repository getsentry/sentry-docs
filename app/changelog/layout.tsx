import './globals.css';
import 'prism-sentry/index.css';

import {ReactNode} from 'react';
import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import localFont from 'next/font/local';

import {Navbar} from 'sentry-docs/components/changelog/navbar';

const rubik = localFont({
  src: [
    {
      path: '../../src/fonts/rubik-regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../src/fonts/rubik-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../src/fonts/rubik-italic.woff2',
      weight: 'normal',
      style: 'italic',
    },
  ],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: {template: '%s | Sentry Changelog', default: 'Changelog'},
};

export default function ChangelogLayout({children}: {children: ReactNode}) {
  return (
    <Theme accentColor="violet" grayColor="sand" radius="large" scaling="95%">
      <div className={`${rubik.variable} font-sans`}>
        <Navbar />
        <div className="bg-gray-100">{children}</div>
        <div className="w-full mx-auto h-16 relative bg-darkPurple">
          <div className="footer-top-right-down-slope absolute w-full -top-1 h-10 bg-gray-200" />
        </div>
      </div>
    </Theme>
  );
}
