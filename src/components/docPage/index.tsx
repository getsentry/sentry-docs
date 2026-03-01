import {ReactNode} from 'react';

import {
  extractPlatforms,
  getCurrentGuide,
  getCurrentPlatform,
  getCurrentPlatformOrGuide,
  nodeForPath,
} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter} from 'sentry-docs/types';
import {PaginationNavNode} from 'sentry-docs/types/paginationNavNode';
import {isNotNil} from 'sentry-docs/utils';
import {getMarkdownContent} from 'sentry-docs/utils/getMarkdownContent';
import {getUnversionedPath} from 'sentry-docs/versioning';

import './type.scss';

import {Banner} from '../banner';
import {Breadcrumbs} from '../breadcrumbs';
import {buildBreadcrumbs} from '../breadcrumbs/utils';
import {CodeContextProvider} from '../codeContext';
import {CopyMarkdownButton} from '../copyMarkdownButton';
import {DocFeedback} from '../docFeedback';
import {GitHubCTA} from '../githubCTA';
import {Header} from '../header';
import {MarkdownButton} from '../markdownButton';
import Mermaid from '../mermaid';
import {PaginationNav} from '../paginationNav';
import {PlatformSdkDetail} from '../platformSdkDetail';
import {getSdkPackageName} from '../platformSdkPackageName';
import {Sidebar} from '../sidebar';
import {SidebarTableOfContents} from '../sidebarTableOfContents';
import {ReaderDepthTracker} from '../track-reader-depth';

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

export async function DocPage({
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
  const platforms = extractPlatforms(rootNode);
  const platformOrGuide = getCurrentPlatformOrGuide(rootNode, path);
  const sdkPackage = await getSdkPackageName(platformOrGuide);

  const hasToc = (!notoc && !frontMatter.notoc) || !!(currentPlatform || currentGuide);
  const hasGithub = !!path?.length && path[0] !== 'api';

  const pathname = serverContext().path.join('/');

  const searchPlatforms = [currentPlatform?.name, currentGuide?.name].filter(isNotNil);

  const unversionedPath = getUnversionedPath(path, false);

  const leafNode = nodeForPath(rootNode, unversionedPath);

  // Fetch markdown content for the current page
  const markdownContent = await getMarkdownContent();

  return (
    <div className="tw-app">
      <Header
        pathname={pathname}
        searchPlatforms={searchPlatforms}
        platforms={platforms}
      />
      <section className="px-0 flex relative">
        {sidebar ?? (
          <Sidebar path={unversionedPath.split('/')} versions={frontMatter.versions} />
        )}
        <main className="main-content flex mt-[var(--header-height)] flex-1">
          <div
            className={[
              'pt-6 px-6 prose dark:prose-invert max-w-full text-[var(--gray-12)] prose-a:no-underline hover:prose-a:underline',
              'prose-code:font-normal prose-code:font-mono marker:text-[var(--accent)] prose-li:my-1',
              'prose-headings:mt-0 prose-headings:font-medium prose-headings:relative prose-headings:text-[var(--gray-12)]',
              'prose-blockquote:font-normal prose-blockquote:border-l-[3px] prose-em:font-normal prose-blockquote:text-[var(--gray-12)]',
              'prose-img:my-2',
              'prose-strong:text-[var(--gray-12)]',
              // Allow flex item to shrink within layout; prevents long content from
              // forcing the main column to grow and squeezing the ToC
              fullWidth ? 'max-w-none w-full min-w-0' : 'w-full min-w-0',
            ].join(' ')}
            id="doc-content"
          >
            <div className="mb-4">
              <Banner />
            </div>
            <div className="flex items-center">
              <Breadcrumbs items={buildBreadcrumbs(leafNode)} />{' '}
              <div className="ml-auto hidden sm:block">
                <CopyMarkdownButton pathname={pathname} />
              </div>
            </div>
            <div>
              <div className="flex items-start justify-between">
                <hgroup>
                  <h1>{frontMatter.title}</h1>
                  <h2>{frontMatter.description}</h2>
                </hgroup>
                <div className="flex-shrink-0 mt-11">
                  <MarkdownButton markdownContent={markdownContent} />
                </div>
              </div>
              {/* This exact id is important for Algolia indexing */}
              <div id="main">
                <CodeContextProvider sdkPackage={sdkPackage}>
                  {children}
                </CodeContextProvider>
              </div>

              <div className="grid grid-cols-2 gap-4 not-prose mt-16">
                <div className="col-span-1">
                  {previousPage && <PaginationNav node={previousPage} title="Previous" />}
                </div>
                <div className="col-span-1">
                  {nextPage && <PaginationNav node={nextPage} title="Next" />}
                </div>
              </div>

              <DocFeedback pathname={pathname} />

              {hasGithub && <GitHubCTA />}
            </div>
          </div>
        </main>
        {hasToc && (
          <aside
            data-layout-anchor="right"
            className="sticky h-[calc(100vh-var(--header-height))] top-[var(--header-height)] overflow-y-auto hidden toc:block flex-none w-[250px] min-w-[250px]"
          >
            <div className="sidebar">
              <SidebarTableOfContents />
              <PlatformSdkDetail />
            </div>
          </aside>
        )}
      </section>
      <style>{`:root { --doc-content-w: 1100px; }`}</style>
      <style>{`
        #doc-content {
          max-width: none;
          box-sizing: border-box;
        }
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .main-content {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }
          #doc-content {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }
        }
        /* At toc breakpoint (1490px), constrain content to leave room for TOC */
        @media (min-width: 1490px) {
          #doc-content {
            /* Calculate max width: viewport - sidebar - TOC */
            max-width: calc(100vw - 300px - 250px);
          }
        }
        @media (min-width: 2057px) {
          :root {
            --doc-content-w: 1100px;
            --toc-w: 250px;
            --gap: 24px;
          }
          /* Cap content width and center (reinforced at this breakpoint) */
          #doc-content {
            max-width: var(--doc-content-w);
            padding-left: 2rem;
            padding-right: 2rem;
            margin-left: auto;
            margin-right: auto;
          }
          /* Cancel default push so content can center */
          [data-layout-anchor="left"] + .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
          /* Anchor sidebars to content edges */
          [data-layout-anchor="left"] {
            left: calc(50% - (var(--doc-content-w) / 2) - var(--gap) - var(--sidebar-width));
          }
          [data-layout-anchor="right"] {
            position: fixed !important;
            left: calc(50% + (var(--doc-content-w) / 2) + var(--gap));
            width: var(--toc-w);
          }
        }
      `}</style>

      <Mermaid />
      <ReaderDepthTracker />
    </div>
  );
}
