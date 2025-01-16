import './globals.css';

import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import {Rubik} from 'next/font/google';
import Script from 'next/script';
import PlausibleProvider from 'next-plausible';

import {ThemeProvider} from 'sentry-docs/components/theme-provider';

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
        <PlausibleProvider domain="docs.sentry.io,rollup.sentry.io" />
      </head>
      <body className={rubik.variable} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Theme accentColor="iris" grayColor="sand" radius="large" scaling="95%">
            {children}
          </Theme>
        </ThemeProvider>
        <Script
          async
          src="https://widget.kapa.ai/kapa-widget.bundle.js"
          data-website-id="cac7cc70-969e-4bc1-a968-55534a839be4"
          data-button-hide // do not render kapa ai button
          data-modal-override-open-class="kapa-ai-class" // all elements with this class will open the kapa ai modal
          data-project-name="Sentry"
          data-project-color="#6A5FC1"
          data-project-logo="https://avatars.githubusercontent.com/u/1396951?s=280&v=4"
          data-font-family="var(--font-rubik)"
          data-modal-disclaimer="Please note: This is a tool that searches publicly available sources. Do not include any sensitive or personal information in your queries. For more on how Sentry handles your data, see our [Privacy Policy](https://sentry.io/privacy/)."
          data-modal-example-questions="How to set up Sentry for Next.js?,What are tracePropagationTargets?"
        />
      </body>
    </html>
  );
}
