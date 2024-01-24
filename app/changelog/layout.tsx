import './globals.css';
import 'prism-sentry/index.css';

import localFont from 'next/font/local';

const rubik = localFont({
  src: [
    {
      path: '../../src/fonts/rubik-regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../src/fonts/rubik-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../src/fonts/rubik-italic.woff2',
      weight: 'normal',
      style: 'italic',
    },
  ],
  variable: '--font-rubik',
});

export default function ChangelogLayout({children}: {children: React.ReactNode}) {
  return <div className={`${rubik.variable} font-sans bg-gray-100`}>{children}</div>;
}
