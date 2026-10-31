import {describe, expect, it} from 'vitest';

import {getRuntimeLinks} from './runtimeLinks';

const G = 'platforms/javascript/guides';

type Page = {children: Page[]; frontmatter: {runtime?: string}; path: string};

const page = (path: string, runtime?: string, children: Page[] = []): Page => ({
  path,
  frontmatter: runtime ? {runtime} : {},
  children,
});

const piDurable = page(`${G}/pi-durable`, 'node', [
  page(`${G}/pi-durable/cloudflare`, 'cloudflare'),
  page(`${G}/pi-durable/deno`, 'deno'),
  page(`${G}/pi-durable/bun`, 'bun'),
  page(`${G}/pi-durable/configuration`),
]);

const path = (p: string) => p.split('/');

describe('getRuntimeLinks', () => {
  it('links the guide page and its child pages with a runtime, in doc tree order', () => {
    expect(getRuntimeLinks(piDurable, path(`${G}/pi-durable`))?.map(l => l.url)).toEqual([
      `/${G}/pi-durable/`,
      `/${G}/pi-durable/cloudflare/`,
      `/${G}/pi-durable/deno/`,
      `/${G}/pi-durable/bun/`,
    ]);
  });

  it('selects the runtime of the current page', () => {
    const selected = (p: string) =>
      getRuntimeLinks(piDurable, path(p))
        ?.filter(l => l.selected)
        .map(l => l.runtime);

    expect(selected(`${G}/pi-durable`)).toEqual(['node']);
    expect(selected(`${G}/pi-durable/deno`)).toEqual(['deno']);
    expect(selected(`${G}/pi-durable/configuration/options`)).toEqual([]);
  });

  it('returns null for a guide with quick starts for fewer than two runtimes', () => {
    expect(getRuntimeLinks(page(`${G}/node`, 'node'), path(`${G}/node`))).toBeNull();
    expect(getRuntimeLinks(page(`${G}/eve`), path(`${G}/eve`))).toBeNull();
    expect(getRuntimeLinks(undefined, path('product/agents'))).toBeNull();
  });
});
