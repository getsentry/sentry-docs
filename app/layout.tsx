import 'prism-sentry/index.css';
import './globals.css';

import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import {Rubik} from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import {AskAiModal, AskAiProvider} from 'sentry-docs/components/askAi';
import {SkipToContent} from 'sentry-docs/components/skipToContent';
import {ThemeProvider} from 'sentry-docs/components/theme-provider';

const rubik = Rubik({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap', // Show fallback font immediately, swap when loaded
});

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon:
      process.env.NODE_ENV === 'production' ? '/favicon.ico' : '/favicon_localhost.png',
  },
  openGraph: {
    images: '/og.png',
  },
  other: {
    'zd-site-verification': 'ocu6mswx6pke3c6qvozr2e',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider taggedEvents domain="docs.sentry.io,rollup.sentry.io" />
      </head>
      <body className={rubik.variable} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AskAiProvider>
            <Theme accentColor="iris" grayColor="sand" radius="large" scaling="95%">
              <SkipToContent />
              {children}
              <AskAiModal />
            </Theme>
          </AskAiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
