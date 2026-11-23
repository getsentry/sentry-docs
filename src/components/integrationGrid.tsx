import Link from 'next/link';
import {DOCS_ORIGIN} from 'sentry-docs/docsSite.mjs';
import {DocNode, getCurrentPlatformOrGuide, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {IntegrationGridItem, Platform, PlatformGuide} from 'sentry-docs/types';

import {PlatformIcon} from './platformIcon';
import {isPlatformSupported} from './platformSection';

type Props = {
  /** Defaults to the `integration_grid` frontmatter of the current page. */
  integrations?: IntegrationGridItem[];
};

type ResolvedIntegration = IntegrationGridItem & {url: string};

/**
 * Resolves integration links for a platform or guide and drops the ones that
 * don't apply to it, either through `supported`/`notSupported` or because the
 * target page doesn't exist.
 */
export function resolveIntegrations(
  rootNode: DocNode,
  platformOrGuide: Platform | PlatformGuide | undefined,
  integrations: IntegrationGridItem[]
): ResolvedIntegration[] {
  const withUrls = integrations.map(integration => ({
    ...integration,
    url:
      integration.href ??
      (platformOrGuide
        ? platformOrGuide.url + integration.to.slice(1)
        : `/platform-redirect/?next=${encodeURIComponent(integration.to)}`),
  }));

  if (!platformOrGuide) {
    return withUrls;
  }

  return withUrls.filter(({url, supported, notSupported}) => {
    if (!isPlatformSupported(rootNode, platformOrGuide, supported, notSupported)) {
      return false;
    }

    const targetUrl = new URL(url, DOCS_ORIGIN);
    if (targetUrl.origin !== DOCS_ORIGIN) {
      return true;
    }

    const targetNode = nodeForPath(
      rootNode,
      targetUrl.pathname.split('/').filter(Boolean)
    );
    return Boolean(targetNode && !targetNode.missing);
  });
}

/**
 * A responsive grid of integration cards, each showing the integration's logo
 * and name. Links resolve relative to the current platform (like PlatformLink).
 *
 * Usage in MDX:
 *   <IntegrationGrid
 *     integrations={[
 *       {to: "/integrations/anthropic/", title: "Anthropic", icon: "anthropic"},
 *     ]}
 *   />
 *
 * Without `integrations`, it renders the page's `integration_grid` frontmatter.
 */
export function IntegrationGrid({integrations}: Props) {
  const {rootNode, path} = serverContext();
  const visibleIntegrations = resolveIntegrations(
    rootNode,
    getCurrentPlatformOrGuide(rootNode, path),
    integrations ?? nodeForPath(rootNode, path)?.frontmatter.integration_grid ?? []
  );

  if (visibleIntegrations.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 not-prose mt-4 mb-6">
      {visibleIntegrations.map(({icon, title, url, description}) => (
        <Link
          key={url}
          href={url}
          className="no-underline group flex flex-row items-center gap-3 px-4 py-2 rounded-lg shadow border border-[var(--gray-5)] dark:bg-[var(--gray-4)] text-[var(--foreground)] transition-shadow hover:shadow-md"
        >
          <PlatformIcon
            size={32}
            platform={icon}
            format="sm"
            style={{
              border: 0,
              boxShadow: 'none',
              flexShrink: 0,
              marginTop: 0,
              marginBottom: 0,
            }}
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-base font-medium leading-none group-hover:underline truncate">
              {title}
            </span>
            {description && (
              <p className="text-[length:--font-size-2] text-[var(--gray-11)] m-0 mt-0.5 truncate">
                {description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
