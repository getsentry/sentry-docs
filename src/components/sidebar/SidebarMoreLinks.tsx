'use client';

import {Fragment, useState} from 'react';
import {ChevronDownIcon, ChevronRightIcon} from '@radix-ui/react-icons';

import styles from './style.module.scss';

import {SidebarLink} from './sidebarLink';

export function SidebarMoreLinks() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ul data-sidebar-tree>
      <li className="mb-3" data-sidebar-branch>
        <ul data-sidebar-tree>
          {/* Always visible links */}
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

          {/* Collapsible "More" section - styled to match SidebarLink */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${styles['sidebar-link']} font-bold`}
            data-sidebar-link
          >
            <div className={styles['sidebar-link-content']}>
              <span>More</span>
            </div>
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <Fragment>
              <SidebarLink href="https://about.codecov.io/" title="Codecov" />
              <SidebarLink href="https://discord.gg/sentry" title="Discord" />
              <SidebarLink href="https://sentry.zendesk.com/hc/en-us/" title="Support" />
              <SidebarLink
                href="https://develop.sentry.dev/self-hosted/"
                title="Self-Hosting Sentry"
              />
              <SidebarLink
                href="https://develop.sentry.dev"
                title="Developer Documentation"
              />
            </Fragment>
          )}
        </ul>
      </li>
    </ul>
  );
}
