import 'prism-sentry/index.css';

import {HotReload} from 'sentry-docs/components/hotReload';

export default function DocsLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      {children}
      <HotReload />
    </div>
  );
}
