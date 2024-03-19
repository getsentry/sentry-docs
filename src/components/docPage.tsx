import {ReactNode} from 'react';

import {
  extractPlatforms,
  getCurrentGuide,
  getCurrentPlatform,
  nodeForPath,
} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {Platform, PlatformGuide} from 'sentry-docs/types';

import {Breadcrumbs} from './breadcrumbs';
import {CodeContextProvider} from './codeContext';
import {ScrollActiveLink} from './focus-active-link';
import {GitHubCTA} from './githubCta';
import {GuideDropdown} from './guideDropdown';
import {Header} from './header';
import {Navbar} from './navbar';
import {NavbarPlatformDropdown} from './navbarPlatformDropdown';
import {PlatformSdkDetail} from './platformSdkDetail';
import {ServerSidebar} from './serverSidebar';
import {TableOfContents} from './tableOfContents';

type Props = {
  children: any;
  frontMatter: any;
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
        const platformForPath = nodeForPath(rootNode, [
          'platforms',
          platform.name,
          ...path.slice(currentGuide ? 4 : 2),
        ]);
        // link to the section of this platform's docs that matches the current path when applicable
        return platformForPath
          ? {...platform, url: '/' + platformForPath.path + '/'}
          : platform;
      });

  const guides: PlatformGuide[] = !(rootNode && currentPlatform)
    ? []
    : currentPlatform.guides.map(guide => {
        const guideForPath = nodeForPath(rootNode, [
          'platforms',
          currentPlatform.name,
          'guides',
          guide.name,
          ...path.slice(currentGuide ? 4 : 2),
        ]);
        return guideForPath ? {...guide, url: '/' + guideForPath.path + '/'} : guide;
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
          <div className="px-3 pt-2 pb-1">
            <NavbarPlatformDropdown
              platforms={platforms}
              currentPlatform={currentPlatform}
            />
          </div>

          <div className="px-3 pb-3">
            <GuideDropdown guides={guides} currentGuide={currentGuide} />
          </div>
          <div className="toc">
            <div className="text-white px-3">{sidebar}</div>
            <ScrollActiveLink />
            <div className="text-white p-3">{sidebar}</div>
          </div>
        </div>
        <div className="d-sm-none d-block" id="navbar-menu" />
      </div>
      <main role="main" className="px-0">
        <div className="flex-grow-1">
          <div className="d-block navbar-right-half">
            <Navbar />
          </div>

          <section className="pt-3 px-3 content-max prose">
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
