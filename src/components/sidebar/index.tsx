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
import {SidebarLink, SidebarSeparator} from './sidebarLink';
import {SidebarNavigation} from './sidebarNavigation';
import {SidebarProps} from './types';

export const sidebarToggleId = styles['navbar-menu-toggle'];

const activeLinkSelector = `.${styles.sidebar} .toc-item .active`;

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

  // Only show the platform selector and sidebar for SDKs/platforms section
  if (path[0] === 'platforms') {
    const currentPlatform = getCurrentPlatform(rootNode, path);
    const currentGuide = getCurrentGuide(rootNode, path);
    const platforms: Platform[] = !rootNode
      ? []
      : extractPlatforms(rootNode).map(platform => {
          const platformPageForCurrentPath =
            nodeForPath(rootNode, [
              'platforms',
              platform.name,
              ...path.slice(currentGuide ? 4 : 2),
            ]) ||
            nodeForPath(rootNode, [
              'platforms',
              platform.name,
              ...path.slice(currentGuide ? 4 : 2, path.length - 1),
            ]);

          return {
            ...platform,
            url:
              platformPageForCurrentPath && !platformPageForCurrentPath.missing
                ? '/' + platformPageForCurrentPath.path + '/'
                : platform.url,
            guides: platform.guides.map(guide => {
              const guidePageForCurrentPath = nodeForPath(rootNode, [
                'platforms',
                platform.name,
                'guides',
                guide.name,
                ...path.slice(currentGuide ? 4 : 2),
              ]);
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
      <aside className={`${styles.sidebar} py-3`}>
        <input type="checkbox" id={sidebarToggleId} className="hidden" />
        <style>{':root { --sidebar-width: 300px; }'}</style>
        <div
          className="md:flex flex-col items-stretch h-full"
          style={{display: 'flex', flexDirection: 'column', height: '100%'}}
        >
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
          <div className={`${styles.toc} px-3 flex-1`} style={{overflow: 'auto'}}>
            <ScrollActiveLink activeLinkSelector={activeLinkSelector} />
            <SidebarNavigation path={path} />
          </div>
          <SidebarSeparator />
          <div className={`${styles['sidebar-external-links']} px-3`} style={{flex: '0 0 auto', paddingBottom: 0}}>
            <ul data-sidebar-tree>
              <li className="mb-3" data-sidebar-branch>
                <ul data-sidebar-tree>
                  <SidebarLink
                    href="https://sentry.io/changelog/"
                    title="Changelog"
                    className="font-bold"
                  />
                  <SidebarLink
                    href="https://sandbox.sentry.io/"
                    title="Sandbox"
                    className="font-bold"
                  />
                  <SidebarLink href="https://about.codecov.io/" title="Codecov" />
                  <SidebarLink href="https://discord.gg/sentry" title="Discord" />
                  <SidebarLink
                    href="https://sentry.zendesk.com/hc/en-us/"
                    title="Support"
                  />
                  <SidebarLink
                    href="https://develop.sentry.dev/self-hosted/"
                    title="Self-Hosting Sentry"
                  />
                  <SidebarLink
                    href="https://develop.sentry.dev"
                    title="Developer Documentation"
                  />
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    );
  }

  // For all other sections, just show the sidebar navigation (no platform selector)
  return (
    <aside className={`${styles.sidebar} py-3`}>
      <input type="checkbox" id={sidebarToggleId} className="hidden" />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div
        className="md:flex flex-col items-stretch h-full"
        style={{display: 'flex', flexDirection: 'column', height: '100%'}}
      >
        <div className={`${styles['sidebar-main']} px-3 flex-1`} style={{overflow: 'auto'}}>
          <ScrollActiveLink activeLinkSelector={activeLinkSelector} />
          <SidebarNavigation path={path} />
        </div>
        <SidebarSeparator />
        <div className={`${styles['sidebar-external-links']} px-3`} style={{flex: '0 0 auto', paddingBottom: 0}}>
          <ul data-sidebar-tree>
            <li className="mb-3" data-sidebar-branch>
              <ul data-sidebar-tree>
                <SidebarLink
                  href="https://sentry.io/changelog/"
                  title="Changelog"
                  className="font-bold"
                />
                <SidebarLink
                  href="https://sandbox.sentry.io/"
                  title="Sandbox"
                  className="font-bold"
                />
                <SidebarLink href="https://about.codecov.io/" title="Codecov" />
                <SidebarLink href="https://discord.gg/sentry" title="Discord" />
                <SidebarLink
                  href="https://sentry.zendesk.com/hc/en-us/"
                  title="Support"
                />
                <SidebarLink
                  href="https://develop.sentry.dev/self-hosted/"
                  title="Self-Hosting Sentry"
                />
                <SidebarLink
                  href="https://develop.sentry.dev"
                  title="Developer Documentation"
                />
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
