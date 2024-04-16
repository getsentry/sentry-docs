import {ReactNode} from 'react';
import {Cross1Icon, HamburgerMenuIcon} from '@radix-ui/react-icons';
import {IconButton} from '@radix-ui/themes';

import {
  extractPlatforms,
  getCurrentGuide,
  getCurrentPlatform,
  nodeForPath,
} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter, Platform} from 'sentry-docs/types';
import {isTruthy} from 'sentry-docs/utils';

import {Breadcrumbs} from './breadcrumbs';
import {CodeContextProvider} from './codeContext';
import {ScrollActiveLink} from './focus-active-link';
import {GitHubCTA} from './githubCTA';
import {Header} from './header';
import {PlatformSdkDetail} from './platformSdkDetail';
import {PlatformSelector} from './platformSelector';
import {ServerSidebar} from './sidebar';
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
  sidebar = <ServerSidebar />,
}: Props) {
  const {rootNode, path} = serverContext();
  const currentPlatform = rootNode && getCurrentPlatform(rootNode, path);
  const currentGuide = rootNode && getCurrentGuide(rootNode, path);

  const platforms: Platform[] = !rootNode
    ? []
    : extractPlatforms(rootNode).map(platform => {
        const platformForPath =
          nodeForPath(rootNode, [
            'platforms',
            platform.name,
            ...path.slice(currentGuide ? 4 : 2),
          ]) ||
          // try to go one level higher
          nodeForPath(rootNode, [
            'platforms',
            platform.name,
            ...path.slice(currentGuide ? 4 : 2, path.length - 1),
          ]);

        // link to the section of this platform's docs that matches the current path when applicable
        return platformForPath
          ? {...platform, url: '/' + platformForPath.path + '/'}
          : platform;
      });

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
        <input
          type="checkbox"
          id="navbar-menu-toggle"
          className="hidden"
          defaultChecked={false}
        />
        <aside className="sidebar">
          <div className="flex justify-end">
            <IconButton variant="ghost" asChild>
              <label
                htmlFor="navbar-menu-toggle"
                className="lg:hidden mb-4 flex justify-end rounded-full p-3 cursor-pointer bg-[var(--white-a11)] shadow"
                aria-label="Close"
                aria-hidden="true"
              >
                <Cross1Icon
                  className="text-[var(--gray-10)]"
                  strokeWidth="2"
                  width="24"
                  height="24"
                />
              </label>
            </IconButton>
          </div>
          <div className="md:flex flex-col items-stretch">
            <div className="platform-selector">
              <div className="mb-4">
                <h6 className="mb-2 font-medium text-[0.8rem]">Language / Framework</h6>
                <PlatformSelector
                  platforms={platforms}
                  currentPlatform={currentGuide || currentPlatform}
                />
              </div>
            </div>
            <div className="toc">
              <ScrollActiveLink />
              <div>{sidebar}</div>
            </div>
          </div>
        </aside>
        <main className="flex justify-center w-full md:w-[calc(100%-var(--sidebar-width))] lg:ml-[var(--sidebar-width)] flex-1 mx-auto">
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
                    htmlFor="navbar-menu-toggle"
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
            <aside className="sticky h-[calc(100vh-var(--header-height))] top-[var(--header-height)] hidden xl:block w-[250px]">
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
