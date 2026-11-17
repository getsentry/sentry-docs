import {describe, expect, it} from 'vitest';

import {getQuickStartTitle, getRuntimeGroup, getRuntimeLinks} from './runtimeLinks';

const G = 'platforms/javascript/guides';

type Page = {
  children: Page[];
  frontmatter: {runtime?: string};
  path: string;
  parent?: Page;
};

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

describe('getQuickStartTitle', () => {
  it('names the runtime of the guide page if the guide has quick starts for more runtimes', () => {
    expect(getQuickStartTitle(piDurable)).toBe('Quick Start (Node.js)');
  });

  it('returns "Quick Start" for a guide with quick starts for fewer than two runtimes', () => {
    expect(getQuickStartTitle(page(`${G}/node`, 'node'))).toBe('Quick Start');
    expect(getQuickStartTitle(page(`${G}/eve`))).toBe('Quick Start');
    expect(getQuickStartTitle(undefined)).toBe('Quick Start');
  });

  it('returns "Quick Start" if only the child pages set a runtime', () => {
    const hono = page(`${G}/hono`, undefined, [
      page(`${G}/hono/cloudflare`, 'cloudflare'),
      page(`${G}/hono/bun`, 'bun'),
    ]);
    expect(getQuickStartTitle(hono)).toBe('Quick Start');
  });
});

describe('getRuntimeGroup', () => {
  const manualSetup = page(`${G}/react-router/manual-setup`, 'node', [
    page(`${G}/react-router/manual-setup/cloudflare`, 'cloudflare'),
    page(`${G}/react-router/manual-setup/bun`, 'bun'),
  ]);
  const reactRouter = page(`${G}/react-router`, undefined, [manualSetup]);
  manualSetup.parent = reactRouter;
  manualSetup.children.forEach(child => {
    child.parent = manualSetup;
  });

  it('returns the page if one of its child pages sets a runtime', () => {
    expect(getRuntimeGroup(manualSetup)).toBe(manualSetup);
    expect(getRuntimeGroup(piDurable)).toBe(piDurable);
  });

  it('returns the parent of a page for one runtime', () => {
    expect(getRuntimeGroup(manualSetup.children[1])).toBe(manualSetup);
  });

  it('links the manual setups for each runtime', () => {
    expect(
      getRuntimeLinks(
        getRuntimeGroup(manualSetup.children[0]),
        path(`${G}/react-router/manual-setup/cloudflare`)
      )?.map(l => [l.title, l.selected])
    ).toEqual([
      ['Node.js', false],
      ['Cloudflare', true],
      ['Bun', false],
    ]);
  });
});
