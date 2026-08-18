import {readdirSync} from 'fs';
import path from 'path';
import {getCurrentPlatformOrGuide, nodeForPath} from 'sentry-docs/docTree';
import {getMDXComponent} from 'sentry-docs/getMDXComponent';
import {getFileBySlugWithCache} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformCategory} from 'sentry-docs/types';

import {MigrationGuideClient} from './client';
import {compareItems, FEATURES, MigrationItem, PhaseId} from './constants';

const ITEMS_DIR = 'includes/migration/javascript-v11';

// Built once rather than per item body: `mdxComponents()` assembles a ~70-entry
// map, and this component renders 81 bodies on each of ~38 migration pages.
const components = mdxComponents();

// `getMDXComponent` compiles its source with `new Function`, so the same item
// body is compiled once instead of once per page it appears on. Keyed by source,
// so an edit in development produces a new entry rather than a stale component.
const componentBySource = new Map<string, ReturnType<typeof getMDXComponent>>();

function ItemBody({mdxSource}: {mdxSource: string}) {
  let MDXLayout = componentBySource.get(mdxSource);
  if (!MDXLayout) {
    MDXLayout = getMDXComponent(mdxSource);
    componentBySource.set(mdxSource, MDXLayout);
  }
  return <MDXLayout components={components} />;
}

/**
 * The interactive "Migrate from 10.x to 11.x" guide.
 *
 * Reads the item collection in `includes/migration/javascript-v11/`, drops everything that
 * cannot apply to the guide currently being rendered, and hands the rest to a
 * client shell that owns filtering and checklist state.
 *
 * The framework axis is the URL rather than a checkbox: this page lives in
 * `common/` and is rendered into every JavaScript guide, so an item tagged for
 * Next.js is simply absent from the SvelteKit page. Feature and package
 * filtering is the reader's job and happens client-side.
 */
export async function MigrationGuide() {
  const {rootNode, path: urlPath} = serverContext();
  const platformOrGuide = getCurrentPlatformOrGuide(rootNode, urlPath);

  // `name` is the on-disk guide directory (`nextjs`), which is what item
  // frontmatter tags against. The bare JavaScript platform has no framework, so
  // only universal items apply.
  const framework = platformOrGuide?.type === 'guide' ? platformOrGuide.name : undefined;
  const categories: PlatformCategory[] = platformOrGuide?.categories ?? [];

  // `platformOrGuide.title` is the abbreviated form used by the platform picker
  // (`platformTitle` in config.yml), which for this platform is just
  // "JavaScript" — a meaningless scope in a JavaScript SDK migration guide,
  // since all 81 changes are JavaScript changes. Read the platform's own
  // frontmatter title instead, which is the real scope: "Browser JavaScript".
  // Guides are unaffected; their title is already the specific one.
  const scopeNode = platformOrGuide
    ? nodeForPath(rootNode, platformOrGuide.url.split('/').filter(Boolean))
    : undefined;
  const scopeLabel =
    scopeNode?.frontmatter.title ?? platformOrGuide?.title ?? 'your setup';

  const slugs = readdirSync(path.join(process.cwd(), ITEMS_DIR))
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace(/\.mdx$/, ''));

  const docs = await Promise.all(
    slugs.map(slug => getFileBySlugWithCache(`${ITEMS_DIR}/${slug}`))
  );

  const rendered = docs
    .map(doc => {
      const data = doc.frontMatter as Record<string, any>;
      return {
        id: data.id as string,
        title: data.title as string,
        phase: data.phase as PhaseId,
        category: data.category as string,
        severity: data.severity,
        frameworks: data.frameworks as string[] | 'all',
        features: (data.features ?? []) as string[],
        platformCategory: data.platformCategory as PlatformCategory | 'all',
        order: data.order as number,
        markdown: doc.matter?.content ?? '',
        mdxSource: doc.mdxSource,
      };
    })
    .filter(item => {
      if (item.frameworks !== 'all' && !item.frameworks.includes(framework ?? '')) {
        return false;
      }
      // A guide with no declared categories (or a platform-level page) should
      // not lose content, so only filter when we actually know the categories.
      if (item.platformCategory !== 'all' && categories.length > 0) {
        return categories.includes(item.platformCategory);
      }
      return true;
    })
    .sort(compareItems);

  const items: MigrationItem[] = rendered.map(
    ({mdxSource: _mdxSource, frameworks: _frameworks, ...item}) => item
  );

  // Only offer facets that something on this page actually carries. The browser
  // SDK has never used OpenTelemetry, and v11 drops AI integrations from it, so
  // both of those checkboxes would sit on a React or Vue page filtering nothing
  // — and a control that does nothing when ticked reads as broken.
  const facets = FEATURES.filter(facet =>
    items.some(item => item.features.includes(facet.id))
  );

  return (
    <MigrationGuideClient
      items={items}
      bodies={rendered.map(item => ({
        id: item.id,
        body: <ItemBody key={item.id} mdxSource={item.mdxSource} />,
      }))}
      facets={facets}
      framework={framework ?? 'javascript'}
      frameworkLabel={scopeLabel}
      totalItems={slugs.length}
    />
  );
}
