import {Button} from '@radix-ui/themes';
import Link from 'next/link';
import {nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {PlatformIcon} from './platformIcon';
import {getRuntimeGroup, getRuntimeLinks} from './runtimeLinks';

/**
 * Links the pages of the current guide for each runtime: the quick starts (the guide page and
 * its child pages), or the manual setups (the manual setup page and its child pages), that set
 * `runtime` in their frontmatter. `DocPage` renders it on each page that sets `runtime`. The
 * links are plain anchors, so they are also in the page's Markdown export for AI agents.
 */
export function RuntimeSelector() {
  const {rootNode, path} = serverContext();
  const links = getRuntimeLinks(getRuntimeGroup(nodeForPath(rootNode, path)), path);
  if (!links) {
    return null;
  }

  return (
    <nav
      aria-label="Runtime"
      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 my-4"
    >
      <span className="font-medium">Runtime</span>
      <ul className="flex flex-wrap gap-2 !m-0 !p-0 list-none">
        {links.map(link => (
          <li key={link.runtime} className="!m-0 !p-0">
            <Button
              asChild
              variant="surface"
              color={link.selected ? undefined : 'gray'}
              size="2"
            >
              <Link
                href={link.url}
                aria-current={link.selected ? 'page' : undefined}
                // Overrides the link color of the page content
                className={`!no-underline ${link.selected ? '' : '!text-[var(--gray-12)]'}`}
              >
                <span data-mdast="ignore" className="flex">
                  <PlatformIcon
                    platform={`${path[1]}-${link.runtime}`}
                    size={16}
                    format="sm"
                    className="!border-none !shadow-none"
                  />
                </span>
                {link.title}
                {link.selected && (
                  // Only for the Markdown export: `aria-current` is not in Markdown
                  <span className="sr-only" aria-hidden="true">
                    {' '}
                    (current page)
                  </span>
                )}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
