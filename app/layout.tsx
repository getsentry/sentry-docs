import type { Metadata } from 'next';
import { Header } from 'sentry-docs/components/header';
import { Navbar } from 'sentry-docs/components/navbar';
import { Sidebar } from 'sentry-docs/components/sidebar';

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
          <div className="document-wrapper">
          {children}
          </div>
        </div>
      </body>
    </html>
  )
}
