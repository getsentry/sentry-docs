'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import {useCallback} from 'react';
import {ensureTrailingSlash} from 'sentry-docs/utils';

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

  const handleAutolinkClick = useCallback(async (e: React.MouseEvent) => {
    const link = e.currentTarget as HTMLAnchorElement;
    if (link.classList.contains('autolink-heading')) {
      try {
        await navigator.clipboard.writeText(link.href);
      } catch {
        Sentry.logger.warn('clipboard.writeText permission denied', {
          url: link.href,
          userAgent: navigator.userAgent,
        });
      }
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

  // Only add trailing slashes to internal page paths. Skip URLs with a scheme
  // (e.g. mailto:) and paths that point to static files with an extension
  // (e.g. /pdfs/report.pdf), since those are not Next.js pages.
  const hasScheme = realTo.includes(':');
  const hasFileExtension = /\.\w{2,10}(?=[?#]|$)/.test(realTo);
  const normalizedHref =
    hasScheme || hasFileExtension ? realTo : ensureTrailingSlash(realTo);

  return (
    <Link
      href={normalizedHref}
      onClick={handleAutolinkClick}
      className={`${isActive ? activeClassName : ''} ${className}`}
      {...props}
    >
      {children || to || href}
    </Link>
  );
}
