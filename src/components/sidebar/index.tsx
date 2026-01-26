import {
  extractPlatforms,
  getCurrentGuide,
  getCurrentPlatform,
  getDocsRootNode,
  nodeForPath,
} from 'sentry-docs/docTree';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {Platform} from 'sentry-docs/types';

import styles from './style.module.scss';

import {ScrollActiveLink} from '../focus-active-link';
import {PlatformSelector} from '../platformSelector';
import {VersionSelector} from '../versionSelector';

import {DevelopDocsSidebar} from './developDocsSidebar';
import {SidebarNavigation} from './sidebarNavigation';
import {SidebarProps} from './types';

// Pages that have different paths on different platforms but are conceptually equivalent
const EQUIVALENT_PATHS: Record<string, string> = {
  'ai-agent-monitoring': 'ai-agent-monitoring-browser',
  'ai-agent-monitoring-browser': 'ai-agent-monitoring',
};

const activeLinkSelector = `.${styles.sidebar} .toc-item .active`;

export const sidebarToggleId = styles['navbar-menu-toggle'];

export async function Sidebar({path, versions}: SidebarProps) {
  const rootNode = await getDocsRootNode();

  if (isDeveloperDocs) {
    return (
      <DevelopDocsSidebar
        sidebarToggleId={sidebarToggleId}
        path={'/' + path.join('/') + '/'}
        rootNode={rootNode}
      />
    );
  }

  const currentPlatform = getCurrentPlatform(rootNode, path);
  const currentGuide = getCurrentGuide(rootNode, path);

  const platforms: Platform[] = !rootNode
    ? []
    : extractPlatforms(rootNode).map(platform => {
        // take the :path in /platforms/:platformName/:path
        // or /platforms/:platformName/guides/:guideName/:path when we're in a guide
        const currentPathParts = path.slice(currentGuide ? 4 : 2);
        const lastPart = currentPathParts[currentPathParts.length - 1];
        const equivalentPath = EQUIVALENT_PATHS[lastPart];

        const platformPageForCurrentPath =
          nodeForPath(rootNode, ['platforms', platform.name, ...currentPathParts]) ||
          // try equivalent path (e.g., ai-agent-monitoring <-> ai-agent-monitoring-browser)
          (equivalentPath &&
            nodeForPath(rootNode, [
              'platforms',
              platform.name,
              ...currentPathParts.slice(0, -1),
              equivalentPath,
            ])) ||
          // try to go one page higher, example: go to /usage/ from /usage/something
          nodeForPath(rootNode, [
            'platforms',
            platform.name,
            ...currentPathParts.slice(0, -1),
          ]);

        return {
          ...platform,
          url:
            platformPageForCurrentPath && !platformPageForCurrentPath.missing
              ? '/' + platformPageForCurrentPath.path + '/'
              : platform.url,
          guides: platform.guides.map(guide => {
            const guidePageForCurrentPath =
              nodeForPath(rootNode, [
                'platforms',
                platform.name,
                'guides',
                guide.name,
                ...currentPathParts,
              ]) ||
              // try equivalent path (e.g., ai-agent-monitoring <-> ai-agent-monitoring-browser)
              (equivalentPath &&
                nodeForPath(rootNode, [
                  'platforms',
                  platform.name,
                  'guides',
                  guide.name,
                  ...currentPathParts.slice(0, -1),
                  equivalentPath,
                ]));
            return guidePageForCurrentPath && !guidePageForCurrentPath.missing
              ? {
                  ...guide,
                  url: '/' + guidePageForCurrentPath.path + '/',
                }
              : guide;
          }),
        };
      });

  return (
    <aside className={`${styles.sidebar} py-3`} data-layout-anchor="left">
      <input type="checkbox" id={sidebarToggleId} className="hidden" />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div className="md:flex flex-col items-stretch overflow-auto">
        <div className="platform-selector px-3">
          <div className="mb-3">
            <PlatformSelector
              platforms={platforms}
              currentPlatform={currentGuide || currentPlatform}
            />
          </div>
          {versions && versions.length >= 1 && (
            <div className="mb-3">
              <VersionSelector versions={versions} sdk={currentPlatform?.name || ''} />
            </div>
          )}
        </div>
        <div className={`${styles.toc} px-3`}>
          <ScrollActiveLink activeLinkSelector={activeLinkSelector} />
          <SidebarNavigation path={path} />
        </div>
      </div>
    </aside>
  );
}
