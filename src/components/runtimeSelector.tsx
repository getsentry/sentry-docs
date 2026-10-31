import {Button} from '@radix-ui/themes';
import Link from 'next/link';
import {nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {PlatformIcon} from './platformIcon';
import {getRuntimeLinks} from './runtimeLinks';

/**
 * Links the quick starts of the current guide for each runtime: the guide page and its child
 * pages that set `runtime` in their frontmatter. The links are plain anchors, so they are also
 * in the page's Markdown export for AI agents.
 */
export function RuntimeSelector() {
  const {rootNode, path} = serverContext();
  const links = getRuntimeLinks(nodeForPath(rootNode, path.slice(0, 4)), path);
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
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
