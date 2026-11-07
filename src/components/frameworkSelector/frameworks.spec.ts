import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

import matter from 'gray-matter';
import {describe, expect, it} from 'vitest';

import {getRuntimeLinks} from '../runtimeLinks';
import {Runtime, RUNTIMES} from './frameworks';

const GUIDES_DIR = 'docs/platforms/javascript/guides';

const linkedUrls = (runtime: Runtime) =>
  [...(runtime.frameworkGuides ?? []), ...(runtime.agentGuides ?? [])].map(g => g.url);

const pageExists = (url: string) => {
  const file = join('docs', url.replace(/\/$/, ''));
  return existsSync(`${file}.mdx`) || existsSync(join(file, 'index.mdx'));
};

/** The index page of a guide and its child pages, with their frontmatter. */
const guidePages = (guide: string) => {
  const dir = join(GUIDES_DIR, guide);
  const path = `platforms/javascript/guides/${guide}`;
  const frontmatter = (file: string) =>
    matter(readFileSync(join(dir, file), 'utf8')).data;
  const children = readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const file = entry.isDirectory() ? join(entry.name, 'index.mdx') : entry.name;
    if (!file.endsWith('.mdx') || file === 'index.mdx' || !existsSync(join(dir, file))) {
      return [];
    }
    const name = entry.isDirectory() ? entry.name : entry.name.replace(/\.mdx$/, '');
    return [{path: `${path}/${name}`, frontmatter: frontmatter(file)}];
  });
  return {path, frontmatter: frontmatter('index.mdx'), children};
};

describe('RUNTIMES', () => {
  it.each(Object.entries(RUNTIMES))('%s links only to existing pages', (_, runtime) => {
    expect(linkedUrls(runtime).filter(url => !pageExists(url))).toEqual([]);
  });

  it('links every quick start of a guide with quick starts for more than one runtime', () => {
    const guides = readdirSync(GUIDES_DIR).filter(guide =>
      existsSync(join(GUIDES_DIR, guide, 'index.mdx'))
    );
    const missing = guides.flatMap(guide =>
      (getRuntimeLinks(guidePages(guide), []) ?? [])
        .filter(
          link =>
            link.runtime in RUNTIMES &&
            !linkedUrls(RUNTIMES[link.runtime]).includes(link.url)
        )
        .map(link => link.url)
    );
    expect(missing).toEqual([]);
  });
});
