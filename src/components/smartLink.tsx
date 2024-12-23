'use client';

import {useCallback} from 'react';
import Link from 'next/link';

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
