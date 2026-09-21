import {readdirSync} from 'fs';
import path from 'path';
import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {getMDXComponent} from 'sentry-docs/getMDXComponent';
import {getFileBySlugWithCache} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformCategory} from 'sentry-docs/types';

import {MigrationGuideClient} from './client';
import {compareItems, MigrationItem, PhaseId} from './constants';

const ITEMS_DIR = 'includes/migration/javascript-v11';

// Share the MDX component map across item bodies and platform pages.
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

/** Load the migration checklist for the platform or guide selected in the URL. */
export async function MigrationGuide() {
  const {rootNode, path: urlPath} = serverContext();
  const platformOrGuide = getCurrentPlatformOrGuide(rootNode, urlPath);

  // `name` is the on-disk guide directory (`nextjs`), which is what item
  // frontmatter tags against. The bare JavaScript platform has no framework, so
  // only universal items apply.
  const framework = platformOrGuide?.type === 'guide' ? platformOrGuide.name : undefined;
  const categories: PlatformCategory[] = platformOrGuide?.categories ?? [];

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
        platformCategory: data.platformCategory as PlatformCategory | 'all',
        order: data.order as number,
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

  return (
    <MigrationGuideClient
      items={items}
      bodies={rendered.map(item => ({
        id: item.id,
        body: <ItemBody key={item.id} mdxSource={item.mdxSource} />,
      }))}
      framework={framework ?? 'javascript'}
    />
  );
}
