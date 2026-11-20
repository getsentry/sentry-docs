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
        const integrations = resolveIntegrations(
          rootNode,
          getCurrentPlatformOrGuide(rootNode, pathSegments),
          nodeForPath(rootNode, pathSegments)?.frontmatter.integration_grid ?? []
        );

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
