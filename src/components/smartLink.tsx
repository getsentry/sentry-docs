'use client';

import Link from 'next/link';
import {useCallback} from 'react';

import {ExternalLink} from './externalLink';

interface Props {
  activeClassName?: string;
  children?: React.ReactNode;
  className?: string;
  href?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  remote?: boolean;
  target?: string;
  title?: string;
  to?: string;
}

export function SmartLink({
  to,
  href,
  children,
  activeClassName = 'active',
  remote = false,
  className = '',
  isActive,
  ...props
}: Props) {
  const realTo = to || href || '';

  const handleAutolinkClick = useCallback((e: React.MouseEvent) => {
    const link = e.currentTarget as HTMLAnchorElement;
    if (link.classList.contains('autolink-heading')) {
      navigator.clipboard.writeText(link.href);
    }
  }, []);

  if (remote || realTo?.indexOf('://') !== -1) {
    return (
      <ExternalLink href={realTo} className={className} {...props}>
        {children || to || href}
      </ExternalLink>
    );
  }

  // Hash-only links: use a plain <a> so the browser fires hashchange.
  // When the target is inside a closed <details>, prevent the browser's
  // premature scroll and let the Expandable handler scroll after opening.
  if (realTo.startsWith('#')) {
    return (
      <a
        href={realTo}
        className={className}
        onClick={e => {
          handleAutolinkClick(e);
          const targetId = realTo.slice(1);
          const target = targetId ? document.getElementById(targetId) : null;
          if (target?.closest('details:not([open])')) {
            e.preventDefault();
            window.history.pushState(null, '', realTo);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }
        }}
        {...props}
      >
        {children || to || href}
      </a>
    );
  }

  return (
    <Link
      href={to || href || ''}
      onClick={handleAutolinkClick}
      className={`${isActive ? activeClassName : ''} ${className}`}
      {...props}
    >
      {children || to || href}
    </Link>
  );
}
