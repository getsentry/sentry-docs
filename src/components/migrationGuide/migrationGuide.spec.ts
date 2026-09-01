import {readdirSync, readFileSync} from 'fs';
import matter from 'gray-matter';
import path from 'path';
import {describe, expect, it} from 'vitest';

// The validator is plain Node ESM, imported here so `pnpm test` runs it. Without
// this, a mistyped facet in an item file fails nothing and the item silently
// disappears from every reader's guide.
import {
  FEATURES as VALIDATOR_FEATURES,
  loadItems,
  PHASES as VALIDATOR_PHASES,
  SEVERITIES as VALIDATOR_SEVERITIES,
} from '../../../scripts/validate-migration-items.mjs';
import {
  compareItems,
  FEATURES,
  isAlwaysVisible,
  isItemVisible,
  itemMatchesFacets,
  migrationGuideHref,
  MigrationItem,
  PHASES,
  SEVERITIES,
} from './constants';
import {detect, FRAMEWORK_PACKAGES} from './detect';

function item(overrides: Partial<MigrationItem> = {}): MigrationItem {
  return {
    id: 'test-item',
    title: 'Test item',
    phase: 'code-changes',
    category: 'behavior',
    severity: 'action-required',
    features: [],
    markdown: '',
    order: 0,
    ...overrides,
  };
}

describe('itemMatchesFacets', () => {
  it('always matches an untagged item, whatever the reader selected', () => {
    expect(itemMatchesFacets(item(), new Set())).toBe(true);
    expect(itemMatchesFacets(item(), new Set(['tracing']))).toBe(true);
  });

  it('matches when the reader selected any one of the item tags', () => {
    const subject = item({features: ['tracing', 'metrics']});
    expect(itemMatchesFacets(subject, new Set(['tracing']))).toBe(true);
    expect(itemMatchesFacets(subject, new Set(['metrics']))).toBe(true);
  });

  it('does not match when the reader selected none of the item tags', () => {
    const subject = item({features: ['profiling']});
    expect(itemMatchesFacets(subject, new Set(['tracing', 'logs']))).toBe(false);
  });
});

describe('isAlwaysVisible', () => {
  it('protects universal action-required items from being filtered away', () => {
    expect(isAlwaysVisible(item())).toBe(true);
  });

  it('does not protect items that are scoped to a feature', () => {
    expect(isAlwaysVisible(item({features: ['tracing']}))).toBe(false);
    expect(isAlwaysVisible(item({features: ['custom-otel']}))).toBe(false);
  });

  it('does not protect items that need no action', () => {
    expect(isAlwaysVisible(item({severity: 'behavior-change'}))).toBe(false);
    expect(isAlwaysVisible(item({severity: 'informational'}))).toBe(false);
  });
});

describe('isItemVisible', () => {
  // This is the invariant the guide rests on: whatever the reader unticks, a
  // breaking change that applies to everybody stays on the page.
  it('renders a universal action-required item even with nothing selected', () => {
    expect(isItemVisible(item(), new Set())).toBe(true);
  });

  it('renders a universal informational item even with nothing selected', () => {
    expect(isItemVisible(item({severity: 'informational'}), new Set())).toBe(true);
  });

  it('hides a feature-scoped item the reader did not select', () => {
    expect(isItemVisible(item({features: ['profiling']}), new Set(['logs']))).toBe(false);
  });

  it('renders a feature-scoped item the reader did select', () => {
    expect(isItemVisible(item({features: ['profiling']}), new Set(['profiling']))).toBe(
      true
    );
  });
});

describe('compareItems', () => {
  it('follows the curated order, regardless of severity', () => {
    // Severity-based ordering was tried and reverted: it split items from the
    // ones that introduce them. Ordering lives in the item frontmatter.
    const sorted = [
      item({id: 'third', severity: 'action-required', order: 30}),
      item({id: 'first', severity: 'informational', order: 10}),
      item({id: 'second', severity: 'behavior-change', order: 20}),
    ].sort(compareItems);
    expect(sorted.map(i => i.id)).toEqual(['first', 'second', 'third']);
  });
});

describe('migrationGuideHref', () => {
  it('points at the guide page for a guide slug', () => {
    expect(migrationGuideHref('nextjs')).toBe(
      '/platforms/javascript/guides/nextjs/migration/v10-to-v11/interactive/'
    );
  });

  it('points at the platform page for browser JavaScript, which has no guide', () => {
    expect(migrationGuideHref('javascript')).toBe(
      '/platforms/javascript/migration/v10-to-v11/interactive/'
    );
  });
});

describe('detect: facets', () => {
  it('reads features off a Sentry.init block', () => {
    const {facets} = detect(`
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        enableLogs: true,
      });
    `);
    expect([...facets].sort()).toEqual(['logs', 'profiling', 'tracing']);
  });

  it('reads packages off a package.json dependency list', () => {
    const {facets} = detect(`
      {
        "dependencies": {
          "@sentry/nextjs": "^10.5.0",
          "@sentry/profiling-node": "^10.5.0",
          "openai": "^4.0.0"
        }
      }
    `);
    expect([...facets].sort()).toEqual(['ai-agents', 'profiling']);
  });

  it('detects a bring-your-own OpenTelemetry setup', () => {
    const {facets} = detect(`
      "@opentelemetry/sdk-trace-node": "^2.0.0",
      Sentry.init({skipOpenTelemetrySetup: true});
    `);
    expect(facets.has('custom-otel')).toBe(true);
  });

  it('ignores options that are only present as comments', () => {
    const {facets} = detect(`
      Sentry.init({
        dsn: '__DSN__',
        // profilesSampleRate: 1.0,
        /* enableLogs: true, */
        tracesSampleRate: 1.0,
      });
    `);
    expect(facets.has('tracing')).toBe(true);
    expect(facets.has('profiling')).toBe(false);
    expect(facets.has('logs')).toBe(false);
  });

  it('does not treat the // in a URL as the start of a comment', () => {
    const {facets} = detect(`
      {"repository": "https://github.com/example/app",
       "dependencies": {"@sentry/profiling-node": "^10.5.0"}}
    `);
    expect(facets.has('profiling')).toBe(true);
  });

  it('keeps reading a line after a // inside a regex literal', () => {
    // `/^\/\//` ends in two slashes that are not a comment. Treating them as one
    // would drop `enableLogs` and hide every logs breaking change.
    const {facets} = detect(
      'Sentry.init({tracePropagationTargets: [/^\\/\\//], enableLogs: true});'
    );
    expect(facets.has('logs')).toBe(true);
  });

  it('keeps reading a line after a protocol-relative URL string', () => {
    const {facets} = detect(
      'Sentry.init({tunnel: "//sentry.example.com", enableMetrics: true});'
    );
    expect(facets.has('metrics')).toBe(true);
  });

  it('returns nothing for input with no Sentry setup in it', () => {
    const {facets, signals} = detect('{"dependencies": {"lodash": "^4.0.0"}}');
    expect(facets.size).toBe(0);
    expect(signals).toEqual([]);
  });

  it('reports the literal it matched, so the reader can check the result', () => {
    const {signals} = detect('Sentry.init({tracesSampleRate: 1.0})');
    expect(signals).toEqual([{facet: 'tracing', evidence: 'tracesSampleRate'}]);
  });

  it('reports a JSON dependency key without its quotes and colon', () => {
    const {signals} = detect('{"dependencies": {"openai": "^4.0.0"}}');
    expect(signals).toEqual([{facet: 'ai-agents', evidence: 'openai'}]);
  });

  it('does not tag a bring-your-own-OpenTelemetry item as tracing', () => {
    // Setup 3 in the migration guide turns Sentry tracing off and lets
    // OpenTelemetry own spans, so these two facets are independent.
    const {facets} = detect('Sentry.init({integrations: [Sentry.otlpIntegration()]});');
    expect(facets.has('custom-otel')).toBe(true);
    expect(facets.has('tracing')).toBe(false);
  });
});

describe('detect: gaps', () => {
  it('flags a dependency list with no init block, where features hide', () => {
    expect(detect('{"dependencies": {"@sentry/nextjs": "^10.5.0"}}').gaps).toEqual({
      missingInit: true,
      missingManifest: false,
    });
  });

  it('flags an init block with no dependency list, where packages hide', () => {
    expect(detect('Sentry.init({tracesSampleRate: 1.0});').gaps).toEqual({
      missingInit: false,
      missingManifest: true,
    });
  });

  it('flags nothing when both halves are present', () => {
    expect(
      detect(`
        {"dependencies": {"@sentry/nextjs": "^10.5.0"}}
        Sentry.init({tracesSampleRate: 1.0});
      `).gaps
    ).toEqual({missingInit: false, missingManifest: false});
  });

  it('does not count a commented-out init call as present', () => {
    expect(detect('// Sentry.init({});').gaps.missingInit).toBe(true);
  });

  it('counts a named init import as an init block', () => {
    // Telling someone to paste the init block they just pasted reads as broken.
    expect(
      detect('import {init} from "@sentry/react"; init({tracesSampleRate: 1});').gaps
        .missingInit
    ).toBe(false);
  });

  it('counts a framework wrapper config as an init block', () => {
    expect(
      detect('sentry({dsn: "https://examplePublicKey@o0.ingest.sentry.io/0"})').gaps
        .missingInit
    ).toBe(false);
  });
});

describe('detect: framework', () => {
  it('identifies the framework SDK from a dependency list', () => {
    expect(detect('"@sentry/sveltekit": "^10.0.0"').framework?.primary).toBe('sveltekit');
    expect(detect('"@sentry/cloudflare": "^10.0.0"').framework?.primary).toBe(
      'cloudflare'
    );
  });

  it('prefers the framework SDK over the generic SDKs it depends on', () => {
    // A flattened dependency list contains both; `@sentry/nextjs` is the answer.
    expect(
      detect(`
        "@sentry/nextjs": "^10.5.0",
        "@sentry/react": "^10.5.0",
        "@sentry/node": "^10.5.0"
      `).framework?.primary
    ).toBe('nextjs');
  });

  it('returns undefined when no Sentry SDK is present', () => {
    expect(detect('{"dependencies": {"react": "^19.0.0"}}').framework).toBeUndefined();
  });

  it('treats @sentry/node as belonging to every guide it backs', () => {
    // An Express reader on the Express guide must not be told to leave it.
    const {framework: match} = detect('"@sentry/node": "^10.5.0"');
    expect(match?.guides).toContain('express');
    expect(match?.guides).toContain('fastify');
    expect(match?.guides).toContain('koa');
    expect(match?.primary).toBe('node');
  });

  it('maps the bare browser SDK to the platform page', () => {
    expect(detect('"@sentry/browser": "^10.5.0"').framework?.primary).toBe('javascript');
  });
});

describe('facet vocabulary', () => {
  it('has no duplicate ids', () => {
    const ids = FEATURES.map(f => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('describes every facet, since each one renders a tooltip', () => {
    expect(FEATURES.every(f => f.description.length > 0)).toBe(true);
  });

  it('gives every facet a label, since ids surface in the agent prompt', () => {
    expect(
      FEATURES.every(f => f.label.length > 0 && String(f.label) !== String(f.id))
    ).toBe(true);
  });

  // The filter panel and the frontmatter validator carry the vocabulary
  // separately. If they drift, the validator accepts a facet that gets no
  // checkbox, and every item tagged with it is hidden from every reader.
  it('matches the vocabulary the item validator enforces', () => {
    expect(FEATURES.map(f => f.id)).toEqual(VALIDATOR_FEATURES);
    expect(PHASES.map(p => p.id)).toEqual(VALIDATOR_PHASES);
    expect(Object.keys(SEVERITIES)).toEqual(VALIDATOR_SEVERITIES);
  });
});

describe('migration item collection', () => {
  it('has valid frontmatter on every item', () => {
    const {items, errors} = loadItems();
    expect(errors).toEqual([]);
    expect(items.length).toBeGreaterThan(0);
  });

  it('has an item for every facet the filter panel offers', () => {
    // A checkbox that filters nothing reads as broken to anyone who ticks it.
    const {items} = loadItems() as {items: Array<{features?: string[]}>};
    const tagged = new Set(items.flatMap(i => i.features ?? []));
    expect(FEATURES.map(f => f.id).filter(id => !tagged.has(id))).toEqual([]);
  });
});

describe('framework package mapping', () => {
  // `detectFramework` tells readers they are on the wrong page. Guides sharing
  // an SDK (`@sentry/node` backs seven of them) must all be listed, or a reader
  // on the right page is sent away from it.
  const guidesDir = path.join(process.cwd(), 'docs/platforms/javascript/guides');

  const guidesBySdk = new Map<string, string[]>();
  for (const guide of readdirSync(guidesDir)) {
    let source: string;
    try {
      source = readFileSync(path.join(guidesDir, guide, 'index.mdx'), 'utf8');
    } catch {
      continue; // Not a guide directory with a landing page.
    }
    const sdk = matter(source).data.sdk;
    if (typeof sdk === 'string') {
      guidesBySdk.set(sdk, [...(guidesBySdk.get(sdk) ?? []), guide]);
    }
  }

  it.each(FRAMEWORK_PACKAGES.map(entry => [entry.pkg, entry] as const))(
    'lists every guide built on %s',
    (pkg, entry) => {
      const expected = guidesBySdk.get(
        `sentry.javascript.${pkg.replace('@sentry/', '')}`
      );
      if (!expected) {
        // `@sentry/browser` is the platform itself rather than a guide.
        expect(entry.guides).toEqual(['javascript']);
        return;
      }
      expect([...entry.guides].sort()).toEqual([...expected].sort());
    }
  );

  it('names a primary guide that is one of the guides it lists', () => {
    for (const {guides} of FRAMEWORK_PACKAGES) {
      expect(guides.length).toBeGreaterThan(0);
    }
  });
});
