import Link from 'next/link';
import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {PlatformIcon} from './platformIcon';
import {isPlatformSupported} from './platformSection';

type Integration = {
  /** Platform icon key, e.g. "anthropic", "openai", "langchain". */
  icon: string;
  /** Display name of the integration. */
  title: string;
  /** Absolute path for links that target a different platform or guide. */
  href?: string;
  /** Platform-relative path, e.g. "/integrations/anthropic/". */
  to: string;
  /** Optional one-line description shown under the title. */
  description?: string;
  /** Platform/guide keys that hide this card, like `PlatformSection`. */
  notSupported?: string[];
  /** Platform/guide keys that show this card, like `PlatformSection`. */
  supported?: string[];
};

type Props = {
  integrations: Integration[];
};

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
 */
export function IntegrationGrid({integrations}: Props) {
  const {rootNode, path} = serverContext();
  const currentPlatformOrGuide = getCurrentPlatformOrGuide(rootNode, path);

  const hrefFor = (to: string, href?: string) =>
    href ??
    (currentPlatformOrGuide
      ? currentPlatformOrGuide.url + to.slice(1)
      : `/platform-redirect/?next=${encodeURIComponent(to)}`);

  const visibleIntegrations = currentPlatformOrGuide
    ? integrations.filter(({supported, notSupported}) =>
        isPlatformSupported(rootNode, currentPlatformOrGuide, supported, notSupported)
      )
    : integrations;

  if (visibleIntegrations.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 not-prose mt-4 mb-6">
      {visibleIntegrations.map(({icon, title, href, to, description}) => (
        <Link
          key={href ?? to}
          href={hrefFor(to, href)}
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
