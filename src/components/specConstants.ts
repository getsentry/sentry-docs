export type SpecStatus = 'proposal' | 'draft' | 'candidate' | 'stable' | 'deprecated';

export const SPEC_STATUS_BADGE: Record<SpecStatus, string> = {
  proposal: 'bg-gray-100 text-gray-700',
  draft: 'bg-yellow-100 text-yellow-800',
  candidate: 'bg-blue-100 text-blue-800',
  stable: 'bg-green-100 text-green-800',
  deprecated: 'bg-red-100 text-red-800',
};
