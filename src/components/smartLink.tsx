import type {Route} from 'next';
import Link from 'next/link';

import {ExternalLink} from './externalLink';

interface Props<T extends string> {
  activeClassName?: string;
  children?: React.ReactNode;
  className?: string;
  href?: Route<T>;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  remote?: boolean;
  target?: string;
  title?: string;
  to?: Route<T>;
}

export function SmartLink<T extends string>({
  to,
  href,
  children,
  activeClassName = 'active',
  remote = false,
  className = '',
  isActive,
  ...props
}: Props<T>) {
  const realTo = to || href;

  if (remote || realTo?.indexOf('://') !== -1) {
    return (
      <ExternalLink href={realTo} className={className} {...props}>
        {children || to || href}
      </ExternalLink>
    );
  }

  if (realTo === undefined || realTo === null) {
    throw new Error(`This shouldn't happen. Href/to passed to SmartLink is empty`);
  }

  return (
    <Link
      href={realTo}
      className={`${isActive ? activeClassName : ''} ${className}`}
      {...props}
    >
      {children || to || href}
    </Link>
  );
}
