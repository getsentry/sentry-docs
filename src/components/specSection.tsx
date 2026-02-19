import type {ReactNode} from 'react';

type SpecStatus = 'proposal' | 'draft' | 'candidate' | 'stable' | 'deprecated';

type SpecSectionProps = {
  children: ReactNode;
  id: string;
  since: string;
  status: SpecStatus;
  superseded_by?: string;
};

const STATUS_CONFIG: Record<SpecStatus, {borderColor: string; label: string}> = {
  proposal: {label: 'Proposal', borderColor: 'border-l-gray-400'},
  draft: {label: 'Draft', borderColor: 'border-l-yellow-400'},
  candidate: {label: 'Candidate', borderColor: 'border-l-blue-400'},
  stable: {label: 'Stable', borderColor: 'border-l-green-400'},
  deprecated: {label: 'Deprecated', borderColor: 'border-l-red-400'},
};

const BADGE_CONFIG: Record<SpecStatus, string> = {
  proposal: 'bg-gray-100 text-gray-700',
  draft: 'bg-yellow-100 text-yellow-800',
  candidate: 'bg-blue-100 text-blue-800',
  stable: 'bg-green-100 text-green-800',
  deprecated: 'bg-red-100 text-red-800',
};

export function SpecSection({
  id,
  status,
  since,
  superseded_by,
  children,
}: SpecSectionProps) {
  const {label, borderColor} = STATUS_CONFIG[status];
  const badgeClass = BADGE_CONFIG[status];

  return (
    <section id={id} className={`border-l-4 ${borderColor} pl-5 py-1 mb-8`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${badgeClass}`}>
          {label}
        </span>
        <span className="text-xs text-gray-500">since {since}</span>
        {superseded_by && (
          <span className="text-xs text-red-600">
            Superseded by <a href={superseded_by}>{superseded_by}</a>
          </span>
        )}
      </div>
      <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </section>
  );
}
