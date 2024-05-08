import 'prism-sentry/index.css';

import type {Metadata} from 'next';

import {HotReload} from 'sentry-docs/components/hotReload';

export const metadata: Metadata = {
  title: {template: '%s | Sentry Documentation', default: 'Home'},
};

export default function DocsLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      {children}
      <HotReload />
    </div>
  );
}
