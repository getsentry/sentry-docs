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
  className,
}: {
  href: string;
  title: string;
  className?: string;
  collapsible?: boolean;
  isActive?: boolean;
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
      } ${className ?? ''}`}
      data-sidebar-link
    >
      <div>{title}</div>
      {collapsible && <NavChevron direction={isActive ? 'down' : 'right'} />}
    </LinkComponent>
  );
}

export function SidebarSeparator() {
  return <hr className={`${styles['sidebar-separator']} mt-3 mb-3`} />;
}
