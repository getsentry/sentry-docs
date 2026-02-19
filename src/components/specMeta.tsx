type SpecStatus = 'proposal' | 'draft' | 'candidate' | 'stable' | 'deprecated';

type SpecMetaProps = {
  status: SpecStatus;
  version: string;
};

const STATUS_BADGE: Record<SpecStatus, string> = {
  proposal: 'bg-gray-100 text-gray-700',
  draft: 'bg-yellow-100 text-yellow-800',
  candidate: 'bg-blue-100 text-blue-800',
  stable: 'bg-green-100 text-green-800',
  deprecated: 'bg-red-100 text-red-800',
};

export function SpecMeta({version, status}: SpecMetaProps) {
  const badgeClass = STATUS_BADGE[status];

  return (
    <div className="not-prose mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Status</span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${badgeClass}`}
          >
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Version</span>
          <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium dark:bg-gray-700">
            {version}
          </code>
          <a href="#changelog" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            (changelog)
          </a>
        </div>
      </div>
    </div>
  );
}
