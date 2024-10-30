import {ReactNode} from 'react';
import Script from 'next/script';

import {getCurrentGuide, getCurrentPlatform, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter} from 'sentry-docs/types';
import {PaginationNavNode} from 'sentry-docs/types/paginationNavNode';
import {isTruthy} from 'sentry-docs/utils';
import {getUnversionedPath} from 'sentry-docs/versioning';

import './type.scss';

import {Breadcrumbs} from '../breadcrumbs';
import {CodeContextProvider} from '../codeContext';
import {GitHubCTA} from '../githubCTA';
import {Header} from '../header';
import {PaginationNav} from '../paginationNav';
import {PlatformSdkDetail} from '../platformSdkDetail';
import {Sidebar} from '../sidebar';
import {TableOfContents} from '../tableOfContents';

type Props = {
  children: ReactNode;
  frontMatter: Omit<FrontMatter, 'slug'>;
  /** Whether to take all the available width */
  fullWidth?: boolean;
  nextPage?: PaginationNavNode;
  /** Whether to hide the table of contents & sdk details */
  notoc?: boolean;
  previousPage?: PaginationNavNode;
  sidebar?: ReactNode;
};

export function DocPage({
  children,
  frontMatter,
  notoc = false,
  fullWidth = false,
  sidebar,
  nextPage,
  previousPage,
}: Props) {
  const {rootNode, path} = serverContext();
  const currentPlatform = getCurrentPlatform(rootNode, path);
  const currentGuide = getCurrentGuide(rootNode, path);

  const hasToc = (!notoc && !frontMatter.notoc) || !!(currentPlatform || currentGuide);
  const hasGithub = !!path?.length && path[0] !== 'api';

  const pathname = serverContext().path.join('/');

  const searchPlatforms = [currentPlatform?.name, currentGuide?.name].filter(isTruthy);

  const unversionedPath = getUnversionedPath(path, false);

  const leafNode = nodeForPath(rootNode, unversionedPath);

  // a hack to show syntax highlighting on editors
  const javascript = String.raw;

  return (
    <div className="tw-app">
      <Header pathname={pathname} searchPlatforms={searchPlatforms} />

      <section className="px-0 flex relative">
        {sidebar ?? (
          <Sidebar path={unversionedPath.split('/')} versions={frontMatter.versions} />
        )}
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

              <div className="grid grid-cols-2 gap-4 not-prose mt-16">
                <div className="col-span-1">
                  {previousPage && <PaginationNav node={previousPage} title="Previous" />}
                </div>
                <div className="col-span-1">
                  {nextPage && <PaginationNav node={nextPage} title="Next" />}
                </div>
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
      {/* can't use useEffect here (server component) */}
      <Script
        type="module"
        id="mermaid-script"
        dangerouslySetInnerHTML={{
          __html: javascript`
              const mermaidBlocks = document.querySelectorAll('.language-mermaid');
              if (mermaidBlocks.length >= 0) {
                const {default: mermaid} = await import(
                  'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
                );
                mermaid.initialize({startOnLoad: false});
                mermaidBlocks.forEach(block => {
                  // get rid of code highlighting
                  const code = block.textContent;
                  block.innerHTML = code;
                  // force transparent background
                  block.style.backgroundColor = 'transparent';
                  const parentCodeTabs = block.closest('.code-tabs-wrapper')
                  if(parentCodeTabs) {
                    parentCodeTabs.innerHTML = block.outerHTML;
                  }
                });
                await mermaid.run({nodes: document.querySelectorAll('.language-mermaid')});
              }
          `,
        }}
      />
    </div>
  );
}
