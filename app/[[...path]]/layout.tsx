import type { Metadata } from 'next';

import 'sentry-docs/styles/screen.scss';
import 'prism-sentry/index.css';

export const metadata: Metadata = {
  title: {template: '%s | Sentry Documentation', default: 'Home'},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div>
          {children}
        </div>
      </body>
    </html>
  )
}
