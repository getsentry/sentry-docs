import Link from 'next/link';
import {getCurrentPlatformOrGuide, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {resolveIntegrations} from './integrationGrid';

type Props = {
  platforms: {
    title: string;
    /** Root-relative page path, e.g. "/platforms/python/agent-tracing/". */
    to: string;
  }[];
};

/**
 * Lists platform pages, each with the integrations from that page's
 * `integration_grid` frontmatter nested under it. The nested items match the
 * `IntegrationGrid` on the linked page, so they update when that page changes.
 *
 * Nested items that link outside the platform or guide they sit under are
 * skipped. Those point to another guide, such as Mastra or Workers AI, so list
 * that guide as its own top-level entry or under its own platform instead of
 * repeating it under every platform.
 *
 * Usage in MDX:
 *   <PlatformIntegrationList
 *     platforms={[{title: "Python", to: "/platforms/python/agent-tracing/"}]}
 *   />
 */
export function PlatformIntegrationList({platforms}: Props) {
  const {rootNode} = serverContext();

  return (
    <ul>
      {platforms.map(({title, to}) => {
        const pathSegments = to.split('/').filter(Boolean);
        const platformOrGuide = getCurrentPlatformOrGuide(rootNode, pathSegments);
        const integrations = resolveIntegrations(
          rootNode,
          platformOrGuide,
          nodeForPath(rootNode, pathSegments)?.frontmatter.integration_grid ?? []
        ).filter(({url}) => !platformOrGuide || url.startsWith(platformOrGuide.url));

        return (
          <li key={to}>
            <Link href={to}>{title}</Link>
            {integrations.length > 0 && (
              <ul>
                {integrations.map(integration => (
                  <li key={integration.url}>
                    <Link href={integration.url}>{integration.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
