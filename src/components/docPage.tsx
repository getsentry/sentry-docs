import {ReactNode} from 'react';

import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter} from 'sentry-docs/types';

import {Breadcrumbs} from './breadcrumbs';
import {CodeContextProvider} from './codeContext';
import {ScrollActiveLink} from './focus-active-link';
import {GitHubCTA} from './githubCta';
import {GuideGrid} from './guideGrid';
import {Header} from './header';
import {Navbar} from './navbar';
import {PlatformSdkDetail} from './platformSdkDetail';
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
  const platformOrGuide = rootNode && getCurrentPlatformOrGuide(rootNode, path);
  const hasToc = (!notoc && !frontMatter.notoc) || !!platformOrGuide;
  const hasGithub = !!path?.length && path[0] !== 'api';

  return (
    <div className="document-wrapper">
      <div className="sidebar">
        <Header />

        <div
          className="d-md-flex flex-column align-items-stretch collapse navbar-collapse"
          id="sidebar"
        >
          <div className="toc">
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
                    <TableOfContents guideGrid={<GuideGrid className="section-nav" />} />
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
