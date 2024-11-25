import './globals.css';

import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import {Rubik} from 'next/font/google';
import Script from 'next/script';

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
      </body>
      <Script
        defer
        data-domain="docs.sentry.io,rollup.sentry.io"
        data-api="https://plausible.io/api/event"
        src="https://plausible.io/js/script.tagged-events.js"
      />
      <Script
        async
        src="https://widget.kapa.ai/kapa-widget.bundle.js"
        data-website-id="ec502f3e-ef02-4b03-b345-160b3e2b6a0c"
        data-button-hide // do not render kapa ai button
        data-modal-override-open-class="kapa-ai-class" // all elements with this class will open the kapa ai modal
        data-project-name="Sentry"
        data-project-color="#6A5FC1"
        data-project-logo="https://docs.sentry.io/_next/static/media/sentry-logo-dark.fc8e1eeb.svg"
        data-font-family="var(--font-rubik)"
      />
    </html>
  );
}
