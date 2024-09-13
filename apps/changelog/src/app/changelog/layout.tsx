import 'prism-sentry/index.css';
import styles from './layout.module.css';

import {Fragment, ReactNode} from 'react';
import type {Metadata} from 'next';
import NextTopLoader from 'nextjs-toploader';
import {Navbar} from '@/client/components/navbar';

export const metadata: Metadata = {
  title: {template: '%s | Sentry Changelog', default: 'Changelog'},
  openGraph: {
    images: '/img/hero.png',
  },
};

export default function ChangelogLayout({children}: {children: ReactNode}) {
  return (
    <Fragment>
      <NextTopLoader color="#8d5494" />
      <div className="font-sans">
        <Navbar />
        <div className="bg-gray-100">{children}</div>
        <div className="w-full mx-auto h-16 relative bg-darkPurple">
          <div className="footer-top-right-down-slope absolute w-full -top-1 h-10 bg-gray-200" />
        </div>
      </div>
    </Fragment>
  );
}
