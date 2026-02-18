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
  href: string;
  children: React.ReactNode;
};

/**
 * Renders a link that is hidden when the current page path matches href.
 * Used in "Integrations" / "Other integrations" lists so the current page
 * is not listed as an option.
 */
export function IntegrationLink({href, children}: Props) {
  if (isCurrentPage(href)) {
    return null;
  }
  return <SmartLink to={href}>{children}</SmartLink>;
}

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
