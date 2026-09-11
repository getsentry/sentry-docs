/** Phases and severity labels shared by the migration guide and item validator. */

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
    description: 'Check dashboards and alerts.',
  },
  {
    id: 'cleanup',
    title: 'Optional cleanup',
    description: 'Deprecations and type tightening you can address later.',
  },
] as const;

export type PhaseId = (typeof PHASES)[number]['id'];

export const SEVERITIES = {
  'action-required': {label: 'Action required'},
  'behavior-change': {label: 'Behavior change'},
  informational: {label: 'FYI'},
} as const;

export type Severity = keyof typeof SEVERITIES;

/** One breaking change, as rendered by the guide. */
export interface MigrationItem {
  category: string;
  id: string;
  /** Curated position within a phase, from the item frontmatter. */
  order: number;
  phase: PhaseId;
  severity: Severity;
  title: string;
}

/** Preserve the reading order curated in the item frontmatter. */
export function compareItems(a: MigrationItem, b: MigrationItem): number {
  return a.order - b.order;
}
