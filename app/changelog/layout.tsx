import './globals.css';
import 'prism-sentry/index.css';

import type {Metadata} from 'next';
import {Rubik} from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: {template: '%s | Sentry Documentation', default: 'Home'},
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${rubik.variable}`}>
      <body>
        <div className="bg-gray-100">{children}</div>
      </body>
    </html>
  );
}
