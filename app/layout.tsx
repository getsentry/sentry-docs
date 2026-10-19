import './globals.css';

import {Theme} from '@radix-ui/themes';
import type {Metadata} from 'next';
import {Rubik} from 'next/font/google';
import Script from 'next/script';
import PlausibleProvider from 'next-plausible';
import {AskAiProvider} from 'sentry-docs/components/askAi/provider';
import {HashNavigation} from 'sentry-docs/components/hashNavigation';
import {SkipToContent} from 'sentry-docs/components/skipToContent';
import {ThemeProvider} from 'sentry-docs/components/theme-provider';
import {safeSourceUrl} from 'sentry-docs/lib/askAi/types';

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
  const askAiProvider = process.env.ASK_AI_PROVIDER === 'fin' ? 'fin' : 'kapa';
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
          <Theme accentColor="iris" grayColor="sand" radius="large" scaling="95%">
            <AskAiProvider
              provider={askAiProvider}
              supportUrl={safeSourceUrl(process.env.ASK_AI_SUPPORT_URL)}
              handoffEnabled={process.env.FIN_HANDOFF_ENABLED === 'true'}
            >
              <SkipToContent />
              <HashNavigation />
              {children}
            </AskAiProvider>
          </Theme>
        </ThemeProvider>
        {askAiProvider === 'kapa' && (
          <Script
            strategy="lazyOnload"
            src="https://widget.kapa.ai/kapa-widget.bundle.js"
            data-website-id="cac7cc70-969e-4bc1-a968-55534a839be4"
            data-button-hide // do not render kapa ai button
            data-project-name="Sentry"
            data-project-color="#6A5FC1"
            data-project-logo="https://avatars.githubusercontent.com/u/1396951?s=280&v=4"
            data-font-family="var(--font-rubik)"
            data-modal-disclaimer="Please note: This is a tool that searches publicly available sources. Do not include any sensitive or personal information in your queries. For more on how Sentry handles your data, see our [Privacy Policy](https://sentry.io/privacy/)."
            data-modal-example-questions="How to set up Sentry for Next.js?,What are tracePropagationTargets?"
            data-user-analytics-cookie-enabled="false"
            data-color-scheme="auto"
            data-color-scheme-selector=".dark"
          />
        )}
      </body>
    </html>
  );
}
