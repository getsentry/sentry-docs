/**
 * Shared vocabulary for the interactive v10-to-v11 migration guide.
 *
 * These values mirror the frontmatter facets on the item files in
 * `includes/migration/javascript-v11/`, which are validated by
 * `scripts/validate-migration-items.mjs`. The two vocabularies are asserted
 * equal in `migrationGuide.spec.ts`, because a facet the validator accepts but
 * the filter panel never offers hides every item tagged with it.
 */

export const PHASES = [
  {
    id: 'prerequisites',
    title: 'Check prerequisites',
    description: 'Runtime, language and framework versions you need before upgrading.',
  },
  {
    id: 'packages',
    title: 'Update packages',
    description: 'Installs, removals and moved entry points.',
  },
  {
    id: 'code-changes',
    title: 'Make required code changes',
    description: 'Options, APIs and config that changed and need your attention.',
  },
  {
    id: 'verify',
    title: 'Verify behavior changes',
    description: 'Things that changed underneath you. Check dashboards and alerts.',
  },
  {
    id: 'cleanup',
    title: 'Optional cleanup',
    description: 'Deprecations and type tightening you can address at your own pace.',
  },
] as const;

export type PhaseId = (typeof PHASES)[number]['id'];

export const SEVERITIES = {
  'action-required': {label: 'Action required'},
  'behavior-change': {label: 'Behavior change'},
  informational: {label: 'FYI'},
} as const;

export type Severity = keyof typeof SEVERITIES;

/**
 * The one dimension the reader controls. Framework comes from the URL, and
 * everything else is either universal or better inferred than asked about.
 *
 * An earlier draft also had a "Setup" group (bundler plugin, CDN bundle, Sentry
 * CLI, Lambda layer, `@sentry/node-core`). Measured against the item
 * collection, each of those gated exactly one item on any given guide, because
 * the `frameworks` tag already did that work — so they added five checkboxes
 * for no filtering. `custom-otel` was the exception and is the only survivor:
 * it gates four substantial action-required items and is orthogonal to
 * framework in a way a URL cannot express.
 */
export const FEATURES = [
  {
    id: 'tracing',
    label: 'Tracing',
    description: 'Spans, sampling, and trace propagation.',
  },
  {
    id: 'profiling',
    label: 'Profiling',
    description: 'Trace-based or continuous profiling, in the browser or on the server.',
  },
  {id: 'logs', label: 'Logs', description: 'Logs sent through the SDK.'},
  {id: 'metrics', label: 'Metrics', description: 'Counters, gauges, and distributions.'},
  {
    id: 'ai-agents',
    label: 'AI Agents',
    description: 'Instrumentation for AI SDKs, model calls, and agents.',
  },
  {
    id: 'custom-otel',
    label: 'Your own OpenTelemetry',
    description: 'You run an OpenTelemetry setup of your own alongside Sentry.',
  },
] as const;

export type FacetId = (typeof FEATURES)[number]['id'];

/** One breaking change, as rendered by the guide. */
export interface MigrationItem {
  category: string;
  features: string[];
  id: string;
  /** Raw MDX body, used to build the copy-for-agent output. */
  markdown: string;
  /** Curated position within a phase, from the item frontmatter. */
  order: number;
  phase: PhaseId;
  severity: Severity;
  title: string;
}

/**
 * Reading order within a phase: the curated `order` from the item frontmatter,
 * and nothing else.
 *
 * Sorting by severity instead was tried and reverted. Three of the five phases
 * carry a single severity, so it only reordered two of them, and there it broke
 * deliberate sequences: an item that introduces a change (span streaming,
 * OpenTelemetry ownership) is a behavior change, so it sorted below the
 * action-required items that follow from it. Ordering is a content decision,
 * so it stays in the content.
 */
export function compareItems(a: MigrationItem, b: MigrationItem): number {
  return a.order - b.order;
}

/**
 * Whether an item survives the reader's facet selection.
 *
 * An untagged item is universal and always applies. A tagged item applies when
 * the reader selected at least one of its tags — items are tagged with what
 * they are *about*, so any overlap makes it relevant.
 *
 * Framework and platform-category filtering happens server-side, because those
 * come from the URL rather than from a checkbox.
 */
export function itemMatchesFacets(item: MigrationItem, selected: Set<string>): boolean {
  if (item.features.length === 0) {
    return true;
  }
  return item.features.some(tag => selected.has(tag));
}

/**
 * Items that must never be hidden by a facet selection.
 *
 * A guide that silently swallows a breaking change because someone left a box
 * unchecked is worse than one that shows too much, so universal
 * action-required items always render.
 */
export function isAlwaysVisible(item: MigrationItem): boolean {
  return item.severity === 'action-required' && item.features.length === 0;
}

/**
 * Whether the guide renders an item, given what the reader selected.
 *
 * This is the whole visibility rule, and the only thing the guide calls — the
 * two predicates above are its parts. Composing them here means the invariant
 * "a universal action-required item is always rendered" is testable and cannot
 * be lost by a later change to {@link itemMatchesFacets} alone.
 */
export function isItemVisible(item: MigrationItem, selected: Set<string>): boolean {
  return isAlwaysVisible(item) || itemMatchesFacets(item, selected);
}

/** This interactive v11 guide for a guide slug, or for the platform itself. */
export function migrationGuideHref(slug: string): string {
  return slug === 'javascript'
    ? '/platforms/javascript/migration/v10-to-v11/interactive/'
    : `/platforms/javascript/guides/${slug}/migration/v10-to-v11/interactive/`;
}

/**
 * Reading name for a guide slug. Slugs match their URL and read well enough for
 * guides, but the platform page has no guide slug to show — "the javascript
 * guide" names nothing the reader can go to.
 */
export function migrationGuideLabel(slug: string): string {
  return slug === 'javascript' ? 'Browser JavaScript' : slug;
}
