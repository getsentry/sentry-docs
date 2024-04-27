import type {Metadata} from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Home',
  icons: {
    icon:
      process.env.NODE_ENV === 'production' ? '/favicon.ico' : '/favicon_localhost.png',
  },
  openGraph: {
    images: 'https://docs.sentry.io/changelog/assets/og.png',
  },
  other: {
    'zd-site-verification': 'ocu6mswx6pke3c6qvozr2e',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
      <Script
        defer
        data-domain="docs.sentry.io,rollup.sentry.io"
        data-api="https://plausible.io/api/event"
        src="https://plausible.io/js/script.tagged-events.js"
      />
    </html>
  );
}
