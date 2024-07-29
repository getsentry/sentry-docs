'use client';

import {useEffect, useState} from 'react';
import {Button} from '@radix-ui/themes';

import {Header} from 'sentry-docs/components/header';
import {Search} from 'sentry-docs/components/search';

export default function NotFound() {
  const [pathname, setPathname] = useState('');
  const [host, setHost] = useState('');
  useEffect(() => {
    setPathname(window.location.pathname);
    setHost(window.location.host);
  }, []);
  const brokenUrl = `${host}${pathname}`;
  const reportUrl = `https://github.com/getsentry/sentry-docs/issues/new?template=issue-platform-404.yml&title=🔗 404 Error&url=${brokenUrl}`;
  return (
    <div className="tw-app">
      <Header pathname="/" searchPlatforms={[]} noSearch />
      <main className="px-8 pt-28">
        <h1 className="font-medium text-3xl mb-4">Page Not Found</h1>
        <p className="text-lg">We couldn't find the page you were looking for :(</p>

        <div className="max-w-md pt-8">
          <p className="pb-4">Let's give it another shot:</p>
          <Search autoFocus path={pathname} searchPlatforms={[]} showChatBot={false} />
        </div>
        <div className="pt-8 flex gap-4">
          <Button variant="solid" size="3" asChild>
            <a href={reportUrl} target="_blank" rel="noreferrer">
              Report 404 on Github
            </a>
          </Button>
          <Button variant="soft" size="3" asChild>
            <a
              href="https://docsbot.ai/chat/skFEy0qDC01GrRrZ7Crs/EPqsd8nu2XmKzWnd45tL"
              target="_blank"
              rel="noreferrer"
            >
              Ask a Bot
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
