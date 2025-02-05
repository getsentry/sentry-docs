'use client';

import {Button} from '@radix-ui/themes';
import {usePathname} from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname() ?? '/';

  return (
    <main className="px-8 pt-28">
      <h1 className="font-medium text-3xl mb-4">Page Not Found</h1>
      <p className="text-lg">We couldn't find the page you were looking for :(</p>
      <div className="pt-8 flex gap-4">
        <Button variant="solid" size="3" asChild>
          <a
            href={`https://github.com/getsentry/sentry-docs/issues/new?template=issue-platform-404.yml&title=🔗 404 Error&url=https://docs.sentry.io${pathname}`}
            target="_blank"
            rel="noreferrer"
          >
            Report 404 on GitHub
          </a>
        </Button>
      </div>
    </main>
  );
}
