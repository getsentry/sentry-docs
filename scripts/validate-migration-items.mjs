/**
 * Validates the v11 migration item collection in `includes/migration/javascript-v11/`.
 *
 * Each item is a standalone MDX file with tagged frontmatter, rendered by the
 * interactive migration guide at
 * `docs/platforms/javascript/common/migration/v10-to-v11/interactive.mdx`. Because
 * the page
 * filters, counts and serializes items based on that frontmatter, a mistyped
 * facet silently drops an item from a user's guide rather than failing loudly.
 * This script is the guard against that.
 *
 * `loadItems` is called from `migrationGuide.spec.ts`, so `pnpm test` fails on
 * invalid frontmatter. Run `pnpm migration-items` for the breakdown by phase,
 * severity and category as well.
 */
import {readdirSync, readFileSync} from 'fs';
import path from 'path';

import matter from 'gray-matter';

const ITEMS_DIR = 'includes/migration/javascript-v11';
const GUIDES_DIR = 'docs/platforms/javascript/guides';

/** The change itself, stated once. Anything longer is an explanation. */
const MAX_FIRST_PARAGRAPH = 400;

export const PHASES = ['prerequisites', 'packages', 'code-changes', 'verify', 'cleanup'];
export const CATEGORIES = [
  'version-support',
  'behavior',
  'removed-api',
  'package',
  'rename',
  'type',
];
export const SEVERITIES = ['action-required', 'behavior-change', 'informational'];
export const FEATURES = [
  'tracing',
  'profiling',
  'logs',
  'metrics',
  'ai-agents',
  'custom-otel',
];
export const PLATFORM_CATEGORIES = ['browser', 'server', 'serverless', 'all'];

/** Reads and validates every item. Returns `{items, errors}`. */
export function loadItems(root = process.cwd()) {
  const dir = path.join(root, ITEMS_DIR);
  const guides = new Set(readdirSync(path.join(root, GUIDES_DIR)));
  const files = readdirSync(dir).filter(f => f.endsWith('.mdx'));

  const errors = [];
  const items = [];
  const ids = new Set();
  const orders = new Map();

  for (const file of files) {
    const {data, content} = matter(readFileSync(path.join(dir, file), 'utf8'));
    const fail = message => errors.push(`${file}: ${message}`);

    const expectedId = file.replace(/\.mdx$/, '');
    if (data.id !== expectedId) {
      fail(`id "${data.id}" does not match filename`);
    }
    if (ids.has(data.id)) {
      fail(`duplicate id "${data.id}"`);
    }
    ids.add(data.id);

    if (!data.title) {
      fail('missing title');
    }
    if (!PHASES.includes(data.phase)) {
      fail(`unknown phase "${data.phase}"`);
    }
    if (!CATEGORIES.includes(data.category)) {
      fail(`unknown category "${data.category}"`);
    }
    if (!SEVERITIES.includes(data.severity)) {
      fail(`unknown severity "${data.severity}"`);
    }
    if (!PLATFORM_CATEGORIES.includes(data.platformCategory)) {
      fail(`unknown platformCategory "${data.platformCategory}"`);
    }
    if (typeof data.order !== 'number') {
      fail('missing or non-numeric order');
    }

    if (data.frameworks !== 'all') {
      if (!Array.isArray(data.frameworks)) {
        fail('frameworks must be "all" or an array of guide slugs');
      } else {
        data.frameworks
          .filter(f => !guides.has(f))
          .forEach(f => fail(`unknown framework "${f}"`));
      }
    }
    (data.features ?? [])
      .filter(f => !FEATURES.includes(f))
      .forEach(f => fail(`unknown feature "${f}"`));

    // Items are meant to be scannable: what changed, then what to do about it.
    // These checks keep the collection from drifting back into prose.
    const body = content.trim();
    if (!body) {
      fail('empty body');
    }
    for (const heading of ['**What changed**', '**What you need to do**', '**Why**']) {
      if (body.includes(heading)) {
        fail(
          `remove the "${heading.replaceAll('*', '')}" heading, lead with the change instead`
        );
      }
    }
    if (/[\u2014\u2013]/.test(body)) {
      fail('uses an em or en dash, rewrite the sentence');
    }
    // Items are re-ordered by severity and hidden by the reader's filters, so
    // "the next three items" can point at nothing. Link the item by anchor.
    for (const positional of [
      /\b(next|previous|following|preceding)\s+(\w+\s+)?items?\b/i,
      /\bitems?\s+(that\s+)?(follows?|precedes?)\b/i,
      /\bitems?\s+(above|below)\b/i,
    ]) {
      if (positional.test(body)) {
        fail('refers to an item by position, link to its anchor instead');
      }
    }
    const firstParagraph = body.split('\n\n')[0];
    if (firstParagraph.length > MAX_FIRST_PARAGRAPH) {
      fail(
        `opening paragraph is ${firstParagraph.length} characters, keep it under ${MAX_FIRST_PARAGRAPH}`
      );
    }

    const orderKey = `${data.phase}/${data.order}`;
    if (orders.has(orderKey)) {
      fail(`duplicate order ${orderKey}, also used by ${orders.get(orderKey)}`);
    }
    orders.set(orderKey, file);

    items.push({file, ...data});
  }

  return {items, errors};
}

function main() {
  const {items, errors} = loadItems();
  const count = (list, predicate) => list.filter(predicate).length;
  const pad = (value, width) => String(value).padEnd(width);

  console.log(`${items.length} migration items\n`);

  console.log('BY PHASE');
  PHASES.forEach(p => console.log(`  ${pad(p, 16)}${count(items, i => i.phase === p)}`));

  console.log('\nBY SEVERITY');
  SEVERITIES.forEach(s =>
    console.log(`  ${pad(s, 16)}${count(items, i => i.severity === s)}`)
  );

  console.log('\nBY CATEGORY');
  CATEGORIES.forEach(c =>
    console.log(`  ${pad(c, 16)}${count(items, i => i.category === c)}`)
  );

  const unusedFeatures = FEATURES.filter(
    f => !count(items, i => (i.features ?? []).includes(f))
  );
  if (unusedFeatures.length) {
    // A facet no item carries renders a checkbox that filters nothing, which
    // reads as broken to anyone who ticks it.
    console.log('\nWARNING: facets with no items (remove them from the filter panel):');
    unusedFeatures.forEach(f => console.log(`  ${f}`));
  }

  if (errors.length) {
    console.log(`\n${errors.length} error(s):`);
    errors.forEach(e => console.log(`  ${e}`));
    process.exit(1);
  }

  console.log('\nAll items valid.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
