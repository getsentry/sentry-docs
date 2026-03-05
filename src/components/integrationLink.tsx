import type {ReactNode} from 'react';

import {serverContext} from 'sentry-docs/serverContext';

import {SmartLink} from './smartLink';

function normalizePath(p: string): string {
  return p.replace(/\/+$/, '') || '/';
}

function isCurrentPage(href: string): boolean {
  const {path} = serverContext();
  const currentPath = normalizePath('/' + path.join('/'));
  const linkPath = normalizePath(href.startsWith('/') ? href : '/' + href);
  return currentPath === linkPath;
}

type Props = {
  children: ReactNode;
  href: string;
};

/**
 * List item that is omitted when href is the current page. Use in integration
 * lists so the current guide/page is not shown as an option.
 */
export function IntegrationListItem({href, children}: Props) {
  if (isCurrentPage(href)) {
    return null;
  }
  return (
    <li>
      <SmartLink to={href}>{children}</SmartLink>
    </li>
  );
}
