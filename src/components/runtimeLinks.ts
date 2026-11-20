const RUNTIME_TITLES: Record<string, string> = {
  node: 'Node.js',
  cloudflare: 'Cloudflare',
  deno: 'Deno',
  bun: 'Bun',
};

export type RuntimeLink = {
  runtime: string;
  selected: boolean;
  title: string;
  url: string;
};

type QuickStartNode = {
  frontmatter: {runtime?: string};
  path: string;
  children?: QuickStartNode[];
  parent?: QuickStartNode;
};

/** Returns the display name of `runtime`, for example "Node.js" for `node`. */
export function getRuntimeTitle(runtime: string): string {
  return RUNTIME_TITLES[runtime] ?? runtime;
}

/**
 * Returns the page whose runtime links `page` shows: `page` itself if one of its child pages
 * sets `runtime`, for example a guide page or a manual setup page, otherwise its parent.
 */
export function getRuntimeGroup(
  page: QuickStartNode | undefined
): QuickStartNode | undefined {
  return page?.children?.some(child => child.frontmatter.runtime) ? page : page?.parent;
}

/**
 * Returns the links to the pages of `guide` for each runtime: the `guide` page and its child
 * pages that set `runtime` in their frontmatter, in doc tree order. `guide` is a guide page
 * with its quick starts, or a manual setup page with the manual setups for other runtimes.
 * The page at `path` is selected. Returns `null` if there are pages for fewer than two
 * runtimes.
 */
export function getRuntimeLinks(
  guide: QuickStartNode | undefined,
  path: string[]
): RuntimeLink[] | null {
  if (!guide) {
    return null;
  }

  const current = path.join('/');
  const links = [guide, ...(guide.children ?? [])].flatMap(page => {
    const runtime = page.frontmatter.runtime;
    return runtime
      ? [
          {
            runtime,
            selected: page.path === current,
            title: getRuntimeTitle(runtime),
            url: `/${page.path}/`,
          },
        ]
      : [];
  });
  return links.length < 2 ? null : links;
}

/**
 * Returns the sidebar title of the guide page of `guide`: "Quick Start (<runtime>)", for
 * example "Quick Start (Node.js)", if the guide page sets `runtime` in its frontmatter, or else
 * "Quick Start".
 */
export function getQuickStartTitle(guide: QuickStartNode | undefined): string {
  const runtime = guide?.frontmatter.runtime;
  return runtime ? `Quick Start (${getRuntimeTitle(runtime)})` : 'Quick Start';
}
