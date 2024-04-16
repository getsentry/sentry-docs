import {ReactNode} from 'react';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';

import {getCurrentGuide, getCurrentPlatform} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter} from 'sentry-docs/types';
import {isTruthy} from 'sentry-docs/utils';

import {Breadcrumbs} from './breadcrumbs';
import {CodeContextProvider} from './codeContext';
import {GitHubCTA} from './githubCTA';
import {Header} from './header';
import {PlatformSdkDetail} from './platformSdkDetail';
import {Sidebar, sidebarToggleId} from './sidebar';
import {TableOfContents} from './tableOfContents';

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
  sidebar = <Sidebar />,
}: Props) {
  const {rootNode, path} = serverContext();
  const currentPlatform = rootNode && getCurrentPlatform(rootNode, path);
  const currentGuide = rootNode && getCurrentGuide(rootNode, path);

  const hasToc = (!notoc && !frontMatter.notoc) || !!(currentPlatform || currentGuide);
  const hasGithub = !!path?.length && path[0] !== 'api';

  const pathname = serverContext().path.join('/');

  const searchPlatforms = [currentPlatform?.name, currentGuide?.platform].filter(
    isTruthy
  );

  return (
    <div className="tw-app">
      <Header pathname={pathname} searchPlatforms={searchPlatforms} />

      <section className="px-0 flex relative">
        {sidebar}
        <main className="main-content flex justify-center w-full md:w-[calc(100%-var(--sidebar-width))] lg:ml-[var(--sidebar-width)] flex-1 mx-auto">
          <div
            className={[
              'mx-auto lg:mx-0 pt-6 px-6 prose max-w-full prose-slate prose-a:no-underline hover:prose-a:underline',
              'prose-code:font-normal prose-code:font-mono marker:text-accent-purple prose-li:my-1',
              'prose-headings:mt-0 prose-headings:font-medium prose-headings:relative',
              'prose-blockquote:font-normal prose-blockquote:border-l-[3px] prose-em:font-medium',
              fullWidth ? 'max-w-none w-full' : 'w-[75ch] xl:max-w-[calc(100%-250px)]',
            ].join(' ')}
          >
            <div className="pb-4">
              <Breadcrumbs />
            </div>
            <div>
              <h1 className="pl-8 lg:p-0 relative">
                <button className="lg:hidden absolute left-0">
                  <label
                    htmlFor={sidebarToggleId}
                    aria-label="Close"
                    aria-hidden="true"
                    className="inline-flex items-center cursor-pointer"
                  >
                    <HamburgerMenuIcon
                      className="inline text-[var(--gray-10)]"
                      strokeWidth="1.8"
                      width="24"
                      height="24"
                    />
                  </label>
                </button>
                {frontMatter.title}
              </h1>
              <div id="main">
                <CodeContextProvider>{children}</CodeContextProvider>
              </div>
              {hasGithub && <GitHubCTA />}
            </div>
          </div>

          {hasToc && (
            <aside className="sticky h-[calc(100vh-var(--header-height))] top-[var(--header-height)] overflow-y-auto hidden xl:block w-[250px]">
              <div className="pt-16">
                <PlatformSdkDetail />
                <TableOfContents />
              </div>
            </aside>
          )}
        </main>
      </section>
    </div>
  );
}
