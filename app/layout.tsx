import type {Metadata} from 'next';
import {headers} from 'next/headers';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Home',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const nonce = headers().get('x-nonce') || '';
  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        defer
        data-domain="docs.sentry.io,rollup.sentry.io"
        data-api="https://plausible.io/api/event"
        src="https://plausible.io/js/script.tagged-events.js"
        nonce={nonce}
      />
    </html>
  );
}
