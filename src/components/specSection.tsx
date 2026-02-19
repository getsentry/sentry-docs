import type {ReactNode} from 'react';

import {SPEC_STATUS_BADGE,type SpecStatus} from './specConstants';

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

export function SpecSection({
  id,
  status,
  since,
  superseded_by,
  children,
}: SpecSectionProps) {
  const {label, borderColor} = STATUS_CONFIG[status];
  const badgeClass = SPEC_STATUS_BADGE[status];

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
