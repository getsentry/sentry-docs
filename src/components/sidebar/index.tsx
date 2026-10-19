import {getCurrentGuide, getCurrentPlatform, getDocsRootNode} from 'sentry-docs/docTree';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

import {CloseSidebarOnNavigation, ScrollActiveLink} from '../focus-active-link';
import {PlatformSelector} from '../platformSelector';
import {VersionSelector} from '../versionSelector';
import {DevelopDocsSidebar} from './developDocsSidebar';
import {MobileSidebarNav} from './MobileSidebarNav';
import {SidebarSeparator} from './sidebarLink';
import {SidebarMoreLinks} from './SidebarMoreLinks';
import {SidebarNavigation} from './sidebarNavigation';
import styles from './style.module.scss';
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

  const currentPlatform = getCurrentPlatform(rootNode, path);
  const currentGuide = getCurrentGuide(rootNode, path);

  // Only show the platform selector and sidebar for SDKs/platforms section
  if (path[0] === 'platforms') {
    // The full platform list is loaded on the client. Until then, the selector
    // only gets the current platform with the current guide (or the platform's
    // own guide entry, which is selected when `platformTitle` is set).
    const currentKey = (currentGuide ?? currentPlatform)?.key;
    const initialPlatforms = currentPlatform
      ? [
          {
            ...currentPlatform,
            guides: currentPlatform.guides.filter(g => g.key === currentKey),
            integrations: [],
          },
        ]
      : [];

    return (
      <aside className={`${styles.sidebar} py-3`} data-layout-anchor="left">
        <input type="checkbox" id={sidebarToggleId} className="hidden" />
        <style>{':root { --sidebar-width: 300px; }'}</style>
        <div className="flex flex-col items-stretch h-full min-h-0">
          <MobileSidebarNav />
          <div className="platform-selector px-3">
            <div className="mb-3">
              <PlatformSelector
                currentPlatform={currentGuide ?? initialPlatforms[0]}
                initialPlatforms={initialPlatforms}
              />
            </div>
            {versions && versions.length >= 1 && (
              <div className="mb-3">
                <VersionSelector versions={versions} sdk={currentPlatform?.name || ''} />
              </div>
            )}
          </div>
          <div className={`${styles.toc} px-3`}>
            <CloseSidebarOnNavigation sidebarToggleId={sidebarToggleId} />
            <ScrollActiveLink activeLinkSelector={activeLinkSelector} />
            <SidebarNavigation path={path} />
            <SidebarSeparator />
            <SidebarMoreLinks />
          </div>
        </div>
      </aside>
    );
  }

  // For all other sections, just show the sidebar navigation (no platform selector)
  return (
    <aside className={`${styles.sidebar} py-3`} data-layout-anchor="left">
      <input type="checkbox" id={sidebarToggleId} className="hidden" />
      <CloseSidebarOnNavigation sidebarToggleId={sidebarToggleId} />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div className="flex flex-col items-stretch h-full min-h-0">
        <MobileSidebarNav />
        <div className={`${styles['sidebar-main']} px-3`}>
          <ScrollActiveLink activeLinkSelector={activeLinkSelector} />
          <SidebarNavigation path={path} />
          <SidebarSeparator />
          <SidebarMoreLinks />
        </div>
      </div>
    </aside>
  );
}
