import {ReactNode} from 'react';

import {
  extractPlatforms,
  getCurrentGuide,
  getCurrentPlatform,
  nodeForPath,
} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter, Platform} from 'sentry-docs/types';

import {Breadcrumbs} from './breadcrumbs';
import {CodeContextProvider} from './codeContext';
import {ScrollActiveLink} from './focus-active-link';
import {GitHubCTA} from './githubCta';
import {Header} from './header';
import {Navbar} from './navbar';
import {PlatformSdkDetail} from './platformSdkDetail';
import {PlatformSelector} from './platformSelector';
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

  return (
    <div className="document-wrapper">
      <div className="sidebar">
        <Header />

        <div
          className="d-md-flex flex-column align-items-stretch collapse navbar-collapse"
          id="sidebar"
        >
          <div className="platform-selector">
            <div className="px-3 pt-2">
              <div className="sidebar-title">
                <h6>Language / Framework</h6>
              </div>
              <PlatformSelector
                platforms={platforms}
                currentPlatform={currentGuide || currentPlatform}
              />
            </div>
          </div>
          <div className="toc">
            <ScrollActiveLink />
            <div className="text-white px-3">{sidebar}</div>
          </div>
        </div>
        <div className="d-sm-none d-block" id="navbar-menu" />
      </div>
      <main role="main" className="px-0">
        <div className="flex-grow-1">
          <div className="d-block navbar-right-half">
            <Navbar />
          </div>

          <section className="pt-3 px-3 content-max prose2">
            <div className="pb-3">
              <Breadcrumbs />
            </div>
            <div className="row">
              <div className={hasToc ? 'col-sm-8 col-md-12 col-lg-8 col-xl-9' : 'col-12'}>
                <h1 className="mb-3">{frontMatter.title}</h1>
                <div id="main">
                  <CodeContextProvider>{children}</CodeContextProvider>
                </div>
                {hasGithub && <GitHubCTA />}
              </div>
              {hasToc && (
                <div className="col-sm-4 col-md-12 col-lg-4 col-xl-3">
                  <div className="page-nav">
                    <PlatformSdkDetail />
                    <TableOfContents />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
