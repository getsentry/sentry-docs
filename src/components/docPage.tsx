import {ReactNode} from 'react';
import {Cross1Icon, HamburgerMenuIcon} from '@radix-ui/react-icons';
import {IconButton} from '@radix-ui/themes';
import Image from 'next/image';

import {
  extractPlatforms,
  getCurrentGuide,
  getCurrentPlatform,
  nodeForPath,
} from 'sentry-docs/docTree';
import SentryLogoSVG from 'sentry-docs/logos/sentry-logo-dark.svg';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter, Platform} from 'sentry-docs/types';

import {Breadcrumbs} from './breadcrumbs';
import {CodeContextProvider} from './codeContext';
import {ScrollActiveLink} from './focus-active-link';
import {GitHubCTA} from './githubCTA';
import {MobileMenu} from './mobileMenu';
import {NavLink} from './navlink';
import {PlatformSdkDetail} from './platformSdkDetail';
import {PlatformSelector} from './platformSelector';
import {Search} from './search';
import {ServerSidebar} from './serverSidebar';
import {TableOfContents} from './tableOfContents';

type Props = {
  children: ReactNode;
  frontMatter: Omit<FrontMatter, 'slug'>;
  notoc?: boolean;
  sidebar?: ReactNode;
};

export function DocPage({
  children,
  frontMatter,
  notoc = false,
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

  return (
    <div className="tw-app">
      <header className="bg-white w-full z-50 border-b border-gray sticky top-0">
        <nav className="mx-auto px-6 lg:px-8 flex items-center text-primary">
          <a
            href="/"
            title="Sentry error monitoring"
            className="flex flex-shrink-0 items-center text-2xl font-bold text-darkPurple hover:no-underline hover:text-darkPurple"
          >
            <Image src={SentryLogoSVG} alt="Sentry's logo" width={64} className="h-16" />
            Docs
          </a>
          <div className="hidden md:flex md:justify-center lg:justify-start w-full">
            <Search path={pathname} platforms={[]} />
          </div>
          <div className="hidden lg:flex justify-end w-full space-x-2 items-center">
            <NavLink href="/api/">API</NavLink>
            <NavLink href="/changelog">Changelog</NavLink>
            <NavLink href="https://try.sentry-demo.com/demo/start/">Sandbox</NavLink>
            <NavLink href="https://sentry.io/">Sign In</NavLink>
          </div>
          <div className="lg:hidden ml-auto">
            <MobileMenu />
          </div>
        </nav>
      </header>

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
          <div className="md:flex flex-col items-stretch" id="sidebar">
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
        <main className="mx-auto lg:mx-0">
          <div
            className={[
              'pt-6 px-6 prose max-w-[75ch] prose-slate prose-a:no-underline hover:prose-a:underline',
              'prose-code:font-normal marker:text-accent-purple prose-li:my-1',
              'prose-headings:mt-0 prose-headings:font-medium prose-headings:relative',
              'prose-blockquote:font-normal prose-blockquote:border-l-[3px]',
            ].join(' ')}
          >
            <div className="pb-4">
              <Breadcrumbs />
            </div>
            <div>
              <h1 className="pl-8 lg:p-0 relative">
                <button className="lg:hidden absolute left-0 cursor-pointer">
                  <label
                    htmlFor="navbar-menu-toggle"
                    aria-label="Close"
                    aria-hidden="true"
                    className="inline-flex items-center"
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
        </main>
        {hasToc && (
          <aside className="sticky mt-[130px] hidden lg:block">
            <PlatformSdkDetail />
            <TableOfContents />
          </aside>
        )}
      </section>
    </div>
  );
}
