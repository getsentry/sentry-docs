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
};

/**
 * Returns the links to the quick starts of `guide`: the guide page and its child pages that
 * set `runtime` in their frontmatter, in doc tree order. The page at `path` is selected.
 * Returns `null` if the guide has quick starts for fewer than two runtimes.
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
            title: RUNTIME_TITLES[runtime] ?? runtime,
            url: `/${page.path}/`,
          },
        ]
      : [];
  });
  return links.length < 2 ? null : links;
}

/**
 * Returns the sidebar title of the guide page of `guide`: "Quick Start", or
 * "Quick Start (<runtime>)", for example "Quick Start (Node.js)", if the guide has quick
 * starts for more than one runtime.
 */
export function getQuickStartTitle(guide: QuickStartNode | undefined): string {
  const runtime = getRuntimeLinks(guide, [])?.find(
    link => link.url === `/${guide?.path}/`
  )?.title;
  return runtime ? `Quick Start (${runtime})` : 'Quick Start';
}
