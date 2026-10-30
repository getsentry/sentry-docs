/**
 * Runtime metadata for quick starts in Markdown exports.
 *
 * A quick start sets `runtime` in its frontmatter, for example `cloudflare`.
 * The quick starts of one guide (the guide page and its direct children) are
 * one group, for example the Next.js and the Next.js on Cloudflare quick starts.
 * Guide pages with a `runtime` and no runtime children, for example the
 * Node.js, Bun, Deno and Cloudflare guides, are one group per platform.
 */

const runtimeOf = node => node.frontmatter?.runtime;

function runtimeGroups(docTree) {
  const platforms = docTree?.children?.find(child => child.slug === 'platforms');
  const groups = [];
  for (const platform of platforms?.children ?? []) {
    const guides = platform.children?.find(child => child.slug === 'guides');
    const runtimeGuides = [];
    for (const guide of guides?.children ?? []) {
      const runtimeChildren = (guide.children ?? []).filter(runtimeOf);
      if (runtimeChildren.length > 0) {
        groups.push([guide, ...runtimeChildren].filter(runtimeOf));
      } else if (runtimeOf(guide)) {
        runtimeGuides.push(guide);
      }
    }
    if (runtimeGuides.length > 0) {
      groups.push(runtimeGuides);
    }
  }
  return groups;
}

/**
 * Map of doc path → `{runtime, runtimes}`. `runtimes` lists the other quick
 * starts of the group, each with its runtime and the URL of its Markdown export.
 */
export function quickStartRuntimes(docTree, origin) {
  const map = new Map();
  for (const group of runtimeGroups(docTree)) {
    for (const node of group) {
      map.set(node.path, {
        runtime: runtimeOf(node),
        runtimes: group
          .filter(other => other !== node)
          .map(other => ({runtime: runtimeOf(other), url: `${origin}/${other.path}.md`})),
      });
    }
  }
  return map;
}

export function formatRuntimeYaml({runtime, runtimes}) {
  if (!runtime) {
    return '';
  }
  let yaml = `runtime: ${runtime}\n`;
  if (runtimes?.length) {
    yaml += 'runtimes:\n';
    yaml += runtimes
      .map(other => `  - runtime: ${other.runtime}\n    url: ${other.url}\n`)
      .join('');
  }
  return yaml;
}
