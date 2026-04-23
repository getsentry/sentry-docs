export const SPEC_STATUSES = [
  'proposal',
  'draft',
  'candidate',
  'stable',
  'deprecated',
] as const;

export type SpecStatus = (typeof SPEC_STATUSES)[number];

export function isSpecStatus(value: unknown): value is SpecStatus {
  return typeof value === 'string' && SPEC_STATUSES.includes(value as SpecStatus);
}

export const SPEC_STATUS_BADGE: Record<SpecStatus, string> = {
  proposal: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  candidate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  stable: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  deprecated: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};
