import {T} from 'gt-next';
import Link from 'next/link';

import styles from './style.module.scss';

import {ExternalLink} from '../externalLink';

import {NavChevron} from './navChevron';

export function SidebarLink({
  title,
  href,
  isActive,
  collapsible,
  onClick,
  topLevel = false,
  beta = false,
  isNew = false,
}: {
  href: string;
  title: string;
  beta?: boolean;
  collapsible?: boolean;
  isActive?: boolean;
  isNew?: boolean;
  onClick?: () => void;
  topLevel?: boolean;
}) {
  const isRemote = href.includes('://');
  const LinkComponent = isRemote ? ExternalLink : Link;

  return (
    <LinkComponent
      href={href}
      onClick={onClick}
      className={`${styles['sidebar-link']} ${isActive ? 'active' : ''} ${
        topLevel ? styles['sidebar-link-top-level'] : ''
      }`}
      data-sidebar-link
    >
      <div className={styles['sidebar-link-content']}>
        <span>{title}</span>
        {beta && <span className={styles['beta-badge']}>BETA</span>}
        {isNew && (
          <T>
            <span className={styles['new-badge']}>NEW</span>
          </T>
        )}
      </div>
      {collapsible && <NavChevron direction={isActive ? 'down' : 'right'} />}
    </LinkComponent>
  );
}

export function SidebarSeparator() {
  return <hr className={`${styles['sidebar-separator']} mt-3 mb-3`} />;
}
