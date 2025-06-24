'use client';

import Link from 'next/link';

import {ferryUrlParams} from 'sentry-docs/utils';

interface ParamFerryLinkProps {
  [key: string]: any;
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  target?: string;
  title?: string;
}

/**
 * A Link component that automatically ferries URL parameters
 * This is a safer alternative to DOM manipulation
 */
export function ParamFerryLink({href, children, ...props}: ParamFerryLinkProps) {
  // Only ferry parameters for internal links
  const shouldFerry = href && (href.startsWith('/') || href.startsWith('#'));
  const finalHref = shouldFerry ? ferryUrlParams(href) : href;

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  );
}

export default ParamFerryLink;
