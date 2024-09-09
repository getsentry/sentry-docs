import {ReactNode} from 'react';

import {getCurrentGuide, getCurrentPlatform, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter} from 'sentry-docs/types';
import {isTruthy} from 'sentry-docs/utils';

import './type.scss';

import {Breadcrumbs} from '../breadcrumbs';
import {CodeContextProvider} from '../codeContext';
import {GitHubCTA} from '../githubCTA';
import {Header} from '../header';
import {PlatformSdkDetail} from '../platformSdkDetail';
import {Sidebar} from '../sidebar';
import {TableOfContents} from '../tableOfContents';

type Props = {
  children: ReactNode;
  frontMatter: Omit<FrontMatter, 'slug'>;
  /** Whether to take all the available width */
  fullWidth?: boolean;
  /** Whether to hide the table of contents & sdk details */
  notoc?: boolean;
  sidebar?: ReactNode;
};

export function DocPage({
  children,
  frontMatter,
  notoc = false,
  fullWidth = false,
  sidebar,
}: Props) {
  const {rootNode, path} = serverContext();
  const currentPlatform = getCurrentPlatform(rootNode, path);
  const currentGuide = getCurrentGuide(rootNode, path);

  const hasToc = (!notoc && !frontMatter.notoc) || !!(currentPlatform || currentGuide);
  const hasGithub = !!path?.length && path[0] !== 'api';

  const pathname = serverContext().path.join('/');

  const searchPlatforms = [currentPlatform?.name, currentGuide?.name].filter(isTruthy);

  const leafNode = nodeForPath(rootNode, path);

  return (
    <div className="tw-app">
      <Header pathname={pathname} searchPlatforms={searchPlatforms} />

      <section className="px-0 flex relative">
        {sidebar ?? <Sidebar path={path} versions={frontMatter.versions} />}
        <main className="main-content flex w-full mt-[var(--header-height)] flex-1 mx-auto">
          <div
            className={[
              'mx-auto lg:mx-0 pt-6 px-6 prose dark:prose-invert max-w-full text-[var(--gray-12)] prose-a:no-underline hover:prose-a:underline',
              'prose-code:font-normal prose-code:font-mono marker:text-[var(--accent)] prose-li:my-1',
              'prose-headings:mt-0 prose-headings:font-medium prose-headings:relative prose-headings:text-[var(--gray-12)]',
              'prose-blockquote:font-normal prose-blockquote:border-l-[3px] prose-em:font-normal prose-blockquote:text-[var(--gray-12)]',
              'prose-img:my-2',
              'prose-strong:text-[var(--gray-12)]',
              fullWidth ? 'max-w-none w-full' : 'w-[75ch] xl:max-w-[calc(100%-250px)]',
            ].join(' ')}
          >
            {leafNode && <Breadcrumbs leafNode={leafNode} />}
            <div>
              <hgroup>
                <h1>{frontMatter.title}</h1>
                <h2>{frontMatter.description}</h2>
              </hgroup>
              {/* This exact id is important for Algolia indexing */}
              <div id="main">
                <CodeContextProvider>{children}</CodeContextProvider>
              </div>
              {hasGithub && <GitHubCTA />}
            </div>
          </div>

          {hasToc && (
            <aside className="sticky h-[calc(100vh-var(--header-height))] top-[var(--header-height)] overflow-y-auto hidden xl:block w-[250px]">
              <div className="sidebar">
                <TableOfContents />
                <PlatformSdkDetail />
              </div>
            </aside>
          )}
        </main>
      </section>
    </div>
  );
}
