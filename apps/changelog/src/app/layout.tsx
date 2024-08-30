import './globals.css';

import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import {Rubik} from 'next/font/google';
import Script from 'next/script';

const rubik = Rubik({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon:
      // we use the absolute url (for the alternative prod domain),
      // otherwise we run into the issue that sentry.io/changelog will not find the favicon
      process.env.NODE_ENV === 'production'
        ? 'https://changelog.sentry.dev/favicon.ico'
        : '/favicon_localhost.png',
  },
  openGraph: {
    images: '/img/hero.png',
  },
  other: {
    'zd-site-verification': 'ocu6mswx6pke3c6qvozr2e',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${rubik.variable}`}>
        <Theme accentColor="iris" grayColor="sand" radius="large" scaling="95%">
          {children}
        </Theme>
      </body>
      <Script
        defer
        data-domain="docs.sentry.io,rollup.sentry.io"
        data-api="https://plausible.io/api/event"
        src="https://plausible.io/js/script.tagged-events.js"
      />
    </html>
  );
}
